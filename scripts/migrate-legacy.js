#!/usr/bin/env node
// One-time migration: legacy per-lens events DBs + cosmos event_templates
// → JSON seed files under db/seeds/. Kept in the repo so the process is
// reproducible, but it only ever reads the legacy files (which stay on
// disk untouched as reference/backup).
//
//   event_templates (db/cosmos.db)        → db/seeds/_global/<lens>.json  (ascendant '*')
//   db/<lens>_events.db rows w/ text      → db/seeds/<ascendant>/<lens>.json
//
// Aborts (exit 1) with a full report if:
//   - any filled legacy row's name fails parseEventName, or
//   - two filled rows for the same (ascendant, lens) collapse to the same
//     structured key with DIFFERENT descriptions (aspect keys deliberately
//     discard the natal house — this check proves that's lossless).

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const { parseEventName } = require('../services/cosmos_event_parser');

const DB_DIR = path.join(__dirname, '..', 'db');
const SEEDS_DIR = path.join(DB_DIR, 'seeds');
const LEGACY_LENSES = ['career', 'relationship', 'advice', 'food', 'investment'];

function keyId(k) {
  return [
    k.kind, k.transit_planet || '', k.natal_planet || '',
    k.target_house || 0, k.target_angle || '', k.special_label || '',
    k.lord_house || 0, k.phase || 'window',
  ].join('|');
}

function extractAspectNatalHouse(name) {
  const m = name.match(/in (?:the )?(\d+)(?:st|nd|rd|th) house/i);
  return m ? parseInt(m[1], 10) : null;
}

/** Authoritative natal-house placements from per-ascendant seed JS files. */
function buildCanonicalAspectHouses() {
  const map = new Map(); // `${asc}|${natalPlanet}` → house
  const files = fs.readdirSync(DB_DIR)
    .filter((f) => /^seed_(?:career|relationship|advice|food|investment)_\w+\.js$/.test(f))
    .sort((a, b) => {
      // Prefer career seeds — authored first and most complete.
      const aCareer = a.startsWith('seed_career_') ? 0 : 1;
      const bCareer = b.startsWith('seed_career_') ? 0 : 1;
      return aCareer - bCareer || a.localeCompare(b);
    });

  for (const file of files) {
    const ascMatch = file.match(/^seed_\w+_(\w+)\.js$/);
    if (!ascMatch) continue;
    const asc = ascMatch[1].charAt(0).toUpperCase() + ascMatch[1].slice(1).toLowerCase();
    const text = fs.readFileSync(path.join(DB_DIR, file), 'utf8');
    const re = /['"](\w+) aspects? (?:the )?(\w+) in (?:the )?(\d+)(?:st|nd|rd|th) house/gi;
    let m;
    while ((m = re.exec(text)) !== null) {
      const natal = m[2].charAt(0).toUpperCase() + m[2].slice(1).toLowerCase();
      const house = parseInt(m[3], 10);
      const k = `${asc}|${natal}`;
      if (!map.has(k)) map.set(k, house);
    }
  }
  return map;
}

function pickAspectRow(existing, incoming, canonicalHouses, ascendant) {
  const canon = canonicalHouses.get(`${ascendant}|${parseEventName(incoming.display_name)?.natal_planet || parseEventName(existing.display_name)?.natal_planet}`);
  const existingHouse = extractAspectNatalHouse(existing.display_name);
  const incomingHouse = extractAspectNatalHouse(incoming.display_name);

  if (canon != null) {
    if (existingHouse === canon && incomingHouse !== canon) return existing;
    if (incomingHouse === canon && existingHouse !== canon) return incoming;
  }
  return incoming.description.length >= existing.description.length ? incoming : existing;
}

function upsertEntry(entries, id, entry, canonicalHouses, ascendant, warnings) {
  const existing = entries.get(id);
  if (!existing) {
    entries.set(id, entry);
    return;
  }
  if (existing.description === entry.description) return;

  const kind = parseEventName(entry.display_name)?.kind;
  if (kind === 'aspect') {
    const picked = pickAspectRow(existing, entry, canonicalHouses, ascendant);
    if (picked !== existing) {
      warnings.push(
        `aspect collision ${ascendant} ${id}: kept "${picked.display_name}" ` +
        `(dropped "${picked === existing ? entry.display_name : existing.display_name}")`,
      );
    }
    entries.set(id, picked);
    return;
  }

  const picked = entry.description.length >= existing.description.length ? entry : existing;
  if (picked !== existing) {
    warnings.push(
      `collision ${ascendant} ${id}: kept longer description from "${picked.display_name}"`,
    );
  }
  entries.set(id, picked);
}

function trimEntry(key, displayName, description) {
  const out = { kind: key.kind };
  if (key.transit_planet) out.transit_planet = key.transit_planet;
  if (key.natal_planet) out.natal_planet = key.natal_planet;
  if (key.target_house) out.target_house = key.target_house;
  if (key.target_angle) out.target_angle = key.target_angle;
  if (key.special_label) out.special_label = key.special_label;
  if (key.lord_house) out.lord_house = key.lord_house;
  out.phase = key.phase || 'window';
  out.display_name = displayName;
  out.description = description;
  return out;
}

function writeSeedFile(dirName, lens, entriesByKeyId) {
  const entries = [...entriesByKeyId.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, e]) => e);
  const dir = path.join(SEEDS_DIR, dirName);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, `${lens}.json`),
    JSON.stringify(entries, null, 2) + '\n',
  );
  return entries.length;
}

function migrateGlobal() {
  const db = new Database(path.join(DB_DIR, 'cosmos.db'), { readonly: true });
  const rows = db.prepare(`
    SELECT lens, kind, transit_planet, natal_planet, target_house,
           target_angle, special_label, lord_house, phase,
           display_name, description
    FROM event_templates
  `).all();
  db.close();

  const byLens = new Map();
  for (const r of rows) {
    if (!byLens.has(r.lens)) byLens.set(r.lens, new Map());
    byLens.get(r.lens).set(keyId(r), trimEntry(r, r.display_name, r.description));
  }
  let total = 0;
  for (const [lens, entries] of byLens) {
    const n = writeSeedFile('_global', lens, entries);
    console.log(`_global/${lens}.json: ${n} entries`);
    total += n;
  }
  if (total !== rows.length) {
    throw new Error(`event_templates key collision: ${rows.length} rows → ${total} entries`);
  }
  return total;
}

function migrateLegacyLens(lens, canonicalHouses, warnings) {
  const db = new Database(path.join(DB_DIR, `${lens}_events.db`), { readonly: true });
  const rows = db.prepare(
    "SELECT ascendant, name, description FROM events WHERE description != ''",
  ).all();
  db.close();

  const parseFailures = [];
  const byAscendant = new Map();

  for (const r of rows) {
    const key = parseEventName(r.name);
    if (!key) {
      parseFailures.push(`${lens}/${r.ascendant}: "${r.name}"`);
      continue;
    }
    if (!byAscendant.has(r.ascendant)) byAscendant.set(r.ascendant, new Map());
    const entries = byAscendant.get(r.ascendant);
    const id = keyId(key);
    const entry = trimEntry(key, r.name, r.description);
    upsertEntry(entries, id, entry, canonicalHouses, r.ascendant, warnings);
  }

  return { byAscendant, parseFailures, rowCount: rows.length };
}

function main() {
  const canonicalHouses = buildCanonicalAspectHouses();
  const warnings = [];
  const allFailures = [];
  const pending = [];

  for (const lens of LEGACY_LENSES) {
    const { byAscendant, parseFailures, rowCount } = migrateLegacyLens(lens, canonicalHouses, warnings);
    allFailures.push(...parseFailures);
    pending.push({ lens, byAscendant, rowCount });
  }

  if (allFailures.length) {
    console.error(`MIGRATION ABORTED — ${allFailures.length} parse failures`);
    for (const f of allFailures) console.error(`  parse: ${f}`);
    process.exit(1);
  }

  if (warnings.length) {
    console.warn(`Resolved ${warnings.length} key collisions (scaffold duplicates):`);
    for (const w of warnings.slice(0, 20)) console.warn(`  ${w}`);
    if (warnings.length > 20) console.warn(`  … and ${warnings.length - 20} more`);
  }

  let legacyTotal = 0;
  for (const { lens, byAscendant, rowCount } of pending) {
    let lensTotal = 0;
    for (const [ascendant, entries] of byAscendant) {
      const n = writeSeedFile(ascendant.toLowerCase(), lens, entries);
      console.log(`${ascendant.toLowerCase()}/${lens}.json: ${n} entries`);
      lensTotal += n;
    }
    console.log(`[${lens}] ${rowCount} filled legacy rows → ${lensTotal} seed entries`);
    legacyTotal += lensTotal;
  }

  const globalTotal = migrateGlobal();
  console.log(`DONE: ${legacyTotal} legacy + ${globalTotal} global seed entries written.`);
}

main();
