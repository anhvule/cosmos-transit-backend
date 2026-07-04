// Per-ascendant scaffolding seeder.
//
// The Python kerykeion engine emits sign-agnostic event names (e.g. "Moon
// Transits the 8th House") whose interpretation depends on the native's
// ascendant. The original seed files were authored for an Aries-ascendant
// native; this script extends every events DB so each of the 12 ascendants
// has a row for every possible event name, with an empty description ready
// to be filled in.
//
// Idempotent: re-running inserts only the rows that don't already exist
// (composite UNIQUE on (ascendant, name)). Existing populated rows are
// never overwritten — only empty placeholders are added.
//
// Run with: npm run seed:all
//
// Event templates mirror the strings emitted in services/astrology_kerykeion.py.

const path = require('path');

const DBS = [
  { label: 'advice',   module: './advice' },
  { label: 'career',   module: './career' },
  { label: 'investment', module: './investment' },
  { label: 'relationship', module: './relationship' },
  { label: 'food',     module: './food' },
];

const PLANETS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Rahu', 'Ketu'];
const HOUSES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const PHASES = ['', ' : Starts', ' : Exact', ' : Ends'];
const ASCENDANTS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

// Sign rulers — classical (7-planet) scheme used by the kerykeion bridge.
// Mars rules Aries & Scorpio; Venus rules Taurus & Libra; Mercury rules
// Gemini & Virgo; the luminaries each rule one sign; Jupiter rules
// Sagittarius & Pisces; Saturn rules Capricorn & Aquarius.
const SIGN_RULERS = {
  Aries: 'Mars',
  Taurus: 'Venus',
  Gemini: 'Mercury',
  Cancer: 'Moon',
  Leo: 'Sun',
  Virgo: 'Mercury',
  Libra: 'Venus',
  Scorpio: 'Mars',
  Sagittarius: 'Jupiter',
  Capricorn: 'Saturn',
  Aquarius: 'Saturn',
  Pisces: 'Jupiter',
};

function ordinal(n) {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

// For ascendant X (0=Aries..11=Pisces), the sign occupying house N (1..12)
// is ((X + N - 1) mod 12). E.g., Aries asc → house 1 = Aries, house 8 = Scorpio.
function houseSign(ascendant, house) {
  const ascIdx = ASCENDANTS.indexOf(ascendant);
  return ASCENDANTS[(ascIdx + house - 1) % 12];
}

// Generate every event name the engine could emit for the given ascendant.
// Ascendant only changes the planet identity in ruler events — all other
// templates produce the same name for every ascendant, but their meaning
// (and so their description) differs by ascendant.
function generateEventNames(ascendant) {
  const names = new Set();

  // 1. Planet transits through houses (no phase qualifier).
  //    e.g. "Moon Transits the 8th House"
  for (const planet of PLANETS) {
    for (const h of HOUSES) {
      names.add(`${planet} Transits the ${ordinal(h)} House`);
    }
  }

  // 2. Transit-to-natal aspects, by natal house, with phase qualifier.
  //    Engine emits the generic "aspect" label (use_specific_aspect_name=False).
  //    e.g. "Moon aspect Venus in 8th house : Exact"
  for (const tp of PLANETS) {
    for (const np of PLANETS) {
      for (const h of HOUSES) {
        for (const phase of PHASES) {
          names.add(`${tp} aspect ${np} in ${ordinal(h)} house${phase}`);
        }
      }
    }
  }

  // 3. House rulers — for this ascendant, each house has a fixed ruling
  //    planet; that planet can be in any of the 12 houses.
  //    e.g. for Aries asc: "Mars ruler of the 1st House in the 8th House"
  for (let sourceHouse = 1; sourceHouse <= 12; sourceHouse++) {
    const sign = houseSign(ascendant, sourceHouse);
    const planet = SIGN_RULERS[sign];
    for (let destHouse = 1; destHouse <= 12; destHouse++) {
      names.add(
        `${planet} ruler of the ${ordinal(sourceHouse)} House ` +
        `in the ${ordinal(destHouse)} House`,
      );
    }
  }

  // 4. ASC aspects — every transit planet, every phase.
  //    e.g. "Venus Aspecting Ascendant (ASC) : Exact"
  for (const planet of PLANETS) {
    for (const phase of PHASES) {
      names.add(`${planet} Aspecting Ascendant (ASC)${phase}`);
    }
  }

  // 5. MC aspects — every transit planet, every phase.
  for (const planet of PLANETS) {
    for (const phase of PHASES) {
      names.add(`${planet} Aspecting Midheaven (MC)${phase}`);
    }
  }

  // 6. Outer-planet specials — engine hardcodes only these two pairs.
  for (const phase of PHASES) {
    names.add(`Uranus conjunct Venus${phase}`);
    names.add(`Pluto conjunct Saturn${phase}`);
  }

  // 7. Dispositors — sign lord of the aspected natal planet's sign.
  //    e.g. "Sun in 9th (Dispositor)"
  for (const planet of PLANETS) {
    for (const h of HOUSES) {
      names.add(`${planet} in ${ordinal(h)} (Dispositor)`);
    }
  }

  return names;
}

function seedDb(label, db) {
  const insert = db.prepare(
    'INSERT OR IGNORE INTO events (ascendant, name, description) VALUES (?, ?, ?)',
  );
  const tx = db.transaction(() => {
    let inserted = 0;
    for (const ascendant of ASCENDANTS) {
      const names = generateEventNames(ascendant);
      for (const name of names) {
        const r = insert.run(ascendant, name, '');
        if (r.changes > 0) inserted++;
      }
    }
    return inserted;
  });
  const inserted = tx();
  const total = db.prepare('SELECT COUNT(*) AS c FROM events').get().c;
  console.log(
    `[${label}] +${inserted} new rows  (table now ${total} rows across ${ASCENDANTS.length} ascendants)`,
  );
}

function main() {
  for (const { label, module } of DBS) {
    const db = require(module);
    seedDb(label, db);
  }
  console.log('Per-ascendant scaffolding complete.');
}

if (require.main === module) {
  main();
}

module.exports = { generateEventNames, ASCENDANTS, PLANETS, HOUSES, PHASES, SIGN_RULERS };
