// Unified interpretation lookup: engine event-name string → parsed
// structured key (services/cosmos_event_parser) → interpretations-table
// lookup with an ordered ascendant fallback chain (db/cosmos).
//
// Replaces the legacy get{Career,Relationship,Advice,Food,Investment}-
// EventInterpretation functions (per-lens name-string SQLite DBs) and
// getCosmosInterpretation (chart-agnostic event_templates lookup).

const { parseEventName } = require('./cosmos_event_parser');
const { lookupInterpretation } = require('../db/cosmos');

/**
 * Lens routes (/api/career, /relationship, /advice, /food, /investment-*):
 * ascendant-specific → Aries (the seeded baseline, mirroring the legacy
 * lookupEventWithFallback) → '*' generic set.
 * Returned function signature matches the old lookups: (description, ascendant) → string.
 */
function legacyLensLookup(lens) {
  return (description, ascendant) =>
    lookupInterpretation(lens, parseEventName(description), [ascendant, 'Aries', '*']);
}

/**
 * Panda routes (/api/panda/*): ascendant-specific → '*'. Aries is
 * deliberately NOT in this chain — the '*' set is the authored generic,
 * better than another native's chart-specific text.
 */
function pandaLookup(lens) {
  return (description, ascendant) =>
    lookupInterpretation(lens, parseEventName(description), [ascendant, '*']);
}

module.exports = { legacyLensLookup, pandaLookup };
