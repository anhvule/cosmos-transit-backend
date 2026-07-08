// Composes the /api route modules. server.js mounts this at /api.
const express = require('express');
const router = express.Router();

for (const mod of ['./readings', './dasha', './market', './insights', './favourites']) {
  const sub = require(mod);
  for (const layer of sub.stack) router.stack.push(layer);
}

module.exports = router;
