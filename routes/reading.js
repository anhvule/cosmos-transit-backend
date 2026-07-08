// Compatibility re-export: the monolith was split into routes/{readings,
// dasha,market,insights,favourites}.js composed by routes/index.js.
// Kept so existing requires (tests, server bootstrap history) keep working.
module.exports = require('./index');
