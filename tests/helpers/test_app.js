/**
 * Minimal Express app for e2e tests: mounts reading routes under /api
 * without the production rate limiter (100 req/day would block planner runs).
 */
const http = require('http');
const express = require('express');
const readingRouter = require('../../routes/reading');

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api', readingRouter);
  return app;
}

/**
 * Start `app` on an ephemeral port, POST JSON to `path`, return
 * { status, body }. Closes the server after the response.
 *
 * Prefer startTestServer + postToServer when issuing many requests.
 */
function postJson(app, path, body) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      const data = JSON.stringify(body);
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port,
          path,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data),
          },
        },
        (res) => {
          let buf = '';
          res.on('data', (c) => { buf += c; });
          res.on('end', () => {
            server.close();
            let parsed = buf;
            try { parsed = JSON.parse(buf); } catch (_) { /* leave as string */ }
            resolve({ status: res.statusCode, body: parsed });
          });
        },
      );
      req.on('error', (err) => {
        server.close();
        reject(err);
      });
      req.write(data);
      req.end();
    });
  });
}

/**
 * Start app once; returns { port, close, post(path, body) }.
 */
function startTestServer(app) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({
        port,
        close: () => new Promise((r) => server.close(r)),
        post(path, body) {
          return new Promise((res, rej) => {
            const data = JSON.stringify(body);
            const req = http.request(
              {
                hostname: '127.0.0.1',
                port,
                path,
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Content-Length': Buffer.byteLength(data),
                },
              },
              (response) => {
                let buf = '';
                response.on('data', (c) => { buf += c; });
                response.on('end', () => {
                  let parsed = buf;
                  try { parsed = JSON.parse(buf); } catch (_) { /* leave */ }
                  res({ status: response.statusCode, body: parsed });
                });
              },
            );
            req.on('error', rej);
            req.write(data);
            req.end();
          });
        },
      });
    });
    server.on('error', reject);
  });
}

module.exports = { createTestApp, postJson, startTestServer };
