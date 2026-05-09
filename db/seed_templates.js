// Seeds db/cosmos.db with 5,348 generic event-template descriptions.
//
// Voice: nurturing, caring, empathetic, encouraging. The descriptions
// never mention astrology mechanics (no planet names, no houses, no
// aspects, no transits as terms). They speak only to felt experience
// and gentle guidance — what a kind friend or therapist would say.
//
// The 5,348 events still cover the full structured key space the engine
// can fire: aspect 324 + angle 72 + outer 8 + transit_house 108 +
// ruler 144 + dispositor 108 = 764 per lens × 7 lenses.

const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'cosmos.db');

// ── Axes ──────────────────────────────────────────────────────────────
const PLANETS  = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Rahu','Ketu'];
const HOUSES   = [1,2,3,4,5,6,7,8,9,10,11,12];
const ANGLES   = ['ASC','MC'];
const PHASES   = ['window','starts','exact','ends'];
const SPECIALS = ['Pluto-Saturn','Uranus-Venus'];
const LENSES   = ['career','relationship','investment','advice','food','gain','loss'];

// ── Inner-experience library (no astrology jargon) ────────────────────
// Each "planet" maps to two phrases: `pull` describes the felt sensation
// in first-language ("a heat that wants to push and act"), `voice` names
// the inner part being called forward ("the part ready to fight").
const P = {
  Sun: {
    pull:  'a quiet need to be seen and honored for who you are',
    voice: 'the part of you that needs to claim its own space',
  },
  Moon: {
    pull:  'a soft, tender weather inside that wants gentle care',
    voice: 'the part of you that needs comfort and slow time',
  },
  Mercury: {
    pull:  'a restless mind with too many thoughts moving at once',
    voice: 'the part of you that wants to talk it through',
  },
  Venus: {
    pull:  'a longing for things to feel beautiful and easy',
    voice: 'the part of you that wants sweetness and connection',
  },
  Mars: {
    pull:  'a heat that wants to push, act, and protect what matters',
    voice: 'the part of you ready to fight for what you love',
  },
  Jupiter: {
    pull:  'a quiet widening that believes things can really open up',
    voice: 'the part of you that hopes and trusts',
  },
  Saturn: {
    pull:  'a heaviness asking you to slow down and be honest',
    voice: 'the part of you that takes things seriously',
  },
  Rahu: {
    pull:  'a craving that pulls hard toward what is new or unfamiliar',
    voice: 'the part of you that hungers for more than you have',
  },
  Ketu: {
    pull:  'a quiet release of something that no longer fits',
    voice: 'the part of you that is ready to let go',
  },
};

// House meanings as warm life-area phrases. `name` is short (used in
// rulers/dispositors), `feel` is fuller (used in transit-house copy).
const H = {
  1:  { name: 'who you are',                       feel: 'how you show up in the world and the body you live in' },
  2:  { name: 'what you hold and what you say',    feel: 'what you hold close, the means you have, and how you speak' },
  3:  { name: 'your daily moves and closest kin',  feel: 'the small daily moves you make and the people closest to you' },
  4:  { name: 'your home and inner ground',        feel: 'the home inside you and the home around you' },
  5:  { name: 'your creativity and play',          feel: 'what you make, who you love, and the play in your life' },
  6:  { name: 'your daily work and tending',       feel: 'the daily work and the small acts of tending and repair' },
  7:  { name: 'your closest agreements',           feel: 'the people who walk beside you and what you agree to together' },
  8:  { name: 'shared depths and quiet change',    feel: 'the deep things you share with others and the quiet changes underneath' },
  9:  { name: 'meaning and what you believe',      feel: 'what you believe and the larger sense of why you are here' },
  10: { name: 'what the world sees you do',        feel: 'what the world sees you doing and the role you carry' },
  11: { name: 'your circle and arriving good',     feel: 'your friends, your wider circle, and the rewards arriving slowly' },
  12: { name: 'endings and what is letting go',    feel: 'the things ending, the inner quiet, and what is gently letting go' },
};

// Lens framing — `domain` is a kind, plain-language phrase for the life
// area the description speaks to; `closing` is a one-line gentle send-off.
const L = {
  career: {
    domain:  'how you carry your work and the role it asks of you',
    closing: 'You are doing enough. Pace yourself.',
  },
  relationship: {
    domain:  'how you connect with the people you love',
    closing: 'Connection takes courage. Be soft with yourself when it is hard.',
  },
  investment: {
    domain:  'how you tend money and weigh what is worth the risk',
    closing: 'You do not have to decide it all today. Steady hands win.',
  },
  advice: {
    domain:  'the small choices in front of you today',
    closing: 'Trust what you already know. The next right step is enough.',
  },
  food: {
    domain:  'how you feed and listen to your body',
    closing: 'Your body is on your side. Listen to it kindly.',
  },
  gain: {
    domain:  'the small openings and good things arriving',
    closing: 'You are allowed to receive. Stay open without grasping.',
  },
  loss: {
    domain:  'what is asking to be protected right now',
    closing: 'Protection is love in action. You are wiser than you think.',
  },
};

// Phase tactics in nurturing voice — what to do *with* the wave.
const PH = {
  window: { tactic: 'There is no rush; this whole stretch holds the same gentle invitation.' },
  starts: { tactic: 'Something is just beginning to move — you do not have to act yet, only notice.' },
  exact:  { tactic: 'Today is when this lands most clearly — be tender with whatever comes up.' },
  ends:   { tactic: 'The wave is settling now; let what helped stay, and let what did not, leave.' },
};

const ORD = ['','1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th'];
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

// ── Description renderers — each kind has its own voice/syntax ────────

function descAspect(lens, tp, np, phase) {
  const T = P[tp], N = P[np], LE = L[lens], PHA = PH[phase];
  if (tp === np) {
    return `Right now, ${T.pull} is meeting itself in you — a quiet return, a chance to see what has changed since this last asked for your attention. In ${LE.domain}, this is a soft review, not a test. ${PHA.tactic} You do not have to fix anything today; you only have to notice what is true now. ${LE.closing}`;
  }
  return `Inside you, ${T.pull} is meeting ${N.pull}. In ${LE.domain}, two real parts of you are reaching for different things at the same time. ${PHA.tactic} You do not have to choose between them — both are real, and both deserve to be heard. ${LE.closing}`;
}

function descAngle(lens, tp, angle, phase) {
  const T = P[tp], LE = L[lens], PHA = PH[phase];
  const where = angle === 'ASC'
    ? 'how you show up in the world and the way others first see you'
    : 'what the world sees you doing and the role you stand in publicly';
  return `Right now, ${T.pull} is rising into ${where}. Others can sense the shift in ${LE.domain} a little before you can put it into words. ${PHA.tactic} You do not have to perform a feeling that is not ready yet — let it land in its own time. ${LE.closing}`;
}

function descOuter(lens, special, phase) {
  const LE = L[lens], PHA = PH[phase];
  if (special === 'Pluto-Saturn') {
    return `Something old in ${LE.domain} is quietly composting. What you once built to feel safe may not all need to come with you, and the part of you that knows this has been waiting to be heard. ${PHA.tactic} There is grief in this, and there is also room being made. You are not losing your foundation — you are finding the part that was truly load-bearing. ${LE.closing}`;
  }
  return `Something tender in ${LE.domain} is being asked to change without a clear script. What you valued can shift in unexpected ways right now, and the heart needs a little more patience with itself. ${PHA.tactic} There is nothing wrong with you for feeling unsteady. Hold loosely; do not lock in a choice you would only make from shock. ${LE.closing}`;
}

function descTransitHouse(lens, tp, house) {
  const T = P[tp], LE = L[lens], HO = H[house];
  return `${cap(T.pull)} is settling into ${HO.feel}. The mood there is changing slowly, the way a season turns — gently, without urgency, asking only that you notice. In ${LE.domain}, you may feel this layer arrive in the small things first. Move at the pace that feels honest, not the pace that looks productive. ${LE.closing}`;
}

function descRuler(lens, lordHouse, placedHouse) {
  const LE = L[lens], LH = H[lordHouse], PHh = H[placedHouse];
  if (lordHouse === placedHouse) {
    return `${cap(LH.name)} stays close to itself for you — what flows out of this part of your life tends to flow back into it. In ${LE.domain}, this can feel like a quiet self-sufficiency, a small private engine that runs on its own terms. Tend it gently; what is already whole does not need to be improved. Trust the rhythm you have built. ${LE.closing}`;
  }
  return `What lives in ${LH.name} is quietly shaping ${PHh.name} right now. Two real parts of your life are speaking to each other under the surface, even when nothing on top has changed. In ${LE.domain}, the pulse of ${LH.name} keeps surfacing where ${PHh.name} usually lives. You do not have to force the connection — only listen for the conversation between them. ${LE.closing}`;
}

function descDispositor(lens, planet, house) {
  const T = P[planet], LE = L[lens], HO = H[house];
  return `${cap(T.voice)} keeps gently surfacing in ${HO.name} for you across this season. It is one of the steady undercurrents of your life — there is no urgency about it, only a quiet asking that has been patient with you. In ${LE.domain}, let this voice in without making a project out of it. Some things only ask to be acknowledged. ${LE.closing}`;
}

// ── Display name (legacy-compatible label, derived) ───────────────────
function displayName(row) {
  const phaseSuffix = row.phase === 'window' ? '' :
    row.phase === 'starts' ? ' : Starts' :
    row.phase === 'exact'  ? ' : Exact'  : ' : Ends';
  switch (row.kind) {
    case 'aspect':        return `${row.transit_planet} aspect ${row.natal_planet}${phaseSuffix}`;
    case 'angle_aspect':  return `${row.transit_planet} Aspecting ${row.target_angle === 'ASC' ? 'Ascendant (ASC)' : 'Midheaven (MC)'}${phaseSuffix}`;
    case 'outer_special': return `${row.special_label.replace('-', ' conjunct ')}${phaseSuffix}`;
    case 'transit_house': return `${row.transit_planet} Transits the ${ORD[row.target_house]} House`;
    case 'ruler':         return `Lord of ${ORD[row.lord_house]} in ${ORD[row.target_house]} House`;
    case 'dispositor':    return `${row.natal_planet} in ${ORD[row.target_house]} (Dispositor)`;
  }
}

// ── Generator ─────────────────────────────────────────────────────────
function* generate() {
  for (const lens of LENSES) {
    // 324 — transit×natal aspects, phased
    for (const tp of PLANETS) for (const np of PLANETS) for (const ph of PHASES)
      yield { lens, kind: 'aspect', transit_planet: tp, natal_planet: np, phase: ph,
              description: descAspect(lens, tp, np, ph) };
    // 72 — angle aspects, phased
    for (const tp of PLANETS) for (const ang of ANGLES) for (const ph of PHASES)
      yield { lens, kind: 'angle_aspect', transit_planet: tp, target_angle: ang, phase: ph,
              description: descAngle(lens, tp, ang, ph) };
    // 8 — outer specials, phased
    for (const sp of SPECIALS) for (const ph of PHASES)
      yield { lens, kind: 'outer_special', special_label: sp, phase: ph,
              description: descOuter(lens, sp, ph) };
    // 108 — transit through house (no phase)
    for (const tp of PLANETS) for (const h of HOUSES)
      yield { lens, kind: 'transit_house', transit_planet: tp, target_house: h, phase: 'window',
              description: descTransitHouse(lens, tp, h) };
    // 144 — Nth-lord-in-Mth-house full Cartesian
    for (const lh of HOUSES) for (const ph_ of HOUSES)
      yield { lens, kind: 'ruler', lord_house: lh, target_house: ph_, phase: 'window',
              description: descRuler(lens, lh, ph_) };
    // 108 — dispositor (planet in house)
    for (const np of PLANETS) for (const h of HOUSES)
      yield { lens, kind: 'dispositor', natal_planet: np, target_house: h, phase: 'window',
              description: descDispositor(lens, np, h) };
  }
}

// ── DB setup ──────────────────────────────────────────────────────────
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS event_templates (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    lens            TEXT    NOT NULL,
    kind            TEXT    NOT NULL CHECK (kind IN
                    ('aspect','angle_aspect','outer_special',
                     'transit_house','ruler','dispositor')),
    transit_planet  TEXT    NOT NULL DEFAULT '',
    natal_planet    TEXT    NOT NULL DEFAULT '',
    target_house    INTEGER NOT NULL DEFAULT 0,
    target_angle    TEXT    NOT NULL DEFAULT '',
    special_label   TEXT    NOT NULL DEFAULT '',
    lord_house      INTEGER NOT NULL DEFAULT 0,
    phase           TEXT    NOT NULL DEFAULT 'window'
                    CHECK (phase IN ('window','starts','exact','ends')),
    display_name    TEXT    NOT NULL,
    description     TEXT    NOT NULL,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (lens, kind, transit_planet, natal_planet, target_house,
            target_angle, special_label, lord_house, phase)
  );
  CREATE INDEX IF NOT EXISTS idx_lookup
    ON event_templates(lens, kind, transit_planet, natal_planet, phase);
`);

const insert = db.prepare(`
  INSERT INTO event_templates
    (lens, kind, transit_planet, natal_planet, target_house,
     target_angle, special_label, lord_house, phase, display_name, description)
  VALUES (@lens, @kind, @transit_planet, @natal_planet, @target_house,
          @target_angle, @special_label, @lord_house, @phase, @display_name, @description)
  ON CONFLICT (lens, kind, transit_planet, natal_planet, target_house,
               target_angle, special_label, lord_house, phase)
  DO UPDATE SET description = excluded.description, display_name = excluded.display_name
`);

const tx = db.transaction(rows => {
  for (const row of rows) {
    insert.run({
      lens:           row.lens,
      kind:           row.kind,
      transit_planet: row.transit_planet ?? '',
      natal_planet:   row.natal_planet   ?? '',
      target_house:   row.target_house   ?? 0,
      target_angle:   row.target_angle   ?? '',
      special_label:  row.special_label  ?? '',
      lord_house:     row.lord_house     ?? 0,
      phase:          row.phase,
      display_name:   displayName(row),
      description:    row.description,
    });
  }
});

const allRows = [...generate()];
tx(allRows);

// ── Coverage & sanity report ──────────────────────────────────────────
const total = db.prepare('SELECT COUNT(*) AS c FROM event_templates').get().c;
const byLens = db.prepare(
  'SELECT lens, COUNT(*) AS c FROM event_templates GROUP BY lens ORDER BY lens'
).all();
const byKind = db.prepare(
  'SELECT lens, kind, COUNT(*) AS c FROM event_templates GROUP BY lens, kind ORDER BY lens, kind'
).all();
const len = db.prepare(
  'SELECT MIN(LENGTH(description)) mn, MAX(LENGTH(description)) mx, ROUND(AVG(LENGTH(description))) av FROM event_templates'
).get();

console.log(`\n[cosmos.db] processed ${allRows.length} rows; total in table: ${total} (expected 5348)`);
console.log('\nPer lens:');
for (const r of byLens) console.log(`  ${r.lens.padEnd(14)} ${String(r.c).padStart(4)}`);

const KIND_EXPECT = { aspect: 324, angle_aspect: 72, outer_special: 8,
                      transit_house: 108, ruler: 144, dispositor: 108 };
console.log('\nPer (lens, kind):');
for (const r of byKind) {
  const ok = r.c === KIND_EXPECT[r.kind] ? '✓' : '✗';
  console.log(`  ${r.lens.padEnd(14)} ${r.kind.padEnd(16)} ${String(r.c).padStart(4)}  ${ok}`);
}

console.log(`\nDescription length (chars): min=${len.mn}, max=${len.mx}, avg=${len.av}`);

// Astrology-jargon detector — should match nothing.
const JARGON = /\b(transit|aspect|conjunct|opposition|trine|square|sextile|sun|moon|mercury|venus|mars|jupiter|saturn|rahu|ketu|pluto|uranus|ascendant|midheaven|natal|house|ruler|dispositor|sign|chart|zodiac|nakshatra|dasha|yoga|graha)\b/i;
const jargonRows = db.prepare('SELECT id, description FROM event_templates').all()
  .filter(r => JARGON.test(r.description));
console.log(`\nRows containing astrology jargon: ${jargonRows.length} (should be 0)`);
if (jargonRows.length) {
  for (const r of jargonRows.slice(0, 3)) {
    console.log(`  id=${r.id}: ${r.description.slice(0, 120)}...`);
  }
}

// Sample one row per kind for visual check
console.log('\nSample descriptions (career lens, one per kind):');
for (const kind of Object.keys(KIND_EXPECT)) {
  const sample = db.prepare(
    `SELECT display_name, description, LENGTH(description) AS n
     FROM event_templates WHERE kind = ? AND lens='career' LIMIT 1`
  ).get(kind);
  if (sample) {
    console.log(`\n  [${kind}] ${sample.display_name}  (${sample.n} chars)`);
    console.log(`    ${sample.description}`);
  }
}
