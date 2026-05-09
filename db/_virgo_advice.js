// db/_virgo_advice.js
// ADVICE fills for representative Virgo ascendant native.
// Internal natal reference (do NOT echo as preamble in copy):
//   Mercury Virgo 1H (own + exalted — Bhadra Yoga, yogakaraka)
//   Venus Pisces 7H (exalted — Malavya Yoga, 2L+9L)
//   Jupiter Sagittarius 4H (own — Hamsa Yoga, 4L+7L)
//   Sun Leo 12H (own) · Moon Cancer 11H (own — 11L in 11H)
//   Mars Aries 8H (own) · Saturn Capricorn 5H (own — 5L+6L)
//   Rahu Taurus 9H · Ketu Scorpio 3H

module.exports = {
  // ───────────────────────────────────── RULERS (12) ─────────────────────────
  'Mercury ruler of the 1st House in the 1st House':
    'Lead with precision. Today the room is reading you for analytical sharpness, articulation quality, attention to detail. Body, voice, vocabulary all carry signal — lean clean, articulate, deliberate. Refresh the bio, polish the personal pitch, walk in as the principal-craftsman. Do: ship the technical clarification, lead the analyst meeting, deliver the precise note. Avoid: vague talk, sloppy execution, rushed deliverables. The shadow: perfectionism that delays the release; ship the 90% draft.',
  'Venus ruler of the 2nd House in the 7th House':
    'Today money and partnership move together. The income channel is open through the partner / spouse / principal client. Do: have the warm money-conversation with partner, sign the JV memo, take the family-finance meeting with in-laws. Avoid: solo financial moves disconnected from the partnership context; the money this chart attracts comes through relationship.',
  'Mars ruler of the 3rd House in the 8th House':
    'Today communication carries transformational weight. The message you send lands in someone\'s crisis chamber — be precise, warm, deliberate. Sibling-channel deals have surgical edge; brothers/sisters carry weight in restructuring chapters. Do: write the careful inheritance email, send the considered crisis-communication. Avoid: aggressive notes that detonate.',
  'Jupiter ruler of the 4th House in the 4th House':
    'Today the home-throne is the engine. The wisdom-source for this day is the family seat, the lineage, the mother-channel. Do: take the family-business meeting at home, host the elders, eat the heritage meal, make the property decision with lineage-consciousness. Avoid: trading the home-base advantage for the flashy capital; your power compounds at the family seat.',
  'Saturn ruler of the 5th House in the 5th House':
    'Today disciplined creative work pays. The long-arc project, the slow-burn romance, the structured creative collaboration all favor today. Do: commit to the multi-month protocol, write the long-form piece, take the patient teaching role with mentees. Avoid: rushing the rough draft to publication; this engine rewards the institutional cadence.',
  'Saturn ruler of the 6th House in the 5th House':
    'Today daily-routine carried as discipline becomes the moat. The audit memo, the protocol, the spreadsheet, the methodology you build today is the structural defense against future chaos. Do: document the system, lock the recurring schedule, write the SOP. Avoid: turning every relationship into a compliance exercise; warmth must coexist with rigor.',
  'Jupiter ruler of the 7th House in the 4th House':
    'Today partnership routes through home and family. The spouse decision, the anchor-client conversation, the principal-collaborator move all pick up dharma weight when held in lineage-context. Do: bring the partner home, take the in-law meeting seriously, host at the family seat. Avoid: confusing the family\'s preferred partner with your dharma-correct partner.',
  'Mars ruler of the 8th House in the 8th House':
    'Today the surgical-transformation engine is hot. Crisis-management, restructuring, equity-event, life-or-death advisory move under your hand cleanly. Do: walk into the burning room with discipline, close the inheritance / severance / M&A move, carry the system-stabilization mantle. Avoid: thrill-seeking that confuses adrenaline for dharma; the 8th rewards the surgeon, not the cowboy.',
  'Venus ruler of the 9th House in the 7th House':
    'Today dharma and partner converge. The teacher-track decision and the partner-track decision are the same decision. Do: take the foreign-pilgrimage planning conversation, pick the dharma-aligned anchor-client, marry the principle-aligned partner. Avoid: confusing partner-pleasure with dharma-truth.',
  'Mercury ruler of the 10th House in the 1st House':
    'Today personal craftsmanship is the path to status. The slow, deliberate, principal-of-X moves compound. Do: refresh the bio, lead the technical pitch, accept the principal-track appointment, sign the founder declaration. Avoid: looking for shortcuts; this engine rewards the multi-decade-cadence player.',
  'Moon ruler of the 11th House in the 11th House':
    'Today the wide-network gains channel runs warm. Reach out to alumni, community, peer-trust circle, the long-arc female-friend network. Do: send the warm note to the old colleague, accept the board-advisory call, take the cooperative-platform meeting. Avoid: emotional-reactivity in group politics; protect sleep on big network days.',
  'Sun ruler of the 12th House in the 12th House':
    'Today solitude is productive. Foreign-front work, behind-the-scenes mandates, retreat-strategy drafts, white papers all favor. The light is dimmed publicly, but quiet authority compounds. Do: write the next-quarter strategy alone, take the confidential meeting, carry the foreign mandate. Avoid: forcing visibility; today rewards the shadow-lane player.',

  // ─────────────────────────────────── DISPOSITORS (7) ───────────────────────
  'Mercury in 1st (Dispositor)':
    'When this engine fires, the precision-yogakaraka pays. Lead with personal craftsmanship; the body, voice, and articulation are the channel of advancement.',
  'Venus in 7th (Dispositor)':
    'When this engine fires, the partnership engine pays. Anchor partner, spouse, principal collaborator carry the chapter. Move through the relational channel, not solo.',
  'Jupiter in 4th (Dispositor)':
    'When this engine fires, the home-and-lineage channel pays. Real-estate decisions, family-business inflection, mother-line introduction to the anchor opportunity.',
  'Mars in 8th (Dispositor)':
    'When this engine fires, the surgical-crisis chapter opens. Restructuring, inheritance, severance, M&A — walk in disciplined, walk out with the system stabilized.',
  'Saturn in 5th (Dispositor)':
    'When this engine fires, slow creative discipline produces compounding output. Long-form publication, doctoral milestone, structured creative leadership.',
  'Moon in 11th (Dispositor)':
    'When this engine fires, the wide-network gains channel pays. Alumni introductions, community-led wins, bonus-pool conversations, equity vesting events.',
  'Sun in 12th (Dispositor)':
    'When this engine fires, the confidential / foreign / behind-the-scenes mandate carries the day. Retreat, white paper, embassy posting, off-balance-sheet strategy.',

  // ──────────────────────────────────── TRANSITS (108) ───────────────────────
  // — Sun transits —
  'Sun Transits the 1st House':
    'Annual peak personal-visibility window. Body radiates; the principal-craftsman framing lands. Reset the personal brand, take the public mantle, stake the founder declaration. Watch ego-friction with father-figures.',
  'Sun Transits the 2nd House':
    'Solar light on income, voice, family-finance. Negotiate the salary, record the talk, pin the family-money decision. Throat-care matters; vocal-led work favored.',
  'Sun Transits the 3rd House':
    'Solar courage on writing and short-burst effort. Send the bold note, ship the document, push the campaign. Ketu zone — keep the message warm, not detached.',
  'Sun Transits the 4th House':
    'Solar fire on the home-throne. Real-estate decisions, family-business inflections, mother-line conversations all favored. Father-figures press their mark on lineage decisions.',
  'Sun Transits the 5th House':
    'Solar fire on disciplined-creative output. Best window for the long-form analysis, the curriculum, the doctoral milestone, the structured-creative product. Mentor-of-mentees roles light up.',
  'Sun Transits the 6th House':
    'Solar fire on adversary-management. Hard HR conversations, compliance filings, lawsuits you have postponed all favor offensive action. Adversaries weaken.',
  'Sun Transits the 7th House':
    'Solar fire on partnerships. Spouse and principal-client visibility peak. Sign the anchor partnership; demand JV terms; take the deal public.',
  'Sun Transits the 8th House':
    'Solar light in transformation chamber. Career moves take surgical edge. Inheritance, severance matters surface. Mars own-territory — sharp, disciplined execution rewarded.',
  'Sun Transits the 9th House':
    'Solar light on dharma engine. International-stage talks, certifications, judicial proceedings, teacher-mentor moves. Rahu zone — unconventional teacher / foreign stage materializes.',
  'Sun Transits the 10th House':
    'Annual peak career-visibility window. Best for launching the flagship initiative, demanding the title bump, leading the competitive pitch.',
  'Sun Transits the 11th House':
    'Solar fire on gains and wide-network. Bonus-pool conversations, equity true-ups, board invitations, alumni-network introductions.',
  'Sun Transits the 12th House':
    'Solar return through own sign in moksha. Annual peak for confidential mandates, foreign work, retreats, white papers, off-balance-sheet structuring.',

  // — Moon transits —
  'Moon Transits the 1st House':
    'Two-day window of emotional charge on persona. Body wants warmth; channel into a precision-led relational move.',
  'Moon Transits the 2nd House':
    'Emotional charge on income and voice. Soft-spoken negotiations land; read the room before pricing.',
  'Moon Transits the 3rd House':
    'Emotional charge on communication. Bold message, brave outreach. Ketu zone — calibrate warmth back in.',
  'Moon Transits the 4th House':
    'Emotional pull to the home-throne. Mother-channel calls, real-estate read-outs, family-business pulse-check. Cook a real meal.',
  'Moon Transits the 5th House':
    'Emotional charge on disciplined-creative engine. Mind feels poetic but structured; capture the draft.',
  'Moon Transits the 6th House':
    'Emotional charge on conflict-management. Adversary may push; respond from documentation, not reaction.',
  'Moon Transits the 7th House':
    'Emotional charge on partnership. Read partner / principal-client temperature before meetings. Warm tone wins.',
  'Moon Transits the 8th House':
    'Emotional weight on transformation zone. Defer high-risk decisions two days. Old fears around chaos surface.',
  'Moon Transits the 9th House':
    'Emotional pull toward dharma, teaching, foreign work. The pilgrimage thought, the international intro draft.',
  'Moon Transits the 10th House':
    'Monthly career-pulse peak. Public reception warm; senior-network read-outs favor you.',
  'Moon Transits the 11th House':
    'Monthly own-sign peak (Moon territory). Reach out to alumni, community, peer-trust circle. Gains channel runs warm.',
  'Moon Transits the 12th House':
    'Emotional inwardness; foreign and behind-the-scenes pull. Best for retreat planning, confidential drafting.',

  // — Mercury transits —
  'Mercury Transits the 1st House':
    'Mercury return through own + exalted lagna. Peak self-articulation window of the year. Refresh bio, founder-story, personal pitch deck. Most powerful Mercury transit for this chart.',
  'Mercury Transits the 2nd House':
    'Sharp money-and-voice articulation. Renegotiate salary, write family-finance plan, record the talk, pin the pricing.',
  'Mercury Transits the 3rd House':
    'Mercury\'s natural turf for short-burst communication. Peak for content production, sales sequences, sibling-channel deals.',
  'Mercury Transits the 4th House':
    'Sharp home-throne articulation. Real-estate paperwork, family-business memo, mother-channel correspondence.',
  'Mercury Transits the 5th House':
    'Sharp creative-discipline analysis. Long-form research drafts, curriculum design, doctoral chapter completion.',
  'Mercury Transits the 6th House':
    'Sharp adversary-management. Audit memos, litigation briefs, HR documentation — surgical-precision wins.',
  'Mercury Transits the 7th House':
    'Sharp partnership articulation. Term sheets, JV memos, contract negotiations land cleanly.',
  'Mercury Transits the 8th House':
    'Sharp transformation-zone articulation. Restructuring memos, succession plans, insurance filings.',
  'Mercury Transits the 9th House':
    'Sharp dharma-articulation. Course outlines, lecture decks, certification applications, international-publication submissions.',
  'Mercury Transits the 10th House':
    'Mercury through 10L\'s domain — peak career-articulation window. Promotion memos, board decks, public lectures.',
  'Mercury Transits the 11th House':
    'Sharp wide-network articulation. Alumni-newsletter writing, community-platform posts, board-advisory memos.',
  'Mercury Transits the 12th House':
    'Sharp confidential-mandate articulation. White papers, off-balance-sheet memos, retreat-strategy drafts.',

  // — Venus transits —
  'Venus Transits the 1st House':
    'Personal-magnetism window. Body, voice, taste, presence radiate. Signed contracts feel warm; client meetings convert.',
  'Venus Transits the 2nd House':
    'Venus through own income/voice zone. Family-finance windfall windows, vocal performance favored.',
  'Venus Transits the 3rd House':
    'Charm on communication. The warm message lands. Ketu zone — keep the ask sharp.',
  'Venus Transits the 4th House':
    'Venus through home-throne. Real-estate beauty decisions, mother-channel warmth, family-business soft-power.',
  'Venus Transits the 5th House':
    'Charm on creative-discipline. Structured craft picks up graceful surface — academic paper that reads beautifully.',
  'Venus Transits the 6th House':
    'Charm in conflict zone. Mediation, diplomatic resolution, gracefully-handled HR fight.',
  'Venus Transits the 7th House':
    'Venus return through own exalted 7th. Monthly peak partnership window. Sign the anchor deal, marry, lock principal client.',
  'Venus Transits the 8th House':
    'Charm in transformation zone. Severance / inheritance / restructuring negotiated warmly.',
  'Venus Transits the 9th House':
    'Charm on dharma engine. Foreign-stage talks land warmly, ethical-investment intros, teacher-mentor warmth.',
  'Venus Transits the 10th House':
    'Charm on career visibility. Board-level diplomacy, principal-craftsman warm public moments.',
  'Venus Transits the 11th House':
    'Charm in wide-network. Bonus-pool warm conversations, alumni intros, community-product affection.',
  'Venus Transits the 12th House':
    'Charm in moksha zone. Foreign-warmth, confidential-collaboration, retreat-relationships.',

  // — Mars transits —
  'Mars Transits the 1st House':
    'Surge of personal force on the precision-instrument body. Bold push window — but watch burnout. Temper with rest.',
  'Mars Transits the 2nd House':
    'Force on income and voice. Aggressive pricing, vocal demands. Avoid sharp tones in commerce.',
  'Mars Transits the 3rd House':
    'Force on communication. Bold campaigns, sales pushes. Ketu-zone — bluntness can land cold.',
  'Mars Transits the 4th House':
    'Force on home-throne. Property disputes, family friction. Keep the temperature low at home.',
  'Mars Transits the 5th House':
    'Force on creative-discipline. Push to ship the long-form; competitive contest. Saturn-territory keeps it disciplined.',
  'Mars Transits the 6th House':
    'Force on adversary-management. Best window for offensive action — lawsuit, audit, firing, regulatory filing.',
  'Mars Transits the 7th House':
    'Force on partnership. Sharp negotiations — but watch friction with spouse / principal client.',
  'Mars Transits the 8th House':
    'Mars through own territory — surgical-execution window. Crisis you walk into resolves under your hand.',
  'Mars Transits the 9th House':
    'Force on dharma. Aggressive teaching, doctrinal disputes, certification battles. Rahu zone activated.',
  'Mars Transits the 10th House':
    'Force on career visibility. Aggressive promotion pushes, competitive pitches, principal-track demands.',
  'Mars Transits the 11th House':
    'Force on wide-network. Aggressive bonus negotiations, board-position pushes. Watch group friction.',
  'Mars Transits the 12th House':
    'Force in moksha zone. Foreign-front sharp moves, confidential mandate sharpness. Protect the body.',

  // — Jupiter transits —
  'Jupiter Transits the 1st House':
    'Annual wisdom-on-self window. Body, personal brand, public-craftsman pick up dharma weight. Best year for personal-credential moves.',
  'Jupiter Transits the 2nd House':
    'Wisdom on income, voice, family-finance. Year-block to expand voice-led income, refine family-finance ethics.',
  'Jupiter Transits the 3rd House':
    'Wisdom on communication. Year-block to publish the book, formalize the writing practice. Ketu-zone — keep doctrine grounded.',
  'Jupiter Transits the 4th House':
    'Jupiter return through own + Hamsa-Yoga territory. Year-block for property purchase, family-business inflection, mother-line teaching. Most important Jupiter transit of the chart.',
  'Jupiter Transits the 5th House':
    'Wisdom on creative-discipline. Year-block for doctoral defense, curriculum institutionalization, mentor-of-mentees roles.',
  'Jupiter Transits the 6th House':
    'Wisdom in conflict-zone. Year-block where adversaries weaken, debts repay, regulatory clarity arrives.',
  'Jupiter Transits the 7th House':
    'Wisdom on partnership. Year-block for marriage, JV consolidation, anchor-client dharma-alignment.',
  'Jupiter Transits the 8th House':
    'Wisdom in transformation zone. Year-block for inheritance, equity events, succession planning.',
  'Jupiter Transits the 9th House':
    'Wisdom in dharma-territory. Year-block for foreign-stage credentialing, teacher-track elevation.',
  'Jupiter Transits the 10th House':
    'Wisdom on career visibility. Year-block for principal-of-something appointment, formal lineage transfer.',
  'Jupiter Transits the 11th House':
    'Wisdom in wide-network gains zone. Year-block for cooperative-platform leadership, alumni-network institutionalization.',
  'Jupiter Transits the 12th House':
    'Wisdom in moksha zone. Year-block for retreat-residencies, foreign-research mandates, white papers.',

  // — Saturn transits —
  'Saturn Transits the 1st House':
    'Saturn on the precision-instrument body. ~2.5-year discipline-on-self chapter. Slow strip-down of inflated self-image; lean re-emergence.',
  'Saturn Transits the 2nd House':
    'Saturn on income / voice / family-finance. Lean years; long-term wealth foundations laid. Voice deepens.',
  'Saturn Transits the 3rd House':
    'Saturn on communication. Rigorous editing of public message. Ketu-zone — productive loneliness.',
  'Saturn Transits the 4th House':
    'Saturn on home-throne. Heavy chapter for property, mother\'s health — but the *real* foundations of the home are built here.',
  'Saturn Transits the 5th House':
    'Saturn return through own 5H — the disciplined-creative chapter peak. Multi-decade moat laid here.',
  'Saturn Transits the 6th House':
    'Saturn on adversary/health/debt. Long grind chapter — but adversaries deplete themselves under your patience.',
  'Saturn Transits the 7th House':
    'Saturn on partnership. Marriage / anchor-client tested for structural soundness. Exalted Venus 7H softens.',
  'Saturn Transits the 8th House':
    'Saturn on transformation zone. Heavy-but-gold chapter for restructuring, succession, inheritance.',
  'Saturn Transits the 9th House':
    'Saturn on dharma. Long-arc chapter for credentialing, judicial proceedings, doctrinal restructure.',
  'Saturn Transits the 10th House':
    'Saturn on career-visibility — the structural-status chapter. ~2.5 years of slow, irreversible promotion to principal-track.',
  'Saturn Transits the 11th House':
    'Saturn on wide-network gains. Structural rebuild of alumni / community / board-advisory channels.',
  'Saturn Transits the 12th House':
    'Saturn on moksha-zone. Heavy chapter for foreign work, confidential mandates, retreat-residency.',

  // — Rahu transits —
  'Rahu Transits the 1st House':
    'Rahu on persona. ~18-month chapter of unconventional self-presentation. Risk: identity-overreach. Reward: breakthrough visibility.',
  'Rahu Transits the 2nd House':
    'Rahu on income/voice/family-finance. Speculative income windows, foreign-currency exposure, unconventional vocal-led ventures.',
  'Rahu Transits the 3rd House':
    'Rahu on communication. Foreign / disruptive content channels, viral writing, unconventional sibling-network deals.',
  'Rahu Transits the 4th House':
    'Rahu on home-throne. Foreign-property windows, unconventional family-business pivots.',
  'Rahu Transits the 5th House':
    'Rahu on creative-discipline. Speculative-creative windows, foreign-curriculum ventures, viral-research opportunities.',
  'Rahu Transits the 6th House':
    'Rahu on adversary-zone. Unconventional enemies, foreign litigation. Strong Rahu in 6 typically defeats adversaries.',
  'Rahu Transits the 7th House':
    'Rahu on partnership. Foreign-spouse / foreign-anchor-client window. Exalted Venus 7H absorbs Rahu well.',
  'Rahu Transits the 8th House':
    'Rahu on transformation. Speculative-equity events, unconventional inheritance, foreign restructuring.',
  'Rahu Transits the 9th House':
    'Rahu return through 9H. ~18-month foreign-dharma chapter — unconventional teacher, foreign credentialing.',
  'Rahu Transits the 10th House':
    'Rahu on career-visibility. Sudden public-craftsman elevation through disruptive channels.',
  'Rahu Transits the 11th House':
    'Rahu on wide-network. Foreign-friend windfalls, viral community moves, unconventional board appointments.',
  'Rahu Transits the 12th House':
    'Rahu on moksha-zone. Foreign-retreat residencies, confidential disruptive mandates.',

  // — Ketu transits —
  'Ketu Transits the 1st House':
    'Ketu on persona. Detachment from public visibility; identity-stripping chapter. Useful for sabbatical thinking.',
  'Ketu Transits the 2nd House':
    'Ketu on income/voice. Detachment from family-money attachment; voice quieter.',
  'Ketu Transits the 3rd House':
    'Ketu return through own territory. Detachment from communication noise; sibling-channel disengagement.',
  'Ketu Transits the 4th House':
    'Ketu on home-throne. Detachment from family-business / mother-line attachment. Defer big purchases.',
  'Ketu Transits the 5th House':
    'Ketu on creative-discipline. Detachment from validation-seeking creative work. Pure-form output emerges.',
  'Ketu Transits the 6th House':
    'Ketu on adversary-zone. Detachment from old grievances; enemies you thought mattered evaporate.',
  'Ketu Transits the 7th House':
    'Ketu on partnership. Detachment from anchor-client / spouse warmth; defer big partnership signing.',
  'Ketu Transits the 8th House':
    'Ketu on transformation zone. Detachment from crisis-thrill; the inheritance arrives muted.',
  'Ketu Transits the 9th House':
    'Ketu on dharma. Detachment from doctrinal certainty; old teacher-track may stop fitting.',
  'Ketu Transits the 10th House':
    'Ketu on career-visibility. Detachment from status-attachment; promotion arrives strangely unsatisfying.',
  'Ketu Transits the 11th House':
    'Ketu on wide-network gains. Detachment from group-validation; some friends drift.',
  'Ketu Transits the 12th House':
    'Ketu on moksha-zone. Detachment-on-detachment — deep retreat months.',

  // ─────────────────────────────────── ANGLE ASPECTS (72) ────────────────────
  'Sun Aspecting Ascendant (ASC)':
    'Solar light on persona. Body warms; public visibility tightens. Take the founder photo, the principal-craftsman framing.',
  'Sun Aspecting Ascendant (ASC) : Starts':
    'Solar approach to lagna. Polish the public framing.',
  'Sun Aspecting Ascendant (ASC) : Exact':
    'Today the spotlight peaks. Make the founder declaration.',
  'Sun Aspecting Ascendant (ASC) : Ends':
    'Light fades. Consolidate visibility gains.',
  'Sun Aspecting Midheaven (MC)':
    'Solar light on career-MC. Public-status visibility window.',
  'Sun Aspecting Midheaven (MC) : Starts':
    'Solar approach to MC. Prep the senior-track move.',
  'Sun Aspecting Midheaven (MC) : Exact':
    'Today public-status spotlight peaks. Pitch the principal role.',
  'Sun Aspecting Midheaven (MC) : Ends':
    'Light fades from MC. Lock the recognition.',
  'Moon Aspecting Ascendant (ASC)':
    'Emotional charge on persona. Take the relationship-driven meeting.',
  'Moon Aspecting Ascendant (ASC) : Starts':
    'Approach. Prep softer outreach.',
  'Moon Aspecting Ascendant (ASC) : Exact':
    'Today persona runs warm. Send the warm pitch.',
  'Moon Aspecting Ascendant (ASC) : Ends':
    'Warmth fades. Lock warm-channel relationships.',
  'Moon Aspecting Midheaven (MC)':
    'Emotional charge on public-status. Lead with relational warmth in senior meetings.',
  'Moon Aspecting Midheaven (MC) : Starts':
    'Approach. Warm up senior-track relationships.',
  'Moon Aspecting Midheaven (MC) : Exact':
    'Today public-status read runs warm.',
  'Moon Aspecting Midheaven (MC) : Ends':
    'Warmth fades. Lock warm-status relationships.',
  'Mercury Aspecting Ascendant (ASC)':
    'Mercury on persona — articulation peak. Bio refresh, founder-story polish.',
  'Mercury Aspecting Ascendant (ASC) : Starts':
    'Approach. Draft the personal pitch deck.',
  'Mercury Aspecting Ascendant (ASC) : Exact':
    'Today precision-articulation peaks. Ship the founder-story.',
  'Mercury Aspecting Ascendant (ASC) : Ends':
    'Mercury fades. Lock articulation polish.',
  'Mercury Aspecting Midheaven (MC)':
    'Mercury on public-status — board decks, principal-craftsman submissions.',
  'Mercury Aspecting Midheaven (MC) : Starts':
    'Approach. Draft the board deck.',
  'Mercury Aspecting Midheaven (MC) : Exact':
    'Today senior-track articulation peaks. Submit the board deck.',
  'Mercury Aspecting Midheaven (MC) : Ends':
    'Mercury fades from MC. Lock senior-track articulation.',
  'Venus Aspecting Ascendant (ASC)':
    'Charm on persona. Body radiates; client meetings convert.',
  'Venus Aspecting Ascendant (ASC) : Starts':
    'Approach. Prep warm-pitch sequence.',
  'Venus Aspecting Ascendant (ASC) : Exact':
    'Today personal-charm peaks. Sign the warm contracts.',
  'Venus Aspecting Ascendant (ASC) : Ends':
    'Charm fades. Lock warm-channel relationships.',
  'Venus Aspecting Midheaven (MC)':
    'Charm on public-status. Board-level diplomacy, principal-craftsman warmth.',
  'Venus Aspecting Midheaven (MC) : Starts':
    'Approach. Soften senior-track outreach.',
  'Venus Aspecting Midheaven (MC) : Exact':
    'Today senior-track charm peaks.',
  'Venus Aspecting Midheaven (MC) : Ends':
    'Charm fades from MC. Lock senior-track warmth.',
  'Mars Aspecting Ascendant (ASC)':
    'Force on persona. Bold pushes favored — but watch burnout on precision-instrument body.',
  'Mars Aspecting Ascendant (ASC) : Starts':
    'Approach. Gather force.',
  'Mars Aspecting Ascendant (ASC) : Exact':
    'Today force on persona peaks. Make the bold demand. Body needs rest tonight.',
  'Mars Aspecting Ascendant (ASC) : Ends':
    'Force fades. Lock bold-push gains.',
  'Mars Aspecting Midheaven (MC)':
    'Force on public-status. Aggressive promotion pushes, competitive senior-track demands.',
  'Mars Aspecting Midheaven (MC) : Starts':
    'Approach. Gather force for senior-track push.',
  'Mars Aspecting Midheaven (MC) : Exact':
    'Today public-status force peaks. Demand the title.',
  'Mars Aspecting Midheaven (MC) : Ends':
    'Force fades. Cool friction with current authority.',
  'Jupiter Aspecting Ascendant (ASC)':
    'Wisdom on persona. Lineage-anchored personal-brand moves, dharma-aligned framing.',
  'Jupiter Aspecting Ascendant (ASC) : Starts':
    'Approach. Polish dharma-aligned framing.',
  'Jupiter Aspecting Ascendant (ASC) : Exact':
    'Today wisdom on persona peaks. Take the lineage photo.',
  'Jupiter Aspecting Ascendant (ASC) : Ends':
    'Wisdom fades. Lock lineage-anchored gains.',
  'Jupiter Aspecting Midheaven (MC)':
    'Wisdom on public-status. Senior-track elevation through dharma-aligned channels.',
  'Jupiter Aspecting Midheaven (MC) : Starts':
    'Approach. Position senior move as dharma-aligned.',
  'Jupiter Aspecting Midheaven (MC) : Exact':
    'Today senior-track dharma-elevation peaks.',
  'Jupiter Aspecting Midheaven (MC) : Ends':
    'Wisdom fades from MC. Lock dharma-aligned status.',
  'Saturn Aspecting Ascendant (ASC)':
    'Discipline on persona. Strip-down of inflated self-image; lean re-emergence.',
  'Saturn Aspecting Ascendant (ASC) : Starts':
    'Approach. Begin personal discipline cycle.',
  'Saturn Aspecting Ascendant (ASC) : Exact':
    'Today discipline-on-persona peaks. Make the lean, principled statement.',
  'Saturn Aspecting Ascendant (ASC) : Ends':
    'Discipline closing. Lock leaner framing.',
  'Saturn Aspecting Midheaven (MC)':
    'Discipline on public-status. Slow, structural, irreversible promotion to senior track.',
  'Saturn Aspecting Midheaven (MC) : Starts':
    'Approach. Begin structural senior positioning.',
  'Saturn Aspecting Midheaven (MC) : Exact':
    'Today structural-status peak. Take the slow-but-permanent promotion.',
  'Saturn Aspecting Midheaven (MC) : Ends':
    'Discipline closing. Structural senior track in place.',
  'Rahu Aspecting Ascendant (ASC)':
    'Rahu on persona. Unconventional / foreign / disruptive personal-brand moves. Risk: identity-overreach. Reward: breakthrough.',
  'Rahu Aspecting Ascendant (ASC) : Starts':
    'Approach. Unconventional persona-pivot gathering.',
  'Rahu Aspecting Ascendant (ASC) : Exact':
    'Today disruptive-persona peak. Make the unconventional move.',
  'Rahu Aspecting Ascendant (ASC) : Ends':
    'Rahu fades. Decide which disruptive elements stay.',
  'Rahu Aspecting Midheaven (MC)':
    'Rahu on public-status. Sudden, unconventional senior-track elevation.',
  'Rahu Aspecting Midheaven (MC) : Starts':
    'Approach. Unconventional senior move gathering.',
  'Rahu Aspecting Midheaven (MC) : Exact':
    'Today disruptive-status peak. Take the unconventional appointment.',
  'Rahu Aspecting Midheaven (MC) : Ends':
    'Rahu fades from MC. Lock disruptive gains.',
  'Ketu Aspecting Ascendant (ASC)':
    'Ketu on persona. Detachment from public visibility; sabbatical-thinking favored.',
  'Ketu Aspecting Ascendant (ASC) : Starts':
    'Approach. Pull toward solitude rising.',
  'Ketu Aspecting Ascendant (ASC) : Exact':
    'Today persona-detachment peaks. Best for solitary work.',
  'Ketu Aspecting Ascendant (ASC) : Ends':
    'Detachment fading. Re-emerge with what survived silence.',
  'Ketu Aspecting Midheaven (MC)':
    'Ketu on public-status. Detachment from status-attachment.',
  'Ketu Aspecting Midheaven (MC) : Starts':
    'Approach. Status-attachment unwinds.',
  'Ketu Aspecting Midheaven (MC) : Exact':
    'Today status-detachment peaks. Recognition feels strangely empty — useful info.',
  'Ketu Aspecting Midheaven (MC) : Ends':
    'Detachment fading. Next chapter starts on internal grounds.',

  // ───────────────────────────────── OUTER SPECIALS (8) ──────────────────────
  'Pluto conjunct Saturn':
    'Generational structural transformation in 5L+6L Saturn territory. Career-discipline architecture rebuilt from foundation.',
  'Pluto conjunct Saturn : Starts':
    'Pressure builds on Saturn-territory. Document the structural architecture you want to preserve.',
  'Pluto conjunct Saturn : Exact':
    'Today the generational rebuild peaks. Disciplined-creative framework re-cast at depth.',
  'Pluto conjunct Saturn : Ends':
    'Pressure releases. New structural architecture in place.',
  'Uranus conjunct Venus':
    'Disruptive innovation on the partnership / income / dharma engine. Spouse, anchor-client, principal-teacher relationship undergoes sudden re-architecture.',
  'Uranus conjunct Venus : Starts':
    'Disruptive pressure builds on partnership.',
  'Uranus conjunct Venus : Exact':
    'Today the partnership rewiring peaks. Unconventional partner declaration lands.',
  'Uranus conjunct Venus : Ends':
    'Disruption settling. New partnership architecture in place.',

  // ────────────────────────────────────── ASPECTS (324) ──────────────────────
  // — Jupiter aspects —
  'Jupiter aspect Sun in 12th house':
    'Wisdom touches the moksha-solar engine. Confidential mandates take dharma-weight.',
  'Jupiter aspect Sun in 12th house : Starts':
    'Approach. Shadow-lane work gathering dharma weight.',
  'Jupiter aspect Sun in 12th house : Exact':
    'Today wisdom on 12th-Sun peaks. Lock the confidential / foreign mandate.',
  'Jupiter aspect Sun in 12th house : Ends':
    'Wisdom fades. Document the dharma-weight gained.',
  'Jupiter aspect Moon in 11th house':
    'Wisdom on wide-network gains. Alumni-network institutionalization, ethical bonus structures.',
  'Jupiter aspect Moon in 11th house : Starts':
    'Approach. Network-gains picks up dharma framing.',
  'Jupiter aspect Moon in 11th house : Exact':
    'Today wisdom-on-network peaks. Anchor wide-network in ethical structure.',
  'Jupiter aspect Moon in 11th house : Ends':
    'Wisdom fades. Lock dharma-aligned network architecture.',
  'Jupiter aspect Mercury in 1st house':
    'Wisdom touches the central yogakaraka engine. Personal-craftsman framing picks up doctrinal weight.',
  'Jupiter aspect Mercury in 1st house : Starts':
    'Approach. Principal-craftsman framing gathers lineage authority.',
  'Jupiter aspect Mercury in 1st house : Exact':
    'Today wisdom-on-yogakaraka peaks. Take principal-of-craft mantle.',
  'Jupiter aspect Mercury in 1st house : Ends':
    'Wisdom fades. Lineage-anchored role locked.',
  'Jupiter aspect Venus in 7th house':
    'Wisdom on exalted partnership / dharma / wealth engine. Marriage with dharma-alignment, JV with ethical framing.',
  'Jupiter aspect Venus in 7th house : Starts':
    'Approach. Partnership picks up dharma weight.',
  'Jupiter aspect Venus in 7th house : Exact':
    'Today wisdom-on-Venus-7H peaks. Lock dharma-aligned partnership.',
  'Jupiter aspect Venus in 7th house : Ends':
    'Wisdom fades. Principled partnership consolidated.',
  'Jupiter aspect Mars in 8th house':
    'Wisdom on surgical-transformation engine. Inheritance, restructuring take dharma-weight.',
  'Jupiter aspect Mars in 8th house : Starts':
    'Approach. Transformation gathers dharma framing.',
  'Jupiter aspect Mars in 8th house : Exact':
    'Today wisdom-on-Mars-8H peaks. Lock dharma-aligned restructuring.',
  'Jupiter aspect Mars in 8th house : Ends':
    'Wisdom fades. Principled crisis-resolution on record.',
  'Jupiter aspect Jupiter in 4th house':
    'Jupiter return — most important transit-aspect of the chart. Hamsa-Yoga territory amplified. Year-block for property purchase, family-business inflection.',
  'Jupiter aspect Jupiter in 4th house : Starts':
    'Jupiter return approaching. Prep the home-throne move.',
  'Jupiter aspect Jupiter in 4th house : Exact':
    'Jupiter return peak. Make the property purchase, family-business move.',
  'Jupiter aspect Jupiter in 4th house : Ends':
    'Jupiter return closing. Home-throne lineage move consolidated.',
  'Jupiter aspect Saturn in 5th house':
    'Wisdom on disciplined-creative engine. Doctoral framework receives lineage-authority.',
  'Jupiter aspect Saturn in 5th house : Starts':
    'Approach. Disciplined-creative work picks up lineage weight.',
  'Jupiter aspect Saturn in 5th house : Exact':
    'Today wisdom-on-Saturn-5H peaks. Lock institutional curriculum.',
  'Jupiter aspect Saturn in 5th house : Ends':
    'Wisdom fades. Disciplined-creative architecture institutionalized.',
  'Jupiter aspect Rahu in 9th house':
    'Wisdom on foreign-dharma engine. Unconventional teacher-track gains lineage authority.',
  'Jupiter aspect Rahu in 9th house : Starts':
    'Approach. Foreign-dharma move gathers framing.',
  'Jupiter aspect Rahu in 9th house : Exact':
    'Today wisdom-on-Rahu-9H peaks. Take unconventional teacher-track move.',
  'Jupiter aspect Rahu in 9th house : Ends':
    'Wisdom fades. Foreign-dharma path on record.',
  'Jupiter aspect Ketu in 3rd house':
    'Wisdom on detached-communication engine. Solitary research, doctrinal writing without audience-pressure.',
  'Jupiter aspect Ketu in 3rd house : Starts':
    'Approach. Solitary-research framing gathers.',
  'Jupiter aspect Ketu in 3rd house : Exact':
    'Today wisdom-on-Ketu-3H peaks. Publish lineage-rooted research.',
  'Jupiter aspect Ketu in 3rd house : Ends':
    'Wisdom fades. Solitary-research output locked.',

  // — Ketu aspects —
  'Ketu aspect Sun in 12th house':
    'Detachment on moksha-solar engine. Pure shadow-lane work, ego-free retreat mandates.',
  'Ketu aspect Sun in 12th house : Starts':
    'Approach. 12H solar light dims.',
  'Ketu aspect Sun in 12th house : Exact':
    'Today detachment-on-12H-Sun peaks. Best for monastery-as-client work.',
  'Ketu aspect Sun in 12th house : Ends':
    'Detachment fading. Shadow-lane work consolidates.',
  'Ketu aspect Moon in 11th house':
    'Detachment on wide-network gains. Some friends drift; alumni channel quiets. Prune the network.',
  'Ketu aspect Moon in 11th house : Starts':
    'Approach. Group-warmth fades.',
  'Ketu aspect Moon in 11th house : Exact':
    'Today network-detachment peaks. Trust the silence.',
  'Ketu aspect Moon in 11th house : Ends':
    'Detachment fading. Pruned network reveals real members.',
  'Ketu aspect Mercury in 1st house':
    'Detachment on yogakaraka. Identity-stripping window — principal-craftsman essence remains; ego-frame thins.',
  'Ketu aspect Mercury in 1st house : Starts':
    'Approach. Public-craftsman ego-frame loosens.',
  'Ketu aspect Mercury in 1st house : Exact':
    'Today yogakaraka-detachment peaks. Best for solitary craft.',
  'Ketu aspect Mercury in 1st house : Ends':
    'Detachment fading. Leaner principal-craftsman re-emerges.',
  'Ketu aspect Venus in 7th house':
    'Detachment on partnership. Defer big partnership signing.',
  'Ketu aspect Venus in 7th house : Starts':
    'Approach. Partnership warmth dims.',
  'Ketu aspect Venus in 7th house : Exact':
    'Today partnership-detachment peaks. Defer signings.',
  'Ketu aspect Venus in 7th house : Ends':
    'Detachment fading. Partnership warmth returns.',
  'Ketu aspect Mars in 8th house':
    'Detachment on surgical-crisis engine. The inheritance / equity event arrives muted. Document.',
  'Ketu aspect Mars in 8th house : Starts':
    'Approach. Crisis-thrill loosens.',
  'Ketu aspect Mars in 8th house : Exact':
    'Today crisis-detachment peaks. Transformation passes through quietly.',
  'Ketu aspect Mars in 8th house : Ends':
    'Detachment fading. Quiet transformation on record.',
  'Ketu aspect Jupiter in 4th house':
    'Detachment on home-throne / Hamsa engine. Family-business attachment loosens.',
  'Ketu aspect Jupiter in 4th house : Starts':
    'Approach. Home-throne attachment loosens.',
  'Ketu aspect Jupiter in 4th house : Exact':
    'Today Hamsa-detachment peaks. Family-business decisions feel oddly indifferent.',
  'Ketu aspect Jupiter in 4th house : Ends':
    'Detachment fading. Home-throne re-engages quieter.',
  'Ketu aspect Saturn in 5th house':
    'Detachment on disciplined-creative engine. Validation-seeking impulse fades; pure-form output emerges.',
  'Ketu aspect Saturn in 5th house : Starts':
    'Approach. Validation-attachment loosens.',
  'Ketu aspect Saturn in 5th house : Exact':
    'Today creative-detachment peaks. Make the work nobody is asking for.',
  'Ketu aspect Saturn in 5th house : Ends':
    'Detachment fading. Pure-form output stands alone.',
  'Ketu aspect Rahu in 9th house':
    'Detachment on foreign-dharma engine. Doctrinal certainty loosens.',
  'Ketu aspect Rahu in 9th house : Starts':
    'Approach. Doctrinal certainty wobbles.',
  'Ketu aspect Rahu in 9th house : Exact':
    'Today doctrine-detachment peaks. Sabbatical from teacher-track ambition.',
  'Ketu aspect Rahu in 9th house : Ends':
    'Detachment fading. Teacher-track returns on different terms.',
  'Ketu aspect Ketu in 3rd house':
    'Ketu return — communication-detachment peak. Sibling-channel goes quiet; marketing impulse fades.',
  'Ketu aspect Ketu in 3rd house : Starts':
    'Approach. Communication-attachment loosens.',
  'Ketu aspect Ketu in 3rd house : Exact':
    'Ketu return peak. Drop the marketing.',
  'Ketu aspect Ketu in 3rd house : Ends':
    'Ketu return closing. Re-engage on lighter terms.',

  // — Mars aspects —
  'Mars aspect Sun in 12th house':
    'Force on moksha-solar engine. Confidential / foreign mandates sharpen.',
  'Mars aspect Sun in 12th house : Starts':
    'Approach. Shadow-lane work gathers force.',
  'Mars aspect Sun in 12th house : Exact':
    'Today force-on-12H-Sun peaks. Push the confidential mandate.',
  'Mars aspect Sun in 12th house : Ends':
    'Force fades. Shadow-lane gains lock in.',
  'Mars aspect Moon in 11th house':
    'Force on wide-network gains. Aggressive bonus moves, board-position pushes. Watch group-friction.',
  'Mars aspect Moon in 11th house : Starts':
    'Approach. Network-push gathers.',
  'Mars aspect Moon in 11th house : Exact':
    'Today force-on-network peaks. Demand the bonus.',
  'Mars aspect Moon in 11th house : Ends':
    'Force fades. Network gains locked.',
  'Mars aspect Mercury in 1st house':
    'Force on yogakaraka. Aggressive personal-craftsman moves — bold founder push.',
  'Mars aspect Mercury in 1st house : Starts':
    'Approach. Principal-craftsman gathers force.',
  'Mars aspect Mercury in 1st house : Exact':
    'Today force-on-yogakaraka peaks. Make bold founder demand.',
  'Mars aspect Mercury in 1st house : Ends':
    'Force fades. Lock pitch gains; rest.',
  'Mars aspect Venus in 7th house':
    'Force on partnership. Sharp negotiations — but cool the temperature before signing.',
  'Mars aspect Venus in 7th house : Starts':
    'Approach. Partnership friction gathers.',
  'Mars aspect Venus in 7th house : Exact':
    'Today partnership-force peaks. Demand JV terms; cool relational temperature.',
  'Mars aspect Venus in 7th house : Ends':
    'Force fades. Partnership consolidates.',
  'Mars aspect Mars in 8th house':
    'Mars return — surgical-execution peak. Crisis you walk into resolves under your hand.',
  'Mars aspect Mars in 8th house : Starts':
    'Mars return approaching. Transformation push gathers.',
  'Mars aspect Mars in 8th house : Exact':
    'Mars return peak. Walk into the burning room; stabilize the system.',
  'Mars aspect Mars in 8th house : Ends':
    'Mars return closing. Crisis-resolution on record.',
  'Mars aspect Jupiter in 4th house':
    'Force on home-throne / Hamsa. Aggressive property push, family-business confrontation. Keep home temperature low.',
  'Mars aspect Jupiter in 4th house : Starts':
    'Approach. Home-throne friction gathers.',
  'Mars aspect Jupiter in 4th house : Exact':
    'Today force-on-Jupiter-4H peaks. Property / family negotiation reaches its sharp point.',
  'Mars aspect Jupiter in 4th house : Ends':
    'Force fades. Home-throne consolidates.',
  'Mars aspect Saturn in 5th house':
    'Force on disciplined-creative engine. Push to ship long-form work; competitive contest.',
  'Mars aspect Saturn in 5th house : Starts':
    'Approach. Creative-discipline push gathers.',
  'Mars aspect Saturn in 5th house : Exact':
    'Today force-on-Saturn-5H peaks. Ship long-form work.',
  'Mars aspect Saturn in 5th house : Ends':
    'Force fades. Disciplined-creative gains lock in.',
  'Mars aspect Rahu in 9th house':
    'Force on foreign-dharma engine. Aggressive doctrinal disputes, foreign-stage assertions.',
  'Mars aspect Rahu in 9th house : Starts':
    'Approach. Dharma-fight gathers.',
  'Mars aspect Rahu in 9th house : Exact':
    'Today force-on-Rahu-9H peaks. Take doctrinal stand on foreign stage.',
  'Mars aspect Rahu in 9th house : Ends':
    'Force fades. Foreign-dharma stand on record.',
  'Mars aspect Ketu in 3rd house':
    'Force on detached-communication engine. Sharp solitary writing; fierce research.',
  'Mars aspect Ketu in 3rd house : Starts':
    'Approach. Fierce-solitary push gathers.',
  'Mars aspect Ketu in 3rd house : Exact':
    'Today force-on-Ketu-3H peaks. Ship the fierce research.',
  'Mars aspect Ketu in 3rd house : Ends':
    'Force fades. Solitary-research push consolidated.',

  // — Mercury aspects —
  'Mercury aspect Sun in 12th house':
    'Articulation on moksha-solar engine. Confidential mandate documentation; white papers.',
  'Mercury aspect Sun in 12th house : Starts':
    'Approach. Shadow-lane writing picks up pace.',
  'Mercury aspect Sun in 12th house : Exact':
    'Today shadow-lane articulation peaks. Ship the white paper.',
  'Mercury aspect Sun in 12th house : Ends':
    'Articulation fades. Shadow-lane document locked.',
  'Mercury aspect Moon in 11th house':
    'Articulation on wide-network gains. Alumni newsletter, community-platform posts, board-advisory memos.',
  'Mercury aspect Moon in 11th house : Starts':
    'Approach. Network-articulation gathers.',
  'Mercury aspect Moon in 11th house : Exact':
    'Today network-articulation peaks. Send alumni newsletter.',
  'Mercury aspect Moon in 11th house : Ends':
    'Articulation fades. Network-message on record.',
  'Mercury aspect Mercury in 1st house':
    'Mercury return — most important communication aspect of the chart. Bio refresh, founder-story, principal-craftsman pitch.',
  'Mercury aspect Mercury in 1st house : Starts':
    'Mercury return approaching. Prep personal-articulation refresh.',
  'Mercury aspect Mercury in 1st house : Exact':
    'Mercury return peak. Ship the bio.',
  'Mercury aspect Mercury in 1st house : Ends':
    'Mercury return closing. Yogakaraka articulation locked.',
  'Mercury aspect Venus in 7th house':
    'Articulation on partnership. Term sheets, JV memos, contract negotiations.',
  'Mercury aspect Venus in 7th house : Starts':
    'Approach. Partnership-articulation gathers.',
  'Mercury aspect Venus in 7th house : Exact':
    'Today partnership-articulation peaks. Ship the term sheet.',
  'Mercury aspect Venus in 7th house : Ends':
    'Articulation fades. Partnership documents on record.',
  'Mercury aspect Mars in 8th house':
    'Articulation on transformation. Restructuring memos, succession plans, insurance filings.',
  'Mercury aspect Mars in 8th house : Starts':
    'Approach. Transformation-articulation gathers.',
  'Mercury aspect Mars in 8th house : Exact':
    'Today crisis-articulation peaks. Ship the restructuring memo.',
  'Mercury aspect Mars in 8th house : Ends':
    'Articulation fades. Transformation document locked.',
  'Mercury aspect Jupiter in 4th house':
    'Articulation on home-throne / Hamsa. Real-estate paperwork, family-business memo.',
  'Mercury aspect Jupiter in 4th house : Starts':
    'Approach. Home-throne articulation gathers.',
  'Mercury aspect Jupiter in 4th house : Exact':
    'Today Hamsa-articulation peaks. Ship the real-estate doc.',
  'Mercury aspect Jupiter in 4th house : Ends':
    'Articulation fades. Home-throne document on record.',
  'Mercury aspect Saturn in 5th house':
    'Articulation on disciplined-creative engine. Long-form drafts, curriculum design, doctoral chapter completion.',
  'Mercury aspect Saturn in 5th house : Starts':
    'Approach. Disciplined-creative articulation gathers.',
  'Mercury aspect Saturn in 5th house : Exact':
    'Today Saturn-5H articulation peaks. Ship doctoral chapter.',
  'Mercury aspect Saturn in 5th house : Ends':
    'Articulation fades. Disciplined-creative document locked.',
  'Mercury aspect Rahu in 9th house':
    'Articulation on foreign-dharma engine. Foreign-publication submissions, certification applications.',
  'Mercury aspect Rahu in 9th house : Starts':
    'Approach. Foreign-dharma articulation gathers.',
  'Mercury aspect Rahu in 9th house : Exact':
    'Today Rahu-9H articulation peaks. Submit foreign-publication piece.',
  'Mercury aspect Rahu in 9th house : Ends':
    'Articulation fades. Foreign-dharma submission on record.',
  'Mercury aspect Ketu in 3rd house':
    'Articulation on detached-communication engine. Solitary research writing, deep-research notes.',
  'Mercury aspect Ketu in 3rd house : Starts':
    'Approach. Solitary-research writing gathers.',
  'Mercury aspect Ketu in 3rd house : Exact':
    'Today Ketu-3H articulation peaks. Ship the lineage-research piece.',
  'Mercury aspect Ketu in 3rd house : Ends':
    'Articulation fades. Solitary-research piece stands.',

  // — Moon aspects —
  'Moon aspect Sun in 12th house':
    'Emotional charge on moksha-solar engine. Inwardness, foreign-pull, confidential-relationship warmth.',
  'Moon aspect Sun in 12th house : Starts':
    'Approach. Shadow-lane warmth gathering.',
  'Moon aspect Sun in 12th house : Exact':
    'Today 12H emotional warmth peaks. Take the confidential warm-toned meeting.',
  'Moon aspect Sun in 12th house : Ends':
    'Warmth fades. Shadow-lane bond consolidated.',
  'Moon aspect Moon in 11th house':
    'Moon return — wide-network gains channel runs warm. Reach out to alumni, community.',
  'Moon aspect Moon in 11th house : Starts':
    'Moon return approaching. Network-warmth rising.',
  'Moon aspect Moon in 11th house : Exact':
    'Moon return peak. Take the warm alumni call.',
  'Moon aspect Moon in 11th house : Ends':
    'Moon return closing. Warm network gains on record.',
  'Moon aspect Mercury in 1st house':
    'Emotional charge on yogakaraka. Body wants warmth in principal-craftsman framing.',
  'Moon aspect Mercury in 1st house : Starts':
    'Approach. Personal-warmth rising.',
  'Moon aspect Mercury in 1st house : Exact':
    'Today personal-warmth peaks. Take the warm client meeting.',
  'Moon aspect Mercury in 1st house : Ends':
    'Warmth fades. Lock warm-channel relationships.',
  'Moon aspect Venus in 7th house':
    'Emotional charge on partnership. Read partner / principal-client temperature.',
  'Moon aspect Venus in 7th house : Starts':
    'Approach. Partnership-warmth rising.',
  'Moon aspect Venus in 7th house : Exact':
    'Today partnership-warmth peaks. Take warm-toned anchor meeting.',
  'Moon aspect Venus in 7th house : Ends':
    'Warmth fades. Lock warm-partner alliance.',
  'Moon aspect Mars in 8th house':
    'Emotional weight on transformation zone. Defer high-risk decisions two days.',
  'Moon aspect Mars in 8th house : Starts':
    'Approach. Crisis-emotion rising.',
  'Moon aspect Mars in 8th house : Exact':
    'Today crisis-weight peaks. Defer signings.',
  'Moon aspect Mars in 8th house : Ends':
    'Weight fades. Re-engage transformation work.',
  'Moon aspect Jupiter in 4th house':
    'Emotional charge on home-throne / Hamsa. Mother-channel warmth peaks.',
  'Moon aspect Jupiter in 4th house : Starts':
    'Approach. Home-warmth rising.',
  'Moon aspect Jupiter in 4th house : Exact':
    'Today home-warmth peaks. Cook the real meal.',
  'Moon aspect Jupiter in 4th house : Ends':
    'Warmth fades. Home-bond consolidated.',
  'Moon aspect Saturn in 5th house':
    'Emotional charge on disciplined-creative engine. Structured-creative work picks up emotional warmth.',
  'Moon aspect Saturn in 5th house : Starts':
    'Approach. Creative-warmth rising.',
  'Moon aspect Saturn in 5th house : Exact':
    'Today creative-warmth peaks. Add heart to rigorous output.',
  'Moon aspect Saturn in 5th house : Ends':
    'Warmth fades. Warm-rigorous work on record.',
  'Moon aspect Rahu in 9th house':
    'Emotional charge on foreign-dharma engine. Pilgrimage thought, international-introduction draft.',
  'Moon aspect Rahu in 9th house : Starts':
    'Approach. Foreign-dharma warmth rising.',
  'Moon aspect Rahu in 9th house : Exact':
    'Today Rahu-9H warmth peaks. Make foreign-teacher reach-out.',
  'Moon aspect Rahu in 9th house : Ends':
    'Warmth fades. Foreign-dharma bond on record.',
  'Moon aspect Ketu in 3rd house':
    'Emotional charge on detached-communication engine. Solitary-research mood.',
  'Moon aspect Ketu in 3rd house : Starts':
    'Approach. Solitary-research warmth rising.',
  'Moon aspect Ketu in 3rd house : Exact':
    'Today Ketu-3H warmth peaks. Write the brave message.',
  'Moon aspect Ketu in 3rd house : Ends':
    'Warmth fades. Solitary-research warmth locked.',

  // — Rahu aspects —
  'Rahu aspect Sun in 12th house':
    'Disruption on moksha-solar engine. Sudden foreign / confidential mandate; speculative shadow-lane work.',
  'Rahu aspect Sun in 12th house : Starts':
    'Approach. Disruptive shadow-lane move gathering.',
  'Rahu aspect Sun in 12th house : Exact':
    'Today Rahu-on-12H-Sun peaks. Take unconventional foreign mandate.',
  'Rahu aspect Sun in 12th house : Ends':
    'Disruption fading. Lock or release move.',
  'Rahu aspect Moon in 11th house':
    'Disruption on wide-network gains. Foreign-friend windfalls, viral-community moves.',
  'Rahu aspect Moon in 11th house : Starts':
    'Approach. Network-disruption gathering.',
  'Rahu aspect Moon in 11th house : Exact':
    'Today Rahu-on-network peaks. Ride viral wave.',
  'Rahu aspect Moon in 11th house : Ends':
    'Disruption fading. Decide which gains stay.',
  'Rahu aspect Mercury in 1st house':
    'Disruption on yogakaraka. Unconventional / foreign personal-brand pivot.',
  'Rahu aspect Mercury in 1st house : Starts':
    'Approach. Disruptive principal-craftsman move gathering.',
  'Rahu aspect Mercury in 1st house : Exact':
    'Today Rahu-on-yogakaraka peaks. Make unconventional public-brand move.',
  'Rahu aspect Mercury in 1st house : Ends':
    'Disruption fading. Lock breakthrough; drop overreach.',
  'Rahu aspect Venus in 7th house':
    'Disruption on partnership. Foreign-spouse / foreign-anchor-client window.',
  'Rahu aspect Venus in 7th house : Starts':
    'Approach. Disruptive partnership move gathering.',
  'Rahu aspect Venus in 7th house : Exact':
    'Today Rahu-on-Venus-7H peaks. Unconventional partner declaration lands.',
  'Rahu aspect Venus in 7th house : Ends':
    'Disruption fading. Unusual partnership consolidated.',
  'Rahu aspect Mars in 8th house':
    'Disruption on surgical-transformation engine. Speculative-equity events, unconventional inheritance.',
  'Rahu aspect Mars in 8th house : Starts':
    'Approach. Disruptive transformation gathering.',
  'Rahu aspect Mars in 8th house : Exact':
    'Today Rahu-on-Mars-8H peaks. Walk into high-velocity transformation; harness, do not chase.',
  'Rahu aspect Mars in 8th house : Ends':
    'Disruption fading. Transformation gains documented.',
  'Rahu aspect Jupiter in 4th house':
    'Disruption on home-throne / Hamsa. Foreign-property windows, unconventional family-business pivots.',
  'Rahu aspect Jupiter in 4th house : Starts':
    'Approach. Home-throne disruption gathering.',
  'Rahu aspect Jupiter in 4th house : Exact':
    'Today Rahu-on-Jupiter-4H peaks. Take foreign-property move.',
  'Rahu aspect Jupiter in 4th house : Ends':
    'Disruption fading. Unconventional move consolidated.',
  'Rahu aspect Saturn in 5th house':
    'Disruption on disciplined-creative engine. Speculative-creative windows, foreign-curriculum ventures.',
  'Rahu aspect Saturn in 5th house : Starts':
    'Approach. Creative-disruption gathering.',
  'Rahu aspect Saturn in 5th house : Exact':
    'Today Rahu-on-Saturn-5H peaks. Take speculative venture; ground in discipline.',
  'Rahu aspect Saturn in 5th house : Ends':
    'Disruption fading. Unconventional-creative output on record.',
  'Rahu aspect Rahu in 9th house':
    'Rahu return — foreign-dharma engine peaks. Unconventional teacher, foreign credentialing, disruptive doctrine.',
  'Rahu aspect Rahu in 9th house : Starts':
    'Rahu return approaching. Foreign-dharma chapter gathering.',
  'Rahu aspect Rahu in 9th house : Exact':
    'Rahu return peak. Make foreign-teacher / unconventional-doctrine move.',
  'Rahu aspect Rahu in 9th house : Ends':
    'Rahu return closing. Unconventional dharma path consolidated.',
  'Rahu aspect Ketu in 3rd house':
    'Nodal-axis activation on communication. Foreign / disruptive content channels.',
  'Rahu aspect Ketu in 3rd house : Starts':
    'Approach. Nodal-axis communication disruption gathering.',
  'Rahu aspect Ketu in 3rd house : Exact':
    'Today nodal-axis peak. Viral / foreign content move lands.',
  'Rahu aspect Ketu in 3rd house : Ends':
    'Nodal pressure fading. Unconventional content gains documented.',

  // — Saturn aspects —
  'Saturn aspect Sun in 12th house':
    'Discipline on moksha-solar engine. Long-arc confidential / foreign mandate.',
  'Saturn aspect Sun in 12th house : Starts':
    'Approach. Shadow-lane discipline cycle beginning.',
  'Saturn aspect Sun in 12th house : Exact':
    'Today Saturn-on-12H-Sun peaks. Lock long-arc confidential mandate.',
  'Saturn aspect Sun in 12th house : Ends':
    'Discipline phase closing. Shadow-lane structure in place.',
  'Saturn aspect Moon in 11th house':
    'Discipline on wide-network gains. Structural rebuild of channels.',
  'Saturn aspect Moon in 11th house : Starts':
    'Approach. Network-discipline cycle beginning.',
  'Saturn aspect Moon in 11th house : Exact':
    'Today Saturn-on-network peaks. Some friends fall away; deep ones lock in for life.',
  'Saturn aspect Moon in 11th house : Ends':
    'Discipline phase closing. Pruned network is structural.',
  'Saturn aspect Mercury in 1st house':
    'Discipline on yogakaraka. Slow personal-craftsman re-architecture. Body weight, posture tighten.',
  'Saturn aspect Mercury in 1st house : Starts':
    'Approach. Yogakaraka discipline cycle beginning.',
  'Saturn aspect Mercury in 1st house : Exact':
    'Today Saturn-on-yogakaraka peaks. Make lean, principled statement.',
  'Saturn aspect Mercury in 1st house : Ends':
    'Discipline phase closing. Leaner principal-craftsman in place.',
  'Saturn aspect Venus in 7th house':
    'Discipline on partnership. Marriage / anchor-client tested for structural soundness.',
  'Saturn aspect Venus in 7th house : Starts':
    'Approach. Partnership-discipline cycle beginning.',
  'Saturn aspect Venus in 7th house : Exact':
    'Today Saturn-on-Venus-7H peaks. Structural partnership decision lands.',
  'Saturn aspect Venus in 7th house : Ends':
    'Discipline phase closing. Sound partnership on record.',
  'Saturn aspect Mars in 8th house':
    'Discipline on surgical-transformation engine. Heavy-but-gold restructuring.',
  'Saturn aspect Mars in 8th house : Starts':
    'Approach. Transformation-discipline cycle beginning.',
  'Saturn aspect Mars in 8th house : Exact':
    'Today Saturn-on-Mars-8H peaks. Lock long-arc restructuring.',
  'Saturn aspect Mars in 8th house : Ends':
    'Discipline phase closing. Structural transformation in place.',
  'Saturn aspect Jupiter in 4th house':
    'Discipline on home-throne / Hamsa. Heavy chapter for property, mother\'s health.',
  'Saturn aspect Jupiter in 4th house : Starts':
    'Approach. Home-throne discipline cycle beginning.',
  'Saturn aspect Jupiter in 4th house : Exact':
    'Today Saturn-on-Jupiter-4H peaks. Structural home / family decision lands.',
  'Saturn aspect Jupiter in 4th house : Ends':
    'Discipline phase closing. Home-throne foundation structural.',
  'Saturn aspect Saturn in 5th house':
    'Saturn return — disciplined-creative chapter peak. Multi-decade moat laid here.',
  'Saturn aspect Saturn in 5th house : Starts':
    'Saturn return approaching. Disciplined-creative chapter gathering.',
  'Saturn aspect Saturn in 5th house : Exact':
    'Saturn return peak. Lock institutional curriculum.',
  'Saturn aspect Saturn in 5th house : Ends':
    'Saturn return closing. Multi-decade creative moat in place.',
  'Saturn aspect Rahu in 9th house':
    'Discipline on foreign-dharma engine. Slow foreign credentialing.',
  'Saturn aspect Rahu in 9th house : Starts':
    'Approach. Foreign-dharma discipline cycle beginning.',
  'Saturn aspect Rahu in 9th house : Exact':
    'Today Saturn-on-Rahu-9H peaks. Lock foreign credential.',
  'Saturn aspect Rahu in 9th house : Ends':
    'Discipline phase closing. Foreign-dharma structure in place.',
  'Saturn aspect Ketu in 3rd house':
    'Discipline on detached-communication engine. Long-form solitary research.',
  'Saturn aspect Ketu in 3rd house : Starts':
    'Approach. Solitary-research discipline cycle beginning.',
  'Saturn aspect Ketu in 3rd house : Exact':
    'Today Saturn-on-Ketu-3H peaks. Lock long-form project.',
  'Saturn aspect Ketu in 3rd house : Ends':
    'Discipline phase closing. Lineage-research output on record.',

  // — Sun aspects —
  'Sun aspect Sun in 12th house':
    'Solar return through 12th. Annual peak for confidential mandates, foreign work, retreats.',
  'Sun aspect Sun in 12th house : Starts':
    'Solar return approaching. Prep year-block strategic drafts.',
  'Sun aspect Sun in 12th house : Exact':
    'Solar return peak. Take new-year strategic drafts done alone.',
  'Sun aspect Sun in 12th house : Ends':
    'Solar return closing. Shadow-lane strategy on record.',
  'Sun aspect Moon in 11th house':
    'Solar light on wide-network gains. Bonus-pool conversations, alumni introductions warm up.',
  'Sun aspect Moon in 11th house : Starts':
    'Approach. Network-spotlight gathering.',
  'Sun aspect Moon in 11th house : Exact':
    'Today network-spotlight peaks. Take alumni call.',
  'Sun aspect Moon in 11th house : Ends':
    'Spotlight fades. Lock network-recognition.',
  'Sun aspect Mercury in 1st house':
    'Solar light on yogakaraka. Annual peak for personal-craftsman visibility.',
  'Sun aspect Mercury in 1st house : Starts':
    'Approach. Yogakaraka spotlight gathering.',
  'Sun aspect Mercury in 1st house : Exact':
    'Today yogakaraka spotlight peaks. Make founder declaration.',
  'Sun aspect Mercury in 1st house : Ends':
    'Spotlight fades. Lock principal-craftsman appointment.',
  'Sun aspect Venus in 7th house':
    'Solar light on partnership. Visibility through contracts; spouse / principal-client dynamics light up.',
  'Sun aspect Venus in 7th house : Starts':
    'Approach. Partnership-spotlight gathering.',
  'Sun aspect Venus in 7th house : Exact':
    'Today partnership-spotlight peaks. Sign anchor partnership.',
  'Sun aspect Venus in 7th house : Ends':
    'Spotlight fades. Lock public partnership.',
  'Sun aspect Mars in 8th house':
    'Solar light on surgical-transformation engine. Career decisions take surgical edge.',
  'Sun aspect Mars in 8th house : Starts':
    'Approach. Transformation-spotlight gathering.',
  'Sun aspect Mars in 8th house : Exact':
    'Today crisis-spotlight peaks. Lead the restructuring.',
  'Sun aspect Mars in 8th house : Ends':
    'Spotlight fades. Lock transformation gains.',
  'Sun aspect Jupiter in 4th house':
    'Solar light on home-throne / Hamsa. Real-estate decisions, family-business inflections.',
  'Sun aspect Jupiter in 4th house : Starts':
    'Approach. Home-throne spotlight gathering.',
  'Sun aspect Jupiter in 4th house : Exact':
    'Today Hamsa-spotlight peaks. Make property purchase, family-business move.',
  'Sun aspect Jupiter in 4th house : Ends':
    'Spotlight fades. Lock home-throne move.',
  'Sun aspect Saturn in 5th house':
    'Solar light on disciplined-creative engine. Best for launching long-form work.',
  'Sun aspect Saturn in 5th house : Starts':
    'Approach. Creative-discipline spotlight gathering.',
  'Sun aspect Saturn in 5th house : Exact':
    'Today Saturn-5H spotlight peaks. Ship long-form work.',
  'Sun aspect Saturn in 5th house : Ends':
    'Spotlight fades. Lock structured-creative output.',
  'Sun aspect Rahu in 9th house':
    'Solar light on foreign-dharma engine. International-stage talks, certifications.',
  'Sun aspect Rahu in 9th house : Starts':
    'Approach. Foreign-dharma spotlight gathering.',
  'Sun aspect Rahu in 9th house : Exact':
    'Today Rahu-9H spotlight peaks. Take foreign-stage talk.',
  'Sun aspect Rahu in 9th house : Ends':
    'Spotlight fades. Lock foreign-dharma recognition.',
  'Sun aspect Ketu in 3rd house':
    'Solar light on detached-communication engine. Brave solitary-research push gets quiet recognition.',
  'Sun aspect Ketu in 3rd house : Starts':
    'Approach. Solitary-research spotlight gathering.',
  'Sun aspect Ketu in 3rd house : Exact':
    'Today Ketu-3H spotlight peaks. Publish solitary research.',
  'Sun aspect Ketu in 3rd house : Ends':
    'Spotlight fades. Solitary-research output on record.',

  // — Venus aspects —
  'Venus aspect Sun in 12th house':
    'Charm on moksha-solar engine. Foreign-warmth, confidential-collaboration, retreat-relationships.',
  'Venus aspect Sun in 12th house : Starts':
    'Approach. Shadow-lane warmth gathering.',
  'Venus aspect Sun in 12th house : Exact':
    'Today Venus-on-12H-Sun peaks. Take warm confidential meeting.',
  'Venus aspect Sun in 12th house : Ends':
    'Charm fades. Shadow-lane warmth locked.',
  'Venus aspect Moon in 11th house':
    'Charm on wide-network gains. Bonus-pool warm conversations, alumni warm intros.',
  'Venus aspect Moon in 11th house : Starts':
    'Approach. Network-charm gathering.',
  'Venus aspect Moon in 11th house : Exact':
    'Today Venus-on-network peaks. Take warm board call.',
  'Venus aspect Moon in 11th house : Ends':
    'Charm fades. Lock warm-network bonds.',
  'Venus aspect Mercury in 1st house':
    'Charm on yogakaraka. Personal-craftsman framing radiates.',
  'Venus aspect Mercury in 1st house : Starts':
    'Approach. Yogakaraka-charm gathering.',
  'Venus aspect Mercury in 1st house : Exact':
    'Today Venus-on-yogakaraka peaks. Sign warm contracts.',
  'Venus aspect Mercury in 1st house : Ends':
    'Charm fades. Lock warm-channel relationships.',
  'Venus aspect Venus in 7th house':
    'Venus return — partnership engine peaks. Sign anchor deal, marry, lock principal client.',
  'Venus aspect Venus in 7th house : Starts':
    'Venus return approaching. Prep partnership move.',
  'Venus aspect Venus in 7th house : Exact':
    'Venus return peak. Lock structural partnership.',
  'Venus aspect Venus in 7th house : Ends':
    'Venus return closing. Partnership on record.',
  'Venus aspect Mars in 8th house':
    'Charm on surgical-transformation engine. Severance / inheritance / restructuring negotiated warmly.',
  'Venus aspect Mars in 8th house : Starts':
    'Approach. Transformation-warmth gathering.',
  'Venus aspect Mars in 8th house : Exact':
    'Today Venus-on-Mars-8H peaks. Negotiate the inheritance with grace.',
  'Venus aspect Mars in 8th house : Ends':
    'Charm fades. Warm transformation on record.',
  'Venus aspect Jupiter in 4th house':
    'Charm on home-throne / Hamsa. Real-estate beauty decisions, mother-channel warmth.',
  'Venus aspect Jupiter in 4th house : Starts':
    'Approach. Home-throne charm gathering.',
  'Venus aspect Jupiter in 4th house : Exact':
    'Today Hamsa-charm peaks. Take warm property meeting.',
  'Venus aspect Jupiter in 4th house : Ends':
    'Charm fades. Lock warm home-throne move.',
  'Venus aspect Saturn in 5th house':
    'Charm on disciplined-creative engine. Structured craft picks up graceful surface.',
  'Venus aspect Saturn in 5th house : Starts':
    'Approach. Creative-charm gathering.',
  'Venus aspect Saturn in 5th house : Exact':
    'Today Venus-on-Saturn-5H peaks. Rigorous-creative work picks up grace.',
  'Venus aspect Saturn in 5th house : Ends':
    'Charm fades. Graceful-rigorous output on record.',
  'Venus aspect Rahu in 9th house':
    'Charm on foreign-dharma engine. Foreign-stage talks land warmly.',
  'Venus aspect Rahu in 9th house : Starts':
    'Approach. Foreign-dharma charm gathering.',
  'Venus aspect Rahu in 9th house : Exact':
    'Today Venus-on-Rahu-9H peaks. Take warm foreign-stage talk.',
  'Venus aspect Rahu in 9th house : Ends':
    'Charm fades. Warm foreign-dharma bond on record.',
  'Venus aspect Ketu in 3rd house':
    'Charm on detached-communication engine. Warm message that does not need a reply.',
  'Venus aspect Ketu in 3rd house : Starts':
    'Approach. Solitary-research warmth gathering.',
  'Venus aspect Ketu in 3rd house : Exact':
    'Today Venus-on-Ketu-3H peaks. Send warm note that does not need a reply.',
  'Venus aspect Ketu in 3rd house : Ends':
    'Charm fades. Gentle-research bond on record.',
};
