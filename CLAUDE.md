# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

CosmicTransit.ai backend — an Express API serving Vedic/Western astrology
readings (transit events, Vimshottari dasha, Varshaphal annual horoscope,
wealth analysis, market timing signals, numerology) computed from a natal
birth chart. Chart math runs locally via a Python (kerykeion / Swiss
Ephemeris) subprocess, not an external astrology API.

## Commands

```bash
npm run dev                 # node --watch server.js (port from .env, default 3000)
npm start                   # node server.js
npm test                    # jest (excludes verify_planner_career.test.js — see below)
npx jest tests/dasha        # run a single test file/pattern
npm run test:planner        # runs ONLY verify_planner_career.test.js (e2e vs. real PDF planner fixtures)
npm run seed:all            # node db/seed_all_ascendants.js — reseed all per-ascendant description DBs
```

Python side (kerykeion engine + varshaphal, under `.venv`):
```bash
.venv/bin/python -m pytest tests/astrology_kerykeion_test.py tests/varshaphal_test.py
```

Required env vars (see `.env.example`): `ASTROLOGY_ENGINE=kerykeion` (the only
supported engine — the legacy `api` path referenced in code comments has been
removed), `PYTHON_BIN` (defaults to `python3`), `PORT`.

## Architecture

### Request flow

`server.js` mounts `routes/reading.js` under `/api`. Every reading endpoint
calls `services/astrology_kerykeion_bridge.js`, which spawns
`services/astrology_kerykeion.py` as a child process per request (JSON over
stdin/stdout; `--json` for a single date, `--json-batch` for many dates in
one Python invocation). The Python side computes a **sidereal (Lahiri)**
natal chart (whole-sign houses, Ascendant) and a **tropical** transit chart,
and emits a flat list of transit "events" (aspects, house ingresses, MC/ASC
aspects, ruler/dispositor placements), each tagged with a `phase` qualifier
(`: Starts` / `: Exact` / `: Ends`) where applicable.

### The dedup/milestone layer (routes/reading.js)

Python emits an event on *every day* it's in orb; `routes/reading.js` is
responsible for collapsing that into single calendar-milestone days (the
"first day of approach", "day of closest orb", "last day separating"), by
comparing today's events against yesterday's and tomorrow's. This logic
(`computeFilteredEvents`, plus the batch-mode equivalent in
`astrology_kerykeion_bridge.js`'s `getMatchingDatesForMonth`) is the most
subtle part of the codebase: slow planets (Jupiter/Saturn), lunar nodes
(Rahu/Ketu), Moon aspects, and MC/ASC aspects each get different orb caps
and "local minimum vs. last-day-in-window" rules, tuned empirically against
real planner report PDFs (see `tests/fixtures/plannerN.json` and
`tests/verify_planner_career.test.js`). Don't simplify these orb caps
without re-running `npm run test:planner`.

### Two parallel interpretation-lookup systems

- **Legacy per-lens SQLite DBs** (`db/career.js`, `relationship.js`,
  `investment.js`, `advice.js`, `food.js`): flat tables keyed by
  `(event name, ascendant)`. Lookup falls back to the Aries row when the
  requested ascendant has no seeded description yet
  (`lookupEventWithFallback` in `routes/reading.js`). Backs
  `/api/career`, `/api/relationship`, `/api/advice`, `/api/food`.
- **Structured template DB** (`db/cosmos.db`, accessed via `db/cosmos.js`):
  keyed by a parsed structured key (`kind`, `transit_planet`, `natal_planet`,
  `target_house`, `target_angle`, `special_label`, `lord_house`, `phase`)
  rather than a name string. `services/cosmos_event_parser.js` converts the
  engine's English event-name strings (e.g. `"Mars aspect Venus in 9th
  house : Exact"`) into that key. Backs `/api/panda/career` and
  `/api/panda/relationship`, running alongside the legacy routes (not a
  replacement yet).

New per-native description seeding for the legacy DBs follows
`SEEDING_GUIDE.md`.

### Dasha / market-timing stack

`services/dasha.js` computes Vimshottari Mahadasha/Antardasha/Pratyantardasha/
Sookshmadasha from the natal Moon's sidereal longitude.
`services/investment-dasha.js` annotates each period as favorable/cautious
against natal placements (`db/dasha-descriptions.json` supplies static
MD/AD/PD text). `/api/caution-dates` and `/api/market-signal(-weekly)`
evaluate these same rules against a small panel of bundled, publicly-attested
birth charts (see comments in `routes/reading.js` for the current panel and
why birth-time accuracy matters here) rather than the requesting user's
chart — this is a market-wide signal, not a personal one. Transit overlays on
dasha were tested empirically and dropped (no accuracy lift over natal-only);
don't re-add without re-validating.

### Other independent services

`services/varshaphal.js` (Tajika annual horoscope), `services/wealth-analysis.js`,
`services/monthly-prediction.js`, `services/essence-cycle.js` (Western/
Pythagorean numerology — the only endpoint with no kerykeion dependency), and
`services/favourites.js` + `db/favourites.js` (per-device bookmark CRUD,
identity is an opaque client-generated `userKey`, no auth) are each
self-contained and map 1:1 to a route handler.

`services/timezone.js` resolves `req.body.timezone`: the public API now
takes a numeric UTC offset (e.g. `7`, `-5`); legacy IANA strings (e.g.
`"Asia/Ho_Chi_Minh"`) still pass through. Invalid input throws
`TimezoneError`, which route handlers convert to a 400.

### Testing conventions

- `tests/helpers/test_app.js` builds a minimal Express app (reading router
  only, no rate limiter) and starts it on an ephemeral port for real HTTP
  e2e tests — used instead of supertest.
- `tests/route_surface.test.js` pins the exact set of registered routes;
  update its `KEEP_POST` list when adding/removing an endpoint.
- `tests/fixtures/plannerN.json` are golden fixtures extracted from real
  "Galactic Planner" PDF reports (via `scripts/extract_planner_fixtures.js`
  / `scripts/merge_ics_into_fixtures.js`) — ground truth for the dedup
  layer, not adjustable to make tests pass.
- Python tests (`tests/astrology_kerykeion_test.py`, `tests/varshaphal_test.py`)
  cover the Swiss Ephemeris engine directly and run separately from Jest.
