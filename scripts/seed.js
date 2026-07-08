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
