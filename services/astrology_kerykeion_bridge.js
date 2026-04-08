/**
 * Node.js bridge to the kerykeion-powered Python transit engine.
 *
 * Drop-in replacement for astrology.js — exports the same function signatures
 * so reading.js only needs a one-line import swap.
 *
 * Instead of calling the external AstrologyAPI, this spawns a Python child
 * process that uses kerykeion (Swiss Ephemeris) for local calculations.
 */

const { execFile } = require('child_process');
const path = require('path');

const PYTHON_SCRIPT = path.join(__dirname, 'astrology_kerykeion.py');
const PYTHON_BIN = process.env.PYTHON_BIN || 'python3';

/**
 * Call the Python kerykeion script with JSON input/output.
 *
 * @param {Object} input - JSON payload to send to Python stdin
 * @returns {Promise<Object>} Parsed JSON response from Python stdout
 */
function callPython(input) {
  return new Promise((resolve, reject) => {
    const child = execFile(
      PYTHON_BIN,
      [PYTHON_SCRIPT, '--json'],
      { timeout: 30000, maxBuffer: 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          console.error('Python bridge error:', stderr || error.message);
          return reject(new Error(`Kerykeion calculation failed: ${stderr || error.message}`));
        }
        try {
          const result = JSON.parse(stdout.trim());
          if (result.error) {
            return reject(new Error(`Kerykeion error: ${result.error}`));
          }
          resolve(result);
        } catch (parseErr) {
          console.error('Python bridge parse error. stdout:', stdout);
          reject(new Error('Failed to parse kerykeion response'));
        }
      },
    );

    // Send JSON input to Python's stdin
    child.stdin.write(JSON.stringify(input));
    child.stdin.end();
  });
}

/**
 * Fetch natal (sidereal + tropical) and transit (tropical) planet data.
 *
 * Same signature as getNatalTransits() in astrology.js — accepts birthData
 * and optional transitDate, returns { natalPlanets, natalPlanetsTropical, transitPlanets }.
 *
 * @param {Object} birthData - { birthDate, birthTime, latitude, longitude, timezone }
 * @param {string} [transitDate] - "YYYY-MM-DD" or null for today
 * @returns {Promise<{natalPlanets, natalPlanetsTropical, transitPlanets}>}
 */
async function getNatalTransits(birthData, transitDate) {
  const input = {
    birthDate: birthData.birthDate,
    birthTime: birthData.birthTime,
    latitude: birthData.latitude,
    longitude: birthData.longitude,
    timezone: birthData.timezone || 'Asia/Ho_Chi_Minh',
    transitDate: transitDate || null,
  };

  console.log('Calling kerykeion with:', input);
  const result = await callPython(input);

  console.log(
    'Kerykeion sidereal natal:',
    result.natalPlanets.map(p => `${p.name}:h${p.house}`).join(', '),
  );
  console.log(
    'Kerykeion tropical transit:',
    result.transitPlanets.map(p => `${p.name}:${p.sign}`).join(', '),
  );

  return {
    natalPlanets: result.natalPlanets,
    natalPlanetsTropical: result.natalPlanetsTropical,
    transitPlanets: result.transitPlanets,
  };
}

/**
 * Calculate the full transit report.
 *
 * Note: When using the bridge, transit events are already computed by Python
 * in getNatalTransits(). This function is provided for API compatibility with
 * astrology.js but can also be called separately if needed.
 *
 * @param {Array} natalPlanets - Sidereal natal planet data
 * @param {Array} natalPlanetsTropical - Tropical natal planet data
 * @param {Array} transitPlanets - Tropical transit planet data
 * @returns {Array} Transit events array
 */
function calculateTransitReport(natalPlanets, natalPlanetsTropical, transitPlanets) {
  // This is a passthrough — the Python bridge already computed events.
  // If called directly, we'd need to call Python again, but in practice
  // the full pipeline (getNatalTransitsAndReport) is used instead.
  throw new Error(
    'calculateTransitReport() should not be called directly with the kerykeion bridge. ' +
    'Use getNatalTransitsAndReport() instead, or access transitEvents from getNatalTransits().'
  );
}

/**
 * Combined fetch + calculate in a single Python call (more efficient).
 *
 * This is the recommended method — it does everything in one Python process
 * invocation instead of two.
 *
 * @param {Object} birthData - { birthDate, birthTime, latitude, longitude, timezone }
 * @param {string} [transitDate] - "YYYY-MM-DD" or null for today
 * @returns {Promise<{natalPlanets, natalPlanetsTropical, transitPlanets, transitEvents}>}
 */
async function getNatalTransitsAndReport(birthData, transitDate) {
  const input = {
    birthDate: birthData.birthDate,
    birthTime: birthData.birthTime,
    latitude: birthData.latitude,
    longitude: birthData.longitude,
    timezone: birthData.timezone || 'Asia/Ho_Chi_Minh',
    transitDate: transitDate || null,
  };

  console.log('Calling kerykeion (full report) with:', input);
  const result = await callPython(input);

  console.log(
    'Kerykeion sidereal natal:',
    result.natalPlanets.map(p => `${p.name}:h${p.house}`).join(', '),
  );
  console.log(
    'Kerykeion transit events:',
    result.transitEvents.map(e => e.description).join(' | '),
  );

  return result;
}

/**
 * Call the Python kerykeion script in batch mode (multiple transit dates,
 * single Python process invocation).
 *
 * @param {Object} input - JSON payload including transitDates array
 * @returns {Promise<Object>} { results: { "YYYY-MM-DD": [...events] } }
 */
function callPythonBatch(input) {
  return new Promise((resolve, reject) => {
    const child = execFile(
      PYTHON_BIN,
      [PYTHON_SCRIPT, '--json-batch'],
      { timeout: 120000, maxBuffer: 4 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          console.error('Python batch error:', stderr || error.message);
          return reject(new Error(`Kerykeion batch failed: ${stderr || error.message}`));
        }
        try {
          const result = JSON.parse(stdout.trim());
          if (result.error) return reject(new Error(`Kerykeion error: ${result.error}`));
          resolve(result);
        } catch (parseErr) {
          console.error('Python batch parse error. stdout:', stdout);
          reject(new Error('Failed to parse kerykeion batch response'));
        }
      },
    );
    child.stdin.write(JSON.stringify(input));
    child.stdin.end();
  });
}

/**
 * For every day in the given month, return dates where at least one of the
 * requested event descriptions appears in the transit report.
 *
 * @param {Object} birthData - { birthDate, birthTime, latitude, longitude, timezone }
 * @param {string} month     - "YYYY-MM"
 * @param {string[]} events  - Event description strings to match (base name, no qualifier)
 * @returns {Promise<string[]>} Array of "YYYY-MM-DD" strings that matched
 */
async function getMatchingDatesForMonth(birthData, month, events) {
  const [year, mon] = month.split('-').map(Number);
  const daysInMonth = new Date(year, mon, 0).getDate();

  const transitDates = Array.from({ length: daysInMonth }, (_, i) => {
    const d = String(i + 1).padStart(2, '0');
    return `${month}-${d}`;
  });

  const eventSet = new Set(
    events.map(e => e.replace(/\s*:\s*(Exact|Starts|Ends)$/, '').trim().toLowerCase()),
  );

  // Compute the day before the month (last day of previous month) for the
  // :Starts baseline and aspect seeding.  Use arithmetic formatting to avoid
  // UTC/local-time mismatch that toISOString() would introduce on UTC+ machines.
  const prevMonthLastDay = new Date(year, mon - 1, 0).getDate(); // e.g. 31 for March
  const prevMonthNum = mon === 1 ? 12 : mon - 1;
  const prevMonthYear = mon === 1 ? year - 1 : year;
  const baselineDateStr = `${prevMonthYear}-${String(prevMonthNum).padStart(2, '0')}-${String(prevMonthLastDay).padStart(2, '0')}`;

  // For house-ingress detection on day 1 of the month, compare against the
  // SECOND-to-last day of the previous month.  This ensures that if a planet
  // ingresses on the very last day of the previous month (the baseline date),
  // day 1 of this month still sees the house change and fires the transit event.
  const houseBaselineDay = prevMonthLastDay - 1; // always ≥ 1 (shortest month = Feb with 28d)
  const houseBaselineDateStr = `${prevMonthYear}-${String(prevMonthNum).padStart(2, '0')}-${String(houseBaselineDay).padStart(2, '0')}`;

  // Add a one-day lookahead (1st of next month) so that the :Ends / :Exact
  // pre-passes can peek beyond month end.  This prevents falsely firing :Ends
  // on the last day of the month when the aspect window actually continues into
  // the next month.  Arithmetic formatting avoids the UTC/local-time mismatch.
  const lookaheadMonNum = mon === 12 ? 1 : mon + 1;
  const lookaheadYear = mon === 12 ? year + 1 : year;
  const lookaheadDateStr = `${lookaheadYear}-${String(lookaheadMonNum).padStart(2, '0')}-01`;
  // Include houseBaselineDateStr in the batch so Python computes planetHouses for it.
  // It is prepended so the sorted all_dates in Python includes it; it will not appear
  // in the returned transitDates loop (JS only iterates April 1–30).
  const batchDates = [houseBaselineDateStr, ...transitDates, lookaheadDateStr];

  const input = {
    birthDate: birthData.birthDate,
    birthTime: birthData.birthTime,
    latitude: birthData.latitude,
    longitude: birthData.longitude,
    timezone: birthData.timezone || 'Asia/Ho_Chi_Minh',
    transitDates: batchDates,
    baselineDate: baselineDateStr,
  };

  const { results, planetHouses, baselineEvents } = await callPythonBatch(input);

  // ruler/dispositor events are permanent natal-chart facts — they appear on
  // every day and are meaningless for calendar matching.
  const STATIC_TYPES = new Set(['ruler', 'dispositor']);

  // ── Pre-pass: for each aspect : Exact event, find the LAST day of each
  // consecutive run (mirrors the : Ends / : Starts approach).
  // The planner defines "Exact day" as the last day the aspect stays within the
  // 1° orb window — not the astronomical minimum-orb day — so we use the same
  // last-consecutive-run logic as : Ends.
  // Slow planets (Jupiter/Saturn) use a tighter 0.6° orb for "Exact day"
  // because their aspect window can span 10+ days at 1° orb. The planner's
  // exact date matches the last day the orb stays below 0.6°.
  // Personal planets keep the standard 1° window (no cap needed).
  const SLOW_PLANETS_SET = new Set(['Jupiter', 'Saturn']);
  const exactOrbCap = e => SLOW_PLANETS_SET.has(e.transitPlanet) ? 0.6 : Infinity;

  const exactLastDay = new Set(); // "date|base_desc"
  for (let i = 0; i < batchDates.length; i++) {
    const date = batchDates[i];
    const nextDate = batchDates[i + 1];
    for (const e of results[date] || []) {
      // ── Regular aspects ──
      if (
        e.type === 'aspect' &&
        (e.description || '').endsWith(': Exact') &&
        (typeof e.orb !== 'number' || e.orb < exactOrbCap(e))
      ) {
        const base = e.description.replace(/\s*:\s*Exact$/, '').trim().toLowerCase();
        const nextHasIt = nextDate && (results[nextDate] || []).some(ne =>
          ne.type === 'aspect' &&
          (ne.description || '').endsWith(': Exact') &&
          (typeof ne.orb !== 'number' || ne.orb < exactOrbCap(ne)) &&
          ne.description.replace(/\s*:\s*Exact$/, '').trim().toLowerCase() === base,
        );
        if (!nextHasIt) {
          exactLastDay.add(`${date}|${base}`);
        }
      }
      // ── MC/ASC aspects: only APPROACHING :Exact days (not separating) ──
      // The :Exact milestone for chart-angle aspects is the last approaching day
      // within the 0.6° window. Separating :Exact days (inside 1° but past the
      // minimum) are suppressed — they belong to the :Ends phase.
      if (
        e.type === 'mc_aspect' &&
        (e.description || '').endsWith(': Exact') &&
        e.separating === false &&
        (typeof e.orb !== 'number' || e.orb < exactOrbCap(e))
      ) {
        const base = e.description.replace(/\s*:\s*Exact$/, '').trim().toLowerCase();
        const nextHasIt = nextDate && (results[nextDate] || []).some(ne =>
          ne.type === 'mc_aspect' &&
          (ne.description || '').endsWith(': Exact') &&
          ne.separating === false &&
          (typeof ne.orb !== 'number' || ne.orb < exactOrbCap(ne)) &&
          ne.description.replace(/\s*:\s*Exact$/, '').trim().toLowerCase() === base,
        );
        if (!nextHasIt) {
          exactLastDay.add(`${date}|${base}`);
        }
      }
    }
  }

  // ── Pre-pass: for each aspect : Ends event, find the last day of each
  // consecutive run (mirrors : Starts which shows the first day of its run).
  // Applies to all transit planets.
  // A day is the "last" when the NEXT day does not carry the same : Ends event.
  const endsLastDay = new Set(); // "date|base_desc"
  for (let i = 0; i < batchDates.length; i++) {
    const date = batchDates[i];
    const nextDate = batchDates[i + 1]; // undefined on the last day of batchDates
    for (const e of results[date] || []) {
      // ── Regular aspects ──
      if (e.type === 'aspect' && (e.description || '').endsWith(': Ends')) {
        // Slow planets: allow up to 4° (section 8c emits up to 3.5°; the extra
        // margin keeps the cap from clipping the final day).
        // Personal planets: cap at 3° to exclude large-orb primary-story : Ends
        // events that bleed beyond section 7b's window.
        const orbCap = SLOW_PLANETS_SET.has(e.transitPlanet) ? 4 : 3;
        if (typeof e.orb === 'number' && e.orb >= orbCap) continue;

        const base = e.description.replace(/\s*:\s*Ends$/, '').trim().toLowerCase();
        const nextHasIt = nextDate && (results[nextDate] || []).some(ne =>
          ne.type === 'aspect' &&
          (ne.description || '').endsWith(': Ends') &&
          (typeof ne.orb !== 'number' || ne.orb < (SLOW_PLANETS_SET.has(ne.transitPlanet) ? 4 : 3)) &&
          ne.description.replace(/\s*:\s*Ends$/, '').trim().toLowerCase() === base,
        );
        if (!nextHasIt) {
          endsLastDay.add(`${date}|${base}`);
        }
      }
      // ── MC/ASC aspects: cap :Ends at 3° so only the planner's window fires ──
      if (e.type === 'mc_aspect' && (e.description || '').endsWith(': Ends')) {
        const MC_ENDS_ORB_CAP = 3;
        if (typeof e.orb === 'number' && e.orb >= MC_ENDS_ORB_CAP) continue;

        const base = e.description.replace(/\s*:\s*Ends$/, '').trim().toLowerCase();
        const nextHasIt = nextDate && (results[nextDate] || []).some(ne =>
          ne.type === 'mc_aspect' &&
          (ne.description || '').endsWith(': Ends') &&
          (typeof ne.orb !== 'number' || ne.orb < MC_ENDS_ORB_CAP) &&
          ne.description.replace(/\s*:\s*Ends$/, '').trim().toLowerCase() === base,
        );
        if (!nextHasIt) {
          endsLastDay.add(`${date}|${base}`);
        }
      }
    }
  }

  // Seed the "active starts" set from the baseline day so we don't re-trigger
  // a : Starts event that was already active on the last day of the prior month.
  const activeStarts = new Set(
    (baselineEvents || [])
      .filter(e => (e.description || '').endsWith(': Starts'))
      .map(e => e.description),
  );

  return transitDates
    .map((date, idx) => {
      const dayEvents = results[date] || [];

      // Previous day for house-ingress comparison.
      // Day 1 uses houseBaselineDateStr (second-to-last day of the prior month)
      // so a planet that ingressed on the very last day of the previous month
      // (the baseline date) is still detected as a house change on day 1.
      const prevDate = idx === 0 ? houseBaselineDateStr : transitDates[idx - 1];
      const prevHouses = planetHouses[prevDate] || {};
      const currHouses = planetHouses[date] || {};

      // Build today's active : Starts descriptions (before filtering)
      const todayStarts = new Set(
        dayEvents
          .filter(e => (e.description || '').endsWith(': Starts'))
          .map(e => e.description),
      );

      const matched = dayEvents
        .filter(e => {
          if (STATIC_TYPES.has(e.type)) return false;

          // For non-Moon transit_house: only match on the true ingress day.
          if (e.type === 'transit_house' && e.planet !== 'Moon') {
            if ((prevHouses[e.planet] ?? null) === (currHouses[e.planet] ?? null)) return false;
          }

          // Aspect events without a qualifier (plain approaching primary aspects)
          // are active every day within the orb window and carry no calendar
          // significance. Only :Starts / :Exact / :Ends are meaningful milestones.
          if (e.type === 'aspect' && !/:\s*(Starts|Exact|Ends)$/.test(e.description || '')) {
            return false;
          }

          // For any aspect : Exact — only keep the last day of the consecutive
          // orb<1° window (matches the planner's "Exact day" convention).
          if (e.type === 'aspect' && (e.description || '').endsWith(': Exact')) {
            const base = e.description.replace(/\s*:\s*Exact$/, '').trim().toLowerCase();
            if (!exactLastDay.has(`${date}|${base}`)) return false;
          }

          // For mc_aspect : Exact — suppress separating :Exact days (orb rising
          // after the minimum); only the last APPROACHING day within the cap fires.
          if (e.type === 'mc_aspect' && (e.description || '').endsWith(': Exact')) {
            if (e.separating) return false; // past the minimum — belongs to :Ends phase
            const base = e.description.replace(/\s*:\s*Exact$/, '').trim().toLowerCase();
            if (!exactLastDay.has(`${date}|${base}`)) return false;
          }

          // For any aspect : Ends — only keep the last day of each consecutive
          // run (mirrors : Starts which keeps the first day of its run).
          if (e.type === 'aspect' && (e.description || '').endsWith(': Ends')) {
            const base = e.description.replace(/\s*:\s*Ends$/, '').trim().toLowerCase();
            if (!endsLastDay.has(`${date}|${base}`)) return false;
          }

          // For mc_aspect : Ends — only keep the last day within the 3° cap.
          if (e.type === 'mc_aspect' && (e.description || '').endsWith(': Ends')) {
            const base = e.description.replace(/\s*:\s*Ends$/, '').trim().toLowerCase();
            if (!endsLastDay.has(`${date}|${base}`)) return false;
          }

          // For : Starts aspects: only show the first day the aspect enters its
          // approach window. If the same : Starts description was present on the
          // previous day it's a continuation, not a new start.
          if ((e.description || '').endsWith(': Starts')) {
            if (activeStarts.has(e.description)) return false;
          }

          const base = (e.description || '')
            .replace(/\s*:\s*(Exact|Starts|Ends)$/, '')
            .trim()
            .toLowerCase();
          return eventSet.has(base);
        })
        .map(e => e.description);

      // Advance active-starts window: keep only descriptions still present today
      activeStarts.clear();
      for (const d of todayStarts) activeStarts.add(d);

      return { date, events: matched };
    })
    .filter(entry => entry.events.length > 0);
}

module.exports = {
  getNatalTransits,
  getNatalTransitsAndReport,
  calculateTransitReport,
  getMatchingDatesForMonth,
};
