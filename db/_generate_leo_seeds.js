// db/_generate_leo_seeds.js
//
// Emits 4 empty per-ascendant seed files for a representative Leo
// ascendant native, using the natal chart below.  After this writes
// the files, fill in each `description: ''` with chart-specific text,
// then run `node db/seed_<area>_leo.js`.
//
// Run:
//   node db/_generate_leo_seeds.js

const fs = require('fs');
const path = require('path');

const ASCENDANT = 'Leo';

const HOUSE_SIGN = {
  1: 'Leo',     2: 'Virgo',     3: 'Libra',    4: 'Scorpio',
  5: 'Sagittarius', 6: 'Capricorn', 7: 'Aquarius', 8: 'Pisces',
  9: 'Aries',   10: 'Taurus',   11: 'Gemini',   12: 'Cancer',
};

// House lords for Leo ascendant (sidereal, classical)
const HOUSE_LORD = {
  1: 'Sun', 2: 'Mercury', 3: 'Venus', 4: 'Mars', 5: 'Jupiter',
  6: 'Saturn', 7: 'Saturn', 8: 'Jupiter', 9: 'Mars',
  10: 'Venus', 11: 'Mercury', 12: 'Moon',
};

const SIGN_LORD = {
  Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury',
  Cancer: 'Moon', Leo: 'Sun', Virgo: 'Mercury',
  Libra: 'Venus', Scorpio: 'Mars', Sagittarius: 'Jupiter',
  Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter',
};

// Representative Leo ascendant native — natal chart
// Choices favor a strong, archetypal Leo: Sun own-sign in lagna,
// Mars own-sign in 9th (yogakaraka), Jupiter own-sign in 5th,
// Venus own-sign in 10th, Mercury own-sign in 2nd, Saturn exalted
// in 3rd, Moon in 11th.
const NATAL = {
  Sun:     { sign: 'Leo',         house: 1  },  // own sign
  Moon:    { sign: 'Gemini',      house: 11 },
  Mercury: { sign: 'Virgo',       house: 2  },  // own sign
  Venus:   { sign: 'Taurus',      house: 10 },  // own sign
  Mars:    { sign: 'Aries',       house: 9  },  // own sign + yogakaraka
  Jupiter: { sign: 'Sagittarius', house: 5  },  // own sign
  Saturn:  { sign: 'Libra',       house: 3  },  // exalted
  Rahu:    { sign: 'Capricorn',   house: 6  },
  Ketu:    { sign: 'Cancer',      house: 12 },
};

const PLANETS = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Rahu','Ketu'];

function ord(n) {
  const s = ['th','st','nd','rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

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
  `Leo firable events: rulers=${sections.rulers.length}, ` +
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
  const header = `// db/seed_${area}_leo.js
//
// Per-ascendant fill-in seed for the **${area}** category, scoped to a
// representative Leo ascendant native with:
//   Ascendant: Leo
//   Natal placements (sidereal Lahiri):
//     Sun=1st (Leo, own)  Moon=11th (Gemini)  Mercury=2nd (Virgo, own)
//     Venus=10th (Taurus, own)  Mars=9th (Aries, own + yogakaraka)
//     Jupiter=5th (Sagittarius, own)  Saturn=3rd (Libra, exalted)
//     Rahu=6th (Capricorn)  Ketu=12th (Cancer)
//
// All ${total} events below are the ones the kerykeion engine could emit for
// this user across any transitDate. Fill in the \`description\` strings as
// you compose ${area}-specific interpretations, then run:
//
//   node db/seed_${area}_leo.js
//
// Empty descriptions are skipped — partial fills are safe to run repeatedly.

const db = require('./${area}');

const ASCENDANT = 'Leo';

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

const targets = ['career', 'relationship', 'food', 'advice'];
for (const area of targets) {
  const out = path.join(__dirname, `seed_${area}_leo.js`);
  if (fs.existsSync(out)) {
    console.log(`SKIP existing: ${out}`);
    continue;
  }
  fs.writeFileSync(out, emitSeed(area));
  console.log(`Wrote ${out}`);
}
