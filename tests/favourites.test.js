const Database = require('better-sqlite3');
const {
  createFavouritesService,
  isISODate,
  TITLE_MAX,
  DESC_MAX,
} = require('../services/favourites');

function freshService() {
  // ":memory:" gives every test an isolated SQLite — no on-disk state, no
  // cross-test bleed.
  const db = new Database(':memory:');
  return createFavouritesService(db);
}

describe('isISODate', () => {
  test.each([
    ['2025-04-28', true],
    ['1991-12-29', true],
    ['2025-13-01', false], // bad month
    ['2025-02-30', false], // not a real day
    ['25-04-28',   false], // wrong format
    ['2025/04/28', false],
    ['',           false],
    [null,         false],
  ])('%s → %s', (input, expected) => {
    expect(isISODate(input)).toBe(expected);
  });
});

describe('Favourites — create', () => {
  test('persists a row and returns it with id, timestamp and trimmed text', () => {
    const svc = freshService();
    const fav = svc.create({
      userKey: 'device-A',
      transitDate: '2025-12-25',
      title: '  Christmas conjunction  ',
      description: '  Saturn-Jupiter sextile, journaled at midnight.  ',
    });
    expect(fav.id).toEqual(expect.any(Number));
    expect(fav.userKey).toBe('device-A');
    expect(fav.transitDate).toBe('2025-12-25');
    expect(fav.title).toBe('Christmas conjunction');
    expect(fav.description).toBe('Saturn-Jupiter sextile, journaled at midnight.');
    expect(fav.createdAt).toEqual(expect.any(String)); // SQLite CURRENT_TIMESTAMP
  });

  test('null title is preserved as null (not "")', () => {
    const svc = freshService();
    const fav = svc.create({
      userKey: 'd', transitDate: '2025-01-01', description: 'just a note',
    });
    expect(fav.title).toBeNull();
  });

  test('truncates over-long title and description to MAX', () => {
    const svc = freshService();
    const fav = svc.create({
      userKey: 'd',
      transitDate: '2025-01-01',
      title: 'x'.repeat(TITLE_MAX + 50),
      description: 'y'.repeat(DESC_MAX + 50),
    });
    expect(fav.title.length).toBe(TITLE_MAX);
    expect(fav.description.length).toBe(DESC_MAX);
  });

  test.each([
    [{ userKey: '',         transitDate: '2025-01-01', description: 'x' }, /userKey/],
    [{ userKey: 'd',        transitDate: '',           description: 'x' }, /transitDate/],
    [{ userKey: 'd',        transitDate: '2025-13-01', description: 'x' }, /transitDate/],
    [{ userKey: 'd',        transitDate: '2025-01-01' /* no desc */ },     /description/],
  ])('rejects invalid input: %p', (payload, msgPattern) => {
    const svc = freshService();
    expect(() => svc.create(payload)).toThrow(msgPattern);
  });
});

describe('Favourites — list', () => {
  test('returns rows for the given userKey, sorted by transitDate desc', () => {
    const svc = freshService();
    svc.create({ userKey: 'A', transitDate: '2025-01-01', description: 'first' });
    svc.create({ userKey: 'A', transitDate: '2025-12-31', description: 'last' });
    svc.create({ userKey: 'A', transitDate: '2025-06-15', description: 'middle' });

    const rows = svc.list('A');
    expect(rows.map(r => r.transitDate)).toEqual([
      '2025-12-31', '2025-06-15', '2025-01-01',
    ]);
  });

  test('isolates rows by userKey (device A cannot see device B)', () => {
    const svc = freshService();
    svc.create({ userKey: 'A', transitDate: '2025-01-01', description: 'mine' });
    svc.create({ userKey: 'B', transitDate: '2025-01-02', description: 'yours' });

    expect(svc.list('A').map(r => r.description)).toEqual(['mine']);
    expect(svc.list('B').map(r => r.description)).toEqual(['yours']);
  });

  test('empty userKey returns []', () => {
    const svc = freshService();
    expect(svc.list('')).toEqual([]);
    expect(svc.list(null)).toEqual([]);
  });
});

describe('Favourites — remove', () => {
  test('deletes the row when userKey matches', () => {
    const svc = freshService();
    const fav = svc.create({ userKey: 'A', transitDate: '2025-01-01', description: 'x' });
    expect(svc.remove({ id: fav.id, userKey: 'A' })).toBe(true);
    expect(svc.list('A')).toEqual([]);
  });

  test('refuses to delete another userKey’s row', () => {
    const svc = freshService();
    const fav = svc.create({ userKey: 'A', transitDate: '2025-01-01', description: 'x' });
    expect(svc.remove({ id: fav.id, userKey: 'B' })).toBe(false);
    expect(svc.list('A')).toHaveLength(1);
  });

  test('returns false for a missing id', () => {
    const svc = freshService();
    expect(svc.remove({ id: 99999, userKey: 'A' })).toBe(false);
  });

  test('rejects invalid input gracefully (no throw)', () => {
    const svc = freshService();
    expect(svc.remove({ id: 'not a number', userKey: 'A' })).toBe(false);
    expect(svc.remove({ id: 1, userKey: '' })).toBe(false);
  });
});
