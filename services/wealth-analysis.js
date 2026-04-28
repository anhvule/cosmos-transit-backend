/**
 * Wealth Analysis — Vedic-astrology wealth report.
 *
 * Mirrors the structure of the Wealth.docx reference report:
 *   1. Lagna-based prediction (Lagna sign + Lagna Lord's house placement)
 *   2. Nakshatra-based prediction (Moon, Jupiter, Venus nakshatras + padas)
 *   3. House analysis for wealth (2nd, 4th, 9th, 11th — lord placement + aspects)
 *   4. Hora chart (D2) — planet placements in Sun's hora (Leo) vs Moon's hora (Cancer)
 *   5. Wealth yogas — classical combinations: Anabha, Sunabha, Durdhara, Parvatha,
 *      Sasa, Ruchaka, Bhadra, Hamsa, Malavya, Pasa, Harsha, Sarala, Vimala,
 *      Swaveeryaddhana, Raja, Parivartana, Lakshmi, Dhana.
 *
 * Inputs are the standard birth-details dict; output is a structured JSON
 * suitable for the Flutter Wealth Analysis screen.
 */

const { getNatalTransits } = require('./astrology_kerykeion_bridge');
const { getNakshatra } = require('./dasha');
const descriptions = require('../db/wealth-descriptions.json');

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const SIGN_RULERS = {
  Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury',
  Cancer: 'Moon', Leo: 'Sun', Virgo: 'Mercury',
  Libra: 'Venus', Scorpio: 'Mars', Sagittarius: 'Jupiter',
  Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter',
};

const VEDIC_SIGN = {
  Aries: 'Mesha', Taurus: 'Vrishabha', Gemini: 'Mithuna',
  Cancer: 'Karka', Leo: 'Simha', Virgo: 'Kanya',
  Libra: 'Tula', Scorpio: 'Vrischika', Sagittarius: 'Dhanu',
  Capricorn: 'Makara', Aquarius: 'Kumbha', Pisces: 'Meena',
};

const ALL_PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const SEVEN_PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

function signIndex(sign) {
  return SIGNS.indexOf(sign);
}

/** 1-indexed house count from `fromSign` to `toSign` (whole-sign). */
function houseFromSign(fromSign, toSign) {
  return ((signIndex(toSign) - signIndex(fromSign) + 12) % 12) + 1;
}

/** Sign that is `n` houses (1-indexed; 1 = same sign) from `fromSign`. */
function signAtHouseFrom(fromSign, n) {
  return SIGNS[(signIndex(fromSign) + (n - 1) + 12) % 12];
}

/**
 * Vedic graha drishti (special aspects):
 *   • All planets aspect the 7th house from themselves.
 *   • Mars also aspects the 4th and 8th.
 *   • Jupiter also aspects the 5th and 9th.
 *   • Saturn also aspects the 3rd and 10th.
 *   • Rahu/Ketu (per Brihat Parashara) aspect the 5th, 7th, 9th.
 *
 * Returns the 1-indexed houses (within the natal chart) aspected by this
 * planet sitting in `planetHouse`.
 */
function aspectedHouses(planetName, planetHouse) {
  const offsetsByPlanet = {
    Mars:    [7, 4, 8],
    Jupiter: [7, 5, 9],
    Saturn:  [7, 3, 10],
    Rahu:    [7, 5, 9],
    Ketu:    [7, 5, 9],
  };
  const offsets = offsetsByPlanet[planetName] || [7];
  return offsets.map(off => ((planetHouse - 1 + (off - 1)) % 12) + 1);
}

/**
 * Hora (D2) division — half-sign rulership.
 *
 * Each sign is split at 15°. For odd signs (Aries, Gemini, Leo, Libra,
 * Sagittarius, Aquarius) the FIRST half belongs to Sun (Leo) and the SECOND
 * half to Moon (Cancer). For even signs the order reverses.
 *
 * Returns 'Leo' or 'Cancer' — the hora-chart sign the planet falls into.
 */
function horaSignFor(sign, longitudeDegrees) {
  const idx = signIndex(sign);
  if (idx < 0) return null;
  const within = ((longitudeDegrees % 30) + 30) % 30;
  const isOddSign = idx % 2 === 0; // Aries=0 → odd-numbered (1st)
  const inFirstHalf = within < 15;
  const sunHora = (isOddSign && inFirstHalf) || (!isOddSign && !inFirstHalf);
  return sunHora ? 'Leo' : 'Cancer';
}

function ordinal(n) {
  if (n == null) return 'unknown';
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

function planetMap(natalPlanets) {
  return Object.fromEntries(natalPlanets.map(p => [p.name, p]));
}

// ─── Section 1: Lagna-based prediction ───────────────────────────────────────

function buildLagnaSection(natalMap) {
  const ascendant = natalMap.Ascendant;
  if (!ascendant) return null;
  const lagnaSign = ascendant.sign;
  const lagnaLordName = SIGN_RULERS[lagnaSign];
  const lagnaLord = natalMap[lagnaLordName];

  return {
    sign: lagnaSign,
    signVedic: VEDIC_SIGN[lagnaSign],
    lord: lagnaLordName,
    lordSign: lagnaLord ? lagnaLord.sign : null,
    lordHouse: lagnaLord ? lagnaLord.house : null,
    personalityPrediction: descriptions.lagna[lagnaSign] || '',
    lordPrediction: lagnaLord
      ? `Your lagna lord is in ${ordinal(lagnaLord.house)} house. ${descriptions.lagnaLordInHouse[String(lagnaLord.house)] || ''}`
      : '',
  };
}

// ─── Section 2: Nakshatra-based prediction ───────────────────────────────────

function buildNakshatraEntry(planet) {
  if (!planet) return null;
  const nak = getNakshatra(planet.fullDegree);
  return {
    planet: planet.name,
    sign: planet.sign,
    nakshatra: nak.name,
    pada: nak.pada,
    lord: nak.lord,
    prediction: descriptions.nakshatra[nak.name] || '',
    padaNote: descriptions.padaModifier[String(nak.pada)] || '',
  };
}

function buildNakshatraSection(natalMap) {
  return {
    moon: buildNakshatraEntry(natalMap.Moon),
    jupiter: buildNakshatraEntry(natalMap.Jupiter),
    venus: buildNakshatraEntry(natalMap.Venus),
  };
}

// ─── Section 3: Wealth-house analysis (2nd, 4th, 9th, 11th) ──────────────────

const WEALTH_HOUSE_KEYS = {
  2:  'second',
  4:  'fourth',
  9:  'ninth',
  11: 'eleventh',
};

function buildHouseEntry(natalMap, lagnaSign, houseNum) {
  const block = descriptions.houses[WEALTH_HOUSE_KEYS[houseNum]];
  if (!block) return null;

  const houseSign = signAtHouseFrom(lagnaSign, houseNum);
  const houseLordName = SIGN_RULERS[houseSign];
  const houseLord = natalMap[houseLordName];

  // Aspecting planets (per Vedic graha drishti) on this house.
  const aspects = [];
  for (const name of ALL_PLANETS) {
    const p = natalMap[name];
    if (!p) continue;
    if (aspectedHouses(name, p.house).includes(houseNum)) {
      aspects.push({
        planet: name,
        prediction: block.aspects[name] || '',
      });
    }
  }

  return {
    house: houseNum,
    title: block.title,
    sign: houseSign,
    signVedic: VEDIC_SIGN[houseSign],
    preamble: block.preamble,
    lord: houseLordName,
    lordSign: houseLord ? houseLord.sign : null,
    lordHouse: houseLord ? houseLord.house : null,
    lordPrediction: houseLord
      ? block.lordInHouse[String(houseLord.house)] || ''
      : '',
    aspects,
  };
}

function buildHouseAnalysis(natalMap) {
  const lagnaSign = natalMap.Ascendant ? natalMap.Ascendant.sign : null;
  if (!lagnaSign) return null;
  return {
    second:   buildHouseEntry(natalMap, lagnaSign, 2),
    fourth:   buildHouseEntry(natalMap, lagnaSign, 4),
    ninth:    buildHouseEntry(natalMap, lagnaSign, 9),
    eleventh: buildHouseEntry(natalMap, lagnaSign, 11),
  };
}

// ─── Section 4: Hora chart (D2) ──────────────────────────────────────────────

function buildHoraSection(natalMap) {
  const placements = [];
  for (const name of SEVEN_PLANETS) {
    const p = natalMap[name];
    if (!p) continue;
    const hora = horaSignFor(p.sign, p.fullDegree);
    if (!hora) continue;
    placements.push({
      planet: name,
      natalSign: p.sign,
      hora,
      prediction: descriptions.hora[hora][name] || '',
    });
  }

  // Ascendant note (if lagna falls in Leo or Cancer hora).
  let ascendantNote = '';
  const asc = natalMap.Ascendant;
  if (asc) {
    const ascHora = horaSignFor(asc.sign, asc.fullDegree);
    // The docx mentions "Sun and Lagna in Leo" — only emit when ascendant
    // and Sun share the same hora, marking the ascendant-led hora group.
    const sun = natalMap.Sun;
    const sunHora = sun ? horaSignFor(sun.sign, sun.fullDegree) : null;
    if (ascHora && ascHora === sunHora) {
      const key = ascHora === 'Leo' ? 'Sun' : 'Moon';
      ascendantNote = descriptions.hora.ascendantNote[key] || '';
    }
  }

  return {
    preamble: descriptions.hora.preamble,
    placements,
    ascendantNote,
  };
}

// ─── Section 5: Yoga detection ───────────────────────────────────────────────

const KENDRA_HOUSES = new Set([1, 4, 7, 10]);
const TRIKONA_HOUSES = new Set([1, 5, 9]);
const DUSTHANA_HOUSES = new Set([6, 8, 12]);

function detectAnabhaSunabhaDurdhara(natalMap) {
  const moon = natalMap.Moon;
  if (!moon) return [];

  const twelfthSign = signAtHouseFrom(moon.sign, 12);
  const secondSign = signAtHouseFrom(moon.sign, 2);

  // Per classical definition the Sun is excluded; Rahu/Ketu also excluded.
  const candidates = ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const inTwelfth = candidates.filter(n => natalMap[n] && natalMap[n].sign === twelfthSign);
  const inSecond  = candidates.filter(n => natalMap[n] && natalMap[n].sign === secondSign);

  const yogas = [];
  if (inTwelfth.length && inSecond.length) {
    yogas.push({
      name: 'Durdhara',
      ...descriptions.yogas.Durdhara,
      planets: [...new Set([...inTwelfth, ...inSecond])],
    });
  } else if (inTwelfth.length) {
    yogas.push({
      name: 'Anabha',
      ...descriptions.yogas.Anabha,
      planets: inTwelfth,
    });
  } else if (inSecond.length) {
    yogas.push({
      name: 'Sunabha',
      ...descriptions.yogas.Sunabha,
      planets: inSecond,
    });
  }
  return yogas;
}

function detectParvatha(natalMap, lagnaSign) {
  const lagnaLordName = SIGN_RULERS[lagnaSign];
  const twelfthSign = signAtHouseFrom(lagnaSign, 12);
  const twelfthLordName = SIGN_RULERS[twelfthSign];
  const a = natalMap[lagnaLordName];
  const b = natalMap[twelfthLordName];
  if (!a || !b) return null;

  // "Mutually kendra" — the houses they sit in are 1/4/7/10 from each other.
  const aToB = houseFromSign(a.sign, b.sign);
  if (KENDRA_HOUSES.has(aToB)) {
    return {
      name: 'Parvatha',
      ...descriptions.yogas.Parvatha,
      detail: `${lagnaLordName} (lagna lord) in ${a.sign} and ${twelfthLordName} (12th lord) in ${b.sign} — mutually kendra.`,
    };
  }
  return null;
}

const PANCHA_MAHAPURUSHA = [
  { name: 'Sasa Mahayoga',    planet: 'Saturn',  ownSigns: ['Capricorn', 'Aquarius'], exaltSign: 'Libra' },
  { name: 'Ruchaka Mahayoga', planet: 'Mars',    ownSigns: ['Aries', 'Scorpio'],      exaltSign: 'Capricorn' },
  { name: 'Bhadra Mahayoga',  planet: 'Mercury', ownSigns: ['Gemini', 'Virgo'],       exaltSign: 'Virgo' },
  { name: 'Hamsa Mahayoga',   planet: 'Jupiter', ownSigns: ['Sagittarius', 'Pisces'], exaltSign: 'Cancer' },
  { name: 'Malavya Mahayoga', planet: 'Venus',   ownSigns: ['Taurus', 'Libra'],       exaltSign: 'Pisces' },
];

function detectMahapurushaYogas(natalMap) {
  const yogas = [];
  for (const def of PANCHA_MAHAPURUSHA) {
    const p = natalMap[def.planet];
    if (!p) continue;
    const inOwnOrExalt = def.ownSigns.includes(p.sign) || p.sign === def.exaltSign;
    if (KENDRA_HOUSES.has(p.house) && inOwnOrExalt) {
      yogas.push({
        name: def.name,
        ...descriptions.yogas[def.name],
        detail: `${def.planet} in ${p.sign} (${ordinal(p.house)} house — kendra).`,
      });
    }
  }
  return yogas;
}

function detectPasa(natalMap) {
  const signs = new Set();
  for (const n of SEVEN_PLANETS) {
    if (natalMap[n]) signs.add(natalMap[n].sign);
  }
  if (signs.size === 5) {
    return { name: 'Pasa', ...descriptions.yogas.Pasa };
  }
  return null;
}

function detectVipreetaRaja(natalMap, lagnaSign) {
  const yogas = [];
  const cases = [
    { name: 'Harsha', sourceHouse: 6,  desc: descriptions.yogas.Harsha },
    { name: 'Sarala', sourceHouse: 8,  desc: descriptions.yogas.Sarala },
    { name: 'Vimala', sourceHouse: 12, desc: descriptions.yogas.Vimala },
  ];
  for (const c of cases) {
    const sign = signAtHouseFrom(lagnaSign, c.sourceHouse);
    const lordName = SIGN_RULERS[sign];
    const lord = natalMap[lordName];
    if (!lord) continue;
    if (DUSTHANA_HOUSES.has(lord.house)) {
      yogas.push({
        name: c.name,
        ...c.desc,
        detail: `${lordName} (lord of ${ordinal(c.sourceHouse)}) in ${ordinal(lord.house)} house.`,
      });
    }
  }
  return yogas;
}

function detectSwaveeryaddhana(natalMap, lagnaSign) {
  const lagnaLord = natalMap[SIGN_RULERS[lagnaSign]];
  const secondSign = signAtHouseFrom(lagnaSign, 2);
  const secondLord = natalMap[SIGN_RULERS[secondSign]];
  if (!lagnaLord || !secondLord) return null;
  const dist = houseFromSign(lagnaLord.sign, secondLord.sign);
  if (KENDRA_HOUSES.has(dist) || TRIKONA_HOUSES.has(dist)) {
    return {
      name: 'Swaveeryaddhana',
      ...descriptions.yogas.Swaveeryaddhana,
      detail: `Second lord ${SIGN_RULERS[secondSign]} is in ${ordinal(dist)} from lagna lord ${SIGN_RULERS[lagnaSign]}.`,
    };
  }
  return null;
}

function detectRaja(natalMap, lagnaSign) {
  const firstLord = SIGN_RULERS[lagnaSign];
  const seventhLord = SIGN_RULERS[signAtHouseFrom(lagnaSign, 7)];
  if (firstLord === seventhLord) return null; // single ruler — n/a
  const a = natalMap[firstLord];
  const b = natalMap[seventhLord];
  if (!a || !b) return null;
  if (a.sign === b.sign) {
    return {
      name: 'Raja',
      ...descriptions.yogas.Raja,
      detail: `${firstLord} and ${seventhLord} in conjunction in ${a.sign} (${ordinal(a.house)} house).`,
    };
  }
  return null;
}

function detectParivartana(natalMap, lagnaSign) {
  const fifthSign = signAtHouseFrom(lagnaSign, 5);
  const ninthSign = signAtHouseFrom(lagnaSign, 9);
  const fifthLord = SIGN_RULERS[fifthSign];
  const ninthLord = SIGN_RULERS[ninthSign];
  if (fifthLord === ninthLord) return null;
  const a = natalMap[fifthLord];
  const b = natalMap[ninthLord];
  if (!a || !b) return null;
  if (a.sign === ninthSign && b.sign === fifthSign) {
    return {
      name: 'Parivartana',
      ...descriptions.yogas.Parivartana,
      detail: `${fifthLord} (5th lord) in ${ninthSign} and ${ninthLord} (9th lord) in ${fifthSign}.`,
    };
  }
  return null;
}

function detectLakshmi(natalMap, lagnaSign) {
  const ninthLordName = SIGN_RULERS[signAtHouseFrom(lagnaSign, 9)];
  const ninthLord = natalMap[ninthLordName];
  const lagnaLord = natalMap[SIGN_RULERS[lagnaSign]];
  if (!ninthLord || !lagnaLord) return null;

  // 9th lord exalted/own AND in kendra/trikona, AND lagna lord well-placed.
  const exaltSigns = {
    Sun: 'Aries', Moon: 'Taurus', Mars: 'Capricorn', Mercury: 'Virgo',
    Jupiter: 'Cancer', Venus: 'Pisces', Saturn: 'Libra',
  };
  const ownSigns = {
    Sun: ['Leo'], Moon: ['Cancer'], Mars: ['Aries', 'Scorpio'], Mercury: ['Gemini', 'Virgo'],
    Jupiter: ['Sagittarius', 'Pisces'], Venus: ['Taurus', 'Libra'], Saturn: ['Capricorn', 'Aquarius'],
  };
  const ninthOk = (
    (exaltSigns[ninthLordName] === ninthLord.sign || (ownSigns[ninthLordName] || []).includes(ninthLord.sign))
    && (KENDRA_HOUSES.has(ninthLord.house) || TRIKONA_HOUSES.has(ninthLord.house))
  );
  const lagnaOk = !DUSTHANA_HOUSES.has(lagnaLord.house);
  if (ninthOk && lagnaOk) {
    return {
      name: 'Lakshmi',
      ...descriptions.yogas.Lakshmi,
      detail: `${ninthLordName} (9th lord) in ${ninthLord.sign}, ${ordinal(ninthLord.house)} house — own/exalted in trine/angle.`,
    };
  }
  return null;
}

function detectDhana(natalMap, lagnaSign) {
  // Lord of 2nd or 11th in a kendra or trikona of the chart, not in dushtana.
  const candidates = [
    { houseNum: 2,  lord: SIGN_RULERS[signAtHouseFrom(lagnaSign, 2)] },
    { houseNum: 11, lord: SIGN_RULERS[signAtHouseFrom(lagnaSign, 11)] },
  ];
  for (const c of candidates) {
    const p = natalMap[c.lord];
    if (!p) continue;
    if ((KENDRA_HOUSES.has(p.house) || TRIKONA_HOUSES.has(p.house)) && !DUSTHANA_HOUSES.has(p.house)) {
      return {
        name: 'Dhana',
        ...descriptions.yogas.Dhana,
        detail: `${c.lord} (${ordinal(c.houseNum)} lord) in ${ordinal(p.house)} house (${p.sign}).`,
      };
    }
  }
  return null;
}

function detectYogas(natalMap, lagnaSign) {
  const yogas = [];
  yogas.push(...detectAnabhaSunabhaDurdhara(natalMap));

  const parvatha = detectParvatha(natalMap, lagnaSign);
  if (parvatha) yogas.push(parvatha);

  yogas.push(...detectMahapurushaYogas(natalMap));

  const pasa = detectPasa(natalMap);
  if (pasa) yogas.push(pasa);

  yogas.push(...detectVipreetaRaja(natalMap, lagnaSign));

  const swav = detectSwaveeryaddhana(natalMap, lagnaSign);
  if (swav) yogas.push(swav);

  const raja = detectRaja(natalMap, lagnaSign);
  if (raja) yogas.push(raja);

  const parivartana = detectParivartana(natalMap, lagnaSign);
  if (parivartana) yogas.push(parivartana);

  const lakshmi = detectLakshmi(natalMap, lagnaSign);
  if (lakshmi) yogas.push(lakshmi);

  const dhana = detectDhana(natalMap, lagnaSign);
  if (dhana) yogas.push(dhana);

  return yogas;
}

// ─── Top-level orchestrator ──────────────────────────────────────────────────

function buildWealthReport(natalPlanets) {
  const natalMap = planetMap(natalPlanets);
  const lagnaSign = natalMap.Ascendant ? natalMap.Ascendant.sign : null;
  if (!lagnaSign) {
    throw new Error('Wealth analysis requires a natal Ascendant.');
  }

  const lagna = buildLagnaSection(natalMap);
  const nakshatra = buildNakshatraSection(natalMap);
  const houseAnalysis = buildHouseAnalysis(natalMap);
  const hora = buildHoraSection(natalMap);
  const yogas = detectYogas(natalMap, lagnaSign);

  // Overall verdict based on count of supportive yogas + favourable house lords.
  const favorableCount = yogas.length;
  const overallEffect = favorableCount >= 3
    ? 'Strongly Favourable'
    : favorableCount >= 1
      ? 'Favourable'
      : 'Mixed';

  return {
    lagna,
    nakshatra,
    houseAnalysis,
    hora,
    yogas,
    yogaCount: yogas.length,
    overallEffect,
  };
}

async function getWealthAnalysis(birthData) {
  const { natalPlanets } = await getNatalTransits(birthData, null);
  return buildWealthReport(natalPlanets);
}

module.exports = {
  getWealthAnalysis,
  buildWealthReport,
  // Exposed for unit tests
  horaSignFor,
  aspectedHouses,
  houseFromSign,
  signAtHouseFrom,
  detectYogas,
  buildLagnaSection,
  buildNakshatraSection,
  buildHouseAnalysis,
  buildHoraSection,
};
