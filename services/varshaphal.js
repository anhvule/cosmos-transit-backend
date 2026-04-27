/**
 * Varshaphal (Tajika annual horoscope) — Node side.
 *
 * Calls services/varshaphal.py for raw chart + Sarvashtavarga data, then applies
 * Tajika favourable/unfavourable rules to produce the "Combined effect of factors
 * analysed" summary that the Yearly.docx reference report renders.
 */

const { execFile } = require('child_process');
const path = require('path');

const PYTHON_SCRIPT = path.join(__dirname, 'varshaphal.py');
const PYTHON_BIN = process.env.PYTHON_BIN || 'python3';

const SIGN_RULERS = {
  Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury',
  Cancer: 'Moon', Leo: 'Sun', Virgo: 'Mercury',
  Libra: 'Venus', Scorpio: 'Mars', Sagittarius: 'Jupiter',
  Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter',
};

// Vedic-style classification used to evaluate planet effect by annual-chart house.
//   benefics ⇒ favourable in 1,2,3,4,5,7,9,10,11; unfavourable in 6,8,12
//   malefics ⇒ favourable in 3,6,10,11 (upachaya); unfavourable elsewhere
// Rahu/Ketu treated as malefics. Reproduces every row in the docx's
// "Summary of effects of planets in houses" table.
const BENEFICS = new Set(['Moon', 'Mercury', 'Jupiter', 'Venus']);
const FAV_BENEFIC_HOUSES = new Set([1, 2, 3, 4, 5, 7, 9, 10, 11]);
const FAV_MALEFIC_HOUSES = new Set([3, 6, 10, 11]);

function planetEffect(name, house) {
  const fav = BENEFICS.has(name) ? FAV_BENEFIC_HOUSES : FAV_MALEFIC_HOUSES;
  return fav.has(house) ? 'Favourable' : 'Unfavourable';
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

// Muntha/Munthesh/Birth Lagna favourable houses (per Tajika tradition).
// Kendra (1,4,7,10), Trikona (1,5,9), Upachaya (3,11) — minus 4 and 7
// for Muntha specifically (per classical exception).
const MUNTHA_FAV_HOUSES = new Set([1, 2, 3, 5, 9, 10, 11]);
const BIRTH_LAGNA_FAV_HOUSES = new Set([1, 2, 4, 5, 7, 9, 10, 11]);

function munthaEffect(house) {
  return MUNTHA_FAV_HOUSES.has(house) ? 'Favourable' : 'Unfavourable';
}

function munthaLordEffect(house) {
  return MUNTHA_FAV_HOUSES.has(house) ? 'Favourable' : 'Unfavourable';
}

function birthLagnaEffect(houseInAnnual) {
  return BIRTH_LAGNA_FAV_HOUSES.has(houseInAnnual) ? 'Favourable' : 'Unfavourable';
}

/**
 * Pick the Varsheshwara (Lord of the Year) from the three deterministic
 * Tajika candidates we can compute without Vimsopaka Bala:
 *   1. Varsha Lagna Lord (lord of annual ascendant)
 *   2. Muntha Lord
 *   3. Birth Lagna Lord (Janma Lagnesh)
 *
 * Score = the candidate's annual-chart house, mapped to a strength integer
 * (kendra/trikona/upachaya = +5, neutral = +3, dushtana = -2). Ties are
 * broken by the ordering above (Varsha Lagnesh > Muntha Lord > Janma Lagnesh),
 * mirroring the classical priority when strength is equal.
 */
const VARSHESHWARA_HOUSE_SCORE = {
  1: 5, 2: 5, 3: 5, 4: 3, 5: 3, 7: 3, 9: 3, 10: 5, 11: 5, 6: -2, 8: -2, 12: -2,
};

function pickVarsheshwara(annualChart, muntha) {
  const planetByName = Object.fromEntries(annualChart.planets.map(p => [p.name, p]));

  const candidates = [
    { role: 'Varsha Lagna Lord', planet: SIGN_RULERS[annualChart.lagna] },
    { role: 'Muntha Lord',       planet: muntha.lord },
    { role: 'Birth Lagna Lord',  planet: SIGN_RULERS[annualChart.birthLagna] },
  ].map(c => {
    const p = planetByName[c.planet];
    const house = p ? p.house : null;
    return {
      ...c,
      house,
      sign: p ? p.sign : null,
      score: house != null ? (VARSHESHWARA_HOUSE_SCORE[house] ?? 0) : -99,
    };
  });

  // Stable max — first in array wins on ties.
  let winner = candidates[0];
  for (const c of candidates.slice(1)) {
    if (c.score > winner.score) winner = c;
  }

  // Effect: house score ≥ 3 ⇒ Favourable.
  const effect = winner.score >= 3 ? 'Favourable' : 'Unfavourable';

  return { ...winner, effect, candidates };
}

function planetsInHousesEffects(annualChart) {
  // The docx report classifies the 9 graha (7 planets + Rahu + Ketu).
  const TARGETS = ['Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Rahu', 'Ketu'];
  const planetByName = Object.fromEntries(annualChart.planets.map(p => [p.name, p]));
  const rows = [];
  let favCount = 0;
  for (const name of TARGETS) {
    const p = planetByName[name];
    if (!p) continue;
    const effect = planetEffect(name, p.house);
    if (effect === 'Favourable') favCount += 1;
    rows.push({ planet: name, sign: p.sign, house: p.house, effect });
  }
  const overall = favCount * 2 >= rows.length ? 'Favourable' : 'Unfavourable';
  return { rows, overall };
}

function combinedEffect(varshaphalRaw) {
  const { annualChart, muntha } = varshaphalRaw;

  const munthaFactor = {
    factor: 'Muntha',
    detail: `Muntha in ${annualChart.lagna ? muntha.signVedic : muntha.sign} (${ordinal(muntha.house)} house of annual chart)`,
    house: muntha.house,
    effect: munthaEffect(muntha.house),
  };

  const munthaLordFactor = {
    factor: 'Muntha Lord',
    detail: `${muntha.lord} (lord of ${muntha.signVedic}) in ${ordinal(muntha.lordHouseInAnnual)} house of annual chart`,
    house: muntha.lordHouseInAnnual,
    effect: munthaLordEffect(muntha.lordHouseInAnnual),
  };

  const varsheshwara = pickVarsheshwara(annualChart, muntha);
  const varsheshwaraFactor = {
    factor: 'Varsheshwara',
    detail: `${varsheshwara.planet} (${varsheshwara.role}) in ${ordinal(varsheshwara.house)} house of annual chart`,
    house: varsheshwara.house,
    effect: varsheshwara.effect,
  };

  const birthLagnaFactor = {
    factor: 'Birth Lagna',
    detail: `Birth Lagna ${annualChart.birthLagnaVedic} in ${ordinal(annualChart.birthLagnaHouseInAnnual)} house of annual chart`,
    house: annualChart.birthLagnaHouseInAnnual,
    effect: birthLagnaEffect(annualChart.birthLagnaHouseInAnnual),
  };

  const planetsSummary = planetsInHousesEffects(annualChart);
  const planetsFactor = {
    factor: 'Planets in Houses',
    detail: `${planetsSummary.rows.filter(r => r.effect === 'Favourable').length} favourable / ${planetsSummary.rows.length} total`,
    rows: planetsSummary.rows,
    effect: planetsSummary.overall,
  };

  const factors = [
    munthaFactor,
    munthaLordFactor,
    varsheshwaraFactor,
    birthLagnaFactor,
    planetsFactor,
  ];

  const favCount = factors.filter(f => f.effect === 'Favourable').length;
  const overall = favCount * 2 >= factors.length ? 'Favourable' : 'Unfavourable';

  return {
    factors,
    overallEffect: overall,
    varsheshwara: {
      planet: varsheshwara.planet,
      role: varsheshwara.role,
      sign: varsheshwara.sign,
      house: varsheshwara.house,
      candidates: varsheshwara.candidates,
    },
  };
}

/**
 * Spawn services/varshaphal.py in the requested mode and return the parsed
 * stdout JSON.
 */
function callPython(mode, payload) {
  return new Promise((resolve, reject) => {
    const child = execFile(
      PYTHON_BIN,
      [PYTHON_SCRIPT, mode],
      { timeout: 30000, maxBuffer: 4 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          return reject(new Error(`Varshaphal python failed: ${stderr || error.message}`));
        }
        try {
          const result = JSON.parse(stdout.trim());
          if (result.error) return reject(new Error(`Varshaphal error: ${result.error}`));
          resolve(result);
        } catch (e) {
          reject(new Error(`Failed to parse varshaphal stdout: ${stdout.slice(0, 200)}`));
        }
      },
    );
    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });
}

async function getYearlySummary(birthData, year) {
  const payload = {
    birthDate: birthData.birthDate,
    birthTime: birthData.birthTime,
    latitude: birthData.latitude,
    longitude: birthData.longitude,
    timezone: birthData.timezone || 'Asia/Ho_Chi_Minh',
    year,
  };
  const raw = await callPython('--varshaphal', payload);
  const combined = combinedEffect(raw);
  return {
    year,
    tajikaYear: raw.varshapravesh.tajikaYear,
    varshapravesh: raw.varshapravesh.datetime,
    annualChart: raw.annualChart,
    muntha: raw.muntha,
    sarvashtavarga: raw.sarvashtavarga,
    ...combined,
  };
}

async function getMonthlyRaw(birthData, year) {
  const payload = {
    birthDate: birthData.birthDate,
    birthTime: birthData.birthTime,
    latitude: birthData.latitude,
    longitude: birthData.longitude,
    timezone: birthData.timezone || 'Asia/Ho_Chi_Minh',
    year,
  };
  return callPython('--monthly', payload);
}

module.exports = {
  getYearlySummary,
  getMonthlyRaw,
  combinedEffect,
  planetEffect,
  munthaEffect,
  munthaLordEffect,
  birthLagnaEffect,
  pickVarsheshwara,
};
