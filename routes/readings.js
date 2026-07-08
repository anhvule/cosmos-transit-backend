const express = require('express');
const router = express.Router();
const { makeDebugHandler, makePeriodHandler } = require('./_helpers');
const { legacyLensLookup, pandaLookup } = require('../services/interpretations');

router.post('/career', makeDebugHandler(legacyLensLookup('career')));
router.post('/relationship', makeDebugHandler(legacyLensLookup('relationship')));
router.post('/advice', makeDebugHandler(legacyLensLookup('advice')));
router.post('/food', makeDebugHandler(legacyLensLookup('food')));

// ── /api/panda/* routes ──────────────────────────────────────────────
// Same kerykeion call + same response shape as the legacy routes above;
// interpretation resolves ascendant-specific text first, then the
// generic ('*') template set.
router.post('/panda/career',       makeDebugHandler(pandaLookup('career')));
router.post('/panda/relationship', makeDebugHandler(pandaLookup('relationship')));

router.post('/investment-weekly', makePeriodHandler('week', legacyLensLookup('investment')));
router.post('/investment-monthly', makePeriodHandler('month', legacyLensLookup('investment')));

module.exports = router;
