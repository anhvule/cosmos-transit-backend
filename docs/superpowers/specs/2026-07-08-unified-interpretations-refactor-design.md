# Unified Interpretations Refactor — Design

**Date:** 2026-07-08
**Status:** Approved (user), pending implementation plan

## Problem

The backend has two parallel interpretation-lookup systems:

1. **Legacy per-lens SQLite DBs** (`db/career_events.db`, `relationship_events.db`,
   `advice_events.db`, `food_events.db`, `investment_events.db`) keyed by
   `(ascendant, event-name-string)`. Each holds ~52,000 rows (12 ascendants ×
   ~4,328 possible event names) of which only ~530 per seeded ascendant are
   filled — ~250,000 empty placeholder rows across ~42MB of DB files.
2. **Structured template DB** (`db/cosmos.db`, `event_templates` table) keyed by
   parsed structured keys (kind/planets/house/phase) — fully filled (764
   templates × 7 lenses) but with **no ascendant dimension at all**.

Seeding a new ascendant today means generating 4–7 new ~100KB JS files with
inline SQL (`seed_<lens>_<asc>.js`, `_<asc>_<lens>.js`, `_fill_<asc>.js`,
`_generate_<asc>_seeds.js` — ~40 files, ~5MB). `routes/reading.js` is a
1,500-line monolith mixing route handlers, the empirically-tuned
dedup/milestone logic, and interpretation lookups.

The user wants to add more ascendants over time; the data model and seed
tooling must make that a data-only operation.

## Decisions (user-approved)

1. **Consolidate on the structured-key model** with an added ascendant
   dimension; migrate legacy name-string content into it.
2. **Full Node-side restructure** (routes split, services extracted). Python
   engine untouched.
3. **JSON seed data + one generic runner**; the DB becomes a rebuildable
   artifact, seeds are the source of truth in git.
4. **Keep legacy files in place.** The 5 legacy `.db` files and the ~40 seed
   JS files remain in the repo untouched as reference/backup. Runtime stops
   reading them.

## 1. Data model

Single `interpretations` table in `db/cosmos.db`:

```sql
CREATE TABLE interpretations (
  id             INTEGER PRIMARY KEY,
  ascendant      TEXT NOT NULL,          -- 'Aries'…'Pisces', or '*' for the generic fallback set
  lens           TEXT NOT NULL,          -- career|relationship|advice|food|investment|gain|loss
  kind           TEXT NOT NULL,          -- aspect|angle_aspect|outer_special|transit_house|ruler|dispositor
  transit_planet TEXT NOT NULL DEFAULT '',
  natal_planet   TEXT NOT NULL DEFAULT '',
  target_house   INTEGER NOT NULL DEFAULT 0,
  target_angle   TEXT NOT NULL DEFAULT '',
  special_label  TEXT NOT NULL DEFAULT '',
  lord_house     INTEGER NOT NULL DEFAULT 0,
  phase          TEXT NOT NULL DEFAULT 'window',  -- window|starts|exact|ends
  display_name   TEXT NOT NULL,
  description    TEXT NOT NULL,
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (ascendant, lens, kind, transit_planet, natal_planet,
          target_house, target_angle, special_label, lord_house, phase)
);
CREATE INDEX idx_interp_lookup
  ON interpretations(lens, ascendant, kind, transit_planet, natal_planet, phase);
```

Properties:

- **Sparse:** only filled descriptions are stored (~15,000 rows total after
  migration). No empty placeholders.
- **Lookup fallback chains**, configured per route family (a single lookup
  function taking an ordered ascendant list):
  - Legacy lens routes (`/api/career` etc.): `[ascendant, 'Aries', '*']`.
    The first two steps mirror today's `lookupEventWithFallback`; the final
    `'*'` step is a strict improvement — where today an event with no Aries
    row returns an empty interpretation, it now returns the generic text.
  - Panda routes (`/api/panda/*`): `[ascendant, '*']`. Today panda serves
    only the chart-agnostic set; after the refactor a seeded ascendant gets
    its specific text and unseeded ascendants get `'*'` (identical to
    today). Aries is deliberately not in this chain — the `'*'` set is the
    authored generic, better than another native's chart-specific text.
  - `'*'` holds the current chart-agnostic `event_templates` content,
    migrated as-is.
- **Name parsing at the boundary:** engine event-name strings are converted to
  structured keys by `services/cosmos_event_parser.js` (extended as needed to
  cover every name shape `db/seed_all_ascendants.js#generateEventNames` can
  produce, including ruler events). A wording change in the engine breaks one
  parser test, not thousands of stored keys.
- Note on aspects: structured aspect keys deliberately discard the natal house
  (per ascendant seed-chart, each natal planet occupies exactly one house, so
  the house adds no discriminating information). The migration must verify
  this holds for every filled legacy row (no two legacy rows for the same
  ascendant+lens may collapse to the same structured key with different
  descriptions; abort and report if one does).

## 2. Seeds — source of truth

```
db/seeds/
  _global/<lens>.json         ← migrated from today's event_templates ('*' set; 7 lenses)
  capricorn/<lens>.json       ← migrated from legacy DBs (filled rows only)
  aries/… taurus/… cancer/… leo/… virgo/… sagittarius/…
scripts/seed.js               ← npm run seed [-- --ascendant=X --lens=Y]
scripts/migrate-legacy.js     ← one-time: legacy DBs + event_templates → seed JSON files
```

Seed entry shape:

```json
{
  "kind": "aspect",
  "transit_planet": "Mars",
  "natal_planet": "Venus",
  "phase": "exact",
  "display_name": "Mars aspect Venus in 9th house : Exact",
  "description": "…"
}
```

(Empty-default key fields omitted, matching `db/export_templates.js` style.)

- `npm run seed` rebuilds/upserts `cosmos.db` from all seed files,
  idempotently. **Adding a new ascendant = adding JSON files under
  `db/seeds/<ascendant>/` and running `npm run seed`.** No new code.
- The old `npm run seed:all` placeholder-scaffolding step becomes unnecessary
  (sparse model needs no placeholders) but the script remains in the repo per
  decision 4; `package.json`'s `seed:all` is repointed to the new runner.
- The migration script is kept (not one-shot-deleted) so the process is
  reproducible, but it is only ever run against the legacy files.

## 3. Code restructure

All paths stay mounted under `/api` exactly as today —
`tests/route_surface.test.js` must pass unchanged.

```
routes/
  index.js         ← composes the routers below; server.js mounts this at /api
  readings.js      ← /career /relationship /advice /food /panda/career
                     /panda/relationship /investment-weekly /investment-monthly
  dasha.js         ← /dasha /dasha-range /caution-dates /yearly-summary
  market.js        ← /market-signal /market-signal-weekly
  insights.js      ← /essence-cycle /monthly-prediction /wealth-analysis
  favourites.js    ← POST/GET/DELETE /favourites
services/
  event-filter.js      ← computeFilteredEvents + its helpers, moved VERBATIM
  interpretations.js   ← event-name → parsed key → DB lookup with fallback
                         chain; replaces get{Career,Relationship,Advice,Food,
                         Investment}EventInterpretation and
                         getCosmosInterpretation
db/
  cosmos.js        ← single better-sqlite3 connection + prepared statements;
                     the only runtime module that touches cosmos.db
```

Constraints:

- `services/event-filter.js` is an **extraction, not a rewrite**. The orb
  caps, slow-planet/node/Moon/MC-ASC special cases move byte-for-byte; the
  planner fixtures (`npm run test:planner`, 375/375) pin this.
- Shared route plumbing (`resolveTimezoneOrRespond`, `makeDebugHandler`,
  `makePeriodHandler`, batch helpers) moves to a small shared module used by
  the route files; behavior unchanged.
- `db/career.js`, `relationship.js`, `advice.js`, `food.js`, `investment.js`
  and `_events-schema.js` stay on disk (decision 4) but nothing at runtime
  requires them anymore.

## 4. Migration & safety net

Order of operations:

1. **Characterization snapshots:** capture current responses of `/api/career`,
   `/api/relationship`, `/api/advice`, `/api/food`, `/api/panda/career`,
   `/api/panda/relationship` for a Capricorn chart (the real natal from
   SEEDING_GUIDE §6), an Aries chart, and an unseeded-ascendant chart
   (e.g. Gemini), across at least 6 transit dates spread over 2026. Stored
   as test fixtures; compared after the refactor. Expected deltas are
   limited to exactly two documented improvement classes: (a) legacy routes
   returning `'*'` text where both the ascendant and Aries rows were empty,
   and (b) panda routes returning ascendant-specific text for seeded
   ascendants. Every other byte must match.
2. **Migration:** run `scripts/migrate-legacy.js` → seed JSONs → `npm run
   seed` → new table. Verify **every filled legacy row round-trips**: its
   event name parses, the row inserts, and a lookup by parsed key returns the
   identical description. Zero lossy rows allowed (collision check from §1).
3. **Code restructure** on the new lookup path.
4. **Verification:** full `npm test`, `npm run test:planner` (375/375),
   characterization snapshots byte-identical.
5. Legacy files remain in place (decision 4) — no deletions.

New permanent tests:

- Parser round-trip: every event name from `generateEventNames` (all 12
  ascendants) parses to a structured key, and distinct names that must stay
  distinct produce distinct keys.
- Seed-runner idempotency: running `npm run seed` twice yields identical DB
  contents.
- Fallback chain order: legacy chain `[ascendant, 'Aries', '*']` and panda
  chain `[ascendant, '*']` each resolve in order, first non-empty wins.

## 5. Performance

- One DB connection, WAL mode, covering index on the lookup key, prepared
  statements created once at module load (already the better-sqlite3 pattern
  in `db/cosmos.js`).
- Dropping ~250k placeholder rows removes ~42MB of runtime DB weight.
- No change to the Python-subprocess-per-request model (out of scope).

## 6. Out of scope

- Python engine internals (`services/astrology_kerykeion.py`).
- Dasha/market-timing rule logic and the bundled chart panel.
- API contract changes, auth, rate limiting.
- Scaffold-generator CLI for authoring new ascendants (revisit when the next
  ascendant is actually authored).
- Deleting legacy `.db`/seed JS files (explicitly kept per user decision).
