/**
 * Daily "Mind & Energy" scores from a natal chart + that day's sidereal transits.
 *
 *   overthinking — mental restlessness (Moon / nodes / Saturn / Mercury driven)
 *   vitality     — mental stamina + physical energy (Sun / Mars / Moon driven)
 *   focus        — mental clarity and concentration (Mercury / Jupiter driven)
 *   irritability — short temper, friction with others (Mars driven)
 *   steadiness   — emotional stability (Moon strength / paksha bala driven)
 *
 * All are 0–100, starting from BASE and moved by weighted rules. Every rule
 * that fires is reported as a driver so the app can explain each day. All
 * weights live in WEIGHTS so they can be tuned without touching the logic.
 *
 * Pure functions only — chart math (positions, dasha) is done by the caller.
 */

const { planetDignity } = require('./investment-dasha');

const BASE = 50;

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];
const SIGN_RULERS = {
  Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
  Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Mars',
  Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter',
};
const CLASSICAL = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const KENDRA_OFFSETS = new Set([0, 3, 6, 9]); // sign distance of houses 1/4/7/10
const FIXED_SIGNS = new Set(['Taurus', 'Leo', 'Scorpio', 'Aquarius']);
const MOVABLE_SIGNS = new Set(['Aries', 'Cancer', 'Libra', 'Capricorn']);

const WEIGHTS = {
  // ── overthinking ──
  moonWithNode: 16,            // transit Moon in the sign of Rahu/Ketu (Grahan yoga)
  moonWithSaturn: 10,          // Moon + Saturn (Vish yoga)
  moonHouse: { 6: 6, 8: 10, 12: 8 },
  moonNakLordMalefic: 6,       // Moon's nakshatra lord is Rahu/Ketu/Saturn
  mercuryRetrograde: 8,
  mercuryCombust: 6,
  nearAmavasya: 8,             // tithi 28–30
  nearPurnima: -6,             // tithi 13–15
  jupiterOnMoon: -10,          // Jupiter conjoins or aspects (5/7/9) the Moon
  dashaMoonNode: { antardasha: 6, mahadasha: 4 },
  // ── vitality ──
  goodHouse: 6,                // Sun/Mars in 3/6/10/11
  badHouse: -8,                // Sun/Mars in 8/12
  saturnOnNatalMoon: -8,
  saturnOnLagna: -6,
  moonWaxing: 5,
  moonWaning: -3,
  dashaLord: { antardasha: 5, mahadasha: 3 },     // sign for exalted/own
  dashaLordDebil: { antardasha: -6, mahadasha: -4 },
  // ── focus ──
  focus: {
    mercuryRetrograde: -8,
    mercuryCombust: -6,
    jupiterOnMercury: 6,       // Jupiter conjoins or aspects transit Mercury
    moonFixedSign: 4,
    moonMovableSign: -3,
    moonWithNode: -6,
    mercuryHouse: { 1: 5, 5: 5, 10: 5, 8: -6, 12: -6 },
    dashaMercuryStrong: { antardasha: 5, mahadasha: 3 }, // Mercury dasha, natal Mercury exalted/own
  },
  // ── irritability ──
  irritability: {
    marsOnMoon: 12,            // Mars conjoins or aspects (4/7/8) the Moon
    marsWithSaturn: 10,
    marsWithRahu: 12,          // Angarak yoga
    marsHouse: { 1: 6, 7: 6, 8: 6 },
    sunStrong: 3,              // Sun exalted/own (Aries/Leo)
    jupiterOnMoon: -8,
    venusWithMoon: -4,
    dashaMarsRahu: { antardasha: 6, mahadasha: 4 },
  },
  // ── steadiness ──
  steadiness: {
    moonWaxing: 6,             // paksha bala
    moonWaning: -4,
    nearPurnima: 6,
    nearAmavasya: -8,
    moonHouse: { 1: 4, 5: 4, 9: 4, 11: 4, 4: -4, 8: -8, 12: -6 },
    marsOnMoon: -8,
    moonWithSaturn: -8,
    moonWithNode: -10,
    jupiterOnMoon: 8,
    venusWithMoon: 4,
    dashaMoonDebil: { antardasha: -5, mahadasha: -3 }, // Moon dasha, natal Moon debilitated
  },
  // ── dignity (planet -> metric -> state -> delta) ──
  transitDignity: {
    Sun:  { vitality:     { debilitated: -18, exalted: 14, own: 8 } },
    Mars: {
      vitality:     { debilitated: -18, exalted: 14, own: 8 },
      irritability: { debilitated: 6, exalted: 4, own: 4 },
    },
    Moon: {
      vitality:     { debilitated: -4, exalted: 4, own: 2 },
      overthinking: { debilitated: 10, exalted: -6, own: -3 },
      steadiness:   { debilitated: -12, exalted: 10, own: 6 },
    },
    Mercury: { focus: { debilitated: -12, exalted: 12, own: 8 } },
  },
  natalDignity: {
    Sun:  { vitality:     { debilitated: -8, exalted: 8, own: 5 } },
    Mars: { vitality:     { debilitated: -8, exalted: 8, own: 5 } },
    Moon: {
      overthinking: { debilitated: 8, exalted: -6, own: -4 },
      vitality:     { debilitated: -3, exalted: 3, own: 2 },
      steadiness:   { debilitated: -6, exalted: 6, own: 4 },
    },
    Mercury: { focus: { debilitated: -6, exalted: 6, own: 4 } },
  },
  neechaBhangaFactor: 0.5,     // a cancelled debilitation keeps this share of its penalty
};

const NAKSHATRA_MALEFIC_LORDS = new Set(['Rahu', 'Ketu', 'Saturn']);
// Sign distances (1 = same sign, i.e. conjunction) each planet aspects.
const GRAHA_DRISHTI = { Jupiter: [1, 5, 7, 9], Mars: [1, 4, 7, 8], Saturn: [1, 3, 7, 10] };

const signIdx = s => SIGNS.indexOf(s);
const signDist = (from, to) => (((signIdx(to) - signIdx(from)) % 12) + 12) % 12;
const aspects = (planet, fromSign, toSign) =>
  GRAHA_DRISHTI[planet].includes(signDist(fromSign, toSign) + 1);

function tithiNumber(sunLon, moonLon) {
  const elong = (((moonLon - sunLon) % 360) + 360) % 360;
  return Math.floor(elong / 12) + 1; // 1..30
}

/**
 * Neecha bhanga: a debilitated planet's penalty is cancelled when its
 * dispositor, or the planet exalted in that sign, sits in a kendra from the
 * Lagna or from the Moon. `posOf(p)` returns { sign } for the frame the
 * debilitated planet lives in (natal chart or the day's transits).
 */
function neechaBhanga(sign, posOf, lagnaSign, moonSign) {
  const exaltLord = CLASSICAL.find(p => planetDignity(p, sign) === 'exalted');
  for (const cand of [SIGN_RULERS[sign], exaltLord]) {
    const pos = cand && posOf(cand);
    if (!pos || !pos.sign) continue;
    if (lagnaSign && KENDRA_OFFSETS.has(signDist(lagnaSign, pos.sign))) return cand;
    if (moonSign && KENDRA_OFFSETS.has(signDist(moonSign, pos.sign))) return cand;
  }
  return null;
}

/** Push a driver unless its delta is zero. */
function add(drivers, metric, label, delta) {
  if (delta) drivers.push({ metric, label, delta });
}

function dignityDrivers(drivers, planet, sign, table, frame, posOf, lagnaSign, moonSign) {
  const state = planetDignity(planet, sign);
  if (!state || state === 'neutral') return;
  const label = state === 'own' ? 'in own sign' : state;
  for (const [metric, deltas] of Object.entries(table[planet] || {})) {
    let delta = deltas[state];
    if (!delta) continue;
    let suffix = '';
    if (state === 'debilitated') {
      const saver = neechaBhanga(sign, posOf, lagnaSign, moonSign);
      if (saver) {
        delta = Math.round(delta * WEIGHTS.neechaBhangaFactor);
        suffix = ` (cancelled by ${saver} in a kendra, neecha bhanga)`;
      }
    }
    add(drivers, metric, `${frame} ${planet} ${label} in ${sign}${suffix}`, delta);
  }
}

/**
 * @param {Object} ctx
 * @param {Object} ctx.natal    { [planet]: { sign, house } } incl. 'Ascendant'
 * @param {Object} ctx.transit  { [planet]: { sign, house, siderealLon, speed } }
 * @param {Object} [ctx.dasha]  { mahadasha: {planet}|null, antardasha: {planet}|null }
 * @param {Object} [ctx.nakshatraLord] lord of the transit Moon's nakshatra
 * @returns {{ overthinking: number, vitality: number, focus: number,
 *             irritability: number, steadiness: number, drivers: Array }}
 *   drivers: { metric, label, delta }, sorted by |delta| descending.
 */
function scoreDay({ natal, transit, dasha = {}, nakshatraLord = null }) {
  const drivers = [];
  const lagnaSign = natal.Ascendant && natal.Ascendant.sign;
  const natalMoonSign = natal.Moon && natal.Moon.sign;
  const t = transit || {};
  const moon = t.Moon;
  const F = WEIGHTS.focus;
  const I = WEIGHTS.irritability;
  const S = WEIGHTS.steadiness;

  // ── natal dignity: a fixed baseline shift every day ──
  for (const planet of Object.keys(WEIGHTS.natalDignity)) {
    const n = natal[planet];
    if (!n) continue;
    dignityDrivers(drivers, planet, n.sign, WEIGHTS.natalDignity, 'Natal',
      p => natal[p], lagnaSign, natalMoonSign);
  }

  // ── transit dignity of Sun / Mars / Moon ──
  for (const planet of Object.keys(WEIGHTS.transitDignity)) {
    if (!t[planet]) continue;
    dignityDrivers(drivers, planet, t[planet].sign, WEIGHTS.transitDignity, 'Transit',
      p => t[p], lagnaSign, natalMoonSign);
  }

  if (moon) {
    const nodeSigns = [t.Rahu, t.Ketu].filter(Boolean).map(p => p.sign);
    if (nodeSigns.includes(moon.sign)) {
      add(drivers, 'overthinking', 'Moon conjunct Rahu/Ketu (Grahan yoga)', WEIGHTS.moonWithNode);
      add(drivers, 'focus', 'Moon conjunct Rahu/Ketu (Grahan yoga)', F.moonWithNode);
      add(drivers, 'steadiness', 'Moon conjunct Rahu/Ketu (Grahan yoga)', S.moonWithNode);
    }
    if (t.Saturn && t.Saturn.sign === moon.sign) {
      add(drivers, 'overthinking', 'Moon conjunct Saturn (Vish yoga)', WEIGHTS.moonWithSaturn);
      add(drivers, 'steadiness', 'Moon conjunct Saturn (Vish yoga)', S.moonWithSaturn);
    }
    add(drivers, 'overthinking', `Moon in house ${moon.house}`, WEIGHTS.moonHouse[moon.house]);
    add(drivers, 'steadiness', `Moon in house ${moon.house}`, S.moonHouse[moon.house]);
    if (FIXED_SIGNS.has(moon.sign)) add(drivers, 'focus', `Moon in fixed sign ${moon.sign}`, F.moonFixedSign);
    if (MOVABLE_SIGNS.has(moon.sign)) add(drivers, 'focus', `Moon in movable sign ${moon.sign}`, F.moonMovableSign);
    if (t.Mars && aspects('Mars', t.Mars.sign, moon.sign)) {
      add(drivers, 'irritability', 'Mars aspects the Moon', I.marsOnMoon);
      add(drivers, 'steadiness', 'Mars aspects the Moon', S.marsOnMoon);
    }
    if (t.Venus && t.Venus.sign === moon.sign) {
      add(drivers, 'irritability', 'Venus conjunct the Moon', I.venusWithMoon);
      add(drivers, 'steadiness', 'Venus conjunct the Moon', S.venusWithMoon);
    }
    if (nakshatraLord && NAKSHATRA_MALEFIC_LORDS.has(nakshatraLord)) {
      add(drivers, 'overthinking', `Moon in a ${nakshatraLord}-ruled nakshatra`, WEIGHTS.moonNakLordMalefic);
    }
    if (t.Jupiter && aspects('Jupiter', t.Jupiter.sign, moon.sign)) {
      add(drivers, 'overthinking', 'Jupiter aspects the Moon', WEIGHTS.jupiterOnMoon);
      add(drivers, 'irritability', 'Jupiter aspects the Moon', I.jupiterOnMoon);
      add(drivers, 'steadiness', 'Jupiter aspects the Moon', S.jupiterOnMoon);
    }
    if (t.Sun && moon.siderealLon != null && t.Sun.siderealLon != null) {
      const tithi = tithiNumber(t.Sun.siderealLon, moon.siderealLon);
      if (tithi >= 28) {
        add(drivers, 'overthinking', 'Moon near Amavasya (new moon)', WEIGHTS.nearAmavasya);
        add(drivers, 'steadiness', 'Moon near Amavasya (new moon)', S.nearAmavasya);
      }
      if (tithi >= 13 && tithi <= 15) {
        add(drivers, 'overthinking', 'Moon near Purnima (full moon)', WEIGHTS.nearPurnima);
        add(drivers, 'steadiness', 'Moon near Purnima (full moon)', S.nearPurnima);
      }
      const waxing = tithi <= 15;
      add(drivers, 'vitality', waxing ? 'Waxing Moon' : 'Waning Moon',
        waxing ? WEIGHTS.moonWaxing : WEIGHTS.moonWaning);
      add(drivers, 'steadiness', waxing ? 'Waxing Moon (paksha bala)' : 'Waning Moon (paksha bala)',
        waxing ? S.moonWaxing : S.moonWaning);
    }
  }

  if (t.Mercury) {
    if (t.Mercury.speed < 0) {
      add(drivers, 'overthinking', 'Mercury retrograde', WEIGHTS.mercuryRetrograde);
      add(drivers, 'focus', 'Mercury retrograde', F.mercuryRetrograde);
    }
    const mercuryCombust = t.Sun && t.Mercury.siderealLon != null && t.Sun.siderealLon != null
      && Math.abs(((t.Mercury.siderealLon - t.Sun.siderealLon + 540) % 360) - 180) <= 12;
    if (mercuryCombust) {
      add(drivers, 'overthinking', 'Mercury combust', WEIGHTS.mercuryCombust);
      add(drivers, 'focus', 'Mercury combust', F.mercuryCombust);
    }
    if (t.Jupiter && aspects('Jupiter', t.Jupiter.sign, t.Mercury.sign)) {
      add(drivers, 'focus', 'Jupiter aspects Mercury', F.jupiterOnMercury);
    }
    add(drivers, 'focus', `Transit Mercury in house ${t.Mercury.house}`, F.mercuryHouse[t.Mercury.house]);
  }

  if (t.Mars) {
    if (t.Saturn && t.Saturn.sign === t.Mars.sign) {
      add(drivers, 'irritability', 'Mars conjunct Saturn', I.marsWithSaturn);
    }
    if (t.Rahu && t.Rahu.sign === t.Mars.sign) {
      add(drivers, 'irritability', 'Mars conjunct Rahu (Angarak yoga)', I.marsWithRahu);
    }
    add(drivers, 'irritability', `Transit Mars in house ${t.Mars.house}`, I.marsHouse[t.Mars.house]);
  }
  if (t.Sun && ['exalted', 'own'].includes(planetDignity('Sun', t.Sun.sign))) {
    add(drivers, 'irritability', `Fiery Sun in ${t.Sun.sign}`, I.sunStrong);
  }

  for (const planet of ['Sun', 'Mars']) {
    const p = t[planet];
    if (!p) continue;
    if ([3, 6, 10, 11].includes(p.house)) {
      add(drivers, 'vitality', `Transit ${planet} in house ${p.house}`, WEIGHTS.goodHouse);
    } else if ([8, 12].includes(p.house)) {
      add(drivers, 'vitality', `Transit ${planet} in house ${p.house}`, WEIGHTS.badHouse);
    }
  }

  if (t.Saturn) {
    if (natalMoonSign && t.Saturn.sign === natalMoonSign) {
      add(drivers, 'vitality', 'Saturn transiting your natal Moon sign', WEIGHTS.saturnOnNatalMoon);
    }
    if (lagnaSign && t.Saturn.sign === lagnaSign) {
      add(drivers, 'vitality', 'Saturn transiting your Lagna sign', WEIGHTS.saturnOnLagna);
    }
  }

  // ── dasha lords ──
  for (const level of ['antardasha', 'mahadasha']) {
    const lord = dasha[level] && dasha[level].planet;
    if (!lord) continue;
    const levelName = level === 'antardasha' ? 'Antardasha' : 'Mahadasha';
    if (['Moon', 'Rahu', 'Ketu'].includes(lord)) {
      add(drivers, 'overthinking', `${levelName} of ${lord}`, WEIGHTS.dashaMoonNode[level]);
    }
    if (['Mars', 'Rahu'].includes(lord)) {
      add(drivers, 'irritability', `${levelName} of ${lord}`, I.dashaMarsRahu[level]);
    }
    const n = natal[lord];
    const state = n && planetDignity(lord, n.sign);
    if (lord === 'Mercury' && (state === 'exalted' || state === 'own')) {
      add(drivers, 'focus', `${levelName} of a strong Mercury`, F.dashaMercuryStrong[level]);
    }
    if (lord === 'Moon' && state === 'debilitated') {
      add(drivers, 'steadiness', `${levelName} of a debilitated Moon`, S.dashaMoonDebil[level]);
    }
    if (state === 'exalted' || state === 'own') {
      add(drivers, 'vitality', `${level === 'antardasha' ? 'Antardasha' : 'Mahadasha'} lord ${lord} ${state === 'own' ? 'in own sign' : 'exalted'}`,
        WEIGHTS.dashaLord[level]);
    } else if (state === 'debilitated') {
      add(drivers, 'vitality', `${level === 'antardasha' ? 'Antardasha' : 'Mahadasha'} lord ${lord} debilitated`,
        WEIGHTS.dashaLordDebil[level]);
    }
  }

  const total = metric => Math.max(0, Math.min(100, Math.round(
    BASE + drivers.filter(d => d.metric === metric).reduce((s, d) => s + d.delta, 0),
  )));
  drivers.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  return {
    overthinking: total('overthinking'),
    vitality: total('vitality'),
    focus: total('focus'),
    irritability: total('irritability'),
    steadiness: total('steadiness'),
    drivers,
  };
}

const MAX_DRIVERS_PER_DAY = 8;

function datesOfMonth(month) {
  const [year, mon] = month.split('-').map(Number);
  const days = new Date(Date.UTC(year, mon, 0)).getUTCDate();
  return Array.from({ length: days }, (_, i) => `${month}-${String(i + 1).padStart(2, '0')}`);
}

/**
 * Score every day of `month` ("YYYY-MM") for one natal chart.
 * One Python batch call yields the natal chart and each day's sidereal
 * transit positions; dasha and nakshatra are computed locally per day.
 *
 * @param {Object} birthData { birthDate, birthTime, latitude, longitude, timezone (IANA) }
 * @param {string} month
 * @param {Object} [deps]   { callBatch } — injectable for tests
 */
async function computeMonth(birthData, month, deps = {}) {
  const callBatch = deps.callBatch || require('./astrology_kerykeion_bridge').callPythonBatch;
  const { computeDashaAtDate, getNakshatra } = require('./dasha');
  const { planetMap } = require('./investment-dasha');

  const dates = datesOfMonth(month);
  const { transitPositions, natalPlanets } = await callBatch({
    birthDate: birthData.birthDate,
    birthTime: birthData.birthTime,
    latitude: birthData.latitude,
    longitude: birthData.longitude,
    timezone: birthData.timezone,
    transitDates: dates,
  });

  const natal = planetMap(natalPlanets);
  const natalMoon = natal.Moon;
  const natalMoonLon = natalMoon && natalMoon.fullDegree;
  if (natalMoonLon == null) throw new Error('Could not determine natal Moon longitude');
  const birthMoment = new Date(`${birthData.birthDate}T${birthData.birthTime}:00Z`);

  const days = dates.map(date => {
    const transit = (transitPositions || {})[date];
    if (!transit || !transit.Moon) {
      return { date, overthinking: null, vitality: null, focus: null, irritability: null, steadiness: null, drivers: [] };
    }
    const dasha = computeDashaAtDate(birthMoment, natalMoonLon, new Date(`${date}T12:00:00Z`));
    const nakshatraLord = transit.Moon.siderealLon != null ? getNakshatra(transit.Moon.siderealLon).lord : null;
    const r = scoreDay({ natal, transit, dasha, nakshatraLord });
    return {
      date,
      overthinking: r.overthinking,
      vitality: r.vitality,
      focus: r.focus,
      irritability: r.irritability,
      steadiness: r.steadiness,
      drivers: r.drivers.slice(0, MAX_DRIVERS_PER_DAY),
    };
  });

  return { month, days };
}

module.exports = { scoreDay, computeMonth, datesOfMonth, tithiNumber, neechaBhanga, WEIGHTS, BASE };
