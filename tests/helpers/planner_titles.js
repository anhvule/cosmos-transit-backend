/**
 * Title normalization and subset matching for Galactic Planner career e2e.
 *
 * Rules (see design spec):
 * 1. trim + collapse whitespace
 * 2. case-insensitive
 * 3. optional "the" before house ordinal: "in 8th house" ≡ "in the 8th house"
 * 4. "Transit" ≡ "Transits"
 */

function normalizeTitle(title) {
  if (title == null) return '';
  let s = String(title).trim().replace(/\s+/g, ' ').toLowerCase();
  // Transit / Transits
  s = s.replace(/\btransits\b/g, 'transit');
  // optional "the" before an ordinal house: "in the 8th" → "in 8th"
  s = s.replace(/\bin the (\d+(?:st|nd|rd|th))\b/g, 'in $1');
  return s;
}

function titlesFromCareerResponse(body) {
  const aspects = (body && body.aspects) || [];
  const rulers = (body && body.rulers) || [];
  const out = [];
  for (const a of aspects) {
    if (a && a.description) out.push(a.description);
  }
  for (const r of rulers) {
    if (r && r.description) out.push(r.description);
  }
  return out;
}

/**
 * Return expected titles that are not present in actualTitles (subset check).
 * Preserves original expected strings for failure messages.
 */
function missingTitles(expectedTitles, actualTitles) {
  const actualSet = new Set((actualTitles || []).map(normalizeTitle));
  return (expectedTitles || []).filter(t => !actualSet.has(normalizeTitle(t)));
}

module.exports = {
  normalizeTitle,
  titlesFromCareerResponse,
  missingTitles,
};
