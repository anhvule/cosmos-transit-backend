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

  // ── Group events: each primary event absorbs trailing ruler/dispositor events
  // ── Then filter transit_house groups by ingress, and nest rulers on each event
  const RULER_TYPES = new Set(['ruler', 'dispositor']);

  const planetDataMap = Object.fromEntries(
    (result.transitPlanets || []).map(p => [p.name, p]),
  );

  const isIngress = planet => {
    const pd = planetDataMap[planet];
    if (!pd || pd.sidereal_abs_pos == null || pd.speed == null) return true;
    const todayEod     = (pd.sidereal_abs_pos + pd.speed * 0.5 + 360) % 360;
    const yesterdayEod = (pd.sidereal_abs_pos - pd.speed * 0.5 + 360) % 360;
    return Math.floor(todayEod / 30) !== Math.floor(yesterdayEod / 30);
  };

  // Step 1 — group consecutive ruler/dispositor events under their primary event
  const groups = [];
  let cur = null;
  for (const e of result.transitEvents) {
    if (!RULER_TYPES.has(e.type)) {
      cur = { primary: e, rulers: [] };
      groups.push(cur);
    } else if (cur) {
      cur.rulers.push(e);
    }
  }

  // Step 2 — filter transit_house groups by ingress (orphaned rulers are auto-dropped)
  const filteredGroups = groups.filter(g =>
    g.primary.type !== 'transit_house' || isIngress(g.primary.planet),
  );

  // Step 3 — flatten with rulers nested on each primary event
  result.transitEvents = filteredGroups.map(g => ({ ...g.primary, rulers: g.rulers }));

  return result;
}

module.exports = {
  getNatalTransits,
  getNatalTransitsAndReport,
  calculateTransitReport,
};
