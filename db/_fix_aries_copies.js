// db/_fix_aries_copies.js
//
// The Aries variants of the global seed files were created by literal copy
// of seed_<lens>.js into seed_<lens>_aries.js. Those copies use SQL clauses
// that don't filter by ascendant (`ON CONFLICT(name)` or `INSERT OR IGNORE`),
// which fails or no-ops against the per-ascendant schema (UNIQUE(ascendant,
// name)). This script rewrites the trailing SQL block to update only the
// Aries rows.

const fs = require('fs');
const path = require('path');

const FILES = [
  'seed_advice_aries.js',
  'seed_career_aries.js',
  'seed_investment_aries.js',
  'seed_food_aries.js',
  'seed_gain_aries.js',
  'seed_loss_aries.js',
  'seed_relationship_aries.js',
];

const NEW_TAIL = `
const update = db.prepare(
  'UPDATE events SET description = ? WHERE ascendant = ? AND name = ?'
);

const ASCENDANT = 'Aries';

const seedAll = db.transaction(() => {
  let updated = 0;
  let notFound = 0;
  for (const event of events) {
    if (!event.description) continue;
    const r = update.run(event.description, ASCENDANT, event.name);
    if (r.changes > 0) updated++;
    else notFound++;
  }
  return { updated, notFound };
});

const { updated, notFound } = seedAll();
console.log(\`[\${ASCENDANT}] \${updated} updated · \${notFound} not in DB.\`);
`;

for (const f of FILES) {
  const p = path.join(__dirname, f);
  let s = fs.readFileSync(p, 'utf8');
  // Strip everything from the line before `const insert = db.prepare(...)`
  // through end of file, replace with NEW_TAIL.
  const idx = s.search(/^const insert = db\.prepare/m);
  if (idx < 0) {
    console.log(`SKIP ${f}: insert prepare not found`);
    continue;
  }
  s = s.slice(0, idx).replace(/\s+$/, '') + '\n' + NEW_TAIL;
  fs.writeFileSync(p, s);
  console.log(`Patched ${f}`);
}
