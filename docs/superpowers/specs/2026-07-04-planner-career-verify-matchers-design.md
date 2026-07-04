# Planner Career Verify Matchers — Design

**Date:** 2026-07-04  
**Status:** Approved (Approach A)  
**Endpoint under test:** `POST /api/career`

## Goal

Rebuild the deleted root `verify_planner*.js` / `planner*.json` golden checks as committed e2e tests. For each day in each Galactic Planner PDF, call the career API with Jack’s birth data and assert that every PDF event **title** appears in the response. Interpretations and impact are ignored.

## Scope

**In scope**

- Extract event titles from `My Galactic Planner 1.pdf` … `My Galactic Planner 11.pdf`
- Commit one golden fixture per PDF under `tests/fixtures/`
- One shared Jest e2e runner that POSTs to `/api/career` per fixture day
- Subset match only: every expected title must be present; API may return extra titles

**Out of scope**

- Comparing `interpretation` or `impact`
- Exact set equality (no missing / no extras)
- Runtime PDF parsing in CI
- Other lenses (`/relationship`, `/advice`, `/food`, `/panda/*`)

## Fixed request body

```json
{
  "name": "Jack",
  "birthDate": "1991-12-29",
  "birthTime": "13:30",
  "latitude": "10.7765713",
  "longitude": "106.7012093",
  "timezone": "Asia/Ho_Chi_Minh",
  "transitDate": "<YYYY-MM-DD from fixture>"
}
```

## Response fields used

Career returns:

```json
{
  "date": "2026-04-08",
  "aspects": [{ "impact": "...", "description": "...", "interpretation": "..." }],
  "rulers": [{ "description": "...", "interpretation": "..." }]
}
```

**Titles under test** = `aspects[].description` ∪ `rulers[].description`.

Examples of titles (from PDFs):

- `Mars in 8th (Dispositor)`
- `Venus ruler of the 7th House in the 8th house`
- `Moon aspect Venus in 8th house`
- `Saturn aspect Sun in 9th house : Exact`

Phase suffixes (`: Starts`, `: Exact`, `: Ends`) are part of the title and must match.

## Fixture format

Path: `tests/fixtures/plannerN.json` for N = 1..11.

```json
{
  "source": "My Galactic Planner 1.pdf",
  "days": {
    "2026-03-09": [
      "Moon Transits the 8th House",
      "Moon aspect Venus in 8th house",
      "Venus ruler of the 2nd House in the 8th House",
      "Venus ruler of the 7th House in the 8th house"
    ],
    "2026-03-10": []
  }
}
```

- Keys are ISO dates (`YYYY-MM-DD`) for every day listed in that PDF.
- Values are ordered lists of event titles for that day (order is not asserted).
- Empty array means the PDF said “No significant events today”. Subset match still passes if the API returns titles; we only fail when a **non-empty** expected title is missing.

## Title extraction (one-time, offline)

Parse each PDF with `pdftotext -layout`, then:

1. Split on day headers (`Monday, March 09, 2026` → `2026-03-09`).
2. Collect event title lines (planet/transit/aspect/ruler/dispositor headings), not body copy.
3. Join line-wrapped titles (e.g. `Venus ruler of the 2nd House in the 8th` + `House`).
4. Collapse internal whitespace; trim.
5. Preserve phase suffixes when present on the title line.
6. Skip legend chrome (`Frequent slightly impactful event`, etc.) and interpretation paragraphs.

Write results into the fixture files. PDFs themselves are source documents and need not be committed for the tests to run.

## Normalization for comparison

Apply the same normalizer to expected titles and API titles before subset check:

1. Trim
2. Collapse runs of whitespace to a single space
3. Case-insensitive compare
4. Known PDF/API variants (only these):
   - optional `the` before house ordinal: `in 8th house` ≡ `in the 8th house`
   - `Transit` ≡ `Transits` (e.g. `Sun Transit the 12th House` ≡ `Sun Transits the 12th House`)

Document these rules in `tests/helpers/planner_titles.js`. Do not invent further rewrites.

## Matcher logic

Per fixture day:

1. `POST /api/career` with Jack payload and that `transitDate`.
2. Collect API titles from `aspects` and `rulers`.
3. For each expected title, assert `normalize(expected)` is in the set of `normalize(apiTitle)`.
4. On failure, report date, missing title(s), and actual API titles.

Days with `[]` expected titles: no assertions (pass).

## Test layout

```
tests/
  fixtures/
    planner1.json
    …
    planner11.json
  helpers/
    planner_titles.js      # normalizeTitle, titlesFromCareerResponse, assertSubset
  verify_planner_career.test.js
```

`verify_planner_career.test.js`:

- Loads all `tests/fixtures/planner*.json`
- Hits career in-process (no external server process)
- One `describe` per planner fixture; one `it` per day (or batched per fixture with clear failure messages)
- Long Jest timeout (ephemeris / Python batch is slow; target ≥ 3 minutes per fixture or per day as needed)

**In-process access (rate limit):** `server.js` applies a 100-req/day limiter on `/api/`, which would block a full planner run (~hundreds of days). Tests must not go through that limiter. Preferred approach:

1. Export `app` from `server.js` only when `require.main === module` for listen; always `module.exports = app`.
2. In tests, build a minimal Express app that mounts `routes/reading` with `express.json()` and **no** rate limiter, then `POST /career` via `http` against that app (or `supertest` if added as a devDependency).

Do not disable rate limiting in production.

## Architecture

```
PDF (offline) → plannerN.json fixtures
                      ↓
         verify_planner_career.test.js
                      ↓
              POST /api/career (in-process app)
                      ↓
         aspects[].description + rulers[].description
                      ↓
              subset assert (normalized titles only)
```

## Error handling

- Non-2xx career response → test failure with status and body snippet.
- Missing fixture file → fail at suite load.
- Malformed fixture (missing `days`) → fail at suite load.

## Success criteria

- All 11 fixtures committed under `tests/fixtures/`.
- `npx jest tests/verify_planner_career.test.js` exercises every day in every fixture.
- Failures name the planner number, date, and missing title(s).
- No comparison of interpretation text or impact.
