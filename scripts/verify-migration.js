#!/usr/bin/env node
// Post-migration verification: every seed JSON entry and every
// event_templates row must round-trip — strict exact-key query of the
// seeded `interpretations` table returns the identical description.

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const { parseEventName } = require('../services/cosmos_event_parser');

const DB_DIR = path.join(__dirname, '..', 'db');
const SEEDS_DIR = path.join(DB_DIR, 'seeds');

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

function dirToAscendant(dirName) {
  if (dirName === '_global') return '*';
  return dirName.charAt(0).toUpperCase() + dirName.slice(1).toLowerCase();
}

let checked = 0;
const problems = [];

for (const dir of fs.readdirSync(SEEDS_DIR, { withFileTypes: true }).filter((d) => d.isDirectory())) {
  const ascendant = dirToAscendant(dir.name);
  for (const file of fs.readdirSync(path.join(SEEDS_DIR, dir.name)).filter((f) => f.endsWith('.json'))) {
    const lens = path.basename(file, '.json');
    const entries = JSON.parse(fs.readFileSync(path.join(SEEDS_DIR, dir.name, file), 'utf8'));
    for (const e of entries) {
      checked++;
      const key = {
        kind: e.kind,
        transit_planet: e.transit_planet,
        natal_planet: e.natal_planet,
        target_house: e.target_house,
        target_angle: e.target_angle,
        special_label: e.special_label,
        lord_house: e.lord_house,
        phase: e.phase || 'window',
      };
      const got = strictLookup(ascendant, lens, key);
      if (got !== e.description) {
        problems.push(`${dir.name}/${file} "${e.display_name}": seed description not in interpretations table`);
      }
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
  for (const p of problems.slice(0, 30)) console.error(`  ${p}`);
  if (problems.length > 30) console.error(`  … and ${problems.length - 30} more`);
  process.exit(1);
}
console.log(`VERIFIED: all ${checked} seed + template rows round-trip losslessly.`);
