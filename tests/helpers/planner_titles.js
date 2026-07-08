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
  // "aspects" / "aspects the" / "aspect the" — planner ICS grammar variants
  // of the engine's "aspect" (e.g. "Mercury aspects the Moon in the 6th
  // house" ≡ "Mercury aspect Moon in 6th house").
  s = s.replace(/\baspects\b/g, 'aspect');
  s = s.replace(/\baspect the\b/g, 'aspect');
  // optional "the" before an ordinal house: "in the 8th" → "in 8th"
  s = s.replace(/\bin the (\d+(?:st|nd|rd|th))\b/g, 'in $1');
  return s;
}

const PHASE_SUFFIX_RE = /\s*:\s*(starts|exact|ends)$/i;

function stripPhaseSuffix(normalized) {
  return normalized.replace(PHASE_SUFFIX_RE, '');
}

/**
 * True when actual satisfies expected. Phase qualifiers (": Starts" /
 * ": Exact" / ": Ends", any whitespace around the colon) are presentation
 * detail: the planner and the API may disagree on which phase — or none —
 * a given day carries, so titles compare on the phase-stripped base.
 */
function titleMatchesExpected(expectedNorm, actualNorm) {
  if (actualNorm === expectedNorm) return true;
  return stripPhaseSuffix(expectedNorm) === stripPhaseSuffix(actualNorm);
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
