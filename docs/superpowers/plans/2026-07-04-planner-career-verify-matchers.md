# Planner Career Verify Matchers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract event titles from each Galactic Planner PDF into golden fixtures and e2e-test `POST /api/career` so every PDF title appears in the response (subset match on titles only).

**Architecture:** Offline PDF parse → `tests/fixtures/plannerN.json`. Shared Jest runner loads fixtures, POSTs Jack’s birth payload + each `transitDate` to an in-process Express app (no rate limiter), and asserts every expected title is present in `aspects[].description` ∪ `rulers[].description` after normalization.

**Tech Stack:** Node.js, Express, Jest, `pdftotext` (poppler, offline extraction only), Python kerykeion via existing career route

**Spec:** `docs/superpowers/specs/2026-07-04-planner-career-verify-matchers-design.md`

---

## File map

| Path | Action |
|---|---|
| `tests/helpers/planner_titles.js` | Create — normalize titles, collect API titles, subset check |
| `tests/helpers/planner_titles.test.js` | Create — unit tests for normalizer / subset |
| `tests/helpers/test_app.js` | Create — Express app mounting `/api` without rate limiter + `postJson` |
| `scripts/extract_planner_fixtures.js` | Create — one-shot PDF → fixture extractor (not run in CI) |
| `tests/fixtures/planner1.json` … `planner11.json` | Create — golden titles per day |
| `tests/verify_planner_career.test.js` | Create — e2e subset matcher against career API |

No production route changes. PDFs stay untracked at repo root for local re-extraction.

---

### Task 1: Title normalizer + subset helper (TDD)

**Files:**
- Create: `tests/helpers/planner_titles.js`
- Create: `tests/helpers/planner_titles.test.js`

- [ ] **Step 1: Write the failing unit tests**

Create `tests/helpers/planner_titles.test.js`:

```javascript
const {
  normalizeTitle,
  titlesFromCareerResponse,
  missingTitles,
} = require('./planner_titles');

describe('normalizeTitle', () => {
  test('trims and collapses whitespace', () => {
    expect(normalizeTitle('  Moon   aspect  Venus  ')).toBe('moon aspect venus');
  });

  test('is case-insensitive', () => {
    expect(normalizeTitle('Mars in 8th (Dispositor)')).toBe(
      normalizeTitle('mars in 8th (dispositor)'),
    );
  });

  test('treats optional "the" before house ordinal as equivalent', () => {
    expect(normalizeTitle('Venus ruler of the 7th House in the 8th house')).toBe(
      normalizeTitle('Venus ruler of the 7th House in 8th house'),
    );
    expect(normalizeTitle('Moon aspect Venus in 8th house')).toBe(
      normalizeTitle('Moon aspect Venus in the 8th house'),
    );
  });

  test('treats Transit and Transits as equivalent', () => {
    expect(normalizeTitle('Sun Transit the 12th House')).toBe(
      normalizeTitle('Sun Transits the 12th House'),
    );
  });

  test('preserves phase suffixes', () => {
    expect(normalizeTitle('Saturn aspect Sun in 9th house : Exact')).toContain(': exact');
  });
});

describe('titlesFromCareerResponse', () => {
  test('unions aspects and rulers descriptions', () => {
    const titles = titlesFromCareerResponse({
      aspects: [{ description: 'Moon Transits the 8th House' }],
      rulers: [
        { description: 'Mars in 8th (Dispositor)' },
        { description: 'Venus ruler of the 7th House in the 8th house' },
      ],
    });
    expect(titles).toEqual([
      'Moon Transits the 8th House',
      'Mars in 8th (Dispositor)',
      'Venus ruler of the 7th House in the 8th house',
    ]);
  });

  test('skips missing descriptions', () => {
    expect(titlesFromCareerResponse({
      aspects: [{ description: null }, {}],
      rulers: [],
    })).toEqual([]);
  });
});

describe('missingTitles', () => {
  test('returns empty when all expected titles are present (subset)', () => {
    const missing = missingTitles(
      ['Mars in 8th (Dispositor)', 'Moon aspect Venus in 8th house'],
      [
        'Moon aspect Venus in the 8th house',
        'Mars in 8th (Dispositor)',
        'Extra API title',
      ],
    );
    expect(missing).toEqual([]);
  });

  test('returns expected titles not found in actual', () => {
    const missing = missingTitles(
      ['Mars in 8th (Dispositor)', 'Venus ruler of the 7th House in the 8th house'],
      ['Mars in 8th (Dispositor)'],
    );
    expect(missing).toEqual(['Venus ruler of the 7th House in the 8th house']);
  });

  test('empty expected list never reports missing', () => {
    expect(missingTitles([], ['anything'])).toEqual([]);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx jest tests/helpers/planner_titles.test.js --verbose`

Expected: FAIL — `Cannot find module './planner_titles'`

- [ ] **Step 3: Implement the helper**

Create `tests/helpers/planner_titles.js`:

```javascript
/**
 * Title normalization and subset matching for Galactic Planner career e2e.
 *
 * Rules (see design spec):
 * 1. trim + collapse whitespace
 * 2. case-insensitive
 * 3. optional "the" before house ordinal: "in 8th house" ≡ "in the 8th house"
 * 4. "Transit" ≡ "Transits"
 */

function normalizeTitle(title) {
  if (title == null) return '';
  let s = String(title).trim().replace(/\s+/g, ' ').toLowerCase();
  // Transit / Transits
  s = s.replace(/\btransits\b/g, 'transit');
  // optional "the" before an ordinal house: "in the 8th" → "in 8th"
  s = s.replace(/\bin the (\d+(?:st|nd|rd|th))\b/g, 'in $1');
  return s;
}

function titlesFromCareerResponse(body) {
  const aspects = (body && body.aspects) || [];
  const rulers = (body && body.rulers) || [];
  const out = [];
  for (const a of aspects) {
    if (a && a.description) out.push(a.description);
  }
  for (const r of rulers) {
    if (r && r.description) out.push(r.description);
  }
  return out;
}

/**
 * Return expected titles that are not present in actualTitles (subset check).
 * Preserves original expected strings for failure messages.
 */
function missingTitles(expectedTitles, actualTitles) {
  const actualSet = new Set((actualTitles || []).map(normalizeTitle));
  return (expectedTitles || []).filter(t => !actualSet.has(normalizeTitle(t)));
}

module.exports = {
  normalizeTitle,
  titlesFromCareerResponse,
  missingTitles,
};
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest tests/helpers/planner_titles.test.js --verbose`

Expected: all PASS

- [ ] **Step 5: Commit**

```bash
git add tests/helpers/planner_titles.js tests/helpers/planner_titles.test.js
git commit -m "$(cat <<'EOF'
test: add planner title normalizer and subset matcher helpers

EOF
)"
```

---

### Task 2: In-process test app (no rate limiter)

**Files:**
- Create: `tests/helpers/test_app.js`

- [ ] **Step 1: Create the helper**

Create `tests/helpers/test_app.js`:

```javascript
/**
 * Minimal Express app for e2e tests: mounts reading routes under /api
 * without the production rate limiter (100 req/day would block planner runs).
 */
const http = require('http');
const express = require('express');
const readingRouter = require('../../routes/reading');

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api', readingRouter);
  return app;
}

/**
 * Start `app` on an ephemeral port, POST JSON to `path`, return
 * { status, body }. Closes the server after the response.
 *
 * Prefer startTestServer + postToServer when issuing many requests.
 */
function postJson(app, path, body) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      const data = JSON.stringify(body);
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port,
          path,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data),
          },
        },
        (res) => {
          let buf = '';
          res.on('data', (c) => { buf += c; });
          res.on('end', () => {
            server.close();
            let parsed = buf;
            try { parsed = JSON.parse(buf); } catch (_) { /* leave as string */ }
            resolve({ status: res.statusCode, body: parsed });
          });
        },
      );
      req.on('error', (err) => {
        server.close();
        reject(err);
      });
      req.write(data);
      req.end();
    });
  });
}

/**
 * Start app once; returns { port, close, post(path, body) }.
 */
function startTestServer(app) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({
        port,
        close: () => new Promise((r) => server.close(r)),
        post(path, body) {
          return new Promise((res, rej) => {
            const data = JSON.stringify(body);
            const req = http.request(
              {
                hostname: '127.0.0.1',
                port,
                path,
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Content-Length': Buffer.byteLength(data),
                },
              },
              (response) => {
                let buf = '';
                response.on('data', (c) => { buf += c; });
                response.on('end', () => {
                  let parsed = buf;
                  try { parsed = JSON.parse(buf); } catch (_) { /* leave */ }
                  res({ status: response.statusCode, body: parsed });
                });
              },
            );
            req.on('error', rej);
            req.write(data);
            req.end();
          });
        },
      });
    });
    server.on('error', reject);
  });
}

module.exports = { createTestApp, postJson, startTestServer };
```

- [ ] **Step 2: Smoke-check the helper loads**

Run: `node -e "const { createTestApp } = require('./tests/helpers/test_app'); console.log(typeof createTestApp())"`

Expected: prints something like `[object Object]` / no throw (Express app).

- [ ] **Step 3: Commit**

```bash
git add tests/helpers/test_app.js
git commit -m "$(cat <<'EOF'
test: add in-process Express helper without rate limiter

EOF
)"
```

---

### Task 3: PDF → fixture extractor script

**Files:**
- Create: `scripts/extract_planner_fixtures.js`

- [ ] **Step 1: Create the extractor**

Create `scripts/extract_planner_fixtures.js`:

```javascript
#!/usr/bin/env node
/**
 * One-shot offline extractor: My Galactic Planner N.pdf → tests/fixtures/plannerN.json
 *
 * Requires `pdftotext` (poppler) on PATH. Not run in CI — fixtures are committed.
 *
 * Usage:
 *   node scripts/extract_planner_fixtures.js
 *   node scripts/extract_planner_fixtures.js 1 5 11
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FIXTURES = path.join(ROOT, 'tests', 'fixtures');

const PLANETS = 'Moon|Sun|Mercury|Venus|Mars|Jupiter|Saturn|Rahu|Ketu';
const DAY_RE = /^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday),\s+([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})\s*$/;
const MONTHS = {
  January: '01', February: '02', March: '03', April: '04',
  May: '05', June: '06', July: '07', August: '08',
  September: '09', October: '10', November: '11', December: '12',
};

// Title start: planet + (Transit(s)|aspect|ruler|in Nth (Dispositor))
const TITLE_START_RE = new RegExp(
  `^\\s*(${PLANETS})\\s+` +
  `(?:` +
    `Transits?\\b` +
    `|aspect\\b` +
    `|ruler\\b` +
    `|in\\s+\\d+(?:st|nd|rd|th)\\s+\\(Dispositor\\)` +
  `)`,
  'i',
);

const LEGEND_RE = /Frequent slightly impactful|Infrequent Impactful|Rare Extremely Impactful|GALACTIC|Daily Predictions|No significant events/i;
const CONTINUATION_RE = /^\s*(House|house|\d+(?:st|nd|rd|th)\s+House)\s*$/;

function toIso(weekday, monthName, day, year) {
  const mm = MONTHS[monthName];
  if (!mm) throw new Error(`Unknown month: ${monthName}`);
  return `${year}-${mm}-${String(Number(day)).padStart(2, '0')}`;
}

function collapseWs(s) {
  return s.replace(/\s+/g, ' ').trim();
}

function isTitleStart(line) {
  return TITLE_START_RE.test(line) && !LEGEND_RE.test(line);
}

function extractDays(text) {
  const lines = text.split(/\r?\n/);
  const days = {};
  let currentDate = null;
  let pendingTitle = null;

  function flushPending() {
    if (pendingTitle && currentDate) {
      days[currentDate].push(collapseWs(pendingTitle));
      pendingTitle = null;
    }
  }

  function ensureDay(date) {
    if (!days[date]) days[date] = [];
  }

  for (const raw of lines) {
    const line = raw.replace(/\f/g, '');
    const dayMatch = line.match(DAY_RE);
    if (dayMatch) {
      flushPending();
      currentDate = toIso(dayMatch[1], dayMatch[2], dayMatch[3], dayMatch[4]);
      ensureDay(currentDate);
      continue;
    }
    if (!currentDate) continue;

    if (/No significant events today/i.test(line)) {
      flushPending();
      continue;
    }
    if (LEGEND_RE.test(line)) continue;

    if (pendingTitle && CONTINUATION_RE.test(line)) {
      pendingTitle = `${pendingTitle} ${collapseWs(line)}`;
      flushPending();
      continue;
    }

    // Continuation of a wrapped title that still looks like title fragment
    // e.g. previous ended with "in the" and this is "8th House"
    if (pendingTitle && /^\s*\d+(?:st|nd|rd|th)\s+House\s*$/i.test(line)) {
      pendingTitle = `${pendingTitle} ${collapseWs(line)}`;
      flushPending();
      continue;
    }

    if (isTitleStart(line)) {
      flushPending();
      pendingTitle = collapseWs(line);
      // If title already looks complete (ends with house / dispositor / phase), flush
      if (/(?:house|House|\(Dispositor\))\s*(?::\s*(?:Starts|Exact|Ends))?\s*$/.test(pendingTitle)
          && !/\bin the\s*$/i.test(pendingTitle)
          && !/\bin the \d+(?:st|nd|rd|th)\s*$/i.test(pendingTitle)) {
        // still may be incomplete if ends with "in the 8th" without House
        if (/\bin(?:\s+the)?\s+\d+(?:st|nd|rd|th)\s*$/i.test(pendingTitle)) {
          // wait for "House" continuation
        } else {
          flushPending();
        }
      }
      continue;
    }

    // Non-title line ends any pending title
    if (pendingTitle && collapseWs(line).length > 0) {
      flushPending();
    }
  }
  flushPending();
  return days;
}

function extractPdf(pdfPath) {
  const text = execFileSync('pdftotext', ['-layout', pdfPath, '-'], {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
  return extractDays(text);
}

function main() {
  fs.mkdirSync(FIXTURES, { recursive: true });
  const args = process.argv.slice(2).map(Number).filter(n => n >= 1 && n <= 11);
  const nums = args.length ? args : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  for (const n of nums) {
    const pdfName = `My Galactic Planner ${n}.pdf`;
    const pdfPath = path.join(ROOT, pdfName);
    if (!fs.existsSync(pdfPath)) {
      console.error(`SKIP ${pdfName} (not found)`);
      continue;
    }
    const days = extractPdf(pdfPath);
    const out = { source: pdfName, days };
    const outPath = path.join(FIXTURES, `planner${n}.json`);
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
    const dayCount = Object.keys(days).length;
    const eventCount = Object.values(days).reduce((a, t) => a + t.length, 0);
    console.log(`Wrote ${outPath} (${dayCount} days, ${eventCount} titles)`);
  }
}

main();
```

- [ ] **Step 2: Run extractor for all PDFs**

Run: `node scripts/extract_planner_fixtures.js`

Expected: 11 lines like `Wrote .../tests/fixtures/plannerN.json (N days, M titles)`.

If a PDF is missing, fix path / restore PDF and re-run.

- [ ] **Step 3: Spot-check planner1 against known titles**

Run:

```bash
node -e "
const f = require('./tests/fixtures/planner1.json');
console.log(f.days['2026-03-09']);
console.log('days', Object.keys(f.days).length);
"
```

Expected: `2026-03-09` includes titles such as:
- `Moon Transits the 8th House`
- `Moon aspect Venus in 8th house`
- `Venus ruler of the 2nd House in the 8th House`
- `Venus ruler of the 7th House in the 8th house`

If titles are split/missing, adjust `TITLE_START_RE` / continuation logic in the extractor and re-run Step 2.

- [ ] **Step 4: Commit fixtures + script**

```bash
git add scripts/extract_planner_fixtures.js tests/fixtures/planner1.json tests/fixtures/planner2.json tests/fixtures/planner3.json tests/fixtures/planner4.json tests/fixtures/planner5.json tests/fixtures/planner6.json tests/fixtures/planner7.json tests/fixtures/planner8.json tests/fixtures/planner9.json tests/fixtures/planner10.json tests/fixtures/planner11.json
git commit -m "$(cat <<'EOF'
test: add planner fixtures extracted from Galactic Planner PDFs

EOF
)"
```

---

### Task 4: E2E career verify matcher

**Files:**
- Create: `tests/verify_planner_career.test.js`

- [ ] **Step 1: Write the e2e suite**

Create `tests/verify_planner_career.test.js`:

```javascript
/**
 * E2e: every Galactic Planner PDF title must appear in POST /api/career
 * for Jack on that transitDate (subset match on titles only).
 *
 * Fixtures: tests/fixtures/plannerN.json
 * Spec: docs/superpowers/specs/2026-07-04-planner-career-verify-matchers-design.md
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
```

- [ ] **Step 2: Run a single day smoke test first**

Temporarily limit to one day by running:

```bash
npx jest tests/verify_planner_career.test.js -t "2026-03-09" --verbose
```

Expected: PASS if engine matches planner for that day; FAIL with missing titles listed if not.

If FAIL due to normalizer gaps (e.g. `in the 9th` vs `in 9th`), extend `normalizeTitle` in Task 1 and re-run unit tests, then this smoke.

If FAIL due to bad fixture extraction (garbled titles), fix extractor, re-run `node scripts/extract_planner_fixtures.js`, commit fixture updates.

- [ ] **Step 3: Run the full e2e suite**

Run: `npx jest tests/verify_planner_career.test.js --verbose`

Expected: all days with non-empty expected titles PASS. This will take a long time (many days × kerykeion).

If individual days fail because the engine intentionally differs from the PDF, do **not** silently drop titles. Either:
- fix the engine (out of scope for this plan), or
- document the known drift in the test failure and leave the fixture as the PDF truth (test stays red until engine catches up), or
- only if the PDF title is clearly a parse artifact (not a real event), fix the extractor.

- [ ] **Step 4: Commit**

```bash
git add tests/verify_planner_career.test.js
git commit -m "$(cat <<'EOF'
test: e2e career title subset matchers for all planner fixtures

EOF
)"
```

---

### Task 5: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Run unit + e2e**

```bash
npx jest tests/helpers/planner_titles.test.js tests/verify_planner_career.test.js --verbose
```

Expected: all PASS.

- [ ] **Step 2: Confirm no production files changed**

```bash
git diff main --stat
```

Expected: only `docs/superpowers/`, `tests/`, and `scripts/extract_planner_fixtures.js` (plus any prior commits on the branch). No changes to `routes/reading.js` career logic unless a normalizer-only fix was needed in tests.

- [ ] **Step 3: Final commit if any fixture/normalizer fixes remain uncommitted**

```bash
git status
# if dirty:
git add -A tests/ scripts/extract_planner_fixtures.js
git commit -m "$(cat <<'EOF'
test: polish planner career verify fixtures and normalizer

EOF
)"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|---|---|
| Extract titles from PDFs 1–11 | Task 3 |
| Fixtures at `tests/fixtures/plannerN.json` | Task 3 |
| Jack birth payload + `transitDate` | Task 4 |
| Titles from `aspects` + `rulers` only | Task 1 + 4 |
| Subset match (API may have extras) | Task 1 `missingTitles` |
| Empty days: no assertion | Task 4 skip branch |
| Normalize: trim, case, optional `the`, Transit/Transits | Task 1 |
| Phase suffixes part of title | Task 1 + 3 |
| In-process app, no rate limiter | Task 2 |
| Failures name planner, date, missing titles | Task 4 error message |
| No interpretation/impact compare | Task 4 (never reads those fields) |

## Notes for the implementer

- Career calls Python kerykeion three times per day (yesterday/today/tomorrow). Full suite is slow; keep `DAY_TIMEOUT` at 180s.
- Do not commit the PDFs unless the user asks.
- Re-extract fixtures after PDF updates: `node scripts/extract_planner_fixtures.js`.
