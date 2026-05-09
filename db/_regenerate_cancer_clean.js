// db/_regenerate_cancer_clean.js
//
// Replaces every Cancer description across career/relationship/food/advice
// with plain-language guidance — no astrology jargon, no Sanskrit terms, no
// planet-house notation. The reader sees pure direction.
//
// Source of truth for the Cancer chart (still used to drive content, never
// mentioned in output text):
//   Asc=Cancer, Sun=3H, Moon=2H, Mercury=3H, Venus=4H,
//   Mars=7H, Jupiter=6H, Saturn=8H, Rahu=9H, Ketu=3H
//
// Run: node db/_regenerate_cancer_clean.js

const fs = require('fs');
const path = require('path');

const NATAL = {
  Sun:     { house: 3 },
  Moon:    { house: 2 },
  Mercury: { house: 3 },
  Venus:   { house: 4 },
  Mars:    { house: 7 },
  Jupiter: { house: 6 },
  Saturn:  { house: 8 },
  Rahu:    { house: 9 },
  Ketu:    { house: 3 },
};

const PLANETS = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Rahu','Ketu'];

// House → life-area theme (lens-specific framing). Phrased in pure English.
const HOUSE_THEMES = {
  1:  { career: 'self-presentation, body, public face',                        relationship: 'how you show up in love, body, presence',                  food: 'body, appetite, identity-as-eater',                            advice: 'self, body, public face' },
  2:  { career: 'income, voice, family wealth',                                relationship: 'speech, family-of-origin money, what you value',           food: 'eating habits, throat, the family table',                       advice: 'money, voice, family-finance' },
  3:  { career: 'effort, peers, writing, short trips',                         relationship: 'siblings, peer-friends, written communication',            food: 'meal logistics, food journaling, daily routine',                advice: 'effort, peers, courage, writing' },
  4:  { career: 'home base, real-estate, mother, foundations',                 relationship: 'home, mother, the shared space',                           food: 'kitchen, mother\'s recipes, the home meal',                     advice: 'home, mother, real-estate, comfort' },
  5:  { career: 'creativity, advisory, mentees, intelligent risk',             relationship: 'romance, children, creative shared output',                food: 'pleasure-eating, creative cooking, romance meals',              advice: 'creativity, romance, children, calculated risk' },
  6:  { career: 'service, daily work, conflicts, debt, health',                relationship: 'caretaking, daily logistics, conflict resolution',         food: 'daily diet, supplements, gut health, food sensitivities',       advice: 'service, daily work, conflicts, health' },
  7:  { career: 'partnerships, contracts, deals',                              relationship: 'spouse, primary partner, formal commitments',              food: 'shared meals, restaurant outings, partner-eating dynamics',     advice: 'partnerships, contracts, the other person' },
  8:  { career: 'transformation, restructuring, hidden assets, regulatory',    relationship: 'in-laws, intimacy, joint finances, deep trust',            food: 'cleanses, recovery food, structured fasts, transitions',        advice: 'transformation, in-laws, joint resources' },
  9:  { career: 'higher learning, foreign work, mentors, principles',          relationship: 'long-distance ties, cross-cultural dynamics, philosophy',  food: 'foreign cuisines, pilgrimage food, traditional traditions',     advice: 'higher learning, foreign matters, mentors' },
  10: { career: 'public reputation, status, leadership',                       relationship: 'public-couple image, social standing together',            food: 'business meals, public-eating moments',                         advice: 'reputation, career, public face' },
  11: { career: 'gains, network, long-term goals',                             relationship: 'friends, social circle, network',                          food: 'food friends, dining clubs, group meals',                       advice: 'gains, network, fulfilled desires' },
  12: { career: 'behind-scenes work, foreign engagements, retreats, leaks',    relationship: 'private moments, hidden dynamics, foreign-distance',       food: 'late-night eating, travel food, quiet meals',                   advice: 'private work, foreign matters, rest' },
};

// Planet → action-flavor (avoid using planet name in output)
const PLANET_FLAVORS = {
  Sun:     { tone: 'authoritative',   action: 'lead, claim authorship, stand visible' },
  Moon:    { tone: 'emotional',       action: 'tend feelings, read the room, nurture' },
  Mercury: { tone: 'communicative',   action: 'write, articulate, exchange, plan' },
  Venus:   { tone: 'harmonious',      action: 'beautify, mediate, attract, soften' },
  Mars:    { tone: 'forceful',        action: 'push hard, defend, ship, contest' },
  Jupiter: { tone: 'expansive',       action: 'grow, teach, mentor, take the long view' },
  Saturn:  { tone: 'disciplined',     action: 'commit long-term, structure, slow down' },
  Rahu:    { tone: 'unconventional',  action: 'experiment, chase the new, take the surprise call' },
  Ketu:    { tone: 'detaching',       action: 'release, simplify, pull back, observe' },
};

const PHASE_FRAMING = {
  career:       { '': 'A window of', 'Starts': 'A window opens for', 'Exact': 'Today is the peak day for', 'Ends': 'The window is closing on' },
  relationship: { '': 'A window of', 'Starts': 'A window opens for', 'Exact': 'Today is the peak day for', 'Ends': 'The window is closing on' },
  food:         { '': 'A window of', 'Starts': 'A window opens for', 'Exact': 'Today is the peak day for', 'Ends': 'The window is closing on' },
  advice:       { '': 'A window of', 'Starts': 'A window opens for', 'Exact': 'Today is the peak day for', 'Ends': 'The window is closing on' },
};

function describePhase(phase, lens) {
  return PHASE_FRAMING[lens][phase] || PHASE_FRAMING[lens][''];
}

// ────────────────────────────────────────────────────────────────────────
// Per-lens hand-written descriptions for the 12 RULERS of this Cancer chart
// (one ruler entry per lens × 12 = 48 entries total). These are deliberately
// chart-specific because rulers are the highest-leverage entries.
// ────────────────────────────────────────────────────────────────────────

const RULERS = {
  career: {
    'Moon ruler of the 1st House in the 2nd House':       'Identity at work is fused with voice, family wealth, and the warmth of being heard. You earn by speaking, presenting, mentoring, narrating. Income peaks when your personal brand is on stage rather than hidden in operations. Sensitive to office mood; the body knows the room before the calendar does. Build vocal and savings discipline in equal measure.',
    'Sun ruler of the 2nd House in the 3rd House':        'Income arrives through methodical effort, written work, hands-on courage, and short bursts of communication. Boss recognition correlates with what you ship, not what you say in meetings. Excellent for technical writing, teaching, sales, content, code — any craft where precision earns the wage. Father-figure mentors push you toward exactness.',
    'Mercury ruler of the 3rd House in the 3rd House':    'Peak intelligence for effort, communication, peer leadership, and courage. The documents you write, the systems you design, the messages you send move careers — yours and others. Younger colleagues, technical peers, and hands-on operators are your principal channel. Industries: technical writing, software, sales, teaching, research, editing, journalism, analytics. Promotions arrive through the report nobody else dared write.',
    'Venus ruler of the 4th House in the 4th House':      'Career flourishes when home and office are aesthetically aligned — a beautiful workspace is not luxury but infrastructure. Mother figures and female mentors carry the seed of your career fortune; their unsolicited advice routinely tilts trajectory. Real estate, design, hospitality, family business, education, fashion, mediation. Relocating to a city or neighborhood that feels right produces the next decade\'s biggest career jump.',
    'Mars ruler of the 5th House in the 7th House':       'Creative output that pays best is co-authored: client briefs, partner-driven advisory, deal-structured creative work. Mentees raised inside deals reciprocate years later. Speculation favored only when partnered with disciplined counterparties. The major partnership in your life is also the major creative collaborator. Investment work, board advisory, and creative consultancy thrive.',
    'Jupiter ruler of the 6th House in the 6th House':    'Built to win in service-as-domain: teaching, healing, legal advocacy, debt-recovery, regulatory work, judicial advisory. Conflicts at work resolve in your favor when fought on principle, not on emotion. Excellent expert witness, ombudsman, code-of-conduct guardian. Co-workers and subordinates flourish under your guidance. The shadow: over-extending into other people\'s problems; learn the difference between principled service and martyr-rescue.',
    'Saturn ruler of the 7th House in the 8th House':     'Long, structurally permanent business unions; counterparties tend to be older, slow, established, regulated. Deals close after extreme due-diligence, never in heat. Industries: insurance, succession, taxation, mergers and acquisitions, regulatory partnerships, infrastructure consortia. Every contract that ends violently leaves you with more authority than before. Your work: outlast the difficult counterparty.',
    'Saturn ruler of the 8th House in the 8th House':     'Career is a series of regenerations: roles end abruptly, identities are shed, and a more authoritative version emerges each cycle. You command natural authority in chaos that paralyzes others — turnarounds, restructurings, post-merger integration, succession transitions, intelligence operations, surgical interventions. Industries: surgery, taxation, intelligence and security, private equity, energy and mining, insurance, succession planning.',
    'Jupiter ruler of the 9th House in the 6th House':    'Father-figure mentors arrive disguised as bosses, clients, or the senior figure you\'re forced to serve. Foreign work and higher-learning ambitions land most when packaged as service, training, or healing. Excellent for adjunct teaching, expert advisory, certification work, judicial proceedings, principled consulting. Promotions correlate with taking on the difficult-client account or the regulatory-compliance assignment — they look like burdens; they are blessings.',
    'Mars ruler of the 10th House in the 7th House':      'Career happens through deals, alliances, and disciplined contractual relationships. The spouse, business partner, or principal client is a structuring force — older, more established, demanding, fair. Industries: structured consulting, deal-making, business development, contract law, joint ventures, infrastructure, government partnerships. Status accrues through deliverables, not flattery. Negotiate hard; firm asks are rewarded.',
    'Venus ruler of the 11th House in the 4th House':     'Bonus pools, equity vesting, and gainful network expansion correlate with home stability — when the home is ordered, the income flows. Mother-figures, female mentors, and senior women in your network reliably surface the larger gains. Industries: real estate, design, family business, hospitality, education, beauty and luxury. Friendships built around the home table outpay friendships built at the bar.',
    'Mercury ruler of the 12th House in the 3rd House':   'Behind-the-scenes communication is a compounding career asset. Confidential reports, ghost-written content, foreign correspondence, NDA-bound technical writing, off-the-record briefings — these are your specialties. Foreign work routes through writing, not relocation. Sleep-disruption around words: ideas come at night; keep a notebook. The shadow: leaks. Careless words cost you most when spoken privately.',
  },
  relationship: {
    'Moon ruler of the 1st House in the 2nd House':       'Identity is tied to family-of-origin and the warmth of the shared meal. Relationships succeed when the partner can sit at your family table; they strain when family is held at arm\'s length. You attract people through your voice — the way you tell stories, the songs you sing, the warmth in conversation. You read your partner\'s mood before they speak. Family wealth dynamics flow into romance, for better or worse.',
    'Sun ruler of the 2nd House in the 3rd House':        'In partnership, money conversations are best held precisely, in writing, with data. The partner respects your editorial-minded approach to family finances. Father and elder-sibling figures shape your sense of what relationship should look like — sometimes more than you realize.',
    'Mercury ruler of the 3rd House in the 3rd House':    'The partner who can match your wit, edit your draft, parse your sequence is the long-term match. Younger siblings, peers, and same-stage friends are central to the relational ecosystem. Excellent for relationships that begin in a shared craft or work context.',
    'Venus ruler of the 4th House in the 4th House':      'The strength of the relationship is measured by how peaceful the home feels when both partners are in it. Mother and mother-figure dynamics shape your romantic template profoundly. You need beauty in the shared space; visual disorder erodes affection. Family business, real-estate, or hospitality work side-by-side with partner is favored.',
    'Mars ruler of the 5th House in the 7th House':       'Children, mentees, and creative collaborators all arrive through partnership channels. Speculative ventures with the partner are favored if they are disciplined. Romance flourishes in the structured shared project, not in the unstructured "let\'s see how it goes" mode.',
    'Jupiter ruler of the 6th House in the 6th House':    'Daily service is your love language. You take care of partners through the schedule, the doctor appointment, the code of honor. Conflicts in relationships resolve when you fight on principle, not on emotion. The shadow: rescuing a partner is not loving them; learn the line.',
    'Saturn ruler of the 7th House in the 8th House':     'Partnership is structurally permanent but tested through extreme circumstances: long separations, family-of-origin reckonings, financial trials, mortality crises. What survives the test is forever. The right partner is older, slower, more established than you may expect at first.',
    'Saturn ruler of the 8th House in the 8th House':     'In-laws and intimacy zones may be challenging but ultimately become structural support. Sexuality deepens through committed partnership; casual is rarely satisfying long-term. Joint financial decisions with partner mature slowly and become permanent foundations.',
    'Jupiter ruler of the 9th House in the 6th House':    'The partner\'s family teaches you something fundamental about principle. Long-distance or cross-cultural relationships are favored when packaged as shared service — working together for a cause, healing project, or teaching mission.',
    'Mars ruler of the 10th House in the 7th House':      'Career and partner fuse into one structuring force. The spouse is older, more established, or simply more disciplined; they bring structural rigor. You attract the responsible, capable, hardworking partner — the one who shows up on time and signs the contract. Soft-romance fades fast; durable-action romance lasts decades.',
    'Venus ruler of the 11th House in the 4th House':     'Closest friends become like family; they meet your mother. Gains from female friends and senior women are reliable. Friendships that start at home dinners outlast friendships that start at parties.',
    'Mercury ruler of the 12th House in the 3rd House':   'Long-distance romance, written-letter intimacy, and foreign-partner dynamics are favored. The shadow: careless words at intimate moments cost you. What is said in the bedroom reverberates beyond it.',
  },
  food: {
    'Moon ruler of the 1st House in the 2nd House':       'Eating is your nervous-system regulation. When mood drops, food is your first medicine — make sure it\'s the right medicine. You overeat when emotional, undereat when overworked. Family meals are sacred infrastructure for your wellbeing. Best diet: warm, cooked, lightly spiced family-style food shared at a real table.',
    'Sun ruler of the 2nd House in the 3rd House':        'The body responds well to structured eating windows, measured portions, the same 6 trustworthy meals on rotation. Skip the diet-trend; commit to the steady protocol. Ingredients matter; provenance matters; the digestive log helps.',
    'Mercury ruler of the 3rd House in the 3rd House':    'You can read your gut\'s signals more accurately than most. Trust the body\'s yes or no on food more than any external nutrition rule. Best for: keeping a food journal, learning the systematic effects of each food on you. Precision in food digestion is your superpower if you train it.',
    'Venus ruler of the 4th House in the 4th House':      'Mother\'s recipes are not nostalgia — they are actual medicine for your constitution. The home kitchen is your wellness center. Beautify the dining space; eat at a real table; protect the lunch hour. Hospitality work, family-style restaurants, and mother\'s-recipe products thrive as side income.',
    'Mars ruler of the 5th House in the 7th House':       'Eat with disciplined people; the partner\'s plate shapes yours. Best for: structured meal-prep with partner, scheduled couples-cooking, restaurant outings as a discipline.',
    'Jupiter ruler of the 6th House in the 6th House':    'The digestive system is naturally robust. You can eat what would destroy lesser stomachs IF you stay on principle. Best for: traditional clean diet, fasting on principle (not vanity), turmeric-ginger-cumin foundation. Traditionally trained chefs find you instinctively.',
    'Saturn ruler of the 7th House in the 8th House':     'Food during life transitions matters more — illness recovery, childbirth, surgery, deep grief. The structured fast, the disciplined elimination diet, the long-term protocol all serve you well. Joint food decisions with partner mature slowly.',
    'Saturn ruler of the 8th House in the 8th House':     'Slow-build food habits compound massively over decades. The same measured diet at age 30 looks austere; at age 70 it has saved your life. Best for: longevity-protocol food, structured intermittent eating, traditional seasonal protocols. Avoid: extreme one-week trend diets.',
    'Jupiter ruler of the 9th House in the 6th House':    'Mentors and gurus often share food wisdom; absorb it. Foreign cuisines work when traditionally sourced and mindfully prepared. Long pilgrimages reset your gut better than any cleanse.',
    'Mars ruler of the 10th House in the 7th House':      'Business meals matter; the structured restaurant lunch with the right partner shapes career. Eat to be sharp for the deal; eat with discipline; the partner sees how you eat and forms judgments accordingly. Avoid combative eating habits at deal tables.',
    'Venus ruler of the 11th House in the 4th House':     'Best food side-incomes: home-bakery, family recipe books, hospitality, design of dining experiences. Friend-network gains through hosting; the table is the social and financial integrator.',
    'Mercury ruler of the 12th House in the 3rd House':   'The shadow: night-eating that drains you the next day. Best for: structured travel-food protocol, foreign-cuisine integration done methodically. Watch private indulgences; sleep-eating costs you.',
  },
  advice: {
    'Moon ruler of the 1st House in the 2nd House':       'Your nervous system is regulated by warm food and warm words. When in doubt today, call mother or eat lunch with a friend rather than push through alone.',
    'Sun ruler of the 2nd House in the 3rd House':        'Today the income or family-finance answer is hidden in writing carefully. Don\'t pitch verbally; draft the one-pager. Effort and precise sequence is your wage today.',
    'Mercury ruler of the 3rd House in the 3rd House':    'Trust your analytical mind on the small decisions today. Send the email; ship the document; close the loop with the peer. Procrastination on small communications costs more than usual.',
    'Venus ruler of the 4th House in the 4th House':      'Home is medicine today. Tidy the workspace; cook the slow meal; call mother. The day\'s problems often dissolve in a clean kitchen.',
    'Mars ruler of the 5th House in the 7th House':       'Today your creative output is best made with the partner in mind. Pitch with rigor; think structurally about the date-night or the joint project.',
    'Jupiter ruler of the 6th House in the 6th House':    'Serve the harder task with principle today. The boring admin, the difficult client, the long-deferred health appointment — all yield outsized rewards when you show up generously.',
    'Saturn ruler of the 7th House in the 8th House':     'The relationship is being structurally tested under the surface today. Don\'t force; observe. Joint-finance, in-law, and deep-trust matters surface slowly. Be patient.',
    'Saturn ruler of the 8th House in the 8th House':     'Hidden things are working in your favor today. The forensic insight, the quiet research, the long-deferred audit — all produce more than visible action.',
    'Jupiter ruler of the 9th House in the 6th House':    'Meaning today comes through service. Listen to your father-figure mentor; show up for the hard problem with principle; the universe blesses the unglamorous fix.',
    'Mars ruler of the 10th House in the 7th House':      'The career move and the relationship move are linked today. Sign contracts with rigor. The partner in the room shapes today\'s outcome.',
    'Venus ruler of the 11th House in the 4th House':     'Gains today arrive through home, family, and female-mentor channels. Reach out to the senior woman in your network; the family table opens doors.',
    'Mercury ruler of the 12th House in the 3rd House':   'Write the confidential note, the foreign correspondence, the quiet message today. What is spoken carelessly costs you; what is written privately compounds.',
  },
};

// ─────────────────────────────────────────────────────────────────────────
// Per-lens DISPOSITORS for this Cancer chart (5 unique).
// ─────────────────────────────────────────────────────────────────────────

const DISPOSITORS = {
  career: {
    'Mercury in 3rd (Dispositor)':  'Your editorial mind is the engine that drives both authority and detachment. When this energy comes online, expect the career story to advance through a document — the report, the spec, the published analysis, the technical brief. You are the precision-mind colleagues turn to when accuracy matters more than charm. Industries: technical writing, software, editing, journalism, research, sales operations, analytics. The shadow: weaponized analysis. Used cruelly, it cuts colleagues; used well, it earns lasting respect.',
    'Sun in 3rd (Dispositor)':      'Your authority is heard through writing and short, decisive communications. Promotions are tied to acts of courage and precise effort — taking the difficult assignment, writing the deck nobody wants to write, leading the small but high-stakes team. The shadow: ego invested in being correct; right-and-cold loses to right-and-warm.',
    'Venus in 4th (Dispositor)':    'You are the diplomat-aesthete in your full power: design taste, mediation skill, mother-figure wisdom flowing through your professional life. Female colleagues, female clients, and senior women in your network are persistent agents of fortune. Industries: design, real estate, hospitality, family business, education, mediation. The shadow: over-pleasing that softens the edges of authority — let firmness carry the hard line while warmth carries the rest.',
    'Saturn in 8th (Dispositor)':   'The slow structural force is the foundation under your career engine. When this energy comes online, expect the long-promised vesting, the inheritance, the regulatory clearance, the slow promotion to chief-of-something. Career compounds through staying power; everyone faster than you eventually disqualifies themselves. Industries: insurance, taxation, succession, regulatory mastery, infrastructure, longevity research. The shadow: isolation from the office social fabric.',
    'Jupiter in 6th (Dispositor)':  'Career fortune arrives through serving a hard problem with high principle: judicial work, regulatory advocacy, expert teaching, healing, debt-resolution, ombudsman roles. Foreign engagements are blessed when packaged as service rather than ambition. The shadow: over-extension into other people\'s problems; learn the line between meaningful service and self-erasure.',
  },
  relationship: {
    'Mercury in 3rd (Dispositor)':  'Your mind drives both relational authority and detachment habits. Partners must be able to handle your editorial mind without taking analytical observations as criticism. Fight with words — but choose them well; this mind cuts when wielded carelessly.',
    'Sun in 3rd (Dispositor)':      'In love, you express care through what you ship, write, build for the partner — through small acts of methodical attention more than grand gestures. Father-figure shapes the relationship template profoundly.',
    'Venus in 4th (Dispositor)':    'The home is the relationship; the relationship is the home. Female partners, female friends, and the mother archetype all run through your love life. Beauty is not luxury but emotional infrastructure.',
    'Saturn in 8th (Dispositor)':   'Structural discipline supports the partnership engine. When this comes online, the long-tested marriage proves itself; the in-law dynamic that took years to settle yields permanent stability.',
    'Jupiter in 6th (Dispositor)':  'In relationships, you express love through care-taking the partner\'s health, schedule, and principles. The shadow: rescuing isn\'t loving.',
  },
  food: {
    'Mercury in 3rd (Dispositor)':  'Your digestive intelligence is the engine that drives both authority over food and ability to detach from cravings. Best for: tracking what works, eliminating what does not, building the precision protocol. The shadow: rigid food rules that punish rather than serve. Stay structured but not punitive.',
    'Sun in 3rd (Dispositor)':      'Methodical authority on food wired to emotional eating. Best for: structured meal authorship — the precision protocol that becomes your standard. The shadow: ego-around-food (the fancy diet, the curated photo, the food as identity). Eat for body, not for status.',
    'Venus in 4th (Dispositor)':    'Home-cooking is the harmony engine itself. The kitchen is the relationship; the table is the family; mother\'s recipes are the foundation. Female mentors arrive with food wisdom. Hospitality, family-recipe businesses, and beautiful-table-design work all favored.',
    'Saturn in 8th (Dispositor)':   'Structural food discipline anchors everything. The 25-year fasting practice; the lifelong elimination of one ingredient that didn\'t serve you; the slow long-term protocol. The shadow: rigidity that punishes the body during life events that demand flexibility (pregnancy, illness, social ritual).',
    'Jupiter in 6th (Dispositor)':  'Service-with-wisdom anchors your foreign-cuisine interest. Foreign foods are blessed when traditionally sourced. The Italian grandmother\'s recipe, the rice-and-lentil porridge, the one-soup-three-side meal — all work for you because of their tradition, not their novelty.',
  },
  advice: {
    'Mercury in 3rd (Dispositor)':  'The precise written word is your power today. Don\'t weaponize the analysis; deploy it. Use precision to close, not to wound.',
    'Sun in 3rd (Dispositor)':      'Lead through methodical effort today, not through ego. The mentor or boss respects what you ship, not what you say.',
    'Venus in 4th (Dispositor)':    'Harmony is your asset today. Mediate the dispute, beautify the workspace, deepen with mother. The diplomat in you serves today.',
    'Saturn in 8th (Dispositor)':   'The slow structural work is protected today. The forensic deep-dive, the audit, the regulatory work all favored. Patience compounds.',
    'Jupiter in 6th (Dispositor)':  'Serve the hard problem with high principle today. The wise helper in you is awake; let it work.',
  },
};

// ─────────────────────────────────────────────────────────────────────────
// Generators for transits, angle aspects, outer specials, and aspects
// ─────────────────────────────────────────────────────────────────────────

function transitDescription(planet, house, lens) {
  const flavor = PLANET_FLAVORS[planet];
  const theme = HOUSE_THEMES[house][lens];
  const occupant = Object.entries(NATAL).find(([p, d]) => d.house === house && p !== planet);

  const base = `A ${flavor.tone} window for ${theme}.`;
  const action = lens === 'advice'
    ? `Today: ${flavor.action}.`
    : `Best for: ${flavor.action}.`;
  const note = occupant
    ? ' Themes already strong in your life around this area get amplified now.'
    : '';
  return `${base} ${action}${note}`;
}

function angleAspectDescription(planet, angle, phase, lens) {
  const flavor = PLANET_FLAVORS[planet];
  const isAsc = angle === 'Ascendant (ASC)';
  const target = isAsc ? 'self, body, and personal presentation' : 'public reputation, status, and visible achievements';
  const targetByLens = {
    career:       isAsc ? 'how you show up at work and in interviews' : 'public career visibility and senior recognition',
    relationship: isAsc ? 'how you show up in love and presence'      : 'how the partnership reads to the outside world',
    food:         isAsc ? 'body, appetite, and how you eat'            : 'business meals and public-eating moments',
    advice:       isAsc ? 'self, body, public face'                    : 'reputation, status, public moves',
  };
  const t = targetByLens[lens];

  const phaseLine = {
    '':       `A ${flavor.tone} window touching ${t}.`,
    'Starts': `A ${flavor.tone} window opens on ${t}. Prepare relevant moves.`,
    'Exact':  `Today is the peak day. ${capitalize(flavor.action)} on ${t}.`,
    'Ends':   `The ${flavor.tone} window on ${t} is closing. Lock in what was started.`,
  };
  return phaseLine[phase];
}

function outerSpecialDescription(combo, phase, lens) {
  // combo: 'Pluto-Saturn' or 'Uranus-Venus'
  const isPlutoSaturn = combo === 'Pluto-Saturn';

  const baseByLens = {
    career: isPlutoSaturn
      ? 'A multi-year structural transformation in industries you serve. Old hierarchies and frameworks dismantle; the new order takes shape slowly. Chaos becomes your platform for permanent authority.'
      : 'Sudden disruption to home, family, real-estate, or aesthetic dimensions of your work. Unexpected offers, surprise contract terms, abrupt mentor shifts. Hold flexible posture.',
    relationship: isPlutoSaturn
      ? 'A multi-year structural reckoning in shared resources, family-in-law dynamics, and intimacy. Joint financial frameworks rewrite; the marriage transforms beneath you.'
      : 'Sudden disruption to home, mother, and aesthetic life. Unexpected affection events, surprise relational moves, abrupt resets.',
    food: isPlutoSaturn
      ? 'Generational transformation of joint-eating habits and longevity protocols. Comfort-food identity dies; new foundation emerges.'
      : 'Sudden kitchen disruption — surprise allergies, abrupt change in dining preferences, unexpected ingredient love.',
    advice: isPlutoSaturn
      ? 'A multi-year structural reckoning. Old hierarchies collapse; you hold authority where others panic.'
      : 'Sudden disruptions today. Move with discipline through unexpected shifts.',
  };

  const base = baseByLens[lens];
  const firstSentence = base.split('. ')[0];

  const phaseLine = {
    '':       base,
    'Starts': `${firstSentence} is beginning. Position for the long work.`,
    'Exact':  `Today is the peak. ${base}`,
    'Ends':   `${firstSentence} is completing. Integrate what changed.`,
  };
  return phaseLine[phase];
}

function aspectDescription(transitPlanet, natalPlanet, natalHouse, phase, lens) {
  const tFlavor = PLANET_FLAVORS[transitPlanet];
  const theme = HOUSE_THEMES[natalHouse][lens];

  // For repeated planets (e.g. Mercury aspect Mercury) emphasize "annual peak"
  const isReturn = transitPlanet === natalPlanet;

  const base = isReturn
    ? `An annual peak in ${theme}.`
    : `A ${tFlavor.tone} window touching ${theme}.`;

  const phaseLine = {
    '':       base,
    'Starts': `${base.replace(/\.$/, '')} is approaching. Prepare relevant moves.`,
    'Exact':  isReturn
      ? `Today is the peak day for annual reset of ${theme}. ${capitalize(tFlavor.action)}.`
      : `Today is the peak day. ${capitalize(tFlavor.action)} in the ${theme} area.`,
    'Ends':   `${base.replace(/\.$/, '')} is closing. Lock in commitments.`,
  };
  return phaseLine[phase];
}

function capitalize(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }

// ─────────────────────────────────────────────────────────────────────────
// Parsing helpers
// ─────────────────────────────────────────────────────────────────────────

function ord(n) {
  const s = ['th','st','nd','rd'], v = n % 100;
  return n + (s[(v-20)%10] || s[v] || s[0]);
}

function parsePhase(name) {
  const m = name.match(/ : (Starts|Exact|Ends)$/);
  return m ? m[1] : '';
}
function stripPhase(name) {
  return name.replace(/ : (?:Starts|Exact|Ends)$/, '');
}

// Fix "a/an" article before vowel-starting words
function fixArticles(text) {
  return text.replace(/\b([Aa]) ([aeiouAEIOU])/g, (m, art, vowel) => {
    return (art === 'A' ? 'An' : 'an') + ' ' + vowel;
  });
}

function describeEvent(name, lens) {
  const phase = parsePhase(name);
  const base = stripPhase(name);

  // RULER
  let m = base.match(/^([A-Z][a-z]+) ruler of the (\d+)(?:st|nd|rd|th) House in the (\d+)(?:st|nd|rd|th) House$/);
  if (m) {
    return RULERS[lens][name] || `A theme around ${HOUSE_THEMES[+m[2]][lens]}.`;
  }

  // DISPOSITOR
  m = base.match(/^([A-Z][a-z]+) in (\d+)(?:st|nd|rd|th) \(Dispositor\)$/);
  if (m) {
    return DISPOSITORS[lens][name] || `A foundational pattern around ${HOUSE_THEMES[+m[2]][lens]}.`;
  }

  // TRANSIT
  m = base.match(/^([A-Z][a-z]+) Transits the (\d+)(?:st|nd|rd|th) House$/);
  if (m) {
    return transitDescription(m[1], +m[2], lens);
  }

  // ANGLE ASPECT
  m = base.match(/^([A-Z][a-z]+) Aspecting (Ascendant \(ASC\)|Midheaven \(MC\))$/);
  if (m) {
    return angleAspectDescription(m[1], m[2], phase, lens);
  }

  // OUTER SPECIAL
  m = base.match(/^(Pluto|Uranus) conjunct (Saturn|Venus)$/);
  if (m) {
    return outerSpecialDescription(`${m[1]}-${m[2]}`, phase, lens);
  }

  // ASPECT
  m = base.match(/^([A-Z][a-z]+) aspect ([A-Z][a-z]+) in (\d+)(?:st|nd|rd|th) house$/);
  if (m) {
    return aspectDescription(m[1], m[2], +m[3], phase, lens);
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────
// Rewrite each seed file
// ─────────────────────────────────────────────────────────────────────────

const lineRegex = /^(\s*\{\s*name:\s*'((?:\\.|[^'\\])*)',\s*description:\s*')((?:\\.|[^'\\])*)(',?\s*\},?)\s*$/;

const lenses = ['career', 'relationship', 'food', 'advice'];

for (const lens of lenses) {
  const filePath = path.join(__dirname, `seed_${lens}_cancer.js`);
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  let rewrote = 0;
  let unchanged = 0;
  let unmatched = 0;

  const newLines = lines.map((line) => {
    const m = line.match(lineRegex);
    if (!m) return line;

    const eventName = m[2].replace(/\\(['"\\])/g, '$1');
    let description = describeEvent(eventName, lens);
    if (!description) {
      unmatched++;
      return line;
    }
    description = fixArticles(description);

    const reEscaped = description.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    rewrote++;
    return `${m[1]}${reEscaped}${m[4]}`;
  });

  fs.writeFileSync(filePath, newLines.join('\n'));
  console.log(`[${lens}] rewrote=${rewrote} unmatched=${unmatched}`);
}
