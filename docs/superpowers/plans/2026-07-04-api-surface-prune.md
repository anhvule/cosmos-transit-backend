# API Surface Prune Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove every HTTP route and exclusive dependency not used by `panda-app` or `cosmos-transit-ui`, without changing live request/response contracts.

**Architecture:** Consumer-inventory prune. Keep the existing `server.js` → `routes/reading.js` mount. Delete dead handlers first (guarded by a route-surface regression test), then cascade-delete services, DB modules/seeds, tests, and root scratch files that nothing live imports.

**Tech Stack:** Node.js, Express, better-sqlite3, Jest

**Spec:** `docs/superpowers/specs/2026-07-04-api-surface-prune-design.md`

---

## File map

| Path | Action |
|---|---|
| `tests/route_surface.test.js` | Create — keep/remove route inventory |
| `routes/reading.js` | Modify — delete dead routes + dead helpers/imports |
| `services/gemini.js` | Delete |
| `services/astrology_kerykeion_bridge.js` | Modify — delete batch calendar/gain/loss helpers |
| `package.json` / `package-lock.json` | Modify — drop `@google/generative-ai`, fix `seed` script |
| `.env.example` | Modify — remove `GEMINI_API_KEY` |
| `db/index.js`, `db/seed.js`, `db/galactic_events.db` | Delete |
| `db/network.js`, `db/network_events.db`, `db/seed_network.js` | Delete |
| `db/engineering.js`, `db/engineering_events.db`, `db/seed_engineering.js` | Delete |
| `db/gain.js`, `db/gain_events.db`, `db/seed_gain*.js` | Delete |
| `db/loss.js`, `db/loss_events.db`, `db/seed_loss*.js` | Delete |
| `db/seed_all_ascendants.js` | Modify — drop galactic/network/engineering/gain/loss |
| `tests/events_calendar.test.js` | Delete |
| Root `_dbg_*`, `_orb_*`, `verify_*`, `planner*`, authoring docs, `*.preclaudebak` | Delete |
| `docs/superpowers/plans/2026-07-04-panda-api-neutralization-plan.md` | Delete (untracked, unrelated) |

**Keep unchanged (behavior):** career/relationship/advice/food/investment DBs, `cosmos.db`, favourites, dasha/essence/varshaphal/wealth/monthly services, `server.js` mounts.

---

### Task 1: Route-surface regression test (TDD guardrail)

**Files:**
- Create: `tests/route_surface.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/route_surface.test.js`:

```javascript
const router = require('../routes/reading');

function registeredPaths(method) {
  return router.stack
    .filter((layer) => layer.route && layer.route.methods[method])
    .map((layer) => layer.route.path)
    .sort();
}

const KEEP_POST = [
  '/advice',
  '/career',
  '/caution-dates',
  '/dasha',
  '/dasha-range',
  '/essence-cycle',
  '/favourites',
  '/food',
  '/investment-monthly',
  '/investment-weekly',
  '/monthly-prediction',
  '/panda/career',
  '/panda/relationship',
  '/relationship',
  '/wealth-analysis',
  '/yearly-summary',
].sort();

const KEEP_GET = ['/favourites'];
const KEEP_DELETE = ['/favourites/:id'];

const REMOVE_POST = [
  '/reading',
  '/debug',
  '/investment',
  '/network',
  '/engineering',
  '/gain',
  '/loss',
  '/panda/investment',
  '/panda/advice',
  '/panda/food',
  '/panda/gain',
  '/panda/loss',
  '/events-calendar',
  '/investment-loss-days',
  '/investment-gain-days',
];

describe('API route surface', () => {
  test('registers exactly the live POST routes', () => {
    expect(registeredPaths('post')).toEqual(KEEP_POST);
  });

  test('registers live GET favourites', () => {
    expect(registeredPaths('get')).toEqual(KEEP_GET);
  });

  test('registers live DELETE favourites/:id', () => {
    expect(registeredPaths('delete')).toEqual(KEEP_DELETE);
  });

  test('does not register removed POST routes', () => {
    const posts = new Set(registeredPaths('post'));
    for (const path of REMOVE_POST) {
      expect(posts.has(path)).toBe(false);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest tests/route_surface.test.js --verbose`

Expected: FAIL — `registers exactly the live POST routes` because removed paths are still registered (actual list is longer than `KEEP_POST`).

- [ ] **Step 3: Commit the failing guardrail**

```bash
git add tests/route_surface.test.js
git commit -m "$(cat <<'EOF'
test: add route-surface inventory for API prune

EOF
)"
```

---

### Task 2: Remove dead routes from `routes/reading.js`

**Files:**
- Modify: `routes/reading.js`
- Test: `tests/route_surface.test.js`

- [ ] **Step 1: Remove dead imports and DB wiring**

At the top of `routes/reading.js`, delete:

```javascript
const { generateReading } = require('../services/gemini');
```

and the destructure of dead bridge helpers:

```javascript
const { getInvestmentLossDaysForMonth, getInvestmentGainDaysForMonth } = astrologyService;
```

(keep `astrologyService = require('../services/astrology_kerykeion_bridge')` and the engine log line).

Delete these requires and prepared statements:

```javascript
const db = require('../db/index');
const networkDb = require('../db/network');
const engineeringDb = require('../db/engineering');
const gainDb = require('../db/gain');
const lossDb = require('../db/loss');

const lookupEvent = db.prepare(LOOKUP_SQL);
const lookupNetworkEvent = networkDb.prepare(LOOKUP_SQL);
const lookupEngineeringEvent = engineeringDb.prepare(LOOKUP_SQL);
const lookupGainEvent = gainDb.prepare(LOOKUP_SQL);
const lookupLossEvent = lossDb.prepare(LOOKUP_SQL);
```

Keep investment/career/relationship/advice/food/cosmos requires and their `lookup*` statements.

- [ ] **Step 2: Remove dead interpretation helpers**

Delete these functions entirely:

- `getEventInterpretation`
- `getNetworkEventInterpretation`
- `getEngineeringEventInterpretation`
- `getGainEventInterpretation`
- `getLossEventInterpretation`

Keep:

- `getInvestmentEventInterpretation` (used by `/investment-weekly` and `/investment-monthly`)
- `getCareerEventInterpretation`, `getRelationshipEventInterpretation`, `getAdviceEventInterpretation`, `getFoodEventInterpretation`
- `getCosmosInterpretation`

- [ ] **Step 3: Remove dead route handlers**

Delete the entire `router.post('/reading', ...)` handler block (currently ~lines 237–303).

Delete these registrations and their full handler bodies / comments:

```javascript
router.post('/debug', makeDebugHandler(getEventInterpretation));
router.post('/investment', makeDebugHandler(getInvestmentEventInterpretation));
router.post('/network', makeDebugHandler(getNetworkEventInterpretation));
router.post('/engineering', makeDebugHandler(getEngineeringEventInterpretation));
router.post('/gain', makeDebugHandler(getGainEventInterpretation));
router.post('/loss', makeDebugHandler(getLossEventInterpretation));
router.post('/panda/investment',   makeDebugHandler(getCosmosInterpretation('investment')));
router.post('/panda/advice',       makeDebugHandler(getCosmosInterpretation('advice')));
router.post('/panda/food',         makeDebugHandler(getCosmosInterpretation('food')));
router.post('/panda/gain',         makeDebugHandler(getCosmosInterpretation('gain')));
router.post('/panda/loss',         makeDebugHandler(getCosmosInterpretation('loss')));
```

Delete the full `router.post('/events-calendar', ...)`, `router.post('/investment-loss-days', ...)`, and `router.post('/investment-gain-days', ...)` blocks (including their JSDoc comments).

After edits, the lens registrations must be exactly:

```javascript
router.post('/career', makeDebugHandler(getCareerEventInterpretation));
router.post('/relationship', makeDebugHandler(getRelationshipEventInterpretation));
router.post('/advice', makeDebugHandler(getAdviceEventInterpretation));
router.post('/food', makeDebugHandler(getFoodEventInterpretation));

router.post('/panda/career',       makeDebugHandler(getCosmosInterpretation('career')));
router.post('/panda/relationship', makeDebugHandler(getCosmosInterpretation('relationship')));

router.post('/investment-weekly', makePeriodHandler('week', getInvestmentEventInterpretation));
router.post('/investment-monthly', makePeriodHandler('month', getInvestmentEventInterpretation));
```

Do not modify `makeDebugHandler`, `makePeriodHandler`, dasha/essence/favourites/yearly/monthly/wealth handlers, or response shapes.

- [ ] **Step 4: Run route-surface tests**

Run: `npx jest tests/route_surface.test.js --verbose`

Expected: PASS — all four tests green.

- [ ] **Step 5: Commit**

```bash
git add routes/reading.js
git commit -m "$(cat <<'EOF'
refactor: remove unused API routes from reading router

EOF
)"
```

---

### Task 3: Delete Gemini service and dependency

**Files:**
- Delete: `services/gemini.js`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.env.example`

- [ ] **Step 1: Delete the service file**

```bash
rm services/gemini.js
```

- [ ] **Step 2: Remove the npm dependency**

```bash
npm uninstall @google/generative-ai
```

Expected: `package.json` no longer lists `@google/generative-ai`; lockfile updates.

- [ ] **Step 3: Clean `.env.example`**

Remove the `GEMINI_API_KEY=...` line from `.env.example`. Leave other keys intact.

- [ ] **Step 4: Confirm no remaining imports**

Run: `rg "gemini|generative-ai|GEMINI_API_KEY" --glob '!docs/**' --glob '!node_modules/**'`

Expected: no matches in runtime code (docs may still mention historical context; ignore docs if any).

- [ ] **Step 5: Commit**

```bash
git add services/gemini.js package.json package-lock.json .env.example
git commit -m "$(cat <<'EOF'
chore: remove unused Gemini reading service

EOF
)"
```

---

### Task 4: Prune dead helpers from astrology bridge

**Files:**
- Modify: `services/astrology_kerykeion_bridge.js`
- Delete: `tests/events_calendar.test.js`

- [ ] **Step 1: Delete the events-calendar test**

```bash
rm tests/events_calendar.test.js
```

- [ ] **Step 2: Remove dead functions from the bridge**

In `services/astrology_kerykeion_bridge.js`, delete:

1. `callPythonBatch` (only used by the three functions below)
2. `getMatchingDatesForMonth` (lines ~218–539)
3. `getInvestmentLossDaysForMonth` (lines ~541–727)
4. `getInvestmentGainDaysForMonth` (lines ~729–890)

Update `module.exports` to:

```javascript
module.exports = {
  getNatalTransits,
  getNatalTransitsAndReport,
  calculateTransitReport,
};
```

Do not change `callPython`, `getNatalTransits`, `getNatalTransitsAndReport`, or `calculateTransitReport`.

- [ ] **Step 3: Run remaining tests that use the bridge**

Run: `npx jest tests/astrology.test.js tests/route_surface.test.js --verbose`

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add services/astrology_kerykeion_bridge.js tests/events_calendar.test.js
git commit -m "$(cat <<'EOF'
chore: remove unused calendar and gain/loss day helpers

EOF
)"
```

---

### Task 5: Delete dead DB modules, seeds, and databases

**Files:**
- Delete (modules + DBs):
  - `db/index.js`, `db/seed.js`, `db/galactic_events.db`
  - `db/network.js`, `db/network_events.db`, `db/seed_network.js`
  - `db/engineering.js`, `db/engineering_events.db`, `db/seed_engineering.js`
  - `db/gain.js`, `db/gain_events.db`, `db/seed_gain.js`, `db/seed_gain_aries.js`, `db/seed_gain_capricorn.js`
  - `db/loss.js`, `db/loss_events.db`, `db/seed_loss.js`, `db/seed_loss_aries.js`, `db/seed_loss_capricorn.js`
- Delete (backups): `db/seed_gains.js.preclaudebak`, `db/seed_loss.js.preclaudebak`, `db/seed_food.js.preclaudebak`
- Modify: `db/seed_all_ascendants.js`
- Modify: `package.json`

- [ ] **Step 1: Update `db/seed_all_ascendants.js` DBS list**

Replace the `DBS` array with only live legacy lenses:

```javascript
const DBS = [
  { label: 'advice',   module: './advice' },
  { label: 'career',   module: './career' },
  { label: 'investment', module: './investment' },
  { label: 'relationship', module: './relationship' },
  { label: 'food',     module: './food' },
];
```

- [ ] **Step 2: Update `package.json` scripts**

Remove the broken `"seed": "node db/seed.js"` script. Keep `"seed:all": "node db/seed_all_ascendants.js"`.

Resulting scripts block:

```json
"scripts": {
  "start": "node server.js",
  "dev": "node --watch server.js",
  "test": "jest --verbose",
  "seed:all": "node db/seed_all_ascendants.js"
}
```

- [ ] **Step 3: Delete dead files**

```bash
rm \
  db/index.js db/seed.js db/galactic_events.db \
  db/network.js db/network_events.db db/seed_network.js \
  db/engineering.js db/engineering_events.db db/seed_engineering.js \
  db/gain.js db/gain_events.db db/seed_gain.js db/seed_gain_aries.js db/seed_gain_capricorn.js \
  db/loss.js db/loss_events.db db/seed_loss.js db/seed_loss_aries.js db/seed_loss_capricorn.js \
  db/seed_gains.js.preclaudebak db/seed_loss.js.preclaudebak db/seed_food.js.preclaudebak
```

- [ ] **Step 4: Confirm no live requires of deleted modules**

Run: `rg "db/(index|network|engineering|gain|loss)|seed_network|seed_engineering|seed_gain|seed_loss|galactic_events" --glob '!docs/**' --glob '!.claude/**' --glob '!node_modules/**'`

Expected: no matches in runtime code.

- [ ] **Step 5: Run full test suite**

Run: `npm test`

Expected: all remaining tests PASS (route_surface, favourites, essence_cycle, monthly_prediction, varshaphal, wealth-analysis, astrology).

- [ ] **Step 6: Commit**

```bash
git add -A db/ package.json
git commit -m "$(cat <<'EOF'
chore: delete unused lens databases and seed scripts

EOF
)"
```

---

### Task 6: Root and repo hygiene

**Files:**
- Delete untracked/scratch authoring and debug artifacts at repo root and untracked neutralization plan

- [ ] **Step 1: Delete debug/verify/planner scripts**

```bash
rm -f \
  _asctest.js \
  _check_mars_venus.py _check_mv_p4.py \
  _dbg_jmc.py _dbg_mj.js _dbg_p10.js _dbg_p10b.js _dbg_p10c.js _dbg_p10d.js \
  _dbg_p10e.py _dbg_p10f.py _dbg_p10g.py _dbg_p10h.py \
  _dbg_p6_826.js _dbg_p8_1201.js _dbg_p_all.py _dbg_py.py \
  _debug_0713.js _debug_1106.js \
  _dump_aspects.js _dump_node_pos.py _dump_raw.js _dump_route_aspect.js \
  _mars_mc.py _mars_pos.py _mc_dump.py \
  _orb_dump5.js _orb_dump_mars2.py _orb_dump_mars_mc.py _orb_dump_mc.py \
  _orb_dump_mc.py.bak _orb_dump_moon.py _orb_jmc.py _orb_mars_venus.py \
  _orb_moon_all.py _orb_p10.py _orb_p10b.py _orb_p10c.py _orb_p10d.py \
  _orb_p10e.py _orb_p10f.py _orb_p10g.py _orb_p15_all.py \
  _orb_p6.py _orb_p6b.py _orb_p6c.py _orb_p7.py _orb_p7b.py _orb_p7c.py \
  _orb_p8.py _orb_p8b.py _orb_p9.py _orb_p_all.py _orb_p_all2.py \
  _parse_planner1.py _parse_planner10.py _parse_planner11.py \
  _parse_planner2.py _parse_planner3.py _parse_planner5.py _parse_planner9.py \
  _probe_missing.js _route_dump_p6.js \
  verify_planner1.js verify_planner2.js verify_planner3.js verify_planner4.js \
  verify_planner5.js verify_planner6.js verify_planner7.js verify_planner8.js \
  verify_planner9.js verify_planner10.js verify_planner11.js verify_tmp.js \
  planner1.json planner2.json planner3.json planner4.json planner5.json \
  planner6.json planner7.json planner8.json planner9.json planner10.json planner11.json
```

- [ ] **Step 2: Delete authoring documents**

```bash
rm -f \
  "Book1.xlsx" "Dasha.docx" "Monthly prediction.docx" \
  "My Galactic Planner 1.docx" "My Galactic Planner 2.docx" \
  "My Galactic Planner 3.docx" "My Galactic Planner 4.docx" \
  "My Galactic Planner 5.docx" "My Galactic Planner 5.pdf" \
  "My Galactic Planner 6.docx" "My Galactic Planner 7.docx" \
  "My Galactic Planner 8.docx" "My Galactic Planner 9.docx" \
  "My Galactic Planner 10.docx" "My Galactic Planner 10.pdf" \
  "My Galactic Planner 11.docx" "My Galactic Planner.pdf" \
  "SuddenGainSigns.docx" "SuddenLossesSigns.docx" \
  "Wealth.docx" "Yearly.docx"
```

- [ ] **Step 3: Delete untracked unrelated plan**

```bash
rm -f docs/superpowers/plans/2026-07-04-panda-api-neutralization-plan.md
```

Do **not** delete committed docs for other features (e.g. `docs/superpowers/specs/2026-07-04-panda-api-neutralization-design.md`).

- [ ] **Step 4: Confirm root is clean of scratch patterns**

Run: `ls -1 _* verify_* planner* *.docx *.pdf *.xlsx 2>/dev/null`

Expected: no output (or only “No such file” style errors).

- [ ] **Step 5: Commit any tracked deletions; leave purely untracked removals as filesystem-only**

If any deleted files were tracked:

```bash
git add -A
git status
git commit -m "$(cat <<'EOF'
chore: remove debug scripts and authoring scratch files

EOF
)"
```

If everything deleted in this task was untracked, there may be nothing to commit — that is fine; note it in the commit message of Task 7 instead.

---

### Task 7: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Full test suite**

Run: `npm test`

Expected: all tests PASS.

- [ ] **Step 2: Server smoke — health + removed routes 404 + kept routes registered**

Start server in background:

```bash
node server.js &
sleep 1
```

Then:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/health
# Expected: 200

curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/debug \
  -H 'content-type: application/json' -d '{}'
# Expected: 404

curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/reading \
  -H 'content-type: application/json' -d '{}'
# Expected: 404

curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/panda/career \
  -H 'content-type: application/json' -d '{}'
# Expected: 400 (route exists; validation fails on empty body)

curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/career \
  -H 'content-type: application/json' -d '{}'
# Expected: 400 (route exists; validation fails on empty body)

kill %1
```

- [ ] **Step 3: Grep for removed route registrations**

Run:

```bash
rg "router\.(post|get|delete)\('/(reading|debug|network|engineering|gain|loss|events-calendar|investment-loss-days|investment-gain-days|panda/(investment|advice|food|gain|loss))" routes/
```

Expected: no matches.

Also confirm daily investment is gone but weekly/monthly remain:

```bash
rg "router\.post\('/investment" routes/reading.js
```

Expected: only `/investment-weekly` and `/investment-monthly` (no bare `/investment`).

- [ ] **Step 4: Final commit if any verification-driven fixes remain**

Only if fixes were needed:

```bash
git add -A
git commit -m "$(cat <<'EOF'
fix: finish API surface prune verification

EOF
)"
```

Otherwise no commit.

---

## Spec coverage checklist

| Spec requirement | Task |
|---|---|
| Keep live panda + UI endpoints unchanged | Tasks 1–2 (guardrail + selective delete) |
| Remove listed dead routes | Task 2 |
| Delete `services/gemini.js` + `@google/generative-ai` | Task 3 |
| Remove calendar/gain/loss bridge helpers | Task 4 |
| Delete dead DB modules/seeds/dbs; update `seed_all` + package scripts | Task 5 |
| Delete `tests/events_calendar.test.js` | Task 4 |
| Root hygiene (debug/verify/planner/docs/backups) | Task 6 |
| Leave `market-signal-weekly` unimplemented | No task (explicit non-action) |
| Leave inert cosmos.db lenses | No task (explicit non-action) |
| Verification (tests, health, 404s, kept routes) | Task 7 |
