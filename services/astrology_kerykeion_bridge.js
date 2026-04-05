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

  // Compute the day before the month so we know each planet's starting house.
  // This lets us detect true ingresses (house changes) rather than relying on
  // whether the transit_house event was emitted that day (it's suppressed on
  // days when the planet has an active primary aspect).
  const baselineDateObj = new Date(year, mon - 1, 0); // last day of previous month
  const baselineDateStr = baselineDateObj.toISOString().substring(0, 10);

  const input = {
    birthDate: birthData.birthDate,
    birthTime: birthData.birthTime,
    latitude: birthData.latitude,
    longitude: birthData.longitude,
    timezone: birthData.timezone || 'Asia/Ho_Chi_Minh',
    transitDates,
    baselineDate: baselineDateStr,
  };

  const { results, planetHouses, baselineEvents } = await callPythonBatch(input);

  // ruler/dispositor events are permanent natal-chart facts — they appear on
  // every day and are meaningless for calendar matching.
  const STATIC_TYPES = new Set(['ruler', 'dispositor']);

  // ── Pre-pass: for each aspect : Exact event, find the single day with the
  // minimum orb (the true peak-exact day) across the full month.
  // Applies to all transit planets — even fast ones can span multiple orb<1° days.
  // key = base description (without qualifier), value = { date, orb }
  const exactPeak = {}; // base_desc -> { date, orb }
  for (const date of transitDates) {
    for (const e of results[date] || []) {
      if (e.type === 'aspect' && (e.description || '').endsWith(': Exact')) {
        const base = e.description.replace(/\s*:\s*Exact$/, '').trim().toLowerCase();
        const orb = typeof e.orb === 'number' ? e.orb : Infinity;
        if (!exactPeak[base] || orb < exactPeak[base].orb) {
          exactPeak[base] = { date, orb };
        }
      }
    }
  }

  // ── Pre-pass: for each aspect : Ends event, find the last day of each
  // consecutive run (mirrors : Starts which shows the first day of its run).
  // Applies to all transit planets.
  // A day is the "last" when the NEXT day does not carry the same : Ends event.
  const endsLastDay = new Set(); // "date|base_desc"
  for (let i = 0; i < transitDates.length; i++) {
    const date = transitDates[i];
    const nextDate = transitDates[i + 1]; // undefined on the last day of the month
    for (const e of results[date] || []) {
      if (e.type === 'aspect' && (e.description || '').endsWith(': Ends')) {
        const base = e.description.replace(/\s*:\s*Ends$/, '').trim().toLowerCase();
        const nextHasIt = nextDate && (results[nextDate] || []).some(ne =>
          ne.type === 'aspect' &&
          (ne.description || '').endsWith(': Ends') &&
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

      // Previous day for house-ingress comparison
      const prevDate = idx === 0 ? baselineDateStr : transitDates[idx - 1];
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

          // For any aspect : Exact — only keep the single peak (minimum-orb) day.
          if (e.type === 'aspect' && (e.description || '').endsWith(': Exact')) {
            const base = e.description.replace(/\s*:\s*Exact$/, '').trim().toLowerCase();
            if (exactPeak[base]?.date !== date) return false;
          }

          // For any aspect : Ends — only keep the last day of each consecutive
          // run (mirrors : Starts which keeps the first day of its run).
          if (e.type === 'aspect' && (e.description || '').endsWith(': Ends')) {
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
