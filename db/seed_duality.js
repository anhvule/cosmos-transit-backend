/**
 * Seed every possible Essence × Personal-Year duality.
 *
 * Source of truth: db/duality-list.json (108 hand-written entries — index 1
 * to 108, covering 9 essence numbers (1-9) × 12 personal-year numbers
 * (1-9, 11, 22, 33)).
 *
 * Each row carries:
 *   - essence_number          1-9
 *   - personal_year           1-9, 11, 22, 33
 *   - duality_number          (essence + reduced PY) reduced to a single digit
 *   - keyword                 short label, e.g. "Essence 6 / Personal Year 22"
 *   - duality_explaination    long-form description (note the user's spelling
 *                             of "explaination" is preserved per request);
 *                             pulled from JSON's `description` field.
 *
 * The script is idempotent — re-running upserts (INSERT ... ON CONFLICT DO
 * UPDATE) so JSON edits propagate without manual cleanup.
 *
 * Run with:
 *   node db/seed_duality.js
 */

const path = require('path');
const db = require('./duality');

const JSON_PATH = path.join(__dirname, 'duality-list.json');
const entries = require(JSON_PATH);

// ── Validate input shape ───────────────────────────────────────────────────
if (!Array.isArray(entries)) {
  throw new Error(`${JSON_PATH} must contain a JSON array`);
}

const seen = new Map();
for (const e of entries) {
  for (const k of ['essence_number', 'personal_year', 'duality_number']) {
    if (typeof e[k] !== 'number') {
      throw new Error(`Entry ${JSON.stringify(e)} missing numeric ${k}`);
    }
  }
  if (typeof e.keyword !== 'string' || !e.keyword) {
    throw new Error(`Entry index ${e.index} missing keyword`);
  }
  if (typeof e.description !== 'string' || !e.description) {
    throw new Error(`Entry index ${e.index} missing description`);
  }
  const k = `${e.essence_number}/${e.personal_year}`;
  if (seen.has(k)) {
    throw new Error(`Duplicate (essence,personal_year)=${k} at indexes ${seen.get(k)} & ${e.index}`);
  }
  seen.set(k, e.index);
}

// ── Upsert (insert or replace description on existing row) ─────────────────
const upsert = db.prepare(`
  INSERT INTO dualities
    (essence_number, personal_year, duality_number, keyword, duality_explaination)
  VALUES (?, ?, ?, ?, ?)
  ON CONFLICT(essence_number, personal_year) DO UPDATE SET
    duality_number       = excluded.duality_number,
    keyword              = excluded.keyword,
    duality_explaination = excluded.duality_explaination
`);

const seedAll = db.transaction(() => {
  let inserted = 0;
  let updated = 0;
  for (const e of entries) {
    const before = db
      .prepare('SELECT id FROM dualities WHERE essence_number = ? AND personal_year = ?')
      .get(e.essence_number, e.personal_year);
    upsert.run(
      e.essence_number,
      e.personal_year,
      e.duality_number,
      e.keyword,
      e.description,
    );
    if (before) updated++;
    else inserted++;
  }
  return { inserted, updated };
});

const { inserted, updated } = seedAll();
console.log(
  `Duality seeding complete: ${inserted} inserted, ${updated} updated ` +
  `(total candidates: ${entries.length}).`,
);
