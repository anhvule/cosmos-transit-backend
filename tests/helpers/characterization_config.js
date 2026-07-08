// Shared chart/date/route matrix for the characterization snapshots that
// pin API behavior across the unified-interpretations refactor.
// Charts share one birth date/place; birth time selects the ascendant
// (verified against the kerykeion engine).

const CHARTS = {
  capricorn: {
    name: 'Characterization Capricorn',
    birthDate: '1991-09-13', birthTime: '15:30',
    latitude: 16.0427, longitude: 120.7946, timezone: 8,
    ascendant: 'Capricorn',
  },
  aries: {
    name: 'Characterization Aries',
    birthDate: '1991-09-13', birthTime: '21:30',
    latitude: 16.0427, longitude: 120.7946, timezone: 8,
    ascendant: 'Aries',
  },
  gemini: {
    name: 'Characterization Gemini',
    birthDate: '1991-09-13', birthTime: '01:30',
    latitude: 16.0427, longitude: 120.7946, timezone: 8,
    ascendant: 'Gemini',
  },
};

const DATES = [
  '2026-01-15', '2026-03-10', '2026-05-20',
  '2026-07-08', '2026-09-15', '2026-11-25',
];

const ROUTES = [
  '/api/career', '/api/relationship', '/api/advice', '/api/food',
  '/api/panda/career', '/api/panda/relationship',
];

// Ascendants with per-ascendant rows in the legacy lens DBs.
const SEEDED_ASCENDANTS = new Set([
  'Aries', 'Taurus', 'Cancer', 'Leo', 'Virgo', 'Sagittarius', 'Capricorn',
]);

module.exports = { CHARTS, DATES, ROUTES, SEEDED_ASCENDANTS };
