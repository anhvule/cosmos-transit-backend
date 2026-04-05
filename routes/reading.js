const express = require('express');
const router = express.Router();

// ── Engine selection ────────────────────────────────────────────────────────
// Set ASTROLOGY_ENGINE=kerykeion in .env to use local Swiss Ephemeris (Python).
// Default: 'api' (external AstrologyAPI — original behavior).
const useKerykeion = process.env.ASTROLOGY_ENGINE === 'kerykeion';

let astrologyService;
astrologyService = require('../services/astrology_kerykeion_bridge');
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
      transitEvents: transitEvents.map(e => ({
        type: e.type,
        description: e.description,
        interpretation: getEventInterpretation(e.description),
      })),
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
    });
  } catch (error) {
    console.error('Reading endpoint error:', error.message);
    res.status(500).json({
      error: 'Failed to generate reading. Please try again later.',
    });
  }
});

module.exports = router;
