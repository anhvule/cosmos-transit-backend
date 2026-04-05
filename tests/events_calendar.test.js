/**
 * Integration tests for getMatchingDatesForMonth (events-calendar endpoint).
 *
 * These tests call the real Python kerykeion batch process, so each suite
 * runs a single batch and shares it across individual assertions.
 *
 * Timeout: 3 minutes per suite (Python ephemeris calc for 30+ days).
 */

const { getMatchingDatesForMonth } = require('../services/astrology_kerykeion_bridge');

// Birth data shared across all suites
const JACK = {
  birthDate: '1991-12-29',
  birthTime: '13:30',
  latitude: 10.7765713,
  longitude: 106.7012093,
  timezone: 'Asia/Ho_Chi_Minh',
};

const BATCH_TIMEOUT = 180_000; // 3 minutes

// ─── Mars aspect Sun in 9th house — August 2026 ──────────────────────────────

describe('Mars aspect Sun in 9th house — August 2026', () => {
  let result;

  beforeAll(async () => {
    result = await getMatchingDatesForMonth(
      JACK,
      '2026-08',
      ['Mars aspect Sun in 9th house'],
    );
  }, BATCH_TIMEOUT);

  it('returns exactly 3 milestone dates', () => {
    expect(result).toHaveLength(3);
  });

  it(':Starts fires only on 2026-08-20', () => {
    const starts = result.filter(d => d.events.some(e => e.endsWith(': Starts')));
    expect(starts).toHaveLength(1);
    expect(starts[0].date).toBe('2026-08-20');
    expect(starts[0].events).toContain('Mars aspect Sun in 9th house : Starts');
  });

  it(':Exact fires only on 2026-08-23', () => {
    const exact = result.filter(d => d.events.some(e => e.endsWith(': Exact')));
    expect(exact).toHaveLength(1);
    expect(exact[0].date).toBe('2026-08-23');
    expect(exact[0].events).toContain('Mars aspect Sun in 9th house : Exact');
  });

  it(':Ends fires only on 2026-08-26', () => {
    const ends = result.filter(d => d.events.some(e => e.endsWith(': Ends')));
    expect(ends).toHaveLength(1);
    expect(ends[0].date).toBe('2026-08-26');
    expect(ends[0].events).toContain('Mars aspect Sun in 9th house : Ends');
  });
});

// ─── Jupiter aspect Mercury in 8th house — September 2026 ────────────────────

describe('Jupiter aspect Mercury in 8th house — September 2026', () => {
  let result;

  beforeAll(async () => {
    result = await getMatchingDatesForMonth(
      JACK,
      '2026-09',
      ['Jupiter aspect Mercury in 8th house'],
    );
  }, BATCH_TIMEOUT);

  it('returns exactly 2 milestone dates (:Exact + :Ends; :Starts was in August)', () => {
    expect(result).toHaveLength(2);
  });

  it('does not re-fire :Starts in September (seeded from August baseline)', () => {
    // :Starts occurred in August; the September baseline (Aug 31) already has
    // it active, so it must not re-appear in September.
    const starts = result.filter(d => d.events.some(e => e.endsWith(': Starts')));
    expect(starts).toHaveLength(0);
  });

  it(':Exact fires only on 2026-09-09', () => {
    const exact = result.filter(d => d.events.some(e => e.endsWith(': Exact')));
    expect(exact).toHaveLength(1);
    expect(exact[0].date).toBe('2026-09-09');
    expect(exact[0].events).toContain('Jupiter aspect Mercury in 8th house : Exact');
  });

  it(':Ends fires only on 2026-09-24', () => {
    const ends = result.filter(d => d.events.some(e => e.endsWith(': Ends')));
    expect(ends).toHaveLength(1);
    expect(ends[0].date).toBe('2026-09-24');
    expect(ends[0].events).toContain('Jupiter aspect Mercury in 8th house : Ends');
  });
});

// ─── Jupiter aspect Mercury in 8th house — August 2026 ───────────────────────

describe('Jupiter aspect Mercury in 8th house — August 2026', () => {
  let result;

  beforeAll(async () => {
    result = await getMatchingDatesForMonth(
      JACK,
      '2026-08',
      ['Jupiter aspect Mercury in 8th house'],
    );
  }, BATCH_TIMEOUT);

  it(':Starts fires only on 2026-08-26', () => {
    const starts = result.filter(d => d.events.some(e => e.endsWith(': Starts')));
    expect(starts).toHaveLength(1);
    expect(starts[0].date).toBe('2026-08-26');
    expect(starts[0].events).toContain('Jupiter aspect Mercury in 8th house : Starts');
  });

  it('does not fire :Exact or :Ends in August', () => {
    const exact = result.filter(d => d.events.some(e => e.endsWith(': Exact')));
    const ends = result.filter(d => d.events.some(e => e.endsWith(': Ends')));
    expect(exact).toHaveLength(0);
    expect(ends).toHaveLength(0);
  });
});

// ─── Jupiter aspect Saturn in 10th house — July 2026 ─────────────────────────

describe('Jupiter aspect Saturn in 10th house — July 2026', () => {
  let result;

  beforeAll(async () => {
    result = await getMatchingDatesForMonth(
      JACK,
      '2026-07',
      ['Jupiter aspect Saturn in 10th house'],
    );
  }, BATCH_TIMEOUT);

  it('returns exactly 2 milestone dates', () => {
    expect(result).toHaveLength(2);
  });

  it(':Starts fires only on 2026-07-14', () => {
    const starts = result.filter(d => d.events.some(e => e.endsWith(': Starts')));
    expect(starts).toHaveLength(1);
    expect(starts[0].date).toBe('2026-07-14');
    expect(starts[0].events).toContain('Jupiter aspect Saturn in 10th house : Starts');
  });

  it(':Exact fires only on 2026-07-28', () => {
    const exact = result.filter(d => d.events.some(e => e.endsWith(': Exact')));
    expect(exact).toHaveLength(1);
    expect(exact[0].date).toBe('2026-07-28');
    expect(exact[0].events).toContain('Jupiter aspect Saturn in 10th house : Exact');
  });

  it('does not fire :Ends in July (aspect continues into August)', () => {
    const ends = result.filter(d => d.events.some(e => e.endsWith(': Ends')));
    expect(ends).toHaveLength(0);
  });
});
