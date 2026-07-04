# API Surface Prune Design

**Date:** 2026-07-04  
**Approach:** Consumer-inventory prune (Approach A)  
**Constraint:** Do not change request/response contracts for any endpoint currently used by `panda-app` or `cosmos-transit-ui`.

## Goal

Remove unused HTTP APIs and the code, data modules, tests, and scratch files that exist only to support them. Live clients must keep working with identical paths and JSON shapes.

## Consumers and live endpoints

Inventory was taken from the sibling projects under `CosmosTransit/`:

| Consumer | Endpoints |
|---|---|
| Infra | `GET /health` |
| panda-app | `POST /api/panda/career`, `POST /api/panda/relationship` |
| cosmos-transit-ui | `POST /api/career`, `/relationship`, `/advice`, `/food`, `/investment-weekly`, `/investment-monthly`, `/dasha`, `/dasha-range`, `/caution-dates`, `/essence-cycle`, `/yearly-summary`, `/monthly-prediction`, `/wealth-analysis` |
| cosmos-transit-ui | `POST /api/favourites`, `GET /api/favourites`, `DELETE /api/favourites/:id` |

### Out of scope

- `POST /api/market-signal-weekly` is called by cosmos-transit-ui but does not exist on this backend. Do not implement it and do not treat it as a live backend route.
- No path renames, field renames, or interpretation-source swaps (UI keeps legacy lens DBs; panda keeps `cosmos.db`).
- `server.js` mount points (`/api`, `/health`) stay as they are.

## Routes to remove

From `routes/reading.js`:

- `POST /reading` (Gemini AI reading)
- `POST /debug` (legacy main events DB)
- `POST /investment` (daily investment lens; UI uses weekly/monthly only)
- `POST /network`
- `POST /engineering`
- `POST /gain`
- `POST /loss`
- Unused panda lenses: `/panda/investment`, `/panda/advice`, `/panda/food`, `/panda/gain`, `/panda/loss`
- `POST /events-calendar`
- `POST /investment-loss-days`
- `POST /investment-gain-days`

Remove only the handlers and private helpers that become unreachable after those deletions. Keep shared plumbing used by live routes (`makeDebugHandler`, `makePeriodHandler`, timezone resolution, chart/dasha helpers, etc.).

## Cascade delete

Delete only modules that nothing in the keep-list imports.

### Services

- Delete `services/gemini.js` (only used by `/reading`).
- In `services/astrology_kerykeion_bridge.js`, remove `getMatchingDatesForMonth`, `getInvestmentLossDaysForMonth`, `getInvestmentGainDaysForMonth`, and any private helpers used only by those functions.
- Drop `@google/generative-ai` from `package.json` if no remaining import uses it.

### Database modules and seeds

Delete legacy lens DBs and seeds used only by removed routes:

- `db/index.js` and `db/seed.js` (main events DB for `/debug` / `/reading`), plus any companion `*.db` files those modules open
- `db/network.js`, `db/engineering.js`, `db/gain.js`, `db/loss.js`, plus their companion `*.db` files
- Matching `seed_*`, fill/generate, and authored scripts that only target network / engineering / gain / loss
- Update `db/seed_all_ascendants.js` to drop network / engineering / gain / loss entries
- Update `package.json` scripts that point at deleted seed entrypoints (e.g. `"seed": "node db/seed.js"`)

**Keep:**

- career, relationship, advice, food, investment DBs and their seeds (cosmos-transit-ui)
- `db/cosmos.js` / `db/cosmos.db` (panda career + relationship)
- favourites, duality, transit-meanings, dasha-descriptions, monthly-predictions, wealth-descriptions, and other data still required by live services

Unused lenses may remain as inert rows inside `cosmos.db`. Do not migrate or strip that data; only remove the unused `/panda/*` routes.

### Tests

- Delete `tests/events_calendar.test.js`
- Keep favourites, essence_cycle, monthly_prediction, varshaphal, wealth-analysis, and astrology tests

### Root and repo hygiene

Delete scratch and authoring artifacts that are not part of the runtime or kept seed pipeline, including:

- `_dbg_*`, `_debug_*`, `_dump_*`, `_orb_*`, `_parse_*`, `_probe_*`, `_check_*`, `_mars_*`, `_mc_*`, `_route_*`, `_asctest.js`
- `verify_*.js`, `planner*.json`
- Planner / authoring docs (docx, pdf, xlsx) and `*.preclaudebak` backups at repo root / `db/`
- Untracked scratch under `docs/superpowers/plans/` that is not this prune work (e.g. the untracked panda neutralization plan). Leave committed docs that belong to other features alone.

Do not delete `.env`, committed seed databases required by live routes, tracked production config, or committed design/plan docs for unrelated features.

## Architecture after prune

```
server.js
  GET /health
  /api -> routes/reading.js
            panda: career, relationship          -> cosmos.db
            lenses: career, relationship,
                    advice, food                 -> legacy * DBs
            investment-weekly / monthly          -> investment DB
            dasha, dasha-range, caution-dates    -> dasha + investment-dasha
            essence-cycle                        -> essence-cycle service
            yearly-summary, monthly-prediction   -> varshaphal / monthly-prediction
            wealth-analysis                      -> wealth-analysis service
            favourites CRUD                      -> favourites service/db
```

No new route modules. No behavior changes on kept paths. This is deletion and dead-code removal only.

## Verification

1. Grep this repo for removed route path strings; no live code should still register them.
2. `npm test` — all remaining tests pass.
3. Start the server; `GET /health` returns ok; removed paths return 404.
4. Confirm kept routes still register (route table / require graph for panda career/relationship and at least one UI legacy lens).

## Success criteria

- panda-app and cosmos-transit-ui need no code changes.
- Every endpoint they call today still exists with the same contract.
- Unused routes and their exclusive dependency trees are gone.
- Scratch/debug/authoring files no longer clutter the repo root.
