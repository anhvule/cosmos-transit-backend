// db/_virgo_relationship.js
// RELATIONSHIP fills for representative Virgo ascendant native.
// Internal natal reference (do NOT echo as preamble in copy):
//   Mercury Virgo 1H (own+exalted — Bhadra Yoga) · Sun Leo 12H (own)
//   Moon Cancer 11H (own) · Venus Pisces 7H (exalted — Malavya Yoga)
//   Mars Aries 8H (own — Vipareet) · Jupiter Sagittarius 4H (own — Hamsa Yoga)
//   Saturn Capricorn 5H (own) · Rahu Scorpio 3H · Ketu Taurus 9H

module.exports = {
  // ───────────────────────────────────── RULERS (12) ─────────────────────────
  'Mercury ruler of the 1st House in the 1st House':
    'You arrive in relationship as the analyst, the editor, the discerning eye. You lead with attention to detail — what someone says, how they say it, what they leave unsaid. Lovers feel *seen* and sometimes feel audited; the line between care and criticism is the central craft. Your magnetism is precision, not flash. Best partners can hold the spotlight of your attention without flinching. The shadow: dissecting the relationship into its parts and forgetting to inhabit it whole.',
  'Venus ruler of the 2nd House in the 7th House':
    'Income, voice, and family-money all converge on the partner. Your spouse and principal romantic counterparty are *also* the financial pivot of life — the person who routes earnings, sets the price, anchors the family budget. Marriage is a mixed venture: love, deal, lineage, in one document. Industries of partner often: deal-led, hospitality, beauty, agency, broker. The shadow: financial enmeshment that the relationship cannot survive a clean separation from — keep some accounts your own.',
  'Mars ruler of the 3rd House in the 8th House':
    'Communication in love arrives sharpened by crisis. The honest fight, the late-night surgical conversation, the difficult truth told once, cleanly, is the medium that lets you connect deepest. Sibling-style alliances built through shared transformation — surviving the same storm bonds you for life. The shadow: needing crisis to feel close — schedule peace before peace requires being earned.',
  'Jupiter ruler of the 4th House in the 4th House':
    'Hamsa Yoga on the home throne. The home is the temple of the relationship. Mother-figures, the matriarchal lineage, the property itself, the family-business legacy — all nourish romance. The healthiest partnerships root in domestic ritual: the shared meal, the shared garden, the shared library of slow Sunday afternoons. The shadow: romanticizing the family-of-origin onto the partner; the partner is not the mother, even if the partner inherits her warmth.',
  'Saturn ruler of the 5th House in the 5th House':
    'Romance arrives slowly, deeply, structurally. Saturn-on-creative-throne wants love that compounds for decades — not flash, not sparkle, not novelty. Children come late and matter enormously. Creative co-projects, classical-craft mentorship of mentees together, multi-year shared discipline build the bond. The shadow: gravity that turns playfulness into duty — schedule joy as deliberately as you schedule responsibility.',
  'Saturn ruler of the 6th House in the 5th House':
    'Service and conflict feed creative-romantic bond. The hard caregiving chapter, the shared health journey, the years of structural disagreement worked through patiently — these are the materials your most enduring love is built from. The shadow: making the relationship a project of fixing each other; some difficulties are not problems to solve but textures to inhabit.',
  'Jupiter ruler of the 7th House in the 4th House':
    'Spouse arrives through the home, the family, the matriarchal channel, the educational lineage. Marriage often introduced via family connections, in a teacher-student context, or rooted in a shared school / institutional / domestic background. The partnership is a household, not a startup. The shadow: family expectations migrating onto the partner — the spouse inherits the matriarchal weight; clarify the dharma of the partnership separate from the lineage.',
  'Mars ruler of the 8th House in the 8th House':
    'Vipareet engine in love: the crises that destroy ordinary relationships are the ones your partnership grows through. Inheritance fights, succession battles, illness, secrecy revealed and metabolized — these forge unbreakable bonds. The shadow: the body addiction to high-stakes intimacy — calm love can feel like absence; let the still water be still.',
  'Venus ruler of the 9th House in the 7th House':
    'Dharma arrives through the partner. Your most-influential teacher, your cross-cultural awakening, your encounter with foreign wisdom often comes inside the marriage or via a co-founder relationship. The spouse is a guru-equivalent. The shadow: the partner is not your guru; receive the influence, but author your own scripture.',
  'Mercury ruler of the 10th House in the 1st House':
    'You are the brand the partner married. Your name, craft, public-craftsman identity is the asset. The partner stands beside the analyst-as-principal you embody — and is impacted by your career visibility. The shadow: the partner becomes a shadow accessory to the brand — keep their separate identity sacred.',
  'Moon ruler of the 11th House in the 11th House':
    'Wide-network warmth fuels the relationship. Mother-figures, female friend-circles, women-led communities pour love into your life. Romance is contextualized inside a wide ecosystem of warm bonds. The shadow: the network expectation of the relationship can crowd the relationship itself — preserve a chamber that is just the two of you.',
  'Sun ruler of the 12th House in the 12th House':
    'The relationship has a private chamber the world does not see. The deepest intimacy lives in confidential moments, retreats, foreign trips, behind-the-scenes rituals. The partnership has a monastic dignity — the world sees only the public surface. The shadow: secrecy that drifts into hiding important things from each other; the chamber is private, not opaque to the partner.',

  // ─────────────────────────────────── DISPOSITORS (7) ───────────────────────
  'Sun in 12th (Dispositor)':
    'When this engine fires, intimate-private chapters land. Best for retreat-style getaways, foreign trips with the partner, quiet rituals that re-anchor the bond.',
  'Moon in 11th (Dispositor)':
    'When this engine fires, network-warmth pours into the relationship. Best for community gatherings, friend-circle dinners, mother-figure visits.',
  'Mercury in 1st (Dispositor)':
    'When this engine fires, sharp self-articulation in love lands. Best for the long honest conversation, the careful relational note, the precision-clarification.',
  'Jupiter in 4th (Dispositor)':
    'When this engine fires, home-as-temple ritual deepens. Best for shared cooking, garden moves, family-business pulse-checks, mother-channel visits.',
  'Mars in 8th (Dispositor)':
    'When this engine fires, transformation-bond deepens. Best for the difficult honest conversation, the crisis-metabolizing weekend, the surgical truth delivered with love.',
  'Saturn in 5th (Dispositor)':
    'When this engine fires, slow-creative-romance compounds. Best for shared multi-year project review, classical-craft date, structured-future planning.',
  'Venus in 7th (Dispositor)':
    'Malavya throne. When this engine fires, partner-grace lands. Best for the marriage-renewal moment, the spouse-led celebration, the elegant anchor-deal of love.',

  // ──────────────────────────────────── TRANSITS (108) ───────────────────────
  // — Sun transits —
  'Sun Transits the 1st House':
    'Annual peak self-radiance window. The lover is most magnetic; presence is at its yearly high. Best for re-introducing yourself to the partnership.',
  'Sun Transits the 2nd House':
    'Solar light on voice and family-money. Have the warm money-talk with the partner; renegotiate the household financial structure.',
  'Sun Transits the 3rd House':
    'Solar courage on communication. Have the brave conversation, send the bold love-note, take the candid call.',
  'Sun Transits the 4th House':
    'Solar fire on Hamsa home-throne. Real-estate decisions with partner, family-business pulse, mother-channel visit, hearth ritual.',
  'Sun Transits the 5th House':
    'Solar fire on creative-romance. Best month for shared creative projects, child-related declarations, structured-romance planning.',
  'Sun Transits the 6th House':
    'Solar fire on conflict-management. Address the hard issue directly; chronic relational frictions weaken under direct light.',
  'Sun Transits the 7th House':
    'Solar fire on Malavya partnership engine. Annual peak month for the relationship public-face. Anniversary, renewal, public declaration of partnership.',
  'Sun Transits the 8th House':
    'Solar fire in Vipareet chamber. Joint-finance moves, inheritance conversations, secrecy-revealed-and-metabolized chapters.',
  'Sun Transits the 9th House':
    'Solar light on dharma and detachment from teacher. Pilgrimage with partner, foreign trip, philosophical alignment check.',
  'Sun Transits the 10th House':
    'Annual peak career-public visibility. The partner stands beside the public role; honor their work too.',
  'Sun Transits the 11th House':
    'Solar fire on emotional-network. Friend-circle gatherings with partner, mother-figure introductions, community celebrations.',
  'Sun Transits the 12th House':
    'Solar return on retreat-throne. Annual peak for private chamber rituals, retreat-style getaways, confidential intimacy chapters.',

  // — Moon transits —
  'Moon Transits the 1st House':
    'Two-day emotional-self window. Lover\'s body and presence soften; receive the warmth.',
  'Moon Transits the 2nd House':
    'Emotional charge on voice and money-talk. Speak softly about household finances.',
  'Moon Transits the 3rd House':
    'Two-day window of warm communication. Send the warm love-note; take the candid call.',
  'Moon Transits the 4th House':
    'Monthly Hamsa home-throne emotional peak. Cook for each other; sit at the hearth.',
  'Moon Transits the 5th House':
    'Emotional charge on creative-romance. Shared poetry, child-related warmth, romantic creativity.',
  'Moon Transits the 6th House':
    'Emotional charge on conflict-management. The friction may surface; respond gently, not from heat.',
  'Moon Transits the 7th House':
    'Emotional charge on Malavya partnership. Read the partner temperature; warm tone wins.',
  'Moon Transits the 8th House':
    'Emotional weight on transformation. Defer high-stakes relational decisions two days.',
  'Moon Transits the 9th House':
    'Emotional pull toward dharma-detachment. Old shared-teacher attachments may quietly dissolve.',
  'Moon Transits the 10th House':
    'Monthly career-emotion peak. The partner reads your public-pulse with empathy.',
  'Moon Transits the 11th House':
    'Moon\'s own-sign return on gain-throne. Peak monthly emotional-network warmth for the relationship.',
  'Moon Transits the 12th House':
    'Emotional inwardness; private-chamber pull. Best for retreat-night, dream-shared evening.',

  // — Mercury transits —
  'Mercury Transits the 1st House':
    'Mercury\'s Bhadra return. Peak monthly self-articulation. Have the long careful conversation about you and the relationship.',
  'Mercury Transits the 2nd House':
    'Sharp money-and-voice articulation. Renegotiate the household finances; write the family-money plan together.',
  'Mercury Transits the 3rd House':
    'Sharp short-burst communication. Send the love-letter, write the relationship-status note.',
  'Mercury Transits the 4th House':
    'Sharp Hamsa home-throne articulation. Real-estate paperwork, family-business memos, mother-channel correspondence.',
  'Mercury Transits the 5th House':
    'Sharp creative-romance articulation. Write the love-poem, draft the shared-project memo.',
  'Mercury Transits the 6th House':
    'Sharp conflict-articulation. The honest difficult conversation lands cleanly; document the agreement.',
  'Mercury Transits the 7th House':
    'Sharp partnership articulation. Term sheets of love — formalize the agreements you have been living informally.',
  'Mercury Transits the 8th House':
    'Sharp transformation articulation. Joint-finance documents, will-and-trust paperwork, secrecy clarification memos.',
  'Mercury Transits the 9th House':
    'Sharp dharma articulation. Philosophical alignment-check letters; foreign-travel planning.',
  'Mercury Transits the 10th House':
    'Sharp career-public articulation. Communicate your work clearly to the partner; brief them on the public moves.',
  'Mercury Transits the 11th House':
    'Sharp wide-network articulation. Friend-circle correspondence, mother-figure-mentor letters.',
  'Mercury Transits the 12th House':
    'Sharp behind-the-scenes articulation. Confidential love-letters, retreat-planning correspondence.',

  // — Venus transits —
  'Venus Transits the 1st House':
    'Beauty on the analyst-self. Lover\'s presence softens; the room responds to your refined warmth.',
  'Venus Transits the 2nd House':
    'Beauty on income and voice. Pricing the household together with grace; soft money-conversations.',
  'Venus Transits the 3rd House':
    'Beauty on communication. Tone the love-message; soften the hard truth.',
  'Venus Transits the 4th House':
    'Beauty on Hamsa home-throne. Aesthetic upgrades to the shared home; mother-channel warmth.',
  'Venus Transits the 5th House':
    'Beauty on creative-romance. Polished date-nights, elegant child-related celebrations, refined shared creativity.',
  'Venus Transits the 6th House':
    'Beauty on conflict. Mediated resolution, charm-led clearing of old frictions.',
  'Venus Transits the 7th House':
    'Venus on its Malavya throne. Peak partnership-month. Anniversary moments, renewal moments, the deal of love consolidates.',
  'Venus Transits the 8th House':
    'Beauty in transformation. Joint-finance grace, succession diplomacy, secrecy resolved with elegance.',
  'Venus Transits the 9th House':
    'Beauty on dharma. Philosophical date, foreign-travel romance, cross-cultural depth.',
  'Venus Transits the 10th House':
    'Public-aesthetic visibility. Partner stands beside elegant public moves; brand-and-marriage merge with grace.',
  'Venus Transits the 11th House':
    'Beauty on the wide-network. Friend-circle gatherings with partner; mother-figure dinners.',
  'Venus Transits the 12th House':
    'Beauty on retreat-throne. Confidential intimate weekend, foreign-luxury back channel.',

  // — Mars transits —
  'Mars Transits the 1st House':
    'Mars on body-mind. The lover is sharp and direct. Watch impulsive reactivity; channel into bold-but-clean love-action.',
  'Mars Transits the 2nd House':
    'Mars on income and voice. Aggressive money-conversations; argue from documentation, not heat.',
  'Mars Transits the 3rd House':
    'Mars on communication. Bold honest conversations; contested love-messages. Push the truth now.',
  'Mars Transits the 4th House':
    'Mars on Hamsa home-throne. Property disputes, family friction. Don\'t fight family in heat.',
  'Mars Transits the 5th House':
    'Mars on creative-romance. Bold shared bets, contested child-related decisions, fierce-mentor love.',
  'Mars Transits the 6th House':
    'Mars on conflict — strong terrain. The chronic friction is winnable. Address directly.',
  'Mars Transits the 7th House':
    'Mars on Malavya partnership. Bold deal-making, contested JV, force-clarified spouse conversations.',
  'Mars Transits the 8th House':
    'Mars on Vipareet throne. Peak transformation-fire month for the bond. Surgical truths land; old crises metabolize.',
  'Mars Transits the 9th House':
    'Mars on dharma-detachment. Bold philosophical declarations, foreign-travel pushes, judicial-style truth-telling.',
  'Mars Transits the 10th House':
    'Mars on career-throne. Bold public moves; partner watches the storming. Watch heat with the boss.',
  'Mars Transits the 11th House':
    'Mars on gain-network. Contested friend-circle dynamics; bold mother-figure-network engagement.',
  'Mars Transits the 12th House':
    'Mars in confidential combat. Behind-the-scenes friction; foreign-mandate heat. Watch hidden conflicts.',

  // — Jupiter transits —
  'Jupiter Transits the 1st House':
    'Major year for self-expansion. Lover is luminous; expansion of the self lifts the partnership.',
  'Jupiter Transits the 2nd House':
    'Major year for household-money expansion. Voice-projects pay; family-money inflows.',
  'Jupiter Transits the 3rd House':
    'Major year for communication-expansion. Publishing love-letters, sibling-channel growth, broadcast moments.',
  'Jupiter Transits the 4th House':
    'Jupiter on Hamsa throne. Peak home-throne expansion year. Real-estate acquisition with partner; family-business growth.',
  'Jupiter Transits the 5th House':
    'Major year for creative-romance expansion. Children, course-platforms, shared creativity breakthroughs.',
  'Jupiter Transits the 6th House':
    'Major year for conflict-victory. Long frictions resolve; chronic adversaries fade.',
  'Jupiter Transits the 7th House':
    'Major year for Malavya partnership expansion. Marriage if unmarried; renewal if married; principal-client commitment.',
  'Jupiter Transits the 8th House':
    'Major year for Vipareet transformation gains. Inheritance, severance, joint-equity windfalls. Crises convert to platform.',
  'Jupiter Transits the 9th House':
    'Major year for dharma-expansion (despite Ketu in 9th — Jupiter sanctifies). Foreign travel, teaching-platform breakthroughs, philosophical chapters.',
  'Jupiter Transits the 10th House':
    'Major year for public-career expansion. Partner stands beside the prestige-role.',
  'Jupiter Transits the 11th House':
    'Major year for emotional-network gain. Friend-circle elevation, mother-figure-mentor inflection.',
  'Jupiter Transits the 12th House':
    'Major year for behind-the-scenes expansion. Foreign work, retreat chapters, confidential mandates.',

  // — Saturn transits —
  'Saturn Transits the 1st House':
    'Multi-year structural pressure on body and identity. Vanity falls away; what survives is permanent in the relationship.',
  'Saturn Transits the 2nd House':
    'Multi-year discipline on household finance. Structure savings rituals together.',
  'Saturn Transits the 3rd House':
    'Multi-year discipline on communication. Long-arc conversation systems formalize.',
  'Saturn Transits the 4th House':
    'Multi-year discipline on Hamsa home-throne. Real-estate restructuring, family-reckoning, mother\'s health-and-care.',
  'Saturn Transits the 5th House':
    'Saturn on creative-throne in 5H. Peak structural-creative-romance chapter. The 10-year partnership project matures; children reach milestone phases.',
  'Saturn Transits the 6th House':
    'Saturn\'s strong terrain. Multi-year peak conflict-management. Chronic frictions resolve through patience-and-paperwork.',
  'Saturn Transits the 7th House':
    'Multi-year structural test of Malavya partnership. Spouse-and-client commitments scrutinized; weak relationships end; strong ones formalize.',
  'Saturn Transits the 8th House':
    'Multi-year reckoning in Vipareet chamber. Inheritance disputes, joint-finance delays. Patience pays.',
  'Saturn Transits the 9th House':
    'Multi-year dharma-discipline. Long shared philosophical paths, slow teacher-detachment.',
  'Saturn Transits the 10th House':
    'Multi-year structural-career chapter. Partner endures the slow climb beside you.',
  'Saturn Transits the 11th House':
    'Multi-year discipline on emotional-network. Friend-circles formalize; women-led-network deepens.',
  'Saturn Transits the 12th House':
    'Multi-year discipline on behind-the-scenes. Long retreat-chapter, foreign-confidential mandates with partner.',

  // — Rahu transits —
  'Rahu Transits the 1st House':
    'Eighteen-month obsessive identity-reinvention. New persona may stress the partnership; verify each move.',
  'Rahu Transits the 2nd House':
    'Eighteen-month obsession on income and voice. Sudden family-money chaos; verify get-rich schemes.',
  'Rahu Transits the 3rd House':
    'Rahu on its strong terrain. Eighteen-month obsessive communication chapter. Viral content, controversial messaging stress the relationship.',
  'Rahu Transits the 4th House':
    'Eighteen-month home-throne obsession. Foreign-property pull, family reinvention. Verify titles.',
  'Rahu Transits the 5th House':
    'Eighteen-month obsessive creative chapter. Speculation, viral-romance fevers.',
  'Rahu Transits the 6th House':
    'Favorable. Eighteen-month obsessive conflict-resolution chapter. Long frictions fall.',
  'Rahu Transits the 7th House':
    'Eighteen-month obsessive partnership chapter. Foreign spouse-pull, controversial JV, sudden anchor-counterparty. Verify integrity.',
  'Rahu Transits the 8th House':
    'Eighteen-month obsessive Vipareet chapter. Inheritance chaos, joint-finance windfalls, secret-revealed.',
  'Rahu Transits the 9th House':
    'Eighteen-month foreign-dharma obsession on Ketu zone. International guru-pull, controversial teachings.',
  'Rahu Transits the 10th House':
    'Eighteen-month career-reinvention obsession. Partner adapts to sudden public moves.',
  'Rahu Transits the 11th House':
    'Eighteen-month obsessive wide-network chapter. Sudden viral-network pull stresses the bond.',
  'Rahu Transits the 12th House':
    'Eighteen-month foreign-confidential obsession. Hidden mandates, foreign-occult chapters.',

  // — Ketu transits —
  'Ketu Transits the 1st House':
    'Eighteen-month identity-stripping. Old persona feels empty; partner watches you dissolve a layer.',
  'Ketu Transits the 2nd House':
    'Eighteen-month detachment from income, voice, family-money. Old earning paths feel hollow.',
  'Ketu Transits the 3rd House':
    'Eighteen-month communication-detachment. Old conversation-loops feel finished.',
  'Ketu Transits the 4th House':
    'Eighteen-month home-throne detachment. Old real-estate plans feel weightless.',
  'Ketu Transits the 5th House':
    'Eighteen-month creative-detachment. Old shared-creative loops feel finished.',
  'Ketu Transits the 6th House':
    'Eighteen-month conflict-detachment. Long frictions fade without intervention.',
  'Ketu Transits the 7th House':
    'Eighteen-month partnership-detachment. Old deal feels finished; the bond loosens or transforms.',
  'Ketu Transits the 8th House':
    'Eighteen-month transformation-acceleration. Old crises evaporate; deep occult release.',
  'Ketu Transits the 9th House':
    'Ketu on its own placement. Peak dharma-detachment chapter. Old shared-teacher attachments dissolve completely.',
  'Ketu Transits the 10th House':
    'Eighteen-month career-eclipse. Old role feels weightless; partner watches the costume fall off.',
  'Ketu Transits the 11th House':
    'Eighteen-month wide-network detachment. Old friend-circles drift.',
  'Ketu Transits the 12th House':
    'Eighteen-month behind-the-scenes detachment. Old retreats, confidential mandates close.',

  // ──────────────────────────────── ANGLE ASPECTS (72) ──────────────────────
  'Sun Aspecting Ascendant (ASC)':
    'Lover\'s body and presence radiate. Best for re-introduction, public couple-declaration.',
  'Sun Aspecting Ascendant (ASC) : Starts':
    'Visibility window opens; prepare to be felt as the principal.',
  'Sun Aspecting Ascendant (ASC) : Exact':
    'Peak visibility day. Take the public-couple stage; declare the principal-self.',
  'Sun Aspecting Ascendant (ASC) : Ends':
    'Visibility window closes. Convert into binding commitment.',
  'Sun Aspecting Midheaven (MC)':
    'Peak public-relationship visibility. Partner stands beside the spotlight.',
  'Sun Aspecting Midheaven (MC) : Starts':
    'Public window opens. Brief the partner.',
  'Sun Aspecting Midheaven (MC) : Exact':
    'Peak public-couple day. Take the public moment together.',
  'Sun Aspecting Midheaven (MC) : Ends':
    'Public window closes. Convert moves into formalized commitments.',
  'Moon Aspecting Ascendant (ASC)':
    'Emotional charge on persona; partnership reads you warmly.',
  'Moon Aspecting Ascendant (ASC) : Starts':
    'Emotional-self window opens.',
  'Moon Aspecting Ascendant (ASC) : Exact':
    'Peak emotional-self day. Receive the warmth.',
  'Moon Aspecting Ascendant (ASC) : Ends':
    'Emotional-self window closes.',
  'Moon Aspecting Midheaven (MC)':
    'Emotional charge on public reputation; partner-warmth around career news.',
  'Moon Aspecting Midheaven (MC) : Starts':
    'Emotional career window opens.',
  'Moon Aspecting Midheaven (MC) : Exact':
    'Peak emotional-career day. Take the warm-toned senior call with partner support.',
  'Moon Aspecting Midheaven (MC) : Ends':
    'Emotional career window closes.',
  'Mercury Aspecting Ascendant (ASC)':
    'Mercury\'s Bhadra throne. Peak self-articulation in love. Have the careful conversation.',
  'Mercury Aspecting Ascendant (ASC) : Starts':
    'Bhadra-self window opens.',
  'Mercury Aspecting Ascendant (ASC) : Exact':
    'Peak Bhadra day. Send the carefully-articulated relational note.',
  'Mercury Aspecting Ascendant (ASC) : Ends':
    'Bhadra-self window closes.',
  'Mercury Aspecting Midheaven (MC)':
    'Sharp career-communication. Brief the partner on the public messaging.',
  'Mercury Aspecting Midheaven (MC) : Starts':
    'Career-communication window opens.',
  'Mercury Aspecting Midheaven (MC) : Exact':
    'Peak day. Publish the public moves; brief partner first.',
  'Mercury Aspecting Midheaven (MC) : Ends':
    'Career-communication window closes.',
  'Venus Aspecting Ascendant (ASC)':
    'Beauty on the analyst-self. The room — and the partner — responds to your refined warmth.',
  'Venus Aspecting Ascendant (ASC) : Starts':
    'Venus-self window opens.',
  'Venus Aspecting Ascendant (ASC) : Exact':
    'Peak charm day. The warm ask works. Make the loving offer.',
  'Venus Aspecting Ascendant (ASC) : Ends':
    'Venus-self window closes.',
  'Venus Aspecting Midheaven (MC)':
    'Softens the public face. Partner-aesthetic moves; couple-brand campaign.',
  'Venus Aspecting Midheaven (MC) : Starts':
    'Aesthetic-public window opens.',
  'Venus Aspecting Midheaven (MC) : Exact':
    'Peak day. Launch the couple-brand presence.',
  'Venus Aspecting Midheaven (MC) : Ends':
    'Aesthetic-public window closes.',
  'Mars Aspecting Ascendant (ASC)':
    'Bold body-anchored self-action; warrior moves in love.',
  'Mars Aspecting Ascendant (ASC) : Starts':
    'Action-self window opens.',
  'Mars Aspecting Ascendant (ASC) : Exact':
    'Peak action-self day. Take the bold romantic move.',
  'Mars Aspecting Ascendant (ASC) : Ends':
    'Action-self window closes.',
  'Mars Aspecting Midheaven (MC)':
    'Bold career action; partner watches the pitch-storm.',
  'Mars Aspecting Midheaven (MC) : Starts':
    'Career-action window opens.',
  'Mars Aspecting Midheaven (MC) : Exact':
    'Peak career-action day. Lead the storming with partner-witness.',
  'Mars Aspecting Midheaven (MC) : Ends':
    'Career-action window closes.',
  'Jupiter Aspecting Ascendant (ASC)':
    'Wisdom-expansion of persona. Lover deepens; the relational role elevates.',
  'Jupiter Aspecting Ascendant (ASC) : Starts':
    'Self-expansion window opens.',
  'Jupiter Aspecting Ascendant (ASC) : Exact':
    'Peak self-expansion day. Take the elevated relational role.',
  'Jupiter Aspecting Ascendant (ASC) : Ends':
    'Self-expansion window closes.',
  'Jupiter Aspecting Midheaven (MC)':
    'Peak career-expansion; partner stands beside the prestige.',
  'Jupiter Aspecting Midheaven (MC) : Starts':
    'Career-expansion window opens.',
  'Jupiter Aspecting Midheaven (MC) : Exact':
    'Peak career-expansion day. Accept the chief role with partner present.',
  'Jupiter Aspecting Midheaven (MC) : Ends':
    'Career-expansion window closes.',
  'Saturn Aspecting Ascendant (ASC)':
    'Heavy structural pressure on body and identity. Partner-witness to the slow simplification.',
  'Saturn Aspecting Ascendant (ASC) : Starts':
    'Structural-self window opens.',
  'Saturn Aspecting Ascendant (ASC) : Exact':
    'Peak structural-self day. The reckoning is acute.',
  'Saturn Aspecting Ascendant (ASC) : Ends':
    'Structural-self window closes.',
  'Saturn Aspecting Midheaven (MC)':
    'Heavy structural pressure on career-public face; partner endures the slow climb.',
  'Saturn Aspecting Midheaven (MC) : Starts':
    'Career-discipline window opens.',
  'Saturn Aspecting Midheaven (MC) : Exact':
    'Peak career-discipline day; partner-resilience tested.',
  'Saturn Aspecting Midheaven (MC) : Ends':
    'Career-discipline window closes.',
  'Rahu Aspecting Ascendant (ASC)':
    'Chaotic identity expansion; foreign self emerges. Partner adapts.',
  'Rahu Aspecting Ascendant (ASC) : Starts':
    'Reinvention window opens.',
  'Rahu Aspecting Ascendant (ASC) : Exact':
    'Peak reinvention day; brief the partner before the big move.',
  'Rahu Aspecting Ascendant (ASC) : Ends':
    'Reinvention window closes.',
  'Rahu Aspecting Midheaven (MC)':
    'Chaotic visibility expansion. Sudden public moves stress the bond.',
  'Rahu Aspecting Midheaven (MC) : Starts':
    'Career-reinvention window begins.',
  'Rahu Aspecting Midheaven (MC) : Exact':
    'Peak day. Take the bold pivot — partner deserves the heads-up first.',
  'Rahu Aspecting Midheaven (MC) : Ends':
    'Career-reinvention window closes.',
  'Ketu Aspecting Ascendant (ASC)':
    'Identity-stripping; the old persona feels empty. Partner watches.',
  'Ketu Aspecting Ascendant (ASC) : Starts':
    'Stripping window opens.',
  'Ketu Aspecting Ascendant (ASC) : Exact':
    'Peak stripping day. Sit with the dissolution.',
  'Ketu Aspecting Ascendant (ASC) : Ends':
    'Stripping window closes.',
  'Ketu Aspecting Midheaven (MC)':
    'Visibility eclipse; recognition feels hollow. Partner sees through the costume.',
  'Ketu Aspecting Midheaven (MC) : Starts':
    'Career-eclipse window opens.',
  'Ketu Aspecting Midheaven (MC) : Exact':
    'Peak career-eclipse day. The role dissolves quietly.',
  'Ketu Aspecting Midheaven (MC) : Ends':
    'Career-eclipse window closes.',

  // ─────────────────────────────── OUTER SPECIALS (8) ───────────────────────
  'Pluto conjunct Saturn':
    'Generational structural reckoning hitting the disciplined-creative-romance engine. Long-term shared projects restructure; the multi-year partnership-thesis breaks and rebuilds.',
  'Pluto conjunct Saturn : Starts':
    'Multi-year structural reckoning begins on long-creative-romance.',
  'Pluto conjunct Saturn : Exact':
    'Peak structural-transformation day. Old shared frameworks dissolve.',
  'Pluto conjunct Saturn : Ends':
    'Transformation chapter completes; rebuilt creative-romance authority.',
  'Uranus conjunct Venus':
    'Sudden disruption hitting Malavya partnership. Unexpected partner pivots, abrupt JV reinventions, surprise spouse-and-client shifts.',
  'Uranus conjunct Venus : Starts':
    'Sudden partnership disruption window opens.',
  'Uranus conjunct Venus : Exact':
    'Peak partnership disruption day. The relational pivot is forced.',
  'Uranus conjunct Venus : Ends':
    'Partnership disruption window closes.',

  // ─────────────────────────────────── ASPECTS (324) ─────────────────────────
  // — Sun aspects natal —
  'Sun aspect Sun in 12th house':
    'Solar light on the retreat-throne. Best for confidential-intimacy chapters, foreign-trip-with-partner, monastic-style getaways.',
  'Sun aspect Sun in 12th house : Starts':
    'Retreat-throne window opens.',
  'Sun aspect Sun in 12th house : Exact':
    'Peak day. Take the confidential weekend, the foreign trip, the private ritual together.',
  'Sun aspect Sun in 12th house : Ends':
    'Retreat-throne window closes.',
  'Sun aspect Moon in 11th house':
    'Solar fire on emotional-network. Friend-circle visibility for the couple; mother-figure introductions land warmly.',
  'Sun aspect Moon in 11th house : Starts':
    'Network window opens.',
  'Sun aspect Moon in 11th house : Exact':
    'Peak day. Host the friend-circle dinner; introduce partner to mother-figure mentor.',
  'Sun aspect Moon in 11th house : Ends':
    'Network window closes.',
  'Sun aspect Mercury in 1st house':
    'Solar fire on Bhadra craftsman-throne. Founder-as-self visibility radiates; partner sees you at your sharpest.',
  'Sun aspect Mercury in 1st house : Starts':
    'Bhadra-fire window opens.',
  'Sun aspect Mercury in 1st house : Exact':
    'Peak Bhadra-solar day. Declare the craftsman role with partner-witness.',
  'Sun aspect Mercury in 1st house : Ends':
    'Bhadra-fire window closes.',
  'Sun aspect Venus in 7th house':
    'Solar fire on Malavya partnership engine. Anchor-deal visibility; spouse moves into spotlight; principal partnership crystallizes.',
  'Sun aspect Venus in 7th house : Starts':
    'Malavya-fire window opens.',
  'Sun aspect Venus in 7th house : Exact':
    'Peak Malavya day. Take the anniversary moment, the renewal ritual, the public partnership declaration.',
  'Sun aspect Venus in 7th house : Ends':
    'Malavya-fire window closes.',
  'Sun aspect Mars in 8th house':
    'Solar fire on Vipareet engine. Joint-finance visibility, surgical truth-telling, secrecy-revealed-and-metabolized chapters.',
  'Sun aspect Mars in 8th house : Starts':
    'Vipareet-fire window opens.',
  'Sun aspect Mars in 8th house : Exact':
    'Peak day. Have the surgical conversation; let the buried truth surface.',
  'Sun aspect Mars in 8th house : Ends':
    'Vipareet-fire window closes.',
  'Sun aspect Jupiter in 4th house':
    'Solar fire on Hamsa home-throne. Real-estate moves with partner, family-business pulse, mother-channel visit visibility.',
  'Sun aspect Jupiter in 4th house : Starts':
    'Hamsa-fire window opens.',
  'Sun aspect Jupiter in 4th house : Exact':
    'Peak Hamsa-solar day. Acquire the property together, host the family business meeting.',
  'Sun aspect Jupiter in 4th house : Ends':
    'Hamsa-fire window closes.',
  'Sun aspect Saturn in 5th house':
    'Solar fire on creative-romance discipline. Children-related moves, multi-year shared projects review.',
  'Sun aspect Saturn in 5th house : Starts':
    'Creative-discipline-fire window opens.',
  'Sun aspect Saturn in 5th house : Exact':
    'Peak day. Take the milestone child-related decision, formalize the long shared project.',
  'Sun aspect Saturn in 5th house : Ends':
    'Creative-discipline-fire window closes.',
  'Sun aspect Rahu in 3rd house':
    'Solar fire on communication-chaos. Viral-content visibility stresses the relationship — verify before publishing.',
  'Sun aspect Rahu in 3rd house : Starts':
    'Communication-chaos-fire window opens.',
  'Sun aspect Rahu in 3rd house : Exact':
    'Peak day. Brief the partner before the controversial post.',
  'Sun aspect Rahu in 3rd house : Ends':
    'Communication-chaos-fire window closes.',
  'Sun aspect Ketu in 9th house':
    'Solar light on dharma-detachment. Old shared-teacher attachments dissolve in public; principle remains.',
  'Sun aspect Ketu in 9th house : Starts':
    'Dharma-detachment-fire window opens.',
  'Sun aspect Ketu in 9th house : Exact':
    'Peak day. Release the shared guru-attachment together; the inner teacher is enough.',
  'Sun aspect Ketu in 9th house : Ends':
    'Dharma-detachment-fire window closes.',

  // — Moon aspects natal —
  'Moon aspect Sun in 12th house':
    'Emotional charge on retreat-throne. Quiet authority and inwardness rise; pause before public couple-moves.',
  'Moon aspect Sun in 12th house : Starts':
    'Retreat-emotion window opens.',
  'Moon aspect Sun in 12th house : Exact':
    'Peak day. Take the confidential evening; cook a private dinner together.',
  'Moon aspect Sun in 12th house : Ends':
    'Retreat-emotion window closes.',
  'Moon aspect Moon in 11th house':
    'Moon\'s own-sign return on gain-throne. Peak emotional-network warmth for the relationship.',
  'Moon aspect Moon in 11th house : Starts':
    'Gain-emotion window opens.',
  'Moon aspect Moon in 11th house : Exact':
    'Peak day. Host the friend-circle dinner; introduce partner to mother-figure mentor.',
  'Moon aspect Moon in 11th house : Ends':
    'Gain-emotion window closes.',
  'Moon aspect Mercury in 1st house':
    'Emotional warmth on Bhadra throne. The careful conversation lands warmly today.',
  'Moon aspect Mercury in 1st house : Starts':
    'Bhadra-emotion window opens.',
  'Moon aspect Mercury in 1st house : Exact':
    'Peak day. Have the long careful relational conversation.',
  'Moon aspect Mercury in 1st house : Ends':
    'Bhadra-emotion window closes.',
  'Moon aspect Venus in 7th house':
    'Emotional charge on Malavya partnership. Spouse temperature is warm; lead with empathy.',
  'Moon aspect Venus in 7th house : Starts':
    'Malavya-emotion window opens.',
  'Moon aspect Venus in 7th house : Exact':
    'Peak day. Take the warm partner-meeting; soften the negotiation.',
  'Moon aspect Venus in 7th house : Ends':
    'Malavya-emotion window closes.',
  'Moon aspect Mars in 8th house':
    'Emotional weight on Vipareet zone. Old transformation-fears surface in the bond; defer hard moves two days.',
  'Moon aspect Mars in 8th house : Starts':
    'Vipareet-emotion window opens.',
  'Moon aspect Mars in 8th house : Exact':
    'Peak day. Sit with the relational transformation-anxiety; do not act in heat.',
  'Moon aspect Mars in 8th house : Ends':
    'Vipareet-emotion window closes.',
  'Moon aspect Jupiter in 4th house':
    'Emotional warmth on Hamsa home-throne. Mother-channel calls, family pulse, hearth ritual.',
  'Moon aspect Jupiter in 4th house : Starts':
    'Hamsa-emotion window opens.',
  'Moon aspect Jupiter in 4th house : Exact':
    'Peak day. Cook a real meal together; visit family.',
  'Moon aspect Jupiter in 4th house : Ends':
    'Hamsa-emotion window closes.',
  'Moon aspect Saturn in 5th house':
    'Emotional weight on creative-romance discipline. The long shared project feels heavy; honor the long arc.',
  'Moon aspect Saturn in 5th house : Starts':
    'Creative-discipline-emotion window opens.',
  'Moon aspect Saturn in 5th house : Exact':
    'Peak day. Honor the slow shared craft; the heaviness is the foundation.',
  'Moon aspect Saturn in 5th house : Ends':
    'Creative-discipline-emotion window closes.',
  'Moon aspect Rahu in 3rd house':
    'Emotional swing on communication-chaos. Viral-content cravings rise; verify before publishing in heat.',
  'Moon aspect Rahu in 3rd house : Starts':
    'Communication-chaos-emotion window opens.',
  'Moon aspect Rahu in 3rd house : Exact':
    'Peak day. Defer the bold relational message two days; the emotion is too loud.',
  'Moon aspect Rahu in 3rd house : Ends':
    'Communication-chaos-emotion window closes.',
  'Moon aspect Ketu in 9th house':
    'Emotional detachment from teacher. Old shared-guru loyalty feels weightless.',
  'Moon aspect Ketu in 9th house : Starts':
    'Dharma-detachment-emotion window opens.',
  'Moon aspect Ketu in 9th house : Exact':
    'Peak day. Sit with the teacher-attachment dissolving together; do not panic-replace.',
  'Moon aspect Ketu in 9th house : Ends':
    'Dharma-detachment-emotion window closes.',

  // — Mercury aspects natal —
  'Mercury aspect Sun in 12th house':
    'Sharp articulation of the retreat-throne. Confidential love-letters, foreign-trip planning, archival ritual writing.',
  'Mercury aspect Sun in 12th house : Starts':
    'Retreat-articulation window opens.',
  'Mercury aspect Sun in 12th house : Exact':
    'Peak day. Send the confidential love-note; plan the retreat-style getaway.',
  'Mercury aspect Sun in 12th house : Ends':
    'Retreat-articulation window closes.',
  'Mercury aspect Moon in 11th house':
    'Sharp articulation on emotional-network. Friend-circle correspondence, mother-figure-mentor letters with partner.',
  'Mercury aspect Moon in 11th house : Starts':
    'Network-articulation window opens.',
  'Mercury aspect Moon in 11th house : Exact':
    'Peak day. Send the warm community-letter together.',
  'Mercury aspect Moon in 11th house : Ends':
    'Network-articulation window closes.',
  'Mercury aspect Mercury in 1st house':
    'Mercury\'s Bhadra return. Peak self-articulation day in love. The mind is at its sharpest annual setting for relational clarity.',
  'Mercury aspect Mercury in 1st house : Starts':
    'Bhadra peak window opens.',
  'Mercury aspect Mercury in 1st house : Exact':
    'Peak Bhadra day. Have the year\'s most precise relational conversation.',
  'Mercury aspect Mercury in 1st house : Ends':
    'Bhadra peak window closes.',
  'Mercury aspect Venus in 7th house':
    'Sharp Malavya partnership articulation. Term sheets of love; formalize agreements lived informally.',
  'Mercury aspect Venus in 7th house : Starts':
    'Partnership-articulation window opens.',
  'Mercury aspect Venus in 7th house : Exact':
    'Peak day. Send the relational term-sheet, sign the formal partnership note.',
  'Mercury aspect Venus in 7th house : Ends':
    'Partnership-articulation window closes.',
  'Mercury aspect Mars in 8th house':
    'Sharp Vipareet articulation. Joint-finance documents, will-and-trust paperwork, secrecy-clarification memos.',
  'Mercury aspect Mars in 8th house : Starts':
    'Vipareet-articulation window opens.',
  'Mercury aspect Mars in 8th house : Exact':
    'Peak day. Document the hard truth precisely; the writing is the protection.',
  'Mercury aspect Mars in 8th house : Ends':
    'Vipareet-articulation window closes.',
  'Mercury aspect Jupiter in 4th house':
    'Sharp Hamsa home-throne articulation. Real-estate paperwork, family-business memos, mother-channel correspondence.',
  'Mercury aspect Jupiter in 4th house : Starts':
    'Hamsa-articulation window opens.',
  'Mercury aspect Jupiter in 4th house : Exact':
    'Peak day. File the property paper together; send the family memo.',
  'Mercury aspect Jupiter in 4th house : Ends':
    'Hamsa-articulation window closes.',
  'Mercury aspect Saturn in 5th house':
    'Sharp creative-discipline articulation. Multi-year shared-project memos, course-module planning together.',
  'Mercury aspect Saturn in 5th house : Starts':
    'Creative-discipline-articulation window opens.',
  'Mercury aspect Saturn in 5th house : Exact':
    'Peak day. Ship the shared-project chapter, draft the long-arc romance plan.',
  'Mercury aspect Saturn in 5th house : Ends':
    'Creative-discipline-articulation window closes.',
  'Mercury aspect Rahu in 3rd house':
    'Sharp communication-chaos articulation. Viral-content drafts, controversial messaging — verify integrity.',
  'Mercury aspect Rahu in 3rd house : Starts':
    'Communication-chaos-articulation window opens.',
  'Mercury aspect Rahu in 3rd house : Exact':
    'Peak day. Brief the partner before the bold message.',
  'Mercury aspect Rahu in 3rd house : Ends':
    'Communication-chaos-articulation window closes.',
  'Mercury aspect Ketu in 9th house':
    'Sharp dharma-detachment articulation. Audit shared teacher-attachments; write the closure note.',
  'Mercury aspect Ketu in 9th house : Starts':
    'Dharma-detachment-articulation window opens.',
  'Mercury aspect Ketu in 9th house : Exact':
    'Peak day. Write the formal closure to the old shared teacher-channel.',
  'Mercury aspect Ketu in 9th house : Ends':
    'Dharma-detachment-articulation window closes.',

  // — Venus aspects natal —
  'Venus aspect Sun in 12th house':
    'Beauty on the retreat-throne. Confidential intimate weekend, foreign-luxury back channel.',
  'Venus aspect Sun in 12th house : Starts':
    'Retreat-beauty window opens.',
  'Venus aspect Sun in 12th house : Exact':
    'Peak day. Host the elegant private dinner; design the retreat-style space.',
  'Venus aspect Sun in 12th house : Ends':
    'Retreat-beauty window closes.',
  'Venus aspect Moon in 11th house':
    'Beauty on emotional-network. Friend-circle gatherings with partner, mother-figure dinners.',
  'Venus aspect Moon in 11th house : Starts':
    'Network-beauty window opens.',
  'Venus aspect Moon in 11th house : Exact':
    'Peak day. Host the warm friend-circle dinner; visit mother-figure mentor with partner.',
  'Venus aspect Moon in 11th house : Ends':
    'Network-beauty window closes.',
  'Venus aspect Mercury in 1st house':
    'Beauty on Bhadra craftsman-throne. Refine the relational aesthetic, the love-language, the warm-but-precise communication.',
  'Venus aspect Mercury in 1st house : Starts':
    'Bhadra-beauty window opens.',
  'Venus aspect Mercury in 1st house : Exact':
    'Peak day. Polish the relational conversation, refine the love-language together.',
  'Venus aspect Mercury in 1st house : Ends':
    'Bhadra-beauty window closes.',
  'Venus aspect Venus in 7th house':
    'Venus on its Malavya throne. Peak partnership-grace day. The deal of love consolidates warmly.',
  'Venus aspect Venus in 7th house : Starts':
    'Malavya peak window opens.',
  'Venus aspect Venus in 7th house : Exact':
    'Peak Malavya day. Take the anniversary, host the spouse-led celebration, accept the elegant partnership move.',
  'Venus aspect Venus in 7th house : Ends':
    'Malavya peak window closes.',
  'Venus aspect Mars in 8th house':
    'Beauty in Vipareet chamber. Difficult-truth softened, joint-finance grace, succession-with-elegance.',
  'Venus aspect Mars in 8th house : Starts':
    'Vipareet-beauty window opens.',
  'Venus aspect Mars in 8th house : Exact':
    'Peak day. Soften the surgical conversation; deliver the hard truth with grace.',
  'Venus aspect Mars in 8th house : Ends':
    'Vipareet-beauty window closes.',
  'Venus aspect Jupiter in 4th house':
    'Beauty on Hamsa home-throne. Property diplomacy, family-warmth, mother-channel grace.',
  'Venus aspect Jupiter in 4th house : Starts':
    'Hamsa-beauty window opens.',
  'Venus aspect Jupiter in 4th house : Exact':
    'Peak day. Soften the property negotiation, host the elegant family meeting together.',
  'Venus aspect Jupiter in 4th house : Ends':
    'Hamsa-beauty window closes.',
  'Venus aspect Saturn in 5th house':
    'Beauty on creative-romance discipline. Polished date-nights, elegant child-related celebrations, refined shared creativity.',
  'Venus aspect Saturn in 5th house : Starts':
    'Creative-discipline-beauty window opens.',
  'Venus aspect Saturn in 5th house : Exact':
    'Peak day. Host the elegant shared-project review; polish the long-arc romance plan.',
  'Venus aspect Saturn in 5th house : Ends':
    'Creative-discipline-beauty window closes.',
  'Venus aspect Rahu in 3rd house':
    'Beauty on communication-chaos zone. Polished viral content, elegant controversial messaging — verify under the gloss.',
  'Venus aspect Rahu in 3rd house : Starts':
    'Communication-chaos-beauty window opens.',
  'Venus aspect Rahu in 3rd house : Exact':
    'Peak day. Polish the bold relational message; verify ethical bedrock.',
  'Venus aspect Rahu in 3rd house : Ends':
    'Communication-chaos-beauty window closes.',
  'Venus aspect Ketu in 9th house':
    'Beauty on dharma-detachment. Old teacher-aesthetic feels weightless; the principle remains beautiful.',
  'Venus aspect Ketu in 9th house : Starts':
    'Dharma-detachment-beauty window opens.',
  'Venus aspect Ketu in 9th house : Exact':
    'Peak day. Release the old shared teacher-aesthetic that has been hollow.',
  'Venus aspect Ketu in 9th house : Ends':
    'Dharma-detachment-beauty window closes.',

  // — Mars aspects natal —
  'Mars aspect Sun in 12th house':
    'Mars on retreat-throne. Behind-the-scenes friction, foreign-trip aggression, off-balance-sheet conflict.',
  'Mars aspect Sun in 12th house : Starts':
    'Retreat-fire window opens.',
  'Mars aspect Sun in 12th house : Exact':
    'Peak day. Address the hidden conflict directly but privately.',
  'Mars aspect Sun in 12th house : Ends':
    'Retreat-fire window closes.',
  'Mars aspect Moon in 11th house':
    'Mars on gain-network. Bold friend-circle dynamics, contested mother-figure interactions.',
  'Mars aspect Moon in 11th house : Starts':
    'Gain-fire window opens.',
  'Mars aspect Moon in 11th house : Exact':
    'Peak day. Address the friend-circle conflict directly; stand together with partner.',
  'Mars aspect Moon in 11th house : Ends':
    'Gain-fire window closes.',
  'Mars aspect Mercury in 1st house':
    'Mars on Bhadra craftsman-throne. Bold self-declaration in the relationship; sharp self-articulation.',
  'Mars aspect Mercury in 1st house : Starts':
    'Bhadra-fire window opens.',
  'Mars aspect Mercury in 1st house : Exact':
    'Peak day. Have the bold self-clarification with partner.',
  'Mars aspect Mercury in 1st house : Ends':
    'Bhadra-fire window closes.',
  'Mars aspect Venus in 7th house':
    'Mars on Malavya partnership. Bold deal-making, contested JV moves, force-clarified spouse conversations.',
  'Mars aspect Venus in 7th house : Starts':
    'Malavya-fire window opens.',
  'Mars aspect Venus in 7th house : Exact':
    'Peak day. Force the partnership clarity; sign the JV; divorce the dead deal.',
  'Mars aspect Venus in 7th house : Ends':
    'Malavya-fire window closes.',
  'Mars aspect Mars in 8th house':
    'Mars on its own Vipareet throne. Peak transformation-fire day for the bond. Surgical truths land; old crises metabolize.',
  'Mars aspect Mars in 8th house : Starts':
    'Vipareet peak window opens.',
  'Mars aspect Mars in 8th house : Exact':
    'Peak Vipareet day. Have the difficult conversation that has been postponed for years.',
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
    'Mars on creative-romance discipline. Bold shared-creative bets, contested child-related decisions.',
  'Mars aspect Saturn in 5th house : Starts':
    'Creative-fire window opens.',
  'Mars aspect Saturn in 5th house : Exact':
    'Peak day. Take the bold shared-bet; place the contested decision.',
  'Mars aspect Saturn in 5th house : Ends':
    'Creative-fire window closes.',
  'Mars aspect Rahu in 3rd house':
    'Mars on communication-chaos. Bold relational messages, contested journalism stress the bond.',
  'Mars aspect Rahu in 3rd house : Starts':
    'Communication-fire window opens.',
  'Mars aspect Rahu in 3rd house : Exact':
    'Peak day. Brief partner before the contested message lands publicly.',
  'Mars aspect Rahu in 3rd house : Ends':
    'Communication-fire window closes.',
  'Mars aspect Ketu in 9th house':
    'Mars on dharma-detachment. Forceful release of shared teacher-attachments.',
  'Mars aspect Ketu in 9th house : Starts':
    'Dharma-detachment-fire window opens.',
  'Mars aspect Ketu in 9th house : Exact':
    'Peak day. Forcefully close the dead shared-teacher channel.',
  'Mars aspect Ketu in 9th house : Ends':
    'Dharma-detachment-fire window closes.',

  // — Jupiter aspects natal —
  'Jupiter aspect Sun in 12th house':
    'Wisdom on retreat-throne. Confidential-intimacy expansion, foreign-trip elevation, archival-ritual depth.',
  'Jupiter aspect Sun in 12th house : Starts':
    'Retreat-expansion window opens.',
  'Jupiter aspect Sun in 12th house : Exact':
    'Peak day. Take the foreign-trip together; deepen the private rituals.',
  'Jupiter aspect Sun in 12th house : Ends':
    'Retreat-expansion window closes.',
  'Jupiter aspect Moon in 11th house':
    'Wisdom on emotional-network. Friend-circle elevation, mother-figure-mentor inflection.',
  'Jupiter aspect Moon in 11th house : Starts':
    'Gain-expansion window opens.',
  'Jupiter aspect Moon in 11th house : Exact':
    'Peak day. Accept the friend-circle elevation, formalize the mother-figure-mentor relationship.',
  'Jupiter aspect Moon in 11th house : Ends':
    'Gain-expansion window closes.',
  'Jupiter aspect Mercury in 1st house':
    'Wisdom on Bhadra craftsman-throne. Self-elevation in the relationship; analytical depth deepens.',
  'Jupiter aspect Mercury in 1st house : Starts':
    'Bhadra-expansion window opens.',
  'Jupiter aspect Mercury in 1st house : Exact':
    'Peak day. Accept the elevated relational role; deepen the partner\'s knowledge of you.',
  'Jupiter aspect Mercury in 1st house : Ends':
    'Bhadra-expansion window closes.',
  'Jupiter aspect Venus in 7th house':
    'Wisdom on Malavya partnership. Anchor-deal expansion, marriage-or-merger inflection, principal-client expansion.',
  'Jupiter aspect Venus in 7th house : Starts':
    'Malavya-expansion window opens.',
  'Jupiter aspect Venus in 7th house : Exact':
    'Peak day. Sign the elevated JV, accept the marriage inflection, take the principal-partnership expansion.',
  'Jupiter aspect Venus in 7th house : Ends':
    'Malavya-expansion window closes.',
  'Jupiter aspect Mars in 8th house':
    'Wisdom on Vipareet engine. Inheritance windfalls, joint-equity gains, succession-led elevation.',
  'Jupiter aspect Mars in 8th house : Starts':
    'Vipareet-expansion window opens.',
  'Jupiter aspect Mars in 8th house : Exact':
    'Peak day. Take the inheritance, accept the succession elevation, formalize the joint-equity windfall.',
  'Jupiter aspect Mars in 8th house : Ends':
    'Vipareet-expansion window closes.',
  'Jupiter aspect Jupiter in 4th house':
    'Jupiter on its own Hamsa throne. Peak home-throne expansion day. Real-estate windfall with partner; family-business inflection.',
  'Jupiter aspect Jupiter in 4th house : Starts':
    'Hamsa peak window opens.',
  'Jupiter aspect Jupiter in 4th house : Exact':
    'Peak Hamsa day. Acquire the property together; expand the family business.',
  'Jupiter aspect Jupiter in 4th house : Ends':
    'Hamsa peak window closes.',
  'Jupiter aspect Saturn in 5th house':
    'Wisdom on creative-romance discipline. Children-related expansion; long shared-project breakthrough.',
  'Jupiter aspect Saturn in 5th house : Starts':
    'Creative-discipline-expansion window opens.',
  'Jupiter aspect Saturn in 5th house : Exact':
    'Peak day. Take the children-related elevation, formalize the shared-project breakthrough.',
  'Jupiter aspect Saturn in 5th house : Ends':
    'Creative-discipline-expansion window closes.',
  'Jupiter aspect Rahu in 3rd house':
    'Wisdom on communication-chaos. Viral-content elevation; controversial-messaging breakthroughs sanctified.',
  'Jupiter aspect Rahu in 3rd house : Starts':
    'Communication-chaos-expansion window opens.',
  'Jupiter aspect Rahu in 3rd house : Exact':
    'Peak day. Take the bold relational message, accept the public-statement platform.',
  'Jupiter aspect Rahu in 3rd house : Ends':
    'Communication-chaos-expansion window closes.',
  'Jupiter aspect Ketu in 9th house':
    'Wisdom on dharma-detachment. Released teacher-attachment becomes its own teaching; principle-without-personality.',
  'Jupiter aspect Ketu in 9th house : Starts':
    'Dharma-detachment-expansion window opens.',
  'Jupiter aspect Ketu in 9th house : Exact':
    'Peak day. Convert the released shared-guru attachment into your own teaching together.',
  'Jupiter aspect Ketu in 9th house : Ends':
    'Dharma-detachment-expansion window closes.',

  // — Saturn aspects natal —
  'Saturn aspect Sun in 12th house':
    'Structural pressure on retreat-throne. Long confidential mandates with partner, slow foreign chapters.',
  'Saturn aspect Sun in 12th house : Starts':
    'Retreat-discipline window opens.',
  'Saturn aspect Sun in 12th house : Exact':
    'Peak day. Take the slow foreign assignment together; formalize the long-arc retreat ritual.',
  'Saturn aspect Sun in 12th house : Ends':
    'Retreat-discipline window closes.',
  'Saturn aspect Moon in 11th house':
    'Structural pressure on emotional-network. Friend-circles formalize; women-led-network deepens.',
  'Saturn aspect Moon in 11th house : Starts':
    'Network-discipline window opens.',
  'Saturn aspect Moon in 11th house : Exact':
    'Peak day. Sign the cooperative-platform charter; formalize the friend-circle membership.',
  'Saturn aspect Moon in 11th house : Ends':
    'Network-discipline window closes.',
  'Saturn aspect Mercury in 1st house':
    'Structural pressure on Bhadra craftsman-throne. Slow self-evolution in love; vanity-skills fall away.',
  'Saturn aspect Mercury in 1st house : Starts':
    'Bhadra-discipline window opens.',
  'Saturn aspect Mercury in 1st house : Exact':
    'Peak day. Eliminate vanity-aspects of the self in the relationship.',
  'Saturn aspect Mercury in 1st house : Ends':
    'Bhadra-discipline window closes.',
  'Saturn aspect Venus in 7th house':
    'Structural pressure on Malavya partnership. Spouse commitments scrutinized; weak deals end; strong ones formalize for 30 years.',
  'Saturn aspect Venus in 7th house : Starts':
    'Malavya-discipline window opens.',
  'Saturn aspect Venus in 7th house : Exact':
    'Peak day. Divorce the weak deal, formalize the strong marriage, lock in the long structure.',
  'Saturn aspect Venus in 7th house : Ends':
    'Malavya-discipline window closes.',
  'Saturn aspect Mars in 8th house':
    'Structural pressure on Vipareet engine. Inheritance disputes, joint-finance delays. Patience pays.',
  'Saturn aspect Mars in 8th house : Starts':
    'Vipareet-discipline window opens.',
  'Saturn aspect Mars in 8th house : Exact':
    'Peak day. Hold the line on the slow restructuring of joint affairs.',
  'Saturn aspect Mars in 8th house : Ends':
    'Vipareet-discipline window closes.',
  'Saturn aspect Jupiter in 4th house':
    'Structural pressure on Hamsa home-throne. Real-estate restructuring with partner; family-reckoning chapter.',
  'Saturn aspect Jupiter in 4th house : Starts':
    'Hamsa-discipline window opens.',
  'Saturn aspect Jupiter in 4th house : Exact':
    'Peak day. Take the slow real-estate decision; restructure the family arrangement.',
  'Saturn aspect Jupiter in 4th house : Ends':
    'Hamsa-discipline window closes.',
  'Saturn aspect Saturn in 5th house':
    'Saturn on its own creative throne. Peak structural-creative-romance day. The 10-year shared-project matures; children reach milestone phases.',
  'Saturn aspect Saturn in 5th house : Starts':
    'Saturn-creative peak window opens.',
  'Saturn aspect Saturn in 5th house : Exact':
    'Peak day. Formalize the long shared-project; lock in the multi-decade romance structure.',
  'Saturn aspect Saturn in 5th house : Ends':
    'Saturn-creative peak window closes.',
  'Saturn aspect Rahu in 3rd house':
    'Structural pressure on communication-chaos. Long-arc viral-content discipline; chaotic messaging formalizes.',
  'Saturn aspect Rahu in 3rd house : Starts':
    'Communication-discipline window opens.',
  'Saturn aspect Rahu in 3rd house : Exact':
    'Peak day. Lock in the multi-year content schedule with partner-buy-in.',
  'Saturn aspect Rahu in 3rd house : Ends':
    'Communication-discipline window closes.',
  'Saturn aspect Ketu in 9th house':
    'Structural pressure on dharma-detachment. Shared-teacher-release formally documented; lineage closure structural.',
  'Saturn aspect Ketu in 9th house : Starts':
    'Dharma-detachment-discipline window opens.',
  'Saturn aspect Ketu in 9th house : Exact':
    'Peak day. Sign the formal closure of the dead shared-teacher channel.',
  'Saturn aspect Ketu in 9th house : Ends':
    'Dharma-detachment-discipline window closes.',

  // — Rahu aspects natal —
  'Rahu aspect Sun in 12th house':
    'Chaotic expansion on retreat-throne. Foreign-mandate fevers, confidential-deal obsessions stress the bond.',
  'Rahu aspect Sun in 12th house : Starts':
    'Retreat-chaos window opens.',
  'Rahu aspect Sun in 12th house : Exact':
    'Peak day. Vet the foreign mandate twice; brief partner before signing.',
  'Rahu aspect Sun in 12th house : Ends':
    'Retreat-chaos window closes.',
  'Rahu aspect Moon in 11th house':
    'Chaotic expansion on emotional-network. Sudden viral-network gains stress the relationship.',
  'Rahu aspect Moon in 11th house : Starts':
    'Network-chaos window opens.',
  'Rahu aspect Moon in 11th house : Exact':
    'Peak day. Vet the network move; check partner alignment.',
  'Rahu aspect Moon in 11th house : Ends':
    'Network-chaos window closes.',
  'Rahu aspect Mercury in 1st house':
    'Chaotic expansion on Bhadra craftsman-throne. Sudden self-pivots stress the partnership.',
  'Rahu aspect Mercury in 1st house : Starts':
    'Bhadra-chaos window opens.',
  'Rahu aspect Mercury in 1st house : Exact':
    'Peak day. Take the bold self-pivot — brief the partner before the public announcement.',
  'Rahu aspect Mercury in 1st house : Ends':
    'Bhadra-chaos window closes.',
  'Rahu aspect Venus in 7th house':
    'Chaotic expansion on Malavya partnership. Foreign spouse-pull, controversial JV, sudden anchor-counterparty.',
  'Rahu aspect Venus in 7th house : Starts':
    'Malavya-chaos window opens.',
  'Rahu aspect Venus in 7th house : Exact':
    'Peak day. Vet the controversial relationship move thoroughly.',
  'Rahu aspect Venus in 7th house : Ends':
    'Malavya-chaos window closes.',
  'Rahu aspect Mars in 8th house':
    'Chaotic expansion on Vipareet engine. Sudden joint-finance windfalls, secrecy revealed, occult-research breakthroughs.',
  'Rahu aspect Mars in 8th house : Starts':
    'Vipareet-chaos window opens.',
  'Rahu aspect Mars in 8th house : Exact':
    'Peak day. Take the equity-event move with full documentation; partner sees everything.',
  'Rahu aspect Mars in 8th house : Ends':
    'Vipareet-chaos window closes.',
  'Rahu aspect Jupiter in 4th house':
    'Chaotic expansion on Hamsa home-throne. Foreign-property pull stresses the bond; verify titles.',
  'Rahu aspect Jupiter in 4th house : Starts':
    'Hamsa-chaos window opens.',
  'Rahu aspect Jupiter in 4th house : Exact':
    'Peak day. Vet the foreign-property paperwork before signing together.',
  'Rahu aspect Jupiter in 4th house : Ends':
    'Hamsa-chaos window closes.',
  'Rahu aspect Saturn in 5th house':
    'Chaotic expansion on creative-romance engine. Speculative-shared-bet fevers; viral-romance pulls.',
  'Rahu aspect Saturn in 5th house : Starts':
    'Creative-chaos window opens.',
  'Rahu aspect Saturn in 5th house : Exact':
    'Peak day. Take the speculative-shared move with full ethical-bedrock check.',
  'Rahu aspect Saturn in 5th house : Ends':
    'Creative-chaos window closes.',
  'Rahu aspect Rahu in 3rd house':
    'Rahu return on its own placement. Peak communication-chaos day. Viral relational-content opportunity at maximum amplitude — and risk.',
  'Rahu aspect Rahu in 3rd house : Starts':
    'Rahu-return communication window opens.',
  'Rahu aspect Rahu in 3rd house : Exact':
    'Peak Rahu-return day. Push the bold message — verify integrity.',
  'Rahu aspect Rahu in 3rd house : Ends':
    'Rahu-return window closes.',
  'Rahu aspect Ketu in 9th house':
    'Rahu-Ketu axis return on dharma. Peak shared-teacher turbulence; lineage-stress at maximum.',
  'Rahu aspect Ketu in 9th house : Starts':
    'Axis-chaos window opens.',
  'Rahu aspect Ketu in 9th house : Exact':
    'Peak day. Defer dharma decisions; the axis is too loud.',
  'Rahu aspect Ketu in 9th house : Ends':
    'Axis-chaos window closes.',

  // — Ketu aspects natal —
  'Ketu aspect Sun in 12th house':
    'Detachment on retreat-throne. Old confidential-mandate cravings dissolve.',
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
    'Peak day. Release the old friend-circle that has grown hollow.',
  'Ketu aspect Moon in 11th house : Ends':
    'Network-detachment window closes.',
  'Ketu aspect Mercury in 1st house':
    'Detachment on Bhadra craftsman-throne. Old self-persona feels hollow; the analytic mastery quiets in love.',
  'Ketu aspect Mercury in 1st house : Starts':
    'Bhadra-detachment window opens.',
  'Ketu aspect Mercury in 1st house : Exact':
    'Peak day. Sit with the self-mastery feeling weightless; do not over-perform for partner.',
  'Ketu aspect Mercury in 1st house : Ends':
    'Bhadra-detachment window closes.',
  'Ketu aspect Venus in 7th house':
    'Detachment on Malavya partnership. Old deal feels finished; relational dynamic loosens.',
  'Ketu aspect Venus in 7th house : Starts':
    'Malavya-detachment window opens.',
  'Ketu aspect Venus in 7th house : Exact':
    'Peak day. Sit with the deal feeling weightless; do not panic-renegotiate.',
  'Ketu aspect Venus in 7th house : Ends':
    'Malavya-detachment window closes.',
  'Ketu aspect Mars in 8th house':
    'Detachment on Vipareet engine. Old crises evaporate; deep transformation-detachment.',
  'Ketu aspect Mars in 8th house : Starts':
    'Vipareet-detachment window opens.',
  'Ketu aspect Mars in 8th house : Exact':
    'Peak day. Release the old crisis-pattern; the bond clears for the next chapter.',
  'Ketu aspect Mars in 8th house : Ends':
    'Vipareet-detachment window closes.',
  'Ketu aspect Jupiter in 4th house':
    'Detachment on Hamsa home-throne. Old real-estate plans feel weightless.',
  'Ketu aspect Jupiter in 4th house : Starts':
    'Hamsa-detachment window opens.',
  'Ketu aspect Jupiter in 4th house : Exact':
    'Peak day. Sit with the home-throne feeling weightless together; do not panic-sell.',
  'Ketu aspect Jupiter in 4th house : Ends':
    'Hamsa-detachment window closes.',
  'Ketu aspect Saturn in 5th house':
    'Detachment on creative-romance discipline. Old shared-creative loops feel finished.',
  'Ketu aspect Saturn in 5th house : Starts':
    'Creative-detachment window opens.',
  'Ketu aspect Saturn in 5th house : Exact':
    'Peak day. Release the dead shared-creative loop together.',
  'Ketu aspect Saturn in 5th house : Ends':
    'Creative-detachment window closes.',
  'Ketu aspect Rahu in 3rd house':
    'Ketu-Rahu axis stress on communication. Old viral-content loops feel finished.',
  'Ketu aspect Rahu in 3rd house : Starts':
    'Communication-axis-detachment window opens.',
  'Ketu aspect Rahu in 3rd house : Exact':
    'Peak day. Sit with the relational-content channel quieting.',
  'Ketu aspect Rahu in 3rd house : Ends':
    'Communication-axis-detachment window closes.',
  'Ketu aspect Ketu in 9th house':
    'Ketu return on its own placement. Peak dharma-detachment day. Old shared-teacher attachments dissolve completely; inner-guru surfaces fully.',
  'Ketu aspect Ketu in 9th house : Starts':
    'Ketu-return dharma window opens.',
  'Ketu aspect Ketu in 9th house : Exact':
    'Peak Ketu-return day. The shared-lineage attachment evaporates; the principle without personality crystallizes for both.',
  'Ketu aspect Ketu in 9th house : Ends':
    'Ketu-return dharma window closes.',
};
