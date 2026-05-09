// db/_generate_taurus_seeds.js
//
// Emits 4 empty per-ascendant seed files for a representative Taurus
// ascendant native, using the natal chart below.  After this writes
// the files, fill in each `description: ''` with chart-specific text,
// then run `node db/seed_<area>_taurus.js`.
//
// Run:
//   node db/_generate_taurus_seeds.js

const fs = require('fs');
const path = require('path');

const ASCENDANT = 'Taurus';

// Taurus ascendant — house signs (sidereal Lahiri natural alignment)
const HOUSE_SIGN = {
  1: 'Taurus',   2: 'Gemini',      3: 'Cancer',  4: 'Leo',
  5: 'Virgo',    6: 'Libra',       7: 'Scorpio', 8: 'Sagittarius',
  9: 'Capricorn', 10: 'Aquarius',  11: 'Pisces', 12: 'Aries',
};

// House lords for Taurus ascendant (sidereal, classical)
const HOUSE_LORD = {
  1: 'Venus', 2: 'Mercury', 3: 'Moon', 4: 'Sun', 5: 'Mercury',
  6: 'Venus', 7: 'Mars', 8: 'Jupiter', 9: 'Saturn',
  10: 'Saturn', 11: 'Jupiter', 12: 'Mars',
};

// Sign-lord (dispositor) lookup
const SIGN_LORD = {
  Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury',
  Cancer: 'Moon', Leo: 'Sun', Virgo: 'Mercury',
  Libra: 'Venus', Scorpio: 'Mars', Sagittarius: 'Jupiter',
  Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter',
};

// Representative Taurus ascendant native — natal chart
// Three Mahapurusha Yogas (Malavya Venus-1H own, Ruchaka Mars-7H own,
// Sasa Saturn-10H own — also yogakaraka). Mercury exalted+own in 5H =
// sharp creative intellect. Sun own Leo 4H (solar pride at home base).
// Moon own Cancer 3H (emotional courage). Jupiter own Pisces 11H
// (wisdom-driven gains, foreign teaching networks). Rahu Sagittarius 8H
// (foreign occult / transformation amplifier). Ketu Gemini 2H
// (detachment from voice / family-money).
const NATAL = {
  Sun:     { sign: 'Leo',         house: 4  },  // own sign
  Moon:    { sign: 'Cancer',      house: 3  },  // own sign
  Mercury: { sign: 'Virgo',       house: 5  },  // own + exalted
  Venus:   { sign: 'Taurus',      house: 1  },  // own — Malavya Yoga
  Mars:    { sign: 'Scorpio',     house: 7  },  // own — Ruchaka Yoga
  Jupiter: { sign: 'Pisces',      house: 11 },  // own
  Saturn:  { sign: 'Aquarius',    house: 10 },  // own — Sasa Yoga (yogakaraka)
  Rahu:    { sign: 'Sagittarius', house: 8  },
  Ketu:    { sign: 'Gemini',      house: 2  },
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
  `Taurus firable events: rulers=${sections.rulers.length}, ` +
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
  const header = `// db/seed_${area}_taurus.js
//
// Per-ascendant fill-in seed for the **${area}** category, scoped to a
// representative Taurus ascendant native with:
//   Ascendant: Taurus
//   Natal placements (sidereal Lahiri):
//     Sun=4th (Leo, own)  Moon=3rd (Cancer, own)  Mercury=5th (Virgo, own+exalted)
//     Venus=1st (Taurus, own — Malavya Yoga)  Mars=7th (Scorpio, own — Ruchaka Yoga)
//     Jupiter=11th (Pisces, own)  Saturn=10th (Aquarius, own — Sasa Yoga, yogakaraka)
//     Rahu=8th (Sagittarius)  Ketu=2nd (Gemini)
//
// All ${total} events below are the ones the kerykeion engine could emit for
// this user across any transitDate. Fill in the \`description\` strings as
// you compose ${area}-specific interpretations, then run:
//
//   node db/seed_${area}_taurus.js
//
// Empty descriptions are skipped — partial fills are safe to run repeatedly.

const db = require('./${area}');

const ASCENDANT = 'Taurus';

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
  const out = path.join(__dirname, `seed_${area}_taurus.js`);
  if (fs.existsSync(out)) {
    console.log(`SKIP existing: ${out}`);
    continue;
  }
  fs.writeFileSync(out, emitSeed(area));
  console.log(`Wrote ${out}`);
}
