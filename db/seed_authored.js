// Reads every db/_authored/<lens>.js file and overwrites the matching
// rows in db/cosmos.db with hand-authored descriptions. The composed-
// nurturing baseline (from db/seed_templates.js) provides full coverage;
// this seeder progressively replaces baseline rows with authored ones as
// they get written across multiple sessions.
//
// Key formats (must match what _authored/<lens>.js exports):
//   aspect:        "<transit>-<natal>-<phase>"
//   angle_aspect:  "<transit>-<ASC|MC>-<phase>"
//   outer_special: "<special>-<phase>"
//   transit_house: "<planet>-<house>"
//   ruler:         "<lordHouse>-<placedHouse>"
//   dispositor:    "<planet>-<house>"

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'cosmos.db');
const AUTHORED_DIR = path.join(__dirname, '_authored');

const KIND_KEY_PARSER = {
  aspect:        k => { const [t,n,p] = k.split('-'); return { transit_planet: t, natal_planet: n, phase: p }; },
  angle_aspect:  k => { const [t,a,p] = k.split('-'); return { transit_planet: t, target_angle: a, phase: p }; },
  outer_special: k => {
    // "Pluto-Saturn-window" → special_label='Pluto-Saturn', phase='window'
    const parts = k.split('-');
    const phase = parts.pop();
    return { special_label: parts.join('-'), phase };
  },
  transit_house: k => { const [t,h] = k.split('-'); return { transit_planet: t, target_house: parseInt(h, 10), phase: 'window' }; },
  ruler:         k => { const [lh,ph] = k.split('-'); return { lord_house: parseInt(lh, 10), target_house: parseInt(ph, 10), phase: 'window' }; },
  dispositor:    k => { const [p,h] = k.split('-'); return { natal_planet: p, target_house: parseInt(h, 10), phase: 'window' }; },
};

const db = new Database(DB_PATH);

const update = db.prepare(`
  UPDATE event_templates
  SET description = @description
  WHERE lens           = @lens
    AND kind           = @kind
    AND transit_planet = @transit_planet
    AND natal_planet   = @natal_planet
    AND target_house   = @target_house
    AND target_angle   = @target_angle
    AND special_label  = @special_label
    AND lord_house     = @lord_house
    AND phase          = @phase
`);

let totalUpdated  = 0;
let totalMissing  = 0;
let totalLenses   = 0;
const perLensKind = [];
const tooShort    = [];
const tooLong     = [];

const files = fs.readdirSync(AUTHORED_DIR).filter(f => f.endsWith('.js')).sort();
for (const file of files) {
  const lens = path.basename(file, '.js');
  const authored = require(path.join(AUTHORED_DIR, file));
  totalLenses++;

  for (const [kind, parser] of Object.entries(KIND_KEY_PARSER)) {
    const entries = authored[kind] || {};
    let updated = 0, missing = 0;

    const tx = db.transaction(() => {
      for (const [key, description] of Object.entries(entries)) {
        if (!description || !description.trim()) continue;

        const parsed = parser(key);
        const params = {
          lens,
          kind,
          transit_planet: parsed.transit_planet ?? '',
          natal_planet:   parsed.natal_planet   ?? '',
          target_house:   parsed.target_house   ?? 0,
          target_angle:   parsed.target_angle   ?? '',
          special_label:  parsed.special_label  ?? '',
          lord_house:     parsed.lord_house     ?? 0,
          phase:          parsed.phase          ?? 'window',
          description,
        };

        const result = update.run(params);
        if (result.changes === 1) {
          updated++;
          if (description.length < 200) tooShort.push({ lens, kind, key, n: description.length });
          if (description.length > 420) tooLong.push({ lens, kind, key, n: description.length });
        } else {
          missing++;
          console.warn(`  [${lens}/${kind}] no row matched key "${key}" — check the parser`);
        }
      }
    });
    tx();

    if (updated || missing) perLensKind.push({ lens, kind, updated, missing });
    totalUpdated += updated;
    totalMissing += missing;
  }
}

// ── Astrology-jargon defense ──────────────────────────────────────────
const JARGON = /\b(transit|aspect|conjunct|opposition|trine|square|sextile|sun|moon|mercury|venus|mars|jupiter|saturn|rahu|ketu|pluto|uranus|ascendant|midheaven|natal|house|ruler|dispositor|sign|chart|zodiac|nakshatra|dasha|yoga|graha)\b/i;
const jargonRows = db.prepare('SELECT id, lens, kind, display_name, description FROM event_templates').all()
  .filter(r => JARGON.test(r.description));

// ── Report ────────────────────────────────────────────────────────────
console.log(`\n[seed_authored] scanned ${totalLenses} lens file(s)`);
console.log(`updated: ${totalUpdated}   key-mismatches: ${totalMissing}\n`);

console.log('Per (lens, kind) updates:');
for (const r of perLensKind) {
  const tag = r.missing ? '✗' : '✓';
  console.log(`  ${r.lens.padEnd(14)} ${r.kind.padEnd(16)} updated=${String(r.updated).padStart(4)}  missing=${r.missing}  ${tag}`);
}

console.log(`\nLength outliers:`);
console.log(`  too short (<200 chars): ${tooShort.length}`);
console.log(`  too long (>420 chars):  ${tooLong.length}`);
for (const r of tooShort.slice(0, 5)) console.log(`    short  ${r.lens}/${r.kind}/${r.key} (${r.n} chars)`);
for (const r of tooLong.slice(0, 5))  console.log(`    long   ${r.lens}/${r.kind}/${r.key} (${r.n} chars)`);

console.log(`\nAstrology jargon found in DB rows: ${jargonRows.length} (should be 0)`);
for (const r of jargonRows.slice(0, 5)) {
  console.log(`  id=${r.id} ${r.lens}/${r.kind} "${r.display_name}"`);
  console.log(`    ${r.description.slice(0, 140)}...`);
}

// ── Coverage: how much of the 5,348 has been hand-authored ────────────
const totalHand = totalUpdated;
const totalRows = db.prepare('SELECT COUNT(*) AS c FROM event_templates').get().c;
const pct = ((totalHand / totalRows) * 100).toFixed(1);
console.log(`\nHand-authored coverage: ${totalHand} / ${totalRows} rows (${pct}%)`);
console.log(`Composed-nurturing baseline still serves the remaining ${totalRows - totalHand} rows.\n`);
