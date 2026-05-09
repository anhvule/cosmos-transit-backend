// db/_virgo_advice.js
// ADVICE fills for representative Virgo ascendant native.
// Internal natal reference (do NOT echo as preamble in copy):
//   Mercury Virgo 1H (own+exalted — Bhadra Yoga) · Sun Leo 12H (own)
//   Moon Cancer 11H (own) · Venus Pisces 7H (exalted — Malavya Yoga)
//   Mars Aries 8H (own — Vipareet) · Jupiter Sagittarius 4H (own — Hamsa Yoga)
//   Saturn Capricorn 5H (own) · Rahu Scorpio 3H · Ketu Taurus 9H

module.exports = {
  // ───────────────────────────────────── RULERS (12) ─────────────────────────
  'Mercury ruler of the 1st House in the 1st House':
    'Trust the analyst. Your central instrument is the discriminating mind — make decisions by writing them out, not by feeling them through. The pen, the spreadsheet, the structured pros-and-cons list is your dharma. Avoid moves that ask you to act before the mind has fully processed; the body will tell you it is wrong via stomach turbulence within 24 hours. The shadow: paralysis-by-analysis. Set deadlines on your own decision-making — past a date, ship the imperfect choice and adjust.',
  'Venus ruler of the 2nd House in the 7th House':
    'Money decisions are partner decisions; do not make either alone. The partner — spouse, principal client, business co-founder — is genuinely the financial pivot of your life. Brief them before signing. Industries advice: lean toward deal-led, partnership-anchored work. The shadow: financial enmeshment that the relationship cannot survive separation from — keep some accounts genuinely your own, not as defection but as sovereignty.',
  'Mars ruler of the 3rd House in the 8th House':
    'When the truth needs to be told, tell it surgically once and stop. The Mars-in-8H pattern lands a sharp message cleanly when delivered with discipline; it detonates the room when delivered in heat. Document before confronting. The shadow: addiction to the crisis-conversation; some weeks deserve calm — let calm be calm.',
  'Jupiter ruler of the 4th House in the 4th House':
    'Hamsa Yoga: the home is the temple. Decisions made at home, after a real meal cooked at home, will be wiser than decisions made on the road. Real-estate is a load-bearing pillar of your life — own the building you work from, the home you live in, the land your family roots in. Family-business is a dharma worth stewarding even if it does not look glamorous. The shadow: idealization of the home that quietly becomes refusal to leave when the dharma calls outward.',
  'Saturn ruler of the 5th House in the 5th House':
    'Build slow, build for permanence, and play sometimes. Saturn-in-own-sign in 5H wants creative work that compounds for decades — but also makes the work feel like duty. Schedule joy as deliberately as you schedule the regimen. Children come late and matter enormously. The shadow: gravity that turns playfulness into labor — rebellion via spontaneous play is sometimes the deepest discipline.',
  'Saturn ruler of the 6th House in the 5th House':
    'Long enemies, chronic illnesses, and patient adversaries are the materials your most enduring work is built from. Vipareet potential — turn the obstacle into the case-study, the lawsuit into the textbook, the chronic illness into the protocol. The shadow: cultivating problems for material — let some chapters of life stay un-fictionalized.',
  'Jupiter ruler of the 7th House in the 4th House':
    'Spouse arrives through the home, the family, the matriarchal channel, the educational lineage. Trust introductions from the family network. Marriage is a household, not a startup. The shadow: family expectations migrating onto the partner — clarify the dharma of the partnership separate from the lineage.',
  'Mars ruler of the 8th House in the 8th House':
    'Vipareet engine: the crises that flatten others are the platform you rise from. When the storm hits, lead from the front; when the storm is invented to make you feel useful, sit. The shadow: addiction to the high-stakes; calm life can feel like absence — sit with it.',
  'Venus ruler of the 9th House in the 7th House':
    'The principal teacher of your life arrives through the partner. Receive the influence; author your own scripture. Foreign clientele and cross-cultural partnerships compound — say yes to the international intro. The shadow: following the partner\'s dharma instead of writing your own.',
  'Mercury ruler of the 10th House in the 1st House':
    'Bhadra peak — your career and your name are one. Build the personal brand patiently; the analyst-craftsman reputation is the long-arc asset. The shadow: the absence of an external boss can mean the absence of a check on bad calls — install peer-review into your own structure.',
  'Moon ruler of the 11th House in the 11th House':
    'Mother-figures, female friend-circles, women-led communities are the channels that pay. Cultivate these networks; receive the mentorship offered by older women. The shadow: emotional weather steering financial decisions — separate the warmth from the contract.',
  'Sun ruler of the 12th House in the 12th House':
    'Authority is built in quiet chambers. Behind-the-scenes mandates, foreign assignments, retreats, archival work, monastic-style chief-of-staff roles — these are the throne rooms. The world catches up later. The shadow: the ego wanting visibility — the dharma wants invisibility. Honor the dharma.',

  // ─────────────────────────────────── DISPOSITORS (7) ───────────────────────
  'Sun in 12th (Dispositor)':
    'When this engine fires, retreat-led action lands. Best for confidential moves, foreign assignments, archival projects.',
  'Moon in 11th (Dispositor)':
    'When this engine fires, network-warmth pays. Reach out to mother-figure mentor; attend the women-led-network event.',
  'Mercury in 1st (Dispositor)':
    'When this engine fires, sharp-self decisions are best. Write the choice down; structure the move.',
  'Jupiter in 4th (Dispositor)':
    'When this engine fires, home-anchored wisdom lands. Decide at home, after a meal cooked at home.',
  'Mars in 8th (Dispositor)':
    'When this engine fires, surgical action lands. Lead the crisis-management move with discipline.',
  'Saturn in 5th (Dispositor)':
    'When this engine fires, slow-creative-discipline pays. Honor the long-arc; the patience compounds.',
  'Venus in 7th (Dispositor)':
    'When this engine fires, partner-led grace lands. Brief the partner; co-decide the move.',

  // ──────────────────────────────────── TRANSITS (108) ───────────────────────
  // — Sun transits —
  'Sun Transits the 1st House':
    'Annual peak self-radiance. Take public-facing moves, declare the role you have grown into. Watch ego-friction with father-figures and senior authorities.',
  'Sun Transits the 2nd House':
    'Solar light on income, voice, family-finance. Negotiate fees, record the talk, lock the family-money decision.',
  'Sun Transits the 3rd House':
    'Solar courage on writing, peers, sales. Push the campaign, ship the post, lead the team-storming.',
  'Sun Transits the 4th House':
    'Hamsa home-throne fire. Best for real-estate decisions, family-business inflections, mother-channel calls.',
  'Sun Transits the 5th House':
    'Solar fire on creative-discipline. Launch the long-arc thesis, the structured speculation, the mentorship role.',
  'Sun Transits the 6th House':
    'Solar fire on adversary-management. Address the audit, the litigation, the difficult HR conversation.',
  'Sun Transits the 7th House':
    'Solar fire on Malavya partnership. Sign the JV; renew the marriage; declare the public partnership.',
  'Sun Transits the 8th House':
    'Solar fire on Vipareet chamber. Lead the surgical succession move, the equity-event combat.',
  'Sun Transits the 9th House':
    'Solar light on Ketu zone. Release one teacher-attachment; receive the next chapter.',
  'Sun Transits the 10th House':
    'Annual peak career-visibility. Demand the title, take the public role, lead the flagship pitch.',
  'Sun Transits the 11th House':
    'Solar fire on emotional-network. Bonus conversations, equity true-ups, women-led-network introductions.',
  'Sun Transits the 12th House':
    'Solar return on retreat-throne. Best for behind-the-scenes mandates, foreign assignments, monastic-style leadership.',

  // — Moon transits —
  'Moon Transits the 1st House':
    'Two-day emotional charge. Channel into a body-anchored move; choose warmth over speed.',
  'Moon Transits the 2nd House':
    'Emotional charge on income and voice. Read the room before pricing; soft-spoken negotiation.',
  'Moon Transits the 3rd House':
    'Two-day window of warm communication. Send the brave-and-warm note; take the candid call.',
  'Moon Transits the 4th House':
    'Hamsa home-throne emotional peak. Cook a real meal; the reset compounds.',
  'Moon Transits the 5th House':
    'Emotional charge on creative-intellect. Capture the warm draft; do not over-edit.',
  'Moon Transits the 6th House':
    'Emotional charge on conflict. Adversary may push triggers; respond from documentation, not heat.',
  'Moon Transits the 7th House':
    'Emotional charge on Malavya partnership. Read the partner temperature; warm tone wins.',
  'Moon Transits the 8th House':
    'Emotional weight on transformation. Defer high-stakes decisions two days.',
  'Moon Transits the 9th House':
    'Emotional pull toward dharma-detachment. Old shared-teacher attachments may dissolve.',
  'Moon Transits the 10th House':
    'Career-emotion peak. Public reception is warm; take the warm-toned client meeting.',
  'Moon Transits the 11th House':
    'Moon\'s own-sign return on gain-throne. Reach out to mother-figure mentor; the warm-network call lands.',
  'Moon Transits the 12th House':
    'Emotional inwardness; foreign and confidential pull. Best for retreat-planning, dream-led strategy.',

  // — Mercury transits —
  'Mercury Transits the 1st House':
    'Mercury\'s Bhadra return. Peak self-articulation. Refresh the bio, the founder-story, the personal pitch.',
  'Mercury Transits the 2nd House':
    'Sharp money-and-voice articulation. Renegotiate fees; lock the family-finance plan.',
  'Mercury Transits the 3rd House':
    'Sharp short-burst communication. Content production, sales sequences, sibling-channel deals.',
  'Mercury Transits the 4th House':
    'Sharp Hamsa home-throne articulation. Real-estate paperwork, family-business memos, mother-channel correspondence.',
  'Mercury Transits the 5th House':
    'Sharp creative-discipline articulation. Ship the thesis chapter, the course module, the speculation memo.',
  'Mercury Transits the 6th House':
    'Sharp adversary-articulation. Audit memos, litigation briefs, HR documentation — surgical precision wins.',
  'Mercury Transits the 7th House':
    'Sharp Malavya partnership articulation. Term sheets, JV memos, contract negotiations.',
  'Mercury Transits the 8th House':
    'Sharp Vipareet articulation. Succession plans, restructuring memos, equity-event paperwork.',
  'Mercury Transits the 9th House':
    'Sharp dharma articulation. Publish the paper, file the foreign certification, draft the curriculum.',
  'Mercury Transits the 10th House':
    'Sharp career-public articulation. Press releases, all-hands updates, status memos.',
  'Mercury Transits the 11th House':
    'Sharp wide-network articulation. Community-platform updates, mother-figure-mentorship correspondence.',
  'Mercury Transits the 12th House':
    'Sharp behind-the-scenes articulation. Confidential memos, foreign correspondence, retreat-strategy drafts.',

  // — Venus transits —
  'Venus Transits the 1st House':
    'Beauty on the analyst-self. The room responds to your refined precision; charm-led moves win where pure analysis would not.',
  'Venus Transits the 2nd House':
    'Beauty on income and voice. Pricing rises; voice-projects favored.',
  'Venus Transits the 3rd House':
    'Beauty on communication. Tone the message; soften the pitch.',
  'Venus Transits the 4th House':
    'Beauty on Hamsa home-throne. Aesthetic upgrades; family-channel warmth; mother-call.',
  'Venus Transits the 5th House':
    'Beauty on creative-discipline. Polished course design, elegant thesis defense.',
  'Venus Transits the 6th House':
    'Beauty on conflict. Mediated settlements, charm-led HR.',
  'Venus Transits the 7th House':
    'Venus on Malavya throne. Peak partnership month. Sign the warm JV; take the anniversary moment.',
  'Venus Transits the 8th House':
    'Beauty in Vipareet chamber. Equity-event diplomacy; succession with grace.',
  'Venus Transits the 9th House':
    'Beauty on dharma. International stage with grace; cross-cultural diplomacy.',
  'Venus Transits the 10th House':
    'Public-aesthetic visibility. Brand campaigns; design-led PR; senior-network reads you as elegant.',
  'Venus Transits the 11th House':
    'Beauty on emotional-network. Cooperative-platform diplomacy; women-led-network warmth.',
  'Venus Transits the 12th House':
    'Beauty on retreat-throne. Confidential design work; foreign-luxury back channel.',

  // — Mars transits —
  'Mars Transits the 1st House':
    'Mars on body-mind. Bold founder-craftsman moves; watch impulsivity. Pair speed with discipline.',
  'Mars Transits the 2nd House':
    'Mars on income and voice. Argue from documentation, not heat.',
  'Mars Transits the 3rd House':
    'Mars on communication. Bold sales sequences, fierce pitch-mode.',
  'Mars Transits the 4th House':
    'Mars on Hamsa home-throne. Property disputes, family friction. Don\'t fight family in heat — wait two days.',
  'Mars Transits the 5th House':
    'Mars on creative-discipline. Bold creative shipping; contested speculative bets.',
  'Mars Transits the 6th House':
    'Mars on adversary — strong terrain. The fight is winnable. Press the audit, push the lawsuit, fire the difficult subordinate.',
  'Mars Transits the 7th House':
    'Mars on Malavya partnership. Bold deal-making; force-clarified partnership conversations.',
  'Mars Transits the 8th House':
    'Mars on its own Vipareet throne. Peak transformation-action year. Lead the surgical succession; force the equity-event resolution.',
  'Mars Transits the 9th House':
    'Mars on dharma-detachment. Bold teaching declarations, foreign-credential pushes.',
  'Mars Transits the 10th House':
    'Mars on career-throne. Bold public moves; demand-the-title windows. Watch heat with the boss.',
  'Mars Transits the 11th House':
    'Mars on emotional-network. Contested cooperative-platform pushes; bold mother-figure-network engagement.',
  'Mars Transits the 12th House':
    'Mars in confidential combat. Behind-the-scenes warrior; watch hidden enemies.',

  // — Jupiter transits —
  'Jupiter Transits the 1st House':
    'Major year for self-expansion. Accept the role-elevation; declare the larger ambition. Discipline diet — Jupiter expands the body too.',
  'Jupiter Transits the 2nd House':
    'Major year for income and voice expansion. Salary-jumps, family-money inflows, voice-project breakthrough.',
  'Jupiter Transits the 3rd House':
    'Major year for communication-expansion. Publishing, broadcasting, sales-leadership growth.',
  'Jupiter Transits the 4th House':
    'Jupiter on Hamsa throne. Peak home-throne expansion year. Real-estate acquisition; family-business growth; school-leadership offers.',
  'Jupiter Transits the 5th House':
    'Major year for creative-discipline expansion. Course-platform breakthrough, multi-year-thesis publication, mentor-of-mentees role.',
  'Jupiter Transits the 6th House':
    'Major year for adversary-victory. Long lawsuits resolve favorably; chronic adversaries fade.',
  'Jupiter Transits the 7th House':
    'Major year for Malavya partnership expansion. Marriage, principal-client, JV principal arrive.',
  'Jupiter Transits the 8th House':
    'Major year for Vipareet transformation gains. Inheritance, severance, equity-event windfall.',
  'Jupiter Transits the 9th House':
    'Major year for dharma-expansion. Foreign credentials, teaching-platform breakthrough, judicial endorsements.',
  'Jupiter Transits the 10th House':
    'Major year for public-career expansion. Chief-of-something offers, prestige roles, board appointments.',
  'Jupiter Transits the 11th House':
    'Major year for emotional-network gain. Bonus-pool windfall, equity true-up, women-led-network elevation.',
  'Jupiter Transits the 12th House':
    'Major year for behind-the-scenes expansion. Foreign work, retreats, confidential mandates, pilgrimage chapter.',

  // — Saturn transits —
  'Saturn Transits the 1st House':
    'Multi-year structural pressure on body and identity. Health discipline mandatory; vanity falls away.',
  'Saturn Transits the 2nd House':
    'Multi-year discipline on income, voice, family-finance.',
  'Saturn Transits the 3rd House':
    'Multi-year discipline on communication. Long-arc content systems compound.',
  'Saturn Transits the 4th House':
    'Multi-year discipline on Hamsa home-throne. Real-estate restructuring; family-reckoning.',
  'Saturn Transits the 5th House':
    'Saturn on its own creative throne. Peak structural-creative chapter of the cycle. The 10-year thesis lands.',
  'Saturn Transits the 6th House':
    'Saturn\'s strong terrain. Multi-year peak adversary-management. Patience-and-paperwork wins.',
  'Saturn Transits the 7th House':
    'Multi-year structural test of Malavya partnership. Weak deals end; strong ones formalize for 30 years.',
  'Saturn Transits the 8th House':
    'Multi-year reckoning in Vipareet chamber. Patience pays.',
  'Saturn Transits the 9th House':
    'Multi-year dharma-discipline. Long credential paths; slow climb to elder-teacher status.',
  'Saturn Transits the 10th House':
    'Multi-year structural-career chapter. Slow recognition; foundation-laying for legacy authority.',
  'Saturn Transits the 11th House':
    'Multi-year discipline on emotional-network. Cooperative platforms formalize; board roles consolidate.',
  'Saturn Transits the 12th House':
    'Multi-year discipline on behind-the-scenes. Long retreat-chapter; quiet authority builds.',

  // — Rahu transits —
  'Rahu Transits the 1st House':
    'Eighteen-month obsessive identity-reinvention. Verify each move; the obsession runs hot.',
  'Rahu Transits the 2nd House':
    'Eighteen-month obsession on income and voice. Verify get-rich schemes.',
  'Rahu Transits the 3rd House':
    'Rahu on its strong terrain (3H). Eighteen-month obsessive communication chapter. Viral content, controversial messaging — verify integrity.',
  'Rahu Transits the 4th House':
    'Eighteen-month home-throne obsession. Foreign-property pull; verify titles.',
  'Rahu Transits the 5th House':
    'Eighteen-month obsessive creative chapter. Speculation, viral courses — verify ethical bedrock.',
  'Rahu Transits the 6th House':
    'Favorable. Eighteen-month obsessive adversary-defeat chapter.',
  'Rahu Transits the 7th House':
    'Eighteen-month obsessive partnership chapter. Verify counterparty integrity.',
  'Rahu Transits the 8th House':
    'Eighteen-month obsessive Vipareet chapter. Verify everything in the opaque deal.',
  'Rahu Transits the 9th House':
    'Eighteen-month foreign-dharma obsession on Ketu zone. Vet the controversial teacher.',
  'Rahu Transits the 10th House':
    'Eighteen-month career-reinvention obsession. Verify each pivot.',
  'Rahu Transits the 11th House':
    'Eighteen-month obsessive wide-network chapter. Verify integrity.',
  'Rahu Transits the 12th House':
    'Eighteen-month foreign-confidential obsession. Hidden mandates, off-balance-sheet intensities.',

  // — Ketu transits —
  'Ketu Transits the 1st House':
    'Eighteen-month identity-stripping. Old persona feels empty. Sit; do not over-correct.',
  'Ketu Transits the 2nd House':
    'Eighteen-month detachment from income, voice, family-money. Cravings dissolve.',
  'Ketu Transits the 3rd House':
    'Eighteen-month communication-detachment. Old content-loops feel finished.',
  'Ketu Transits the 4th House':
    'Eighteen-month home-throne detachment. Old real-estate plans feel weightless.',
  'Ketu Transits the 5th House':
    'Eighteen-month creative-detachment. Old performance-loops feel finished.',
  'Ketu Transits the 6th House':
    'Eighteen-month adversary-detachment. Long enemies fade quietly.',
  'Ketu Transits the 7th House':
    'Eighteen-month partnership-detachment. Old deal feels finished.',
  'Ketu Transits the 8th House':
    'Eighteen-month transformation-acceleration. Old crises evaporate.',
  'Ketu Transits the 9th House':
    'Ketu on its own placement. Peak dharma-detachment chapter. Old guru-loyalties dissolve completely.',
  'Ketu Transits the 10th House':
    'Eighteen-month career-eclipse. Old role feels weightless.',
  'Ketu Transits the 11th House':
    'Eighteen-month wide-network detachment. Old friend-circles drift.',
  'Ketu Transits the 12th House':
    'Eighteen-month behind-the-scenes detachment. Old retreats close.',

  // ──────────────────────────────── ANGLE ASPECTS (72) ──────────────────────
  'Sun Aspecting Ascendant (ASC)':
    'Visibility radiates through the analyst-craftsman persona. Take public stage.',
  'Sun Aspecting Ascendant (ASC) : Starts':
    'Visibility window opens. Polish public-facing materials.',
  'Sun Aspecting Ascendant (ASC) : Exact':
    'Peak visibility day. Take the stage; declare the role.',
  'Sun Aspecting Ascendant (ASC) : Ends':
    'Visibility window closes. Convert into binding title.',
  'Sun Aspecting Midheaven (MC)':
    'Peak career-visibility window. Launch flagship initiatives.',
  'Sun Aspecting Midheaven (MC) : Starts':
    'Career-visibility window opens.',
  'Sun Aspecting Midheaven (MC) : Exact':
    'Peak career-visibility day. Take the elevation.',
  'Sun Aspecting Midheaven (MC) : Ends':
    'Career-visibility window closes. Lock in title or compensation.',
  'Moon Aspecting Ascendant (ASC)':
    'Emotional charge on persona. Warm reception possible.',
  'Moon Aspecting Ascendant (ASC) : Starts':
    'Emotional-self window opens.',
  'Moon Aspecting Ascendant (ASC) : Exact':
    'Peak emotional-self day. Receive the warmth.',
  'Moon Aspecting Ascendant (ASC) : Ends':
    'Emotional-self window closes.',
  'Moon Aspecting Midheaven (MC)':
    'Emotional charge on public reputation.',
  'Moon Aspecting Midheaven (MC) : Starts':
    'Emotional career window opens.',
  'Moon Aspecting Midheaven (MC) : Exact':
    'Peak emotional career day. Take the warm-toned senior call.',
  'Moon Aspecting Midheaven (MC) : Ends':
    'Emotional career window closes.',
  'Mercury Aspecting Ascendant (ASC)':
    'Mercury\'s Bhadra throne. Peak self-articulation. Refresh CV; structure the choice.',
  'Mercury Aspecting Ascendant (ASC) : Starts':
    'Bhadra-self window opens.',
  'Mercury Aspecting Ascendant (ASC) : Exact':
    'Peak Bhadra day. Send the carefully-articulated note; make the structured decision.',
  'Mercury Aspecting Ascendant (ASC) : Ends':
    'Bhadra-self window closes.',
  'Mercury Aspecting Midheaven (MC)':
    'Sharp career-communication. Publish; present.',
  'Mercury Aspecting Midheaven (MC) : Starts':
    'Career-communication window opens.',
  'Mercury Aspecting Midheaven (MC) : Exact':
    'Peak day. Publish, present, send the formal update.',
  'Mercury Aspecting Midheaven (MC) : Ends':
    'Career-communication window closes.',
  'Venus Aspecting Ascendant (ASC)':
    'Beauty on the analyst-self. Make the warm ask; charm-led moves win.',
  'Venus Aspecting Ascendant (ASC) : Starts':
    'Venus-self window opens.',
  'Venus Aspecting Ascendant (ASC) : Exact':
    'Peak charm day. The warm ask works.',
  'Venus Aspecting Ascendant (ASC) : Ends':
    'Venus-self window closes.',
  'Venus Aspecting Midheaven (MC)':
    'Softens the public face. Brand campaigns; design-led PR.',
  'Venus Aspecting Midheaven (MC) : Starts':
    'Aesthetic-career window opens.',
  'Venus Aspecting Midheaven (MC) : Exact':
    'Peak day. Launch the campaign.',
  'Venus Aspecting Midheaven (MC) : Ends':
    'Aesthetic-career window closes.',
  'Mars Aspecting Ascendant (ASC)':
    'Bold body-anchored self-action; warrior moves.',
  'Mars Aspecting Ascendant (ASC) : Starts':
    'Action-self window opens.',
  'Mars Aspecting Ascendant (ASC) : Exact':
    'Peak action-self day. Take the bold move.',
  'Mars Aspecting Ascendant (ASC) : Ends':
    'Action-self window closes.',
  'Mars Aspecting Midheaven (MC)':
    'Bold career action.',
  'Mars Aspecting Midheaven (MC) : Starts':
    'Career-action window opens.',
  'Mars Aspecting Midheaven (MC) : Exact':
    'Peak career-action day. Lead.',
  'Mars Aspecting Midheaven (MC) : Ends':
    'Career-action window closes.',
  'Jupiter Aspecting Ascendant (ASC)':
    'Wisdom-expansion of persona. Take the role-elevation.',
  'Jupiter Aspecting Ascendant (ASC) : Starts':
    'Self-expansion window opens.',
  'Jupiter Aspecting Ascendant (ASC) : Exact':
    'Peak self-expansion day. Accept the elevation.',
  'Jupiter Aspecting Ascendant (ASC) : Ends':
    'Self-expansion window closes.',
  'Jupiter Aspecting Midheaven (MC)':
    'Peak career-expansion. Take the chief role.',
  'Jupiter Aspecting Midheaven (MC) : Starts':
    'Career-expansion window opens.',
  'Jupiter Aspecting Midheaven (MC) : Exact':
    'Peak career-expansion day.',
  'Jupiter Aspecting Midheaven (MC) : Ends':
    'Career-expansion window closes.',
  'Saturn Aspecting Ascendant (ASC)':
    'Heavy structural pressure on body and identity. Slow down; build for permanence.',
  'Saturn Aspecting Ascendant (ASC) : Starts':
    'Structural-self window opens.',
  'Saturn Aspecting Ascendant (ASC) : Exact':
    'Peak structural-self day. Hold steady.',
  'Saturn Aspecting Ascendant (ASC) : Ends':
    'Structural-self window closes.',
  'Saturn Aspecting Midheaven (MC)':
    'Heavy structural pressure on career. Foundation-laying for legacy.',
  'Saturn Aspecting Midheaven (MC) : Starts':
    'Career-discipline window opens.',
  'Saturn Aspecting Midheaven (MC) : Exact':
    'Peak career-discipline day.',
  'Saturn Aspecting Midheaven (MC) : Ends':
    'Career-discipline window closes.',
  'Rahu Aspecting Ascendant (ASC)':
    'Chaotic identity expansion; verify each move.',
  'Rahu Aspecting Ascendant (ASC) : Starts':
    'Reinvention window begins.',
  'Rahu Aspecting Ascendant (ASC) : Exact':
    'Peak reinvention day. Check basics.',
  'Rahu Aspecting Ascendant (ASC) : Ends':
    'Reinvention window closes.',
  'Rahu Aspecting Midheaven (MC)':
    'Chaotic visibility expansion. Verify before pivoting.',
  'Rahu Aspecting Midheaven (MC) : Starts':
    'Career-reinvention window begins.',
  'Rahu Aspecting Midheaven (MC) : Exact':
    'Peak day. Verify integrity.',
  'Rahu Aspecting Midheaven (MC) : Ends':
    'Career-reinvention window closes.',
  'Ketu Aspecting Ascendant (ASC)':
    'Identity-stripping. Sit with the dissolution.',
  'Ketu Aspecting Ascendant (ASC) : Starts':
    'Stripping window opens.',
  'Ketu Aspecting Ascendant (ASC) : Exact':
    'Peak stripping day. Do not leap.',
  'Ketu Aspecting Ascendant (ASC) : Ends':
    'Stripping window closes.',
  'Ketu Aspecting Midheaven (MC)':
    'Visibility eclipse. Don\'t cling to a role wanting to end.',
  'Ketu Aspecting Midheaven (MC) : Starts':
    'Career-eclipse window begins.',
  'Ketu Aspecting Midheaven (MC) : Exact':
    'Peak career-eclipse day. Don\'t cling.',
  'Ketu Aspecting Midheaven (MC) : Ends':
    'Career-eclipse window closes.',

  // ─────────────────────────────── OUTER SPECIALS (8) ───────────────────────
  'Pluto conjunct Saturn':
    'Generational structural reckoning hitting your creative-discipline engine. Multi-year creative-platform transformation.',
  'Pluto conjunct Saturn : Starts':
    'Multi-year structural reckoning begins.',
  'Pluto conjunct Saturn : Exact':
    'Peak structural-transformation day. Old creative frameworks dismantle.',
  'Pluto conjunct Saturn : Ends':
    'Structural-transformation chapter completes; rebuilt authority.',
  'Uranus conjunct Venus':
    'Sudden disruption hitting the Malavya partnership engine. Unexpected partner pivots.',
  'Uranus conjunct Venus : Starts':
    'Sudden partnership disruption window opens.',
  'Uranus conjunct Venus : Exact':
    'Peak partnership disruption day. The relational pivot is forced.',
  'Uranus conjunct Venus : Ends':
    'Partnership disruption window closes.',

  // ─────────────────────────────────── ASPECTS (324) ─────────────────────────
  // — Sun aspects natal —
  'Sun aspect Sun in 12th house':
    'Solar light on retreat-throne. Best for behind-the-scenes mandates, foreign assignments, archival-research roles.',
  'Sun aspect Sun in 12th house : Starts':
    'Retreat-throne window opens.',
  'Sun aspect Sun in 12th house : Exact':
    'Peak day. Take the foreign assignment, the archival role.',
  'Sun aspect Sun in 12th house : Ends':
    'Retreat-throne window closes.',
  'Sun aspect Moon in 11th house':
    'Solar fire on emotional-network. Mother-figure mentorship inflection; women-led-network visibility.',
  'Sun aspect Moon in 11th house : Starts':
    'Emotional-network window opens.',
  'Sun aspect Moon in 11th house : Exact':
    'Peak day. Accept the mother-figure mentorship inflection.',
  'Sun aspect Moon in 11th house : Ends':
    'Emotional-network window closes.',
  'Sun aspect Mercury in 1st house':
    'Solar fire on Bhadra. Founder-as-craftsman declaration; technical-authorship publication.',
  'Sun aspect Mercury in 1st house : Starts':
    'Bhadra-fire window opens.',
  'Sun aspect Mercury in 1st house : Exact':
    'Peak Bhadra-solar day. Publish; declare; launch.',
  'Sun aspect Mercury in 1st house : Ends':
    'Bhadra-fire window closes.',
  'Sun aspect Venus in 7th house':
    'Solar fire on Malavya partnership. Anchor-deal visibility; spouse elevation; principal-client expansion.',
  'Sun aspect Venus in 7th house : Starts':
    'Malavya-fire window opens.',
  'Sun aspect Venus in 7th house : Exact':
    'Peak Malavya day. Sign the JV; take the deal public.',
  'Sun aspect Venus in 7th house : Ends':
    'Malavya-fire window closes.',
  'Sun aspect Mars in 8th house':
    'Solar fire on Vipareet engine. Surgical succession move; equity-event combat.',
  'Sun aspect Mars in 8th house : Starts':
    'Vipareet-fire window opens.',
  'Sun aspect Mars in 8th house : Exact':
    'Peak Vipareet-solar day. Lead the restructuring; force the resolution.',
  'Sun aspect Mars in 8th house : Ends':
    'Vipareet-fire window closes.',
  'Sun aspect Jupiter in 4th house':
    'Solar fire on Hamsa home-throne. Real-estate visibility, family-business public moves.',
  'Sun aspect Jupiter in 4th house : Starts':
    'Hamsa-fire window opens.',
  'Sun aspect Jupiter in 4th house : Exact':
    'Peak Hamsa-solar day. Acquire the property; expand the family business.',
  'Sun aspect Jupiter in 4th house : Ends':
    'Hamsa-fire window closes.',
  'Sun aspect Saturn in 5th house':
    'Solar fire on creative-discipline. Long thesis defense; course-platform launch; mentorship debut.',
  'Sun aspect Saturn in 5th house : Starts':
    'Creative-discipline-fire window opens.',
  'Sun aspect Saturn in 5th house : Exact':
    'Peak day. Defend the thesis; launch the platform.',
  'Sun aspect Saturn in 5th house : Ends':
    'Creative-discipline-fire window closes.',
  'Sun aspect Rahu in 3rd house':
    'Solar fire on viral-content zone. Verify integrity before publishing.',
  'Sun aspect Rahu in 3rd house : Starts':
    'Communication-chaos-fire window opens.',
  'Sun aspect Rahu in 3rd house : Exact':
    'Peak day. Take the bold communication move with full ethical-bedrock check.',
  'Sun aspect Rahu in 3rd house : Ends':
    'Communication-chaos-fire window closes.',
  'Sun aspect Ketu in 9th house':
    'Solar light on dharma-detachment. Old guru-attachments dissolve; principle remains.',
  'Sun aspect Ketu in 9th house : Starts':
    'Dharma-detachment-fire window opens.',
  'Sun aspect Ketu in 9th house : Exact':
    'Peak day. Release the old teacher-attachment.',
  'Sun aspect Ketu in 9th house : Ends':
    'Dharma-detachment-fire window closes.',

  // — Moon aspects natal —
  'Moon aspect Sun in 12th house':
    'Emotional charge on retreat-throne. Quiet authority rises; pause public moves.',
  'Moon aspect Sun in 12th house : Starts':
    'Retreat-emotion window opens.',
  'Moon aspect Sun in 12th house : Exact':
    'Peak day. Take the confidential meeting; write the private memo.',
  'Moon aspect Sun in 12th house : Ends':
    'Retreat-emotion window closes.',
  'Moon aspect Moon in 11th house':
    'Moon\'s own-sign return on gain-throne. Peak monthly emotional-network warmth.',
  'Moon aspect Moon in 11th house : Starts':
    'Gain-emotion window opens.',
  'Moon aspect Moon in 11th house : Exact':
    'Peak day. Reach out to mother-figure mentor; take the women-led-network call.',
  'Moon aspect Moon in 11th house : Ends':
    'Gain-emotion window closes.',
  'Moon aspect Mercury in 1st house':
    'Emotional warmth on Bhadra. The technical writing carries feeling.',
  'Moon aspect Mercury in 1st house : Starts':
    'Bhadra-emotion window opens.',
  'Moon aspect Mercury in 1st house : Exact':
    'Peak day. Write the warm technical post.',
  'Moon aspect Mercury in 1st house : Ends':
    'Bhadra-emotion window closes.',
  'Moon aspect Venus in 7th house':
    'Emotional charge on Malavya partnership. Read partner temperature; soften deal-tone.',
  'Moon aspect Venus in 7th house : Starts':
    'Malavya-emotion window opens.',
  'Moon aspect Venus in 7th house : Exact':
    'Peak day. Lead with warmth in the JV meeting.',
  'Moon aspect Venus in 7th house : Ends':
    'Malavya-emotion window closes.',
  'Moon aspect Mars in 8th house':
    'Emotional weight on Vipareet zone. Defer restructuring move two days.',
  'Moon aspect Mars in 8th house : Starts':
    'Vipareet-emotion window opens.',
  'Moon aspect Mars in 8th house : Exact':
    'Peak day. Sit with transformation-anxiety; do not act in heat.',
  'Moon aspect Mars in 8th house : Ends':
    'Vipareet-emotion window closes.',
  'Moon aspect Jupiter in 4th house':
    'Emotional warmth on Hamsa home-throne. Mother-channel calls.',
  'Moon aspect Jupiter in 4th house : Starts':
    'Hamsa-emotion window opens.',
  'Moon aspect Jupiter in 4th house : Exact':
    'Peak day. Cook a real meal; visit family.',
  'Moon aspect Jupiter in 4th house : Ends':
    'Hamsa-emotion window closes.',
  'Moon aspect Saturn in 5th house':
    'Emotional weight on creative-discipline. The long thesis feels heavy; honor the long arc.',
  'Moon aspect Saturn in 5th house : Starts':
    'Creative-discipline-emotion window opens.',
  'Moon aspect Saturn in 5th house : Exact':
    'Peak day. Honor the slow craft; the heaviness is the foundation.',
  'Moon aspect Saturn in 5th house : Ends':
    'Creative-discipline-emotion window closes.',
  'Moon aspect Rahu in 3rd house':
    'Emotional swing on communication-chaos. Verify before publishing in heat.',
  'Moon aspect Rahu in 3rd house : Starts':
    'Communication-chaos-emotion window opens.',
  'Moon aspect Rahu in 3rd house : Exact':
    'Peak day. Defer the viral-content move two days.',
  'Moon aspect Rahu in 3rd house : Ends':
    'Communication-chaos-emotion window closes.',
  'Moon aspect Ketu in 9th house':
    'Emotional detachment from teacher.',
  'Moon aspect Ketu in 9th house : Starts':
    'Dharma-detachment-emotion window opens.',
  'Moon aspect Ketu in 9th house : Exact':
    'Peak day. Sit with the teacher-attachment dissolving.',
  'Moon aspect Ketu in 9th house : Ends':
    'Dharma-detachment-emotion window closes.',

  // — Mercury aspects natal —
  'Mercury aspect Sun in 12th house':
    'Sharp articulation of retreat-throne. Confidential memos, foreign correspondence.',
  'Mercury aspect Sun in 12th house : Starts':
    'Retreat-articulation window opens.',
  'Mercury aspect Sun in 12th house : Exact':
    'Peak day. Send the confidential memo.',
  'Mercury aspect Sun in 12th house : Ends':
    'Retreat-articulation window closes.',
  'Mercury aspect Moon in 11th house':
    'Sharp articulation on emotional-network. Community correspondence; mother-figure-mentor letter.',
  'Mercury aspect Moon in 11th house : Starts':
    'Network-articulation window opens.',
  'Mercury aspect Moon in 11th house : Exact':
    'Peak day. Send the warm community-letter.',
  'Mercury aspect Moon in 11th house : Ends':
    'Network-articulation window closes.',
  'Mercury aspect Mercury in 1st house':
    'Mercury\'s Bhadra return. Peak self-articulation day. The mind is at its sharpest annual setting.',
  'Mercury aspect Mercury in 1st house : Starts':
    'Bhadra peak window opens.',
  'Mercury aspect Mercury in 1st house : Exact':
    'Peak Bhadra day. Make the year\'s clearest decisions; ship the masterpiece deliverable.',
  'Mercury aspect Mercury in 1st house : Ends':
    'Bhadra peak window closes.',
  'Mercury aspect Venus in 7th house':
    'Sharp Malavya partnership articulation. Term sheets, JV memos.',
  'Mercury aspect Venus in 7th house : Starts':
    'Partnership-articulation window opens.',
  'Mercury aspect Venus in 7th house : Exact':
    'Peak day. Send the term sheet; sign the contract.',
  'Mercury aspect Venus in 7th house : Ends':
    'Partnership-articulation window closes.',
  'Mercury aspect Mars in 8th house':
    'Sharp Vipareet articulation. Succession plans; restructuring memos; equity-event paperwork.',
  'Mercury aspect Mars in 8th house : Starts':
    'Vipareet-articulation window opens.',
  'Mercury aspect Mars in 8th house : Exact':
    'Peak day. Document the opaque deal precisely.',
  'Mercury aspect Mars in 8th house : Ends':
    'Vipareet-articulation window closes.',
  'Mercury aspect Jupiter in 4th house':
    'Sharp Hamsa home-throne articulation. Real-estate paperwork, family-business memos.',
  'Mercury aspect Jupiter in 4th house : Starts':
    'Hamsa-articulation window opens.',
  'Mercury aspect Jupiter in 4th house : Exact':
    'Peak day. File the property paper.',
  'Mercury aspect Jupiter in 4th house : Ends':
    'Hamsa-articulation window closes.',
  'Mercury aspect Saturn in 5th house':
    'Sharp creative-discipline articulation. Multi-year-thesis chapters, course-module memos.',
  'Mercury aspect Saturn in 5th house : Starts':
    'Creative-discipline-articulation window opens.',
  'Mercury aspect Saturn in 5th house : Exact':
    'Peak day. Ship the thesis chapter.',
  'Mercury aspect Saturn in 5th house : Ends':
    'Creative-discipline-articulation window closes.',
  'Mercury aspect Rahu in 3rd house':
    'Sharp communication-chaos articulation. Viral-content drafts — verify integrity.',
  'Mercury aspect Rahu in 3rd house : Starts':
    'Communication-chaos-articulation window opens.',
  'Mercury aspect Rahu in 3rd house : Exact':
    'Peak day. Polish the viral-content draft; verify before publishing.',
  'Mercury aspect Rahu in 3rd house : Ends':
    'Communication-chaos-articulation window closes.',
  'Mercury aspect Ketu in 9th house':
    'Sharp dharma-detachment articulation. Audit teacher-attachments.',
  'Mercury aspect Ketu in 9th house : Starts':
    'Dharma-detachment-articulation window opens.',
  'Mercury aspect Ketu in 9th house : Exact':
    'Peak day. Write the closure note to the old teacher-channel.',
  'Mercury aspect Ketu in 9th house : Ends':
    'Dharma-detachment-articulation window closes.',

  // — Venus aspects natal —
  'Venus aspect Sun in 12th house':
    'Beauty on retreat-throne. Confidential design work; foreign-luxury back channel.',
  'Venus aspect Sun in 12th house : Starts':
    'Retreat-beauty window opens.',
  'Venus aspect Sun in 12th house : Exact':
    'Peak day. Soften the confidential meeting; design the elegant retreat space.',
  'Venus aspect Sun in 12th house : Ends':
    'Retreat-beauty window closes.',
  'Venus aspect Moon in 11th house':
    'Beauty on emotional-network. Cooperative-platform diplomacy.',
  'Venus aspect Moon in 11th house : Starts':
    'Network-beauty window opens.',
  'Venus aspect Moon in 11th house : Exact':
    'Peak day. Take the warm women-led-network call.',
  'Venus aspect Moon in 11th house : Ends':
    'Network-beauty window closes.',
  'Venus aspect Mercury in 1st house':
    'Beauty on Bhadra craftsman-throne. Refine the technical aesthetic.',
  'Venus aspect Mercury in 1st house : Starts':
    'Bhadra-beauty window opens.',
  'Venus aspect Mercury in 1st house : Exact':
    'Peak day. Polish the technical writing.',
  'Venus aspect Mercury in 1st house : Ends':
    'Bhadra-beauty window closes.',
  'Venus aspect Venus in 7th house':
    'Venus on Malavya throne. Peak partnership-grace day. The deal closes warmly.',
  'Venus aspect Venus in 7th house : Starts':
    'Malavya peak window opens.',
  'Venus aspect Venus in 7th house : Exact':
    'Peak Malavya day. Take the elegant partnership move.',
  'Venus aspect Venus in 7th house : Ends':
    'Malavya peak window closes.',
  'Venus aspect Mars in 8th house':
    'Beauty in Vipareet chamber. Equity-event diplomacy.',
  'Venus aspect Mars in 8th house : Starts':
    'Vipareet-beauty window opens.',
  'Venus aspect Mars in 8th house : Exact':
    'Peak day. Take the elegant succession meeting.',
  'Venus aspect Mars in 8th house : Ends':
    'Vipareet-beauty window closes.',
  'Venus aspect Jupiter in 4th house':
    'Beauty on Hamsa home-throne. Property diplomacy; family-business charm.',
  'Venus aspect Jupiter in 4th house : Starts':
    'Hamsa-beauty window opens.',
  'Venus aspect Jupiter in 4th house : Exact':
    'Peak day. Soften the property negotiation.',
  'Venus aspect Jupiter in 4th house : Ends':
    'Hamsa-beauty window closes.',
  'Venus aspect Saturn in 5th house':
    'Beauty on creative-discipline. Polished course design.',
  'Venus aspect Saturn in 5th house : Starts':
    'Creative-discipline-beauty window opens.',
  'Venus aspect Saturn in 5th house : Exact':
    'Peak day. Polish the course visuals.',
  'Venus aspect Saturn in 5th house : Ends':
    'Creative-discipline-beauty window closes.',
  'Venus aspect Rahu in 3rd house':
    'Beauty on communication-chaos zone. Polished viral content — verify integrity.',
  'Venus aspect Rahu in 3rd house : Starts':
    'Communication-chaos-beauty window opens.',
  'Venus aspect Rahu in 3rd house : Exact':
    'Peak day. Polish the viral-content draft.',
  'Venus aspect Rahu in 3rd house : Ends':
    'Communication-chaos-beauty window closes.',
  'Venus aspect Ketu in 9th house':
    'Beauty on dharma-detachment. Old teacher-aesthetic feels weightless.',
  'Venus aspect Ketu in 9th house : Starts':
    'Dharma-detachment-beauty window opens.',
  'Venus aspect Ketu in 9th house : Exact':
    'Peak day. Release the old teacher-aesthetic.',
  'Venus aspect Ketu in 9th house : Ends':
    'Dharma-detachment-beauty window closes.',

  // — Mars aspects natal —
  'Mars aspect Sun in 12th house':
    'Mars on retreat-throne. Behind-the-scenes warrior moves; foreign-mandate aggression.',
  'Mars aspect Sun in 12th house : Starts':
    'Retreat-fire window opens.',
  'Mars aspect Sun in 12th house : Exact':
    'Peak day. Take the confidential force-play.',
  'Mars aspect Sun in 12th house : Ends':
    'Retreat-fire window closes.',
  'Mars aspect Moon in 11th house':
    'Mars on gain-network. Bold mother-figure-network moves; contested cooperative-platform pushes.',
  'Mars aspect Moon in 11th house : Starts':
    'Gain-fire window opens.',
  'Mars aspect Moon in 11th house : Exact':
    'Peak day. Push the network move.',
  'Mars aspect Moon in 11th house : Ends':
    'Gain-fire window closes.',
  'Mars aspect Mercury in 1st house':
    'Mars on Bhadra craftsman-throne. Bold founder-craftsman moves.',
  'Mars aspect Mercury in 1st house : Starts':
    'Bhadra-fire window opens.',
  'Mars aspect Mercury in 1st house : Exact':
    'Peak day. Take the bold technical-authorship move.',
  'Mars aspect Mercury in 1st house : Ends':
    'Bhadra-fire window closes.',
  'Mars aspect Venus in 7th house':
    'Mars on Malavya partnership. Bold deal-making.',
  'Mars aspect Venus in 7th house : Starts':
    'Malavya-fire window opens.',
  'Mars aspect Venus in 7th house : Exact':
    'Peak day. Sign the JV; force the partnership clarity.',
  'Mars aspect Venus in 7th house : Ends':
    'Malavya-fire window closes.',
  'Mars aspect Mars in 8th house':
    'Mars on its own Vipareet throne. Peak transformation-fire day. Surgical action at full force.',
  'Mars aspect Mars in 8th house : Starts':
    'Vipareet peak window opens.',
  'Mars aspect Mars in 8th house : Exact':
    'Peak Vipareet day. Lead the restructuring; force the resolution.',
  'Mars aspect Mars in 8th house : Ends':
    'Vipareet peak window closes.',
  'Mars aspect Jupiter in 4th house':
    'Mars on Hamsa home-throne. Property disputes, family friction. Don\'t fight family in heat.',
  'Mars aspect Jupiter in 4th house : Starts':
    'Hamsa-fire window opens.',
  'Mars aspect Jupiter in 4th house : Exact':
    'Peak day. Defer family confrontation two days.',
  'Mars aspect Jupiter in 4th house : Ends':
    'Hamsa-fire window closes.',
  'Mars aspect Saturn in 5th house':
    'Mars on creative-discipline. Bold creative shipping.',
  'Mars aspect Saturn in 5th house : Starts':
    'Creative-fire window opens.',
  'Mars aspect Saturn in 5th house : Exact':
    'Peak day. Ship the bold thesis; place the contested bet.',
  'Mars aspect Saturn in 5th house : Ends':
    'Creative-fire window closes.',
  'Mars aspect Rahu in 3rd house':
    'Mars on communication-chaos. Bold viral-content pushes.',
  'Mars aspect Rahu in 3rd house : Starts':
    'Communication-fire window opens.',
  'Mars aspect Rahu in 3rd house : Exact':
    'Peak day. Push the contested piece — verify integrity.',
  'Mars aspect Rahu in 3rd house : Ends':
    'Communication-fire window closes.',
  'Mars aspect Ketu in 9th house':
    'Mars on dharma-detachment. Forceful release of teacher-attachments.',
  'Mars aspect Ketu in 9th house : Starts':
    'Dharma-detachment-fire window opens.',
  'Mars aspect Ketu in 9th house : Exact':
    'Peak day. Forcefully close the dead teacher-channel.',
  'Mars aspect Ketu in 9th house : Ends':
    'Dharma-detachment-fire window closes.',

  // — Jupiter aspects natal —
  'Jupiter aspect Sun in 12th house':
    'Wisdom on retreat-throne. Confidential mandate elevation; foreign assignment expansion.',
  'Jupiter aspect Sun in 12th house : Starts':
    'Retreat-expansion window opens.',
  'Jupiter aspect Sun in 12th house : Exact':
    'Peak day. Accept the confidential mandate elevation.',
  'Jupiter aspect Sun in 12th house : Ends':
    'Retreat-expansion window closes.',
  'Jupiter aspect Moon in 11th house':
    'Wisdom on emotional-network. Bonus-pool windfall; women-led-network elevation.',
  'Jupiter aspect Moon in 11th house : Starts':
    'Gain-expansion window opens.',
  'Jupiter aspect Moon in 11th house : Exact':
    'Peak day. Take the bonus; accept the equity true-up.',
  'Jupiter aspect Moon in 11th house : Ends':
    'Gain-expansion window closes.',
  'Jupiter aspect Mercury in 1st house':
    'Wisdom on Bhadra throne. Founder-craftsman elevation; technical-authorship breakthrough.',
  'Jupiter aspect Mercury in 1st house : Starts':
    'Bhadra-expansion window opens.',
  'Jupiter aspect Mercury in 1st house : Exact':
    'Peak day. Accept the founder-craftsman elevation.',
  'Jupiter aspect Mercury in 1st house : Ends':
    'Bhadra-expansion window closes.',
  'Jupiter aspect Venus in 7th house':
    'Wisdom on Malavya partnership. Anchor-deal expansion; marriage inflection.',
  'Jupiter aspect Venus in 7th house : Starts':
    'Malavya-expansion window opens.',
  'Jupiter aspect Venus in 7th house : Exact':
    'Peak day. Sign the elevated JV; accept the marriage inflection.',
  'Jupiter aspect Venus in 7th house : Ends':
    'Malavya-expansion window closes.',
  'Jupiter aspect Mars in 8th house':
    'Wisdom on Vipareet engine. Inheritance windfall; succession-led elevation.',
  'Jupiter aspect Mars in 8th house : Starts':
    'Vipareet-expansion window opens.',
  'Jupiter aspect Mars in 8th house : Exact':
    'Peak day. Take the inheritance; accept the succession elevation.',
  'Jupiter aspect Mars in 8th house : Ends':
    'Vipareet-expansion window closes.',
  'Jupiter aspect Jupiter in 4th house':
    'Jupiter on its own Hamsa throne. Peak home-throne expansion day. Real-estate windfall; family-business inflection.',
  'Jupiter aspect Jupiter in 4th house : Starts':
    'Hamsa peak window opens.',
  'Jupiter aspect Jupiter in 4th house : Exact':
    'Peak Hamsa day. Acquire the property; expand the family business.',
  'Jupiter aspect Jupiter in 4th house : Ends':
    'Hamsa peak window closes.',
  'Jupiter aspect Saturn in 5th house':
    'Wisdom on creative-discipline. Course-platform breakthrough; multi-year-thesis publication.',
  'Jupiter aspect Saturn in 5th house : Starts':
    'Creative-discipline-expansion window opens.',
  'Jupiter aspect Saturn in 5th house : Exact':
    'Peak day. Launch the course platform; defend the thesis.',
  'Jupiter aspect Saturn in 5th house : Ends':
    'Creative-discipline-expansion window closes.',
  'Jupiter aspect Rahu in 3rd house':
    'Wisdom on communication-chaos. Viral-content elevation; controversial-journalism breakthrough.',
  'Jupiter aspect Rahu in 3rd house : Starts':
    'Communication-chaos-expansion window opens.',
  'Jupiter aspect Rahu in 3rd house : Exact':
    'Peak day. Take the bold viral-content move.',
  'Jupiter aspect Rahu in 3rd house : Ends':
    'Communication-chaos-expansion window closes.',
  'Jupiter aspect Ketu in 9th house':
    'Wisdom on dharma-detachment. The released teacher-attachment becomes its own teaching.',
  'Jupiter aspect Ketu in 9th house : Starts':
    'Dharma-detachment-expansion window opens.',
  'Jupiter aspect Ketu in 9th house : Exact':
    'Peak day. Convert the released attachment into your own teaching.',
  'Jupiter aspect Ketu in 9th house : Ends':
    'Dharma-detachment-expansion window closes.',

  // — Saturn aspects natal —
  'Saturn aspect Sun in 12th house':
    'Structural pressure on retreat-throne. Long confidential mandates; slow foreign chapters.',
  'Saturn aspect Sun in 12th house : Starts':
    'Retreat-discipline window opens.',
  'Saturn aspect Sun in 12th house : Exact':
    'Peak day. Take the slow foreign assignment.',
  'Saturn aspect Sun in 12th house : Ends':
    'Retreat-discipline window closes.',
  'Saturn aspect Moon in 11th house':
    'Structural pressure on emotional-network. Cooperative platforms formalize.',
  'Saturn aspect Moon in 11th house : Starts':
    'Network-discipline window opens.',
  'Saturn aspect Moon in 11th house : Exact':
    'Peak day. Sign the cooperative-platform charter.',
  'Saturn aspect Moon in 11th house : Ends':
    'Network-discipline window closes.',
  'Saturn aspect Mercury in 1st house':
    'Structural pressure on Bhadra craftsman-throne. Slow self-evolution; vanity-skills fall away.',
  'Saturn aspect Mercury in 1st house : Starts':
    'Bhadra-discipline window opens.',
  'Saturn aspect Mercury in 1st house : Exact':
    'Peak day. Eliminate vanity-skills.',
  'Saturn aspect Mercury in 1st house : Ends':
    'Bhadra-discipline window closes.',
  'Saturn aspect Venus in 7th house':
    'Structural pressure on Malavya partnership. Weak deals end; strong ones formalize for 30 years.',
  'Saturn aspect Venus in 7th house : Starts':
    'Malavya-discipline window opens.',
  'Saturn aspect Venus in 7th house : Exact':
    'Peak day. Divorce the weak deal; formalize the strong JV.',
  'Saturn aspect Venus in 7th house : Ends':
    'Malavya-discipline window closes.',
  'Saturn aspect Mars in 8th house':
    'Structural pressure on Vipareet engine. Inheritance disputes; equity-event delays. Patience pays.',
  'Saturn aspect Mars in 8th house : Starts':
    'Vipareet-discipline window opens.',
  'Saturn aspect Mars in 8th house : Exact':
    'Peak day. Hold the line on the slow restructuring.',
  'Saturn aspect Mars in 8th house : Ends':
    'Vipareet-discipline window closes.',
  'Saturn aspect Jupiter in 4th house':
    'Structural pressure on Hamsa home-throne. Real-estate restructuring; family-reckoning.',
  'Saturn aspect Jupiter in 4th house : Starts':
    'Hamsa-discipline window opens.',
  'Saturn aspect Jupiter in 4th house : Exact':
    'Peak day. Take the slow real-estate decision.',
  'Saturn aspect Jupiter in 4th house : Ends':
    'Hamsa-discipline window closes.',
  'Saturn aspect Saturn in 5th house':
    'Saturn on its own creative throne. Peak structural-creative day of the multi-decade cycle.',
  'Saturn aspect Saturn in 5th house : Starts':
    'Saturn-creative peak window opens.',
  'Saturn aspect Saturn in 5th house : Exact':
    'Peak day. Defend the long thesis; lock in the multi-decade structure.',
  'Saturn aspect Saturn in 5th house : Ends':
    'Saturn-creative peak window closes.',
  'Saturn aspect Rahu in 3rd house':
    'Structural pressure on communication-chaos. Long-arc viral-content discipline.',
  'Saturn aspect Rahu in 3rd house : Starts':
    'Communication-discipline window opens.',
  'Saturn aspect Rahu in 3rd house : Exact':
    'Peak day. Lock in the multi-year content schedule.',
  'Saturn aspect Rahu in 3rd house : Ends':
    'Communication-discipline window closes.',
  'Saturn aspect Ketu in 9th house':
    'Structural pressure on dharma-detachment. Teacher-release formally documented.',
  'Saturn aspect Ketu in 9th house : Starts':
    'Dharma-detachment-discipline window opens.',
  'Saturn aspect Ketu in 9th house : Exact':
    'Peak day. Sign the formal closure of the dead teacher-channel.',
  'Saturn aspect Ketu in 9th house : Ends':
    'Dharma-detachment-discipline window closes.',

  // — Rahu aspects natal —
  'Rahu aspect Sun in 12th house':
    'Chaotic expansion on retreat-throne. Foreign-mandate fevers; verify each.',
  'Rahu aspect Sun in 12th house : Starts':
    'Retreat-chaos window opens.',
  'Rahu aspect Sun in 12th house : Exact':
    'Peak day. Vet the foreign mandate twice.',
  'Rahu aspect Sun in 12th house : Ends':
    'Retreat-chaos window closes.',
  'Rahu aspect Moon in 11th house':
    'Chaotic expansion on emotional-network. Sudden viral-network gains.',
  'Rahu aspect Moon in 11th house : Starts':
    'Network-chaos window opens.',
  'Rahu aspect Moon in 11th house : Exact':
    'Peak day. Take the viral-network move — verify ethical bedrock.',
  'Rahu aspect Moon in 11th house : Ends':
    'Network-chaos window closes.',
  'Rahu aspect Mercury in 1st house':
    'Chaotic expansion on Bhadra craftsman-throne. Sudden self-pivots.',
  'Rahu aspect Mercury in 1st house : Starts':
    'Bhadra-chaos window opens.',
  'Rahu aspect Mercury in 1st house : Exact':
    'Peak day. Take the bold pivot — verify the technical bedrock.',
  'Rahu aspect Mercury in 1st house : Ends':
    'Bhadra-chaos window closes.',
  'Rahu aspect Venus in 7th house':
    'Chaotic expansion on Malavya partnership. Verify counterparty integrity.',
  'Rahu aspect Venus in 7th house : Starts':
    'Malavya-chaos window opens.',
  'Rahu aspect Venus in 7th house : Exact':
    'Peak day. Vet the controversial JV thoroughly.',
  'Rahu aspect Venus in 7th house : Ends':
    'Malavya-chaos window closes.',
  'Rahu aspect Mars in 8th house':
    'Chaotic expansion on Vipareet engine. Sudden equity-event windfalls; verify everything.',
  'Rahu aspect Mars in 8th house : Starts':
    'Vipareet-chaos window opens.',
  'Rahu aspect Mars in 8th house : Exact':
    'Peak day. Take the equity-event move with full documentation.',
  'Rahu aspect Mars in 8th house : Ends':
    'Vipareet-chaos window closes.',
  'Rahu aspect Jupiter in 4th house':
    'Chaotic expansion on Hamsa home-throne. Foreign-property pull; verify titles.',
  'Rahu aspect Jupiter in 4th house : Starts':
    'Hamsa-chaos window opens.',
  'Rahu aspect Jupiter in 4th house : Exact':
    'Peak day. Vet the foreign-property paperwork.',
  'Rahu aspect Jupiter in 4th house : Ends':
    'Hamsa-chaos window closes.',
  'Rahu aspect Saturn in 5th house':
    'Chaotic expansion on creative-discipline. Speculative-fevers; viral-course pulls.',
  'Rahu aspect Saturn in 5th house : Starts':
    'Creative-chaos window opens.',
  'Rahu aspect Saturn in 5th house : Exact':
    'Peak day. Take the speculative-creative move with full ethical-bedrock check.',
  'Rahu aspect Saturn in 5th house : Ends':
    'Creative-chaos window closes.',
  'Rahu aspect Rahu in 3rd house':
    'Rahu return on its own placement. Peak communication-chaos day. Verify ethical bedrock.',
  'Rahu aspect Rahu in 3rd house : Starts':
    'Rahu-return communication window opens.',
  'Rahu aspect Rahu in 3rd house : Exact':
    'Peak Rahu-return day. Push the viral message — verify integrity.',
  'Rahu aspect Rahu in 3rd house : Ends':
    'Rahu-return window closes.',
  'Rahu aspect Ketu in 9th house':
    'Rahu-Ketu axis return on dharma-detachment. Peak teacher-attachment turbulence.',
  'Rahu aspect Ketu in 9th house : Starts':
    'Axis-chaos window opens.',
  'Rahu aspect Ketu in 9th house : Exact':
    'Peak day. Defer dharma decisions; the axis is too loud.',
  'Rahu aspect Ketu in 9th house : Ends':
    'Axis-chaos window closes.',

  // — Ketu aspects natal —
  'Ketu aspect Sun in 12th house':
    'Detachment on retreat-throne. Old confidential mandates feel weightless.',
  'Ketu aspect Sun in 12th house : Starts':
    'Retreat-detachment window opens.',
  'Ketu aspect Sun in 12th house : Exact':
    'Peak day. Sit with the confidential-mandate feeling weightless.',
  'Ketu aspect Sun in 12th house : Ends':
    'Retreat-detachment window closes.',
  'Ketu aspect Moon in 11th house':
    'Detachment on emotional-network. Old friend-circles drift.',
  'Ketu aspect Moon in 11th house : Starts':
    'Network-detachment window opens.',
  'Ketu aspect Moon in 11th house : Exact':
    'Peak day. Release the old friend-circle.',
  'Ketu aspect Moon in 11th house : Ends':
    'Network-detachment window closes.',
  'Ketu aspect Mercury in 1st house':
    'Detachment on Bhadra craftsman-throne. Old self-persona feels hollow.',
  'Ketu aspect Mercury in 1st house : Starts':
    'Bhadra-detachment window opens.',
  'Ketu aspect Mercury in 1st house : Exact':
    'Peak day. Sit with the craft feeling weightless; do not over-perform.',
  'Ketu aspect Mercury in 1st house : Ends':
    'Bhadra-detachment window closes.',
  'Ketu aspect Venus in 7th house':
    'Detachment on Malavya partnership. Old deal feels finished.',
  'Ketu aspect Venus in 7th house : Starts':
    'Malavya-detachment window opens.',
  'Ketu aspect Venus in 7th house : Exact':
    'Peak day. Sit with the deal feeling weightless.',
  'Ketu aspect Venus in 7th house : Ends':
    'Malavya-detachment window closes.',
  'Ketu aspect Mars in 8th house':
    'Detachment on Vipareet engine. Old crises evaporate.',
  'Ketu aspect Mars in 8th house : Starts':
    'Vipareet-detachment window opens.',
  'Ketu aspect Mars in 8th house : Exact':
    'Peak day. Release the old crisis-loop.',
  'Ketu aspect Mars in 8th house : Ends':
    'Vipareet-detachment window closes.',
  'Ketu aspect Jupiter in 4th house':
    'Detachment on Hamsa home-throne. Old real-estate plans feel weightless.',
  'Ketu aspect Jupiter in 4th house : Starts':
    'Hamsa-detachment window opens.',
  'Ketu aspect Jupiter in 4th house : Exact':
    'Peak day. Sit with the home-throne feeling weightless.',
  'Ketu aspect Jupiter in 4th house : Ends':
    'Hamsa-detachment window closes.',
  'Ketu aspect Saturn in 5th house':
    'Detachment on creative-discipline. Old performance-loops feel finished.',
  'Ketu aspect Saturn in 5th house : Starts':
    'Creative-detachment window opens.',
  'Ketu aspect Saturn in 5th house : Exact':
    'Peak day. Release the dead creative-loop.',
  'Ketu aspect Saturn in 5th house : Ends':
    'Creative-detachment window closes.',
  'Ketu aspect Rahu in 3rd house':
    'Ketu-Rahu axis stress on communication. Old viral-content loops feel finished.',
  'Ketu aspect Rahu in 3rd house : Starts':
    'Communication-axis-detachment window opens.',
  'Ketu aspect Rahu in 3rd house : Exact':
    'Peak day. Sit with the content-channel quieting.',
  'Ketu aspect Rahu in 3rd house : Ends':
    'Communication-axis-detachment window closes.',
  'Ketu aspect Ketu in 9th house':
    'Ketu return on its own placement. Peak dharma-detachment day. Old teacher-attachments dissolve completely; inner-guru surfaces.',
  'Ketu aspect Ketu in 9th house : Starts':
    'Ketu-return dharma window opens.',
  'Ketu aspect Ketu in 9th house : Exact':
    'Peak Ketu-return day. The lineage-attachment evaporates; the principle without personality crystallizes.',
  'Ketu aspect Ketu in 9th house : Ends':
    'Ketu-return dharma window closes.',
};
