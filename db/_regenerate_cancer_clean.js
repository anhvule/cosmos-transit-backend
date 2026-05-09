// db/_regenerate_cancer_clean.js
//
// Per SEEDING_GUIDE.md authoring conventions:
//   - Direct, actionable, second person
//   - Never use astrology-jargon preambles (no "Mars-MC aspect exact —")
//   - 80–200 words for rulers/dispositors, tighter for aspects
//   - Reference natal placement explicitly when relevant — interpretation
//     must be recognizably THIS chart, not a generic Cancer-asc template
//
// This generator weaves Cancer-chart-specific texture into every
// description while keeping the framing in plain English. House and
// planet themes encode this chart's actual placements:
//
//   Asc=Cancer (water/cardinal, Moon-ruled, Kapha-Pitta sensitive)
//   Sun=3H + Mercury=3H + Ketu=3H (Virgo) — analytical editor cluster
//   Moon=2H (Leo)  — passionate vocal/family-finance
//   Venus=4H (Libra, own) — beautiful home, mother as mentor
//   Mars=7H (Capricorn, exalted) — disciplined partner is THE career engine
//   Jupiter=6H (Sagittarius, own) — service-with-wisdom, healing/legal
//   Saturn=8H (Aquarius, own)  — slow structural transformation, longevity
//   Rahu=9H (Pisces) — foreign-spiritual obsession
//
// Run: node db/_regenerate_cancer_clean.js

const fs = require('fs');
const path = require('path');

const PLANETS = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Rahu','Ketu'];

// Each natal planet's theme — woven into descriptions whenever that
// natal placement is touched (transits to occupied houses, aspects
// onto the natal planet, etc.).
const NATAL_THEMES = {
  Sun:     { house: 3, theme: 'editorial authority — your craft of writing, peer-leadership, and methodical effort' },
  Moon:    { house: 2, theme: 'the passionate voice — speech, family wealth, the warmth of being heard' },
  Mercury: { house: 3, theme: 'the precision mind — analytical writing, peer communication, hands-on craft' },
  Venus:   { house: 4, theme: 'the home as harmony engine — beautiful spaces, mother-as-mentor, family foundation' },
  Mars:    { house: 7, theme: 'the disciplined partner — your central career engine, where deals and structure converge' },
  Jupiter: { house: 6, theme: 'service-with-wisdom — healing, legal, and dharmic care for clients and team' },
  Saturn:  { house: 8, theme: 'slow structural transformation — longevity, regulatory mastery, joint resources' },
  Rahu:    { house: 9, theme: 'the foreign-spiritual pull — unconventional mentors, cross-cultural pull' },
  Ketu:    { house: 3, theme: 'analytical detachment — solo deep work, dharmic distance from peer politics' },
};

// House → lens-specific themes. The themes encode THIS chart's specific
// dynamic in that house. Empty houses get framing through their lord.
const HOUSE_THEMES = {
  1: {
    career: 'self-presentation and public face. Identity at work is fused with voice, family wealth, and the warmth of being heard',
    relationship: 'how you show up in love and presence. Identity is wired into family-table warmth',
    food: 'body, appetite, and how you eat. Cancer body is sensitive; warm, cooked, lightly spiced food is your baseline',
    advice: 'self, body, public face. Identity here is wired into voice and family',
  },
  2: {
    career: 'income, voice, and family wealth. Your salary is paid for what you say, write, and present — speech is the channel',
    relationship: 'speech, family-of-origin money, what you value. The voice is your love language',
    food: 'eating habits, throat, the family table. Family meals are sacred infrastructure for your wellbeing',
    advice: 'money, voice, family-finance. Speak warmly; the voice is your asset',
  },
  3: {
    career: 'effort, peers, writing, courage. Your analytical-editor cluster sits here — the salary lives in the document',
    relationship: 'siblings, peer-friends, written exchange. Communication-hub of your relationships',
    food: 'meal logistics, food journaling, daily routine. Precision-eating is your superpower',
    advice: 'effort, peers, courage, writing. Trust your analytical mind on the small decisions',
  },
  4: {
    career: 'home base, real-estate, mother. The beautifully harmonious foundation — mother is mentor, female colleagues are key channels',
    relationship: 'home, mother, the shared space. Your harmony-engine of love',
    food: 'kitchen, mother\'s recipes, the home meal. The kitchen is your wellness center',
    advice: 'home, mother, real-estate. Home is medicine; mother is mentor',
  },
  5: {
    career: 'creativity, advisory, mentees, intelligent risk. Creative output flows best through partnership channels',
    relationship: 'romance, children, creative shared output. Co-authored with the partner',
    food: 'pleasure-eating, creative cooking, romance meals. Best when shared with disciplined people',
    advice: 'creativity, romance, children, calculated risk. Channel through partnerships',
  },
  6: {
    career: 'service, daily work, conflicts, debt, health. Your service-with-wisdom domain — teaching, healing, legal, regulatory',
    relationship: 'caretaking, daily logistics, conflict resolution. Daily-service is your love language',
    food: 'daily diet, supplements, gut health. Robust digestion blessed with healing wisdom',
    advice: 'service, daily work, conflicts, health. Serve the hard problem with principle',
  },
  7: {
    career: 'partnerships, contracts, deals. The CENTRAL career engine — the disciplined partner brings structural rigor',
    relationship: 'spouse, primary partner, formal commitments. Your partner is older or more established; structurally permanent',
    food: 'shared meals, restaurant outings, partner-eating dynamics. Eat with disciplined people',
    advice: 'partnerships, contracts, the other person. The partner shapes today\'s outcome',
  },
  8: {
    career: 'transformation, restructuring, hidden assets, regulatory. Slow structural authority — you hold steady when others panic',
    relationship: 'in-laws, intimacy, joint finances, deep trust. Slow-build permanent foundations; long-form sexual depth',
    food: 'cleanses, recovery food, structured fasts, transitions. Long-term protocols compound over decades',
    advice: 'transformation, in-laws, joint resources. Hidden things are working in your favor',
  },
  9: {
    career: 'higher learning, foreign work, mentors, principles. Chaotic foreign-spiritual pull; unconventional teachers arrive',
    relationship: 'long-distance ties, cross-cultural dynamics, philosophy. Foreign-spiritual themes pull at love',
    food: 'foreign cuisines, pilgrimage food, traditional cooking. Long pilgrimages reset your gut',
    advice: 'higher learning, foreign matters, mentors. Meaning today comes through service or distance',
  },
  10: {
    career: 'public reputation, status, leadership. Career visibility flows through partnerships — the spouse-of-business is the route',
    relationship: 'public-couple image, social standing together. Visibility is shared with the partner',
    food: 'business meals, public-eating moments. Eat to be sharp at the deal table',
    advice: 'reputation, career, public face. Status flows through your partnership',
  },
  11: {
    career: 'gains, network, fulfilled desires. Bonus and network growth flow through home and female-mentor channels',
    relationship: 'friends, social circle, network. Closest friends become like family',
    food: 'food friends, dining clubs, group meals. The table is the social-financial integrator',
    advice: 'gains, network, desires. Reach out to the senior woman; family table opens doors',
  },
  12: {
    career: 'behind-scenes work, foreign engagements, retreats, confidential writing. Foreign work routes through writing',
    relationship: 'private moments, hidden dynamics, foreign-distance. Pillow-talk is karmic',
    food: 'late-night eating, travel food, quiet meals. Watch confidential indulgences',
    advice: 'private work, foreign matters, rest. What\'s spoken carelessly costs; what\'s written privately compounds',
  },
};

// Planet-tone for transits/aspects (we use the action-flavor in body
// without naming the planet directly — the event NAME already names it)
const PLANET_FLAVORS = {
  Sun:     { tone: 'authoritative',  action: 'lead, claim authorship, stand visible',                      window: 'a month-long visibility window' },
  Moon:    { tone: 'emotional',      action: 'tend feelings, read the room, nurture relationships',       window: 'a brief 2-day emotional charge' },
  Mercury: { tone: 'communicative',  action: 'write, articulate, exchange, plan precisely',                window: 'a sharpening of mind' },
  Venus:   { tone: 'harmonious',     action: 'beautify, mediate, attract, soften',                         window: 'a warm-toned window' },
  Mars:    { tone: 'forceful',       action: 'push hard, defend, ship, contest',                           window: 'a six-week action window' },
  Jupiter: { tone: 'expansive',      action: 'grow, teach, mentor, take the long view',                    window: 'a year-long expansion' },
  Saturn:  { tone: 'disciplined',    action: 'commit long-term, structure, slow down',                     window: 'a multi-year structural chapter' },
  Rahu:    { tone: 'unconventional', action: 'experiment, chase the new, take the surprise call',         window: 'an 18-month chaotic expansion' },
  Ketu:    { tone: 'detaching',      action: 'release, simplify, pull back, observe',                      window: 'an 18-month dissolution chapter' },
};

// ────────────────────────────────────────────────────────────────────────
// RULERS — chart-specific, hand-written per lens (12 per lens × 4 = 48)
// ────────────────────────────────────────────────────────────────────────

const RULERS = {
  career: {
    'Moon ruler of the 1st House in the 2nd House':       'Identity at work is fused with voice, family wealth, and the warmth of being heard. You earn by speaking, presenting, mentoring, narrating. Income peaks when your personal brand is on stage rather than hidden in operations. Sensitive to office mood — the body knows the room before the calendar does. Family-financial obligations are part of the career fabric, not separate from it. Build vocal and savings discipline in equal measure; your throat and your bank account are linked.',
    'Sun ruler of the 2nd House in the 3rd House':        'Income arrives through methodical effort, written work, hands-on courage, and short bursts of communication. Joined by Mercury and a strong analytical-detachment current, this is the editorial-mind cluster: the salary lives in the document, the deck, the precise sequence. Boss recognition correlates with what you ship, not what you say in meetings. Excellent for technical writing, teaching, sales, content, code — any craft where Virgo-level precision earns the wage. Father-figure mentors push you toward exactness.',
    'Mercury ruler of the 3rd House in the 3rd House':    'Peak natural intelligence for effort, communication, peer leadership, and courage — the engine of your career execution. The documents you write, the systems you design, the messages you send move careers (yours and others). Younger colleagues, technical peers, and hands-on operators are your principal channel. Industries: technical writing, software, sales, teaching, research, editing, journalism, analytics. Promotions arrive through the report nobody else dared write. The shadow: pedantic over-correction; deploy precision on the right problem and forgive the small errors of others.',
    'Venus ruler of the 4th House in the 4th House':      'Career flourishes when home and office are aesthetically aligned — a beautiful workspace is not luxury but infrastructure. Mother figures and female mentors carry the seed of your career fortune; their unsolicited advice routinely tilts trajectory. Real estate, design, hospitality, family business, education, fashion, and mediation are natural domains. Relocating to a city or neighborhood that feels right produces the next decade\'s biggest career jump. Female colleagues and clients are persistent agents of fortune.',
    'Mars ruler of the 5th House in the 7th House':       'Speculative and creative intelligence sits in the partnership zone with Saturn-like discipline. Creative output that pays best is co-authored: client briefs, partner-driven advisory, deal-structured creative work. Children of clients and mentees raised inside deals reciprocate years later. Speculation is favored only when partnered with disciplined counterparties — solo gambling fails. The major partnership in your life is also your major creative collaborator. Investment work, board advisory, and creative consultancy thrive.',
    'Jupiter ruler of the 6th House in the 6th House':    'Built to win in service-as-domain: teaching, healing, legal advocacy, debt-recovery, regulatory work, judicial advisory. Conflicts at work resolve in your favor when fought on principle, not on emotion. Excellent expert witness, ombudsman, code-of-conduct guardian. Co-workers and subordinates flourish under your guidance. Health expands too — you are healthier than peers because the wisdom-current here exalts itself. The shadow: over-extending into other people\'s problems; learn the difference between principled service and martyr-rescue.',
    'Saturn ruler of the 7th House in the 8th House':     'Partnership karma is wired through the transformation chamber. Long, structurally permanent business unions; counterparties tend to be older, slow, established, regulated. Deals close after extreme due-diligence, never in heat. Industries: insurance, succession, taxation, mergers and acquisitions, regulatory partnerships, infrastructure consortia. Every contract that ends violently leaves you with more authority than before. The shadow: counterparties test your patience to the bone. Your work is to outlast them.',
    'Saturn ruler of the 8th House in the 8th House':     'Career is a series of regenerations — roles end abruptly, identities are shed, and a more authoritative version emerges each cycle. You command natural authority in chaos that paralyzes others — turnarounds, restructurings, post-merger integration, succession, intelligence operations, surgical interventions. Industries: surgery, taxation, intelligence and security, private equity, energy, mining, insurance, succession planning. Slow income from hidden sources (royalties, deferred comp, vesting) is your karma. Bosses respect that you can sit calmly in the room where the building is on fire.',
    'Jupiter ruler of the 9th House in the 6th House':    'Higher fortune at work is routed through the service axis. Father-figure mentors arrive disguised as bosses, clients, or the senior figure you\'re forced to serve. Foreign work and higher-learning ambitions land most when packaged as service, training, or healing. Excellent for adjunct teaching, expert advisory, certification work, judicial proceedings, principled consulting. Promotions correlate with taking on the difficult-client account or the regulatory-compliance assignment — they look like burdens; they are blessings.',
    'Mars ruler of the 10th House in the 7th House':      'This is THE central career engine of your chart — the disciplined partner-as-business-engine wired into the very top of your career arc. Career happens through deals, alliances, and disciplined contractual relationships. The spouse, business partner, or principal client is a structuring force in your professional life — older, more established, demanding, fair. Industries: structured consulting, deal-making, business development, contract law, joint ventures, infrastructure, government partnerships. Status accrues through deliverables, not flattery. Negotiate hard; firm asks are rewarded.',
    'Venus ruler of the 11th House in the 4th House':     'Gains are channeled through home, mother, real estate, and aesthetic foundation. Bonus pools, equity vesting, and gainful network expansion correlate with home stability — when the home is ordered, the income flows. Mother-figures, female mentors, and senior women in your network reliably surface the larger gains (offers, introductions, deferred comp clarifications). Industries with strong gain karma: real estate, design, family business, hospitality, education, beauty, luxury. Friendships built around the home table outpay friendships built at the bar.',
    'Mercury ruler of the 12th House in the 3rd House':   'Behind-the-scenes communication is a compounding career asset. Confidential reports, ghost-written content, foreign correspondence, NDA-bound technical writing, off-the-record briefings — these are your specialties. Foreign work routes through writing rather than relocation. Sleep-disruption around words: ideas come at night; keep a notebook by the bed. The shadow: leaks. Carelessly spoken words cost you more than carelessly written ones. Promotions sometimes arrive through a foreign manager who reads your written work in another timezone.',
  },
  relationship: {
    'Moon ruler of the 1st House in the 2nd House':       'Identity in love is wired into family-of-origin and the warmth of the shared meal. Relationships succeed when the partner can sit at your family table; they strain when family is held at arm\'s length. You attract people through your voice — the way you tell stories, the songs you sing, the warmth in conversation. Sensitive to emotional weather; you read your partner\'s mood before they speak. Family wealth dynamics flow into romance, for better or worse. The right partner integrates with your family ecosystem rather than competing with it.',
    'Sun ruler of the 2nd House in the 3rd House':        'Family-financial wellbeing arrives through methodical effort and clear communication. In partnership, money conversations are best held precisely, in writing, with data. The partner respects your editorial-minded approach to family finances. Father and elder-sibling figures shape your sense of what relationship should look like — sometimes more than you realize. The boss-archetype shows up in your love life as the figure who demands you ship, who insists on rigor in the way you handle family money.',
    'Mercury ruler of the 3rd House in the 3rd House':    'Communication itself is your love language. The partner who can match your text wit, edit your draft, parse your sequence is the long-term match. Younger siblings, peers, and same-stage friends are central to the relational ecosystem. Excellent for relationships that begin in a shared craft or work context — co-authored projects, joint publications, debugging the same code. The shadow: editorial criticism delivered as love. Watch the line between sharpening the partner and cutting them.',
    'Venus ruler of the 4th House in the 4th House':      'This is the gold-standard placement for warm-home love. The strength of the relationship is measured by how peaceful the home feels when both partners are in it. Mother and mother-figure dynamics shape your romantic template profoundly. You need beauty in the shared space; visual disorder erodes affection. Family business, real-estate work, or hospitality work side-by-side with partner is favored. Female partners, female friends, and the mother archetype run through your love life.',
    'Mars ruler of the 5th House in the 7th House':       'Romance and partnership are inseparable from career and structure. Children of relationships, mentees, and creative collaborators all arrive through partnership channels. Speculative ventures with the partner are favored if they\'re disciplined. Romance flourishes in the structured shared project — co-founded business, joint property purchase, scheduled creative time — not in the unstructured "let\'s see how it goes" mode.',
    'Jupiter ruler of the 6th House in the 6th House':    'Daily-service is your relationship love language. You take care of partners through the schedule, the doctor appointment, the code of honor. Conflicts in relationships resolve when you fight on principle, not on emotion. Health-care partnerships, healing work together, code-of-conduct alignments matter more than passion alone. The shadow: rescuing a partner is not loving them. Learn the line; don\'t let care collapse into self-erasure.',
    'Saturn ruler of the 7th House in the 8th House':     'Partnership karma routes through the transformation chamber. Marriage is structurally permanent but tested through extreme circumstances: long separations, family-of-origin reckonings, financial trials, mortality crises. What survives the test is forever. The right partner is older, slower, more established than you may expect at first. Casual relationships rarely satisfy; you need the structurally heavy bond.',
    'Saturn ruler of the 8th House in the 8th House':     'In-laws, intimacy, and shared-resources are your slow-build foundation. In-laws may be challenging but ultimately become structural support. Sexuality deepens through structured commitment; casual encounters are rarely satisfying long-term. Joint financial decisions with partner mature slowly and become permanent foundations. The 8H zone — surgery, mortality, inheritance, shared trauma — is where your bond is forged.',
    'Jupiter ruler of the 9th House in the 6th House':    'Dharmic in-laws and father-figure mentors arrive through service contexts. The partner\'s family teaches you something fundamental about principle. Long-distance or cross-cultural relationships are favored when packaged as shared service — working together for a cause, healing project, teaching mission. The marriage that lasts decades is built on shared meaning, not shared pleasure.',
    'Mars ruler of the 10th House in the 7th House':      'Career and partner fuse into one structuring force. The spouse is older, more established, or simply more disciplined; they bring structural rigor to your career. You attract the responsible, capable, hardworking partner — the one who shows up on time and signs the contract. Soft-romance fades fast; durable-action romance lasts decades. Marriage often catalyzes the largest career step.',
    'Venus ruler of the 11th House in the 4th House':     'Social network, friends, and gainful relationships flow through home and family channels. Your closest friends become like family; they meet your mother. Gains from female friends and senior women are reliable. Friendships that start at home dinners outlast friendships that start at parties. The family table is your social and financial integrator — host generously and the network compounds.',
    'Mercury ruler of the 12th House in the 3rd House':   'Long-distance romance, written-letter intimacy, and foreign-partner dynamics are favored. Hidden conversations, foreign correspondence, and bedroom pillow-talk all share a thread. The shadow: careless words at intimate moments cost you. What is said in the bedroom reverberates beyond it; pillow-talk has karmic weight.',
  },
  food: {
    'Moon ruler of the 1st House in the 2nd House':       'Eating is your nervous-system regulation — the body knows when food is medicine. When mood drops, food is your first remedy; make sure it\'s the right remedy. You overeat when emotional, undereat when overworked. Family meals are sacred infrastructure for your wellbeing. Best diet: warm, cooked, lightly spiced, family-style food shared at a real table. Cancer body is sensitive to cold, raw, and heavily processed foods; the gut prefers traditional preparations.',
    'Sun ruler of the 2nd House in the 3rd House':        'The body responds well to structured eating windows, measured portions, and the same six trustworthy meals on rotation. Skip the diet-trend; commit to the steady protocol. Joined by the precision-mind cluster, this is a Virgo-style approach to food: ingredients matter; provenance matters; the digestive log helps. Sun in the analytical zone supports clear authorship of your own protocol.',
    'Mercury ruler of the 3rd House in the 3rd House':    'Peak digestive intelligence sits in the precision-mind zone. You can read your gut\'s signals more accurately than most. Trust the body\'s yes or no on food more than any external nutrition rule. Best for: keeping a food journal, learning the systematic effects of each food on you, building a precise protocol. The Virgo-level precision in food digestion is your superpower if you train it. Shadow: orthorexia — rules that punish rather than serve. Stay structured but not rigid.',
    'Venus ruler of the 4th House in the 4th House':      'This is the gold-standard placement for home-cooked nourishment. Mother\'s recipes are not nostalgia — they are actual medicine for your constitution. The home kitchen IS your wellness center. Beautify the dining space; eat at a real table; protect the lunch hour. Hospitality work, family-style restaurants, and mother\'s-recipe products thrive as side income. Female mentors arrive with food wisdom.',
    'Mars ruler of the 5th House in the 7th House':       'Structured shared meals and partner-eating habits matter — eat with disciplined people; the partner\'s plate shapes yours. Speculative dietary trends backfire unless co-anchored with a disciplined counterparty. Best for: structured meal-prep with partner, scheduled couples-cooking, restaurant outings as a discipline.',
    'Jupiter ruler of the 6th House in the 6th House':    'Wisdom-blessed health zone — the digestive system is naturally robust. You can eat what would destroy lesser stomachs IF you stay on principle (the wisdom-current rewards righteous eating, not gluttony). Best for: traditional clean diet, principled fasting (not vanity), turmeric-ginger-cumin foundation. Traditionally trained chefs find you instinctively. Long-pilgrimage food is exceptionally good for your gut.',
    'Saturn ruler of the 7th House in the 8th House':     'Food during life transitions matters more — illness recovery, childbirth, surgery, deep grief. The structured fast, the disciplined elimination diet, the long-term protocol all serve you well. Joint food decisions with partner mature slowly. The 8H structural-food current rewards multi-year commitments to a regimen.',
    'Saturn ruler of the 8th House in the 8th House':     'Slow-build food habits compound massively over decades. The same measured diet at age 30 looks austere; at age 70 it has saved your life. Best for: longevity-protocol food, structured intermittent eating, traditional seasonal protocols. Avoid extreme one-week trend diets. The structural-food current here rewards multi-decade habit-building, not bursts of effort.',
    'Jupiter ruler of the 9th House in the 6th House':    'Higher fortune in food is routed through dharmic eating. Mentors and gurus often share food wisdom; absorb it. Foreign cuisines work when traditionally sourced (vegetarian-leaning, traditional methods, mindful preparation). Long pilgrimages reset your gut better than any cleanse. The principled-eating tradition becomes your protocol.',
    'Mars ruler of the 10th House in the 7th House':      'Career and shared-eating fuse — business meals matter; the structured restaurant lunch with the right partner shapes career. Eat to be sharp for the deal; eat with discipline; the partner sees how you eat and forms judgments accordingly. Avoid combative eating habits at deal tables.',
    'Venus ruler of the 11th House in the 4th House':     'Gains channeled through home-cooking, mother\'s-recipe products, family-table hospitality. Best food side-incomes: home-bakery, family recipe books, hospitality, design of dining experiences. Friend-network gains arrive through hosting; the table is the social and financial integrator.',
    'Mercury ruler of the 12th House in the 3rd House':   'Foreign cuisine, late-night eating, and bedroom-snacking all share a thread. The shadow: night-eating that drains you the next day. Best for: structured travel-food protocol, foreign-cuisine integration done methodically. Watch confidential indulgences; sleep-eating (literal or metaphorical) costs you.',
  },
  advice: {
    'Moon ruler of the 1st House in the 2nd House':       'Today protect the voice, watch the family-money conversation, eat at a real table. Your nervous system is regulated by warm food and warm words. When in doubt today, call mother or eat lunch with a friend rather than push through alone.',
    'Sun ruler of the 2nd House in the 3rd House':        'Today the income or family-finance answer is hidden in writing carefully. Don\'t pitch verbally; draft the one-pager. Effort + precise sequence is your wage today.',
    'Mercury ruler of the 3rd House in the 3rd House':    'Trust your analytical mind on the small decisions today. Send the email; ship the document; close the loop with the peer. Procrastination on small communications costs more than usual.',
    'Venus ruler of the 4th House in the 4th House':      'Home is medicine today. Tidy the workspace; cook the slow meal; call mother. The day\'s problems often dissolve in a clean kitchen.',
    'Mars ruler of the 5th House in the 7th House':       'Today your creative output is best made with the partner in mind. Pitch with rigor; think structurally about the date-night or the joint project.',
    'Jupiter ruler of the 6th House in the 6th House':    'Serve the harder task with principle today. The boring admin, the difficult client, the long-deferred health appointment — all yield outsized rewards when you show up generously today.',
    'Saturn ruler of the 7th House in the 8th House':     'The relationship is being structurally tested under the surface today. Don\'t force; observe. Joint-finance, in-law, and deep-trust matters surface slowly. Be patient.',
    'Saturn ruler of the 8th House in the 8th House':     'Today hidden things are working in your favor. The forensic insight, the quiet research, the long-deferred audit — all produce more than visible action.',
    'Jupiter ruler of the 9th House in the 6th House':    'Meaning today comes through service. Listen to your father-figure mentor; show up for the hard problem with principle; the universe blesses the unglamorous fix.',
    'Mars ruler of the 10th House in the 7th House':      'Today the career move and the relationship move are linked. Sign contracts with rigor. The partner-in-the-room shapes today\'s outcome.',
    'Venus ruler of the 11th House in the 4th House':     'Today gains arrive through home, family, and female-mentor channels. Reach out to the senior woman in your network; the family table opens doors.',
    'Mercury ruler of the 12th House in the 3rd House':   'Today, write the confidential note, the foreign correspondence, the quiet message. What\'s spoken carelessly costs you; what\'s written privately compounds.',
  },
};

// ────────────────────────────────────────────────────────────────────────
// DISPOSITORS — chart-specific (5 per lens)
// ────────────────────────────────────────────────────────────────────────

const DISPOSITORS = {
  career: {
    'Mercury in 3rd (Dispositor)':  'Your editorial mind is the engine that drives both authority and dharmic detachment. When this energy comes online, the career story advances through a document — the report, the spec, the published analysis, the technical brief. You are the precision-mind colleagues turn to when accuracy matters more than charm. Industries: technical writing, software, editing, journalism, research, sales operations, analytics. The shadow: weaponized analysis. Used cruelly, it cuts colleagues; used well, it earns lasting respect — keep your tongue under guard, because precision wielded carelessly carries karmic weight.',
    'Sun in 3rd (Dispositor)':      'Methodical authority is wired directly to the emotional voice. Career-wise: when this current fires, your authority is heard through writing and short, decisive communications. The boss-archetype is exacting, fair, demanding of detail. Promotions are tied to acts of courage and precise effort — taking the difficult assignment, writing the deck nobody wants to write, leading the small but high-stakes team. The shadow: ego invested in being correct; right-and-cold loses to right-and-warm.',
    'Venus in 4th (Dispositor)':    'You are the diplomat-aesthete in your full power: design taste, mediation skill, mother-figure wisdom flowing through your professional life. Female colleagues, female clients, and senior women in your network are persistent agents of fortune. Industries: design, real estate, hospitality, family business, education, mediation. The shadow: over-pleasing softens the edges of authority — let the partnership-engine carry the firmness while warmth carries the relational layer.',
    'Saturn in 8th (Dispositor)':   'The slow structural force is the foundation under your career engine. When this energy comes online, expect the long-promised vesting, the inheritance, the regulatory clearance, the slow promotion to chief-of-something. Career compounds through staying power; everyone faster than you eventually disqualifies themselves. Industries: insurance, taxation, succession, regulatory mastery, infrastructure, longevity research. The shadow: isolation from the office social fabric — depth-of-work earns nobody small-talk credit.',
    'Jupiter in 6th (Dispositor)':  'Career fortune arrives through serving a hard problem with high principle: judicial work, regulatory advocacy, expert teaching, healing, debt-resolution, ombudsman roles. Foreign engagements are blessed when packaged as service rather than ambition. The shadow: over-extension into other people\'s problems; learn the line between meaningful service and self-erasure.',
  },
  relationship: {
    'Mercury in 3rd (Dispositor)':  'Your mind drives both relational authority and detachment habits. Partners must be able to handle your editorial mind without taking analytical observations as criticism. Fight with words — but choose them well; the precision wielded here cuts when used carelessly. The right partner can edit your draft and have you grateful for it.',
    'Sun in 3rd (Dispositor)':      'In love, you express care through what you ship, write, build for the partner — through small acts of methodical attention more than grand gestures. Father-figure shapes the relationship template profoundly. The boss-archetype shows up in love as the figure who insists on rigor.',
    'Venus in 4th (Dispositor)':    'The home is the relationship; the relationship is the home. Female partners, female friends, and the mother archetype all run through your love life. Beauty is not luxury but emotional infrastructure. Mother\'s wisdom on partner-choice carries weight you may underestimate.',
    'Saturn in 8th (Dispositor)':   'Structural discipline supports the partnership engine. When this comes online, the long-tested marriage proves itself; the in-law dynamic that took years to settle yields permanent stability. Casual is rarely satisfying; the bond needs the structurally heavy load to feel right.',
    'Jupiter in 6th (Dispositor)':  'In relationships, you express love through care-taking the partner\'s health, schedule, and principles. The partner whose values align with your principled service is the long-term match. The shadow: rescuing isn\'t loving.',
  },
  food: {
    'Mercury in 3rd (Dispositor)':  'Your digestive intelligence is the engine driving both authority over food and ability to detach from cravings. Best for: tracking what works, eliminating what does not, building the precision protocol that becomes your standard. The shadow: orthorexia — rigid food rules that punish rather than serve. Stay structured but not punitive.',
    'Sun in 3rd (Dispositor)':      'Methodical authority on food is wired to emotional eating. Best for: structured meal authorship — the precision protocol that becomes your standard. The shadow: ego-around-food (the fancy diet, the curated photo, the food as identity). Eat for body, not for status.',
    'Venus in 4th (Dispositor)':    'Home-cooking is the harmony engine itself. The kitchen is the relationship; the table is the family; mother\'s recipes are the foundation. Female mentors arrive with food wisdom. Hospitality, family-recipe businesses, and beautiful-table-design work all favored.',
    'Saturn in 8th (Dispositor)':   'Structural food discipline anchors everything. The 25-year fasting practice; the lifelong elimination of one ingredient that didn\'t serve you; the slow long-term protocol. The shadow: rigidity that punishes the body during life events that demand flexibility (pregnancy, illness, social ritual).',
    'Jupiter in 6th (Dispositor)':  'Service-with-wisdom anchors your foreign-cuisine interest. Foreign foods are blessed when traditionally sourced (vegetarian-leaning, mindfully prepared). The Italian grandmother\'s recipe, the rice-and-lentil porridge, the one-soup-three-side meal — all work for you because of their tradition, not their novelty.',
  },
  advice: {
    'Mercury in 3rd (Dispositor)':  'The precise written word is your power today. Don\'t weaponize the analysis; deploy it. Use precision to close, not to wound.',
    'Sun in 3rd (Dispositor)':      'Lead through methodical effort today, not through ego. The mentor or boss respects what you ship, not what you say.',
    'Venus in 4th (Dispositor)':    'Harmony is your asset today. Mediate the dispute, beautify the workspace, deepen with mother. The diplomat-aesthete in you serves today.',
    'Saturn in 8th (Dispositor)':   'The slow structural work is protected today. The forensic deep-dive, the audit, the regulatory work all favored. Patience compounds.',
    'Jupiter in 6th (Dispositor)':  'Serve the hard problem with high principle today. The wise helper in you is awake; let it work.',
  },
};

// ────────────────────────────────────────────────────────────────────────
// TRANSITS — planet through house, weaving in chart-specific texture
// ────────────────────────────────────────────────────────────────────────

function transitDescription(planet, house, lens) {
  const flavor = PLANET_FLAVORS[planet];
  const houseTheme = HOUSE_THEMES[house][lens];

  // Find natal occupants of this house
  const occupants = Object.entries(NATAL_THEMES).filter(([, v]) => v.house === house).map(([p]) => p);

  // Build the description
  let s = `A ${flavor.tone} window for ${houseTheme}.`;
  if (occupants.length > 0) {
    s += ' Themes already strong in your life around this area get amplified now;';
    s += ' use the window to ' + flavor.action + '.';
  } else {
    s += ' Best for: ' + flavor.action + '.';
  }

  // Lens-specific flavor sentence based on planet
  const closer = closingLine(planet, house, lens, occupants.length > 0);
  if (closer) s += ' ' + closer;

  return s;
}

function closingLine(planet, house, lens, isOccupied) {
  // Special chart-specific notes for highly-loaded houses
  if (house === 7 && planet === 'Mars' && lens === 'career') {
    return 'This is the Mars-return-style window on your central partnership engine — peak time of any 2-year cycle for binding contracts.';
  }
  if (house === 6 && planet === 'Jupiter' && lens === 'career') {
    return 'The wisdom-current here exalts service; difficult clients become teachers.';
  }
  if (house === 8 && planet === 'Saturn' && lens === 'career') {
    return 'A rare structural reckoning on your transformation chamber — what survives is permanent.';
  }
  if (house === 1 && planet === 'Jupiter') {
    if (lens === 'career') return 'A once-in-12-years personal expansion blessing — plan the long-form personal-brand investment now.';
    if (lens === 'food')   return 'A once-in-12-years body expansion — manage weight; the body wants comfort.';
    if (lens === 'relationship') return 'A once-in-12-years personal-expansion in love — mentors arrive who shape your relational template.';
  }
  if (house === 7 && planet === 'Jupiter' && lens === 'relationship') {
    return 'Major commitment moves favored — engagement, marriage, formal lifelong unions.';
  }
  return '';
}

// ────────────────────────────────────────────────────────────────────────
// ANGLE ASPECTS — planet aspecting ASC or MC, with phase variants
// ────────────────────────────────────────────────────────────────────────

function angleAspectDescription(planet, angle, phase, lens) {
  const flavor = PLANET_FLAVORS[planet];
  const isAsc = angle === 'Ascendant (ASC)';
  const targetByLens = {
    career: isAsc       ? 'self-presentation, body, and how you show up at work'   : 'public reputation, status, and senior-management visibility',
    relationship: isAsc ? 'how you show up in love, body, and presence'            : 'how the partnership reads to the outside world',
    food: isAsc         ? 'body, appetite, and how you eat'                         : 'business meals and public-eating moments',
    advice: isAsc       ? 'self, body, public face'                                 : 'reputation, status, public moves',
  };
  const t = targetByLens[lens];

  if (phase === '') {
    return `A ${flavor.tone} window touching ${t}. Use it to ${flavor.action}.`;
  }
  if (phase === 'Starts') {
    return `A ${flavor.tone} window opens on ${t}. Prepare relevant moves and set up the conversations.`;
  }
  if (phase === 'Exact') {
    return `Today is the peak day. ${capitalize(flavor.action)} in the area of ${t}.`;
  }
  if (phase === 'Ends') {
    return `The ${flavor.tone} window on ${t} is closing. Lock in commitments before momentum fades.`;
  }
  return '';
}

// ────────────────────────────────────────────────────────────────────────
// OUTER SPECIALS — Pluto-Saturn, Uranus-Venus
// ────────────────────────────────────────────────────────────────────────

function outerSpecialDescription(combo, phase, lens) {
  const isPlutoSaturn = combo === 'Pluto-Saturn';
  const baseByLens = {
    career: isPlutoSaturn
      ? 'A multi-year structural reckoning hitting your transformation chamber. Industries you serve undergo deep transformation; regulatory frameworks rewrite; old hierarchies collapse. Chaos becomes the platform of your permanent authority — you hold steady where others panic.'
      : 'A sudden disruption hitting your home harmony zone. Unexpected home/real-estate/mother shifts; surprise lucrative offers via design or aesthetic channels; abrupt resets of female-mentor dynamics.',
    relationship: isPlutoSaturn
      ? 'A multi-year structural reckoning in shared resources, in-law dynamics, and intimacy. Joint financial frameworks rewrite; in-law roles shift; the marriage transforms beneath the surface.'
      : 'A sudden disruption hitting your home and mother zone. Unexpected affection events, surprise relational moves, abrupt home-foundation resets.',
    food: isPlutoSaturn
      ? 'A generational reckoning on your structural-food zone. Joint-eating habits, deep digestive structures, longevity protocols all transform fundamentally. Old comfort-food identity dies.'
      : 'A sudden disruption hitting the home kitchen. Unexpected kitchen shifts, surprise allergies, abrupt change in dining preferences.',
    advice: isPlutoSaturn
      ? 'A multi-year structural reckoning. Old hierarchies collapse around you. Hold steady — the structural authority you build through this is permanent.'
      : 'Sudden disruptions today around home and harmony. Move with discipline through unexpected shifts.',
  };
  const base = baseByLens[lens];
  const firstSentence = base.split('. ')[0] + '.';

  if (phase === '') return base;
  if (phase === 'Starts') return `${firstSentence} The chapter is beginning — position yourself for long, slow work.`;
  if (phase === 'Exact') return `Today is the peak day. ${base}`;
  if (phase === 'Ends')  return `${firstSentence} The chapter is completing. Integrate what changed and carry the new foundation forward.`;
  return base;
}

// ────────────────────────────────────────────────────────────────────────
// ASPECTS — transit planet × natal planet × natal house × phase
// ────────────────────────────────────────────────────────────────────────

function aspectDescription(transitPlanet, natalPlanet, natalHouse, phase, lens) {
  const tFlavor = PLANET_FLAVORS[transitPlanet];
  const natalTheme = NATAL_THEMES[natalPlanet];
  const houseTheme = HOUSE_THEMES[natalHouse][lens];
  const isReturn = transitPlanet === natalPlanet;

  // Build the "what" sentence
  let what;
  if (isReturn) {
    what = `An annual peak on ${natalTheme.theme}.`;
  } else {
    // weave in the transit flavor + the natal theme
    what = `A ${tFlavor.tone} window touching ${natalTheme.theme}.`;
  }

  // Lens-tied closer
  let closer = '';
  if (lens === 'career') closer = `Use it for ${houseTheme.split('.')[0].toLowerCase()}.`;
  else if (lens === 'relationship') closer = `Use it for ${houseTheme.split('.')[0].toLowerCase()}.`;
  else if (lens === 'food') closer = `Tune the food protocol around ${houseTheme.split('.')[0].toLowerCase()}.`;
  else closer = `Today: ${tFlavor.action}.`;

  if (phase === '') {
    return `${what} ${closer}`;
  }
  if (phase === 'Starts') {
    return `${what.replace(/\.$/, '')} is approaching. Prepare what you want to ${tFlavor.action.split(',')[0]}.`;
  }
  if (phase === 'Exact') {
    if (isReturn) {
      return `Today is the peak — annual reset on ${natalTheme.theme}. ${capitalize(tFlavor.action)}.`;
    }
    return `Today is the peak day. ${capitalize(tFlavor.action)} around ${natalTheme.theme}.`;
  }
  if (phase === 'Ends') {
    return `${what.replace(/\.$/, '')} is closing. Lock in commitments and finalize the related decisions.`;
  }
  return what;
}

function capitalize(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }

// ────────────────────────────────────────────────────────────────────────
// Article fix-up
// ────────────────────────────────────────────────────────────────────────

function fixArticles(text) {
  // Words starting with vowel letter but sounded with consonant (take "a")
  const consonantSoundedVowels = /^(?:once|one(?:-|\b)|European|user|union|unit|usual|useful|university|universe|uniform|unique|euphor|euph|UFO)/i;
  // Words starting with consonant letter but sounded with vowel (take "an")
  const vowelSoundedConsonants = /^(?:hour|honor|honest|honour|heir)/i;

  return text.replace(/\b([Aa]) ([A-Za-z][\w-]*)/g, (m, art, word) => {
    const startsVowelLetter = /^[aeiouAEIOU]/.test(word);
    const wantAn =
      vowelSoundedConsonants.test(word) ||
      (startsVowelLetter && !consonantSoundedVowels.test(word));
    if (wantAn) return (art === 'A' ? 'An' : 'an') + ' ' + word;
    return (art === 'A' ? 'A' : 'a') + ' ' + word;
  });
}

// ────────────────────────────────────────────────────────────────────────
// Event-name parsing
// ────────────────────────────────────────────────────────────────────────

function parsePhase(name) {
  const m = name.match(/ : (Starts|Exact|Ends)$/);
  return m ? m[1] : '';
}
function stripPhase(name) {
  return name.replace(/ : (?:Starts|Exact|Ends)$/, '');
}

function describeEvent(name, lens) {
  const phase = parsePhase(name);
  const base = stripPhase(name);

  // RULER
  let m = base.match(/^([A-Z][a-z]+) ruler of the (\d+)(?:st|nd|rd|th) House in the (\d+)(?:st|nd|rd|th) House$/);
  if (m) return RULERS[lens][name] || null;

  // DISPOSITOR
  m = base.match(/^([A-Z][a-z]+) in (\d+)(?:st|nd|rd|th) \(Dispositor\)$/);
  if (m) return DISPOSITORS[lens][name] || null;

  // TRANSIT
  m = base.match(/^([A-Z][a-z]+) Transits the (\d+)(?:st|nd|rd|th) House$/);
  if (m) return transitDescription(m[1], +m[2], lens);

  // ANGLE ASPECT
  m = base.match(/^([A-Z][a-z]+) Aspecting (Ascendant \(ASC\)|Midheaven \(MC\))$/);
  if (m) return angleAspectDescription(m[1], m[2], phase, lens);

  // OUTER SPECIAL
  m = base.match(/^(Pluto|Uranus) conjunct (Saturn|Venus)$/);
  if (m) return outerSpecialDescription(`${m[1]}-${m[2]}`, phase, lens);

  // ASPECT
  m = base.match(/^([A-Z][a-z]+) aspect ([A-Z][a-z]+) in (\d+)(?:st|nd|rd|th) house$/);
  if (m) return aspectDescription(m[1], m[2], +m[3], phase, lens);

  return null;
}

// ────────────────────────────────────────────────────────────────────────
// Rewrite each seed file
// ────────────────────────────────────────────────────────────────────────

const lineRegex = /^(\s*\{\s*name:\s*'((?:\\.|[^'\\])*)',\s*description:\s*')((?:\\.|[^'\\])*)(',?\s*\},?)\s*$/;

const lenses = ['career', 'relationship', 'food', 'advice'];

for (const lens of lenses) {
  const filePath = path.join(__dirname, `seed_${lens}_cancer.js`);
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  let rewrote = 0;
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
