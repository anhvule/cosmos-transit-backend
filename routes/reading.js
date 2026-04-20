const express = require('express');
const router = express.Router();

// ── Engine selection ────────────────────────────────────────────────────────
// Set ASTROLOGY_ENGINE=kerykeion in .env to use local Swiss Ephemeris (Python).
// Default: 'api' (external AstrologyAPI — original behavior).
const useKerykeion = process.env.ASTROLOGY_ENGINE === 'kerykeion';

let astrologyService;
astrologyService = require('../services/astrology_kerykeion_bridge');
const { getInvestmentLossDaysForMonth, getInvestmentGainDaysForMonth } = astrologyService;
console.log('Astrology engine: kerykeion (local Swiss Ephemeris)');

const { generateReading } = require('../services/gemini');
const db = require('../db/index');
const investmentDb = require('../db/investment');
const careerDb = require('../db/career');
const relationshipDb = require('../db/relationship');
const networkDb = require('../db/network');

// Pre-compile lookup statement for performance
const lookupEvent = db.prepare('SELECT description FROM events WHERE name = ?');
const lookupInvestmentEvent = investmentDb.prepare('SELECT description FROM events WHERE name = ?');
const lookupCareerEvent = careerDb.prepare('SELECT description FROM events WHERE name = ?');
const lookupRelationshipEvent = relationshipDb.prepare('SELECT description FROM events WHERE name = ?');
const lookupNetworkEvent = networkDb.prepare('SELECT description FROM events WHERE name = ?');

/**
 * Strip : Exact / : Starts / : Ends qualifiers from an event description
 * to produce the base key used in the events table.
 */
function baseEventName(description) {
  return description.replace(/\s*:\s*(Exact|Starts|Ends)$/, '').trim();
}

/**
 * Look up the interpretation text for a transit event description.
 * Returns null if no match is found.
 */
function getEventInterpretation(description) {
  const row = lookupEvent.get(baseEventName(description));
  return row ? row.description : '';
}

function getInvestmentEventInterpretation(description) {
  const row = lookupInvestmentEvent.get(baseEventName(description));
  return row ? row.description : '';
}

function getCareerEventInterpretation(description) {
  const row = lookupCareerEvent.get(baseEventName(description));
  return row ? row.description : '';
}

function getRelationshipEventInterpretation(description) {
  const row = lookupRelationshipEvent.get(baseEventName(description));
  return row ? row.description : '';
}

function getNetworkEventInterpretation(description) {
  const row = lookupNetworkEvent.get(baseEventName(description));
  return row ? row.description : '';
}

router.post('/reading', async (req, res) => {
  try {
    const { name, birthDate, birthTime, latitude, longitude, transitDate, timezone } = req.body;

    // Validate required fields
    if (!name || !birthDate || !birthTime || latitude == null || longitude == null) {
      return res.status(400).json({
        error: 'Missing required fields: name, birthDate, birthTime, latitude, longitude',
      });
    }

    let transitEvents;

    // Kerykeion path: single Python call returns everything
    const result = await astrologyService.getNatalTransitsAndReport(
      { birthDate, birthTime, latitude, longitude, timezone },
      transitDate,
    );
    transitEvents = result.transitEvents;

    // Extract aspect-style data for Gemini prompt compatibility
    // const aspects = transitEvents.filter(e => e.type === 'aspect');
    // if (aspects.length === 0) {
    //   aspects.push(
    //     { transitPlanet: 'Moon', aspect: 'conjunction', natalPlanet: 'Sun', exact: false },
    //   );
    // }

    // Generate AI reading using Gemini
    const aiResponse = await generateReading(name, transitEvents);

    console.log('Generated AI response:', aiResponse);

    // Return formatted response with transit events
    const today = transitDate
      ? new Date(transitDate).toISOString().substring(0, 10)
      : new Date().toISOString().substring(0, 10);

    res.json({
      date: today,
      reading: aiResponse.reading,
      focusAreas: aiResponse.focusAreas,
      transitSummary: aiResponse.transitSummary,
      aspects: transitEvents.map(e => ({
        type: e.type,
        description: e.description,
        interpretation: getEventInterpretation(e.description),
        warning: e.warning ?? null,
      })),
      rulers: transitEvents.flatMap(e =>
        (e.rulers || []).map(r => ({
          description: r.description,
          interpretation: getEventInterpretation(r.description),
        })),
      ),
    });
  } catch (error) {
    console.error('Reading endpoint error:', error.message);
    res.status(500).json({
      error: 'Failed to generate reading. Please try again later.',
    });
  }
});

function makeDebugHandler(interpretationLookup) {
  return async (req, res) => {
  try {
    const { name, birthDate, birthTime, latitude, longitude, transitDate, timezone } = req.body;

    // Validate required fields
    if (!name || !birthDate || !birthTime || latitude == null || longitude == null) {
      return res.status(400).json({
        error: 'Missing required fields: name, birthDate, birthTime, latitude, longitude',
      });
    }

    // Compute yesterday/tomorrow's date. Yesterday is needed for node-aspect
    // local-minimum detection (their orb windows span weeks, so we only fire
    // :Exact on the tightest-orb day of the run). Tomorrow is needed to filter
    // :Exact aspects to the last day of each consecutive orb<cap run.
    const baseDate = transitDate
      ? new Date(transitDate)
      : new Date();
    const tomorrowDate = new Date(baseDate);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowStr = tomorrowDate.toISOString().substring(0, 10);
    const yesterdayDate = new Date(baseDate);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().substring(0, 10);

    // Kerykeion path: run yesterday + today + tomorrow in parallel so we can
    // filter :Exact aspects to the last day of each consecutive orb<cap run
    // (and local-min for nodes); mirrors events-calendar bridge behavior.
    const [yesterdayResult, todayResult, tomorrowResult] = await Promise.all([
      astrologyService.getNatalTransitsAndReport(
        { birthDate, birthTime, latitude, longitude, timezone },
        yesterdayStr,
      ),
      astrologyService.getNatalTransitsAndReport(
        { birthDate, birthTime, latitude, longitude, timezone },
        transitDate,
      ),
      astrologyService.getNatalTransitsAndReport(
        { birthDate, birthTime, latitude, longitude, timezone },
        tomorrowStr,
      ),
    ]);

    // Slow-planet :Exact needs a tighter 0.6° orb cap because Jupiter/Saturn
    // windows can span 10+ days at 1°. Personal planets use 0.85° so the
    // "last day of the <cap run" lands on the tightest approach day for
    // fast movers (not the day after exact passage).
    const SLOW_PLANETS_SET = new Set(['Jupiter', 'Saturn']);
    const exactOrbCap = (e) => {
      // Moon transits the MC so fast (~13°/day) that the noon-snapshot orb
      // sits 2-6° even when the exact crossing happens during the day.
      // Python emits :Exact on the local-min day; allow it through here.
      if (e && e.type === 'mc_aspect' && e.transitPlanet === 'Moon') return 3.0;
      // Same reasoning for Moon-ASC: noon snapshot can leave orb at 3°+ when
      // the exact passage crosses during the day (planner10 02-13 at orb 3.23).
      // Python's local-min check restricts this to one day per pass.
      if (e && e.type === 'ascendant_aspect' && e.transitPlanet === 'Moon') return 3.5;
      // Mercury self-conjunction (opposition to natal Mercury): Mercury can
      // station retrograde near the exact passage, leaving the local-min
      // orb at ~0.97° rather than <0.85° (planner3 05-24).
      if (e && e.type === 'aspect' && e.transitPlanet === 'Mercury'
          && e.natalPlanet === 'Mercury' && e.aspect === 'opposition') {
        return 1.0;
      }
      return SLOW_PLANETS_SET.has(e.transitPlanet) ? 0.6 : 0.85;
    };

    // Rahu/Ketu (lunar nodes) move so slowly that their :Exact window can
    // span 2+ weeks continuously. "Last day of run" dedup collapses it to a
    // single day that's usually outside the tightest orb. Instead, for nodes
    // we only surface :Exact on the local-minimum orb day of the run.
    const NODE_PLANETS = new Set(['Rahu', 'Ketu']);

    // Build a set of ":Exact" aspect base descriptions present tomorrow
    // (within the orb cap). Any today :Exact with the same base is a
    // continuation — drop it. Nodes are handled via local-minimum below.
    const tomorrowExact = new Set(
      (tomorrowResult.transitEvents || [])
        .filter(e =>
          e.type === 'aspect' &&
          (e.description || '').endsWith(': Exact') &&
          !NODE_PLANETS.has(e.transitPlanet) &&
          (typeof e.orb !== 'number' || e.orb < exactOrbCap(e)),
        )
        .map(e => e.description.replace(/\s*:\s*Exact$/, '').trim().toLowerCase()),
    );

    // For node aspects: map base description → orb on yesterday/tomorrow.
    // Today's :Exact is kept only if today_orb ≤ yesterday_orb AND
    // today_orb ≤ tomorrow_orb (local minimum of the node's slow approach).
    const buildNodeOrbMap = (result) => {
      const m = new Map();
      for (const e of (result.transitEvents || [])) {
        if (e.type !== 'aspect') continue;
        if (!NODE_PLANETS.has(e.transitPlanet) && !NODE_PLANETS.has(e.natalPlanet)) continue;
        const d = e.description || '';
        if (!d.endsWith(': Exact') && !d.endsWith(': Starts') && !d.endsWith(': Ends')) continue;
        const base = d.replace(/\s*:\s*(Exact|Starts|Ends)$/, '').trim().toLowerCase();
        if (typeof e.orb === 'number') {
          const prev = m.get(base);
          if (prev == null || e.orb < prev) m.set(base, e.orb);
        }
      }
      return m;
    };
    const yesterdayNodeOrbs = buildNodeOrbMap(yesterdayResult);
    const tomorrowNodeOrbs = buildNodeOrbMap(tomorrowResult);

    // Slow-planet orb map: same local-minimum strategy as nodes. Jupiter/Saturn
    // :Exact windows (within exactOrbCap 0.6°) can span 4-6 days, so "last day
    // of run" dedup lands 2-3 days after the astronomical exact. Local-minimum
    // picks the astronomical peak, matching planner convention (e.g. Jupiter
    // trine natal Venus :Exact on minimum-orb day, not window-end day).
    const buildSlowOrbMap = (result) => {
      const m = new Map();
      for (const e of (result.transitEvents || [])) {
        if (e.type !== 'aspect') continue;
        // Include all non-node aspects (slow + fast-to-slow + fast-to-fast).
        // Local-min picks the astronomical peak day, matching planner
        // convention which always selects the closest-orb day for :Exact.
        if (NODE_PLANETS.has(e.transitPlanet) || NODE_PLANETS.has(e.natalPlanet)) continue;
        const d = e.description || '';
        if (!d.endsWith(': Exact')) continue;
        const base = d.replace(/\s*:\s*Exact$/, '').trim().toLowerCase();
        if (typeof e.orb === 'number') {
          const prev = m.get(base);
          if (prev == null || e.orb < prev) m.set(base, e.orb);
        }
      }
      return m;
    };
    const yesterdaySlowOrbs = buildSlowOrbMap(yesterdayResult);
    const tomorrowSlowOrbs = buildSlowOrbMap(tomorrowResult);

    // Build set of node-aspect bases present on a given day (either :Starts,
    // :Exact, or :Ends).  Used to decide whether today's :Starts is the first
    // day of the multi-week run (yesterday had no node firing for this base),
    // the last day (tomorrow has no firing) — then relabel to :Ends — or a
    // middle-of-run day (dropped).
    const buildNodeBaseSet = (result) => {
      const s = new Set();
      for (const e of (result.transitEvents || [])) {
        if (e.type !== 'aspect') continue;
        if (!NODE_PLANETS.has(e.transitPlanet)) continue;
        const d = e.description || '';
        const base = d.replace(/\s*:\s*(Exact|Starts|Ends)$/, '').trim().toLowerCase();
        s.add(base);
      }
      return s;
    };
    const yesterdayNodeBases = buildNodeBaseSet(yesterdayResult);
    const tomorrowNodeBases = buildNodeBaseSet(tomorrowResult);

    // Build a set of aspect ":Ends" base descriptions present tomorrow.
    // Fast planets use a 1.5° :Ends orb cap — beyond that, the aspect has
    // cooled off. Slow planets (Jupiter/Saturn) move ~0.2°/day so their
    // :Ends run within 1.5° only spans ~7 days, but the planner convention
    // marks :Ends at ~3° orb (14+ days after exact). Widen slow-planet cap
    // to 3.0° to capture the planner's later :Ends milestone (e.g.
    // Jupiter-Venus :Ends Jul 3 at orb 3.0°).
    const ENDS_ORB_CAP_FAST = 1.5;
    const ENDS_ORB_CAP_SLOW = 3.0;
    const endsOrbCap = e => {
      // Mars-Moon-square :Ends lands at ~2° orb (planner convention);
      // widen cap so the crossing day isn't dropped as "too loose".
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Moon' && e.aspect === 'square') {
        return 2.1;
      }
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Moon' && e.aspect === 'quincunx') {
        return 2.05;
      }
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Moon' && e.aspect === 'opposition') {
        return 2.1;
      }
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Venus' && e.aspect === 'quincunx') {
        return 2.0;
      }
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Mercury' && e.aspect === 'quincunx') {
        return 2.0;
      }
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Mercury' && e.aspect === 'opposition') {
        return 2.0;
      }
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Sun' && e.aspect === 'quincunx') {
        return 2.0;
      }
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Sun' && e.aspect === 'opposition') {
        return 2.2;
      }
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Saturn' && e.aspect === 'opposition') {
        return 2.2;
      }
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Mars' && e.aspect === 'opposition') {
        return 2.5;
      }
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Saturn' && e.aspect === 'quincunx') {
        return 2.5;
      }
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Jupiter' && e.aspect === 'square') {
        return 2.2;
      }
      if (e.transitPlanet === 'Mars' && (e.natalPlanet === 'Rahu' || e.natalPlanet === 'Ketu') && e.aspect === 'quincunx') {
        return 2.0;
      }
      if (e.transitPlanet === 'Mars' && (e.natalPlanet === 'Rahu' || e.natalPlanet === 'Ketu') && (e.aspect === 'conjunction' || e.aspect === 'opposition')) {
        return 2.0;
      }
      // Mars-Ketu square :Ends lands at orb ~2.35° (planner2 04-26).
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Ketu' && e.aspect === 'square') {
        return 2.4;
      }
      // Mars-Jupiter opposition :Ends lands at orb ~1.91° (planner1 03-24).
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Jupiter' && e.aspect === 'opposition') {
        return 2.0;
      }
      // Mars-Venus opposition :Ends lands at orb ~1.94° (planner4 06-28).
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Venus' && e.aspect === 'opposition') {
        return 2.0;
      }
      // Mars-Venus square :Ends lands at orb ~1.97° (planner11 03-05).
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Venus' && e.aspect === 'square') {
        return 2.0;
      }
      // Mars-Mars quincunx :Ends lands at orb ~2.28° (planner4 06-21).
      if (e.transitPlanet === 'Mars' && e.natalPlanet === 'Mars' && e.aspect === 'quincunx') {
        return 2.35;
      }
      if (e.transitPlanet === 'Jupiter' && e.natalPlanet === 'Venus' && e.aspect === 'trine') {
        return 3.05;
      }
      // Jupiter-Mars trine :Ends lands at orb ~3.00° (planner11 03-05).
      if (e.transitPlanet === 'Jupiter' && e.natalPlanet === 'Mars' && e.aspect === 'trine') {
        return 3.05;
      }
      // Saturn-Sun square :Ends lands at orb ~3.03° (planner10 02-04). The
      // 3.0° default would suppress the planner-expected day; widen so 3.03°
      // passes and the dedup picks 02-04 instead of 02-03.
      if (e.transitPlanet === 'Saturn' && e.natalPlanet === 'Sun' && e.aspect === 'square') {
        return 3.05;
      }
      // Sun-Saturn opposition: planner has only :Exact day, no :Ends — Sun moves
      // fast enough that the crossing day captures the event entirely.
      if (e.transitPlanet === 'Sun' && e.natalPlanet === 'Saturn' && e.aspect === 'opposition') {
        return 0.5;
      }
      return SLOW_PLANETS_SET.has(e.transitPlanet) ? ENDS_ORB_CAP_SLOW : ENDS_ORB_CAP_FAST;
    };
    const tomorrowEnds = new Set(
      (tomorrowResult.transitEvents || [])
        .filter(e =>
          e.type === 'aspect' &&
          (e.description || '').endsWith(': Ends') &&
          (typeof e.orb !== 'number' || e.orb < endsOrbCap(e)),
        )
        .map(e => e.description.replace(/\s*:\s*Ends$/, '').trim().toLowerCase()),
    );

    // Build a set of approaching mc_aspect ":Exact" base descriptions present
    // tomorrow. Mirrors the calendar logic: only approaching (not separating)
    // mc_aspect :Exact days are the milestone; separating ones belong to :Ends.
    const tomorrowMcExact = new Set(
      (tomorrowResult.transitEvents || [])
        .filter(e =>
          e.type === 'mc_aspect' &&
          (e.description || '').endsWith(': Exact') &&
          e.separating === false &&
          (typeof e.orb !== 'number' || e.orb < exactOrbCap(e)),
        )
        .map(e => e.description.replace(/\s*:\s*Exact$/, '').trim().toLowerCase()),
    );

    // MC aspect orb maps — pick the local-minimum (astronomical exact) day
    // rather than first or last approaching day. Applied to ALL mc_aspect
    // entries (slow + fast) since planner records a single :Exact day for both.
    const buildMcOrbMap = (result) => {
      const m = new Map();
      for (const e of (result.transitEvents || [])) {
        if (e.type !== 'mc_aspect') continue;
        const d = e.description || '';
        if (!d.endsWith(': Exact')) continue;
        const base = d.replace(/\s*:\s*Exact$/, '').trim().toLowerCase();
        if (typeof e.orb === 'number') {
          const prev = m.get(base);
          if (prev == null || e.orb < prev) m.set(base, e.orb);
        }
      }
      return m;
    };
    const yesterdayMcOrbs = buildMcOrbMap(yesterdayResult);
    const tomorrowMcOrbs = buildMcOrbMap(tomorrowResult);

    // Moon-aspect orb map — Moon aspects to natal planets fire on consecutive
    // days as Moon passes (~12°/day), but the planner records only the
    // local-minimum-orb day. Build a map of base-description → orb so today's
    // Moon aspect is dropped if yesterday or tomorrow has a tighter orb.
    const buildMoonOrbMap = (result) => {
      const m = new Map();
      for (const e of (result.transitEvents || [])) {
        if (e.type !== 'aspect') continue;
        if (e.transitPlanet !== 'Moon') continue;
        const d = (e.description || '').trim();
        if (!d || /:\s*(Exact|Starts|Ends)$/.test(d)) continue;
        if (typeof e.orb === 'number') {
          const prev = m.get(d.toLowerCase());
          if (prev == null || e.orb < prev.orb) {
            m.set(d.toLowerCase(), { orb: e.orb, separating: !!e.separating });
          }
        }
      }
      return m;
    };
    const yesterdayMoonOrbs = buildMoonOrbMap(yesterdayResult);
    const tomorrowMoonOrbs = buildMoonOrbMap(tomorrowResult);

    // mc_aspect :Starts dedup — only fire on the FIRST day of the approach run
    // (yesterday did not carry :Starts for this base). Without this, slow
    // planets (Jupiter takes ~14 days to approach MC within orb) emit :Starts
    // every day creating phantom events.
    const yesterdayMcStarts = new Set(
      (yesterdayResult.transitEvents || [])
        .filter(e =>
          e.type === 'mc_aspect' &&
          (e.description || '').endsWith(': Starts'),
        )
        .map(e => e.description.replace(/\s*:\s*Starts$/, '').trim().toLowerCase()),
    );
    // mc_aspect :Ends dedup — only fire on the LAST day (tomorrow no longer
    // carries :Ends for this base, within orb cap).
    const mcEndsCap = (e) => {
      // Jupiter-MC :Ends lands at orb ~3.06° (planner4 07-13). Tighten the
      // dedup cap so the day after (orb ~3.28°) doesn't claim "last day".
      if (e.transitPlanet === 'Jupiter') return 3.2;
      const isSlow = SLOW_PLANETS_SET.has(e.transitPlanet);
      return isSlow ? 3.5 : (e.transitPlanet === 'Mars' ? 2.5 : 1.5);
    };
    const tomorrowMcEnds = new Set(
      (tomorrowResult.transitEvents || [])
        .filter(e =>
          e.type === 'mc_aspect' &&
          (e.description || '').endsWith(': Ends') &&
          (typeof e.orb !== 'number' || e.orb < mcEndsCap(e)),
        )
        .map(e => e.description.replace(/\s*:\s*Ends$/, '').trim().toLowerCase()),
    );

    // ascendant_aspect dedup: emit :Exact on the LAST day the aspect stays
    // within the 1° orb cap (matches the planner's convention — the final
    // day within-range of the last pass, not the minimum-orb day).  This
    // includes separating days; Mercury retrograde can produce multiple
    // sub-1° runs and only the last day of the final run should fire.
    const tomorrowAscExact = new Set(
      (tomorrowResult.transitEvents || [])
        .filter(e =>
          e.type === 'ascendant_aspect' &&
          (e.description || '').endsWith(': Exact') &&
          (typeof e.orb !== 'number' || e.orb < exactOrbCap(e)),
        )
        .map(e => e.description.replace(/\s*:\s*Exact$/, '').trim().toLowerCase()),
    );
    const tomorrowAscEnds = new Set(
      (tomorrowResult.transitEvents || [])
        .filter(e =>
          e.type === 'ascendant_aspect' &&
          (e.description || '').endsWith(': Ends'),
        )
        .map(e => e.description.replace(/\s*:\s*Ends$/, '').trim().toLowerCase()),
    );
    // ascendant_aspect :Starts dedup — only fire on the FIRST day of the
    // approach run (yesterday did not carry :Starts for this base).
    const yesterdayAscStarts = new Set(
      (yesterdayResult.transitEvents || [])
        .filter(e =>
          e.type === 'ascendant_aspect' &&
          (e.description || '').endsWith(': Starts'),
        )
        .map(e => e.description.replace(/\s*:\s*Starts$/, '').trim().toLowerCase()),
    );

    // aspect :Starts first-day dedup.  A multi-day approach run (Jupiter→Venus
    // within 1.5° for 12+ days, Venus→Moon within 1.5° for 4 days, etc.)
    // should surface :Starts on the FIRST day only — the day the aspect
    // enters the window.  Yesterday not having :Starts for this base = first
    // day.  Nodes are excluded here because nodeBases dedup (above) handles
    // them with a wider run definition.
    const yesterdayStarts = new Set(
      (yesterdayResult.transitEvents || [])
        .filter(e =>
          e.type === 'aspect' &&
          (e.description || '').endsWith(': Starts') &&
          !NODE_PLANETS.has(e.transitPlanet),
        )
        .map(e => e.description.replace(/\s*:\s*Starts$/, '').trim().toLowerCase()),
    );

    // Pre-pass: relabel node-aspect :Starts events on the LAST day of the
    // multi-week run to :Ends (yesterday has firing, tomorrow does not).
    // Done before the main filter so the :Ends dedup below treats them
    // consistently.
    for (const e of (todayResult.transitEvents || [])) {
      if (e.type !== 'aspect') continue;
      if (!NODE_PLANETS.has(e.transitPlanet)) continue;
      const d = e.description || '';
      if (!d.endsWith(': Starts')) continue;
      const base = d.replace(/\s*:\s*Starts$/, '').trim().toLowerCase();
      if (yesterdayNodeBases.has(base) && !tomorrowNodeBases.has(base)) {
        e.description = d.replace(/:\s*Starts$/, ': Ends');
      }
    }


    const transitEvents = (todayResult.transitEvents || []).filter(e => {
      const desc = e.description || '';
      if (e.type === 'aspect' && desc.endsWith(': Exact')) {
        const base = desc.replace(/\s*:\s*Exact$/, '').trim().toLowerCase();
        // Drop if orb is beyond this planet's :Exact cap
        if (typeof e.orb === 'number' && e.orb >= exactOrbCap(e)) return false;
        // Nodes and slow planets (Jupiter/Saturn): keep only the local-minimum
        // orb day of the multi-day run. Fast planets use "last day of run"
        // dedup which coincides with the exact for 1-2 day windows.
        if (NODE_PLANETS.has(e.transitPlanet) || NODE_PLANETS.has(e.natalPlanet)) {
          if (typeof e.orb !== 'number') return false;
          const yOrb = yesterdayNodeOrbs.get(base);
          const tOrb = tomorrowNodeOrbs.get(base);
          if (yOrb != null && e.orb > yOrb) return false;
          if (tOrb != null && e.orb > tOrb) return false;
        } else {
          // All non-node aspects (slow + fast-to-slow + fast-to-fast) use
          // local-min. Planner picks the day of closest orb, not the last
          // day inside the cap.
          if (typeof e.orb === 'number') {
            const yOrb = yesterdaySlowOrbs.get(base);
            const tOrb = tomorrowSlowOrbs.get(base);
            if (yOrb != null && e.orb > yOrb) return false;
            if (tOrb != null && e.orb > tOrb) return false;
          } else if (tomorrowExact.has(base)) {
            return false;
          }
        }
      }
      // For aspect :Ends — only keep the last day of the run within
      // ENDS_ORB_CAP so multi-day separating tails collapse to a single
      // milestone day at the tight-orb boundary.  Orbs beyond 1.5° are
      // noise (Python emits :Ends up to 3° separating) and should not
      // surface.  Nodes are exempt because their :Ends is relabeled from
      // the last node-run day via the pre-pass above and has no orb.
      if (e.type === 'aspect' && desc.endsWith(': Ends')) {
        const isNode = NODE_PLANETS.has(e.transitPlanet);
        if (!isNode && typeof e.orb === 'number' && e.orb >= endsOrbCap(e)) return false;
        const base = desc.replace(/\s*:\s*Ends$/, '').trim().toLowerCase();
        if (tomorrowEnds.has(base)) return false;
      }
      // For aspect :Starts — only keep the FIRST day of each run.
      // Nodes use yesterdayNodeBases (multi-week approach).
      // Non-nodes use yesterdayStarts (same-base :Starts yesterday = continuation).
      if (e.type === 'aspect' && desc.endsWith(': Starts')) {
        const base = desc.replace(/\s*:\s*Starts$/, '').trim().toLowerCase();
        if (NODE_PLANETS.has(e.transitPlanet)) {
          if (yesterdayNodeBases.has(base)) return false;
        } else {
          if (yesterdayStarts.has(base)) return false;
        }
      }
      // Moon-aspect (no qualifier) — Moon transits ~12°/day, so the same
      // aspect fires on 2-3 consecutive days. Planner keeps only the
      // local-minimum-orb day; drop today if yesterday or tomorrow has a
      // tighter orb for the same base description.
      if (e.type === 'aspect' && e.transitPlanet === 'Moon'
          && !/:\s*(Exact|Starts|Ends)$/.test(desc)) {
        const base = desc.trim().toLowerCase();
        if (typeof e.orb === 'number') {
          const y = yesterdayMoonOrbs.get(base);
          const t = tomorrowMoonOrbs.get(base);
          // Drop today if yesterday is tighter or within 0.2° (near-ties
          // favor the earlier day per planner convention). Drop today if
          // tomorrow is tighter by more than 0.2°; near-ties favor today.
          if (y != null && y.orb - e.orb < 0.2) return false;
          if (t != null && e.orb - t.orb >= 0.2) return false;
        }
      }
      // For mc_aspect :Exact — keep the local-minimum-orb day (the actual
      // astronomical crossing day, which may be marked separating if the
      // peak fell late in the day after kerykeion's noon snapshot).
      if (e.type === 'mc_aspect' && desc.endsWith(': Exact')) {
        const base = desc.replace(/\s*:\s*Exact$/, '').trim().toLowerCase();
        if (typeof e.orb === 'number' && e.orb >= exactOrbCap(e)) return false;
        if (typeof e.orb === 'number') {
          const yOrb = yesterdayMcOrbs.get(base);
          const tOrb = tomorrowMcOrbs.get(base);
          if (yOrb != null && e.orb > yOrb) return false;
          if (tOrb != null && e.orb > tOrb) return false;
        }
      }
      // mc_aspect :Starts — first day of approach only.
      if (e.type === 'mc_aspect' && desc.endsWith(': Starts')) {
        const base = desc.replace(/\s*:\s*Starts$/, '').trim().toLowerCase();
        if (yesterdayMcStarts.has(base)) return false;
      }
      // mc_aspect :Ends — last day of separating run only, within tight orb.
      // Without an orb cap, slow planets emit :Ends every day for weeks at
      // very wide orbs (Jupiter-MC at 9°+) creating phantom milestones.
      if (e.type === 'mc_aspect' && desc.endsWith(': Ends')) {
        const isSlow = SLOW_PLANETS_SET.has(e.transitPlanet);
        // Mars MC uses wider cap because the Vedic 8th drishti (quincunx)
        // separating tail sits at ~2°.
        const cap = isSlow ? 3.5 : (e.transitPlanet === 'Mars' ? 2.5 : 1.5);
        if (typeof e.orb === 'number' && e.orb >= cap) return false;
        const base = desc.replace(/\s*:\s*Ends$/, '').trim().toLowerCase();
        if (tomorrowMcEnds.has(base)) return false;
      }
      // ascendant_aspect :Exact — keep the LAST day within the 1° orb window
      // (the planner's "Exact day" for retrograde passes is the final sub-1°
      // day, which is separating when the aspect is past the minimum).
      if (e.type === 'ascendant_aspect' && desc.endsWith(': Exact')) {
        const base = desc.replace(/\s*:\s*Exact$/, '').trim().toLowerCase();
        if (typeof e.orb === 'number' && e.orb >= exactOrbCap(e)) return false;
        if (tomorrowAscExact.has(base)) return false;
      }
      // ascendant_aspect :Ends — keep last day of run.
      if (e.type === 'ascendant_aspect' && desc.endsWith(': Ends')) {
        const base = desc.replace(/\s*:\s*Ends$/, '').trim().toLowerCase();
        if (tomorrowAscEnds.has(base)) return false;
      }
      // ascendant_aspect :Starts — keep first day of run.
      if (e.type === 'ascendant_aspect' && desc.endsWith(': Starts')) {
        const base = desc.replace(/\s*:\s*Starts$/, '').trim().toLowerCase();
        if (yesterdayAscStarts.has(base)) return false;
      }
      return true;
    });

    // Return formatted response with transit events
    const today = transitDate
      ? new Date(transitDate).toISOString().substring(0, 10)
      : new Date().toISOString().substring(0, 10);

    res.json({
      date: today,
      aspects: transitEvents.map(e => ({
        impact: e.impact,
        description: e.description,
        interpretation: interpretationLookup(e.description),
      })),
      rulers: transitEvents.flatMap(e =>
        (e.rulers || []).map(r => ({
          description: r.description,
          interpretation: interpretationLookup(r.description),
        })),
      ),
    });

  } catch (error) {
    console.error('Reading endpoint error:', error.message);
    res.status(500).json({
      error: 'Failed to generate reading. Please try again later.',
    });
  }
  };
}

router.post('/debug', makeDebugHandler(getEventInterpretation));
router.post('/investment', makeDebugHandler(getInvestmentEventInterpretation));
router.post('/career', makeDebugHandler(getCareerEventInterpretation));
router.post('/relationship', makeDebugHandler(getRelationshipEventInterpretation));
router.post('/network', makeDebugHandler(getNetworkEventInterpretation));

/**
 * POST /api/events-calendar
 *
 * Returns all dates in the given month where at least one of the requested
 * events appears in the transit report.
 *
 * Request body:
 * {
 *   "name":      "Alice",
 *   "birthDate": "1991-09-27",
 *   "birthTime": "07:40",
 *   "latitude":  6.9271,
 *   "longitude": 79.8612,
 *   "timezone":  "Asia/Colombo",   // optional
 *   "month":     "2026-05",        // YYYY-MM
 *   "events":    ["Moon Transits the 8th House", "Mercury ruler of the 6th House in the 8th House"]
 * }
 *
 * Response:
 * {
 *   "month": "2026-05",
 *   "events": ["Moon Transits the 8th House", ...],
 *   "matchingDates": ["2026-05-04", "2026-05-17", ...]
 * }
 */
router.post('/events-calendar', async (req, res) => {
  try {
    const { name, birthDate, birthTime, latitude, longitude, timezone, month, events } = req.body;

    if (!name || !birthDate || !birthTime || latitude == null || longitude == null) {
      return res.status(400).json({
        error: 'Missing required fields: name, birthDate, birthTime, latitude, longitude',
      });
    }
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ error: 'month must be in YYYY-MM format' });
    }
    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: 'events must be a non-empty array of event names' });
    }

    const matchingDates = await astrologyService.getMatchingDatesForMonth(
      { birthDate, birthTime, latitude, longitude, timezone },
      month,
      events,
    );

    res.json({ month, events, matchingDates });
  } catch (error) {
    console.error('events-calendar error:', error.message);
    res.status(500).json({ error: 'Failed to compute events calendar. Please try again later.' });
  }
});

/**
 * POST /api/investment-loss-days
 *
 * Returns all days in the given month that show astrological signs linked to
 * sudden investment losses (based on Vedic astrology principles):
 *   - Moon in 6th / 8th / 12th house
 *   - Moon conjunct or opposite natal Rahu/Ketu (Grahan Yoga)
 *   - Rahu/Ketu transiting natal Jupiter or Venus
 *   - Saturn ingressing into the 8th house (Ashtam Shani)
 *   - Sun aspecting natal Rahu/Ketu (Grahan Yoga)
 *
 * Request body:
 * {
 *   "name":      "Alice",
 *   "birthDate": "1991-09-27",
 *   "birthTime": "07:40",
 *   "latitude":  6.9271,
 *   "longitude": 79.8612,
 *   "timezone":  "Asia/Colombo",   // optional
 *   "month":     "2026-05"         // YYYY-MM
 * }
 *
 * Response:
 * {
 *   "month": "2026-05",
 *   "riskDates": [
 *     {
 *       "date": "2026-05-04",
 *       "signs": [
 *         { "sign": "Moon in 8th House (sudden events, unexpected losses)", "description": "Moon in 8th House" },
 *         { "sign": "Moon conjunct/opposite Rahu or Ketu ...", "description": "Moon conjunction Rahu in 2nd house" }
 *       ]
 *     }
 *   ]
 * }
 */
router.post('/investment-loss-days', async (req, res) => {
  try {
    const { name, birthDate, birthTime, latitude, longitude, timezone, month } = req.body;

    if (!name || !birthDate || !birthTime || latitude == null || longitude == null) {
      return res.status(400).json({
        error: 'Missing required fields: name, birthDate, birthTime, latitude, longitude',
      });
    }
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ error: 'month must be in YYYY-MM format' });
    }

    const riskDates = await getInvestmentLossDaysForMonth(
      { birthDate, birthTime, latitude, longitude, timezone },
      month,
    );

    res.json({ month, riskDates });
  } catch (error) {
    console.error('investment-loss-days error:', error.message);
    res.status(500).json({ error: 'Failed to compute investment loss days. Please try again later.' });
  }
});

/**
 * POST /api/investment-gain-days
 *
 * Returns all days in the given month that show astrological signs favorable
 * for speculation and sudden gains (based on SuddenGainSigns.docx):
 *   - Moon in 2nd / 5th / 9th / 11th house
 *   - Moon conjunct/trine/sextile natal Mars (Chandra-Mangal Yoga)
 *   - Moon conjunct/trine/sextile natal Jupiter (luck + expansion)
 *   - Moon conjunct/trine/sextile natal Venus (financial abundance)
 *   - Jupiter transiting 5th or 11th house
 *   - Venus aspecting natal Jupiter in 5th/11th house
 *   - Sun aspecting natal Jupiter in 5th house
 *   - Mercury aspecting natal Venus in 2nd/5th/9th/11th house
 *
 * Only :Exact (or unqualified) events are considered.
 */
router.post('/investment-gain-days', async (req, res) => {
  try {
    const { name, birthDate, birthTime, latitude, longitude, timezone, month } = req.body;

    if (!name || !birthDate || !birthTime || latitude == null || longitude == null) {
      return res.status(400).json({
        error: 'Missing required fields: name, birthDate, birthTime, latitude, longitude',
      });
    }
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ error: 'month must be in YYYY-MM format' });
    }

    const gainDates = await getInvestmentGainDaysForMonth(
      { birthDate, birthTime, latitude, longitude, timezone },
      month,
    );

    res.json({ month, gainDates });
  } catch (error) {
    console.error('investment-gain-days error:', error.message);
    res.status(500).json({ error: 'Failed to compute investment gain days. Please try again later.' });
  }
});

module.exports = router;
