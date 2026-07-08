// Shared plumbing for the /api route modules: timezone resolution, engine
// result fetching, and the single-day / period reading handler factories.
// Moved verbatim from the old routes/reading.js monolith.

const { resolveTimezone, TimezoneError } = require('../services/timezone');
const { computeFilteredEvents, ascendantFromResult } = require('../services/event-filter');

// ── Engine selection ────────────────────────────────────────────────────────
// Set ASTROLOGY_ENGINE=kerykeion in .env to use local Swiss Ephemeris (Python).
// Default: 'api' (external AstrologyAPI — original behavior).
const useKerykeion = process.env.ASTROLOGY_ENGINE === 'kerykeion';

let astrologyService;
astrologyService = require('../services/astrology_kerykeion_bridge');
console.log('Astrology engine: kerykeion (local Swiss Ephemeris)');
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

module.exports = {
  astrologyService,
  resolveTimezoneOrRespond,
  fetchResultsForDates,
  shiftDate,
  dateRange,
  makeDebugHandler,
  aggregatePeriod,
  makePeriodHandler,
};
