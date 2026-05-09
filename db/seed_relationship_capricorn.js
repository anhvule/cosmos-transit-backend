// db/seed_relationship_capricorn.js
// (Continuation of the transits batch: Rahu Transits the 1st-6th, 8th-9th Houses and Saturn Transits the 1st-6th, 8th, 10th-12th Houses)

const db = require('./relationship');

const ASCENDANT = 'Capricorn';

const events = [
  { 
    name: 'Rahu Transits the 1st house', 
    description: 'When transiting Rahu enters your 1st house of self and identity, you are consumed by an intoxicating, obsessive desire for radical personal reinvention, which deeply destabilizes your relationship. You crave ultimate freedom and may act Transits the incredibly selfish, erratic ways, leaving your partner feeling abandoned or terrified of your sudden changes. You project a chaotic, highly magnetic sexual energy that attracts taboo or complicated romantic attention. If your partner tries to cage your evolution, arguments are explosive, rebellious, and focused entirely on your autonomy. You may experience a manic depression as you chase endless illusions of who you are "supposed" to be. Misunderstandings arise because you are completely blind to the emotional wreckage your independence is causing. To survive, you must consciously invite your partner into your chaotic growth rather than simply leaving them behind Transits the your reckless pursuit of self-discovery.' 
  },
  { 
    name: 'Rahu Transits the 1st house : Ends', 
    description: 'As transiting Rahu prepares to leave your 1st house, the intense period of obsessive self-focus, chaotic identity shifts, and reckless relational rebellion slowly starts to clear. The intoxicating illusion that you must destroy your life to find yourself fades, forcing you to confront the harsh reality of the damage your selfishness inflicted upon your partner. This fading phase brings a heavy, sobering depression and profound exhaustion as you survey the fractured trust. Misunderstandings slowly resolve, but the scars of your fierce, unyielding independence remain. Arguments transition from manic, primal demands for freedom to solemn, necessary apologies. To successfully rebuild the bond, you must engage Transits the rigorous honesty, actively integrating your newly discovered, fierce autonomy into a reliable, committed structure that respects your partner’s emotional safety.' 
  },
  { 
    name: 'Rahu Transits the 1st house : Exact', 
    description: 'At the exact degree of Rahu hitting a critical point Transits the your 1st house, the inflation of your ego and your absolute refusal to submit reaches a terrifying, explosive climax. You are completely consumed by a primal hunger for independence and intense, unconventional experiences, making this the most likely moment to engage Transits the highly destructive behavior—such as a scandalous affair or a sudden, cruel breakup fueled entirely by a need to reclaim your identity. You are convinced that traditional commitment is a suffocating prison. Arguments during this exact hit are vicious, deeply manipulative, and entirely devoid of empathy for your partner. The shattering of the relationship structure will trigger an isolating, feral depression. You must absolutely refuse to make permanent relationship decisions during this blinding, chaotic peak of self-obsession.' 
  },
  { 
    name: 'Rahu Transits the 1st house : Starts', 
    description: 'As transiting Rahu begins its approach to your 1st house cusp, a creeping, irresistible urge for romantic rebellion, extreme makeovers, and absolute personal sovereignty begins to deeply infect your subconscious. You start to feel profoundly restless and suffocated by the mundane, predictable reality of how your partner perceives you, developing an agitated, dark depression as you crave an entirely new life. This building tension causes you to become highly combative and secretive, creating a palpable, dangerous energy that triggers intense anxiety and power struggles. Misunderstandings begin to form as you read your partner’s attempts at connection as attempts at control, reacting with fierce, disproportionate anger to protect your newfound, fragile ego. You must proactively communicate your need for radical personal space before you detonate the partnership.' 
  },
  { 
    name: 'Rahu Transits the 2nd house', 
    description: 'When transiting Rahu enters your 2nd house of values and personal finances, your relationship is gripped by an intense, obsessive hunger for material security and aesthetic luxury. You may suddenly demand expensive gifts, luxurious dates, or a massive increase Transits the shared income to feel loved, equating financial power directly with romantic devotion. This transit fuels extreme possessiveness; you may treat your partner as an object you own rather than a human being. Arguments over money become spectacular, vicious, and deeply manipulative, rooted Transits the a paranoid fear of scarcity. If you cannot achieve the glamorous lifestyle you crave, you will plunge into a bitter, resentful depression. Misunderstandings occur when your partner feels financially used or emotionally neglected. To maintain love, you must separate your absolute self-worth from your bank account and stop treating your romance like a high-stakes corporate acquisition.' 
  },
  { 
    name: 'Rahu Transits the 2nd house : Ends', 
    description: 'As transiting Rahu prepares to leave your 2nd house, the intense period of financial obsession, extreme possessiveness, and material illusions within your relationship slowly starts to clear. The intoxicating drive to secure your self-worth through luxury and ownership fades, forcing you to look at the unvarnished reality of your finances and the emotional damage caused by your greed. This fading phase brings a heavy, sobering depression as you realize that money could not buy the deep, spiritual intimacy you actually craved. Misunderstandings slowly resolve, but the scars of financial betrayal or manipulative control remain. Arguments transition from manic demands for resources to necessary, practical budgeting and apologies. To heal the bond, you must completely decouple your love from materialism, focusing on building genuine emotional security.' 
  },
  { 
    name: 'Rahu Transits the 2nd house : Exact', 
    description: 'At the exact degree of Rahu hitting a critical point Transits the your 2nd house, the dangerous inflation of your financial desires and possessive romantic behavior reaches an absolute, terrifying climax. You are completely blinded by a hunger for ultimate material security, making this the most likely moment to make catastrophic decisions—such as hiding major debts, bankrupting yourself for a grand romantic gesture, or ruthlessly demanding your partner sign over their assets. You are convinced that financial control equals safety. If your partner challenges your spending or values, arguments during this exact hit are hysterical, deeply manipulative, and completely devoid of empathy. The inevitable shattering of these extreme financial illusions will trigger a devastating, isolating depression. You must refuse to make major financial or legal relationship commitments during this blinding peak.' 
  },
  { 
    name: 'Rahu Transits the 2nd house : Starts', 
    description: 'As transiting Rahu begins its approach to your 2nd house cusp, a creeping, irresistible urge for extreme wealth, material comfort, and obsessive possessiveness begins to infect your relationship. You start to feel profoundly restless and dissatisfied with the normal, steady financial reality of your partnership, developing a strange, yearning depression as you crave a highly glamorous, financially invincible lifestyle. This building tension causes you to become overly demanding of your partner’s resources, creating a palpable, confusing pressure that triggers intense financial anxiety Transits the your partner. Misunderstandings begin to form as you aggressively attempt to hoard money or affection, reacting with intense, confusing anger if your partner spends money without your permission. You must proactively ground yourself Transits the financial reality before your greed destroys your love.' 
  },
  { 
    name: 'Rahu Transits the 3rd house', 
    description: 'When transiting Rahu enters your 3rd house of communication and local environment, your relationship is hijacked by an obsessive, frantic need for constant mental stimulation and dialogue. You may hyper-analyze every single text message, looking for hidden meanings or secret betrayals, leading to severe, paranoid misunderstandings. This transit triggers a manic restlessness; you crave constant short trips, endless chatting, and extreme novelty Transits the your daily interactions. If your partner is quiet or needs mental space, you will initiate sudden, aggressive arguments just to provoke a verbal reaction, plunging into an anxious, overthinking depression if left Transits the silence. The danger of emotional affairs or flirtations Transits the your immediate neighborhood or online is incredibly high due to Rahu’s insatiable curiosity. To survive, you must channel this explosive mental energy into shared learning or writing, rather than obsessively dissecting your partner’s every word.' 
  },
  { 
    name: 'Rahu Transits the 3rd house : Ends', 
    description: 'As transiting Rahu prepares to leave your 3rd house, the intense period of chaotic communication, mental paranoia, and frantic daily restlessness slowly starts to clear. The intoxicating urge to constantly interrogate your partner or seek out forbidden flirtations fades, forcing you to confront the damage caused by your reckless words and obsessive overthinking. This fading phase brings a heavy, sobering depression and profound mental exhaustion as your nervous system attempts to recover from the endless verbal sparring. Misunderstandings slowly resolve as grounded, quiet communication returns. Arguments transition from manic, rapid-fire accusations to solemn, necessary apologies for the harsh things you said. To successfully rebuild trust, you must engage Transits the rigorous honesty and learn to comfortably tolerate silence within the partnership again.' 
  },
  { 
    name: 'Rahu Transits the 3rd house : Exact', 
    description: 'At the exact degree of Rahu hitting a critical point Transits the your 3rd house, the inflation of your mental anxieties, verbal aggression, and deceptive communication reaches a terrifying, absolute climax. You are completely blinded by your own paranoid projections, making this the most likely moment to discover a hidden text message, engage Transits the a scandalous neighborhood affair, or initiate an entirely irrational, relationship-destroying verbal attack. You are convinced that your twisted, highly anxious perception of the facts is the absolute truth. Arguments during this exact hit are hysterical, deeply confusing, and deliberately cruel, causing immense emotional trauma to your partner. The shattering of these intense mental illusions will trigger an agonizing, isolating depression. You must absolutely refuse to act on your paranoid suspicions or send impulsive, destructive messages during this peak.' 
  },
  { 
    name: 'Rahu Transits the 3rd house : Starts', 
    description: 'As transiting Rahu begins its approach to your 3rd house cusp, a creeping, irresistible urge for mental escapism, constant chatter, and paranoid overthinking begins to deeply infect your communication style. You start to feel profoundly restless and dissatisfied with the quiet, mundane reality of your relationship, developing an agitated depression as your mind wanders toward highly suspicious fantasies or secret online flirtations. This building tension causes you to become secretive yet verbally demanding, creating a palpable communicative distance that triggers intense anxiety Transits the your partner. Misunderstandings begin to form as you read malicious intent into your partner’s innocent comments, projecting your own growing guilt or hidden fears onto them. You must proactively confess these uncomfortable thoughts Transits the a safe space before they mutate into explosive verbal accusations.' 
  },
  { 
    name: 'Rahu Transits the 4th house', 
    description: 'When transiting Rahu enters your 4th house of home, family, and emotional foundations, your private life is thrown into a chaotic, obsessive upheaval. You develop an insatiable hunger to completely uproot your living situation, obsessively renovating, relocating abruptly, or trying to forcefully manufacture a "perfect" family dynamic that does not exist. This transit unearths massive, dark ancestral traumas and deep-seated fears of abandonment, which you project entirely onto your partner. If your spouse cannot provide the impossible level of emotional security you demand, you will react with spectacular, emotionally manipulative arguments, threatening the very foundation of the bond. You may plunge into a profound, suffocating depression, feeling entirely unmothered and unsafe Transits the your own home. Misunderstandings are deeply psychological. To survive, you must realize that a new house or a perfect domestic facade cannot heal your internal emotional void.' 
  },
  { 
    name: 'Rahu Transits the 5th house', 
    description: 'When transiting Rahu enters your 5th house of romance, creativity, and children, your relationship is swept into a dangerous, intoxicating hurricane of obsessive passion and dramatic performance. You crave extreme, cinematic romance and heart-pounding excitement, becoming completely intolerant of a stable, "boring" love life. This transit heavily triggers the urge for scandalous affairs, risky sexual encounters, or sudden, chaotic pregnancies. You may treat your partner as an actor Transits the your grand romantic play, throwing massive, theatrical tantrums if they fail to deliver the drama you crave. If your need for attention and intense joy is unmet, you will spiral into a dark, dramatic depression. Misunderstandings arise because your partner feels like an accessory to your ego rather than a true equal. You must aggressively channel this manic creative and romantic energy into art or shared hobbies, refusing to blow up your life just for the adrenaline rush.' 
  },
  { 
    name: 'Rahu Transits the 6th house', 
    description: 'When transiting Rahu enters your 6th house of daily routines, service, and conflicts, your relationship is plagued by an obsessive, chaotic disruption of the mundane order. You experience a manic drive to completely overhaul your shared schedule, diet, or division of labor, demanding impossible, illusion-driven perfection from your partner. You may develop extreme hypochondria or become obsessively fixated on your partner\'s flaws, leading to bizarre misunderstandings where your intense efforts are met with a baffling, frustrated withdrawal from your spouse. Severe, petty arguments erupt over insignificant details, causing a deeply exhausting, stress-induced depression as you feel you are drowning Transits the daily chaos. You may use illness or acts of service manipulatively to gain control. To navigate this frustrating karma, you must surrender the illusion that you can perfect your partner\'s daily habits, redirecting this manic problem-solving energy into your own independent work.' 
  },
  { 
    name: 'Rahu Transits the 8th house', 
    description: 'When transiting Rahu enters your 8th house of profound intimacy and shared trauma, your relationship is thrust into a dangerous, intoxicating period of obsessive psychological and financial expansion. You develop an insatiable hunger to merge completely with your partner, pushing the boundaries of sexual taboo and emotional vulnerability to extreme limits. While this can feel like a thrilling, destined soul-connection, Rahu creates massive illusions. You may mistake toxic trauma-bonding for genuine healing, expanding on shared dark secrets until they consume your daily life. Financial greed or reckless investments of joint resources can lead to spectacular arguments and catastrophic ruin. If this extreme bubble bursts, the resulting paranoia and loss of trust will trigger a deep, agonizing depression. You must carefully ground your desire for deep connection Transits the stark reality, refusing to let obsessive manipulation replace authentic, steady trust.' 
  },
  { 
    name: 'Rahu Transits the 9th house', 
    description: 'When transiting Rahu enters your 9th house of philosophy, travel, and belief systems, your relationship is hijacked by an explosive, obsessive, and fanatical ideological drive. You develop an insatiable hunger for extreme adventure or radical shifts Transits the your shared worldview, completely rebelling against traditional relationship structures. This fiery illusion makes you incredibly dogmatic; you will ruthlessly attack your partner\'s beliefs if they do not align with your new, obsessive paradigm, leading to spectacular, deeply wounding arguments. The sexual energy is dangerously volatile, fueled by adrenaline and ideological warfare. If your partner resists your manic push for expansion, you will experience a fierce, restless depression, feeling entirely suffocated. Misunderstandings are catastrophic because you mistake fanaticism for truth. To survive, you must channel this massive, explosive energy into thrilling physical travel, refusing to turn your philosophical differences into a battleground for relationship supremacy.' 
  },
  { 
    name: 'Saturn Transits the 1st house', 
    description: 'When transiting Saturn enters your 1st house of self and structural identity, your relationship undergoes the ultimate test of personal responsibility and boundary maintenance. You are forced to confront the absolute reality of who you are within the partnership, stripping away any lingering illusions or immature dependencies. This transit imposes a massive, grinding pressure to grow up; if you have been carrying your partner or allowing them to cross your boundaries, you will experience a crushing, resentful depression that forces you to build impenetrable walls. Arguments are stark, cold, and entirely focused on structural fairness, duty, and the rigid enforcement of personal space. Misunderstandings occur when your partner views your necessary boundary-setting as a cold-hearted rejection. To survive this severe karmic audit, you must embrace absolute self-reliance, proving that your commitment is built on mutual respect between two fully formed, independent adults.' 
  },
  { 
    name: 'Saturn Transits the 2nd house', 
    description: 'When transiting Saturn enters your 2nd house of values and personal finances, your relationship is subjected to a severe, sobering reality check regarding material security and self-worth. You experience a profound fear of poverty or lack, leading to intense financial restriction, grueling budgeting, and a total elimination of frivolous romantic spending. This heavy focus on survival can completely starve the relationship of joy and luxury, causing a deep, cold depression as you feel fundamentally unworthy of being pampered. Arguments are utterly pragmatic, focusing on debts, shared expenses, and practical contributions. Misunderstandings arise when your partner interprets your financial stinginess as a lack of love, while you feel they are being dangerously irresponsible. To survive this freezing transit, you must consciously communicate that your financial strictness is an act of deep loyalty aimed at securing your shared future, actively finding free, practical ways to demonstrate your affection.' 
  },
  { 
    name: 'Saturn Transits the 3rd house', 
    description: 'When transiting Saturn enters your 3rd house of communication and local environment, the dialogue within your relationship becomes incredibly serious, heavy, and restricted by a fear of saying the wrong thing. The easy, playful banter dies, replaced by highly structured, necessary, and often exhausting conversations about logistics, boundaries, and harsh realities. You may experience a profound inability to articulate your emotions, leading to a chilling silence and a deeply isolating mental depression. Arguments are not loud; they are characterized by brutal stonewalling, harsh criticism, and a rigid refusal to compromise your perspective. Misunderstandings are stark, as your partner assumes your cold, brief texts and quiet demeanor mean you no longer care. To keep the relationship from freezing over, you must force yourself to speak your truth, however clumsily, proving that the commitment is stronger than the terrifying silence.' 
  },
  { 
    name: 'Saturn Transits the 4th house', 
    description: 'When transiting Saturn enters your 4th house of home, family, and emotional foundations, the deepest roots of your relationship are subjected to a brutal karmic audit. You feel an immense, crushing weight of responsibility regarding your living situation, family duties, or ancestral trauma. The home may feel like a cold, restrictive prison rather than a sanctuary. If your emotional foundation is weak, this transit will trigger a devastating, lonely depression as you realize your partnership lacks genuine safety. Arguments are heavy, focusing on domestic burdens, past childhood wounds, and the grueling work of maintaining a household. Misunderstandings occur when your partner feels completely shut out of your private pain, interpreting your stoic endurance as rejection. To survive, you must strip away all illusions about your past, committing entirely to the mature, unglamorous work of building a structurally sound, authentic emotional home from the ground up.' 
  },
  { 
    name: 'Saturn Transits the 5th house', 
    description: 'When transiting Saturn enters your 5th house of romance, creativity, and joy, the carefree, playful aspects of your relationship are completely frozen by a profound sense of duty and limitation. Romance feels like exhausting work. You may experience a severe block Transits the your sex drive or creativity, plunging into a heavy, melancholic depression as the "spark" completely dies. If you have children, the burdens of parenting may overwhelm the partnership entirely. Arguments revolve around a lack of appreciation, the burden of romantic performance, and deep-seated fears of inadequacy. Misunderstandings are painful; your partner feels rejected and unloved, while you feel completely incapable of summoning fake enthusiasm. To survive this romantic winter, you must redefine love as an act of dedicated, enduring loyalty rather than spontaneous passion, consciously scheduling practical, disciplined acts of affection to keep the bond alive.' 
  },
  { 
    name: 'Saturn Transits the 6th house', 
    description: 'When transiting Saturn enters your 6th house of daily routines and health, the mundane reality of your relationship becomes an immense, grinding karmic burden. You feel completely crushed by the endless, joyless responsibilities of domestic life, caregiving, or managing daily conflicts. This transit pairs Saturn\'s demand for rigid structure with the reality of physical limitations, creating a devastating dynamic where you must endlessly perform chores while feeling entirely exhausted. You will likely experience severe physical burnout and a deep, resentful depression, feeling like an unappreciated employee rather than a lover. Misunderstandings are characterized by stony silence and passive-aggressive endurance. Arguments are weary and focused entirely on the unequal division of labor. To survive, you must strip your daily life down to the absolute bare minimum, ruthlessly enforcing strict boundaries regarding chores and health to preserve your sanity.' 
  },
  { 
    name: 'Saturn Transits the 8th house', 
    description: 'When transiting Saturn enters your 8th house of deep intimacy and shared wealth, the trusting, vulnerable nature of your relationship is subjected to a severe, sobering reality check. The expansive connection you previously shared regarding psychological merging or joint finances is suddenly crushed by the heavy weight of duty, limitation, and profound fear. You or your partner may experience significant financial burdens, debt, or legal restrictions that severely strain the bond. Emotionally, this transit triggers a profound fear of betrayal; you build massive, rigid walls to protect yourself, leading to a cold, isolating depression as the intimacy freezes over entirely. Arguments are highly practical, focusing on money, trust, and the terrifying realization of your shared liabilities. To survive, you must replace blind faith with disciplined, mature responsibility, working together methodically to secure your foundation without completely shutting each other out.' 
  },
  { 
    name: 'Saturn Transits the 10th house', 
    description: 'When transiting Saturn enters your 10th house of career and public status, your relationship is crushed by the immense weight of professional ambition, societal duty, and public reputation. You feel that you cannot afford to have messy, vulnerable emotions if you want your partnership to succeed Transits the the eyes of the world. You and your partner may become so focused on building a secure public empire that you completely starve the private intimacy of the bond. This severe emotional restriction triggers a profound, cold depression; the relationship feels like a joyless business arrangement or a rigid PR campaign. Arguments revolve around career sacrifices, public embarrassment, and the failure to meet harsh societal expectations. Misunderstandings arise because your partner feels unloved, while you feel you are showing love by working yourself to the bone for your shared future. You must actively schedule private affection.' 
  },
  { 
    name: 'Saturn Transits the 11th house', 
    description: 'When transiting Saturn enters your 11th house of friendships, networking, and long-term goals, your relationship\'s social circle and future visions undergo a severe structural audit. You may experience a painful pruning of shared friends, leaving you and your partner feeling socially isolated and plunging you into a quiet, lonely depression. The carefree, social aspect of your bond is replaced by a heavy focus on serious, long-term strategic networking. Arguments revolve around which friends are "useful" or practical, and whether your ultimate visions for the future are truly compatible. Misunderstandings occur when your partner views your sudden social coldness as snobbery, while you are simply exhausted by superficial connections. To survive, you must act as a highly disciplined, unified team, realizing that true friendship within the marriage is proven through the grueling work of building a secure, respectable future together.' 
  },
  {
    name: 'Saturn Transits the 12th house',
    description: 'When transiting Saturn enters your 12th house of the subconscious and karmic endings, your darkest, most terrifying hidden fears and toxic relational patterns collide violently with a massive, unyielding wall of harsh reality. The secretive fantasies, codependencies, or escapist behaviors that have quietly infected your relationship are suddenly exposed to the cold, unforgiving light of Saturn\'s discipline. This transit forces a brutal karmic reckoning; you can no longer hide from the truth of your psychological baggage. This triggers an agonizing, paralyzing depression, as the coping mechanisms you relied upon are systematically destroyed. Arguments are terrifyingly stark, forcing you to face the consequences of any past deceit. Misunderstandings dissolve into a stark, painful clarity. To survive this grueling psychological audit, you must accept absolute, radical responsibility for your hidden fears, preparing to let go of whatever structures no longer serve your soul\'s evolution.'
  },
  // Gap events found via live-API audit — not in the original firable
  // enumeration but emitted by the engine for this chart.
  { name: 'Mars in 9th (Dispositor)', description: 'Your relationships test your principles more than they test your warmth. When this dispositor fires, the partnership decision in front of you is really a dharma decision in disguise. The right partner aligns with your foreign-flavored, principled, mentor-worthy life-trajectory — not just your present comfort. Choose accordingly, even when the choice costs.' },
  { name: 'Uranus aspect Saturn in 1st house : Exact', description: 'Today a structural relationship pattern fractures suddenly. The committed partnership feels electric and unstable; the marriage you assumed permanent reveals an unexpected tension; the long-term partner shows a side you haven\'t seen. Don\'t over-react. Uranus is asking the relationship to evolve into something less rigid, not necessarily to end. Listen for what wants to change, then renegotiate the structure deliberately rather than walking out impulsively.' }
];

// UPSERT (not UPDATE) so events authored here that don\'t yet have a row
// in the per-ascendant table are inserted on first run.
const upsert = db.prepare(
  'INSERT INTO events (ascendant, name, description) VALUES (?, ?, ?) ' +
  'ON CONFLICT(ascendant, name) DO UPDATE SET description = excluded.description'
);

function run() {
  const tx = db.transaction(() => {
    let updated = 0, empty = 0;
    for (const e of events) {
      if (!e.description) { empty++; continue; }
      upsert.run(ASCENDANT, e.name, e.description);
      updated++;
    }
    return { updated, empty, notFound: 0 };
  });
  return tx();
}

if (require.main === module) {
  const { updated, empty, notFound } = run();
  console.log(
    `[${ASCENDANT} relationship] ${updated} updated · ${empty} still empty · ` +
    `${notFound} not in DB`,
  );
}

module.exports = { events, ASCENDANT };