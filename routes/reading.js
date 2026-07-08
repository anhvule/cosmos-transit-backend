const express = require('express');
const router = express.Router();

// ── Engine selection ────────────────────────────────────────────────────────
// Set ASTROLOGY_ENGINE=kerykeion in .env to use local Swiss Ephemeris (Python).
// Default: 'api' (external AstrologyAPI — original behavior).
const useKerykeion = process.env.ASTROLOGY_ENGINE === 'kerykeion';

let astrologyService;
astrologyService = require('../services/astrology_kerykeion_bridge');
console.log('Astrology engine: kerykeion (local Swiss Ephemeris)');

const { computeDashaAtDate, computeDashaRange, getNakshatra } = require('../services/dasha');
const { annotatePeriods, annotatePeriod, planetMap } = require('../services/investment-dasha');
const { calculateEssenceCycle } = require('../services/essence-cycle');
const { getYearlySummary } = require('../services/varshaphal');
const { getMonthlyPrediction } = require('../services/monthly-prediction');
const { getWealthAnalysis } = require('../services/wealth-analysis');
const { resolveTimezone, TimezoneError } = require('../services/timezone');
const { legacyLensLookup, pandaLookup } = require('../services/interpretations');
const { computeFilteredEvents, ascendantFromResult } = require('../services/event-filter');
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
 * Merge a formatted dasha period (planet/start/end/description) with its
 * favorability annotation (favorable/reasons/warnings). Returns null when
 * `formatted` is null (i.e. the level wasn't computed). Both inputs are
 * expected to refer to the same period — only one set of fields is kept
 * per key, with the formatted (planet/dates/description) winning on
 * shared keys.
 */
function mergePeriod(formatted, annotation) {
  if (!formatted) return null;
  if (!annotation) return formatted;
  return {
    ...formatted,
    favorable: annotation.favorable,
    reasons: annotation.reasons,
    warnings: annotation.warnings,
  };
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
        aspects: transitEvents.filter(e => e.description).map(e => ({
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

    const aspects = events.filter(e => e.description).map(e => ({
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

router.post('/career', makeDebugHandler(legacyLensLookup('career')));
router.post('/relationship', makeDebugHandler(legacyLensLookup('relationship')));
router.post('/advice', makeDebugHandler(legacyLensLookup('advice')));
router.post('/food', makeDebugHandler(legacyLensLookup('food')));

// ── /api/panda/* routes ──────────────────────────────────────────────
// Same kerykeion call + same response shape as the legacy routes above;
// interpretation resolves ascendant-specific text first, then the
// generic ('*') template set.
router.post('/panda/career',       makeDebugHandler(pandaLookup('career')));
router.post('/panda/relationship', makeDebugHandler(pandaLookup('relationship')));

router.post('/investment-weekly', makePeriodHandler('week', legacyLensLookup('investment')));
router.post('/investment-monthly', makePeriodHandler('month', legacyLensLookup('investment')));

/**
 * POST /api/market-signal
 *
 * Predict the speculative-market posture (favourable / cautious / normal) for
 * a single transit date by running the SuddenGainSigns and SuddenLossesSigns
 * rule sets against three bundled famous-investor charts:
 *   - Stanley Druckenmiller (top-down macro · momentum)
 *   - Bill Ackman          (activist · concentrated equity)
 *   - George Soros         (reflexivity · contrarian macro)
 *
 * The verdict is the aggregation across the three charts — same premise as
 * /api/caution-dates, but applied per-date via the gain/loss rule sets rather
 * than via the dasha layer. See services/market-signal.js for the rationale.
 *
 * Request body:
 * {
 *   "transitDate": "2026-05-17"  // optional; defaults to today (UTC)
 * }
 *
 * Response:
 * {
 *   "transitDate": "2026-05-17",
 *   "investors":   [{ key, name, style }, ...],
 *   "day": { date, verdict, confidence, summary, perInvestor: [...] }
 * }
 */
router.post('/market-signal', async (req, res) => {
  try {
    const raw = (req.body && req.body.transitDate) || new Date().toISOString().substring(0, 10);
    const date = new Date(raw).toISOString().substring(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'transitDate must be YYYY-MM-DD' });
    }
    const { computeMarketSignal } = require('../services/market-signal');
    const { investors, days } = await computeMarketSignal([date]);
    res.json({ transitDate: date, investors, day: days[0] });
  } catch (error) {
    console.error('market-signal endpoint error:', error.message);
    res.status(500).json({ error: 'Failed to compute market signal. Please try again later.' });
  }
});

/**
 * POST /api/market-signal-weekly
 *
 * Same as /api/market-signal but for an entire Mon–Sun window. Used by the
 * weekly UI to render a 7-day market-posture strip.
 *
 * Request body:
 * {
 *   "weekStart": "2026-05-11"  // YYYY-MM-DD (Monday). Required.
 * }
 *
 * Response:
 * {
 *   "weekStart": "2026-05-11",
 *   "weekEnd":   "2026-05-17",
 *   "investors": [...],
 *   "days":      [{ date, verdict, confidence, summary, perInvestor }, ... 7 entries ]
 * }
 */
router.post('/market-signal-weekly', async (req, res) => {
  try {
    const weekStart = req.body && req.body.weekStart;
    if (!weekStart || !/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) {
      return res.status(400).json({ error: 'weekStart must be in YYYY-MM-DD format' });
    }
    const { computeMarketSignal, weekDates } = require('../services/market-signal');
    const dates = weekDates(weekStart);
    const { investors, days } = await computeMarketSignal(dates);
    res.json({
      weekStart,
      weekEnd: dates[dates.length - 1],
      investors,
      days,
    });
  } catch (error) {
    console.error('market-signal-weekly endpoint error:', error.message);
    res.status(500).json({ error: 'Failed to compute weekly market signal. Please try again later.' });
  }
});

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

    // Fetch natal chart only — the transit overlay was empirically
    // unhelpful on AMZN/SPX backtests (~40% accuracy, no better than
    // baseline) so we no longer pass transitDate or compute transits
    // here. The natal-only dasha is what the docs actually validate.
    const dateStr = transitDate
      ? new Date(transitDate).toISOString().substring(0, 10)
      : new Date().toISOString().substring(0, 10);
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

    // Investment-favorability annotation — needs the natal chart (already
    // fetched above) to evaluate each dasha lord against the
    // SuddenGainSigns + Dasha.docx ruleset. We thread the parent dasha
    // lord into each level so the MD–AD pair rule (Mercury–Sun, etc.)
    // and the Mahadasha-only "speculation MD" rule (Rahu/Mercury/Mars)
    // can fire correctly.
    //
    // The endpoint returns ONLY favorable periods now (per Dasha.docx
    // request). The active MD/AD/PD/SD always come back with their own
    // favorability flag so the UI can color-code "you're in a good window
    // right now" without filtering them out.
    const natalMap = planetMap(natalPlanets);
    const mdPlanet = result.mahadasha?.planet;
    const adPlanet = result.antardasha?.planet;
    const pdPlanet = result.pratyantardasha?.planet;
    const allAds = annotatePeriods(result.antardashas, natalMap, {
      parentPlanet: mdPlanet,
      level: 'antardasha',
    });
    const allPds = annotatePeriods(result.pratyantardashas, natalMap, {
      parentPlanet: adPlanet,
      level: 'pratyantardasha',
    });
    const allSds = annotatePeriods(result.sookshmadashas, natalMap, {
      parentPlanet: pdPlanet,
      level: 'sookshmadasha',
    });

    // (Transit overlay was tested empirically against AMZN and S&P 500
    // milestones and added ~zero accuracy lift — natal-only dasha is
    // what we ship. The evaluateTransitOverlay function is still
    // exported from investment-dasha.js for potential future use, but
    // /api/dasha intentionally does not call it.)

    res.json({
      date: dateStr,
      moonLongitude,
      nakshatra: result.nakshatra,
      // Active MD/AD/PD/SD with their favorability flags merged in. The
      // legacy `description` field stays so old clients keep rendering
      // the human-readable mahadasha text.
      mahadasha: mergePeriod(
        fmt(result.mahadasha, mdDesc),
        annotatePeriod(result.mahadasha, natalMap, { level: 'mahadasha' }),
      ),
      antardasha: mergePeriod(
        fmt(result.antardasha, adDesc),
        annotatePeriod(result.antardasha, natalMap, {
          parentPlanet: mdPlanet, level: 'antardasha',
        }),
      ),
      pratyantardasha: mergePeriod(
        fmt(result.pratyantardasha, pdDesc),
        annotatePeriod(result.pratyantardasha, natalMap, {
          parentPlanet: adPlanet, level: 'pratyantardasha',
        }),
      ),
      sookshmadasha: mergePeriod(
        fmt(result.sookshmadasha, ''),
        annotatePeriod(result.sookshmadasha, natalMap, {
          parentPlanet: pdPlanet, level: 'sookshmadasha',
        }),
      ),
      // ALL sub-periods, each carrying its favorable / reasons / warnings
      // tag — so the UI can color-code good (green) vs cautious (amber)
      // windows side by side. The `investmentFavorable.*` lists below are
      // a convenience — the filtered subset of these.
      antardashas: allAds,
      pratyantardashas: allPds,
      sookshmadashas: allSds,
      investmentFavorable: {
        antardashas: allAds.filter(p => p.favorable),
        pratyantardashas: allPds.filter(p => p.favorable),
        sookshmadashas: allSds.filter(p => p.favorable),
      },
    });
  } catch (error) {
    console.error('Dasha endpoint error:', error.message);
    res.status(500).json({ error: 'Failed to compute dasha. Please try again later.' });
  }
});

/**
 * POST /api/dasha-range
 *
 * Search for every Vimshottari dasha period (MD/AD/PD/SD) that overlaps a
 * given [fromDate, toDate] window. Each period carries the same
 * `favorable / reasons / warnings` annotation as /api/dasha.
 *
 * Request body:
 * {
 *   "name":      "Alice",
 *   "birthDate": "1991-09-27",
 *   "birthTime": "07:40",
 *   "latitude":  6.9271,
 *   "longitude": 79.8612,
 *   "timezone":  7,
 *   "fromDate":  "2024-01-01",
 *   "toDate":    "2025-12-31"
 * }
 *
 * Response:
 * {
 *   "fromDate": "2024-01-01",
 *   "toDate":   "2025-12-31",
 *   "mahadashas":      [{ planet, parent, startDate, endDate, favorable, reasons, warnings }, ...],
 *   "antardashas":     [...],
 *   "pratyantardashas":[...],
 *   "sookshmadashas":  [...]
 * }
 *
 * Caveat: SD list grows linearly with range width (~100 SDs/year).
 * Caller should cap UI ranges at a few years; we don't truncate here.
 */
router.post('/dasha-range', async (req, res) => {
  try {
    const { name, birthDate, birthTime, latitude, longitude, timezone, fromDate, toDate } = req.body;

    if (!name || !birthDate || !birthTime || latitude == null || longitude == null) {
      return res.status(400).json({
        error: 'Missing required fields: name, birthDate, birthTime, latitude, longitude',
      });
    }
    if (!fromDate || !toDate) {
      return res.status(400).json({ error: 'fromDate and toDate are required (YYYY-MM-DD)' });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(fromDate)) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(String(toDate))) {
      return res.status(400).json({ error: 'fromDate and toDate must be YYYY-MM-DD' });
    }
    const tz = resolveTimezoneOrRespond(timezone, res);
    if (!tz.ok) return;

    const from = new Date(`${fromDate}T00:00:00Z`);
    const to   = new Date(`${toDate}T23:59:59Z`);
    if (!(from < to)) {
      return res.status(400).json({ error: 'fromDate must be before toDate' });
    }
    // Hard cap on range width to keep responses bounded — 10 years of SDs
    // is already ~1000 entries. The UI defaults much smaller.
    const MAX_RANGE_DAYS = 10 * 366;
    const rangeDays = (to - from) / 86400000;
    if (rangeDays > MAX_RANGE_DAYS) {
      return res.status(400).json({
        error: `Range too wide (${Math.round(rangeDays)} days). Max ${MAX_RANGE_DAYS} days supported.`,
      });
    }

    const { natalPlanets } = await astrologyService.getNatalTransits(
      { birthDate, birthTime, latitude, longitude, timezone: tz.timezone },
      null,
    );
    const moon = (natalPlanets || []).find(p => p.name === 'Moon');
    const moonLongitude = moon && (moon.sidereal_abs_pos != null ? moon.sidereal_abs_pos : moon.fullDegree);
    if (moonLongitude == null) {
      return res.status(500).json({ error: 'Could not determine Moon sidereal longitude from natal chart' });
    }

    const birthMoment = new Date(`${birthDate}T${birthTime}:00Z`);
    const range = computeDashaRange(birthMoment, moonLongitude, from, to);

    const natalMap = planetMap(natalPlanets);
    // Annotate each level with its parent so MD–AD pair / level-specific
    // rules fire correctly. The annotatePeriods helper accepts a single
    // parent for the whole list, but here every entry has its own parent
    // (because the search spans multiple MDs), so we annotate inline.
    const { evaluatePeriodForInvestment } = require('../services/investment-dasha');
    const annotateRange = (periods, level) =>
      (periods || []).map(p => {
        const evalResult = evaluatePeriodForInvestment(p.planet, natalMap, {
          parentPlanet: p.parent,
          level,
        });
        return {
          planet: p.planet,
          parent: p.parent || null,
          startDate: p.startDate.toISOString(),
          endDate: p.endDate.toISOString(),
          favorable: evalResult.favorable,
          reasons: evalResult.reasons,
          warnings: evalResult.warnings,
        };
      });

    res.json({
      fromDate,
      toDate,
      mahadashas: annotateRange(range.mahadashas, 'mahadasha'),
      antardashas: annotateRange(range.antardashas, 'antardasha'),
      pratyantardashas: annotateRange(range.pratyantardashas, 'pratyantardasha'),
      sookshmadashas: annotateRange(range.sookshmadashas, 'sookshmadasha'),
    });
  } catch (error) {
    console.error('Dasha-range endpoint error:', error.message);
    res.status(500).json({ error: 'Failed to compute dasha range. Please try again later.' });
  }
});

/**
 * Bundled celebrity charts used by /api/caution-dates. Imported from
 * services/market-signal.js so both endpoints share a single source of
 * truth — and the same rigour bar.
 *
 * The panel is verified-time-only: every chart's birth time is publicly
 * attested (AstroDatabank Rodden rating A or better, or a comparable
 * journalistic citation). Dasha periods depend critically on the natal
 * Moon's exact longitude, which shifts ~0.5°/hour — a 12-hour error on
 * an unknown birth time can move pratyantardasha boundaries by weeks.
 * The previous panel (Druckenmiller / Soros / Ackman-at-noon) used noon
 * placeholders for two of three charts and one wrong time for Ackman;
 * those have been dropped in favour of attested data.
 *
 * Current panel (see services/market-signal.js for source citations):
 *   - Warren Buffett   (Rodden A)
 *   - Bill Ackman      (Bloomberg / Amanda Gordon, 2013)
 *   - Michael Bloomberg(Rodden AA)
 */
const { INVESTOR_PROFILES: CELEBRITY_PROFILES } = require('../services/market-signal');

/**
 * POST /api/caution-dates
 *
 * Returns the union of CAUTION dasha-periods firing on the bundled
 * verified-time celebrity profiles (Buffett, Ackman, Bloomberg) within
 * the given year. Used by the Vimshottari Dasha screen's "Yearly Caution
 * Forecast" section to highlight windows where multiple charts agree the
 * period needs risk-down posture.
 *
 * Request body:
 * {
 *   "year": 2025,
 *   "level": "pratyantardasha"  // optional, default; or "sookshmadasha"
 * }
 *
 * Levels:
 *   - pratyantardasha (default): ~50-100 day windows, practical for
 *     trader risk-dial guidance. ~7-9 PDs per year per profile.
 *   - sookshmadasha: ~5-10 day windows, ~10x more granular. Useful
 *     for narrowing entry/exit timing inside a flagged PD. ~36-50
 *     SDs per year per profile (so the year view can hit 100+ rows).
 *
 * Response:
 * {
 *   "year": 2025,
 *   "level": "pratyantardasha",
 *   "periods": [
 *     {
 *       "profile": "soros",
 *       "profileName": "Soros",
 *       "planet": "Mars",
 *       "parent": "Saturn",
 *       "startDate": "2025-04-12T...",
 *       "endDate": "2025-06-08T...",
 *       "warnings": [...]
 *     },
 *     ...
 *   ]
 * }
 */
const { evaluatePeriodForInvestment: evalPeriod } = require('../services/investment-dasha');

const VALID_CAUTION_LEVELS = new Set(['pratyantardasha', 'sookshmadasha']);

router.post('/caution-dates', async (req, res) => {
  try {
    const yearRaw = req.body && req.body.year;
    const year = parseInt(yearRaw, 10);
    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      return res.status(400).json({
        error: 'year must be an integer between 1900 and 2100',
      });
    }
    const level = (req.body && req.body.level) || 'pratyantardasha';
    if (!VALID_CAUTION_LEVELS.has(level)) {
      return res.status(400).json({
        error: 'level must be "pratyantardasha" or "sookshmadasha"',
      });
    }
    const fromDate = new Date(`${year}-01-01T00:00:00Z`);
    const toDate = new Date(`${year}-12-31T23:59:59Z`);

    const periods = [];
    for (const profile of CELEBRITY_PROFILES) {
      const { natalPlanets } = await astrologyService.getNatalTransits(
        {
          birthDate: profile.birthDate,
          birthTime: profile.birthTime,
          latitude: profile.latitude,
          longitude: profile.longitude,
          timezone: profile.timezone,
        },
        null,
      );
      const moon = (natalPlanets || []).find(p => p.name === 'Moon');
      const moonLon = moon && (moon.sidereal_abs_pos != null ? moon.sidereal_abs_pos : moon.fullDegree);
      if (moonLon == null) continue;
      const natalMap = planetMap(natalPlanets);
      const birthMoment = new Date(`${profile.birthDate}T${profile.birthTime}:00Z`);

      const range = computeDashaRange(birthMoment, moonLon, fromDate, toDate);
      const sourcePeriods = level === 'sookshmadasha'
        ? range.sookshmadashas
        : range.pratyantardashas;

      for (const pd of sourcePeriods) {
        const result = evalPeriod(pd.planet, natalMap, {
          parentPlanet: pd.parent,
          level,
        });
        // CAUTION = no positive reasons but at least one warning fires.
        // We only surface the strict "warnings-only" bucket here, since
        // mixed (some-positives-some-warnings) periods on a contrarian
        // chart are too ambiguous to broadcast as broad-market caution.
        if (result.reasons.length === 0 && result.warnings.length > 0) {
          periods.push({
            profile: profile.key,
            profileName: profile.name,
            planet: pd.planet,
            parent: pd.parent || null,
            startDate: pd.startDate.toISOString(),
            endDate: pd.endDate.toISOString(),
            warnings: result.warnings,
          });
        }
      }
    }
    periods.sort((a, b) => a.startDate.localeCompare(b.startDate));

    res.json({ year, level, periods });
  } catch (error) {
    console.error('Caution-dates endpoint error:', error.message);
    res.status(500).json({ error: 'Failed to compute caution dates. Please try again later.' });
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
