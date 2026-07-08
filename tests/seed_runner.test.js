const { execFileSync } = require('child_process');
const Database = require('better-sqlite3');
const fs = require('fs');
const os = require('os');
const path = require('path');

const SEED_JS = path.join(__dirname, '..', 'scripts', 'seed.js');

function runSeed(dbPath, seedsDir, extraArgs = []) {
  return execFileSync(
    process.execPath,
    [SEED_JS, `--db=${dbPath}`, `--seeds-dir=${seedsDir}`, ...extraArgs],
    { encoding: 'utf8' },
  );
}

function dumpRows(dbPath) {
  const db = new Database(dbPath, { readonly: true });
  const rows = db.prepare(`
    SELECT id, ascendant, lens, kind, transit_planet, natal_planet,
           target_house, target_angle, special_label, lord_house, phase,
           display_name, description
    FROM interpretations
    ORDER BY ascendant, lens, kind, transit_planet, natal_planet,
             target_house, target_angle, special_label, lord_house, phase
  `).all();
  db.close();
  return rows;
}

describe('scripts/seed.js', () => {
  let tmp;
  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'seed-test-'));
    const globalDir = path.join(tmp, 'seeds', '_global');
    const capDir = path.join(tmp, 'seeds', 'capricorn');
    fs.mkdirSync(globalDir, { recursive: true });
    fs.mkdirSync(capDir, { recursive: true });
    fs.writeFileSync(path.join(globalDir, 'career.json'), JSON.stringify([
      {
        kind: 'aspect', transit_planet: 'Mars', natal_planet: 'Venus',
        phase: 'exact', display_name: 'Mars aspect Venus : Exact',
        description: 'generic mars-venus',
      },
    ]));
    fs.writeFileSync(path.join(capDir, 'career.json'), JSON.stringify([
      {
        kind: 'aspect', transit_planet: 'Mars', natal_planet: 'Venus',
        phase: 'exact', display_name: 'Mars aspect Venus in 9th house : Exact',
        description: 'capricorn mars-venus',
      },
      {
        kind: 'ruler', lord_house: 1, target_house: 8, phase: 'window',
        display_name: 'Saturn ruler of the 1st House in the 8th House',
        description: 'capricorn ruler',
      },
    ]));
  });
  afterEach(() => { fs.rmSync(tmp, { recursive: true, force: true }); });

  test('seeds all files with correct ascendant mapping', () => {
    const dbPath = path.join(tmp, 'test.db');
    runSeed(dbPath, path.join(tmp, 'seeds'));
    const rows = dumpRows(dbPath);
    expect(rows.length).toBe(3);
    expect(rows.map((r) => r.ascendant).sort()).toEqual(['*', 'Capricorn', 'Capricorn']);
    const generic = rows.find((r) => r.ascendant === '*');
    expect(generic.lens).toBe('career');
    expect(generic.description).toBe('generic mars-venus');
    expect(generic.target_house).toBe(0);
  });

  test('is idempotent: second run yields identical table contents', () => {
    const dbPath = path.join(tmp, 'test.db');
    runSeed(dbPath, path.join(tmp, 'seeds'));
    const first = dumpRows(dbPath);
    runSeed(dbPath, path.join(tmp, 'seeds'));
    const second = dumpRows(dbPath);
    expect(second).toEqual(first);
  });

  test('re-seeding after a description edit updates the row in place', () => {
    const dbPath = path.join(tmp, 'test.db');
    runSeed(dbPath, path.join(tmp, 'seeds'));
    const before = dumpRows(dbPath);
    const capFile = path.join(tmp, 'seeds', 'capricorn', 'career.json');
    const entries = JSON.parse(fs.readFileSync(capFile, 'utf8'));
    entries[0].description = 'capricorn mars-venus v2';
    fs.writeFileSync(capFile, JSON.stringify(entries));
    runSeed(dbPath, path.join(tmp, 'seeds'));
    const after = dumpRows(dbPath);
    expect(after.length).toBe(before.length);
    const updated = after.find((r) => r.ascendant === 'Capricorn' && r.kind === 'aspect');
    expect(updated.description).toBe('capricorn mars-venus v2');
    expect(updated.id).toBe(before.find((r) => r.ascendant === 'Capricorn' && r.kind === 'aspect').id);
  });

  test('--ascendant and --lens filters restrict what is seeded', () => {
    const dbPath = path.join(tmp, 'test.db');
    runSeed(dbPath, path.join(tmp, 'seeds'), ['--ascendant=Capricorn']);
    expect(dumpRows(dbPath).every((r) => r.ascendant === 'Capricorn')).toBe(true);

    const dbPath2 = path.join(tmp, 'test2.db');
    runSeed(dbPath2, path.join(tmp, 'seeds'), ['--lens=career']);
    expect(dumpRows(dbPath2).length).toBe(3);
  });

  test('rejects unknown lens filenames and malformed entries', () => {
    const badDir = path.join(tmp, 'seeds', 'taurus');
    fs.mkdirSync(badDir, { recursive: true });
    fs.writeFileSync(path.join(badDir, 'nonsense.json'), '[]');
    const dbPath = path.join(tmp, 'test.db');
    expect(() => runSeed(dbPath, path.join(tmp, 'seeds'))).toThrow();
  });
});
