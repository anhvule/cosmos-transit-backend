const { calculateEssenceCycle, _internals } =
  require('../services/essence-cycle');

const { letterTransitAtAge, nameCycleLength } = _internals;

// "Vu Anh Le" / 1991-12-29 / start_year 2026 — canonical reference values
// confirmed against a published numerology source. Under the pre-birthday
// age convention, row.age = year - birthYear - 1, so calendar year 2026
// corresponds to age 34 (the age held from Jan 1 → Dec 28 2026, before the
// Dec 29 birthday).
//
//   First name "Vu" cycle:  V(4) U(3) V(4) U(3) ...
//     V rules ages 0-3, 7-10, 14-17, 21-24, 28-31, 35-38, ...
//     U rules ages 4-6, 11-13, 18-20, 25-27, 32-34, 39-41, ...
//
//   Middle "Anh" cycle:  A(1) N(5) H(8) A(1) N(5) H(8) ...
//     A: 0, 14, 28, 42 ...
//     N: 1-5, 15-19, 29-33, 43-47 ...
//     H: 6-13, 20-27, 34-41 ...
//
//   Last "Le" cycle:  L(3) E(5) L(3) E(5) ...
//     L: 0-2, 8-10, 16-18, 24-26, 32-34, 40-42 ...
//     E: 3-7, 11-15, 19-23, 27-31, 35-39, 43-47 ...
const VU_ANH_LE_TRANSITS = {
  34: { physical: 'U', mental: 'H', spiritual: 'L' },
  35: { physical: 'V', mental: 'H', spiritual: 'E' },
  36: { physical: 'V', mental: 'H', spiritual: 'E' },
};

describe('letterTransitAtAge', () => {
  it('returns null for age 0 (gestation / pre-influence)', () => {
    expect(letterTransitAtAge('Vu', 0)).toBe(null);
  });

  it('returns null for empty / non-letter names', () => {
    expect(letterTransitAtAge('', 5)).toBe(null);
    expect(letterTransitAtAge('   ', 5)).toBe(null);
    expect(letterTransitAtAge('123', 5)).toBe(null);
  });

  it('rules letters for exactly `value` years from the start of the cycle', () => {
    // "Vu" cycle: V(4) ages 0-3, U(3) ages 4-6, repeat at age 7.
    expect(letterTransitAtAge('Vu', 1)).toBe('V');
    expect(letterTransitAtAge('Vu', 3)).toBe('V');
    expect(letterTransitAtAge('Vu', 4)).toBe('U');
    expect(letterTransitAtAge('Vu', 6)).toBe('U');
    expect(letterTransitAtAge('Vu', 7)).toBe('V');
    expect(letterTransitAtAge('Vu', 10)).toBe('V');
    expect(letterTransitAtAge('Vu', 11)).toBe('U');
  });

  it('matches canonical Vu Anh Le transits at ages 34-36', () => {
    expect(letterTransitAtAge('Vu', 34)).toBe('U');
    expect(letterTransitAtAge('Vu', 35)).toBe('V');
    expect(letterTransitAtAge('Vu', 36)).toBe('V');

    expect(letterTransitAtAge('Anh', 34)).toBe('H');
    expect(letterTransitAtAge('Anh', 35)).toBe('H');
    expect(letterTransitAtAge('Anh', 36)).toBe('H');

    expect(letterTransitAtAge('Le', 34)).toBe('L');
    expect(letterTransitAtAge('Le', 35)).toBe('E');
    expect(letterTransitAtAge('Le', 36)).toBe('E');
  });
});

describe('nameCycleLength', () => {
  it('sums Pythagorean letter values', () => {
    expect(nameCycleLength('Vu')).toBe(7); // V(4) + U(3)
    expect(nameCycleLength('Anh')).toBe(14); // A(1) + N(5) + H(8)
    expect(nameCycleLength('Le')).toBe(8); // L(3) + E(5)
  });
});

describe('calculateEssenceCycle — Vu Anh Le 1991-12-29 / start 2026', () => {
  const result = calculateEssenceCycle({
    full_name: 'Vu Anh Le',
    dob: '1991-12-29',
    start_year: 2026,
  });

  function getYear(year) {
    return result.essence_table.find((r) => r.year === year);
  }

  function getDuality(year, period) {
    return getYear(year).dualities.find((d) => d.period === period);
  }

  it('returns the input echo and a 10-year table', () => {
    expect(result.full_name).toBe('Vu Anh Le');
    expect(result.dob).toBe('1991-12-29');
    expect(result.start_year).toBe(2026);
    expect(result.essence_table).toHaveLength(10);
  });

  it('rows 2026-2028 carry the canonical transit letters', () => {
    for (const row of result.essence_table) {
      const expected = VU_ANH_LE_TRANSITS[row.age];
      if (!expected) continue;
      expect({
        age: row.age,
        ...row.transits,
      }).toEqual({ age: row.age, ...expected });
    }
  });

  it('emits the canonical essence numbers for ages 34-36', () => {
    expect(getYear(2026).essence_number).toBe(5);
    expect(getYear(2027).essence_number).toBe(8);
    expect(getYear(2028).essence_number).toBe(8);
  });

  it('emits the canonical personal years for 2026-2027', () => {
    expect(getYear(2026).personal_year).toBe(6);
    expect(getYear(2027).personal_year).toBe(7);
  });

  // Reference:
  //   Pre-bday  2026 → essence 5, PY 6
  //   Post-bday 2026 → essence 8, PY 6
  //   Pre-bday  2027 → essence 8, PY 7
  // (Shifted convention: pre-bday year Y carries this row's essence;
  // post-bday year Y carries next age's essence.)
  it('produces the shifted dualities for 2026', () => {
    const before = getDuality(2026, 'before_birthday');
    const after = getDuality(2026, 'after_birthday');
    expect(before).toBeDefined();
    expect(after).toBeDefined();
    expect(before.essence_number).toBe(5);
    expect(before.personal_year).toBe(6);
    expect(after.essence_number).toBe(8);
    expect(after.personal_year).toBe(6);
  });

  it('produces the shifted dualities for 2027', () => {
    const before = getDuality(2027, 'before_birthday');
    expect(before).toBeDefined();
    expect(before.essence_number).toBe(8);
    expect(before.personal_year).toBe(7);
  });
});
