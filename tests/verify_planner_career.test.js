/**
 * E2e: every Galactic Planner PDF title must appear in POST /api/career
 * for Jack on that transitDate (subset match on titles only).
 *
 * Fixtures: tests/fixtures/plannerN.json
 * Spec: docs/superpowers/specs/2026-07-04-planner-career-verify-matchers-design.md
 *
 * Run: `npm run test:planner` (excluded from default `npm test`).
 *
 * Fixtures keep PDF truth — do not drop titles to greenwash. The former
 * ~15-day engine gaps (missing rulers/dispositors, day-boundary Moon
 * events/ingresses, non-local-min :Exact days) are closed by the full
 * natal-ruler set, day-boundary spillover, and :Exact keep-within-cap
 * rules in routes/reading.js computeFilteredEvents.
 */
const fs = require('fs');
const path = require('path');
const { createTestApp, startTestServer } = require('./helpers/test_app');
const {
  titlesFromCareerResponse,
  missingTitles,
} = require('./helpers/planner_titles');

const JACK = {
  name: 'Jack',
  birthDate: '1991-12-29',
  birthTime: '13:30',
  latitude: '10.7765713',
  longitude: '106.7012093',
  timezone: 'Asia/Ho_Chi_Minh',
};

const FIXTURES_DIR = path.join(__dirname, 'fixtures');
const DAY_TIMEOUT = 180_000; // 3 min — kerykeion yesterday/today/tomorrow

function loadFixtures() {
  const files = fs.readdirSync(FIXTURES_DIR)
    .filter((f) => /^planner\d+\.json$/.test(f))
    .sort((a, b) => {
      const na = Number(a.match(/\d+/)[0]);
      const nb = Number(b.match(/\d+/)[0]);
      return na - nb;
    });
  if (!files.length) {
    throw new Error(`No planner*.json fixtures in ${FIXTURES_DIR}`);
  }
  return files.map((f) => {
    const data = JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, f), 'utf8'));
    if (!data.days || typeof data.days !== 'object') {
      throw new Error(`Malformed fixture ${f}: missing days`);
    }
    return { file: f, ...data };
  });
}

const fixtures = loadFixtures();

describe('planner career title subset (e2e)', () => {
  let server;

  beforeAll(async () => {
    server = await startTestServer(createTestApp());
  });

  afterAll(async () => {
    if (server) await server.close();
  });

  for (const fixture of fixtures) {
    describe(fixture.file, () => {
      const dates = Object.keys(fixture.days).sort();

      for (const transitDate of dates) {
        const expected = fixture.days[transitDate];

        // Skip empty days — subset has nothing to assert
        if (!expected.length) {
          // still register a passing placeholder so the day is visible in output
          it(`${transitDate}: no expected titles (skip)`, () => {
            expect(expected).toEqual([]);
          });
          continue;
        }

        it(`${transitDate}: API contains all ${expected.length} PDF titles`, async () => {
          const { status, body } = await server.post('/api/career', {
            ...JACK,
            transitDate,
          });

          expect(status).toBe(200);
          const actual = titlesFromCareerResponse(body);
          const missing = missingTitles(expected, actual);
          if (missing.length) {
            throw new Error(
              [
                `${fixture.file} ${transitDate}: missing ${missing.length} title(s)`,
                ...missing.map((t) => `  - ${t}`),
                'API titles:',
                ...actual.map((t) => `  + ${t}`),
              ].join('\n'),
            );
          }
        }, DAY_TIMEOUT);
      }
    });
  }
});
