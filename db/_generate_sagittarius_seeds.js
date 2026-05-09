// db/_generate_sagittarius_seeds.js
//
// Emits 4 empty per-ascendant seed files for a representative Sagittarius
// ascendant native, using the natal chart below.  After this writes the
// files, fill in each `description: ''` with chart-specific text, then run
// `node db/seed_<area>_sagittarius.js`.
//
// Run:
//   node db/_generate_sagittarius_seeds.js

const fs = require('fs');
const path = require('path');

const ASCENDANT = 'Sagittarius';

const HOUSE_SIGN = {
  1: 'Sagittarius', 2: 'Capricorn', 3: 'Aquarius', 4: 'Pisces',
  5: 'Aries',       6: 'Taurus',    7: 'Gemini',   8: 'Cancer',
  9: 'Leo',        10: 'Virgo',    11: 'Libra',   12: 'Scorpio',
};

// House lords for Sagittarius ascendant (sidereal, classical)
const HOUSE_LORD = {
  1: 'Jupiter', 2: 'Saturn', 3: 'Saturn', 4: 'Jupiter', 5: 'Mars',
  6: 'Venus',   7: 'Mercury', 8: 'Moon',   9: 'Sun',    10: 'Mercury',
  11: 'Venus',  12: 'Mars',
};

const SIGN_LORD = {
  Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury',
  Cancer: 'Moon', Leo: 'Sun', Virgo: 'Mercury',
  Libra: 'Venus', Scorpio: 'Mars', Sagittarius: 'Jupiter',
  Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter',
};

// Representative Sagittarius ascendant native — natal chart
// Choices favor an archetypal Sagittarius: Jupiter own-sign in lagna
// (Hamsa Mahapurusha Yoga), Sun own-sign 9th (9L in 9H, the supreme
// dharma engine), Mercury own+exalted 10th (Bhadra + yogakaraka 7L+10L),
// Mars own-sign 5th (5L in 5H), Venus own-sign 11th (11L in 11H gains),
// Saturn own-sign 2nd (2L+3L in 2H dhana yoga), Moon own-sign 8th
// (8L in own house — Vipareet-style protection of longevity),
// Rahu in 6th (mastery of enemies/lawsuits), Ketu in 12th (moksha).
const NATAL = {
  Sun:     { sign: 'Leo',         house: 9  },  // own sign
  Moon:    { sign: 'Cancer',      house: 8  },  // own sign
  Mercury: { sign: 'Virgo',       house: 10 },  // own + exalted (Bhadra + yogakaraka)
  Venus:   { sign: 'Libra',       house: 11 },  // own sign
  Mars:    { sign: 'Aries',       house: 5  },  // own sign
  Jupiter: { sign: 'Sagittarius', house: 1  },  // own sign — Hamsa Yoga
  Saturn:  { sign: 'Capricorn',   house: 2  },  // own sign
  Rahu:    { sign: 'Taurus',      house: 6  },
  Ketu:    { sign: 'Scorpio',     house: 12 },
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
  `Sagittarius firable events: rulers=${sections.rulers.length}, ` +
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
  const header = `// db/seed_${area}_sagittarius.js
//
// Per-ascendant fill-in seed for the **${area}** category, scoped to a
// representative Sagittarius ascendant native with:
//   Ascendant: Sagittarius
//   Natal placements (sidereal Lahiri):
//     Sun=9th (Leo, own)  Moon=8th (Cancer, own)
//     Mercury=10th (Virgo, own+exalted — Bhadra + yogakaraka)
//     Venus=11th (Libra, own)  Mars=5th (Aries, own)
//     Jupiter=1st (Sagittarius, own — Hamsa Mahapurusha Yoga)
//     Saturn=2nd (Capricorn, own)
//     Rahu=6th (Taurus)  Ketu=12th (Scorpio)
//
// All ${total} events below are the ones the kerykeion engine could emit for
// this user across any transitDate. Fill in the \`description\` strings as
// you compose ${area}-specific interpretations, then run:
//
//   node db/seed_${area}_sagittarius.js
//
// Empty descriptions are skipped — partial fills are safe to run repeatedly.

const db = require('./${area}');

const ASCENDANT = 'Sagittarius';

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
  const out = path.join(__dirname, `seed_${area}_sagittarius.js`);
  if (fs.existsSync(out)) {
    console.log(`SKIP existing: ${out}`);
    continue;
  }
  fs.writeFileSync(out, emitSeed(area));
  console.log(`Wrote ${out}`);
}
