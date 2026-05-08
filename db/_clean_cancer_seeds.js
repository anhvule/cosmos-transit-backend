// db/_clean_cancer_seeds.js
//
// Strips astrology-jargon preambles from Cancer seed descriptions and
// rewrites the four seed files in place. After running, re-run each seed
// script to push cleaned text to the DB.
//
// Strategy: line-by-line regex pass on the existing seed files. For every
// line matching `  { name: '...', description: '...' },` we extract the
// description, run cleanDescription(), and write the line back.
//
// Patterns stripped:
//   - "<jargon> — <guidance>" (em-dash preamble where the prefix has astro markers)
//   - "Your Lagna lord X..." / "Your Nth lord X..." opening sentences
//   - "Your natal X disposes Y" / "Your natal X is self-disposing"
//   - "Your dispositor X (...) means today: ..."
//   - "X transit through Y..." opening sentences
//   - "Solar attention on..." / "Lunar attunement on..." etc opening clauses
//   - "X on Cancer Lagna/ascendant/persona/body" opening
//   - "X-Y window opens/closes/fades." pure labels
//   - "Peak X-Y day [on Z]." pure labels
//
// Run:  node db/_clean_cancer_seeds.js

const fs = require('fs');
const path = require('path');

const ASTRO_MARKERS = /\b(?:Lagna|lord|natal|sign|house|disposes?|exalted|debilitated|cluster|persona|ascendant|transit|aspect|conjunct|return|yogakaraka|Vipareet|Hamsa|Sade Sati|own sign|digbala|ruler|dispositor|node|3H|7H|8H|2H|4H|5H|6H|9H|10H|11H|12H|1H|MC|ASC|Sun|Moon|Mercury|Venus|Mars|Jupiter|Saturn|Rahu|Ketu)\b/i;

function cleanDescription(desc) {
  let s = desc;

  // Repeatedly apply strip patterns until stable (handles chained preambles)
  for (let i = 0; i < 3; i++) {
    const before = s;

    // 1. Em-dash preamble: "<short jargon clause> — <rest>"
    //    Only strip if:
    //      - prefix has astro markers
    //      - prefix is short (single clause, not multi-sentence)
    //      - prefix contains NO period (so we don't eat the first real sentence
    //        when the em-dash actually separates a later thought)
    const dashMatch = s.match(/^([^—.]{1,200}?)\s*—\s+(.+)$/s);
    if (dashMatch && ASTRO_MARKERS.test(dashMatch[1])) {
      s = dashMatch[2];
    }

    // 2. "Your Lagna lord X in/sits in ... <verb_phrase>. <rest>"
    s = s.replace(
      /^Your\s+(?:Lagna|\d+(?:st|nd|rd|th))\s+lord\s+[A-Z][a-z]+\s+(?:in\s+(?:own[- ]sign\s+)?\d*H?\s*[A-Z][a-z]+|sits in\s+the\s+\d+(?:st|nd|rd|th)\s+in\s+(?:his\s+)?(?:own\s+sign\s+)?[A-Z][a-z]+)\s+(?:means today:|wires|routes|channels|makes|is)\s+[^.]+\.\s+/i,
      ''
    );

    // 2b. Simpler ruler form: "Your Xth lord Y ... <verb>" up to first period
    s = s.replace(
      /^Your\s+(?:Lagna|\d+(?:st|nd|rd|th))\s+lord\s+[A-Z][a-z]+\s+(?:in|sits)[^.]{0,250}\.\s+/i,
      ''
    );

    // 3. "Your natal X in NH (...) disposes Y" full sentence
    s = s.replace(
      /^Your\s+natal\s+[A-Z][a-z]+\s+in\s+(?:the\s+|own[- ]sign\s+)?[^.]*?disposes?\s+[^.]+\.\s+/i,
      ''
    );

    // 4. "Your natal X in (...) is self-disposing" — keep some content
    s = s.replace(
      /^Your\s+natal\s+[A-Z][a-z]+\s+in\s+[^.]*?is self-disposing[^.]*\.\s+/i,
      ''
    );

    // 5. "Your dispositor X (...) means today: " (advice file pattern)
    s = s.replace(
      /^Your\s+dispositor\s+[A-Z][a-z]+\s+\([^)]+\)\s+means today:\s+/i,
      ''
    );

    // 6. "X transit through Y..." full opening sentence
    s = s.replace(
      /^[A-Z][a-z]+\s+transit\s+through\s+[^.]+\.\s+/i,
      ''
    );

    // 7. Opening clauses without em-dash: "Solar attention on...", "Lunar attunement on..."
    s = s.replace(
      /^(?:Solar|Lunar)\s+(?:attention|attunement|fire|charge)\s+on\s+(?:your\s+)?[^.]+\.\s+/i,
      ''
    );

    // 8. "Mercury sharpens/Venus warms/Mars on Cancer ..." opening
    s = s.replace(
      /^(?:Mercury|Venus|Mars|Jupiter|Saturn|Rahu|Ketu|Sun|Moon)\s+(?:sharpens|warms|on|fire on|charge on|attunement on)\s+(?:your\s+)?(?:Cancer|the)\s+(?:Lagna|ascendant|persona|body)[^.]*\.\s+/i,
      ''
    );

    // 9. "Exalted Jupiter on Cancer Lagna" opening
    s = s.replace(
      /^Exalted\s+Jupiter\s+on\s+(?:your\s+)?Cancer\s+(?:Lagna|ascendant|persona|body)[^.]*\.\s+/i,
      ''
    );

    // 10. Phase-variant labels: "X-Y window opens/closes/fades/begins."
    s = s.replace(
      /^(?:The\s+)?[\w][\w/-]*(?:\s+[\w/-]+){0,5}\s+window\s+(?:opens|closes|fades|begins)(?:\s+on\s+(?:your\s+)?[\w/-]+(?:\s+[\w/-]+){0,4})?\.\s+/i,
      ''
    );

    // 11. "Peak X-Y day [on/in Z]." pure label
    s = s.replace(
      /^Peak\s+[A-Z][a-z]+(?:[- ][A-Z][a-z]+)+(?:\s+(?:on|in|at)\s+(?:your\s+)?[\w/-]+(?:\s+[\w/-]+){0,3})?\s+day\.\s+/i,
      ''
    );
    s = s.replace(
      /^Peak\s+[\w-]+\s+day\s+(?:on|in|at)\s+(?:your\s+)?[\w/-]+(?:\s+[\w/-]+){0,3}\.\s+/i,
      ''
    );

    // 12. "Mercury return window opens." / "Saturn return..." labels
    s = s.replace(
      /^(?:Mercury|Sun|Moon|Venus|Mars|Jupiter|Saturn|Rahu|Ketu)\s+return\s+(?:window\s+)?(?:opens|closes|on\s+\w+)[^.]*\.\s+/i,
      ''
    );

    if (s === before) break;
  }

  // Capitalize first letter
  s = s.trim();
  if (s.length > 0) {
    s = s[0].toUpperCase() + s.slice(1);
  }

  return s;
}

// Match a single-line event entry. Description is single-quoted with \' escapes.
const lineRegex = /^(\s*\{\s*name:\s*'(?:\\.|[^'\\])*',\s*description:\s*')((?:\\.|[^'\\])*)(',?\s*\},?)\s*$/;

const lenses = ['career', 'relationship', 'food', 'advice'];
const stats = {};

for (const lens of lenses) {
  const filePath = path.join(__dirname, `seed_${lens}_cancer.js`);
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  let cleanedCount = 0;
  let emptyAfter = [];
  let unchangedCount = 0;

  const newLines = lines.map((line, idx) => {
    const m = line.match(lineRegex);
    if (!m) return line;

    const escapedDesc = m[2];
    // Unescape: \' → ', \\ → \
    const desc = escapedDesc.replace(/\\(['"\\])/g, '$1');
    const cleaned = cleanDescription(desc);

    if (cleaned.length === 0) {
      emptyAfter.push({ line: idx + 1, original: desc });
      // Keep original to avoid empty
      return line;
    }
    if (cleaned === desc) {
      unchangedCount++;
      return line;
    }

    cleanedCount++;
    const reEscaped = cleaned.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    return `${m[1]}${reEscaped}${m[3]}`;
  });

  fs.writeFileSync(filePath, newLines.join('\n'));
  stats[lens] = { cleaned: cleanedCount, unchanged: unchangedCount, empty: emptyAfter.length };
  if (emptyAfter.length) {
    console.log(`\n[${lens}] WARNING: ${emptyAfter.length} descriptions would become empty (kept original):`);
    for (const e of emptyAfter.slice(0, 5)) {
      console.log(`  L${e.line}: ${e.original.slice(0, 100)}...`);
    }
  }
}

console.log('\nSummary:');
for (const lens of lenses) {
  const s = stats[lens];
  console.log(`  ${lens}: cleaned=${s.cleaned}, unchanged=${s.unchanged}, would-be-empty (kept original)=${s.empty}`);
}
