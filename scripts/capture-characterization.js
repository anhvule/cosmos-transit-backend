#!/usr/bin/env node
// Captures characterization fixtures for the unified-interpretations
// refactor: POSTs every (chart × route × date) combination against the
// in-process test app and writes the raw response bodies to
// tests/fixtures/characterization/<chart>.json.
//
// Run BEFORE the refactor to establish the baseline. Do not re-run after
// the refactor — the fixtures are the ground truth the refactor is
// compared against.

const fs = require('fs');
const path = require('path');
const { createTestApp, startTestServer } = require('../tests/helpers/test_app');
const { CHARTS, DATES, ROUTES } = require('../tests/helpers/characterization_config');

const OUT_DIR = path.join(__dirname, '..', 'tests', 'fixtures', 'characterization');

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const server = await startTestServer(createTestApp());
  try {
    for (const [chartKey, chart] of Object.entries(CHARTS)) {
      const fixture = {};
      for (const route of ROUTES) {
        fixture[route] = {};
        for (const date of DATES) {
          const { ascendant, ...body } = chart;
          const res = await server.post(route, { ...body, transitDate: date });
          if (res.status !== 200) {
            throw new Error(`${route} ${chartKey} ${date} → HTTP ${res.status}: ${JSON.stringify(res.body)}`);
          }
          fixture[route][date] = res.body;
          console.log(`captured ${chartKey} ${route} ${date}`);
        }
      }
      const outPath = path.join(OUT_DIR, `${chartKey}.json`);
      fs.writeFileSync(outPath, JSON.stringify(fixture, null, 2) + '\n');
      console.log(`wrote ${outPath}`);
    }
  } finally {
    await server.close();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
