// db/_virgo_relationship.js
// RELATIONSHIP fills for representative Virgo ascendant native.
// Internal natal reference (do NOT echo as preamble in copy):
//   Mercury Virgo 1H (own + exalted — Bhadra Yoga, yogakaraka 1L+10L)
//   Venus Pisces 7H (exalted — Malavya Yoga, 2L+9L Dhana-Dharma)
//   Jupiter Sagittarius 4H (own — Hamsa Yoga, 4L+7L)
//   Sun Leo 12H (own) · Moon Cancer 11H (own — 11L in 11H)
//   Mars Aries 8H (own) · Saturn Capricorn 5H (own — 5L+6L)
//   Rahu Taurus 9H · Ketu Scorpio 3H

module.exports = {
  // ───────────────────────────────────── RULERS (12) ─────────────────────────
  'Mercury ruler of the 1st House in the 1st House':
    'You are read as the analytical, precise, articulate one in every relationship — and that is exactly the magnetic field. The right partner is drawn to your sharpness, your detail-care, your discriminating mind. Imperfection-spotting is your love language; learn to spend it on the world\'s problems together rather than the partner\'s small flaws. The body is a finely-tuned instrument; partners who respect routine, sleep, food-purity, and quiet thrive here. The shadow: the same precision that attracts can corrode if it slides into chronic critique. Be ruthless with the systems and gentle with the human.',
  'Venus ruler of the 2nd House in the 7th House':
    'The spouse is also the family-money channel and the dharma teacher — three threads woven into one person. The right partnership funds the household, expands the wisdom, and stabilizes the voice. Marriage tends toward formal, traditional, ceremonially-anchored unions; the legal-and-relational structure carries weight. In-laws often become genuine financial allies. The shadow: a bad partnership detonates wealth and dharma simultaneously, so partner selection deserves more deliberation than any other life decision.',
  'Mars ruler of the 3rd House in the 8th House':
    'Sibling dynamics carry transformational charge. Brothers and sisters are involved in some of your hardest, most-rebuilding chapters — inheritance disputes, health crises, restructuring of family roles. Communication style with siblings tends sharp, sometimes surgical. The shadow: small communication conflicts that escalate into 8th-house permanent fractures. Cool the message before it goes; siblings will outlive friends.',
  'Jupiter ruler of the 4th House in the 4th House':
    'The home is a teaching environment. Your mother (or mother-figure) is the original wisdom-source; her conversations shape your dharma. Family gatherings have a doctrinal, lineage-conscious quality. The partner you bring home will be evaluated by family elders for ethical fit, not just emotional fit. The shadow: parental dharma-projection — the family\'s preferred path may not be your dharma. Honor the lineage but choose the partner yourself.',
  'Saturn ruler of the 5th House in the 5th House':
    'Children, romance, and creative-collaborator relationships all run on a slow-burn, structured cadence. Romance feels like a long-term apprenticeship; love-at-first-sight is rare here. Children arrive late but stay loyal, often becoming structural-creative collaborators in middle life. The shadow: the inner-critic showing up in romance — the partner needs warmth, not the audit. Schedule discipline-free zones with children and lovers.',
  'Saturn ruler of the 6th House in the 5th House':
    'Conflict-management lives in the same chamber as romance and children — meaning your relational disputes often have a structural / fairness / boundary-rules character. Daily-routine alignment with the partner matters more than peak-romance moments. Fights are usually about whose system gets followed. The shadow: turning the relationship into a compliance audit; in the 5th, warmth must outweigh fairness.',
  'Jupiter ruler of the 7th House in the 4th House':
    'Spouse arrives through home, family, lineage, mother-channel introductions. The marriage itself often happens at the family seat or through an inherited tradition. The 7L in 4H means the marital home is the spiritual home — the place where your deepest peace lives. The shadow: confusing the family\'s preferred partner with your dharma-correct partner; check whether your love is yours or the lineage\'s.',
  'Mars ruler of the 8th House in the 8th House':
    'Crisis is a regular guest in the partnership. The spouse may go through a health, inheritance, or career-transformation chapter where you carry the weight; or you may, with the spouse carrying. The partnership is forged through these crises, not despite them. The shadow: thrill-seeking that confuses adrenaline for intimacy. The 8th here rewards the disciplined surgeon-spouse, not the cowboy-spouse.',
  'Venus ruler of the 9th House in the 7th House':
    'Your principal teacher tends to become your principal partner, or vice versa. Foreign-spouse, foreign-teacher, or foreign-met-on-pilgrimage partnership is a real structural possibility here. The dharma and the warmth converge. The shadow: confusing partner-pleasure with dharma-truth; check whether the principle requires this person, or whether the comfort does.',
  'Mercury ruler of the 10th House in the 1st House':
    'The public-self / professional-identity is welded to who you are personally — meaning your partner will inevitably be drawn into the work. Best partnerships are with people who can hold the work-identity warmly, who do not need you to be off-duty to feel loved. The shadow: identity-collapse into the role, leaving the partner a spectator; protect the off-duty hours.',
  'Moon ruler of the 11th House in the 11th House':
    'Friend-circles, alumni, communities, and peer-trust networks are the deepest sustained relational infrastructure. The Moon-own here makes long-arc female friendships especially load-bearing. The right partner integrates with this network warmly; the wrong one isolates you from it. The shadow: emotional dependency on group-mood; protect your sleep on big network weeks.',
  'Sun ruler of the 12th House in the 12th House':
    'Solitude, retreat, foreign-travel, and behind-the-scenes time are non-negotiable for your relational health. The right partner respects, even cherishes, your need for monastic solitude. Father-figure dynamics often play out abroad or behind closed doors. The shadow: the lonely 12H Sun can isolate inside the relationship — name the need for solitude rather than disappearing into it.',

  // ─────────────────────────────────── DISPOSITORS (7) ───────────────────────
  'Mercury in 1st (Dispositor)':
    'When this engine fires, the analytical-precision identity attracts the right partner. The body, the bio, the way you articulate yourself in the room is the relational signal.',
  'Venus in 7th (Dispositor)':
    'When this engine fires, the partnership pays out emotionally and financially. Anchor partner, spouse, principal collaborator carry the chapter. Most central relational engine for this chart.',
  'Jupiter in 4th (Dispositor)':
    'When this engine fires, the home-and-lineage channel anchors the relationship. Mother-line introduction, family-seat moment, in-law warmth all show up here.',
  'Mars in 8th (Dispositor)':
    'When this engine fires, the relationship transforms through crisis. Inheritance, health, succession events welded into the partnership.',
  'Saturn in 5th (Dispositor)':
    'When this engine fires, structured romance and child-related decisions land. Slow-burn love consolidation, mentor-of-mentees relationships solidify.',
  'Moon in 11th (Dispositor)':
    'When this engine fires, the wide-network warmth peaks. Alumni-friends, community bonds, peer-trust circles all carry weight.',
  'Sun in 12th (Dispositor)':
    'When this engine fires, the confidential / foreign / retreat relationship matters. The bond that lives off-stage carries the chapter.',

  // ──────────────────────────────────── TRANSITS (108) ───────────────────────
  // — Sun transits —
  'Sun Transits the 1st House':
    'Annual peak personal-magnetism window. The body radiates; the right partner sees you clearly. Best month for taking the relationship public, the founder-photo moment with partner, the principal-couple framing.',
  'Sun Transits the 2nd House':
    'Solar light on family-finance and voice in the relationship. Money conversations with partner land warmly. Speak the financial truth gently.',
  'Sun Transits the 3rd House':
    'Solar courage on communication. Send the brave message, have the postponed conversation with the sibling, address the friction. Ketu zone — keep the message warm.',
  'Sun Transits the 4th House':
    'Solar fire on the home-throne. Bring the partner home, host the family meal, take the in-law meeting. Hamsa territory — relational warmth radiates from the family seat.',
  'Sun Transits the 5th House':
    'Solar fire on romance and children. Best window for the romantic gesture, the child-related decision, the creative-collaboration with partner. Saturn-territory — slow-burn romance peaks.',
  'Sun Transits the 6th House':
    'Solar fire on conflict-management. Best window for the postponed clearing-the-air conversation, the boundary-setting, the daily-routine recalibration with partner.',
  'Sun Transits the 7th House':
    'Solar return-style activation of partnership. Annual peak relational visibility window. Marry, sign the JV, take the relationship public. Venus-7H territory — the warmth is structural here.',
  'Sun Transits the 8th House':
    'Solar light in the transformation chamber. Crisis-events in partnership land here — health, inheritance, succession. Walk slowly; the partnership is being forged.',
  'Sun Transits the 9th House':
    'Solar light on dharma-alignment in the relationship. Pilgrimage with partner, foreign travel, teacher-tradition exploration together. Rahu zone — unconventional shared dharma surfaces.',
  'Sun Transits the 10th House':
    'Solar fire on the public-couple identity. Career-relationship intersections — partner attends the public event, the joint introduction, the public principal-couple moment.',
  'Sun Transits the 11th House':
    'Solar fire on friend-circles and wide-network bonds. Alumni reunion warmth, community gathering with partner, peer-circle re-engagement. Moon-territory carries the warmth.',
  'Sun Transits the 12th House':
    'Solar return through 12H. Annual peak for retreat-with-partner, foreign travel, off-grid relational windows. Light dimmed publicly but intimacy quietens beautifully.',

  // — Moon transits —
  'Moon Transits the 1st House':
    'Two-day window of emotional charge on persona. The body wants warmth; the partner reads you tenderly. Take the warm-toned relational meeting.',
  'Moon Transits the 2nd House':
    'Emotional charge on family-finance and voice. Soft-spoken money conversations land; speak the financial truth gently with partner.',
  'Moon Transits the 3rd House':
    'Emotional charge on communication. The brave warm message lands; sibling-channel reaches out. Ketu zone — keep the message anchored.',
  'Moon Transits the 4th House':
    'Emotional pull to the home-throne. Mother-channel call, family gathering, partner-at-home warmth. Cook a real meal together.',
  'Moon Transits the 5th House':
    'Emotional charge on romance and children. The child wants the warm hour; the partner wants the playful moment; honor both.',
  'Moon Transits the 6th House':
    'Emotional charge on conflict-management. The partner may push the trigger; respond from documentation, not reaction.',
  'Moon Transits the 7th House':
    'Emotional charge on partnership. Read the spouse / principal-client temperature before the meeting. Warm tone wins the day.',
  'Moon Transits the 8th House':
    'Emotional weight on transformation zone. Defer high-stakes relationship decisions two days. Old fears around chaos surface for processing.',
  'Moon Transits the 9th House':
    'Emotional pull toward shared dharma. The pilgrimage thought, the foreign-trip-with-partner draft, the teacher-tradition exploration.',
  'Moon Transits the 10th House':
    'Emotional charge on the public-couple identity. Senior-relationship dynamics light up; the public moment with partner reads warm.',
  'Moon Transits the 11th House':
    'Moon-own peak for wide-network warmth. Alumni reach-outs, community-friend reconnections, peer-circle warmth. Take the warm group call.',
  'Moon Transits the 12th House':
    'Emotional inwardness; foreign and behind-the-scenes pull. Best for retreat planning, dream-led relational drafting, intimate solitude.',

  // — Mercury transits —
  'Mercury Transits the 1st House':
    'Mercury through own + exalted lagna. Peak self-articulation in relationships. Refresh the way you describe yourself to partner; clarify the relational expectations cleanly.',
  'Mercury Transits the 2nd House':
    'Sharp money-and-voice articulation in the relationship. Have the postponed family-finance conversation; pin the joint pricing; record the shared values.',
  'Mercury Transits the 3rd House':
    'Mercury\'s home turf for short-burst communication. Peak window for sibling-channel deals, written outreach to partner, candid sales of your relational truth.',
  'Mercury Transits the 4th House':
    'Sharp home-throne articulation. The family-business memo, the in-law correspondence, the lineage-conscious documentation of relational decisions.',
  'Mercury Transits the 5th House':
    'Sharp creative articulation in romance and children. Love letter, child-curriculum design, structured-creative collaboration with partner.',
  'Mercury Transits the 6th House':
    'Sharp conflict-management articulation. Documentation of the dispute, written boundary-setting, surgical clearing-the-air memo.',
  'Mercury Transits the 7th House':
    'Sharp partnership articulation. Term sheets, prenups, JV memos, contract negotiations — the relational paperwork lands cleanly.',
  'Mercury Transits the 8th House':
    'Sharp transformation-zone articulation. Inheritance documents, succession plans, will-related conversations with partner.',
  'Mercury Transits the 9th House':
    'Sharp dharma-articulation in the relationship. Foreign-travel-plan discussion with partner, doctrinal-alignment conversation, shared-teacher-exploration.',
  'Mercury Transits the 10th House':
    'Mercury through 10L\'s domain — peak public-couple articulation. Joint announcements, principal-couple framing, public-relationship documentation.',
  'Mercury Transits the 11th House':
    'Sharp wide-network articulation. Group-chat updates, alumni-reunion organization, community-bond explicit documentation.',
  'Mercury Transits the 12th House':
    'Sharp confidential-relational articulation. Private letters, retreat-planning, off-grid relational drafts.',

  // — Venus transits —
  'Venus Transits the 1st House':
    'Personal-magnetism peak. Body, voice, taste, presence radiate. Partner sees you at your most attractive; client meetings convert with relational warmth.',
  'Venus Transits the 2nd House':
    'Venus on family-finance and voice. Joint-money decisions land warmly; verbal endearments come easily; family-money harmony peaks.',
  'Venus Transits the 3rd House':
    'Charm on communication. The warm message lands. Sibling-channel reconnections favored. Ketu zone — keep the warmth concrete.',
  'Venus Transits the 4th House':
    'Venus on the home-throne. Real-estate-with-partner decisions, mother-channel warmth, family-business soft-power moves.',
  'Venus Transits the 5th House':
    'Charm on romance and children. Best window for romantic gestures, child-celebration moments, creative-collaboration with partner.',
  'Venus Transits the 6th House':
    'Charm in conflict zone. The mediation, the diplomatic resolution, the gracefully-handled relational fight. Warmth disarms.',
  'Venus Transits the 7th House':
    'Venus return through own exalted 7th. Monthly peak partnership window. Sign the anchor relational contract, marry, lock the principal partner. Most important Venus transit of the year.',
  'Venus Transits the 8th House':
    'Charm in transformation zone. Severance / inheritance / health-crisis negotiated warmly with partner. Relational humanity in hard chapters.',
  'Venus Transits the 9th House':
    'Charm on dharma-alignment. Foreign-stage pilgrimage with partner, ethical-investment conversation, teacher-mentor warmth shared.',
  'Venus Transits the 10th House':
    'Charm on public-couple identity. Board-level couple events, principal-couple public moments, status-with-grace appearances.',
  'Venus Transits the 11th House':
    'Charm in wide-network zone. Alumni warmth, community-bond peaks, peer-circle relational gains.',
  'Venus Transits the 12th House':
    'Charm in moksha zone. Foreign-warmth, confidential intimacy, retreat-relationships, off-grid romantic windows.',

  // — Mars transits —
  'Mars Transits the 1st House':
    'Surge of force on persona. Sharp personal demands; bold relational pushes — but watch friction. The body burns hot; rest tonight.',
  'Mars Transits the 2nd House':
    'Force on family-finance and voice. Aggressive money conversations, sharp vocal demands. Avoid sharp tones in joint-finance discussions.',
  'Mars Transits the 3rd House':
    'Force on communication. Sibling friction risk; bold messaging. Ketu-zone — bluntness can land cold; check warmth.',
  'Mars Transits the 4th House':
    'Force on home-throne. Property-related disputes, family-business friction, in-law confrontation. Keep the temperature low at home.',
  'Mars Transits the 5th House':
    'Force on romance and children. Sharp playfulness or sharp friction with kids/partner; channel into creative-competitive games.',
  'Mars Transits the 6th House':
    'Force on conflict-management. Best window for offensive action — the boundary-setting confrontation, the lawsuit, the firing. Adversaries weaken.',
  'Mars Transits the 7th House':
    'Force on partnership. Sharp negotiations — but watch friction with spouse. Cool the temperature before signing or arguing.',
  'Mars Transits the 8th House':
    'Mars through own territory — surgical-execution window. Crisis events in partnership resolve under your hand. Walk slow, document.',
  'Mars Transits the 9th House':
    'Force on shared dharma. Aggressive doctrinal disputes with partner, sharp travel-plan negotiations, teacher-tradition disputes.',
  'Mars Transits the 10th House':
    'Force on public-couple identity. Joint career pushes, sharp principal-couple demands, competitive public appearances.',
  'Mars Transits the 11th House':
    'Force on wide-network. Aggressive group dynamics, sharp alumni-politics. Watch group friction with peers.',
  'Mars Transits the 12th House':
    'Force in moksha zone. Foreign-front aggressive moves with partner, confidential mandate sharpness. Protect intimacy from work-bleed.',

  // — Jupiter transits —
  'Jupiter Transits the 1st House':
    'Annual wisdom-on-self window. The body, the personal brand, the public self pick up dharma weight. Best year for personal-credential rebranding visible to partner.',
  'Jupiter Transits the 2nd House':
    'Wisdom on family-finance and voice. Year-block to expand voice-led income, refine joint-finance ethics, take on dharma-aligned wealth structures with partner.',
  'Jupiter Transits the 3rd House':
    'Wisdom on communication. Year-block to publish the relational truth, formalize the writing practice. Ketu-zone — keep the doctrine grounded.',
  'Jupiter Transits the 4th House':
    'Jupiter return through own + Hamsa-Yoga territory. Year-block for property purchase with partner, family-business inflection, mother-line teaching. Almost every major home decision compounds during this window.',
  'Jupiter Transits the 5th House':
    'Wisdom on romance and children. Year-block for child-related milestones, structured romantic consolidation, mentor-of-mentees relationships.',
  'Jupiter Transits the 6th House':
    'Wisdom in conflict-zone. Year-block where adversaries weaken, debts repay, regulatory clarity arrives. Health regimens institutionalize between partners.',
  'Jupiter Transits the 7th House':
    'Wisdom on partnership. Year-block for marriage, JV consolidation, anchor-client dharma-alignment, foreign-spouse / foreign-teacher partnerships.',
  'Jupiter Transits the 8th House':
    'Wisdom in transformation zone. Year-block for inheritance with partner, succession planning, longevity advisory together.',
  'Jupiter Transits the 9th House':
    'Wisdom in dharma-territory. Year-block for foreign-pilgrimage with partner, teacher-track elevation, doctrinal-alignment moves together.',
  'Jupiter Transits the 10th House':
    'Wisdom on public-couple identity. Year-block for the principal-couple appointment, joint lineage transfer, senior-track elevation together.',
  'Jupiter Transits the 11th House':
    'Wisdom in wide-network gains zone. Year-block for cooperative-platform leadership with partner, alumni-network institutionalization.',
  'Jupiter Transits the 12th House':
    'Wisdom in moksha zone. Year-block for retreat-residency with partner, foreign-research mandates together, white-paper publications.',

  // — Saturn transits —
  'Saturn Transits the 1st House':
    'Saturn on persona. ~2.5-year discipline-on-self chapter. Body weight, posture, public framing tighten; partner sees the leaner you re-emerge.',
  'Saturn Transits the 2nd House':
    'Saturn on family-finance. Lean years on the joint balance sheet — structural rather than punitive. Voice deepens; money truths get said.',
  'Saturn Transits the 3rd House':
    'Saturn on communication. Rigorous editing of the relational message; sibling-channel relationships restructure. The loneliness during this period can be productive if held.',
  'Saturn Transits the 4th House':
    'Saturn on the home-throne. Heavy chapter for property, mother\'s health, family-business — but the *real* foundations of the home are built here.',
  'Saturn Transits the 5th House':
    'Saturn return through own 5H. ~2.5-year peak for structured romantic consolidation, child-related milestones requiring patience. Slow-burn romance reaches commitment-readiness.',
  'Saturn Transits the 6th House':
    'Saturn on adversary/health/debt. Long grind chapter — adversaries deplete themselves; health regimens become protocol-grade between partners.',
  'Saturn Transits the 7th House':
    'Saturn on partnership. Marriage / anchor-client tested for structural soundness. Weak partnerships fall away; sound ones harden into multi-decade ones. Exalted Venus 7H softens the lesson.',
  'Saturn Transits the 8th House':
    'Saturn on transformation zone. Heavy-but-gold chapter for inheritance / succession with partner. Walk slow; the surgical work pays.',
  'Saturn Transits the 9th House':
    'Saturn on dharma. Long-arc shared-doctrine chapter; foreign-teacher relationships tested for soundness. Weak teachers fall away.',
  'Saturn Transits the 10th House':
    'Saturn on public-couple identity. ~2.5 years of slow elevation to the senior-couple track. Flashy-couple peers rotate; you remain.',
  'Saturn Transits the 11th House':
    'Saturn on wide-network. Structural rebuild of alumni / community / peer-circle channels. Some friends fall away; deep ones lock in for life.',
  'Saturn Transits the 12th House':
    'Saturn on moksha-zone. Heavy chapter for retreat-residency, foreign-mandate relationship, hospital/prison-related service. Body needs more sleep; honor it.',

  // — Rahu transits —
  'Rahu Transits the 1st House':
    'Rahu on persona. ~18-month chapter of unconventional self-presentation in relationships. Risk: identity-overreach. Reward: breakthrough magnetism.',
  'Rahu Transits the 2nd House':
    'Rahu on family-finance. Speculative joint-income windows, foreign-currency exposure, unconventional vocal-led ventures with partner.',
  'Rahu Transits the 3rd House':
    'Rahu on communication. Foreign / disruptive content channels, viral writing about relational truth, unconventional sibling-network deals.',
  'Rahu Transits the 4th House':
    'Rahu on home-throne. Foreign-property windows with partner, unconventional family-business pivots, mother-line disruption.',
  'Rahu Transits the 5th House':
    'Rahu on romance and children. Speculative-romantic windows, foreign-curriculum ventures, viral creative collaboration with partner.',
  'Rahu Transits the 6th House':
    'Rahu on adversary-zone. Unconventional enemies, foreign litigation, viral conflict — Rahu in 6 typically defeats adversaries.',
  'Rahu Transits the 7th House':
    'Rahu on partnership. Foreign-spouse / foreign-anchor-client window, unconventional JV structures. Exalted Venus absorbs Rahu well.',
  'Rahu Transits the 8th House':
    'Rahu on transformation. Speculative-equity events with partner, unconventional inheritance, foreign restructuring shared.',
  'Rahu Transits the 9th House':
    'Rahu return through 9H. ~18-month foreign-dharma chapter — unconventional teacher with partner, foreign credentialing together.',
  'Rahu Transits the 10th House':
    'Rahu on public-couple identity. Sudden public-couple elevation through disruptive channels — viral case study, foreign-stage breakthrough.',
  'Rahu Transits the 11th House':
    'Rahu on wide-network. Foreign-friend windfalls, viral community moves, unconventional board appointments shared.',
  'Rahu Transits the 12th House':
    'Rahu on moksha-zone. Foreign-retreat residencies with partner, confidential disruptive mandates, off-balance-sheet shared structures.',

  // — Ketu transits —
  'Ketu Transits the 1st House':
    'Ketu on persona. Detachment from public visibility; identity-stripping chapter. The ego-self thins — useful for sabbatical thinking with partner.',
  'Ketu Transits the 2nd House':
    'Ketu on family-finance. Detachment from family-money attachment; voice quieter. Don\'t monetize the silence with partner.',
  'Ketu Transits the 3rd House':
    'Ketu return through own territory. Detachment from communication noise; sibling-channel disengagement. Best for solitary thinking; worst for relational marketing.',
  'Ketu Transits the 4th House':
    'Ketu on home-throne. Detachment from family-business attachment; property decisions feel oddly indifferent. Defer big purchases.',
  'Ketu Transits the 5th House':
    'Ketu on romance and children. Detachment from validation-romantic impulse. Saturn-territory + Ketu = unusually pure-form relational output.',
  'Ketu Transits the 6th House':
    'Ketu on adversary-zone. Detachment from old grievances with partner; the conflicts you thought mattered evaporate.',
  'Ketu Transits the 7th House':
    'Ketu on partnership. Detachment from anchor-client / spouse warmth; defer the big partnership signing. Exalted Venus usually softens.',
  'Ketu Transits the 8th House':
    'Ketu on transformation zone. Detachment from crisis-thrill; the inheritance / equity event arrives muted. Document carefully.',
  'Ketu Transits the 9th House':
    'Ketu on dharma. Detachment from doctrinal certainty; the old shared teacher-track may stop fitting. Sabbatical from credentialing.',
  'Ketu Transits the 10th House':
    'Ketu on public-couple identity. Detachment from status-attachment; the public moment arrives muted but the private bond strengthens.',
  'Ketu Transits the 11th House':
    'Ketu on wide-network. Detachment from group-validation; some friends drift. Trust the silence.',
  'Ketu Transits the 12th House':
    'Ketu on moksha-zone. Detachment-on-detachment — deep retreat months with partner, foreign-solitude windows.',

  // ─────────────────────────────────── ANGLE ASPECTS (72) ────────────────────
  'Sun Aspecting Ascendant (ASC)':
    'Solar light on persona — the partner reads you brighter, warmer. Best for taking the joint photo, the relationship-public moment.',
  'Sun Aspecting Ascendant (ASC) : Starts':
    'Solar approach to lagna. Polish the relational presentation; the spotlight is rising.',
  'Sun Aspecting Ascendant (ASC) : Exact':
    'Today the spotlight peaks. Make the joint declaration, take the public-couple mantle.',
  'Sun Aspecting Ascendant (ASC) : Ends':
    'Light fades. Consolidate the relational visibility gains.',
  'Sun Aspecting Midheaven (MC)':
    'Solar light on the public-couple identity. Joint career-relationship moments, principal-couple appointments.',
  'Sun Aspecting Midheaven (MC) : Starts':
    'Solar approach to MC. Prep the senior-couple move.',
  'Sun Aspecting Midheaven (MC) : Exact':
    'Today the principal-couple spotlight peaks. Take the senior-platform appearance together.',
  'Sun Aspecting Midheaven (MC) : Ends':
    'Solar light fades from MC. Lock the senior-couple recognition.',
  'Moon Aspecting Ascendant (ASC)':
    'Emotional charge on persona. Body wants warmth; partner reads you tenderly. Take the warm-toned relational meeting.',
  'Moon Aspecting Ascendant (ASC) : Starts':
    'Approach. Prep softer outreach to partner.',
  'Moon Aspecting Ascendant (ASC) : Exact':
    'Today the persona runs warm. Send the warm partner-pitch.',
  'Moon Aspecting Ascendant (ASC) : Ends':
    'Warmth fades. Lock the warm-channel bonds.',
  'Moon Aspecting Midheaven (MC)':
    'Emotional charge on public-couple identity. Joint visibility benefits from warm tone.',
  'Moon Aspecting Midheaven (MC) : Starts':
    'Approach. Warm up senior-couple relationships.',
  'Moon Aspecting Midheaven (MC) : Exact':
    'Today public-couple read runs warm. Lead with relational warmth in senior meetings.',
  'Moon Aspecting Midheaven (MC) : Ends':
    'Warmth fades from MC. Lock the warm-status relationships.',
  'Mercury Aspecting Ascendant (ASC)':
    'Mercury on persona — relational articulation peak. Refresh the way you describe yourself to partner; clarify expectations.',
  'Mercury Aspecting Ascendant (ASC) : Starts':
    'Approach. Draft the relational expectations.',
  'Mercury Aspecting Ascendant (ASC) : Exact':
    'Today precision-articulation peaks. Send the clarifying note to partner.',
  'Mercury Aspecting Ascendant (ASC) : Ends':
    'Mercury fades. Lock the articulation polish.',
  'Mercury Aspecting Midheaven (MC)':
    'Mercury on public-couple identity. Joint announcements, principal-couple framing, relationship documentation.',
  'Mercury Aspecting Midheaven (MC) : Starts':
    'Approach. Draft the joint announcement.',
  'Mercury Aspecting Midheaven (MC) : Exact':
    'Today senior-couple articulation peaks. Submit the joint statement.',
  'Mercury Aspecting Midheaven (MC) : Ends':
    'Mercury fades from MC. Lock the joint documentation.',
  'Venus Aspecting Ascendant (ASC)':
    'Charm on persona. Partner sees you radiant; client meetings convert with relational warmth.',
  'Venus Aspecting Ascendant (ASC) : Starts':
    'Approach. Prep the warm-relational outreach.',
  'Venus Aspecting Ascendant (ASC) : Exact':
    'Today personal-charm peaks. Take the camera moments with partner.',
  'Venus Aspecting Ascendant (ASC) : Ends':
    'Charm fades. Lock the warm-relational bonds.',
  'Venus Aspecting Midheaven (MC)':
    'Charm on public-couple identity. Joint board-level diplomacy, principal-couple warmth.',
  'Venus Aspecting Midheaven (MC) : Starts':
    'Approach. Soften senior-couple outreach.',
  'Venus Aspecting Midheaven (MC) : Exact':
    'Today senior-couple charm peaks. Take the joint board-level relational meeting.',
  'Venus Aspecting Midheaven (MC) : Ends':
    'Charm fades from MC. Lock the senior-couple alliance.',
  'Mars Aspecting Ascendant (ASC)':
    'Force on persona. Bold relational pushes, demanding intimate moves favored — but watch friction.',
  'Mars Aspecting Ascendant (ASC) : Starts':
    'Approach. Gather force for the bold relational ask.',
  'Mars Aspecting Ascendant (ASC) : Exact':
    'Today force on persona peaks. Make the bold demand to partner. Body needs rest tonight.',
  'Mars Aspecting Ascendant (ASC) : Ends':
    'Force fades. Lock the bold-push gains.',
  'Mars Aspecting Midheaven (MC)':
    'Force on public-couple identity. Joint career pushes, sharp principal-couple demands.',
  'Mars Aspecting Midheaven (MC) : Starts':
    'Approach. Gather force for the senior-couple push.',
  'Mars Aspecting Midheaven (MC) : Exact':
    'Today public-couple force peaks. Take the joint demanding stand.',
  'Mars Aspecting Midheaven (MC) : Ends':
    'Force fades. Cool the relational temperature.',
  'Jupiter Aspecting Ascendant (ASC)':
    'Wisdom on persona. Lineage-anchored personal-brand moves visible to partner; dharma-aligned relational framing.',
  'Jupiter Aspecting Ascendant (ASC) : Starts':
    'Approach. Polish the dharma-aligned relational framing.',
  'Jupiter Aspecting Ascendant (ASC) : Exact':
    'Today wisdom on persona peaks. Take the lineage photo with partner.',
  'Jupiter Aspecting Ascendant (ASC) : Ends':
    'Wisdom fades. Lock the lineage-anchored personal-relational gains.',
  'Jupiter Aspecting Midheaven (MC)':
    'Wisdom on public-couple identity. Senior-track elevation through dharma-aligned channels — the principled couple appointment.',
  'Jupiter Aspecting Midheaven (MC) : Starts':
    'Approach. Position the senior-couple move as dharma-aligned.',
  'Jupiter Aspecting Midheaven (MC) : Exact':
    'Today senior-couple dharma-elevation peaks. Take the principled joint appointment.',
  'Jupiter Aspecting Midheaven (MC) : Ends':
    'Wisdom fades from MC. Lock the dharma-aligned couple-status.',
  'Saturn Aspecting Ascendant (ASC)':
    'Discipline on persona. Strip-down of inflated self-image; partner sees the leaner you re-emerge.',
  'Saturn Aspecting Ascendant (ASC) : Starts':
    'Approach. Begin the personal discipline cycle visible in the relationship.',
  'Saturn Aspecting Ascendant (ASC) : Exact':
    'Today discipline-on-persona peaks. Make the lean, principled relational statement.',
  'Saturn Aspecting Ascendant (ASC) : Ends':
    'Discipline closing. Lock the leaner relational framing.',
  'Saturn Aspecting Midheaven (MC)':
    'Discipline on public-couple identity. Slow, structural elevation to senior-couple track.',
  'Saturn Aspecting Midheaven (MC) : Starts':
    'Approach. Begin the structural senior-couple positioning.',
  'Saturn Aspecting Midheaven (MC) : Exact':
    'Today structural-couple peak. Take the slow-but-permanent joint promotion.',
  'Saturn Aspecting Midheaven (MC) : Ends':
    'Discipline closing. The structural senior-couple track is in place.',
  'Rahu Aspecting Ascendant (ASC)':
    'Rahu on persona. Unconventional / foreign / disruptive personal-relational moves. Risk: identity-overreach. Reward: breakthrough.',
  'Rahu Aspecting Ascendant (ASC) : Starts':
    'Approach. The unconventional persona-pivot is gathering.',
  'Rahu Aspecting Ascendant (ASC) : Exact':
    'Today disruptive-persona peak. Make the unconventional relational move.',
  'Rahu Aspecting Ascendant (ASC) : Ends':
    'Rahu fades. Decide which disruptive elements stay.',
  'Rahu Aspecting Midheaven (MC)':
    'Rahu on public-couple identity. Sudden, unconventional senior-couple elevation — viral case study, foreign-stage breakthrough.',
  'Rahu Aspecting Midheaven (MC) : Starts':
    'Approach. The unconventional senior-couple move is gathering.',
  'Rahu Aspecting Midheaven (MC) : Exact':
    'Today disruptive-couple peak. Take the unconventional joint appointment.',
  'Rahu Aspecting Midheaven (MC) : Ends':
    'Rahu fades. Lock the disruptive couple-gains.',
  'Ketu Aspecting Ascendant (ASC)':
    'Ketu on persona. Detachment from public visibility; sabbatical-thinking favored. The ego-self thins.',
  'Ketu Aspecting Ascendant (ASC) : Starts':
    'Approach. The pull toward solitude rises.',
  'Ketu Aspecting Ascendant (ASC) : Exact':
    'Today persona-detachment peaks. Best for solitary intimacy; worst for self-promotion.',
  'Ketu Aspecting Ascendant (ASC) : Ends':
    'Detachment fading. Re-emerge with what survived the silence.',
  'Ketu Aspecting Midheaven (MC)':
    'Ketu on public-couple identity. Detachment from couple-status-attachment; the public moment arrives muted.',
  'Ketu Aspecting Midheaven (MC) : Starts':
    'Approach. Couple-status attachment unwinds.',
  'Ketu Aspecting Midheaven (MC) : Exact':
    'Today couple-status detachment peaks. Useful information.',
  'Ketu Aspecting Midheaven (MC) : Ends':
    'Detachment fading. The next couple-chapter starts on internal grounds.',

  // ───────────────────────────────── OUTER SPECIALS (8) ──────────────────────
  'Pluto conjunct Saturn':
    'Generational structural transformation in 5L+6L Saturn territory. Romance, child-related decisions, and creative-collaboration architecture rebuilt from the foundation.',
  'Pluto conjunct Saturn : Starts':
    'Pressure builds on Saturn-territory. Begin documenting the structural relational architecture you want to preserve.',
  'Pluto conjunct Saturn : Exact':
    'Today the generational rebuild peaks. The structured-relational framework is being re-cast at depth.',
  'Pluto conjunct Saturn : Ends':
    'Pressure releases. The new structural architecture is in place.',
  'Uranus conjunct Venus':
    'Disruptive innovation on the partnership / income / dharma engine. Spouse, anchor-client, principal-teacher relationship undergoes sudden re-architecture. The unconventional partner becomes the right partner.',
  'Uranus conjunct Venus : Starts':
    'Disruptive pressure builds on partnership. The conventional model starts cracking.',
  'Uranus conjunct Venus : Exact':
    'Today the partnership rewiring peaks. The unconventional partner declaration lands.',
  'Uranus conjunct Venus : Ends':
    'Disruption settling. The new partnership architecture is in place.',

  // ────────────────────────────────────── ASPECTS (324) ──────────────────────
  // — Jupiter aspects —
  'Jupiter aspect Sun in 12th house':
    'Wisdom touches the moksha-solar engine in the relationship. Confidential / foreign-shared mandates take on dharma-weight; retreat-relationships pick up lineage value.',
  'Jupiter aspect Sun in 12th house : Starts':
    'Approach. The shadow-lane relational work is gathering dharma weight.',
  'Jupiter aspect Sun in 12th house : Exact':
    'Today wisdom on the 12th-Sun peaks. Lock the confidential / retreat relational chapter.',
  'Jupiter aspect Sun in 12th house : Ends':
    'Wisdom fades. Document the dharma-weight gained.',
  'Jupiter aspect Moon in 11th house':
    'Wisdom on the wide-network warmth channel. Alumni-network institutionalization, community-led relational dharma.',
  'Jupiter aspect Moon in 11th house : Starts':
    'Approach. The network-warmth channel picks up dharma framing.',
  'Jupiter aspect Moon in 11th house : Exact':
    'Today wisdom-on-network peaks. Anchor wide-network bonds in ethical structure.',
  'Jupiter aspect Moon in 11th house : Ends':
    'Wisdom fades. Lock the dharma-aligned network architecture.',
  'Jupiter aspect Mercury in 1st house':
    'Wisdom touches the central yogakaraka in the relational sphere. Personal-craftsman framing picks up doctrinal weight visible to partner.',
  'Jupiter aspect Mercury in 1st house : Starts':
    'Approach. The principal-craftsman framing gathers lineage authority.',
  'Jupiter aspect Mercury in 1st house : Exact':
    'Today wisdom-on-yogakaraka peaks. Take the principal-of-craft mantle with lineage backing.',
  'Jupiter aspect Mercury in 1st house : Ends':
    'Wisdom fades. The lineage-anchored role is locked in.',
  'Jupiter aspect Venus in 7th house':
    'Wisdom on the exalted partnership / dharma / wealth engine. Marriage with dharma-alignment, JV with ethical framing, anchor-client with teacher-quality.',
  'Jupiter aspect Venus in 7th house : Starts':
    'Approach. Partnership picks up dharma weight.',
  'Jupiter aspect Venus in 7th house : Exact':
    'Today wisdom-on-Venus-7H peaks. Lock the dharma-aligned partnership.',
  'Jupiter aspect Venus in 7th house : Ends':
    'Wisdom fades. The principled partnership is consolidated.',
  'Jupiter aspect Mars in 8th house':
    'Wisdom on the surgical-transformation engine of the partnership. Inheritance, restructuring, equity events take on dharma-weight together.',
  'Jupiter aspect Mars in 8th house : Starts':
    'Approach. The transformation chapter gathers dharma framing.',
  'Jupiter aspect Mars in 8th house : Exact':
    'Today wisdom-on-Mars-8H peaks. Lock the dharma-aligned restructuring with partner.',
  'Jupiter aspect Mars in 8th house : Ends':
    'Wisdom fades. The principled crisis-resolution is on record.',
  'Jupiter aspect Jupiter in 4th house':
    'Jupiter return — most important transit-aspect of the chart. Hamsa-Yoga territory amplified. Year-block for property purchase with partner, family-business inflection, mother-line teaching.',
  'Jupiter aspect Jupiter in 4th house : Starts':
    'Jupiter return approaching. Prep the home-throne move.',
  'Jupiter aspect Jupiter in 4th house : Exact':
    'Jupiter return peak. Make the property purchase, the family-business move with partner.',
  'Jupiter aspect Jupiter in 4th house : Ends':
    'Jupiter return closing. The home-throne lineage move is consolidated.',
  'Jupiter aspect Saturn in 5th house':
    'Wisdom on the disciplined-creative engine in romance and children. Doctoral framework receives lineage-authority; structured romance gains teacher-quality.',
  'Jupiter aspect Saturn in 5th house : Starts':
    'Approach. Disciplined-creative work picks up lineage weight.',
  'Jupiter aspect Saturn in 5th house : Exact':
    'Today wisdom-on-Saturn-5H peaks. Lock the institutional curriculum or structured romance.',
  'Jupiter aspect Saturn in 5th house : Ends':
    'Wisdom fades. The disciplined-creative architecture is institutionalized.',
  'Jupiter aspect Rahu in 9th house':
    'Wisdom on the foreign-dharma engine. Unconventional teacher-track gains lineage authority; foreign credentialing materializes with partner.',
  'Jupiter aspect Rahu in 9th house : Starts':
    'Approach. Foreign-dharma move gathers framing.',
  'Jupiter aspect Rahu in 9th house : Exact':
    'Today wisdom-on-Rahu-9H peaks. Take the unconventional teacher-track move together.',
  'Jupiter aspect Rahu in 9th house : Ends':
    'Wisdom fades. Foreign-dharma path is on record.',
  'Jupiter aspect Ketu in 3rd house':
    'Wisdom on the detached-communication engine. Solitary research, doctrinal writing without audience-pressure. Sibling-channel dharma surfaces.',
  'Jupiter aspect Ketu in 3rd house : Starts':
    'Approach. Solitary-research framing gathers.',
  'Jupiter aspect Ketu in 3rd house : Exact':
    'Today wisdom-on-Ketu-3H peaks. Publish the lineage-rooted research.',
  'Jupiter aspect Ketu in 3rd house : Ends':
    'Wisdom fades. The solitary-research output is locked in.',

  // — Ketu aspects —
  'Ketu aspect Sun in 12th house':
    'Detachment on the moksha-solar engine. The 12H Sun thins further — pure shadow-lane intimacy, ego-free retreat-relationship.',
  'Ketu aspect Sun in 12th house : Starts':
    'Approach. The 12H solar light dims.',
  'Ketu aspect Sun in 12th house : Exact':
    'Today detachment-on-12H-Sun peaks. Best for retreat-with-partner; ego-free intimacy.',
  'Ketu aspect Sun in 12th house : Ends':
    'Detachment fading. The shadow-lane bond consolidates.',
  'Ketu aspect Moon in 11th house':
    'Detachment on the wide-network warmth. Some friends drift; alumni channel quiets. Signal: prune the network.',
  'Ketu aspect Moon in 11th house : Starts':
    'Approach. Group-warmth fades.',
  'Ketu aspect Moon in 11th house : Exact':
    'Today network-detachment peaks. Trust the silence; some peers walk away.',
  'Ketu aspect Moon in 11th house : Ends':
    'Detachment fading. The pruned network reveals real members.',
  'Ketu aspect Mercury in 1st house':
    'Detachment on the yogakaraka. Identity-stripping window in the relationship — the principal-craftsman essence remains; the ego-frame thins.',
  'Ketu aspect Mercury in 1st house : Starts':
    'Approach. Public-craftsman ego-frame loosens.',
  'Ketu aspect Mercury in 1st house : Exact':
    'Today yogakaraka-detachment peaks. Best for solitary intimacy; worst for self-promotion.',
  'Ketu aspect Mercury in 1st house : Ends':
    'Detachment fading. The leaner principal-craftsman re-emerges.',
  'Ketu aspect Venus in 7th house':
    'Detachment on partnership. Defer big partnership signing if possible. Warmth feels distant; trust the lull.',
  'Ketu aspect Venus in 7th house : Starts':
    'Approach. Partnership warmth dims.',
  'Ketu aspect Venus in 7th house : Exact':
    'Today partnership-detachment peaks. Defer signings; allow the relational lull.',
  'Ketu aspect Venus in 7th house : Ends':
    'Detachment fading. Partnership warmth returns.',
  'Ketu aspect Mars in 8th house':
    'Detachment on the surgical-crisis engine. Inheritance / health-event arrives muted. Document; do not chase adrenaline.',
  'Ketu aspect Mars in 8th house : Starts':
    'Approach. Crisis-thrill loosens.',
  'Ketu aspect Mars in 8th house : Exact':
    'Today crisis-detachment peaks. Transformation passes through quietly.',
  'Ketu aspect Mars in 8th house : Ends':
    'Detachment fading. The quiet transformation is on record.',
  'Ketu aspect Jupiter in 4th house':
    'Detachment on the home-throne / Hamsa engine. Family-business attachment loosens; mother-line conversation goes quiet.',
  'Ketu aspect Jupiter in 4th house : Starts':
    'Approach. Home-throne attachment loosens.',
  'Ketu aspect Jupiter in 4th house : Exact':
    'Today Hamsa-detachment peaks. Family-business decisions feel oddly indifferent.',
  'Ketu aspect Jupiter in 4th house : Ends':
    'Detachment fading. The home-throne re-engages quieter.',
  'Ketu aspect Saturn in 5th house':
    'Detachment on the disciplined-creative engine. Validation-seeking romantic impulse fades; the relational work nobody asked for becomes the work that matters.',
  'Ketu aspect Saturn in 5th house : Starts':
    'Approach. Validation-attachment loosens.',
  'Ketu aspect Saturn in 5th house : Exact':
    'Today creative-detachment peaks. Make the relational gesture nobody is asking for.',
  'Ketu aspect Saturn in 5th house : Ends':
    'Detachment fading. The pure-form output stands alone.',
  'Ketu aspect Rahu in 9th house':
    'Detachment on the foreign-dharma engine. Doctrinal certainty loosens; shared teacher-track may stop fitting.',
  'Ketu aspect Rahu in 9th house : Starts':
    'Approach. Doctrinal certainty wobbles.',
  'Ketu aspect Rahu in 9th house : Exact':
    'Today doctrine-detachment peaks. Useful sabbatical from teacher-track ambition together.',
  'Ketu aspect Rahu in 9th house : Ends':
    'Detachment fading. The teacher-track returns on different terms.',
  'Ketu aspect Ketu in 3rd house':
    'Ketu return — communication-detachment peak. Sibling-channel goes quiet; relational-marketing impulse fades.',
  'Ketu aspect Ketu in 3rd house : Starts':
    'Approach. Communication-attachment loosens.',
  'Ketu aspect Ketu in 3rd house : Exact':
    'Ketu return peak. Drop the relational marketing; the bond stands alone.',
  'Ketu aspect Ketu in 3rd house : Ends':
    'Ketu return closing. Re-engage communication on lighter terms.',

  // — Mars aspects —
  'Mars aspect Sun in 12th house':
    'Force on the moksha-solar engine. Confidential / foreign mandates with partner sharpen; shadow-lane work pushes hard.',
  'Mars aspect Sun in 12th house : Starts':
    'Approach. Shadow-lane work gathers force.',
  'Mars aspect Sun in 12th house : Exact':
    'Today force-on-12H-Sun peaks. Push the confidential mandate hard.',
  'Mars aspect Sun in 12th house : Ends':
    'Force fades. Shadow-lane gains lock in.',
  'Mars aspect Moon in 11th house':
    'Force on the wide-network. Aggressive group dynamics, sharp peer politics. Watch group-friction.',
  'Mars aspect Moon in 11th house : Starts':
    'Approach. Network-push gathers.',
  'Mars aspect Moon in 11th house : Exact':
    'Today force-on-network peaks. Take the bold group stance.',
  'Mars aspect Moon in 11th house : Ends':
    'Force fades. Network gains locked.',
  'Mars aspect Mercury in 1st house':
    'Force on the yogakaraka. Aggressive personal demands in the relationship; sharp principal-pitch. Body needs rest after.',
  'Mars aspect Mercury in 1st house : Starts':
    'Approach. Principal-craftsman gathers force.',
  'Mars aspect Mercury in 1st house : Exact':
    'Today force-on-yogakaraka peaks. Make the bold relational demand.',
  'Mars aspect Mercury in 1st house : Ends':
    'Force fades. Lock the bold-pitch gains; rest.',
  'Mars aspect Venus in 7th house':
    'Force on partnership. Sharp negotiations — but watch friction with spouse. Cool the temperature before signing.',
  'Mars aspect Venus in 7th house : Starts':
    'Approach. Partnership friction gathers.',
  'Mars aspect Venus in 7th house : Exact':
    'Today partnership-force peaks. Demand the JV terms; cool the relational temperature.',
  'Mars aspect Venus in 7th house : Ends':
    'Force fades. Partnership consolidates on the new terms.',
  'Mars aspect Mars in 8th house':
    'Mars return — surgical-execution peak in the partnership. Health, inheritance, restructuring shared events resolve under your hand.',
  'Mars aspect Mars in 8th house : Starts':
    'Mars return approaching. Transformation push gathers.',
  'Mars aspect Mars in 8th house : Exact':
    'Mars return peak. Walk into the burning room with partner; stabilize the system.',
  'Mars aspect Mars in 8th house : Ends':
    'Mars return closing. The crisis-resolution is on record.',
  'Mars aspect Jupiter in 4th house':
    'Force on the home-throne / Hamsa. Aggressive property push, family-business confrontation, in-law negotiation. Keep home temperature low.',
  'Mars aspect Jupiter in 4th house : Starts':
    'Approach. Home-throne friction gathers.',
  'Mars aspect Jupiter in 4th house : Exact':
    'Today force-on-Jupiter-4H peaks. The property / family negotiation reaches its sharp point.',
  'Mars aspect Jupiter in 4th house : Ends':
    'Force fades. Home-throne consolidates.',
  'Mars aspect Saturn in 5th house':
    'Force on the disciplined-creative / romance engine. Push to consolidate the relationship; competitive contest with partner.',
  'Mars aspect Saturn in 5th house : Starts':
    'Approach. Romance-discipline push gathers.',
  'Mars aspect Saturn in 5th house : Exact':
    'Today force-on-Saturn-5H peaks. Consolidate the structured romance; ship the long-form joint work.',
  'Mars aspect Saturn in 5th house : Ends':
    'Force fades. Disciplined-creative gains lock in.',
  'Mars aspect Rahu in 9th house':
    'Force on the foreign-dharma engine. Sharp doctrinal disputes with partner, foreign-stage assertions together.',
  'Mars aspect Rahu in 9th house : Starts':
    'Approach. Dharma-fight gathers.',
  'Mars aspect Rahu in 9th house : Exact':
    'Today force-on-Rahu-9H peaks. Take the doctrinal stand on the foreign stage.',
  'Mars aspect Rahu in 9th house : Ends':
    'Force fades. Foreign-dharma stand on record.',
  'Mars aspect Ketu in 3rd house':
    'Force on the detached-communication engine. Sharp solitary writing; fierce sibling-channel confrontation.',
  'Mars aspect Ketu in 3rd house : Starts':
    'Approach. Fierce-solitary push gathers.',
  'Mars aspect Ketu in 3rd house : Exact':
    'Today force-on-Ketu-3H peaks. Ship the brave message; address the sibling friction.',
  'Mars aspect Ketu in 3rd house : Ends':
    'Force fades. The solitary-research push consolidated.',

  // — Mercury aspects —
  'Mercury aspect Sun in 12th house':
    'Articulation on the moksha-solar engine. Confidential relational documentation; private letters; off-stage memos.',
  'Mercury aspect Sun in 12th house : Starts':
    'Approach. Shadow-lane writing picks up pace.',
  'Mercury aspect Sun in 12th house : Exact':
    'Today shadow-lane articulation peaks. Ship the confidential relational note.',
  'Mercury aspect Sun in 12th house : Ends':
    'Articulation fades. The private document is locked.',
  'Mercury aspect Moon in 11th house':
    'Articulation on the wide-network warmth. Alumni newsletter, community-platform posts, peer-circle explicit documentation.',
  'Mercury aspect Moon in 11th house : Starts':
    'Approach. Network-articulation gathers.',
  'Mercury aspect Moon in 11th house : Exact':
    'Today network-articulation peaks. Send the alumni note, the community update.',
  'Mercury aspect Moon in 11th house : Ends':
    'Articulation fades. The network-message on record.',
  'Mercury aspect Mercury in 1st house':
    'Mercury return — the most important relational-articulation aspect of the chart. Refresh the way you describe yourself to partner.',
  'Mercury aspect Mercury in 1st house : Starts':
    'Mercury return approaching. Prep the personal-relational refresh.',
  'Mercury aspect Mercury in 1st house : Exact':
    'Mercury return peak. Ship the relational-clarification note to partner.',
  'Mercury aspect Mercury in 1st house : Ends':
    'Mercury return closing. The yogakaraka articulation is locked.',
  'Mercury aspect Venus in 7th house':
    'Articulation on partnership. Term sheets, prenups, JV memos, contract negotiations land cleanly.',
  'Mercury aspect Venus in 7th house : Starts':
    'Approach. Partnership-articulation gathers.',
  'Mercury aspect Venus in 7th house : Exact':
    'Today partnership-articulation peaks. Ship the term sheet, the JV memo.',
  'Mercury aspect Venus in 7th house : Ends':
    'Articulation fades. Partnership documents on record.',
  'Mercury aspect Mars in 8th house':
    'Articulation on transformation. Inheritance documents, succession plans, will-related conversations with partner.',
  'Mercury aspect Mars in 8th house : Starts':
    'Approach. Transformation-articulation gathers.',
  'Mercury aspect Mars in 8th house : Exact':
    'Today crisis-articulation peaks. Ship the succession plan, the will revision.',
  'Mercury aspect Mars in 8th house : Ends':
    'Articulation fades. The transformation document is locked.',
  'Mercury aspect Jupiter in 4th house':
    'Articulation on the home-throne / Hamsa. Real-estate paperwork, family-business memo, mother-channel correspondence.',
  'Mercury aspect Jupiter in 4th house : Starts':
    'Approach. Home-throne articulation gathers.',
  'Mercury aspect Jupiter in 4th house : Exact':
    'Today Hamsa-articulation peaks. Ship the real-estate doc, the in-law memo.',
  'Mercury aspect Jupiter in 4th house : Ends':
    'Articulation fades. Home-throne document on record.',
  'Mercury aspect Saturn in 5th house':
    'Articulation on the disciplined-creative / romance engine. Long-form joint research, child-curriculum design, structured-romance documentation.',
  'Mercury aspect Saturn in 5th house : Starts':
    'Approach. Disciplined-creative articulation gathers.',
  'Mercury aspect Saturn in 5th house : Exact':
    'Today Saturn-5H articulation peaks. Ship the joint chapter, the child-curriculum module.',
  'Mercury aspect Saturn in 5th house : Ends':
    'Articulation fades. The disciplined-creative document is locked.',
  'Mercury aspect Rahu in 9th house':
    'Articulation on the foreign-dharma engine. Foreign-publication submissions with partner, doctrinal essays together.',
  'Mercury aspect Rahu in 9th house : Starts':
    'Approach. Foreign-dharma articulation gathers.',
  'Mercury aspect Rahu in 9th house : Exact':
    'Today Rahu-9H articulation peaks. Submit the foreign piece together.',
  'Mercury aspect Rahu in 9th house : Ends':
    'Articulation fades. The foreign-dharma submission on record.',
  'Mercury aspect Ketu in 3rd house':
    'Articulation on the detached-communication engine. Solitary research notes, lineage-content production, deep relational journaling.',
  'Mercury aspect Ketu in 3rd house : Starts':
    'Approach. Solitary-research writing gathers.',
  'Mercury aspect Ketu in 3rd house : Exact':
    'Today Ketu-3H articulation peaks. Ship the solitary piece.',
  'Mercury aspect Ketu in 3rd house : Ends':
    'Articulation fades. The solitary piece stands alone.',

  // — Moon aspects —
  'Moon aspect Sun in 12th house':
    'Emotional charge on the moksha-solar engine. Inwardness, foreign-pull, confidential-relationship warmth.',
  'Moon aspect Sun in 12th house : Starts':
    'Approach. Shadow-lane warmth gathers.',
  'Moon aspect Sun in 12th house : Exact':
    'Today 12H emotional warmth peaks. Take the confidential warm-toned meeting with partner.',
  'Moon aspect Sun in 12th house : Ends':
    'Warmth fades. Shadow-lane bond consolidated.',
  'Moon aspect Moon in 11th house':
    'Moon return — wide-network warmth peaks. Alumni reach-outs, community reconnections, peer-circle warmth.',
  'Moon aspect Moon in 11th house : Starts':
    'Moon return approaching. Network-warmth rising.',
  'Moon aspect Moon in 11th house : Exact':
    'Moon return peak. Take the warm alumni call, community-leadership meeting.',
  'Moon aspect Moon in 11th house : Ends':
    'Moon return closing. Warm network gains on record.',
  'Moon aspect Mercury in 1st house':
    'Emotional charge on the yogakaraka. Body wants warmth in the relational framing; soft-toned partner meetings.',
  'Moon aspect Mercury in 1st house : Starts':
    'Approach. Personal-warmth rising.',
  'Moon aspect Mercury in 1st house : Exact':
    'Today personal-warmth peaks. Take the warm partner meeting.',
  'Moon aspect Mercury in 1st house : Ends':
    'Warmth fades. Lock the warm-channel bonds.',
  'Moon aspect Venus in 7th house':
    'Emotional charge on partnership. Spouse / principal-client temperature read; warm tone wins the day.',
  'Moon aspect Venus in 7th house : Starts':
    'Approach. Partnership-warmth rising.',
  'Moon aspect Venus in 7th house : Exact':
    'Today partnership-warmth peaks. Take the warm-toned anchor meeting.',
  'Moon aspect Venus in 7th house : Ends':
    'Warmth fades. Lock the warm-partner alliance.',
  'Moon aspect Mars in 8th house':
    'Emotional weight on transformation zone. Defer high-stakes relationship decisions two days. Old fears around chaos surface.',
  'Moon aspect Mars in 8th house : Starts':
    'Approach. Crisis-emotion rising.',
  'Moon aspect Mars in 8th house : Exact':
    'Today crisis-weight peaks. Defer signings; let fear pass.',
  'Moon aspect Mars in 8th house : Ends':
    'Weight fades. Re-engage the transformation work.',
  'Moon aspect Jupiter in 4th house':
    'Emotional charge on the home-throne / Hamsa. Mother-channel warmth peaks; family gatherings warm-pulse.',
  'Moon aspect Jupiter in 4th house : Starts':
    'Approach. Home-warmth rising.',
  'Moon aspect Jupiter in 4th house : Exact':
    'Today home-warmth peaks. Cook the meal with partner; take mother\'s call.',
  'Moon aspect Jupiter in 4th house : Ends':
    'Warmth fades. The home-bond consolidated.',
  'Moon aspect Saturn in 5th house':
    'Emotional charge on the disciplined-creative / romance engine. Structured romance picks up emotional warmth.',
  'Moon aspect Saturn in 5th house : Starts':
    'Approach. Romance-warmth rising.',
  'Moon aspect Saturn in 5th house : Exact':
    'Today romance-warmth peaks. Add heart to the structured bond.',
  'Moon aspect Saturn in 5th house : Ends':
    'Warmth fades. Warm-rigorous romance on record.',
  'Moon aspect Rahu in 9th house':
    'Emotional charge on the foreign-dharma engine. Pilgrimage-with-partner thought, foreign-trip draft, unconventional-teacher warmth.',
  'Moon aspect Rahu in 9th house : Starts':
    'Approach. Foreign-dharma warmth rising.',
  'Moon aspect Rahu in 9th house : Exact':
    'Today Rahu-9H warmth peaks. Make the foreign-teacher reach-out together.',
  'Moon aspect Rahu in 9th house : Ends':
    'Warmth fades. Foreign-dharma bond on record.',
  'Moon aspect Ketu in 3rd house':
    'Emotional charge on the detached-communication engine. Solitary-research mood; the brave message that does not need a reply.',
  'Moon aspect Ketu in 3rd house : Starts':
    'Approach. Solitary-research warmth rising.',
  'Moon aspect Ketu in 3rd house : Exact':
    'Today Ketu-3H warmth peaks. Write the brave message; do not need a reply.',
  'Moon aspect Ketu in 3rd house : Ends':
    'Warmth fades. The solitary-research warmth locked.',

  // — Rahu aspects —
  'Rahu aspect Sun in 12th house':
    'Disruption on the moksha-solar engine. Sudden foreign / confidential mandate with partner; speculative shadow-lane work.',
  'Rahu aspect Sun in 12th house : Starts':
    'Approach. Disruptive shadow-lane move gathering.',
  'Rahu aspect Sun in 12th house : Exact':
    'Today Rahu-on-12H-Sun peaks. Take the unconventional foreign-retreat with partner.',
  'Rahu aspect Sun in 12th house : Ends':
    'Disruption fading. Lock or release the unconventional move.',
  'Rahu aspect Moon in 11th house':
    'Disruption on the wide-network warmth. Foreign-friend windfalls, viral community moves, unconventional alumni dynamics.',
  'Rahu aspect Moon in 11th house : Starts':
    'Approach. Network-disruption gathering.',
  'Rahu aspect Moon in 11th house : Exact':
    'Today Rahu-on-network peaks. Ride the viral wave; take the unconventional peer seat.',
  'Rahu aspect Moon in 11th house : Ends':
    'Disruption fading. Decide which gains stay.',
  'Rahu aspect Mercury in 1st house':
    'Disruption on the yogakaraka. Unconventional / foreign personal-brand pivot visible to partner.',
  'Rahu aspect Mercury in 1st house : Starts':
    'Approach. Disruptive principal-craftsman move gathering.',
  'Rahu aspect Mercury in 1st house : Exact':
    'Today Rahu-on-yogakaraka peaks. Make the unconventional public-brand move.',
  'Rahu aspect Mercury in 1st house : Ends':
    'Disruption fading. Lock the breakthrough; drop overreach.',
  'Rahu aspect Venus in 7th house':
    'Disruption on partnership. Foreign-spouse / foreign-anchor-client window. Exalted Venus 7H absorbs Rahu well — the unusual partner often turns out to be the right one.',
  'Rahu aspect Venus in 7th house : Starts':
    'Approach. Disruptive partnership move gathering.',
  'Rahu aspect Venus in 7th house : Exact':
    'Today Rahu-on-Venus-7H peaks. The unconventional partner declaration lands.',
  'Rahu aspect Venus in 7th house : Ends':
    'Disruption fading. The unusual partnership consolidated.',
  'Rahu aspect Mars in 8th house':
    'Disruption on the surgical-transformation engine. Speculative-equity events with partner, unconventional inheritance.',
  'Rahu aspect Mars in 8th house : Starts':
    'Approach. Disruptive transformation gathering.',
  'Rahu aspect Mars in 8th house : Exact':
    'Today Rahu-on-Mars-8H peaks. Walk into the high-velocity transformation; harness, do not chase.',
  'Rahu aspect Mars in 8th house : Ends':
    'Disruption fading. Transformation gains documented.',
  'Rahu aspect Jupiter in 4th house':
    'Disruption on the home-throne / Hamsa. Foreign-property windows, unconventional family-business pivots.',
  'Rahu aspect Jupiter in 4th house : Starts':
    'Approach. Home-throne disruption gathering.',
  'Rahu aspect Jupiter in 4th house : Exact':
    'Today Rahu-on-Jupiter-4H peaks. Take the foreign-property move with partner.',
  'Rahu aspect Jupiter in 4th house : Ends':
    'Disruption fading. The unconventional home-throne move consolidated.',
  'Rahu aspect Saturn in 5th house':
    'Disruption on the disciplined-creative / romance engine. Speculative-romantic windows, foreign-curriculum ventures.',
  'Rahu aspect Saturn in 5th house : Starts':
    'Approach. Romance-disruption gathering.',
  'Rahu aspect Saturn in 5th house : Exact':
    'Today Rahu-on-Saturn-5H peaks. Take the unconventional romantic move; ground in disciplined craft.',
  'Rahu aspect Saturn in 5th house : Ends':
    'Disruption fading. The unconventional-romance output on record.',
  'Rahu aspect Rahu in 9th house':
    'Rahu return — foreign-dharma engine peaks. Unconventional teacher with partner, foreign credentialing together. The unconventional path is the path during this window.',
  'Rahu aspect Rahu in 9th house : Starts':
    'Rahu return approaching. Foreign-dharma chapter gathering.',
  'Rahu aspect Rahu in 9th house : Exact':
    'Rahu return peak. Make the foreign-teacher / unconventional-doctrine move together.',
  'Rahu aspect Rahu in 9th house : Ends':
    'Rahu return closing. The unconventional dharma path consolidated.',
  'Rahu aspect Ketu in 3rd house':
    'Nodal-axis activation on communication. Foreign / disruptive content channels, viral writing about relational truth.',
  'Rahu aspect Ketu in 3rd house : Starts':
    'Approach. Nodal-axis communication disruption gathering.',
  'Rahu aspect Ketu in 3rd house : Exact':
    'Today nodal-axis peak. The viral / foreign content move lands.',
  'Rahu aspect Ketu in 3rd house : Ends':
    'Nodal pressure fading. The unconventional content gains documented.',

  // — Saturn aspects —
  'Saturn aspect Sun in 12th house':
    'Discipline on the moksha-solar engine. Long-arc confidential / foreign mandate with partner.',
  'Saturn aspect Sun in 12th house : Starts':
    'Approach. Shadow-lane discipline cycle beginning.',
  'Saturn aspect Sun in 12th house : Exact':
    'Today Saturn-on-12H-Sun peaks. Lock the long-arc confidential mandate.',
  'Saturn aspect Sun in 12th house : Ends':
    'Discipline phase closing. Shadow-lane structure in place.',
  'Saturn aspect Moon in 11th house':
    'Discipline on the wide-network warmth. Structural rebuild of alumni / community channels.',
  'Saturn aspect Moon in 11th house : Starts':
    'Approach. Network-discipline cycle beginning.',
  'Saturn aspect Moon in 11th house : Exact':
    'Today Saturn-on-network peaks. Some friends fall away; deep ones lock in for life.',
  'Saturn aspect Moon in 11th house : Ends':
    'Discipline phase closing. Pruned network is structural.',
  'Saturn aspect Mercury in 1st house':
    'Discipline on the yogakaraka. Slow personal-craftsman re-architecture visible to partner. Body weight, posture tighten.',
  'Saturn aspect Mercury in 1st house : Starts':
    'Approach. Yogakaraka discipline cycle beginning.',
  'Saturn aspect Mercury in 1st house : Exact':
    'Today Saturn-on-yogakaraka peaks. Make the lean, principled relational statement.',
  'Saturn aspect Mercury in 1st house : Ends':
    'Discipline phase closing. The leaner principal-craftsman in place.',
  'Saturn aspect Venus in 7th house':
    'Discipline on partnership. Marriage / anchor-client tested for structural soundness. Weak partnerships fall away; strong ones harden.',
  'Saturn aspect Venus in 7th house : Starts':
    'Approach. Partnership-discipline cycle beginning.',
  'Saturn aspect Venus in 7th house : Exact':
    'Today Saturn-on-Venus-7H peaks. The structural partnership decision lands.',
  'Saturn aspect Venus in 7th house : Ends':
    'Discipline phase closing. The structurally-sound partnership on record.',
  'Saturn aspect Mars in 8th house':
    'Discipline on the surgical-transformation engine. Heavy-but-gold restructuring with partner.',
  'Saturn aspect Mars in 8th house : Starts':
    'Approach. Transformation-discipline cycle beginning.',
  'Saturn aspect Mars in 8th house : Exact':
    'Today Saturn-on-Mars-8H peaks. Lock the long-arc restructuring move with partner.',
  'Saturn aspect Mars in 8th house : Ends':
    'Discipline phase closing. The structural transformation in place.',
  'Saturn aspect Jupiter in 4th house':
    'Discipline on the home-throne / Hamsa. Heavy chapter for property, mother\'s health — the *real* foundations of the home are built here.',
  'Saturn aspect Jupiter in 4th house : Starts':
    'Approach. Home-throne discipline cycle beginning.',
  'Saturn aspect Jupiter in 4th house : Exact':
    'Today Saturn-on-Jupiter-4H peaks. The structural home / family decision lands.',
  'Saturn aspect Jupiter in 4th house : Ends':
    'Discipline phase closing. Home-throne foundation structural.',
  'Saturn aspect Saturn in 5th house':
    'Saturn return — disciplined-creative chapter peak in romance and children. Slow-burn romance reaches commitment-readiness; child milestones consolidate.',
  'Saturn aspect Saturn in 5th house : Starts':
    'Saturn return approaching. Disciplined-creative chapter gathering.',
  'Saturn aspect Saturn in 5th house : Exact':
    'Saturn return peak. Lock the structured-romance commitment.',
  'Saturn aspect Saturn in 5th house : Ends':
    'Saturn return closing. The multi-decade relational moat in place.',
  'Saturn aspect Rahu in 9th house':
    'Discipline on the foreign-dharma engine. Slow, structural foreign credentialing with partner.',
  'Saturn aspect Rahu in 9th house : Starts':
    'Approach. Foreign-dharma discipline cycle beginning.',
  'Saturn aspect Rahu in 9th house : Exact':
    'Today Saturn-on-Rahu-9H peaks. Lock the foreign credential, doctrinal framework together.',
  'Saturn aspect Rahu in 9th house : Ends':
    'Discipline phase closing. Foreign-dharma structure in place.',
  'Saturn aspect Ketu in 3rd house':
    'Discipline on the detached-communication engine. Long-form solitary research, lineage-content production with multi-year cadence.',
  'Saturn aspect Ketu in 3rd house : Starts':
    'Approach. Solitary-research discipline cycle beginning.',
  'Saturn aspect Ketu in 3rd house : Exact':
    'Today Saturn-on-Ketu-3H peaks. Lock the long-form solitary project.',
  'Saturn aspect Ketu in 3rd house : Ends':
    'Discipline phase closing. The lineage-research output on record.',

  // — Sun aspects —
  'Sun aspect Sun in 12th house':
    'Solar return through 12th. Annual peak for retreat-with-partner, foreign work, intimate solitude.',
  'Sun aspect Sun in 12th house : Starts':
    'Solar return approaching. Prep year-block strategic relational drafts.',
  'Sun aspect Sun in 12th house : Exact':
    'Solar return peak. Take the new-year strategic drafts done together.',
  'Sun aspect Sun in 12th house : Ends':
    'Solar return closing. Shadow-lane strategy on record.',
  'Sun aspect Moon in 11th house':
    'Solar light on wide-network warmth. Alumni introductions, community gatherings, peer-circle relational moments.',
  'Sun aspect Moon in 11th house : Starts':
    'Approach. Network-spotlight gathering.',
  'Sun aspect Moon in 11th house : Exact':
    'Today network-spotlight peaks. Take the alumni call, the peer-bond meeting.',
  'Sun aspect Moon in 11th house : Ends':
    'Spotlight fades. Lock the network-recognition.',
  'Sun aspect Mercury in 1st house':
    'Solar light on the yogakaraka. Annual peak for personal-craftsman visibility — the founder photo, the principal-of-X declaration with partner.',
  'Sun aspect Mercury in 1st house : Starts':
    'Approach. Yogakaraka spotlight gathering.',
  'Sun aspect Mercury in 1st house : Exact':
    'Today yogakaraka spotlight peaks. Make the founder declaration; take the principal-of-craft mantle.',
  'Sun aspect Mercury in 1st house : Ends':
    'Spotlight fades. Lock the principal-craftsman appointment.',
  'Sun aspect Venus in 7th house':
    'Solar light on partnership. Visibility through contracts; spouse and principal-client dynamics light up.',
  'Sun aspect Venus in 7th house : Starts':
    'Approach. Partnership-spotlight gathering.',
  'Sun aspect Venus in 7th house : Exact':
    'Today partnership-spotlight peaks. Sign the anchor partnership; demand the JV terms.',
  'Sun aspect Venus in 7th house : Ends':
    'Spotlight fades. Lock the public partnership.',
  'Sun aspect Mars in 8th house':
    'Solar light on the surgical-transformation engine. Career-relationship intersections in crisis chapters.',
  'Sun aspect Mars in 8th house : Starts':
    'Approach. Transformation-spotlight gathering.',
  'Sun aspect Mars in 8th house : Exact':
    'Today crisis-spotlight peaks. Lead the restructuring; close the equity event with partner.',
  'Sun aspect Mars in 8th house : Ends':
    'Spotlight fades. Lock the transformation gains.',
  'Sun aspect Jupiter in 4th house':
    'Solar light on the home-throne / Hamsa. Real-estate decisions, family-business inflections, mother-line conversations all favored.',
  'Sun aspect Jupiter in 4th house : Starts':
    'Approach. Home-throne spotlight gathering.',
  'Sun aspect Jupiter in 4th house : Exact':
    'Today Hamsa-spotlight peaks. Make the property purchase, the family-business move with partner.',
  'Sun aspect Jupiter in 4th house : Ends':
    'Spotlight fades. Lock the home-throne move.',
  'Sun aspect Saturn in 5th house':
    'Solar light on the disciplined-creative / romance engine. Best for structured-romantic milestones, child-related decisions.',
  'Sun aspect Saturn in 5th house : Starts':
    'Approach. Romance-discipline spotlight gathering.',
  'Sun aspect Saturn in 5th house : Exact':
    'Today Saturn-5H spotlight peaks. Consolidate the structured romance; deliver the child-milestone.',
  'Sun aspect Saturn in 5th house : Ends':
    'Spotlight fades. Lock the structured-creative output.',
  'Sun aspect Rahu in 9th house':
    'Solar light on the foreign-dharma engine. International-stage talks, certifications, judicial proceedings together.',
  'Sun aspect Rahu in 9th house : Starts':
    'Approach. Foreign-dharma spotlight gathering.',
  'Sun aspect Rahu in 9th house : Exact':
    'Today Rahu-9H spotlight peaks. Take the foreign-stage talk together.',
  'Sun aspect Rahu in 9th house : Ends':
    'Spotlight fades. Lock the foreign-dharma recognition.',
  'Sun aspect Ketu in 3rd house':
    'Solar light on the detached-communication engine. Brave solitary-research push gets quiet recognition; sibling-channel reconnections.',
  'Sun aspect Ketu in 3rd house : Starts':
    'Approach. Solitary-research spotlight gathering.',
  'Sun aspect Ketu in 3rd house : Exact':
    'Today Ketu-3H spotlight peaks. Publish the solitary research; the right people see it.',
  'Sun aspect Ketu in 3rd house : Ends':
    'Spotlight fades. The solitary-research output stands on record.',

  // — Venus aspects —
  'Venus aspect Sun in 12th house':
    'Charm on the moksha-solar engine. Foreign-warmth, confidential-collaboration, retreat-relationships with partner.',
  'Venus aspect Sun in 12th house : Starts':
    'Approach. Shadow-lane warmth gathering.',
  'Venus aspect Sun in 12th house : Exact':
    'Today Venus-on-12H-Sun peaks. Take the warm confidential meeting with partner.',
  'Venus aspect Sun in 12th house : Ends':
    'Charm fades. Shadow-lane warmth locked.',
  'Venus aspect Moon in 11th house':
    'Charm on the wide-network warmth. Alumni warm intros, community-product affection, peer-circle relational gains.',
  'Venus aspect Moon in 11th house : Starts':
    'Approach. Network-charm gathering.',
  'Venus aspect Moon in 11th house : Exact':
    'Today Venus-on-network peaks. Take the warm peer call.',
  'Venus aspect Moon in 11th house : Ends':
    'Charm fades. Lock the warm-network bonds.',
  'Venus aspect Mercury in 1st house':
    'Charm on the yogakaraka. Personal-craftsman framing radiates; partner sees you radiant.',
  'Venus aspect Mercury in 1st house : Starts':
    'Approach. Yogakaraka-charm gathering.',
  'Venus aspect Mercury in 1st house : Exact':
    'Today Venus-on-yogakaraka peaks. Sign the warm contracts; lead with personal-craftsman grace.',
  'Venus aspect Mercury in 1st house : Ends':
    'Charm fades. Lock the warm-channel relationships.',
  'Venus aspect Venus in 7th house':
    'Venus return — partnership engine peaks. Sign the anchor deal, marry, lock the principal client. Most important Venus aspect of the chart.',
  'Venus aspect Venus in 7th house : Starts':
    'Venus return approaching. Prep the partnership move.',
  'Venus aspect Venus in 7th house : Exact':
    'Venus return peak. Lock the structural partnership; warmth at annual peak.',
  'Venus aspect Venus in 7th house : Ends':
    'Venus return closing. Partnership on record.',
  'Venus aspect Mars in 8th house':
    'Charm on the surgical-transformation engine. Severance / inheritance / health-event negotiated warmly with partner.',
  'Venus aspect Mars in 8th house : Starts':
    'Approach. Transformation-warmth gathering.',
  'Venus aspect Mars in 8th house : Exact':
    'Today Venus-on-Mars-8H peaks. Negotiate the inheritance / restructuring with grace.',
  'Venus aspect Mars in 8th house : Ends':
    'Charm fades. Warm transformation on record.',
  'Venus aspect Jupiter in 4th house':
    'Charm on the home-throne / Hamsa. Real-estate beauty decisions, mother-channel warmth, family-business soft-power moves.',
  'Venus aspect Jupiter in 4th house : Starts':
    'Approach. Home-throne charm gathering.',
  'Venus aspect Jupiter in 4th house : Exact':
    'Today Hamsa-charm peaks. Take the warm property meeting; soft family-business pivot.',
  'Venus aspect Jupiter in 4th house : Ends':
    'Charm fades. Lock the warm home-throne move.',
  'Venus aspect Saturn in 5th house':
    'Charm on the disciplined-creative / romance engine. Structured romance picks up grace; child-related decisions warm.',
  'Venus aspect Saturn in 5th house : Starts':
    'Approach. Romance-charm gathering.',
  'Venus aspect Saturn in 5th house : Exact':
    'Today Venus-on-Saturn-5H peaks. The rigorous-romance picks up grace.',
  'Venus aspect Saturn in 5th house : Ends':
    'Charm fades. The graceful-rigorous romance on record.',
  'Venus aspect Rahu in 9th house':
    'Charm on the foreign-dharma engine. Foreign-stage talks land warmly with partner; ethical-investment intros.',
  'Venus aspect Rahu in 9th house : Starts':
    'Approach. Foreign-dharma charm gathering.',
  'Venus aspect Rahu in 9th house : Exact':
    'Today Venus-on-Rahu-9H peaks. Take the warm foreign-stage talk together.',
  'Venus aspect Rahu in 9th house : Ends':
    'Charm fades. Warm foreign-dharma bond on record.',
  'Venus aspect Ketu in 3rd house':
    'Charm on the detached-communication engine. Warm message that does not need a reply; gentle-sibling correspondence.',
  'Venus aspect Ketu in 3rd house : Starts':
    'Approach. Solitary-research warmth gathering.',
  'Venus aspect Ketu in 3rd house : Exact':
    'Today Venus-on-Ketu-3H peaks. Send the warm note that does not need a reply.',
  'Venus aspect Ketu in 3rd house : Ends':
    'Charm fades. The gentle-research bond on record.',
};
