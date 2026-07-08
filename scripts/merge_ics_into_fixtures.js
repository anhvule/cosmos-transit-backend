#!/usr/bin/env node
/**
 * Merge event titles from a Galactic Planner ICS export into planner fixtures.
 *
 * Usage:
 *   node scripts/merge_ics_into_fixtures.js "/path/to/calendar.ics"
 */
const fs = require('fs');
const path = require('path');
const { normalizeTitle, stripPhaseSuffix } = require('../tests/helpers/planner_titles');

// Dedupe key: phase qualifiers (": Starts" / ": Exact" / ": Ends") are
// presentation detail — "X" and "X : Exact" are the same assertion under the
// e2e matcher, so a day must carry at most one of them.
function titleKey(title) {
  return stripPhaseSuffix(normalizeTitle(title));
}

const ROOT = path.join(__dirname, '..');
const FIXTURES_DIR = path.join(ROOT, 'tests', 'fixtures');

// Strip leading emoji/symbol run from calendar SUMMARY lines.
function cleanSummary(raw) {
  if (!raw) return '';
  let s = raw.trim();
  // Remove emoji / pictograph prefix (calendar app prefixes titles with icons).
  s = s.replace(/^[\s\p{Extended_Pictographic}\p{Emoji}\p{Emoji_Presentation}\uFE0F\u200D]+/u, '');
  return s.replace(/\s+/g, ' ').trim();
}

function toDateStr(yyyymmdd) {
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
}

function nextDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

function parseIcs(text) {
  const events = [];
  const blocks = text.split(/BEGIN:VEVENT\r?\n/);
  for (const block of blocks.slice(1)) {
    const dtMatch = block.match(/^DTSTART(?:;[^:]*)?:(\d{8})/m);
    const dtEndMatch = block.match(/^DTEND(?:;[^:]*)?:(\d{8})/m);
    const sumMatch = block.match(/^SUMMARY:(.+)$/m);
    if (!dtMatch || !sumMatch) continue;
    const title = cleanSummary(sumMatch[1]);
    if (!title) continue;
    const start = toDateStr(dtMatch[1]);
    // Multi-day events carry DTEND (exclusive per RFC 5545): the planner
    // shows the event on EVERY day of [DTSTART, DTEND), so assert each day.
    const endExclusive = dtEndMatch ? toDateStr(dtEndMatch[1]) : nextDate(start);
    for (let date = start; date < endExclusive; date = nextDate(date)) {
      events.push({ date, title });
    }
  }
  return events;
}

function loadAllFixtures() {
  const fixtures = [];
  for (let n = 1; n <= 11; n += 1) {
    const file = path.join(FIXTURES_DIR, `planner${n}.json`);
    if (!fs.existsSync(file)) continue;
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    fixtures.push({ n, file, data });
  }
  return fixtures;
}

function fixtureForDate(fixtures, date) {
  for (const f of fixtures) {
    if (f.data.days[date] !== undefined) return f;
  }
  // Date not in any fixture — pick planner whose range is closest / overlapping by month
  for (const f of fixtures) {
    const dates = Object.keys(f.data.days).sort();
    if (date >= dates[0] && date <= dates[dates.length - 1]) return f;
  }
  return null;
}

function hasTitle(titles, title) {
  const key = titleKey(title);
  return titles.some((t) => titleKey(t) === key);
}

function main() {
  const icsPath = process.argv[2];
  if (!icsPath || !fs.existsSync(icsPath)) {
    console.error('Usage: node scripts/merge_ics_into_fixtures.js <calendar.ics>');
    process.exit(1);
  }

  const icsText = fs.readFileSync(icsPath, 'utf8');
  const events = parseIcs(icsText);
  const fixtures = loadAllFixtures();

  const stats = {
    icsEvents: events.length,
    added: 0,
    skippedPresent: 0,
    skippedNoFixture: 0,
    newDays: 0,
    byPlanner: {},
  };

  for (const { date, title } of events) {
    const fixture = fixtureForDate(fixtures, date);
    if (!fixture) {
      stats.skippedNoFixture += 1;
      continue;
    }

    if (!fixture.data.days[date]) {
      fixture.data.days[date] = [];
      stats.newDays += 1;
    }

    const dayTitles = fixture.data.days[date];
    if (hasTitle(dayTitles, title)) {
      stats.skippedPresent += 1;
      continue;
    }

    dayTitles.push(title);
    stats.added += 1;
    stats.byPlanner[fixture.n] = (stats.byPlanner[fixture.n] || 0) + 1;
  }

  for (const f of fixtures) {
    // Stable sort days and dedupe within each day (normalized)
    const sortedDays = {};
    for (const date of Object.keys(f.data.days).sort()) {
      const seen = new Set();
      const out = [];
      for (const t of f.data.days[date]) {
        const key = titleKey(t);
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(t);
      }
      sortedDays[date] = out;
    }
    f.data.days = sortedDays;
    fs.writeFileSync(f.file, JSON.stringify(f.data, null, 2) + '\n');
  }

  console.log(JSON.stringify(stats, null, 2));
  if (stats.added > 0) {
    console.log('\nAdded titles by planner:', stats.byPlanner);
  }
}

main();
