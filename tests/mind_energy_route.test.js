const path = require('path');

// The bridge reads PYTHON_BIN at load time; use the venv that has kerykeion.
process.env.PYTHON_BIN = path.join(__dirname, '..', '.venv', 'bin', 'python');
process.env.ASTROLOGY_ENGINE = 'kerykeion';

const { computeMonth, datesOfMonth } = require('../services/mind-energy');
const { createTestApp, postJson } = require('./helpers/test_app');

const BIRTH = {
  name: 'Test', birthDate: '1991-12-29', birthTime: '13:30',
  latitude: 10.7755, longitude: 106.7021, timezone: 7,
};

describe('computeMonth (fake engine)', () => {
  const fakeBatch = async input => {
    const pos = (sign, house, lon, speed = 1) => ({ sign, house, siderealLon: lon, speed });
    const day = {
      Sun: pos('Taurus', 2, 45), Moon: pos('Virgo', 6, 165, 13), Mercury: pos('Cancer', 4, 100),
      Mars: pos('Taurus', 2, 50), Venus: pos('Taurus', 2, 55), Jupiter: pos('Sagittarius', 9, 250),
      Saturn: pos('Pisces', 12, 340, 0.1), Rahu: pos('Aquarius', 11, 310, -0.05), Ketu: pos('Leo', 5, 130, -0.05),
    };
    return {
      natalPlanets: [
        { name: 'Ascendant', sign: 'Aries', house: 1, fullDegree: 5 },
        { name: 'Moon', sign: 'Gemini', house: 3, fullDegree: 75 },
        { name: 'Sun', sign: 'Sagittarius', house: 9, fullDegree: 250 },
        { name: 'Mars', sign: 'Gemini', house: 3, fullDegree: 80 },
      ],
      transitPositions: Object.fromEntries(input.transitDates.map(d => [d, day])),
    };
  };

  test('returns one entry per day with 0–100 scores and at most 8 drivers', async () => {
    const out = await computeMonth(
      { birthDate: '1991-12-29', birthTime: '13:30', latitude: 10, longitude: 106, timezone: 'Asia/Ho_Chi_Minh' },
      '2026-02', { callBatch: fakeBatch },
    );
    expect(out.month).toBe('2026-02');
    expect(out.days).toHaveLength(28);
    expect(out.days.map(d => d.date)).toEqual(datesOfMonth('2026-02'));
    for (const d of out.days) {
      expect(d.overthinking).toBeGreaterThanOrEqual(0);
      expect(d.overthinking).toBeLessThanOrEqual(100);
      expect(d.vitality).toBeGreaterThanOrEqual(0);
      expect(d.vitality).toBeLessThanOrEqual(100);
      expect(d.drivers.length).toBeLessThanOrEqual(8);
    }
  });

  test('leap-year February has 29 days', () => {
    expect(datesOfMonth('2028-02')).toHaveLength(29);
  });
});

describe('POST /api/mind-energy-monthly', () => {
  const app = createTestApp();

  test.each([
    ['missing month', {}],
    ['bad month format', { month: '2026-13' }],
    ['month without padding', { month: '2026-1' }],
  ])('400 for %s', async (_label, extra) => {
    const { status, body } = await postJson(app, '/api/mind-energy-monthly', { ...BIRTH, ...extra });
    expect(status).toBe(400);
    expect(body.error).toMatch(/month/);
  });

  test('400 for missing birth fields', async () => {
    const { status } = await postJson(app, '/api/mind-energy-monthly', { month: '2026-11' });
    expect(status).toBe(400);
  });

  test('real engine: one entry per day, scores within 0–100 and varying', async () => {
    const { status, body } = await postJson(app, '/api/mind-energy-monthly', { ...BIRTH, month: '2026-11' });
    expect(status).toBe(200);
    expect(body.month).toBe('2026-11');
    expect(body.days).toHaveLength(30);
    for (const d of body.days) {
      expect(d.overthinking).toBeGreaterThanOrEqual(0);
      expect(d.overthinking).toBeLessThanOrEqual(100);
      expect(d.vitality).toBeGreaterThanOrEqual(0);
      expect(d.vitality).toBeLessThanOrEqual(100);
      for (const dr of d.drivers) {
        expect(['overthinking', 'vitality', 'focus', 'irritability', 'steadiness']).toContain(dr.metric);
        expect(typeof dr.label).toBe('string');
        expect(typeof dr.delta).toBe('number');
      }
    }
    expect(new Set(body.days.map(d => d.overthinking)).size).toBeGreaterThan(1);
    expect(new Set(body.days.map(d => d.vitality)).size).toBeGreaterThan(1);
  }, 180000);
});
