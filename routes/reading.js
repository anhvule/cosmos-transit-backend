const express = require('express');
const router = express.Router();

// ── Engine selection ────────────────────────────────────────────────────────
// Set ASTROLOGY_ENGINE=kerykeion in .env to use local Swiss Ephemeris (Python).
// Default: 'api' (external AstrologyAPI — original behavior).
const useKerykeion = process.env.ASTROLOGY_ENGINE === 'kerykeion';

let astrologyService;
if (useKerykeion) {
  astrologyService = require('../services/astrology_kerykeion_bridge');
  console.log('Astrology engine: kerykeion (local Swiss Ephemeris)');
} else {
  astrologyService = require('../services/astrology');
  console.log('Astrology engine: AstrologyAPI (external)');
}

const { generateReading } = require('../services/gemini');

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

    if (useKerykeion) {
      // Kerykeion path: single Python call returns everything
      const result = await astrologyService.getNatalTransitsAndReport(
        { birthDate, birthTime, latitude, longitude, timezone },
        transitDate,
      );
      transitEvents = result.transitEvents;
    } else {
      // Original API path: fetch then calculate in JS
      const { natalPlanets, natalPlanetsTropical, transitPlanets } =
        await astrologyService.getNatalTransits(
          { birthDate, birthTime, latitude, longitude, timezone },
          transitDate,
        );
      transitEvents = astrologyService.calculateTransitReport(
        natalPlanets, natalPlanetsTropical, transitPlanets,
      );
    }

    // Extract aspect-style data for Gemini prompt compatibility
    const aspects = transitEvents.filter(e => e.type === 'aspect');
    if (aspects.length === 0) {
      aspects.push(
        { transitPlanet: 'Moon', aspect: 'conjunction', natalPlanet: 'Sun', exact: false },
      );
    }

    // Generate AI reading using Gemini
    const aiResponse = await generateReading(name, aspects);

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
