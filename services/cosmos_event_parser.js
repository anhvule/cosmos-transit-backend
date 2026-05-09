// Converts the kerykeion engine's event-name strings into the structured
// key shape used by db/cosmos.db's event_templates table.
//
// The engine emits names like:
//   "Mars aspect Venus in 9th house"            (+ optional " : Starts/Exact/Ends")
//   "Mars aspect Venus in the 9th house"        (alternate phrasing)
//   "Jupiter Aspecting Ascendant (ASC)"         (+ phase)
//   "Jupiter Aspecting Midheaven (MC)"          (+ phase)
//   "Pluto conjunct Saturn"                     (+ phase)
//   "Uranus conjunct Venus"                     (+ phase)
//   "Mars Transits the 5th House"
//   "Mars ruler of the 11th House in the 9th House"
//   "Mars in 9th (Dispositor)"
//
// Returns a structured-key object that db/cosmos.js can look up, or null
// if the name doesn't match any known kind.

function ordToInt(s) {
  return parseInt(s, 10);
}

function parseEventName(name) {
  if (!name || typeof name !== 'string') return null;

  // Strip optional phase suffix: " : Starts" / " : Exact" / " : Ends"
  let baseName = name.trim();
  let phase = 'window';
  const phaseMatch = baseName.match(/\s*:\s*(Starts|Exact|Ends)\s*$/i);
  if (phaseMatch) {
    baseName = baseName.slice(0, phaseMatch.index).trim();
    phase = phaseMatch[1].toLowerCase();
  }

  let m;

  // outer_special: "Pluto conjunct Saturn" | "Uranus conjunct Venus"
  m = baseName.match(/^(Pluto|Uranus)\s+conjunct\s+(Saturn|Venus)\s*$/i);
  if (m) {
    return {
      kind: 'outer_special',
      special_label: `${cap(m[1])}-${cap(m[2])}`,
      phase,
    };
  }

  // angle_aspect: "X Aspecting Ascendant (ASC)" or "... Midheaven (MC)"
  m = baseName.match(/^(\w+)\s+Aspecting\s+(?:Ascendant\s*\(ASC\)|Midheaven\s*\(MC\))\s*$/i);
  if (m) {
    const angle = /MC/i.test(baseName) ? 'MC' : 'ASC';
    return {
      kind: 'angle_aspect',
      transit_planet: cap(m[1]),
      target_angle: angle,
      phase,
    };
  }

  // transit_house: "X Transits the Nth House" — no phase
  m = baseName.match(/^(\w+)\s+Transits\s+the\s+(\d+)(?:st|nd|rd|th)\s+House\s*$/i);
  if (m) {
    return {
      kind: 'transit_house',
      transit_planet: cap(m[1]),
      target_house: ordToInt(m[2]),
      phase: 'window',
    };
  }

  // ruler: "X ruler of the Nth House in the Mth House" — planet inferred from
  //         ascendant in cosmos.db, so only lord_house and target_house matter.
  m = baseName.match(/^(\w+)\s+ruler\s+of\s+the\s+(\d+)(?:st|nd|rd|th)\s+House\s+in\s+the\s+(\d+)(?:st|nd|rd|th)\s+House\s*$/i);
  if (m) {
    return {
      kind: 'ruler',
      lord_house: ordToInt(m[2]),
      target_house: ordToInt(m[3]),
      phase: 'window',
    };
  }

  // dispositor: "X in Nth (Dispositor)"
  m = baseName.match(/^(\w+)\s+in\s+(\d+)(?:st|nd|rd|th)\s+\(Dispositor\)\s*$/i);
  if (m) {
    return {
      kind: 'dispositor',
      natal_planet: cap(m[1]),
      target_house: ordToInt(m[2]),
      phase: 'window',
    };
  }

  // aspect: "X aspect Y in Nth house" / "... in the Nth house"
  // The natal_house is informational for the engine — cosmos templates are
  // chart-agnostic so we discard it for the lookup.
  m = baseName.match(/^(\w+)\s+aspect\s+(\w+)(?:\s+in\s+(?:the\s+)?\d+(?:st|nd|rd|th)\s+house)?\s*$/i);
  if (m) {
    return {
      kind: 'aspect',
      transit_planet: cap(m[1]),
      natal_planet: cap(m[2]),
      phase,
    };
  }

  return null;
}

function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;
}

module.exports = { parseEventName };
