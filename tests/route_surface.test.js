const router = require('../routes/reading');

function registeredPaths(method) {
  return router.stack
    .filter((layer) => layer.route && layer.route.methods[method])
    .map((layer) => layer.route.path)
    .sort();
}

const KEEP_POST = [
  '/advice',
  '/career',
  '/caution-dates',
  '/dasha',
  '/dasha-range',
  '/essence-cycle',
  '/favourites',
  '/food',
  '/investment-monthly',
  '/investment-weekly',
  '/market-signal',
  '/market-signal-weekly',
  '/monthly-prediction',
  '/panda/career',
  '/panda/relationship',
  '/relationship',
  '/wealth-analysis',
  '/yearly-summary',
].sort();

const KEEP_GET = ['/favourites'];
const KEEP_DELETE = ['/favourites/:id'];

const REMOVE_POST = [
  '/reading',
  '/debug',
  '/investment',
  '/network',
  '/engineering',
  '/gain',
  '/loss',
  '/panda/investment',
  '/panda/advice',
  '/panda/food',
  '/panda/gain',
  '/panda/loss',
  '/events-calendar',
  '/investment-loss-days',
  '/investment-gain-days',
];

describe('API route surface', () => {
  test('registers exactly the live POST routes', () => {
    expect(registeredPaths('post')).toEqual(KEEP_POST);
  });

  test('registers live GET favourites', () => {
    expect(registeredPaths('get')).toEqual(KEEP_GET);
  });

  test('registers live DELETE favourites/:id', () => {
    expect(registeredPaths('delete')).toEqual(KEEP_DELETE);
  });

  test('does not register removed POST routes', () => {
    const posts = new Set(registeredPaths('post'));
    for (const path of REMOVE_POST) {
      expect(posts.has(path)).toBe(false);
    }
  });
});
