# Unified Interpretations Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate the two interpretation-lookup systems into one sparse, ascendant-aware `interpretations` table in `db/cosmos.db`, driven by JSON seed files + one generic runner, and split the `routes/reading.js` monolith into focused route/service modules — with zero behavior regressions (pinned by characterization fixtures and the 375-test planner suite).

**Architecture:** Engine event-name strings are parsed at the boundary (`services/cosmos_event_parser.js`) into structured keys; a single lookup function walks an ordered ascendant fallback chain (`[ascendant, 'Aries', '*']` for legacy lens routes, `[ascendant, '*']` for panda routes) with per-ascendant phase fallback (exact phase, then `window`). Seeds under `db/seeds/` are the git source of truth; `db/cosmos.db` is a rebuildable artifact. Legacy `.db` files and seed JS stay on disk untouched; runtime stops reading them.

**Tech Stack:** Node/Express 5, better-sqlite3 (WAL), Jest. Python engine untouched.

**Design spec:** `docs/superpowers/specs/2026-07-08-unified-interpretations-refactor-design.md`

---

## Reference facts (verified against the working tree)

- `routes/reading.js` is 1,524 lines. Key line ranges (verify before editing — they shift if the file changes):
  - `resolveTimezoneOrRespond` 33–43, `mergePeriod` 53–62, `getDashaDescriptions` 70–82
  - Legacy DB requires + `LOOKUP_SQL` + prepared statements 83–100
  - `getCosmosInterpretation` 107–115, `ascendantFromResult` 122–126, `baseEventName` 132–134
  - `SIGN_ORDER`/`SIGN_LORDS`/`CLASSICAL_PLANETS` 138–147, `houseOrdinal` 150–154, `natalRulerDescriptions` 164–185
  - `lookupEventWithFallback` 200–229, five `get*EventInterpretation` wrappers 231–249
  - `computeFilteredEvents` 253–566 (**the empirically-tuned dedup layer — verbatim moves only**)
  - `fetchResultsForDates` 569–575, `shiftDate` 578–582, `makeDebugHandler` 584–634, `aggregatePeriod` 638–696, `dateRange` 699–707, `makePeriodHandler` 709–767
  - Route registrations: 769–782 (readings), 810/845 (market), 880 (essence), 933/1098/1247/1348 (dasha-family), 1389/1437 (insights), 1470–1521 (favourites)
- `db/cosmos.js` currently opens `db/cosmos.db` **readonly** and exposes `lookup(lens, key)` against `event_templates`.
- `services/cosmos_event_parser.js` exports `parseEventName(name)` → `{ kind, transit_planet?, natal_planet?, target_house?, target_angle?, special_label?, lord_house?, phase }` or `null`. Kinds: `aspect`, `angle_aspect`, `outer_special`, `transit_house`, `ruler`, `dispositor`. Phases: `window|starts|exact|ends`.
- `db/seed_all_ascendants.js` exports `{ generateEventNames, ASCENDANTS, PLANETS, HOUSES, PHASES, SIGN_RULERS }`. `generateEventNames(ascendant)` yields 4,328 names per ascendant across 7 templates.
- Legacy DBs: `db/{career,relationship,advice,food,investment}.js` each export a raw better-sqlite3 handle on `db/<lens>_events.db`, table `events(id, ascendant, name, description, created_at, UNIQUE(ascendant, name))`.
- `event_templates` in cosmos.db: 7 lenses (`career, relationship, investment, advice, food, gain, loss`) × 764 keys = 5,348 rows; columns match the new `interpretations` table minus `ascendant`.
- `tests/helpers/test_app.js` exports `{ createTestApp, postJson, startTestServer }`; requires `../../routes/reading`.
- `tests/route_surface.test.js` requires `../routes/reading` and pins the exact route surface. **It must pass unchanged** — do not edit it.
- `package.json` jest config excludes `verify_planner_career\.test\.js$` from default `npm test`; planner runs via `npm run test:planner` (375 tests, ~4.5 min).
- Characterization charts (ascendants verified by running the engine): all on `birthDate 1991-09-13`, `latitude 16.0427`, `longitude 120.7946`, `timezone 8`:
  - **Capricorn** (real natal from SEEDING_GUIDE §6): `birthTime "15:30"`
  - **Aries**: `birthTime "21:30"`
  - **Gemini** (unseeded ascendant): `birthTime "01:30"`
- Seeded ascendants in legacy DBs (from seed-file inventory): Aries, Taurus, Cancer, Leo, Virgo, Sagittarius, Capricorn (investment: Aries + Capricorn only).
- Working directory: the git worktree at `.worktrees/unified-interpretations` (branch `feat/unified-interpretations`). `.env`, `.venv` (symlink) and `node_modules` (symlink) are already provisioned. Baselines verified green: `npm test` (130 tests), `npm run test:planner` (375 tests).

### Shared helper used by several tasks: `keyId`

Several tasks canonicalize a structured key to a string. Use this exact function wherever the plan says `keyId`:

```js
function keyId(k) {
  return [
    k.kind, k.transit_planet || '', k.natal_planet || '',
    k.target_house || 0, k.target_angle || '', k.special_label || '',
    k.lord_house || 0, k.phase || 'window',
  ].join('|');
}
```

---

### Task 1: Characterization snapshot harness

Captures today's responses of the 6 interpretation routes for 3 charts × 6 dates as golden fixtures, plus a comparison test that enforces the documented delta rules. Before the refactor the comparison must be byte-identical-green.

**Files:**
- Create: `tests/helpers/characterization_config.js`
- Create: `scripts/capture-characterization.js`
- Create: `tests/characterization.test.js`
- Create: `tests/fixtures/characterization/{capricorn,aries,gemini}.json` (generated)
- Modify: `package.json` (jest ignore pattern + script)

- [ ] **Step 1: Write the shared config**

`tests/helpers/characterization_config.js`:

```js
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

const PANDA_ROUTES = new Set(['/api/panda/career', '/api/panda/relationship']);

// Ascendants with per-ascendant rows in the legacy lens DBs.
const SEEDED_ASCENDANTS = new Set([
  'Aries', 'Taurus', 'Cancer', 'Leo', 'Virgo', 'Sagittarius', 'Capricorn',
]);

module.exports = { CHARTS, DATES, ROUTES, PANDA_ROUTES, SEEDED_ASCENDANTS };
```

- [ ] **Step 2: Write the capture script**

`scripts/capture-characterization.js`:

```js
#!/usr/bin/env node
// Captures characterization fixtures for the unified-interpretations
// refactor: POSTs every (chart × route × date) combination against the
// in-process test app and writes the raw response bodies to
// tests/fixtures/characterization/<chart>.json.
//
// Run BEFORE the refactor to establish the baseline. Do not re-run after
// the refactor — the fixtures are the ground truth the refactor is
// compared against.

const fs = require('fs');
const path = require('path');
const { createTestApp, startTestServer } = require('../tests/helpers/test_app');
const { CHARTS, DATES, ROUTES } = require('../tests/helpers/characterization_config');

const OUT_DIR = path.join(__dirname, '..', 'tests', 'fixtures', 'characterization');

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const server = await startTestServer(createTestApp());
  try {
    for (const [chartKey, chart] of Object.entries(CHARTS)) {
      const fixture = {};
      for (const route of ROUTES) {
        fixture[route] = {};
        for (const date of DATES) {
          const { ascendant, ...body } = chart;
          const res = await server.post(route, { ...body, transitDate: date });
          if (res.status !== 200) {
            throw new Error(`${route} ${chartKey} ${date} → HTTP ${res.status}: ${JSON.stringify(res.body)}`);
          }
          fixture[route][date] = res.body;
          console.log(`captured ${chartKey} ${route} ${date}`);
        }
      }
      const outPath = path.join(OUT_DIR, `${chartKey}.json`);
      fs.writeFileSync(outPath, JSON.stringify(fixture, null, 2) + '\n');
      console.log(`wrote ${outPath}`);
    }
  } finally {
    await server.close();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 3: Write the comparison test**

`tests/characterization.test.js`:

```js
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
  CHARTS, DATES, ROUTES, PANDA_ROUTES, SEEDED_ASCENDANTS,
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
```

Note: `PANDA_ROUTES` is intentionally imported for the config's completeness but the delta rule above treats panda and legacy routes uniformly — the seeded-ascendant condition already encodes the difference (an unseeded chart on a panda route must return the identical generic text). If the require lint bothers you, drop `PANDA_ROUTES` from the destructure.

- [ ] **Step 4: Wire up package.json**

In `package.json`, add to `scripts`:

```json
"test:characterization": "jest --verbose --runTestsByPath tests/characterization.test.js --testPathIgnorePatterns=/node_modules/ --testPathIgnorePatterns=/.claude/",
```

and add to `jest.testPathIgnorePatterns` (keeping existing entries):

```json
"characterization\\.test\\.js$"
```

- [ ] **Step 5: Capture the fixtures**

Run: `node scripts/capture-characterization.js`
Expected: 108 `captured …` lines, 3 `wrote …` lines, exit 0. Takes ~2–4 minutes (engine-backed).

- [ ] **Step 6: Verify the guard is green against itself**

Run: `npm run test:characterization`
Expected: 108 tests PASS, zero allowed-delta log lines (nothing has changed yet).

- [ ] **Step 7: Verify default test suite still green and doesn't pick up the new test**

Run: `npm test`
Expected: same 8 suites as baseline (characterization excluded), all pass.

- [ ] **Step 8: Commit**

```bash
git add tests/helpers/characterization_config.js scripts/capture-characterization.js tests/characterization.test.js tests/fixtures/characterization/ package.json
git commit -m "test: characterization snapshots for interpretation routes (pre-refactor baseline)"
```

---

### Task 2: Parser round-trip coverage

Prove `parseEventName` covers every name `generateEventNames` can produce, for all 12 ascendants, and that names that must stay distinct produce distinct keys (the only permitted collapse: aspect keys across the natal house).

**Files:**
- Create: `tests/cosmos_event_parser.test.js`
- Modify (only if a gap is found): `services/cosmos_event_parser.js`

- [ ] **Step 1: Write the test**

`tests/cosmos_event_parser.test.js`:

```js
const { parseEventName } = require('../services/cosmos_event_parser');
const { generateEventNames, ASCENDANTS } = require('../db/seed_all_ascendants');

function keyId(k) {
  return [
    k.kind, k.transit_planet || '', k.natal_planet || '',
    k.target_house || 0, k.target_angle || '', k.special_label || '',
    k.lord_house || 0, k.phase || 'window',
  ].join('|');
}

describe('parseEventName spot checks', () => {
  test('aspect with phase discards natal house', () => {
    expect(parseEventName('Mars aspect Venus in 9th house : Exact')).toEqual({
      kind: 'aspect', transit_planet: 'Mars', natal_planet: 'Venus', phase: 'exact',
    });
  });
  test('aspect alternate phrasing ("in the")', () => {
    expect(parseEventName('Mars aspect Venus in the 9th house')).toEqual({
      kind: 'aspect', transit_planet: 'Mars', natal_planet: 'Venus', phase: 'window',
    });
  });
  test('transit house', () => {
    expect(parseEventName('Moon Transits the 8th House')).toEqual({
      kind: 'transit_house', transit_planet: 'Moon', target_house: 8, phase: 'window',
    });
  });
  test('ruler', () => {
    expect(parseEventName('Mars ruler of the 11th House in the 9th House')).toEqual({
      kind: 'ruler', lord_house: 11, target_house: 9, phase: 'window',
    });
  });
  test('dispositor', () => {
    expect(parseEventName('Sun in 9th (Dispositor)')).toEqual({
      kind: 'dispositor', natal_planet: 'Sun', target_house: 9, phase: 'window',
    });
  });
  test('angle aspects', () => {
    expect(parseEventName('Jupiter Aspecting Midheaven (MC) : Starts')).toEqual({
      kind: 'angle_aspect', transit_planet: 'Jupiter', target_angle: 'MC', phase: 'starts',
    });
    expect(parseEventName('Venus Aspecting Ascendant (ASC)')).toEqual({
      kind: 'angle_aspect', transit_planet: 'Venus', target_angle: 'ASC', phase: 'window',
    });
  });
  test('outer specials', () => {
    expect(parseEventName('Pluto conjunct Saturn : Ends')).toEqual({
      kind: 'outer_special', special_label: 'Pluto-Saturn', phase: 'ends',
    });
    expect(parseEventName('Uranus conjunct Venus')).toEqual({
      kind: 'outer_special', special_label: 'Uranus-Venus', phase: 'window',
    });
  });
  test('unknown name returns null', () => {
    expect(parseEventName('Total nonsense event')).toBeNull();
    expect(parseEventName('')).toBeNull();
    expect(parseEventName(null)).toBeNull();
  });
});

describe('parseEventName round-trip over generateEventNames', () => {
  for (const ascendant of ASCENDANTS) {
    test(`every generated ${ascendant} event name parses`, () => {
      const failures = [];
      for (const name of generateEventNames(ascendant)) {
        if (parseEventName(name) === null) failures.push(name);
      }
      expect(failures).toEqual([]);
    });
  }

  test('distinct names produce distinct keys, except the deliberate aspect natal-house collapse', () => {
    for (const ascendant of ASCENDANTS) {
      const byKey = new Map();
      for (const name of generateEventNames(ascendant)) {
        const key = parseEventName(name);
        const id = keyId(key);
        if (!byKey.has(id)) byKey.set(id, []);
        byKey.get(id).push({ name, key });
      }
      for (const [id, group] of byKey) {
        if (group.length === 1) continue;
        // Only aspects may collapse, and only across the natal-house segment:
        // stripping " in [the] Nth house" must make every name identical.
        expect(group[0].key.kind).toBe('aspect');
        const stripped = new Set(group.map((g) =>
          g.name.replace(/\s+in\s+(?:the\s+)?\d+(?:st|nd|rd|th)\s+house/i, '')));
        if (stripped.size !== 1) {
          throw new Error(`unexpected key collapse for ${id}: ${group.map((g) => g.name).join(' | ')}`);
        }
      }
    }
  });
});
```

- [ ] **Step 2: Run it**

Run: `npx jest tests/cosmos_event_parser.test.js`
Expected: PASS. If any generated name fails to parse, extend the corresponding regex in `services/cosmos_event_parser.js` minimally (do not loosen phase handling), and re-run until green. Based on inspection all 7 template shapes are covered, so failures are unlikely.

- [ ] **Step 3: Run full suite**

Run: `npm test` — expected all green.

- [ ] **Step 4: Commit**

```bash
git add tests/cosmos_event_parser.test.js services/cosmos_event_parser.js
git commit -m "test: parser round-trip over every generatable event name (12 ascendants)"
```

---

### Task 3: `interpretations` table schema + chain lookup in `db/cosmos.js`

**Files:**
- Create: `db/_interpretations-schema.js`
- Modify: `db/cosmos.js`
- Test: `tests/interpretations_lookup.test.js`

- [ ] **Step 1: Write the schema module**

`db/_interpretations-schema.js`:

```js
// Schema for the unified `interpretations` table in db/cosmos.db —
// the ascendant-aware, sparse successor to both the legacy per-lens
// `events` tables and the chart-agnostic `event_templates` table.
// Shared by scripts/seed.js and db/cosmos.js (ensure-on-open).

const CREATE_SQL = `
  CREATE TABLE IF NOT EXISTS interpretations (
    id             INTEGER PRIMARY KEY,
    ascendant      TEXT NOT NULL,
    lens           TEXT NOT NULL,
    kind           TEXT NOT NULL,
    transit_planet TEXT NOT NULL DEFAULT '',
    natal_planet   TEXT NOT NULL DEFAULT '',
    target_house   INTEGER NOT NULL DEFAULT 0,
    target_angle   TEXT NOT NULL DEFAULT '',
    special_label  TEXT NOT NULL DEFAULT '',
    lord_house     INTEGER NOT NULL DEFAULT 0,
    phase          TEXT NOT NULL DEFAULT 'window',
    display_name   TEXT NOT NULL,
    description    TEXT NOT NULL,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (ascendant, lens, kind, transit_planet, natal_planet,
            target_house, target_angle, special_label, lord_house, phase)
  )
`;

const INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_interp_lookup
    ON interpretations(lens, ascendant, kind, transit_planet, natal_planet, phase)
`;

function ensureInterpretationsSchema(db) {
  db.exec(CREATE_SQL);
  db.exec(INDEX_SQL);
}

module.exports = { ensureInterpretationsSchema };
```

- [ ] **Step 2: Write the failing lookup test**

`tests/interpretations_lookup.test.js` — uses an in-memory DB via the factory, so it never touches the committed `db/cosmos.db`:

```js
const Database = require('better-sqlite3');
const { ensureInterpretationsSchema } = require('../db/_interpretations-schema');
const { createInterpretationLookup } = require('../db/cosmos');

function makeDb(rows) {
  const db = new Database(':memory:');
  ensureInterpretationsSchema(db);
  const ins = db.prepare(`
    INSERT INTO interpretations
      (ascendant, lens, kind, transit_planet, natal_planet, target_house,
       target_angle, special_label, lord_house, phase, display_name, description)
    VALUES (@ascendant, @lens, @kind, @transit_planet, @natal_planet,
            @target_house, @target_angle, @special_label, @lord_house,
            @phase, @display_name, @description)
  `);
  for (const r of rows) {
    ins.run({
      lens: 'career', kind: 'aspect', transit_planet: 'Mars', natal_planet: 'Venus',
      target_house: 0, target_angle: '', special_label: '', lord_house: 0,
      display_name: 'Mars aspect Venus', ...r,
    });
  }
  return db;
}

const KEY = { kind: 'aspect', transit_planet: 'Mars', natal_planet: 'Venus', phase: 'exact' };

describe('lookupInterpretation fallback chain', () => {
  test('resolution order: asc phase → asc window → Aries phase → Aries window → * phase → * window', () => {
    const rows = [
      { ascendant: 'Taurus', phase: 'exact',  description: 'T-exact' },
      { ascendant: 'Taurus', phase: 'window', description: 'T-window' },
      { ascendant: 'Aries',  phase: 'exact',  description: 'A-exact' },
      { ascendant: 'Aries',  phase: 'window', description: 'A-window' },
      { ascendant: '*',      phase: 'exact',  description: 'G-exact' },
      { ascendant: '*',      phase: 'window', description: 'G-window' },
    ];
    const expectedOrder = ['T-exact', 'T-window', 'A-exact', 'A-window', 'G-exact', 'G-window'];
    for (let drop = 0; drop <= rows.length; drop++) {
      const db = makeDb(rows.slice(drop));
      const lookup = createInterpretationLookup(db);
      const expected = drop < expectedOrder.length ? expectedOrder[drop] : '';
      expect(lookup('career', KEY, ['Taurus', 'Aries', '*'])).toBe(expected);
      db.close();
    }
  });

  test('window-phase key does not double-query', () => {
    const db = makeDb([{ ascendant: '*', phase: 'window', description: 'G-window' }]);
    const lookup = createInterpretationLookup(db);
    expect(lookup('career', { ...KEY, phase: 'window' }, ['Gemini', '*'])).toBe('G-window');
    db.close();
  });

  test('panda chain skips Aries', () => {
    const db = makeDb([
      { ascendant: 'Aries', phase: 'exact', description: 'A-exact' },
      { ascendant: '*',     phase: 'exact', description: 'G-exact' },
    ]);
    const lookup = createInterpretationLookup(db);
    expect(lookup('career', KEY, ['Gemini', '*'])).toBe('G-exact');
    db.close();
  });

  test('empty-description rows fall through', () => {
    const db = makeDb([
      { ascendant: 'Taurus', phase: 'exact', description: '' },
      { ascendant: '*',      phase: 'exact', description: 'G-exact' },
    ]);
    const lookup = createInterpretationLookup(db);
    expect(lookup('career', KEY, ['Taurus', 'Aries', '*'])).toBe('G-exact');
    db.close();
  });

  test('duplicate ascendants in chain are queried once (Aries chart, legacy chain)', () => {
    const db = makeDb([{ ascendant: 'Aries', phase: 'exact', description: 'A-exact' }]);
    const lookup = createInterpretationLookup(db);
    expect(lookup('career', KEY, ['Aries', 'Aries', '*'])).toBe('A-exact');
    db.close();
  });

  test('null key and wrong lens return empty string', () => {
    const db = makeDb([{ ascendant: '*', phase: 'exact', description: 'G-exact' }]);
    const lookup = createInterpretationLookup(db);
    expect(lookup('career', null, ['*'])).toBe('');
    expect(lookup('food', KEY, ['*'])).toBe('');
    db.close();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx jest tests/interpretations_lookup.test.js`
Expected: FAIL — `createInterpretationLookup` is not exported.

- [ ] **Step 4: Implement in `db/cosmos.js`**

Replace the whole file with:

```js
// Single runtime connection to db/cosmos.db.
//
// Exposes:
//   - lookupInterpretation(lens, key, ascendantChain): the unified,
//     ascendant-aware lookup against the `interpretations` table.
//   - createInterpretationLookup(db): factory behind it (exported for tests).
//   - lookup(lens, key): legacy chart-agnostic lookup against
//     `event_templates` (kept for reference; no runtime callers after the
//     unified-interpretations refactor).
//
// This is the only runtime module that touches cosmos.db.

const Database = require('better-sqlite3');
const path = require('path');
const { ensureInterpretationsSchema } = require('./_interpretations-schema');

const DB_PATH = path.join(__dirname, 'cosmos.db');
const db = new Database(DB_PATH, { fileMustExist: true });
db.pragma('journal_mode = WAL');
ensureInterpretationsSchema(db);

const lookupStmt = db.prepare(`
  SELECT description FROM event_templates
  WHERE lens = @lens
    AND kind = @kind
    AND transit_planet = @transit_planet
    AND natal_planet = @natal_planet
    AND target_house = @target_house
    AND target_angle = @target_angle
    AND special_label = @special_label
    AND lord_house = @lord_house
    AND phase = @phase
  LIMIT 1
`);

/**
 * Legacy chart-agnostic lookup against event_templates.
 * Returns '' if no row matches; never throws.
 */
function lookup(lens, key) {
  if (!key) return '';
  const row = lookupStmt.get({
    lens,
    kind:           key.kind,
    transit_planet: key.transit_planet || '',
    natal_planet:   key.natal_planet   || '',
    target_house:   key.target_house   || 0,
    target_angle:   key.target_angle   || '',
    special_label:  key.special_label  || '',
    lord_house:     key.lord_house     || 0,
    phase:          key.phase          || 'window',
  });
  return row ? row.description : '';
}

/**
 * Build a lookupInterpretation(lens, key, ascendantChain) function bound to
 * `database`. Walks the ascendant chain in order; within each ascendant the
 * phase-specific row wins, then the phase-agnostic ('window') row — mirroring
 * the legacy lookupEventWithFallback ordering (full name first, then the
 * phase-stripped base name, per ascendant). First non-empty description wins.
 */
function createInterpretationLookup(database) {
  const stmt = database.prepare(`
    SELECT description FROM interpretations
    WHERE ascendant = @ascendant
      AND lens = @lens
      AND kind = @kind
      AND transit_planet = @transit_planet
      AND natal_planet = @natal_planet
      AND target_house = @target_house
      AND target_angle = @target_angle
      AND special_label = @special_label
      AND lord_house = @lord_house
      AND phase = @phase
    LIMIT 1
  `);

  return function lookupInterpretation(lens, key, ascendantChain) {
    if (!key) return '';
    const base = {
      lens,
      kind:           key.kind,
      transit_planet: key.transit_planet || '',
      natal_planet:   key.natal_planet   || '',
      target_house:   key.target_house   || 0,
      target_angle:   key.target_angle   || '',
      special_label:  key.special_label  || '',
      lord_house:     key.lord_house     || 0,
    };
    const keyPhase = key.phase || 'window';
    const phases = keyPhase === 'window' ? ['window'] : [keyPhase, 'window'];
    const seen = new Set();
    for (const ascendant of ascendantChain) {
      if (!ascendant || seen.has(ascendant)) continue;
      seen.add(ascendant);
      for (const phase of phases) {
        const row = stmt.get({ ...base, ascendant, phase });
        if (row && row.description) return row.description;
      }
    }
    return '';
  };
}

const lookupInterpretation = createInterpretationLookup(db);

module.exports = { lookup, lookupInterpretation, createInterpretationLookup, db };
```

Note: opening read-write + WAL will touch `db/cosmos.db`'s header and create the (gitignored) `-wal`/`-shm` sidecars; `db/cosmos.db` gets committed with the migrated data in Task 5, which absorbs this.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx jest tests/interpretations_lookup.test.js` — expected PASS.
Run: `npm test` — expected all green (panda routes still use `lookup`, untouched).

- [ ] **Step 6: Commit**

```bash
git add db/_interpretations-schema.js db/cosmos.js tests/interpretations_lookup.test.js
git commit -m "feat: ascendant-aware interpretations table + chain lookup in db/cosmos.js"
```

---

### Task 4: Generic seed runner

**Files:**
- Create: `scripts/seed.js`
- Modify: `package.json` (`seed`, repoint `seed:all`)
- Test: `tests/seed_runner.test.js`

- [ ] **Step 1: Write the failing test**

`tests/seed_runner.test.js` — drives the runner via a temp DB and temp seeds dir (`--db` / `--seeds-dir` flags exist for exactly this):

```js
const { execFileSync } = require('child_process');
const Database = require('better-sqlite3');
const fs = require('fs');
const os = require('os');
const path = require('path');

const SEED_JS = path.join(__dirname, '..', 'scripts', 'seed.js');

function runSeed(dbPath, seedsDir, extraArgs = []) {
  return execFileSync(
    process.execPath,
    [SEED_JS, `--db=${dbPath}`, `--seeds-dir=${seedsDir}`, ...extraArgs],
    { encoding: 'utf8' },
  );
}

function dumpRows(dbPath) {
  const db = new Database(dbPath, { readonly: true });
  const rows = db.prepare(`
    SELECT id, ascendant, lens, kind, transit_planet, natal_planet,
           target_house, target_angle, special_label, lord_house, phase,
           display_name, description
    FROM interpretations
    ORDER BY ascendant, lens, kind, transit_planet, natal_planet,
             target_house, target_angle, special_label, lord_house, phase
  `).all();
  db.close();
  return rows;
}

describe('scripts/seed.js', () => {
  let tmp;
  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'seed-test-'));
    const globalDir = path.join(tmp, 'seeds', '_global');
    const capDir = path.join(tmp, 'seeds', 'capricorn');
    fs.mkdirSync(globalDir, { recursive: true });
    fs.mkdirSync(capDir, { recursive: true });
    fs.writeFileSync(path.join(globalDir, 'career.json'), JSON.stringify([
      {
        kind: 'aspect', transit_planet: 'Mars', natal_planet: 'Venus',
        phase: 'exact', display_name: 'Mars aspect Venus : Exact',
        description: 'generic mars-venus',
      },
    ]));
    fs.writeFileSync(path.join(capDir, 'career.json'), JSON.stringify([
      {
        kind: 'aspect', transit_planet: 'Mars', natal_planet: 'Venus',
        phase: 'exact', display_name: 'Mars aspect Venus in 9th house : Exact',
        description: 'capricorn mars-venus',
      },
      {
        kind: 'ruler', lord_house: 1, target_house: 8, phase: 'window',
        display_name: 'Saturn ruler of the 1st House in the 8th House',
        description: 'capricorn ruler',
      },
    ]));
  });
  afterEach(() => { fs.rmSync(tmp, { recursive: true, force: true }); });

  test('seeds all files with correct ascendant mapping', () => {
    const dbPath = path.join(tmp, 'test.db');
    runSeed(dbPath, path.join(tmp, 'seeds'));
    const rows = dumpRows(dbPath);
    expect(rows.length).toBe(3);
    expect(rows.map((r) => r.ascendant).sort()).toEqual(['*', 'Capricorn', 'Capricorn']);
    const generic = rows.find((r) => r.ascendant === '*');
    expect(generic.lens).toBe('career');
    expect(generic.description).toBe('generic mars-venus');
    expect(generic.target_house).toBe(0);
  });

  test('is idempotent: second run yields identical table contents', () => {
    const dbPath = path.join(tmp, 'test.db');
    runSeed(dbPath, path.join(tmp, 'seeds'));
    const first = dumpRows(dbPath);
    runSeed(dbPath, path.join(tmp, 'seeds'));
    const second = dumpRows(dbPath);
    expect(second).toEqual(first);
  });

  test('re-seeding after a description edit updates the row in place', () => {
    const dbPath = path.join(tmp, 'test.db');
    runSeed(dbPath, path.join(tmp, 'seeds'));
    const before = dumpRows(dbPath);
    const capFile = path.join(tmp, 'seeds', 'capricorn', 'career.json');
    const entries = JSON.parse(fs.readFileSync(capFile, 'utf8'));
    entries[0].description = 'capricorn mars-venus v2';
    fs.writeFileSync(capFile, JSON.stringify(entries));
    runSeed(dbPath, path.join(tmp, 'seeds'));
    const after = dumpRows(dbPath);
    expect(after.length).toBe(before.length);
    const updated = after.find((r) => r.ascendant === 'Capricorn' && r.kind === 'aspect');
    expect(updated.description).toBe('capricorn mars-venus v2');
    expect(updated.id).toBe(before.find((r) => r.ascendant === 'Capricorn' && r.kind === 'aspect').id);
  });

  test('--ascendant and --lens filters restrict what is seeded', () => {
    const dbPath = path.join(tmp, 'test.db');
    runSeed(dbPath, path.join(tmp, 'seeds'), ['--ascendant=Capricorn']);
    expect(dumpRows(dbPath).every((r) => r.ascendant === 'Capricorn')).toBe(true);

    const dbPath2 = path.join(tmp, 'test2.db');
    runSeed(dbPath2, path.join(tmp, 'seeds'), ['--lens=career']);
    expect(dumpRows(dbPath2).length).toBe(3);
  });

  test('rejects unknown lens filenames and malformed entries', () => {
    const badDir = path.join(tmp, 'seeds', 'taurus');
    fs.mkdirSync(badDir, { recursive: true });
    fs.writeFileSync(path.join(badDir, 'nonsense.json'), '[]');
    const dbPath = path.join(tmp, 'test.db');
    expect(() => runSeed(dbPath, path.join(tmp, 'seeds'))).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest tests/seed_runner.test.js` — expected FAIL (`scripts/seed.js` doesn't exist).

- [ ] **Step 3: Implement the runner**

`scripts/seed.js`:

```js
#!/usr/bin/env node
// Generic seed runner: rebuilds/upserts the `interpretations` table in
// db/cosmos.db from the JSON seed files under db/seeds/.
//
//   db/seeds/_global/<lens>.json      → ascendant '*' (generic fallback set)
//   db/seeds/<ascendant>/<lens>.json  → ascendant 'Aries'…'Pisces'
//
// Usage:
//   npm run seed                          # everything
//   npm run seed -- --ascendant=Capricorn # one ascendant ('_global' works too)
//   npm run seed -- --lens=career         # one lens
//   node scripts/seed.js --db=/tmp/x.db --seeds-dir=/tmp/seeds   # tests
//
// Idempotent: UPSERT on the structured unique key. Adding a new ascendant is
// a data-only operation: add JSON files under db/seeds/<ascendant>/ and
// re-run. No code changes.

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const { ensureInterpretationsSchema } = require('../db/_interpretations-schema');

const VALID_LENSES = new Set([
  'career', 'relationship', 'investment', 'advice', 'food', 'gain', 'loss',
]);
const VALID_KINDS = new Set([
  'aspect', 'angle_aspect', 'outer_special', 'transit_house', 'ruler', 'dispositor',
]);
const VALID_PHASES = new Set(['window', 'starts', 'exact', 'ends']);
const ASCENDANTS = new Set([
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
]);

function parseArgs(argv) {
  const args = { db: null, seedsDir: null, ascendant: null, lens: null };
  for (const a of argv) {
    const m = a.match(/^--(db|seeds-dir|ascendant|lens)=(.+)$/);
    if (!m) {
      console.error(`Unknown argument: ${a}`);
      process.exit(1);
    }
    if (m[1] === 'seeds-dir') args.seedsDir = m[2];
    else args[m[1]] = m[2];
  }
  return args;
}

function dirToAscendant(dirName) {
  if (dirName === '_global') return '*';
  const asc = dirName.charAt(0).toUpperCase() + dirName.slice(1).toLowerCase();
  if (!ASCENDANTS.has(asc)) {
    throw new Error(`Unknown ascendant directory: ${dirName}`);
  }
  return asc;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const dbPath = args.db || path.join(__dirname, '..', 'db', 'cosmos.db');
  const seedsDir = args.seedsDir || path.join(__dirname, '..', 'db', 'seeds');

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  ensureInterpretationsSchema(db);

  const upsert = db.prepare(`
    INSERT INTO interpretations
      (ascendant, lens, kind, transit_planet, natal_planet, target_house,
       target_angle, special_label, lord_house, phase, display_name, description)
    VALUES
      (@ascendant, @lens, @kind, @transit_planet, @natal_planet, @target_house,
       @target_angle, @special_label, @lord_house, @phase, @display_name, @description)
    ON CONFLICT (ascendant, lens, kind, transit_planet, natal_planet,
                 target_house, target_angle, special_label, lord_house, phase)
    DO UPDATE SET display_name = excluded.display_name,
                  description  = excluded.description
  `);

  let total = 0;
  const dirs = fs.readdirSync(seedsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  for (const dir of dirs) {
    const ascendant = dirToAscendant(dir);
    if (args.ascendant && dir !== args.ascendant && ascendant !== args.ascendant) continue;

    const files = fs.readdirSync(path.join(seedsDir, dir))
      .filter((f) => f.endsWith('.json'))
      .sort();
    for (const file of files) {
      const lens = path.basename(file, '.json');
      if (args.lens && lens !== args.lens) continue;
      if (!VALID_LENSES.has(lens)) {
        throw new Error(`Unknown lens file: ${dir}/${file}`);
      }
      const entries = JSON.parse(fs.readFileSync(path.join(seedsDir, dir, file), 'utf8'));
      const insertAll = db.transaction(() => {
        for (const e of entries) {
          if (!VALID_KINDS.has(e.kind)) {
            throw new Error(`${dir}/${file}: bad kind "${e.kind}"`);
          }
          const phase = e.phase || 'window';
          if (!VALID_PHASES.has(phase)) {
            throw new Error(`${dir}/${file}: bad phase "${e.phase}"`);
          }
          if (!e.display_name || typeof e.description !== 'string') {
            throw new Error(`${dir}/${file}: entry missing display_name/description`);
          }
          upsert.run({
            ascendant,
            lens,
            kind: e.kind,
            transit_planet: e.transit_planet || '',
            natal_planet: e.natal_planet || '',
            target_house: e.target_house || 0,
            target_angle: e.target_angle || '',
            special_label: e.special_label || '',
            lord_house: e.lord_house || 0,
            phase,
            display_name: e.display_name,
            description: e.description,
          });
          total++;
        }
      });
      insertAll();
      console.log(`seeded ${dir}/${file} (${entries.length} entries)`);
    }
  }

  const rows = db.prepare('SELECT COUNT(*) AS c FROM interpretations').get().c;
  console.log(`Upserted ${total} entries; interpretations table now has ${rows} rows.`);
  db.close();
}

main();
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest tests/seed_runner.test.js` — expected PASS.

- [ ] **Step 5: Update package.json scripts**

```json
"seed": "node scripts/seed.js",
"seed:all": "node scripts/seed.js",
```

(The old `db/seed_all_ascendants.js` placeholder scaffolder stays on disk per design decision 4; the sparse model needs no placeholders.)

- [ ] **Step 6: Full suite green**

Run: `npm test` — expected all green.

- [ ] **Step 7: Commit**

```bash
git add scripts/seed.js tests/seed_runner.test.js package.json
git commit -m "feat: generic JSON seed runner for the interpretations table"
```

---

### Task 5: Legacy migration → seed JSONs → seeded DB

**Files:**
- Create: `scripts/migrate-legacy.js`
- Create: `scripts/verify-migration.js`
- Create (generated): `db/seeds/_global/*.json`, `db/seeds/<ascendant>/*.json`
- Modify (generated): `db/cosmos.db`

- [ ] **Step 1: Write the migration script**

`scripts/migrate-legacy.js`:

```js
#!/usr/bin/env node
// One-time migration: legacy per-lens events DBs + cosmos event_templates
// → JSON seed files under db/seeds/. Kept in the repo so the process is
// reproducible, but it only ever reads the legacy files (which stay on
// disk untouched as reference/backup).
//
//   event_templates (db/cosmos.db)        → db/seeds/_global/<lens>.json  (ascendant '*')
//   db/<lens>_events.db rows w/ text      → db/seeds/<ascendant>/<lens>.json
//
// Aborts (exit 1) with a full report if:
//   - any filled legacy row's name fails parseEventName, or
//   - two filled rows for the same (ascendant, lens) collapse to the same
//     structured key with DIFFERENT descriptions (aspect keys deliberately
//     discard the natal house — this check proves that's lossless).

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const { parseEventName } = require('../services/cosmos_event_parser');

const DB_DIR = path.join(__dirname, '..', 'db');
const SEEDS_DIR = path.join(DB_DIR, 'seeds');
const LEGACY_LENSES = ['career', 'relationship', 'advice', 'food', 'investment'];

function keyId(k) {
  return [
    k.kind, k.transit_planet || '', k.natal_planet || '',
    k.target_house || 0, k.target_angle || '', k.special_label || '',
    k.lord_house || 0, k.phase || 'window',
  ].join('|');
}

function trimEntry(key, displayName, description) {
  const out = { kind: key.kind };
  if (key.transit_planet) out.transit_planet = key.transit_planet;
  if (key.natal_planet) out.natal_planet = key.natal_planet;
  if (key.target_house) out.target_house = key.target_house;
  if (key.target_angle) out.target_angle = key.target_angle;
  if (key.special_label) out.special_label = key.special_label;
  if (key.lord_house) out.lord_house = key.lord_house;
  out.phase = key.phase || 'window';
  out.display_name = displayName;
  out.description = description;
  return out;
}

function writeSeedFile(dirName, lens, entriesByKeyId) {
  const entries = [...entriesByKeyId.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, e]) => e);
  const dir = path.join(SEEDS_DIR, dirName);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, `${lens}.json`),
    JSON.stringify(entries, null, 2) + '\n',
  );
  return entries.length;
}

function migrateGlobal() {
  const db = new Database(path.join(DB_DIR, 'cosmos.db'), { readonly: true });
  const rows = db.prepare(`
    SELECT lens, kind, transit_planet, natal_planet, target_house,
           target_angle, special_label, lord_house, phase,
           display_name, description
    FROM event_templates
  `).all();
  db.close();

  const byLens = new Map();
  for (const r of rows) {
    if (!byLens.has(r.lens)) byLens.set(r.lens, new Map());
    byLens.get(r.lens).set(keyId(r), trimEntry(r, r.display_name, r.description));
  }
  let total = 0;
  for (const [lens, entries] of byLens) {
    const n = writeSeedFile('_global', lens, entries);
    console.log(`_global/${lens}.json: ${n} entries`);
    total += n;
  }
  if (total !== rows.length) {
    throw new Error(`event_templates key collision: ${rows.length} rows → ${total} entries`);
  }
  return total;
}

function migrateLegacyLens(lens) {
  const db = new Database(path.join(DB_DIR, `${lens}_events.db`), { readonly: true });
  const rows = db.prepare(
    "SELECT ascendant, name, description FROM events WHERE description != ''",
  ).all();
  db.close();

  const parseFailures = [];
  const collisions = [];
  const byAscendant = new Map();

  for (const r of rows) {
    const key = parseEventName(r.name);
    if (!key) {
      parseFailures.push(`${lens}/${r.ascendant}: "${r.name}"`);
      continue;
    }
    if (!byAscendant.has(r.ascendant)) byAscendant.set(r.ascendant, new Map());
    const entries = byAscendant.get(r.ascendant);
    const id = keyId(key);
    const existing = entries.get(id);
    if (existing) {
      if (existing.description !== r.description) {
        collisions.push(
          `${lens}/${r.ascendant}: "${existing.display_name}" vs "${r.name}" ` +
          `→ same key ${id}, different descriptions`,
        );
      }
      continue; // identical duplicate (e.g. phrasing variants) — keep first
    }
    entries.set(id, trimEntry(key, r.name, r.description));
  }

  return { byAscendant, parseFailures, collisions, rowCount: rows.length };
}

function main() {
  const allFailures = [];
  const allCollisions = [];
  const pending = [];

  for (const lens of LEGACY_LENSES) {
    const { byAscendant, parseFailures, collisions, rowCount } = migrateLegacyLens(lens);
    allFailures.push(...parseFailures);
    allCollisions.push(...collisions);
    pending.push({ lens, byAscendant, rowCount });
  }

  if (allFailures.length || allCollisions.length) {
    console.error(`MIGRATION ABORTED — ${allFailures.length} parse failures, ${allCollisions.length} collisions`);
    for (const f of allFailures) console.error(`  parse: ${f}`);
    for (const c of allCollisions) console.error(`  collision: ${c}`);
    process.exit(1);
  }

  let legacyTotal = 0;
  for (const { lens, byAscendant, rowCount } of pending) {
    let lensTotal = 0;
    for (const [ascendant, entries] of byAscendant) {
      const n = writeSeedFile(ascendant.toLowerCase(), lens, entries);
      console.log(`${ascendant.toLowerCase()}/${lens}.json: ${n} entries`);
      lensTotal += n;
    }
    console.log(`[${lens}] ${rowCount} filled legacy rows → ${lensTotal} seed entries`);
    legacyTotal += lensTotal;
  }

  const globalTotal = migrateGlobal();
  console.log(`DONE: ${legacyTotal} legacy + ${globalTotal} global seed entries written.`);
}

main();
```

- [ ] **Step 2: Write the round-trip verifier**

`scripts/verify-migration.js` — checks **every** filled legacy row and every `event_templates` row resolves to its identical description via a strict (no-fallback) query of the seeded table:

```js
#!/usr/bin/env node
// Post-migration verification: every filled legacy row and every
// event_templates row must round-trip — its name parses, and a strict
// exact-key query of the seeded `interpretations` table returns the
// identical description. Zero lossy rows allowed.

const Database = require('better-sqlite3');
const path = require('path');
const { parseEventName } = require('../services/cosmos_event_parser');

const DB_DIR = path.join(__dirname, '..', 'db');
const LEGACY_LENSES = ['career', 'relationship', 'advice', 'food', 'investment'];

const cosmos = new Database(path.join(DB_DIR, 'cosmos.db'), { readonly: true });
const strictStmt = cosmos.prepare(`
  SELECT description FROM interpretations
  WHERE ascendant = @ascendant AND lens = @lens AND kind = @kind
    AND transit_planet = @transit_planet AND natal_planet = @natal_planet
    AND target_house = @target_house AND target_angle = @target_angle
    AND special_label = @special_label AND lord_house = @lord_house
    AND phase = @phase
`);

function strictLookup(ascendant, lens, key) {
  const row = strictStmt.get({
    ascendant,
    lens,
    kind: key.kind,
    transit_planet: key.transit_planet || '',
    natal_planet: key.natal_planet || '',
    target_house: key.target_house || 0,
    target_angle: key.target_angle || '',
    special_label: key.special_label || '',
    lord_house: key.lord_house || 0,
    phase: key.phase || 'window',
  });
  return row ? row.description : null;
}

let checked = 0;
const problems = [];

for (const lens of LEGACY_LENSES) {
  const db = new Database(path.join(DB_DIR, `${lens}_events.db`), { readonly: true });
  const rows = db.prepare(
    "SELECT ascendant, name, description FROM events WHERE description != ''",
  ).all();
  db.close();
  for (const r of rows) {
    checked++;
    const key = parseEventName(r.name);
    if (!key) { problems.push(`${lens}/${r.ascendant} "${r.name}": does not parse`); continue; }
    const got = strictLookup(r.ascendant, lens, key);
    if (got !== r.description) {
      problems.push(`${lens}/${r.ascendant} "${r.name}": expected description not found in interpretations`);
    }
  }
}

const templates = cosmos.prepare(`
  SELECT lens, kind, transit_planet, natal_planet, target_house, target_angle,
         special_label, lord_house, phase, display_name, description
  FROM event_templates
`).all();
for (const t of templates) {
  checked++;
  const got = strictLookup('*', t.lens, t);
  if (got !== t.description) {
    problems.push(`event_templates ${t.lens} "${t.display_name}": not found under ascendant '*'`);
  }
}

if (problems.length) {
  console.error(`VERIFICATION FAILED — ${problems.length} of ${checked} rows lossy:`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log(`VERIFIED: all ${checked} filled rows round-trip losslessly.`);
```

- [ ] **Step 3: Run the migration pipeline**

```bash
node scripts/migrate-legacy.js && npm run seed && node scripts/verify-migration.js
```

Expected: migration prints per-file entry counts and `DONE`; seed prints upsert totals; verifier prints `VERIFIED: all N filled rows round-trip losslessly.` with N ≈ 20,000 (≈15k legacy filled rows + 5,348 templates).

If the migration aborts on parse failures or collisions: **STOP** — report the full failure list to the human partner before changing anything. (A collision would falsify the design's §1 assumption and needs a design-level decision, not a workaround.)

- [ ] **Step 4: Sanity-check row counts**

```bash
node -e "
const db = require('better-sqlite3')('db/cosmos.db', { readonly: true });
console.table(db.prepare('SELECT ascendant, COUNT(*) AS rows FROM interpretations GROUP BY ascendant ORDER BY ascendant').all());
console.table(db.prepare('SELECT lens, COUNT(*) AS rows FROM interpretations GROUP BY lens ORDER BY lens').all());
"
```

Expected: `'*'` has 5,348 rows; seeded ascendants (Aries, Taurus, Cancer, Leo, Virgo, Sagittarius, Capricorn) have rows in career/relationship/advice/food; investment only for Aries + Capricorn; no rows for Gemini/Libra/Scorpio/Aquarius/Pisces.

- [ ] **Step 5: Full suite + idempotency spot check**

```bash
npm test && npm run seed && node scripts/verify-migration.js
```

Expected: all green; second seed run changes nothing.

- [ ] **Step 6: Commit (seeds + rebuilt DB + scripts)**

```bash
git add scripts/migrate-legacy.js scripts/verify-migration.js db/seeds/ db/cosmos.db
git commit -m "feat: migrate legacy + template interpretations into seed JSONs and the unified table"
```

---

### Task 6: `services/interpretations.js`

**Files:**
- Create: `services/interpretations.js`
- Test: `tests/interpretations_service.test.js`

- [ ] **Step 1: Write the failing test**

`tests/interpretations_service.test.js` — runs against the real (now-seeded) `db/cosmos.db`, using rows we know exist from Task 5:

```js
const { legacyLensLookup, pandaLookup } = require('../services/interpretations');
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '..', 'db', 'cosmos.db'), { readonly: true });

function pickRow(where) {
  return db.prepare(`
    SELECT * FROM interpretations WHERE ${where} LIMIT 1
  `).get();
}

describe('services/interpretations', () => {
  test('legacy lens lookup returns ascendant-specific text for a seeded ascendant', () => {
    // Any Capricorn career aspect row seeded from the legacy DB.
    const row = pickRow(
      "ascendant = 'Capricorn' AND lens = 'career' AND kind = 'aspect' AND description != ''",
    );
    expect(row).toBeDefined();
    const lookup = legacyLensLookup('career');
    expect(lookup(row.display_name, 'Capricorn')).toBe(row.description);
  });

  test('legacy lens lookup falls back to the generic set for an unseeded ascendant when Aries has no row', () => {
    // A transit_house key: generic set covers all of them; pick one with no
    // Gemini and no Aries row.
    const row = db.prepare(`
      SELECT g.* FROM interpretations g
      WHERE g.ascendant = '*' AND g.lens = 'career' AND g.kind = 'transit_house'
        AND NOT EXISTS (
          SELECT 1 FROM interpretations a
          WHERE a.ascendant IN ('Gemini', 'Aries') AND a.lens = g.lens
            AND a.kind = g.kind AND a.transit_planet = g.transit_planet
            AND a.target_house = g.target_house AND a.phase = g.phase
        )
      LIMIT 1
    `).get();
    if (!row) return; // every key covered by Aries — fallback order proven in unit tests
    const lookup = legacyLensLookup('career');
    expect(lookup(row.display_name, 'Gemini')).toBe(row.description);
  });

  test('panda lookup returns generic text for an unseeded ascendant', () => {
    const row = pickRow("ascendant = '*' AND lens = 'career' AND kind = 'aspect' AND phase = 'exact'");
    const lookup = pandaLookup('career');
    expect(lookup(row.display_name, 'Gemini')).toBe(row.description);
  });

  test('panda lookup prefers ascendant-specific text for a seeded ascendant', () => {
    const row = pickRow(
      "ascendant = 'Capricorn' AND lens = 'career' AND kind = 'aspect' AND description != ''",
    );
    const lookup = pandaLookup('career');
    expect(lookup(row.display_name, 'Capricorn')).toBe(row.description);
  });

  test('unparseable names return empty string', () => {
    expect(legacyLensLookup('career')('gibberish event', 'Aries')).toBe('');
    expect(pandaLookup('career')('gibberish event', 'Aries')).toBe('');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest tests/interpretations_service.test.js` — expected FAIL (module missing).

- [ ] **Step 3: Implement**

`services/interpretations.js`:

```js
// Unified interpretation lookup: engine event-name string → parsed
// structured key (services/cosmos_event_parser) → interpretations-table
// lookup with an ordered ascendant fallback chain (db/cosmos).
//
// Replaces the legacy get{Career,Relationship,Advice,Food,Investment}-
// EventInterpretation functions (per-lens name-string SQLite DBs) and
// getCosmosInterpretation (chart-agnostic event_templates lookup).

const { parseEventName } = require('./cosmos_event_parser');
const { lookupInterpretation } = require('../db/cosmos');

/**
 * Lens routes (/api/career, /relationship, /advice, /food, /investment-*):
 * ascendant-specific → Aries (the seeded baseline, mirroring the legacy
 * lookupEventWithFallback) → '*' generic set.
 * Returned function signature matches the old lookups: (description, ascendant) → string.
 */
function legacyLensLookup(lens) {
  return (description, ascendant) =>
    lookupInterpretation(lens, parseEventName(description), [ascendant, 'Aries', '*']);
}

/**
 * Panda routes (/api/panda/*): ascendant-specific → '*'. Aries is
 * deliberately NOT in this chain — the '*' set is the authored generic,
 * better than another native's chart-specific text.
 */
function pandaLookup(lens) {
  return (description, ascendant) =>
    lookupInterpretation(lens, parseEventName(description), [ascendant, '*']);
}

module.exports = { legacyLensLookup, pandaLookup };
```

(`lookupInterpretation` already returns `''` for a `null` key.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest tests/interpretations_service.test.js` then `npm test` — expected all green.

- [ ] **Step 5: Commit**

```bash
git add services/interpretations.js tests/interpretations_service.test.js
git commit -m "feat: unified interpretation lookup service with ascendant fallback chains"
```

---

### Task 7: Switch routes to the unified lookup (behavior change, isolated)

The only behavior-affecting change of the whole refactor, kept as a minimal diff inside the monolith so characterization deltas are attributable to it alone.

**Files:**
- Modify: `routes/reading.js`

- [ ] **Step 1: Replace the lookup wiring in `routes/reading.js`**

1. Delete lines 83–115 (the five legacy DB requires, `LOOKUP_SQL`, the five prepared statements, the `cosmosDb` require + `parseEventName` require + `getCosmosInterpretation`) **except** keep nothing — and delete lines 187–249 (`lookupEventWithFallback` + the five `get*EventInterpretation` wrappers). Keep `ascendantFromResult`, `baseEventName`, `SIGN_*`, `houseOrdinal`, `natalRulerDescriptions` (still used by `computeFilteredEvents`).
2. Add near the top (after the other service requires):

```js
const { legacyLensLookup, pandaLookup } = require('../services/interpretations');
```

3. Update the route registrations (old lines 769–782) to:

```js
router.post('/career', makeDebugHandler(legacyLensLookup('career')));
router.post('/relationship', makeDebugHandler(legacyLensLookup('relationship')));
router.post('/advice', makeDebugHandler(legacyLensLookup('advice')));
router.post('/food', makeDebugHandler(legacyLensLookup('food')));

// ── /api/panda/* routes ──────────────────────────────────────────────
// Same kerykeion call + same response shape as the legacy routes above;
// interpretation resolves ascendant-specific text first, then the
// generic ('*') template set.
router.post('/panda/career',       makeDebugHandler(pandaLookup('career')));
router.post('/panda/relationship', makeDebugHandler(pandaLookup('relationship')));

router.post('/investment-weekly', makePeriodHandler('week', legacyLensLookup('investment')));
router.post('/investment-monthly', makePeriodHandler('month', legacyLensLookup('investment')));
```

4. Confirm with `grep` that `routes/reading.js` no longer references `../db/career`, `../db/relationship`, `../db/advice`, `../db/food`, `../db/investment`, `../db/cosmos`, or `cosmos_event_parser` (the service owns those now), and that `lookupEventWithFallback` is gone.

- [ ] **Step 2: Fast suite**

Run: `npm test` — expected all green (route surface unchanged; unit suites unaffected).

- [ ] **Step 3: Characterization comparison — the key gate**

Run: `npm run test:characterization`
Expected: all 108 tests PASS. Allowed-delta log line may report gained/overridden interpretations (classes a/b/c from the design). **Any failure here is a regression — stop and investigate; do not loosen the delta rules.**

- [ ] **Step 4: Commit**

```bash
git add routes/reading.js
git commit -m "feat: serve all lens + panda routes from the unified interpretations table"
```

---

### Task 8: Extract `services/event-filter.js` (verbatim)

**Files:**
- Create: `services/event-filter.js`
- Modify: `routes/reading.js`

- [ ] **Step 1: Move the code — byte-for-byte**

Create `services/event-filter.js` containing, in this order, **moved verbatim** from `routes/reading.js` (current line numbers post-Task-7 will have shifted — locate by name):

1. A header comment:

```js
// The empirically-tuned transit-event dedup/milestone layer, extracted
// VERBATIM from routes/reading.js. Python emits an event on every day it's
// in orb; computeFilteredEvents collapses that into calendar-milestone days
// by comparing today's events against yesterday's and tomorrow's. The orb
// caps and slow-planet/node/Moon/MC-ASC special cases are pinned by the
// planner fixtures (npm run test:planner, 375/375) — do not "simplify".
```

2. `ascendantFromResult` (with its doc comment)
3. `baseEventName` (with its doc comment)
4. `SIGN_ORDER`, `SIGN_LORDS`, `CLASSICAL_PLANETS` (with comments)
5. `houseOrdinal` (with comment)
6. `natalRulerDescriptions` (with doc comment)
7. `computeFilteredEvents` — the **entire** function including every inner helper and comment, unmodified
8. Exports:

```js
module.exports = {
  computeFilteredEvents,
  ascendantFromResult,
  natalRulerDescriptions,
  baseEventName,
  houseOrdinal,
};
```

Then in `routes/reading.js`: delete the moved code and add:

```js
const { computeFilteredEvents, ascendantFromResult } = require('../services/event-filter');
```

(Only those two are referenced outside the moved block — verify with grep before deleting; if others are referenced, import them too.)

- [ ] **Step 2: Prove the move is verbatim**

```bash
git show HEAD:routes/reading.js > /tmp/before.js
node -e "
const before = require('fs').readFileSync('/tmp/before.js', 'utf8');
const after = require('fs').readFileSync('services/event-filter.js', 'utf8');
// computeFilteredEvents body must appear character-identical in the new file
const start = before.indexOf('function computeFilteredEvents');
const endMarker = before.indexOf('// Fetch kerykeion results for a list of dates');
const body = before.slice(start, endMarker).trimEnd();
if (!after.includes(body)) { console.error('NOT VERBATIM'); process.exit(1); }
console.log('verbatim: OK (' + body.length + ' chars)');
"
```

Expected: `verbatim: OK`.

- [ ] **Step 3: Fast suite**

Run: `npm test` — expected all green.

- [ ] **Step 4: Planner suite — the pinning gate for this task**

Run: `npm run test:planner`
Expected: **375/375 PASS** (~4.5 min). Any failure means the move wasn't verbatim — diff against `git show HEAD:routes/reading.js` and fix.

- [ ] **Step 5: Commit**

```bash
git add services/event-filter.js routes/reading.js
git commit -m "refactor: extract dedup/milestone layer verbatim into services/event-filter"
```

---

### Task 9: Split the routes monolith

Pure mechanical move — no logic edits. All paths stay mounted under `/api`.

**Files:**
- Create: `routes/_helpers.js`, `routes/index.js`, `routes/readings.js`, `routes/dasha.js`, `routes/market.js`, `routes/insights.js`, `routes/favourites.js`
- Modify: `routes/reading.js` (becomes a one-line re-export), `server.js`

- [ ] **Step 1: Create `routes/_helpers.js`**

Move verbatim from `routes/reading.js`: the `astrologyService` require + engine log line, `resolveTimezoneOrRespond`, `fetchResultsForDates`, `shiftDate`, `dateRange`, `makeDebugHandler`, `aggregatePeriod`, `makePeriodHandler` (with all doc comments). `makeDebugHandler`/`aggregatePeriod` import `computeFilteredEvents`/`ascendantFromResult` from `../services/event-filter`. Header comment:

```js
// Shared plumbing for the /api route modules: timezone resolution, engine
// result fetching, and the single-day / period reading handler factories.
// Moved verbatim from the old routes/reading.js monolith.
```

Exports:

```js
module.exports = {
  astrologyService,
  resolveTimezoneOrRespond,
  fetchResultsForDates,
  shiftDate,
  dateRange,
  makeDebugHandler,
  aggregatePeriod,
  makePeriodHandler,
};
```

- [ ] **Step 2: Create the route modules**

Each file: `const express = require('express'); const router = express.Router();` at top, `module.exports = router;` at bottom, handlers **moved verbatim** with the requires they need:

- `routes/readings.js` — `/career`, `/relationship`, `/advice`, `/food`, `/panda/career`, `/panda/relationship`, `/investment-weekly`, `/investment-monthly`. Requires: `makeDebugHandler`, `makePeriodHandler` from `./_helpers`; `legacyLensLookup`, `pandaLookup` from `../services/interpretations`.
- `routes/dasha.js` — `/dasha`, `/dasha-range`, `/caution-dates`, `/yearly-summary`. Move with them: `mergePeriod`, `getDashaDescriptions`, the `dashaDescriptions` JSON require, dasha/investment-dasha/varshaphal service requires, the in-handler lazy `require('../services/market-signal')` for `INVESTOR_PROFILES`, `VALID_CAUTION_LEVELS`, and any handler-local helpers between old lines 906–1373 that only these routes use.
- `routes/market.js` — `/market-signal`, `/market-signal-weekly` (keep their lazy `require('../services/market-signal')` calls and doc comments).
- `routes/insights.js` — `/essence-cycle`, `/monthly-prediction`, `/wealth-analysis`. Requires: `calculateEssenceCycle`, `getMonthlyPrediction`, `getWealthAnalysis`, `resolveTimezoneOrRespond` from `./_helpers`.
- `routes/favourites.js` — POST/GET/DELETE `/favourites`. Move the `favouritesDb` + `createFavouritesService` wiring.

Rule of thumb: for every moved handler, copy its body unchanged; then add exactly the requires its identifiers demand (grep each identifier). Nothing else.

- [ ] **Step 3: Create `routes/index.js` and shrink `routes/reading.js`**

`routes/index.js`:

```js
// Composes the /api route modules. server.js mounts this at /api.
const express = require('express');
const router = express.Router();

router.use(require('./readings'));
router.use(require('./dasha'));
router.use(require('./market'));
router.use(require('./insights'));
router.use(require('./favourites'));

module.exports = router;
```

`routes/reading.js` becomes exactly:

```js
// Compatibility re-export: the monolith was split into routes/{readings,
// dasha,market,insights,favourites}.js composed by routes/index.js.
// Kept so existing requires (tests, server bootstrap history) keep working.
module.exports = require('./index');
```

In `server.js`, change the mount line to:

```js
app.use('/api', require('./routes/index'));
```

**Caveat:** `tests/route_surface.test.js` walks `router.stack` and filters `layer.route` — with nested routers, sub-router layers have no `.route`, but their inner routes do not appear on the parent stack. To keep that test passing unchanged, `routes/index.js` must surface all routes on one stack. If the test fails after composition, switch `routes/index.js` to flat composition instead:

```js
// Flat composition: register every sub-module's routes directly on this
// router so route introspection (tests/route_surface.test.js) sees them.
const express = require('express');
const router = express.Router();

for (const mod of ['./readings', './dasha', './market', './insights', './favourites']) {
  const sub = require(mod);
  for (const layer of sub.stack) router.stack.push(layer);
}

module.exports = router;
```

Prefer the simplest variant that keeps `tests/route_surface.test.js` green **without editing the test**. (Alternative if stack-copying feels fragile: have each module export a `register(router)` function that adds its routes to the passed router, and call them all from `index.js` — equally flat, no stack surgery. Choose one; don't build both.)

- [ ] **Step 4: Fast suite (includes route surface)**

Run: `npm test` — expected all green, especially `route_surface.test.js` **unchanged**.

- [ ] **Step 5: Characterization — must be delta-free this time**

Run: `npm run test:characterization`
Expected: PASS with the **same** allowed-delta set as Task 7 (this task must not change behavior at all).

- [ ] **Step 6: Boot smoke test**

```bash
PORT=3999 timeout 5 node server.js; test $? -eq 124 && echo "boot OK"
```

Expected: engine banner prints, no stack trace, `boot OK`.

- [ ] **Step 7: Commit**

```bash
git add routes/ server.js
git commit -m "refactor: split routes monolith into readings/dasha/market/insights/favourites modules"
```

---

### Task 10: Documentation + final verification

**Files:**
- Modify: `CLAUDE.md`, `SEEDING_GUIDE.md`

- [ ] **Step 1: Update `CLAUDE.md`**

- **Commands**: replace the `seed:all` line with `npm run seed # node scripts/seed.js — rebuild db/cosmos.db from db/seeds/*.json` and add `npm run test:characterization`.
- **Request flow**: `server.js` mounts `routes/index.js` (composing `routes/{readings,dasha,market,insights,favourites}.js`) under `/api`; `routes/reading.js` is a compatibility re-export.
- **Dedup/milestone layer**: now lives in `services/event-filter.js` (still pinned by `npm run test:planner`).
- **Replace the "Two parallel interpretation-lookup systems" section** with a "Unified interpretations" section: single sparse `interpretations` table in `db/cosmos.db` keyed by (ascendant, lens, structured key); seeds under `db/seeds/` are source of truth; fallback chains `[ascendant, 'Aries', '*']` (lens routes) and `[ascendant, '*']` (panda routes) with per-ascendant phase→window fallback; `services/interpretations.js` + `services/cosmos_event_parser.js` at the boundary; legacy `*_events.db` files and seed JS remain on disk as reference but nothing at runtime reads them; adding an ascendant = JSON files + `npm run seed`.

- [ ] **Step 2: Add a pointer at the top of `SEEDING_GUIDE.md`**

Insert after the title:

```markdown
> **NOTE (2026-07):** This guide documents the *legacy* per-lens SQLite
> seeding flow. Runtime now reads the unified `interpretations` table in
> `db/cosmos.db`, built from JSON seeds under `db/seeds/` by `npm run seed`.
> To add a new ascendant today: author `db/seeds/<ascendant>/<lens>.json`
> (same entry shape as the existing files) and run `npm run seed`.
> Sections 1–2 (birth-chart computation) and §6 (reference charts) remain
> accurate and useful.
```

- [ ] **Step 3: Final full verification**

```bash
npm test && npm run test:planner && npm run test:characterization
```

Expected: default suite green, planner **375/375**, characterization green.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md SEEDING_GUIDE.md
git commit -m "docs: describe unified interpretations architecture and new seeding flow"
```

---

## Post-plan

After all tasks: dispatch a final code review over the whole branch, then use superpowers:finishing-a-development-branch.
