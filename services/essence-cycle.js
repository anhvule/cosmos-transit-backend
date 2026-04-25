/**
 * Essence Cycle (10-Year Table) — classical Western (Pythagorean) numerology.
 *
 * Three transit streams run in parallel from age 1 onward (age 0 is the
 * pre-influence / gestation phase):
 *   - physical  ← first  name letters (action, health, body)
 *   - mental    ← middle name letters (mind, creativity, ideas)
 *   - spiritual ← last   name letters (soul lessons, karmic refinement)
 *
 * Each letter rules for a number of years equal to its Pythagorean value
 * (A/J/S = 1, B/K/T = 2, …). Once the cycle of a name completes, it loops.
 *
 * Essence Number = reduceToSingleOrMaster(physical + mental + spiritual).
 * Personal Year   = reduce(month) + reduce(day) + reduce(year) → reduce.
 *
 * Master numbers (11 / 22 / 33) are preserved during reduction.
 */

// ── Pythagorean letter values ───────────────────────────────────────────────
const LETTER_VALUES = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

// ── Per-essence-number lookup tables ────────────────────────────────────────
const ESSENCE_KEYWORDS = {
  1: 'The Cosmic Initiator',
  2: 'The Sacred Diplomat',
  3: 'The Joyful Creator',
  4: 'The Master Builder',
  5: 'The Quantum Catalyst',
  6: 'The Cosmic Nurturer',
  7: 'The Mystical Sage',
  8: 'The Empowered Sovereign',
  9: 'The Compassionate Humanitarian',
  11: 'The Intuitive Visionary',
  22: 'The Master Architect',
  33: 'The Compassionate Master Teacher',
};

const ESSENCE_MEANINGS = {
  1: 'Initiation, independence, and self-generated momentum. A year of planting seeds of identity through bold action and unwavering self-trust.',
  2: 'Partnership, patience, and quiet diplomacy. A year of building bridges, listening deeply, and letting cooperation outpace force.',
  3: 'Creative expression, joy, and social radiance. A year of speaking, creating, and letting playful self-disclosure draw the right people in.',
  4: 'Discipline, structure, and methodical effort. A year of building lasting foundations through honest work and unglamorous consistency.',
  5: 'Change, freedom, and adventurous expansion. A year of pivots, travel, and saying yes to the experiences that stretch your sense of what is possible.',
  6: 'Compassion, responsibility, and devotion to home and community. A year of nurturing, mending, and creating sanctuaries where everyone feels seen.',
  7: 'Introspection, study, and spiritual inquiry. A year of withdrawing into stillness so the soul’s quieter voice can finally be heard.',
  8: 'Authority, ambition, and material mastery. A year of stewarding power with integrity and turning long effort into tangible results.',
  9: 'Completion, release, and humanitarian service. A year of letting old chapters end so wider acts of generosity can begin.',
  11: 'Spiritual illumination and visionary insight. A year when intuition runs ahead of logic and your inner light asks to be lived publicly.',
  22: 'Master building on a global scale. A year of converting visionary blueprints into structures that outlast the maker.',
  33: 'Compassionate teaching and devotional service. A year when love and wisdom merge into healing offered freely to the world.',
};

const ESSENCE_DETAILED_MEANINGS = {
  1: 'Your Essence Cycle 1 thrusts you into a season of beginnings, leadership, and self-defined direction—where the path forward must be carved by your own hands, not borrowed from another’s map. This is a year to start, decide, claim, or simply step forward into what only you can pioneer, often discovering that hesitation costs more than mistakes ever could. You may feel called to launch a project, end a dependency, or assert a long-suppressed aspect of who you are, and the cosmos will mirror that courage with unexpected support. However, this energy may challenge you with isolation, premature action without strategy, or stubbornness that masquerades as self-trust. Karmically, your soul is learning that true sovereignty is not separation from others but the unshakable knowing of your own center—so that connection becomes choice, not need. Your greatest alignment comes from initiating with discernment—asking \'Is this mine to lead?\' before charging forward, and accepting that solitude is sometimes the price of authenticity. Guard against ego inflation by remembering that being first is not the same as being right; lead by example, not by edict. When fully embodied, Essence 1 becomes a torch for others—proving that the bravest act is to walk an untrodden path while still leaving the door open for those ready to follow.',
  2: 'Your Essence Cycle 2 invites you into a season of partnership, patience, and the quiet power of diplomacy—where the loudest voice rarely wins, and the steady ear changes everything. This is a year to listen, mediate, collaborate, or simply hold space for the slow unfolding of trust, often discovering that what felt like waiting was actually weaving the threads of something far stronger. You may find yourself in roles requiring sensitivity, behind-the-scenes coordination, or the careful balancing of competing needs without losing your own. However, this energy may challenge you with codependence, conflict avoidance that becomes self-erasure, or hypersensitivity that personalizes neutral feedback. Karmically, your soul is learning that true partnership requires two whole people, not two halves—your softness is a strength only when it stands beside your spine. Your greatest alignment comes from honoring duality: your needs and theirs, your truth and their experience, your peace and the necessary friction of growth. Guard against losing yourself in service by checking weekly: \'Whose dream am I tending right now?\'—and pruning where the answer isn’t yours. When fully embodied, Essence 2 becomes a master weaver—proving that the gentlest hands often hold the strongest threads in the tapestry of human connection.',
  3: 'Your Essence Cycle 3 lifts you into a season of expression, joy, and the radiant courage to be witnessed—where creativity is not optional but oxygen, and laughter becomes a spiritual practice. This is a year to write, perform, speak, design, or simply sparkle in conversation, often discovering that what you considered \'too much\' is exactly what someone needed to be reminded that delight is sacred. You may feel a sudden pull toward visibility, social opportunities, or artistic experiments that previously felt indulgent or frivolous. However, this energy may challenge you with scattered focus, surface-level connections that mistake performance for presence, or self-criticism when the muse falls silent and the pages stay blank. Karmically, your soul is learning that joy is not earned through suffering—it is your birthright, and your willingness to express it is a quiet form of activism in a world too often gray. Your greatest alignment comes from creating without immediate audience, then sharing without apology—trusting that authenticity radiates further than perfection ever could. Guard against dispersion by choosing one creative anchor per season and letting the rest be playful side-channels. When fully embodied, Essence 3 becomes a fountain of generative light—proving that the world doesn’t need more polish; it needs more people brave enough to be unmistakably themselves.',
  4: 'Your Essence Cycle 4 grounds you in a season of structure, discipline, and the unglamorous work of building what will last—where shortcuts cost more than the long road, and consistency outperforms inspiration. This is a year to plan, save, organize, repair, or simply show up day after day for the foundations that will support everything you build for the next decade. You may feel drawn to systems, schedules, or skill-mastery, often finding deep satisfaction in the quiet competence of doing one hard thing exceedingly well. However, this energy may challenge you with rigidity, over-identification with productivity, or resistance to the rest and play that actually fuels endurance. Karmically, your soul is learning that solid structures must be living—built with breath room for change—or they become prisons even their builder cannot escape. Your greatest alignment comes from disciplined action paired with self-compassion: working hard, but not against yourself, and trusting that pace is not the same as progress. Guard against burnout by treating recovery as a non-negotiable beam in the architecture, not a luxury added at the end. When fully embodied, Essence 4 becomes a cornerstone of reliability—proving that the most powerful achievements are not the spectacular ones, but those whose quiet foundation outlasts the trends of an era.',
  5: 'Your Essence Cycle 5 propels you into a phase of liberation, variety, and fearless exploration—where change is not your enemy, but your greatest teacher and catalyst for expansion. This is a year to travel, learn, pivot, or simply say \'yes\' to experiences that expand your sense of possibility, often feeling most alive when you’re stepping outside your comfort zone. You may encounter unexpected opportunities, sudden shifts, or choices that demand adaptability, quick thinking, and the courage to embrace uncertainty as a portal to growth. However, this energy may challenge you with restlessness that prevents deep commitment, or impulsivity that creates chaos under the guise of \'freedom\' without responsibility or purpose. Karmically, your soul is learning that true liberation includes conscious choice—that freedom without direction leads to exhaustion, but freedom aligned with your soul’s growth leads to evolution. Your greatest alignment comes from using your adaptability with intention—choosing change that serves your highest becoming, not just escape from discomfort. Guard against scattering by anchoring each new experience with reflection—ask, \'What did this teach me?\'—then integrate the lesson before leaping to the next horizon. When fully embodied, Essence 5 becomes a portal of conscious evolution—proving that life thrives not in control, but in the courageous embrace of the unknown.',
  6: 'Your Essence Cycle 6 centers your journey on compassion, duty, and the sacred act of creating sanctuaries—whether in your home, family, or community—where all feel seen, safe, and loved. This is a year to cook, heal, listen, mend, or simply show up with consistent, unwavering care for those who depend on you, often finding deep fulfillment in the quiet acts of service that go unnoticed. You may feel drawn to family matters, home projects, or roles that require emotional intelligence, fairness, and the ability to hold space for others’ vulnerabilities without fixing. However, this energy may challenge you with over-commitment until you’re depleted, perfectionism that creates unrealistic standards, or resentment when your care goes unacknowledged. Karmically, your soul is learning that sustainable service flows from a full cup—that setting boundaries is not selfishness, but essential stewardship of the light you’re meant to share with the world. Your greatest alignment comes from balancing giving with receiving—practicing self-care as sacred ritual, not indulgence, and trusting that your well-being is part of your mission. Guard against martyrdom by asking: \'Am I caring from overflow, or from obligation?\'—then adjust your energy accordingly. When fully embodied, Essence 6 becomes a hearth of compassionate strength—proving that the greatest acts of love begin not with depletion, but with the radical choice to tend your own flame so brightly that others find warmth in its glow.',
  7: 'Your Essence Cycle 7 draws you inward toward the sacred space of contemplation, spiritual inquiry, and the quiet pursuit of truth beyond surface appearances. This is a year to meditate, journal, research, or simply sit in stillness—allowing your intuition to guide you toward insights that logic alone cannot reveal. You may feel less interested in social noise and more drawn to solitude, where your mind can wander freely through philosophy, metaphysics, or the silent spaces between thoughts. However, this energy may challenge you with isolation that tips into loneliness, skepticism that blocks spiritual openness, or intellectualizing emotions to avoid feeling them fully and vulnerably. Karmically, your soul is learning that wisdom gains power when shared gently—your insights become healing when offered to those ready to receive, not hoarded in silent superiority or fear of misunderstanding. Your greatest alignment comes from trusting your inner voice over external opinion, and from creating regular rituals of withdrawal that replenish your spirit without disconnecting you entirely. Guard against withdrawal by bridging contemplation with connection—share one key insight weekly, even anonymously, trusting that your truth can shift someone’s entire trajectory. When fully embodied, Essence 7 becomes a wellspring of earned clarity—proving that the deepest truths are not found in noise, but in the fertile silence where the soul speaks loudest.',
  8: 'Your Essence Cycle 8 draws you into a season of authority, abundance, and the responsible stewardship of power—where karma becomes immediately visible, and integrity is the only sustainable strategy. This is a year to negotiate, lead, invest, build, or simply step into the executive role your past efforts have prepared you for, often discovering that the universe matches the scale of your inner ownership with the scale of outer opportunity. You may face significant financial decisions, leadership tests, or chances to convert long invisibility into visible influence. However, this energy may challenge you with workaholism, materialism that confuses worth with net worth, or wielding power in ways that protect ego rather than serve mission. Karmically, your soul is learning that true wealth circulates—what you grasp tightly suffocates, and what you steward generously multiplies through unseen channels. Your greatest alignment comes from leading with vision and compassion, building structures that pay forward, and treating money as energy that must move rather than a god to be hoarded. Guard against the shadow of dominance by asking, \'Whose life is better because I held this power?\'—and adjusting where the answer is only your own. When fully embodied, Essence 8 becomes a force of conscious legacy—proving that the most lasting empires are those built on a foundation of fairness, not fear.',
  9: 'Your Essence Cycle 9 carries you into a season of completion, release, and humanitarian widening—where chapters close so larger ones may open, and your personal story becomes a doorway for collective healing. This is a year to forgive, finish, donate, mentor, or simply let go of identities, relationships, or possessions that no longer fit the soul you’ve become. You may feel waves of nostalgia, unexpected goodbyes, or the dawning recognition that mastery now means service rather than acquisition. However, this energy may challenge you with grief that resists the natural arc of release, savior tendencies that drain you in the name of helping, or the disorientation of standing on the edge of a new self with the old one not yet buried. Karmically, your soul is learning that endings are sacred ground—what you bless on the way out determines what you can receive on the way in. Your greatest alignment comes from generosity untainted by obligation, leadership rooted in lived wisdom, and trusting that the empty hand is the only one capable of fully receiving the next gift. Guard against martyrdom by remembering: your overflow serves the world; your depletion serves no one. When fully embodied, Essence 9 becomes a vessel of profound transformation—proving that the most powerful chapter of any life is the one written after the ego learns to bow.',
  11: 'Your Essence Cycle 11 awakens you into a season of heightened intuition, spiritual mission, and visionary clarity—where the veil thins and your inner knowing arrives faster than the logic that would explain it. This is a year to channel, teach, illuminate, or simply trust the downloads of insight that come in dreams, sudden recognitions, and synchronicities that defy probability. You may feel called to step into greater visibility, share a message that has been incubating quietly for years, or guide others toward truths you barely understand yet yourself. However, this energy may challenge you with nervous-system overwhelm, fear of standing in the brightness of your own gift, or self-doubt that masks the responsibility of being a conduit for something larger. Karmically, your soul is learning that the gift becomes safe to wield when it is offered, not hoarded—and that humility and visibility are not opposites, but partners in mature service. Your greatest alignment comes from grounding the high-frequency insight through the body—through breath, movement, and silence—so that vision does not burn the vessel that carries it. Guard against burnout by remembering that you are a transmitter, not the source; rest is part of the work. When fully embodied, Essence 11 becomes a beacon of awakened consciousness—proving that the most radical act in a noisy world is to be a clear, calm, and committed channel for what is true.',
  22: 'Your Essence Cycle 22 places you in the rare season of the Master Builder—where visionary insight must be matched with disciplined execution, and ideas no longer remain in the realm of dream but find their way into bricks, code, contracts, and institutions. This is a year to scale, formalize, codify, or simply translate years of spiritual seeing into structures that will serve generations beyond your own lifetime. You may sense an unusual weight to your work, an awareness that what you build now sets the trajectory for far more than personal advancement. However, this energy may challenge you with imposter syndrome that doubts you are equal to the task, perfectionism that delays launch indefinitely, or burning out by trying to single-handedly carry what was always meant to be a team effort. Karmically, your soul is learning that the master builder’s deepest skill is not vision or work ethic but the courage to delegate—because the truly great structures require many hands, many gifts, and many lifetimes of trust. Your greatest alignment comes from grounding your dreams in concrete daily action while protecting the vision from the noise of small thinking. Guard against grandiosity by remembering that every legacy began with a single chosen brick, laid honestly. When fully embodied, Essence 22 becomes a force of architectural alchemy—proving that the highest spiritual work is the visible, lasting good that outlives the person who began it.',
  33: 'Your Essence Cycle 33 ushers you into the rarest season—the Master Teacher—where love, wisdom, and selfless service merge into a single offering capable of transforming whoever you touch. This is a year to mentor, heal, write, or simply embody the kind of presence that quiets a room without saying a word. You may sense a magnetism around your work, an awareness that lives are being shaped by your choices in ways that feel humbling and almost unbelievable. However, this energy may challenge you with the temptation to martyr yourself for the mission, take on the suffering of those you serve, or shrink under the weight of being seen as a teacher when you still feel like a student. Karmically, your soul is learning that the teacher and the student are one role—you teach most powerfully by continuing to learn, openly and humbly, in front of everyone watching. Your greatest alignment comes from anchoring service in joy, holding wide compassion paired with firm boundaries, and trusting that your wholeness is the lesson, not the polished delivery of it. Guard against savior dynamics by remembering: you are a midwife, not a god. When fully embodied, Essence 33 becomes a healing river—proving that the highest love is not rescue, but the unwavering reflection of someone’s own light back to them.',
};

// ── Numerology helpers ─────────────────────────────────────────────────────

/**
 * Reduce a positive integer to a single digit, preserving 11 / 22 / 33.
 */
function reduceToSingleOrMaster(n) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((s, d) => s + Number(d), 0);
  }
  return n;
}

/**
 * Strip non-letters and uppercase. Returns "" for empty / non-string input.
 */
function normalizeName(name) {
  return String(name || '').toUpperCase().replace(/[^A-Z]/g, '');
}

/**
 * Total numeric span of one name (sum of letter values). The transit cycle
 * for that name has this length.
 */
function nameCycleLength(name) {
  const letters = normalizeName(name);
  let total = 0;
  for (const c of letters) total += LETTER_VALUES[c] || 0;
  return total;
}

/**
 * Given a single name part and an age (>=1), return the letter currently
 * acting as the transit. Letters rule for v years where v is their value.
 * Returns null if name is empty or age < 1.
 */
function letterTransitAtAge(name, age) {
  if (age < 1) return null;
  const letters = normalizeName(name);
  if (!letters) return null;
  const cycle = nameCycleLength(name);
  if (cycle <= 0) return null;
  // Position within the current loop, 0-indexed.
  let pos = (age - 1) % cycle;
  for (const c of letters) {
    const v = LETTER_VALUES[c];
    if (pos < v) return c;
    pos -= v;
  }
  return letters[letters.length - 1];
}

/**
 * Personal Year Number for a given DOB ("YYYY-MM-DD") and calendar year.
 * Components are reduced individually before summation; master numbers are
 * preserved at every step.
 */
function personalYear(dob, year) {
  const parts = String(dob).split('-').map(Number);
  if (parts.length < 3 || parts.some(Number.isNaN)) {
    throw new Error(`Invalid dob: ${dob}`);
  }
  const [, month, day] = parts;
  return reduceToSingleOrMaster(
    reduceToSingleOrMaster(month) +
    reduceToSingleOrMaster(day) +
    reduceToSingleOrMaster(year),
  );
}

// ── Dualities (Essence × Personal Year overlap) ────────────────────────────
//
// Personal Year cycles change every Jan 1; Essence cycles change every
// birthday. Within a single calendar year you therefore have either:
//   - 1 duality   (essence didn't change across the birthday)
//   - 2 dualities (essence changed: one before the birthday, one after)
// Across a 12-month period straddling New Year, the count becomes 2 or 3 —
// matching the "two or three Dualities" described in standard numerology.
//
// For Duality purposes only, Master (11/22/33) and Karmic Debt (13/14/16/19)
// essence numbers are reduced to their single-digit root — the row's
// `essence_number` field is preserved as-is.

const ESSENCE_INTERNAL_BLURB = {
  1: 'self-defined direction and pioneering identity',
  2: 'cooperation and patient diplomacy',
  3: 'creative self-expression and radiant joy',
  4: 'disciplined building and structural mastery',
  5: 'liberating change and fearless exploration',
  6: 'compassionate service and devoted nurturing',
  7: 'introspective wisdom and spiritual inquiry',
  8: 'empowered authority and material stewardship',
  9: 'humanitarian release and graceful completion',
};

const PERSONAL_YEAR_EXTERNAL_BLURB = {
  1: 'an external year of new beginnings and fresh starts',
  2: 'an external year of partnership, patience, and slow weaving',
  3: 'an external year of social expansion and creative visibility',
  4: 'an external year of hard work, foundation, and steady building',
  5: 'an external year of change, movement, and unexpected pivots',
  6: 'an external year of family, home, and shared responsibility',
  7: 'an external year of reflection, study, and spiritual recalibration',
  8: 'an external year of power, ambition, and financial milestones',
  9: 'an external year of completion, release, and life-chapter endings',
  11: 'an external year of heightened intuition and visionary awakening',
  22: 'an external year of master-level building and large-scale execution',
  33: 'an external year of compassionate teaching and devotional service',
};

/**
 * Reduce a positive integer all the way to a single digit (1–9).
 * Master numbers and karmic debt numbers are NOT preserved here — that is
 * intentional, per the duality convention.
 */
function reduceToSingleDigit(n) {
  if (n <= 0) return 0;
  while (n > 9) {
    n = String(n).split('').reduce((s, d) => s + Number(d), 0);
  }
  return n;
}

const KARMIC_DEBT = new Set([13, 14, 16, 19]);

/**
 * Reduce an essence number for use inside a Duality. Strips master and
 * karmic-debt qualities — only single digits 0–9 are returned.
 */
function reduceEssenceForDuality(n) {
  if (n === 11 || n === 22 || n === 33) return reduceToSingleDigit(n);
  if (KARMIC_DEBT.has(n)) return reduceToSingleDigit(n);
  return reduceToSingleDigit(n);
}

function pad2(n) { return String(n).padStart(2, '0'); }

/**
 * Compute the calendar date one day before (year, month, day). Returns null
 * if the resulting date would fall outside `year` (i.e. birthday is Jan 1).
 */
function dayBeforeInYear(year, month, day) {
  const d = new Date(Date.UTC(year, month - 1, day));
  d.setUTCDate(d.getUTCDate() - 1);
  if (d.getUTCFullYear() !== year) return null;
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

function buildDuality(period, start_date, end_date, essenceForDuality, py) {
  const pyReduced = reduceToSingleDigit(py);
  const dualityNumber = reduceToSingleDigit(essenceForDuality + pyReduced);
  const essBlurb = ESSENCE_INTERNAL_BLURB[essenceForDuality] || `essence ${essenceForDuality} energy`;
  const pyBlurb =
    PERSONAL_YEAR_EXTERNAL_BLURB[py] ||
    PERSONAL_YEAR_EXTERNAL_BLURB[pyReduced] ||
    `an external year of personal-year-${py} themes`;
  return {
    period,
    start_date,
    end_date,
    essence_number: essenceForDuality,
    personal_year: py,
    duality_number: dualityNumber,
    keyword: `Inner ${essenceForDuality} / Outer ${py}`,
    description: `An internal phase of ${essBlurb} unfolding within ${pyBlurb}. Their overlap is the duality energy of this period — what you cultivate inside meets what life arranges outside.`,
  };
}

/**
 * Compute the essence number that applies between (age) and (age+1) — i.e.
 * the post-birthday essence at the given age. Returns 0 for age < 1.
 */
function essenceNumberAtAge(first, middle, last, age) {
  if (age < 1) return 0;
  const physical = letterTransitAtAge(first, age);
  const mental = letterTransitAtAge(middle, age);
  const spiritual = letterTransitAtAge(last, age);
  const sum =
    (physical ? LETTER_VALUES[physical] : 0) +
    (mental ? LETTER_VALUES[mental] : 0) +
    (spiritual ? LETTER_VALUES[spiritual] : 0);
  return reduceToSingleOrMaster(sum);
}

/**
 * Build the 1-or-2 dualities active during `year`, given the post-birthday
 * essence (this row) and the pre-birthday essence (previous age's row).
 */
function buildDualitiesForYear({
  year,
  age,
  birthMonth,
  birthDay,
  postEssence,
  preEssence,
  py,
}) {
  if (age < 1) return []; // pre-influence year — no dualities
  const reducedPost = reduceEssenceForDuality(postEssence);
  const reducedPre = reduceEssenceForDuality(preEssence);

  if (reducedPost === reducedPre) {
    return [
      buildDuality(
        'full_year',
        `${year}-01-01`,
        `${year}-12-31`,
        reducedPost,
        py,
      ),
    ];
  }

  const birthdayThisYear = `${year}-${pad2(birthMonth)}-${pad2(birthDay)}`;
  const beforeBday = dayBeforeInYear(year, birthMonth, birthDay);
  const dualities = [];
  // If birthday is Jan 1, there is no "before_birthday" segment in this year.
  if (beforeBday) {
    dualities.push(
      buildDuality(
        'before_birthday',
        `${year}-01-01`,
        beforeBday,
        reducedPre,
        py,
      ),
    );
  }
  dualities.push(
    buildDuality(
      'after_birthday',
      birthdayThisYear,
      `${year}-12-31`,
      reducedPost,
      py,
    ),
  );
  return dualities;
}

/**
 * Split a full name into first / middle / last. Multiple middle names are
 * concatenated in order, treated as one continuous middle stream (standard
 * numerology convention).
 */
function splitFullName(fullName) {
  const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: '', middle: '', last: '' };
  if (parts.length === 1) return { first: parts[0], middle: '', last: '' };
  if (parts.length === 2) return { first: parts[0], middle: '', last: parts[1] };
  return {
    first: parts[0],
    middle: parts.slice(1, -1).join(''),
    last: parts[parts.length - 1],
  };
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Build the 10-year Essence Cycle table starting at startYear.
 *
 * @param {Object} input
 * @param {string} input.full_name   "First Middle Last" (multi-word middle ok)
 * @param {string} input.dob         "YYYY-MM-DD"
 * @param {number} input.start_year  4-digit year
 */
function calculateEssenceCycle({ full_name, dob, start_year }) {
  if (!full_name || typeof full_name !== 'string') {
    throw new Error('full_name is required');
  }
  if (!dob || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    throw new Error('dob must be in YYYY-MM-DD format');
  }
  if (!Number.isInteger(start_year) || start_year < 1 || start_year > 9999) {
    throw new Error('start_year must be a 4-digit integer');
  }

  const [, birthMonth, birthDay] = dob.split('-').map(Number);
  const birthYear = Number(dob.split('-')[0]);
  const { first, middle, last } = splitFullName(full_name);

  const essence_table = [];
  for (let i = 0; i < 10; i++) {
    const year = start_year + i;
    const age = year - birthYear;

    const physical = letterTransitAtAge(first, age);
    const mental = letterTransitAtAge(middle, age);
    const spiritual = letterTransitAtAge(last, age);

    // Age 0 is pre-influence: letters are null and essence is 0.
    const sum =
      (physical ? LETTER_VALUES[physical] : 0) +
      (mental ? LETTER_VALUES[mental] : 0) +
      (spiritual ? LETTER_VALUES[spiritual] : 0);
    const essence_number = age < 1 ? 0 : reduceToSingleOrMaster(sum);

    const py = personalYear(dob, year);
    const preEssence = essenceNumberAtAge(first, middle, last, age - 1);
    const dualities = buildDualitiesForYear({
      year,
      age,
      birthMonth,
      birthDay,
      postEssence: essence_number,
      preEssence,
      py,
    });

    essence_table.push({
      year,
      age,
      transits: { physical, mental, spiritual },
      personal_year: py,
      essence_number,
      keyword: ESSENCE_KEYWORDS[essence_number] || '',
      meaning: ESSENCE_MEANINGS[essence_number] || '',
      detailed_meaning: ESSENCE_DETAILED_MEANINGS[essence_number] || '',
      dualities,
    });
  }

  const firstE = essence_table[0].essence_number;
  const lastE = essence_table[essence_table.length - 1].essence_number;
  const firstKw = ESSENCE_KEYWORDS[firstE] || `Essence ${firstE}`;
  const lastKw = ESSENCE_KEYWORDS[lastE] || `Essence ${lastE}`;
  const cycle_summary = `From ${start_year} to ${start_year + 9}, your Essence evolves from ${firstKw} (${firstE}) to ${lastKw} (${lastE}), reflecting a decade of the inner growth.`;

  return {
    full_name,
    dob,
    start_year,
    essence_table,
    cycle_summary,
  };
}

module.exports = {
  calculateEssenceCycle,
  // Exposed for unit testing
  _internals: {
    LETTER_VALUES,
    reduceToSingleOrMaster,
    reduceEssenceForDuality,
    letterTransitAtAge,
    personalYear,
    splitFullName,
    nameCycleLength,
    essenceNumberAtAge,
    buildDualitiesForYear,
  },
};
