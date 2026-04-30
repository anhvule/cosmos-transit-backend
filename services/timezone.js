// API-boundary timezone resolver.
//
// The public API now accepts a numeric UTC offset for `timezone` (e.g. 7,
// +8, -5, "5"), while the downstream Python kerykeion / pytz code still
// expects an IANA timezone string. This helper bridges the two: it parses
// the numeric input and emits the corresponding IANA fixed-offset zone.
//
// IANA's Etc/GMT zones use INVERTED signs relative to UTC offset, so
// Etc/GMT-7 means UTC+7 (Vietnam, Thailand) and Etc/GMT+5 means UTC-5.
// Reference: https://en.wikipedia.org/wiki/Tz_database#Area
//
// IANA strings (e.g. "Asia/Ho_Chi_Minh") are passed through unchanged so
// internal callers and tests that already use IANA keep working.

class TimezoneError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TimezoneError';
    this.code = 'INVALID_TIMEZONE';
  }
}

/**
 * Resolve an API timezone input to an IANA timezone string.
 *
 * Accepts:
 *   - undefined / null / "" → returns undefined (caller falls back to default)
 *   - number (e.g. 7, -5)   → "Etc/GMT-7" / "Etc/GMT+5"
 *   - numeric string ("+7", "-05", "8") → same as above
 *   - IANA string with "/" (e.g. "Asia/Ho_Chi_Minh") → passed through
 *
 * Throws TimezoneError on:
 *   - Non-numeric / non-IANA string
 *   - Numeric offset out of range [-12, 14]
 *   - Fractional hours (e.g. 5.5) — Etc/GMT only supports integer hours
 */
function resolveTimezone(input) {
  if (input == null || input === '') return undefined;

  // Pass IANA strings through unchanged.
  if (typeof input === 'string' && input.includes('/')) return input;

  // Coerce numeric input. Strip a leading '+' so "+7" parses cleanly.
  const raw = typeof input === 'string' ? input.trim().replace(/^\+/, '') : input;
  const num = Number(raw);
  if (!Number.isFinite(num)) {
    throw new TimezoneError(
      `Invalid timezone: expected a numeric UTC offset (e.g. 7, +8, -5) or an IANA name, got ${JSON.stringify(input)}`,
    );
  }
  if (!Number.isInteger(num)) {
    throw new TimezoneError(
      `Fractional UTC offsets are not supported yet: ${num}. Use an integer between -12 and 14.`,
    );
  }
  if (num < -12 || num > 14) {
    throw new TimezoneError(
      `UTC offset ${num} is out of range. Valid range is -12 to 14.`,
    );
  }

  if (num === 0) return 'UTC';
  return num > 0 ? `Etc/GMT-${num}` : `Etc/GMT+${Math.abs(num)}`;
}

module.exports = { resolveTimezone, TimezoneError };
