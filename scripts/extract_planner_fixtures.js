#!/usr/bin/env node
/**
 * One-shot offline extractor: My Galactic Planner N.pdf → tests/fixtures/plannerN.json
 *
 * Requires `pdftotext` (poppler) on PATH. Not run in CI — fixtures are committed.
 *
 * Usage:
 *   node scripts/extract_planner_fixtures.js
 *   node scripts/extract_planner_fixtures.js 1 5 11
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FIXTURES = path.join(ROOT, 'tests', 'fixtures');

const PLANETS = 'Moon|Sun|Mercury|Venus|Mars|Jupiter|Saturn|Rahu|Ketu';
const DAY_RE = /^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday),\s+([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})\s*$/;
const MONTHS = {
  January: '01', February: '02', March: '03', April: '04',
  May: '05', June: '06', July: '07', August: '08',
  September: '09', October: '10', November: '11', December: '12',
};

// Title start: planet + (Transit(s)|aspect|ruler|in Nth (Dispositor))
const TITLE_START_RE = new RegExp(
  `^\\s*(${PLANETS})\\s+` +
  `(?:` +
    `Transits?\\b` +
    `|aspect\\b` +
    `|ruler\\b` +
    `|in\\s+\\d+(?:st|nd|rd|th)\\s+\\(Dispositor\\)` +
  `)`,
  'i',
);

const LEGEND_RE = /Frequent slightly impactful|Infrequent Impactful|Rare Extremely Impactful|GALACTIC|Daily Predictions|No significant events/i;
const CONTINUATION_RE = /^\s*(House|house|\d+(?:st|nd|rd|th)\s+House)\s*$/;

function toIso(weekday, monthName, day, year) {
  const mm = MONTHS[monthName];
  if (!mm) throw new Error(`Unknown month: ${monthName}`);
  return `${year}-${mm}-${String(Number(day)).padStart(2, '0')}`;
}

function collapseWs(s) {
  return s.replace(/\s+/g, ' ').trim();
}

function isTitleStart(line) {
  return TITLE_START_RE.test(line) && !LEGEND_RE.test(line);
}

function extractDays(text) {
  const lines = text.split(/\r?\n/);
  const days = {};
  let currentDate = null;
  let pendingTitle = null;

  function flushPending() {
    if (pendingTitle && currentDate) {
      days[currentDate].push(collapseWs(pendingTitle));
      pendingTitle = null;
    }
  }

  function ensureDay(date) {
    if (!days[date]) days[date] = [];
  }

  for (const raw of lines) {
    const line = raw.replace(/\f/g, '');
    const dayMatch = line.match(DAY_RE);
    if (dayMatch) {
      flushPending();
      currentDate = toIso(dayMatch[1], dayMatch[2], dayMatch[3], dayMatch[4]);
      ensureDay(currentDate);
      continue;
    }
    if (!currentDate) continue;

    if (/No significant events today/i.test(line)) {
      flushPending();
      continue;
    }
    if (LEGEND_RE.test(line)) continue;

    if (pendingTitle && CONTINUATION_RE.test(line)) {
      pendingTitle = `${pendingTitle} ${collapseWs(line)}`;
      flushPending();
      continue;
    }

    // Continuation of a wrapped title that still looks like title fragment
    // e.g. previous ended with "in the" and this is "8th House"
    if (pendingTitle && /^\s*\d+(?:st|nd|rd|th)\s+House\s*$/i.test(line)) {
      pendingTitle = `${pendingTitle} ${collapseWs(line)}`;
      flushPending();
      continue;
    }

    if (isTitleStart(line)) {
      flushPending();
      pendingTitle = collapseWs(line);
      // If title already looks complete (ends with house / dispositor / phase), flush
      if (/(?:house|House|\(Dispositor\))\s*(?::\s*(?:Starts|Exact|Ends))?\s*$/.test(pendingTitle)
          && !/\bin the\s*$/i.test(pendingTitle)
          && !/\bin the \d+(?:st|nd|rd|th)\s*$/i.test(pendingTitle)) {
        // still may be incomplete if ends with "in the 8th" without House
        if (/\bin(?:\s+the)?\s+\d+(?:st|nd|rd|th)\s*$/i.test(pendingTitle)) {
          // wait for "House" continuation
        } else {
          flushPending();
        }
      }
      continue;
    }

    // Non-title line ends any pending title
    if (pendingTitle && collapseWs(line).length > 0) {
      flushPending();
    }
  }
  flushPending();
  return days;
}

function extractPdf(pdfPath) {
  const text = execFileSync('pdftotext', ['-layout', pdfPath, '-'], {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
  return extractDays(text);
}

function main() {
  fs.mkdirSync(FIXTURES, { recursive: true });
  const args = process.argv.slice(2).map(Number).filter(n => n >= 1 && n <= 11);
  const nums = args.length ? args : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  for (const n of nums) {
    const pdfName = `My Galactic Planner ${n}.pdf`;
    const pdfPath = path.join(ROOT, pdfName);
    if (!fs.existsSync(pdfPath)) {
      console.error(`SKIP ${pdfName} (not found)`);
      continue;
    }
    const days = extractPdf(pdfPath);
    const out = { source: pdfName, days };
    const outPath = path.join(FIXTURES, `planner${n}.json`);
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
    const dayCount = Object.keys(days).length;
    const eventCount = Object.values(days).reduce((a, t) => a + t.length, 0);
    console.log(`Wrote ${outPath} (${dayCount} days, ${eventCount} titles)`);
  }
}

main();
