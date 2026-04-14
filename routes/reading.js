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

    let transitEvents;

    // Kerykeion path: single Python call returns everything
    const result = await astrologyService.getNatalTransitsAndReport(
      { birthDate, birthTime, latitude, longitude, timezone },
      transitDate,
    );
    transitEvents = result.transitEvents;

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
