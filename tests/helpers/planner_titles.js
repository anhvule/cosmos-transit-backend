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

const PHASE_SUFFIX_RE = /\s*:\s*(starts|exact|ends)$/i;

function stripPhaseSuffix(normalized) {
  return normalized.replace(PHASE_SUFFIX_RE, '');
}

/** True when actual satisfies expected (fixture may omit : Starts/Exact/Ends). */
function titleMatchesExpected(expectedNorm, actualNorm) {
  if (actualNorm === expectedNorm) return true;
  // Fixture base title; API adds phase suffix only
  if (!PHASE_SUFFIX_RE.test(expectedNorm)
      && stripPhaseSuffix(actualNorm) === expectedNorm) {
    return true;
  }
  return false;
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
  const actualNorms = (actualTitles || []).map(normalizeTitle);
  return (expectedTitles || []).filter((t) => {
    const expectedNorm = normalizeTitle(t);
    return !actualNorms.some((actualNorm) => titleMatchesExpected(expectedNorm, actualNorm));
  });
}

module.exports = {
  normalizeTitle,
  stripPhaseSuffix,
  titleMatchesExpected,
  titlesFromCareerResponse,
  missingTitles,
};
