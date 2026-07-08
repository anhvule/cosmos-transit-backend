/**
 * Characterization guard for the unified-interpretations refactor.
 *
 * Compares live responses of the 6 interpretation routes against the
 * fixtures captured pre-refactor. Structure (dates, event descriptions,
 * impact, ordering) must match byte-for-byte. Interpretation text may
 * differ ONLY in the documented improvement directions:
 *   - gained text where the old response was empty
 *   - ascendant-specific override of non-empty text, only for charts
 *     whose ascendant is seeded
 * Any lost text (non-empty → empty), any change for an unseeded chart's
 * non-empty text, or any structural difference is a regression.
 *
 * Excluded from default `npm test` (slow: 108 engine-backed requests).
 * Run with: npm run test:characterization
 */
const fs = require('fs');
const path = require('path');
const { createTestApp, startTestServer } = require('./helpers/test_app');
const {
  CHARTS, DATES, ROUTES, SEEDED_ASCENDANTS,
} = require('./helpers/characterization_config');

const FIXTURE_DIR = path.join(__dirname, 'fixtures', 'characterization');

jest.setTimeout(600000);

// Returns null if allowed, otherwise a reason string.
function interpretationDelta(oldV, newV, chartAscendant) {
  if (oldV === newV) return null;
  if (newV !== '' && oldV === '') return null; // gained text
  if (newV !== '' && oldV !== '' && SEEDED_ASCENDANTS.has(chartAscendant)) {
    return null; // ascendant-specific override
  }
  if (newV === '') return `lost text: ${JSON.stringify(oldV).slice(0, 80)}`;
  return `changed text for unseeded ascendant ${chartAscendant}`;
}

describe('characterization: interpretation routes', () => {
  let server;
  beforeAll(async () => { server = await startTestServer(createTestApp()); });
  afterAll(async () => { await server.close(); });

  const gained = [];

  for (const [chartKey, chart] of Object.entries(CHARTS)) {
    const fixture = JSON.parse(
      fs.readFileSync(path.join(FIXTURE_DIR, `${chartKey}.json`), 'utf8'),
    );
    for (const route of ROUTES) {
      for (const date of DATES) {
        test(`${chartKey} ${route} ${date}`, async () => {
          const { ascendant, ...body } = chart;
          const res = await server.post(route, { ...body, transitDate: date });
          expect(res.status).toBe(200);
          const expected = fixture[route][date];
          const actual = res.body;

          expect(actual.date).toBe(expected.date);
          for (const section of ['aspects', 'rulers']) {
            expect(actual[section].length).toBe(expected[section].length);
            for (let i = 0; i < expected[section].length; i++) {
              const exp = expected[section][i];
              const act = actual[section][i];
              expect(act.description).toBe(exp.description);
              if (section === 'aspects') expect(act.impact).toBe(exp.impact);
              const reason = interpretationDelta(
                exp.interpretation, act.interpretation, chart.ascendant,
              );
              if (reason) {
                throw new Error(
                  `${chartKey} ${route} ${date} ${section}[${i}] ` +
                  `"${exp.description}": ${reason}`,
                );
              }
              if (exp.interpretation !== act.interpretation) {
                gained.push(`${chartKey} ${route} ${date} "${exp.description}"`);
              }
            }
          }
        });
      }
    }
  }

  afterAll(() => {
    if (gained.length) {
      console.log(`characterization: ${gained.length} allowed interpretation deltas`);
    }
  });
});
