const express = require('express');
const router = express.Router();
const { calculateEssenceCycle } = require('../services/essence-cycle');
const { getMonthlyPrediction } = require('../services/monthly-prediction');
const { getWealthAnalysis } = require('../services/wealth-analysis');
const { resolveTimezoneOrRespond } = require('./_helpers');

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

module.exports = router;
