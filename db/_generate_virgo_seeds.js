// db/_generate_virgo_seeds.js
//
// Emits 4 empty per-ascendant seed files for a representative Virgo
// ascendant native, using the natal chart below.  After this writes
// the files, fill in each `description: ''` with chart-specific text,
// then run `node db/seed_<area>_virgo.js`.
//
// Run:
//   node db/_generate_virgo_seeds.js

const fs = require('fs');
const path = require('path');

const ASCENDANT = 'Virgo';

// Virgo ascendant — house signs (sidereal Lahiri natural alignment)
const HOUSE_SIGN = {
  1: 'Virgo',   2: 'Libra',       3: 'Scorpio',     4: 'Sagittarius',
  5: 'Capricorn', 6: 'Aquarius',  7: 'Pisces',      8: 'Aries',
  9: 'Taurus',  10: 'Gemini',     11: 'Cancer',     12: 'Leo',
};

// House lords for Virgo ascendant (sidereal, classical)
const HOUSE_LORD = {
  1: 'Mercury', 2: 'Venus', 3: 'Mars', 4: 'Jupiter', 5: 'Saturn',
  6: 'Saturn', 7: 'Jupiter', 8: 'Mars', 9: 'Venus',
  10: 'Mercury', 11: 'Moon', 12: 'Sun',
};

// Sign-lord (dispositor) lookup
const SIGN_LORD = {
  Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury',
  Cancer: 'Moon', Leo: 'Sun', Virgo: 'Mercury',
  Libra: 'Venus', Scorpio: 'Mars', Sagittarius: 'Jupiter',
  Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter',
};

// Representative Virgo ascendant native — natal chart
// Three Mahapurusha Yogas (Bhadra Mercury-1H own+exalted, Hamsa Jupiter-4H
// own, Malavya Venus-7H exalted). Saturn own Capricorn 5H = disciplined
// creative-intellect. Mars own Aries 8H = Vipareet 8L-in-8H surgical
// transformation. Sun own Leo 12H = behind-the-scenes kingly authority.
// Moon own Cancer 11H = emotional gains through wide networks. Rahu
// Scorpio 3H / Ketu Taurus 9H axis = communication-chaos vs. detached
// dharma.
const NATAL = {
  Sun:     { sign: 'Leo',         house: 12 },  // own sign
  Moon:    { sign: 'Cancer',      house: 11 },  // own sign
  Mercury: { sign: 'Virgo',       house: 1  },  // own + exalted — Bhadra Yoga
  Venus:   { sign: 'Pisces',      house: 7  },  // exalted — Malavya Yoga
  Mars:    { sign: 'Aries',       house: 8  },  // own — 8L-in-8H Vipareet
  Jupiter: { sign: 'Sagittarius', house: 4  },  // own — Hamsa Yoga
  Saturn:  { sign: 'Capricorn',   house: 5  },  // own
  Rahu:    { sign: 'Scorpio',     house: 3  },
  Ketu:    { sign: 'Taurus',      house: 9  },
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
  `Virgo firable events: rulers=${sections.rulers.length}, ` +
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
  const header = `// db/seed_${area}_virgo.js
//
// Per-ascendant fill-in seed for the **${area}** category, scoped to a
// representative Virgo ascendant native with:
//   Ascendant: Virgo
//   Natal placements (sidereal Lahiri):
//     Sun=12th (Leo, own)  Moon=11th (Cancer, own)
//     Mercury=1st (Virgo, own+exalted — Bhadra Yoga)
//     Venus=7th (Pisces, exalted — Malavya Yoga)
//     Mars=8th (Aries, own — 8L-in-8 Vipareet)
//     Jupiter=4th (Sagittarius, own — Hamsa Yoga)
//     Saturn=5th (Capricorn, own)
//     Rahu=3rd (Scorpio)  Ketu=9th (Taurus)
//
// All ${total} events below are the ones the kerykeion engine could emit for
// this user across any transitDate. Fill in the \`description\` strings as
// you compose ${area}-specific interpretations, then run:
//
//   node db/seed_${area}_virgo.js
//
// Empty descriptions are skipped — partial fills are safe to run repeatedly.

const db = require('./${area}');

const ASCENDANT = 'Virgo';

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
  const out = path.join(__dirname, `seed_${area}_virgo.js`);
  if (fs.existsSync(out)) {
    console.log(`SKIP existing: ${out}`);
    continue;
  }
  fs.writeFileSync(out, emitSeed(area));
  console.log(`Wrote ${out}`);
}
