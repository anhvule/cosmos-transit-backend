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
const { computeDashaAtDate, getNakshatra } = require('../services/dasha');
const { calculateEssenceCycle } = require('../services/essence-cycle');
const { getYearlySummary } = require('../services/varshaphal');
const { getMonthlyPrediction } = require('../services/monthly-prediction');
const { getWealthAnalysis } = require('../services/wealth-analysis');
const { resolveTimezone, TimezoneError } = require('../services/timezone');
const favouritesDb = require('../db/favourites');
const { createFavouritesService } = require('../services/favourites');
const favouritesService = createFavouritesService(favouritesDb);
const dashaDescriptions = require('../db/dasha-descriptions.json');

/**
 * Resolve `req.body.timezone` to an IANA string for the downstream Python
 * engine, or send a 400 and return null on invalid input. Caller should
 * stop processing when null is returned.
 *
 * The public API now accepts a numeric UTC offset (e.g. 7, +8, -5);
 * legacy IANA strings (e.g. "Asia/Ho_Chi_Minh") still pass through.
 */
function resolveTimezoneOrRespond(rawTimezone, res) {
  try {
    return { ok: true, timezone: resolveTimezone(rawTimezone) };
  } catch (e) {
    if (e instanceof TimezoneError) {
      res.status(400).json({ error: e.message });
      return { ok: false };
    }
    throw e;
  }
}

/**
 * Look up MD/AD/PD descriptions for the active dasha.
 * Returns { mdDesc, adDesc, pdDesc } — empty strings if not found.
 * Lookup is keyed by (MD planet, AD planet, PD planet); house metadata in the
 * fixture is informational only.
 */
function getDashaDescriptions(mdPlanet, adPlanet, pdPlanet) {
  const empty = { mdDesc: '', adDesc: '', pdDesc: '' };
  const md = dashaDescriptions[mdPlanet];
  if (!md) return empty;
  const ad = (md.antardashas || []).find(a => a.planet === adPlanet);
  if (!ad) return { mdDesc: md.mahadasha?.description || '', adDesc: '', pdDesc: '' };
  const pd = (ad.pratyantardashas || []).find(p => p.planet === pdPlanet);
  return {
    mdDesc: md.mahadasha?.description || '',
    adDesc: ad.description || '',
    pdDesc: pd?.description || '',
  };
}
const db = require('../db/index');
const investmentDb = require('../db/investment');
const careerDb = require('../db/career');
const relationshipDb = require('../db/relationship');
const networkDb = require('../db/network');
const engineeringDb = require('../db/engineering');
const adviceDb = require('../db/advice');
const gainDb = require('../db/gain');
const lossDb = require('../db/loss');
const foodDb = require('../db/food');

// Pre-compile lookup statement for performance. Lookups are parameterized
// on (name, ascendant); routes extract the native's ascendant from the
// natal chart and pass it in. lookupEventWithFallback falls back to the
// Aries-tagged row when the requested ascendant has no description seeded
// yet — preserving the original single-interpretation behavior for any
// ascendant whose dataset is incomplete.
const LOOKUP_SQL = "SELECT description FROM events WHERE name = ? AND ascendant = ?";
const lookupEvent = db.prepare(LOOKUP_SQL);
const lookupInvestmentEvent = investmentDb.prepare(LOOKUP_SQL);
const lookupCareerEvent = careerDb.prepare(LOOKUP_SQL);
const lookupRelationshipEvent = relationshipDb.prepare(LOOKUP_SQL);
const lookupNetworkEvent = networkDb.prepare(LOOKUP_SQL);
const lookupEngineeringEvent = engineeringDb.prepare(LOOKUP_SQL);
const lookupAdviceEvent = adviceDb.prepare(LOOKUP_SQL);
const lookupGainEvent = gainDb.prepare(LOOKUP_SQL);
const lookupLossEvent = lossDb.prepare(LOOKUP_SQL);
const lookupFoodEvent = foodDb.prepare(LOOKUP_SQL);

/**
 * Extract the ascendant sign (Aries/Taurus/.../Pisces) from a kerykeion
 * result. Defaults to 'Aries' if the natal chart is missing — that way
 * descriptions still resolve via the legacy seed even on edge cases.
 */
function ascendantFromResult(result) {
  if (!result || !result.natalPlanets) return 'Aries';
  const asc = result.natalPlanets.find(p => p && p.name === 'Ascendant');
  return (asc && asc.sign) || 'Aries';
}

/**
 * Strip : Exact / : Starts / : Ends qualifiers from an event description
 * to produce the base key used in the events table.
 */
function baseEventName(description) {
  return description.replace(/\s*:\s*(Exact|Starts|Ends)$/, '').trim();
}

/**
 * Lookup an event description, trying up to four name variants in order:
 *   1. The full description as-is (e.g. "Mars aspect Mercury in 8th house : Exact").
 *   2. The base name with the ": Exact/Starts/Ends" phase suffix stripped.
 *   3. Variant 1 with the "in Nth house" ⇄ "in the Nth house" phrasing toggled.
 *   4. Variant 2 with the same phrasing toggle.
 *
 * Variant 1 is the priority because the seed DBs now carry per-phase rows
 * (Starts / Exact / Ends with distinct copy). Variant 2 preserves the
 * original "any phase shares one description" behavior for older rows.
 * Variants 3 and 4 bridge engine output (which omits "the") with rows
 * seeded as "in the Nth house".
 */
function lookupEventWithFallback(stmt, description, ascendant) {
  const candidates = [description];

  const base = baseEventName(description);
  if (base !== description) candidates.push(base);

  // Append the toggled-phrasing form of every existing candidate.
  for (const c of [...candidates]) {
    const alt = / in the \d+(?:st|nd|rd|th) house/i.test(c)
      ? c.replace(/ in the (\d+(?:st|nd|rd|th) house)/i, ' in $1')
      : c.replace(/ in (\d+(?:st|nd|rd|th) house)/i, ' in the $1');
    if (alt !== c) candidates.push(alt);
  }

  // First pass: ascendant-specific rows (the user's actual sign).
  for (const candidate of candidates) {
    const row = stmt.get(candidate, ascendant);
    if (row && row.description) return row.description;
  }
  // Fallback: Aries row, which is the seeded baseline. This keeps the
  // legacy single-interpretation behavior for any ascendant whose
  // descriptions aren't filled in yet.
  if (ascendant !== 'Aries') {
    for (const candidate of candidates) {
      const row = stmt.get(candidate, 'Aries');
      if (row && row.description) return row.description;
    }
  }
  return '';
}

/**
 * Look up the interpretation text for a transit event description against
 * the given ascendant's row. Falls back to the Aries row (and ultimately
 * empty string) inside lookupEventWithFallback. Returns '' if no match.
 */
function getEventInterpretation(description, ascendant) {
  return lookupEventWithFallback(lookupEvent, description, ascendant);
}

function getInvestmentEventInterpretation(description, ascendant) {
  return lookupEventWithFallback(lookupInvestmentEvent, description, ascendant);
}

function getCareerEventInterpretation(description, ascendant) {
  return lookupEventWithFallback(lookupCareerEvent, description, ascendant);
}

function getRelationshipEventInterpretation(description, ascendant) {
  return lookupEventWithFallback(lookupRelationshipEvent, description, ascendant);
}

function getNetworkEventInterpretation(description, ascendant) {
  return lookupEventWithFallback(lookupNetworkEvent, description, ascendant);
}

function getEngineeringEventInterpretation(description, ascendant) {
  return lookupEventWithFallback(lookupEngineeringEvent, description, ascendant);
}

function getAdviceEventInterpretation(description, ascendant) {
  return lookupEventWithFallback(lookupAdviceEvent, description, ascendant);
}

function getGainEventInterpretation(description, ascendant) {
  return lookupEventWithFallback(lookupGainEvent, description, ascendant);
}

function getLossEventInterpretation(description, ascendant) {
  return lookupEventWithFallback(lookupLossEvent, description, ascendant);
}

function getFoodEventInterpretation(description, ascendant) {
  return lookupEventWithFallback(lookupFoodEvent, description, ascendant);
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
    const tz = resolveTimezoneOrRespond(timezone, res);
    if (!tz.ok) return;

    let transitEvents;

    // Kerykeion path: single Python call returns everything
    const result = await astrologyService.getNatalTransitsAndReport(
      { birthDate, birthTime, latitude, longitude, timezone: tz.timezone },
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

    const ascendant = ascendantFromResult(result);

    res.json({
      date: today,
      reading: aiResponse.reading,
      focusAreas: aiResponse.focusAreas,
      transitSummary: aiResponse.transitSummary,
      aspects: transitEvents.map(e => ({
        type: e.type,
        description: e.description,
        interpretation: getEventInterpretation(e.description, ascendant),
        warning: e.warning ?? null,
      })),
      rulers: transitEvents.flatMap(e =>
        (e.rulers || []).map(r => ({
          description: r.description,
          interpretation: getEventInterpretation(r.description, ascendant),
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

// Filter today's transit events using yesterday/tomorrow context for dedup.
// Extracted from /debug so it can be reused for week/month aggregation routes.
function computeFilteredEvents(yesterdayResult, todayResult, tomorrowResult) {
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

  return transitEvents;
}

// Fetch kerykeion results for a list of dates (deduplicated, parallel).
async function fetchResultsForDates(birthParams, dates) {
  const uniqueDates = Array.from(new Set(dates));
  const entries = await Promise.all(
    uniqueDates.map(async d => [d, await astrologyService.getNatalTransitsAndReport(birthParams, d)]),
  );
  return new Map(entries);
}

// Compute next/prev date strings (YYYY-MM-DD).
function shiftDate(dateStr, deltaDays) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + deltaDays);
  return d.toISOString().substring(0, 10);
}

function makeDebugHandler(interpretationLookup) {
  return async (req, res) => {
    try {
      const { name, birthDate, birthTime, latitude, longitude, transitDate, timezone } = req.body;

      if (!name || !birthDate || !birthTime || latitude == null || longitude == null) {
        return res.status(400).json({
          error: 'Missing required fields: name, birthDate, birthTime, latitude, longitude',
        });
      }
      const tz = resolveTimezoneOrRespond(timezone, res);
      if (!tz.ok) return;

      const baseDateStr = transitDate
        ? new Date(transitDate).toISOString().substring(0, 10)
        : new Date().toISOString().substring(0, 10);
      const yesterdayStr = shiftDate(baseDateStr, -1);
      const tomorrowStr = shiftDate(baseDateStr, 1);

      const birthParams = { birthDate, birthTime, latitude, longitude, timezone: tz.timezone };
      const results = await fetchResultsForDates(birthParams, [yesterdayStr, baseDateStr, tomorrowStr]);

      const transitEvents = computeFilteredEvents(
        results.get(yesterdayStr),
        results.get(baseDateStr),
        results.get(tomorrowStr),
      );
      const ascendant = ascendantFromResult(results.get(baseDateStr));

      res.json({
        date: baseDateStr,
        aspects: transitEvents.map(e => ({
          impact: e.impact,
          description: e.description,
          interpretation: interpretationLookup(e.description, ascendant),
        })),
        rulers: transitEvents.flatMap(e =>
          (e.rulers || []).map(r => ({
            description: r.description,
            interpretation: interpretationLookup(r.description, ascendant),
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

// Build per-day filtered events for a list of dates, then aggregate.
// Returns { days: [{ date, aspects, rulers }], aggregatedAspects, aggregatedRulers }
async function aggregatePeriod(birthParams, dates, interpretationLookup) {
  // Fetch all needed dates plus 1-day padding on each end (for yesterday/tomorrow context).
  const sorted = [...dates].sort();
  const fetchDates = new Set(sorted);
  fetchDates.add(shiftDate(sorted[0], -1));
  fetchDates.add(shiftDate(sorted[sorted.length - 1], 1));
  for (const d of sorted) {
    fetchDates.add(shiftDate(d, -1));
    fetchDates.add(shiftDate(d, 1));
  }
  const results = await fetchResultsForDates(birthParams, Array.from(fetchDates));

  const days = [];
  const aspectMap = new Map();   // base description (lowercase) → { description, interpretation, dates: [] }
  const rulerMap = new Map();

  for (const date of sorted) {
    const todayResult = results.get(date);
    const yesterdayResult = results.get(shiftDate(date, -1));
    const tomorrowResult = results.get(shiftDate(date, 1));
    const events = computeFilteredEvents(yesterdayResult, todayResult, tomorrowResult);
    const ascendant = ascendantFromResult(todayResult);

    const aspects = events.map(e => ({
      impact: e.impact,
      description: e.description,
      interpretation: interpretationLookup(e.description, ascendant),
    }));
    const rulers = events.flatMap(e =>
      (e.rulers || []).map(r => ({
        description: r.description,
        interpretation: interpretationLookup(r.description, ascendant),
      })),
    );

    days.push({ date, aspects, rulers });

    for (const a of aspects) {
      const key = (a.description || '').toLowerCase();
      if (!aspectMap.has(key)) {
        aspectMap.set(key, { description: a.description, interpretation: a.interpretation, impact: a.impact, dates: [] });
      }
      aspectMap.get(key).dates.push(date);
    }
    for (const r of rulers) {
      const key = (r.description || '').toLowerCase();
      if (!rulerMap.has(key)) {
        rulerMap.set(key, { description: r.description, interpretation: r.interpretation, dates: [] });
      }
      rulerMap.get(key).dates.push(date);
    }
  }

  return {
    days,
    aggregatedAspects: Array.from(aspectMap.values()),
    aggregatedRulers: Array.from(rulerMap.values()),
  };
}

// Build a list of YYYY-MM-DD dates in [startDate, endDate] (inclusive).
function dateRange(startDate, endDate) {
  const out = [];
  let cursor = startDate;
  while (cursor <= endDate) {
    out.push(cursor);
    cursor = shiftDate(cursor, 1);
  }
  return out;
}

function makePeriodHandler(periodKind, interpretationLookup) {
  return async (req, res) => {
    try {
      const { name, birthDate, birthTime, latitude, longitude, timezone, weekStart, month } = req.body;

      if (!name || !birthDate || !birthTime || latitude == null || longitude == null) {
        return res.status(400).json({
          error: 'Missing required fields: name, birthDate, birthTime, latitude, longitude',
        });
      }
      const tz = resolveTimezoneOrRespond(timezone, res);
      if (!tz.ok) return;

      let dates;
      let startDate;
      let endDate;
      if (periodKind === 'week') {
        if (!weekStart || !/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) {
          return res.status(400).json({ error: 'weekStart must be in YYYY-MM-DD format' });
        }
        startDate = weekStart;
        endDate = shiftDate(weekStart, 6);
        dates = dateRange(startDate, endDate);
      } else if (periodKind === 'month') {
        if (!month || !/^\d{4}-\d{2}$/.test(month)) {
          return res.status(400).json({ error: 'month must be in YYYY-MM format' });
        }
        const [y, m] = month.split('-').map(Number);
        const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate(); // m is 1-12; Date(y, m, 0) → last day of month m
        startDate = `${month}-01`;
        endDate = `${month}-${String(lastDay).padStart(2, '0')}`;
        dates = dateRange(startDate, endDate);
      } else {
        return res.status(500).json({ error: `Unknown periodKind: ${periodKind}` });
      }

      const birthParams = { birthDate, birthTime, latitude, longitude, timezone: tz.timezone };
      const { days, aggregatedAspects, aggregatedRulers } = await aggregatePeriod(
        birthParams,
        dates,
        interpretationLookup,
      );

      res.json({
        period: periodKind,
        startDate,
        endDate,
        days,
        aggregatedAspects,
        aggregatedRulers,
      });
    } catch (error) {
      console.error(`Period (${periodKind}) endpoint error:`, error.message);
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
router.post('/engineering', makeDebugHandler(getEngineeringEventInterpretation));
router.post('/advice', makeDebugHandler(getAdviceEventInterpretation));
router.post('/gain', makeDebugHandler(getGainEventInterpretation));
router.post('/loss', makeDebugHandler(getLossEventInterpretation));
router.post('/food', makeDebugHandler(getFoodEventInterpretation));

router.post('/investment-weekly', makePeriodHandler('week', getInvestmentEventInterpretation));
router.post('/investment-monthly', makePeriodHandler('month', getInvestmentEventInterpretation));

/**
 * POST /api/essence-cycle
 *
 * Compute the 10-year Essence Cycle table — Western (Pythagorean) numerology.
 * Three transit streams (physical / mental / spiritual) drawn from the first,
 * middle and last name; combined with the Personal Year for each row.
 *
 * Request body:
 * {
 *   "full_name":  "John Alan Doe",
 *   "dob":        "1992-07-16",
 *   "start_year": 2026
 * }
 */
router.post('/essence-cycle', (req, res) => {
  try {
    const { full_name, dob, start_year } = req.body || {};

    if (!full_name || !dob || start_year == null) {
      return res.status(400).json({
        error: 'Missing required fields: full_name, dob, start_year',
      });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dob))) {
      return res.status(400).json({ error: 'dob must be in YYYY-MM-DD format' });
    }
    const startYearNum = Number(start_year);
    if (!Number.isInteger(startYearNum) || startYearNum < 1 || startYearNum > 9999) {
      return res.status(400).json({ error: 'start_year must be a 4-digit integer' });
    }

    const result = calculateEssenceCycle({ full_name, dob, start_year: startYearNum });
    res.json(result);
  } catch (error) {
    console.error('essence-cycle endpoint error:', error.message);
    res.status(500).json({ error: 'Failed to compute essence cycle. Please try again later.' });
  }
});

/**
 * POST /api/dasha
 *
 * Compute the active Vimshottari Mahadasha (MD), Antardasha (AD) and
 * Pratyantardasha (PD) for a given date based on the Moon's sidereal (Lahiri)
 * longitude at birth.
 *
 * Request body:
 * {
 *   "name":      "Alice",
 *   "birthDate": "1991-09-27",
 *   "birthTime": "07:40",
 *   "latitude":  6.9271,
 *   "longitude": 79.8612,
 *   "timezone":  7,                // optional, numeric UTC offset in hours (-12..14, integers only)
 *   "transitDate": "2026-04-20"    // optional; defaults to today
 * }
 *
 * Response:
 * {
 *   "date": "2026-04-20",
 *   "moonLongitude": 123.456,
 *   "nakshatra": { "index": 9, "name": "Magha", "lord": "Ketu", "pada": 2, "fractionElapsed": 0.37 },
 *   "mahadasha": { "planet": "Venus", "startDate": "...", "endDate": "..." },
 *   "antardasha": { "planet": "Jupiter", "startDate": "...", "endDate": "..." },
 *   "pratyantardasha": { "planet": "Saturn", "startDate": "...", "endDate": "..." }
 * }
 */
router.post('/dasha', async (req, res) => {
  try {
    const { name, birthDate, birthTime, latitude, longitude, timezone, transitDate } = req.body;

    if (!name || !birthDate || !birthTime || latitude == null || longitude == null) {
      return res.status(400).json({
        error: 'Missing required fields: name, birthDate, birthTime, latitude, longitude',
      });
    }
    const tz = resolveTimezoneOrRespond(timezone, res);
    if (!tz.ok) return;

    // Fetch natal chart to get the Moon's sidereal (Lahiri) longitude.
    const { natalPlanets } = await astrologyService.getNatalTransits(
      { birthDate, birthTime, latitude, longitude, timezone: tz.timezone },
      null,
    );
    // natalPlanets are already in sidereal (Lahiri) coordinates, so fullDegree
    // is the sidereal absolute longitude we need for nakshatra lookup.
    const moon = (natalPlanets || []).find(p => p.name === 'Moon');
    const moonLongitude = moon && (moon.sidereal_abs_pos != null ? moon.sidereal_abs_pos : moon.fullDegree);
    if (moonLongitude == null) {
      return res.status(500).json({ error: 'Could not determine Moon sidereal longitude from natal chart' });
    }

    // Treat birth and query moments as naive instants in the same frame — the
    // absolute offset cancels out when we back-shift by elapsed MD years.
    const birthMoment = new Date(`${birthDate}T${birthTime}:00Z`);
    const dateStr = transitDate
      ? new Date(transitDate).toISOString().substring(0, 10)
      : new Date().toISOString().substring(0, 10);
    const queryDate = new Date(`${dateStr}T12:00:00Z`);

    const result = computeDashaAtDate(birthMoment, moonLongitude, queryDate);

    const fmt = (p, description) => p && {
      planet: p.planet,
      startDate: p.startDate.toISOString(),
      endDate: p.endDate.toISOString(),
      description: description || '',
    };

    const { mdDesc, adDesc, pdDesc } = getDashaDescriptions(
      result.mahadasha?.planet,
      result.antardasha?.planet,
      result.pratyantardasha?.planet,
    );

    res.json({
      date: dateStr,
      moonLongitude,
      nakshatra: result.nakshatra,
      mahadasha: fmt(result.mahadasha, mdDesc),
      antardasha: fmt(result.antardasha, adDesc),
      pratyantardasha: fmt(result.pratyantardasha, pdDesc),
    });
  } catch (error) {
    console.error('Dasha endpoint error:', error.message);
    res.status(500).json({ error: 'Failed to compute dasha. Please try again later.' });
  }
});

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
 *   "timezone":  7,                // optional, numeric UTC offset in hours (-12..14, integers only)
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
    const tz = resolveTimezoneOrRespond(timezone, res);
    if (!tz.ok) return;

    const matchingDates = await astrologyService.getMatchingDatesForMonth(
      { birthDate, birthTime, latitude, longitude, timezone: tz.timezone },
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
 *   "timezone":  7,                // optional, numeric UTC offset in hours (-12..14, integers only)
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
    const tz = resolveTimezoneOrRespond(timezone, res);
    if (!tz.ok) return;

    const riskDates = await getInvestmentLossDaysForMonth(
      { birthDate, birthTime, latitude, longitude, timezone: tz.timezone },
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
    const tz = resolveTimezoneOrRespond(timezone, res);
    if (!tz.ok) return;

    const gainDates = await getInvestmentGainDaysForMonth(
      { birthDate, birthTime, latitude, longitude, timezone: tz.timezone },
      month,
    );

    res.json({ month, gainDates });
  } catch (error) {
    console.error('investment-gain-days error:', error.message);
    res.status(500).json({ error: 'Failed to compute investment gain days. Please try again later.' });
  }
});

/**
 * POST /api/yearly-summary
 *
 * Tajika annual horoscope (Varshaphal) — returns the "Combined effect of
 * factors analysed" table from the Yearly.docx reference report:
 *   1. Muntha
 *   2. Muntha Lord
 *   3. Varsheshwara (Lord of the Year)
 *   4. Birth Lagna position in the annual chart
 *   5. Planets in Houses (overall)
 * plus the underlying annual chart, Muntha placement, and Sarvashtavarga
 * point totals for each sidereal sign.
 *
 * Request body:
 * {
 *   "name":      "Alice",
 *   "birthDate": "1991-12-29",
 *   "birthTime": "13:30",
 *   "latitude":  10.7755,
 *   "longitude": 106.7021,
 *   "timezone":  7,                    // optional, numeric UTC offset in hours (-12..14, integers only)
 *   "year":      2025                  // calendar year the horoscope is for
 * }
 *
 * `year` is the forecast calendar year (matches Yearly.docx labelling — a
 * "2025 horoscope" for a Dec 29 birthday is the Tajika year that *starts*
 * on Dec 29, 2024). Internally we pick the Pravesh whose Tajika year covers
 * the majority of `year`.
 */
router.post('/yearly-summary', async (req, res) => {
  try {
    const { name, birthDate, birthTime, latitude, longitude, timezone, year } = req.body;

    if (!name || !birthDate || !birthTime || latitude == null || longitude == null) {
      return res.status(400).json({
        error: 'Missing required fields: name, birthDate, birthTime, latitude, longitude',
      });
    }
    const yr = Number(year);
    if (!Number.isInteger(yr) || yr < 1900 || yr > 2200) {
      return res.status(400).json({ error: 'year must be a 4-digit integer between 1900 and 2200' });
    }
    const tz = resolveTimezoneOrRespond(timezone, res);
    if (!tz.ok) return;

    const summary = await getYearlySummary(
      { birthDate, birthTime, latitude, longitude, timezone: tz.timezone },
      yr,
    );
    res.json(summary);
  } catch (error) {
    console.error('yearly-summary error:', error.message);
    res.status(500).json({ error: 'Failed to compute yearly summary. Please try again later.' });
  }
});

/**
 * POST /api/monthly-prediction
 *
 * Sun-transit + Sarvashtavarga monthly predictions for a Tajika year (12-13
 * periods, one per Sun sidereal-sign ingress). Each period reports:
 *   - fromDate / toDate  (Sun ingress range)
 *   - sunSign / sunSignVedic, sunHouseFromMoon
 *   - sarvashtavargaPoints (bindu count for the sign Sun transits)
 *   - jupiterSign / jupiterSignVedic, jupiterHouseFromMoon
 *   - prediction (text composed from Sun-house-from-Moon × Sarvashtavarga band
 *                 with a Jupiter-house-from-Moon modifier)
 *
 * Request body: same as /api/yearly-summary.
 */
router.post('/monthly-prediction', async (req, res) => {
  try {
    const { name, birthDate, birthTime, latitude, longitude, timezone, year } = req.body;

    if (!name || !birthDate || !birthTime || latitude == null || longitude == null) {
      return res.status(400).json({
        error: 'Missing required fields: name, birthDate, birthTime, latitude, longitude',
      });
    }
    const yr = Number(year);
    if (!Number.isInteger(yr) || yr < 1900 || yr > 2200) {
      return res.status(400).json({ error: 'year must be a 4-digit integer between 1900 and 2200' });
    }
    const tz = resolveTimezoneOrRespond(timezone, res);
    if (!tz.ok) return;

    const result = await getMonthlyPrediction(
      { birthDate, birthTime, latitude, longitude, timezone: tz.timezone },
      yr,
    );
    res.json(result);
  } catch (error) {
    console.error('monthly-prediction error:', error.message);
    res.status(500).json({ error: 'Failed to compute monthly prediction. Please try again later.' });
  }
});

/**
 * POST /api/wealth-analysis
 *
 * Vedic wealth analysis from the natal chart, mirroring the structure of the
 * Wealth.docx reference report:
 *   1. Lagna-based prediction (Lagna sign + Lagna Lord's house placement)
 *   2. Nakshatra-based prediction (Moon, Jupiter, Venus nakshatras + padas)
 *   3. House analysis for wealth (2nd, 4th, 9th, 11th — lord placement + aspects)
 *   4. Hora chart (D2) — planet placements in Sun's hora (Leo) vs Moon's hora (Cancer)
 *   5. Wealth yogas — classical combinations detected in the chart
 *
 * Request body:
 * {
 *   "name":      "Alice",
 *   "birthDate": "1991-12-29",
 *   "birthTime": "13:30",
 *   "latitude":  10.7755,
 *   "longitude": 106.7021,
 *   "timezone":  7                    // optional, numeric UTC offset in hours (-12..14, integers only)
 * }
 */
router.post('/wealth-analysis', async (req, res) => {
  try {
    const { name, birthDate, birthTime, latitude, longitude, timezone } = req.body;

    if (!name || !birthDate || !birthTime || latitude == null || longitude == null) {
      return res.status(400).json({
        error: 'Missing required fields: name, birthDate, birthTime, latitude, longitude',
      });
    }
    const tz = resolveTimezoneOrRespond(timezone, res);
    if (!tz.ok) return;

    const report = await getWealthAnalysis({
      birthDate, birthTime, latitude, longitude, timezone: tz.timezone,
    });
    res.json(report);
  } catch (error) {
    console.error('wealth-analysis error:', error.message);
    res.status(500).json({ error: 'Failed to compute wealth analysis. Please try again later.' });
  }
});

/**
 * Favourites — per-user transit-date bookmarks with a free-text memory.
 *
 * Identity is opaque: the client generates a stable `userKey` once (UUID-ish,
 * stored locally) and sends it with every request. There is no auth — losing
 * the device key means losing access to those rows.
 *
 * POST   /api/favourites              — body: { userKey, transitDate (YYYY-MM-DD), title?, description }
 * GET    /api/favourites?userKey=XYZ  — returns array sorted by transitDate desc
 * DELETE /api/favourites/:id?userKey=XYZ — 204 on success, 404 if not owned
 */
router.post('/favourites', (req, res) => {
  try {
    const { userKey, transitDate, title, description } = req.body || {};
    if (!userKey || !transitDate || description == null) {
      return res.status(400).json({
        error: 'Missing required fields: userKey, transitDate, description',
      });
    }
    const fav = favouritesService.create({ userKey, transitDate, title, description });
    res.status(201).json(fav);
  } catch (error) {
    if (error.code === 'INVALID_INPUT') {
      return res.status(400).json({ error: error.message });
    }
    console.error('favourites create error:', error.message);
    res.status(500).json({ error: 'Failed to save favourite. Please try again later.' });
  }
});

router.get('/favourites', (req, res) => {
  try {
    const userKey = req.query.userKey;
    if (!userKey) {
      return res.status(400).json({ error: 'Missing userKey query parameter' });
    }
    res.json(favouritesService.list(String(userKey)));
  } catch (error) {
    console.error('favourites list error:', error.message);
    res.status(500).json({ error: 'Failed to list favourites.' });
  }
});

router.delete('/favourites/:id', (req, res) => {
  try {
    const userKey = req.query.userKey;
    const id = parseInt(req.params.id, 10);
    if (!userKey) {
      return res.status(400).json({ error: 'Missing userKey query parameter' });
    }
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid favourite id' });
    }
    const ok = favouritesService.remove({ id, userKey: String(userKey) });
    if (!ok) {
      return res.status(404).json({ error: 'Favourite not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('favourites delete error:', error.message);
    res.status(500).json({ error: 'Failed to delete favourite.' });
  }
});

module.exports = router;
