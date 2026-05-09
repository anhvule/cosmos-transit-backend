// db/_generate_aries_seeds.js
//
// Emits 4 empty per-ascendant seed files for a representative Aries
// ascendant native, using the natal chart below.  After this writes
// the files, fill in each `description: ''` with chart-specific text,
// then run `node db/seed_<area>_aries.js`.
//
// Run:
//   node db/_generate_aries_seeds.js

const fs = require('fs');
const path = require('path');

const ASCENDANT = 'Aries';

// Aries ascendant — house signs (sidereal Lahiri natural alignment)
const HOUSE_SIGN = {
  1: 'Aries',  2: 'Taurus',     3: 'Gemini',  4: 'Cancer',
  5: 'Leo',    6: 'Virgo',      7: 'Libra',   8: 'Scorpio',
  9: 'Sagittarius',  10: 'Capricorn',  11: 'Aquarius', 12: 'Pisces',
};

// House lords for Aries ascendant (sidereal, classical)
const HOUSE_LORD = {
  1: 'Mars', 2: 'Venus', 3: 'Mercury', 4: 'Moon', 5: 'Sun',
  6: 'Mercury', 7: 'Venus', 8: 'Mars', 9: 'Jupiter',
  10: 'Saturn', 11: 'Saturn', 12: 'Jupiter',
};

// Sign-lord (dispositor) lookup
const SIGN_LORD = {
  Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury',
  Cancer: 'Moon', Leo: 'Sun', Virgo: 'Mercury',
  Libra: 'Venus', Scorpio: 'Mars', Sagittarius: 'Jupiter',
  Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter',
};

// Representative Aries ascendant native — natal chart
// Three Mahapurusha Yogas (Ruchaka Mars-1H own, Sasa Saturn-10H own, plus
// Malavya Venus is exalted 12H — not kendra, so technically not Mahapurusha,
// but exaltation grants strength). 6th lord Mercury exalted+own in 6th =
// Vipareet Raja Yoga. 9th lord Jupiter own in 9th = strong dharma. Sun-Rahu
// in 5th in own Leo = intense creative-ambition fusion. Ketu 11th = detached
// from gains. Moon own 4th = emotional grounding.
const NATAL = {
  Sun:     { sign: 'Leo',         house: 5  },  // own sign, with Rahu
  Moon:    { sign: 'Cancer',      house: 4  },  // own sign
  Mercury: { sign: 'Virgo',       house: 6  },  // own + exalted
  Venus:   { sign: 'Pisces',      house: 12 },  // exalted
  Mars:    { sign: 'Aries',       house: 1  },  // own — Ruchaka Yoga
  Jupiter: { sign: 'Sagittarius', house: 9  },  // own
  Saturn:  { sign: 'Capricorn',   house: 10 },  // own — Sasa Yoga
  Rahu:    { sign: 'Leo',         house: 5  },  // conjunct Sun
  Ketu:    { sign: 'Aquarius',    house: 11 },
};

const PLANETS = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Rahu','Ketu'];

function ord(n) {
  const s = ['th','st','nd','rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ---- Build firable event names ----------------------------------------------

function buildRulers() {
  const seen = new Set();
  const out = [];
  for (let h = 1; h <= 12; h++) {
    const lord = HOUSE_LORD[h];
    const lordHouse = NATAL[lord].house;
    const name = `${lord} ruler of the ${ord(h)} House in the ${ord(lordHouse)} House`;
    if (seen.has(name)) continue;
    seen.add(name);
    out.push({ name, description: '' });
  }
  return out;
}

function buildDispositors() {
  const seen = new Set();
  const out = [];
  for (const p of PLANETS) {
    const sign = NATAL[p].sign;
    const lord = SIGN_LORD[sign];
    if (!lord) continue;
    const lordHouse = NATAL[lord].house;
    const name = `${lord} in ${ord(lordHouse)} (Dispositor)`;
    if (seen.has(name)) continue;
    seen.add(name);
    out.push({ name, description: '' });
  }
  return out;
}

function buildTransits() {
  const out = [];
  for (const p of PLANETS) {
    for (let h = 1; h <= 12; h++) {
      out.push({ name: `${p} Transits the ${ord(h)} House`, description: '' });
    }
  }
  return out;
}

function buildAngleAspects() {
  const out = [];
  const PHASES = ['', ' : Starts', ' : Exact', ' : Ends'];
  for (const p of PLANETS) {
    for (const angle of ['Ascendant (ASC)', 'Midheaven (MC)']) {
      for (const ph of PHASES) {
        out.push({ name: `${p} Aspecting ${angle}${ph}`, description: '' });
      }
    }
  }
  return out;
}

function buildOuterSpecials() {
  const out = [];
  const PHASES = ['', ' : Starts', ' : Exact', ' : Ends'];
  const pairs = [['Pluto', 'Saturn'], ['Uranus', 'Venus']];
  for (const [a, b] of pairs) {
    for (const ph of PHASES) {
      out.push({ name: `${a} conjunct ${b}${ph}`, description: '' });
    }
  }
  return out;
}

function buildAspects() {
  const out = [];
  const PHASES = ['', ' : Starts', ' : Exact', ' : Ends'];
  for (const transitP of PLANETS) {
    for (const natalP of PLANETS) {
      const natalHouse = NATAL[natalP].house;
      for (const ph of PHASES) {
        out.push({
          name: `${transitP} aspect ${natalP} in ${ord(natalHouse)} house${ph}`,
          description: '',
        });
      }
    }
  }
  return out;
}

const sections = {
  rulers: buildRulers(),
  dispositors: buildDispositors(),
  transits: buildTransits(),
  angleAspects: buildAngleAspects(),
  outerSpecials: buildOuterSpecials(),
  aspects: buildAspects(),
};

const total =
  sections.rulers.length +
  sections.dispositors.length +
  sections.transits.length +
  sections.angleAspects.length +
  sections.outerSpecials.length +
  sections.aspects.length;

console.log(
  `Aries firable events: rulers=${sections.rulers.length}, ` +
  `dispositors=${sections.dispositors.length}, ` +
  `transits=${sections.transits.length}, ` +
  `angleAspects=${sections.angleAspects.length}, ` +
  `outerSpecials=${sections.outerSpecials.length}, ` +
  `aspects=${sections.aspects.length}, total=${total}`
);

function fmt(events) {
  return events.map(e => {
    const desc = e.description.replace(/'/g, "\\'");
    const safeName = e.name.replace(/'/g, "\\'");
    return `  { name: '${safeName}', description: '${desc}' },`;
  }).join('\n');
}

function emitSeed(area) {
  const header = `// db/seed_${area}_aries.js
//
// Per-ascendant fill-in seed for the **${area}** category, scoped to a
// representative Aries ascendant native with:
//   Ascendant: Aries
//   Natal placements (sidereal Lahiri):
//     Sun=5th (Leo, own)  Moon=4th (Cancer, own)  Mercury=6th (Virgo, own+exalted)
//     Venus=12th (Pisces, exalted)  Mars=1st (Aries, own — Ruchaka Yoga)
//     Jupiter=9th (Sagittarius, own)  Saturn=10th (Capricorn, own — Sasa Yoga)
//     Rahu=5th (Leo, conjunct Sun)  Ketu=11th (Aquarius)
//
// All ${total} events below are the ones the kerykeion engine could emit for
// this user across any transitDate. Fill in the \`description\` strings as
// you compose ${area}-specific interpretations, then run:
//
//   node db/seed_${area}_aries.js
//
// Empty descriptions are skipped — partial fills are safe to run repeatedly.

const db = require('./${area}');

const ASCENDANT = 'Aries';

const events = [
  // ────────────────────────────────────────────────────────────────────────
  // RULERS (${sections.rulers.length})
  // ────────────────────────────────────────────────────────────────────────
${fmt(sections.rulers)}

  // ────────────────────────────────────────────────────────────────────────
  // DISPOSITORS (${sections.dispositors.length})
  // ────────────────────────────────────────────────────────────────────────
${fmt(sections.dispositors)}

  // ────────────────────────────────────────────────────────────────────────
  // TRANSITS (${sections.transits.length})
  // ────────────────────────────────────────────────────────────────────────
${fmt(sections.transits)}

  // ────────────────────────────────────────────────────────────────────────
  // ANGLE ASPECTS (${sections.angleAspects.length})
  // ────────────────────────────────────────────────────────────────────────
${fmt(sections.angleAspects)}

  // ────────────────────────────────────────────────────────────────────────
  // OUTER SPECIALS (${sections.outerSpecials.length})
  // ────────────────────────────────────────────────────────────────────────
${fmt(sections.outerSpecials)}

  // ────────────────────────────────────────────────────────────────────────
  // ASPECTS (${sections.aspects.length})
  // ────────────────────────────────────────────────────────────────────────
${fmt(sections.aspects)}
];

const update = db.prepare(
  'UPDATE events SET description = ? WHERE ascendant = ? AND name = ?'
);

function run() {
  const tx = db.transaction(() => {
    let updated = 0, empty = 0, notFound = 0;
    for (const e of events) {
      if (!e.description) { empty++; continue; }
      const r = update.run(e.description, ASCENDANT, e.name);
      if (r.changes > 0) updated++;
      else notFound++;
    }
    return { updated, empty, notFound };
  });
  return tx();
}

if (require.main === module) {
  const { updated, empty, notFound } = run();
  console.log(
    \`[\${ASCENDANT} ${area}] \${updated} updated · \${empty} still empty · \` +
    \`\${notFound} not in DB\`,
  );
}

module.exports = { events, ASCENDANT };
`;
  return header;
}

const targets = ['career', 'relationship', 'food', 'advice', 'investment', 'gain', 'loss'];
for (const area of targets) {
  const out = path.join(__dirname, `seed_${area}_aries.js`);
  if (fs.existsSync(out)) {
    console.log(`SKIP existing: ${out}`);
    continue;
  }
  fs.writeFileSync(out, emitSeed(area));
  console.log(`Wrote ${out}`);
}
