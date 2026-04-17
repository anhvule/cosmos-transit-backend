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

// Pre-compile lookup statement for performance
const lookupEvent = db.prepare('SELECT description FROM events WHERE name = ?');

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

router.post('/debug', async (req, res) => {
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
    const exactOrbCap = e => SLOW_PLANETS_SET.has(e.transitPlanet) ? 0.6 : 0.85;

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
        if (!NODE_PLANETS.has(e.transitPlanet)) continue;
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
    // Only keep the last day of each :Ends run WITHIN the 1.5° orb window —
    // beyond that, the aspect has cooled off and subsequent :Ends days are
    // noise (separating orb drifts for many days post-exact for personal
    // planets before Python's 3° cutoff).  Using a 1.5° cap keeps the
    // milestone day aligned with the planner's convention: the first
    // day the aspect has noticeably separated (~1-day post-exact).
    const ENDS_ORB_CAP = 1.5;
    const tomorrowEnds = new Set(
      (tomorrowResult.transitEvents || [])
        .filter(e =>
          e.type === 'aspect' &&
          (e.description || '').endsWith(': Ends') &&
          (typeof e.orb !== 'number' || e.orb < ENDS_ORB_CAP),
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
        // Nodes: only keep local-minimum orb day of the run.
        if (NODE_PLANETS.has(e.transitPlanet)) {
          if (typeof e.orb !== 'number') return false;
          const yOrb = yesterdayNodeOrbs.get(base);
          const tOrb = tomorrowNodeOrbs.get(base);
          if (yOrb != null && e.orb > yOrb) return false;
          if (tOrb != null && e.orb > tOrb) return false;
        } else {
          // Drop if tomorrow still carries the same :Exact aspect (not last day of run)
          if (tomorrowExact.has(base)) return false;
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
        if (!isNode && typeof e.orb === 'number' && e.orb >= ENDS_ORB_CAP) return false;
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
      // For mc_aspect :Exact — only keep the last approaching day (mirrors calendar).
      // Separating :Exact days (past the minimum orb) belong to the :Ends phase.
      if (e.type === 'mc_aspect' && desc.endsWith(': Exact')) {
        if (e.separating) return false;
        const base = desc.replace(/\s*:\s*Exact$/, '').trim().toLowerCase();
        if (typeof e.orb === 'number' && e.orb >= exactOrbCap(e)) return false;
        if (tomorrowMcExact.has(base)) return false;
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
        interpretation: getEventInterpretation(e.description),
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
