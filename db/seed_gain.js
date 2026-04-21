const db = require('./gain');

const events = [
  {
    name: 'Moon Transits the 8th House',
    description: "Emotional volatility hits your portfolio. Panic selling is a risk as the 8th house governs sudden, unexpected market movements. Trust your deep intuition over market noise, especially in highly volatile assets like crypto. Hidden information about a token or stock might surface, causing sudden drops or spikes. Avoid entering into unpredictable trading syndicates today.",
  },
  {
    name: 'Moon aspect Venus in 8th house',
    description: 'A longing for past lucrative investments returns. You may feel drawn to re-enter a trade or crypto position you previously abandoned. A sudden, unearned financial gain or a tip regarding an undervalued asset could come your way. Your intuition regarding luxury, gaming, or entertainment stocks is heightened.',
  },
  {
    name: 'Venus ruler of the 2nd House in the 8th House',
    description: "Sudden wealth accumulation is possible through other people's money, such as venture capital, margin trading, or unexpected dividends. You might receive a windfall from a forgotten crypto wallet, a massive airdrop, or a sudden settlement. Money is made through high-risk investments. Keep your trading strategies a secret for now.",
  },
  {
    name: 'Venus ruler of the 7th House in the 8th house',
    description: 'Trading partners or signal groups are very secretive and not highly trustworthy right now. This is a very difficult placement for joint ventures and may indicate a rug pull or betrayal in a crypto project. Be aware of issues around counterparty risk. Major lessons regarding trust in the market are being learned.',
  },
  {
    name: 'Moon aspect Mercury in 8th house',
    description: 'Deep technical analysis and on-chain research keep you locked into the charts today. You feel you are on the brink of discovering the next 100x gem. You can rely on your analytical hunches as they are combining with intuition to lead you in the right direction for sudden gains.',
  },
  {
    name: 'Mercury ruler of the 3rd House in the 8th House',
    description: 'Difficulties with trading communities or discord groups can cause sudden exits or bans. There is an intense interest in dead coins or highly speculative, obscure assets. You may begin studying complex trading algorithms or psychological market cycles. Willpower is needed to avoid revenge trading after a sudden loss.',
  },
  {
    name: 'Mercury ruler of the 6th House in the 8th House',
    description: 'Flaws in smart contracts or exchange glitches may be hard to diagnose, turning into serious chronic issues for your portfolio. There may be many sudden portfolio liquidations if leverage is too high. Caution and care are required with the platforms you use, as there is a risk of hacks or regulatory lawsuits. Be cautious with trading bots!',
  },
  {
    name: 'Moon aspect Mars in 8th house',
    description: 'You may dwell on past liquidations or missed pumps that drain your trading psychology. Today you must take charge, eliminate the fear, and change these feelings into an aggressive, calculated trading strategy for sudden windfalls.',
  },
  {
    name: 'Mars ruler of the 1st House in the 8th House',
    description: 'The markets can be a struggle today! Poor risk management or lack of drive through early bear markets builds character as a trader. Deep introspection can give a rational reason for why you are getting stopped out constantly. Try to understand your risk tolerance. There is an interest in algorithmic, highly volatile crypto trading.',
  },
  {
    name: 'Mars ruler of the 8th House in the 8th House',
    description: 'Deep psychological awareness means you are constantly analyzing market sentiment. You have profound intuition for when a whale is manipulating the price. Your interest in on-chain sleuthing could lead you to spot massive hidden wallets. You could excel in hunting micro-caps. Issues with past FOMO cause you to trade secretively. Huge transformational gains or losses surface today.',
  },
  {
    name: 'Moon Transits the 9th House',
    description: 'Market guidance seems unclear and wavering convictions regarding a long-term hold begin a journey to find the true intrinsic value. Emotional attachments to specific "moon boy" beliefs are difficult to change. Past conditioning regarding traditional finance is breaking down as new crypto beliefs are developed. Fortunes are transforming.',
  },
  {
    name: 'Moon aspect Sun in 9th house',
    description: 'Read or listen to inspirational messages from successful institutional investors. Today you will open your mind to new speculative possibilities with positive macro thoughts. Understanding the broader market forces and regulatory environments gives constructive reinforcement to your bags.',
  },
  {
    name: 'Sun ruler of the 5th House in the 9th House',
    description: 'Speculation and understanding market philosophy are a dominant part of your life. A major market maker or institutional whale can be a major influence on your holdings. There is an ease and comfort that comes from immense divine luck in your trades. You are very lucky in the markets today.',
  },
  {
    name: 'Moon aspect Rahu in 9th house',
    description: 'Extreme and fanatical beliefs regarding a coin taking over the world are triggered by crypto news or influencers. Rahu brings a desire for massive, fast gains. You have come to a new realization about market manipulation, and these annoyances remind you to take profits.',
  },
  {
    name: 'Moon aspect Ketu in 3rd house',
    description: 'You analyze charts and communicate trade setups in a way completely different from the norm, but this is your true stroke of genius. Be in control of your contrarian talents and use them to fade the public sentiment and develop a unique edge.',
  },
  {
    name: 'Moon Transits the 10th House',
    description: "Fluctuations and changes in the leadership of a company you hold stock in may come as a surprise. The developers of a crypto project are going through changes. The market trends may not be permanent, only fleeting momentum. Don't be too attached to the whitepapers because everything is subject to change. Secure your profits.",
  },
  {
    name: 'Sun Transits the 12th House',
    description: "Quality time spent away from the charts rebuilds the trading spirit and gives time to reset psychology. It is time to close out losing positions and bring closure to bad trades. Speculative losses may be a source of emotional drain. Past market cycles are awakening a new awareness of reality. Holding heavy bags keeps you awake at night with worry.",
  },
  {
    name: 'Moon aspect Saturn in 10th house',
    description: 'The market sentiment is a little depressing today, likely a slow bleed. No one wants to inject volume, leading to a lack of inspiration. A continued focus on accumulating solid, blue-chip stocks or top-tier crypto will eventually boost your portfolio over the long term.',
  },
  {
    name: 'Saturn ruler of the 10th House in the 10th House',
    description: 'Long-term investment success is a driving force and consumes your thoughts. You command respect in trading circles. Your disciplined strategy defines you. This is a great time to secure your hardware wallets, compound your yields, and position yourself for the next major market cycle.',
  },
  {
    name: 'Saturn ruler of the 11th House in the 10th House',
    description: 'Your trading pursuits should give a sense of purpose. There must be discipline for your speculative gains. You will be connected to powerful market makers or venture capitalists through your network. Their guidance is what you need to scale your wealth now.',
  },
  {
    name: 'Moon Transits the 11th House',
    description: "Fellow traders seem to call needing attention and advice on their underwater positions. Take a step back from frivolous market noise. Don't let inexperienced investors cause an emotional drain or influence your own strategy. Avoid discord groups spreading FUD or FOMO; they are a waste of time.",
  },
  {
    name: 'Moon aspect Jupiter in 5th house',
    description: 'Time to reconnect to your initial trading thesis and have fun with a small speculative bag. A strong 5th house presence indicates luck in lotteries and fast markets. Following your intuition on a new launch can bring financial affection and massive expansion to your portfolio.',
  },
  {
    name: 'Jupiter ruler of the 9th House in the 5th House',
    description: 'Immense divine luck and fortune come directly from speculative investments and high-risk trading. You have a golden touch today. You are very truthful about market realities, and many seek out your alpha. You give valuable financial advice to others today.',
  },
  {
    name: 'Jupiter ruler of the 12th House in the 5th House',
    description: 'You may have experienced hidden losses or the inability to capture gains in the past. Now is the time to develop the hidden and latent talent for spotting undervalued foreign markets or obscure altcoins. Your intuition for sudden pumps is strong; use this gift for financial guidance now.',
  },
  {
    name: 'Moon Transits the 12th House',
    description: 'Memories of past bull runs and missed opportunities creep into the mind. Daydreaming of having bought the bottom consumes the mind. Your speculative bags are a concern with worry over market conditions. It is time to sleep and step away from the leverage. Release the pain of previous liquidations.',
  },
  {
    name: 'Mars aspect Jupiter in 5th house',
    description: 'You are highly active and aggressive in the speculative markets today. You are incredibly lucky with high-leverage investments and options trading. You have the courage to take massive positions, and Jupiter expands the potential for immense, rapid wealth accumulation.',
  },
  {
    name: 'Sun in 9th (Dispositor)',
    description: 'Your sense of conviction in your macro thesis is at the bottom of what is occurring now. Major institutional players could be the culprit of the sudden market movements you are experiencing. Moving assets to cold storage gives you freedom.',
  },
  {
    name: 'Moon aspect Moon in 6th house',
    description: "Retail traders in your circles need your support as they panic sell, even though they drain your energy. Give advice but don't lower your own risk management to their level. Watch your stress levels today, for the market volatility is overly sensitive to your stomach.",
  },
  {
    name: 'Moon ruler of the 4th House in the 6th House',
    description: 'The broader market may have many weaknesses or need a bailout. Retail investors seem to struggle and have heavy debts from margin calls. Regulatory bodies cause the crypto space many problems. All these bearish issues or memories of previous crashes surface now.',
  },
  {
    name: 'Moon Transits the 1st House',
    description: 'Clarity of mind gives the power to instigate a new trading strategy. A deeper sensitivity to market sentiment plays a major part in the choices of direction your portfolio takes. This new outlook initiates a different perception of the charts with a renewed mindset on how to achieve your financial desires.',
  },
  {
    name: 'Moon Transits the 2nd House',
    description: 'Your portfolio balance fluctuates, unable to find a stable support level. It is not the time to make large, risky investments in volatile assets. Spending more time securing your profits and building a long-term savings plan will bring peace to your finances. Stay away from emotional trading that can cause excessive drawdowns.',
  },
  {
    name: 'Venus aspect Moon in 6th house',
    description: 'Any trading practice that refines your risk-to-reward ratio is on your to-do list. Learning more about taking consistent, comfortable profits attracts your attention. Shopping for undervalued assets during a market dip is unusually interesting and potentially lucrative.',
  },
  {
    name: 'Mercury in 8th (Dispositor)',
    description: 'Deep analytical thoughts to get to the bottom of a token’s tokenomics will uncover hidden truths. Listening to your intuition on market trends helps heal past losses. Financial healing comes from your vast understanding of market psychology.',
  },
  {
    name: 'Moon Transits the 3rd House',
    description: "Being flexible and open-minded brings in new trading opportunities that open your mind to different asset classes. Unplanned and spontaneous swing trades give a new sense of financial freedom. Twitter crypto gossip is very entertaining, but don't get caught buying the top based on rumors.",
  },
  {
    name: 'Venus Transits the 1st House',
    description: 'Your trading portfolio looks extremely attractive and profitable. There is a glow of financial success with a powerful attractive force for more wealth. Style and image are important; you may want to flaunt your gains. Partners suddenly recognize your trading skills. Investments in the arts, NFTs, or entertainment stocks look promising.',
  },
  {
    name: 'Moon Transits the 4th House',
    description: 'Focus turns to securing your wealth in safe-haven assets or real estate. Nostalgic feelings of early crypto days bring comfort. Taking profits to secure your home and baseline security is a fleeting thought. Seeking a sense of financial stability compels you to step away from risky speculation and rest.',
  },
  {
    name: 'Mars aspect Moon in 6th house',
    description: 'Inexperienced traders cause distress for others with their constant FUD. Your risk tolerance is very sensitive; be careful with your leverage and aware of what causes portfolio drawdowns. Extreme market volatility may be the cause of fluctuating moods. Find a way to balance your emotions to protect your capital.',
  },
  {
    name: 'Uranus conjunct Venus',
    description: 'Unexpected and massive volatility sparks an exciting rush of sudden wealth. Chance price spikes happen in the most unexpected altcoins. You will fall in love with a new speculative asset suddenly. A trade begins with a bang and takes you on a fast whirlwind full of intrigue and excitement. There may be a sudden influx of money that affords you a new life of luxury. You may impulsively want to buy a lambo.',
  },
  {
    name: 'Mars in 8th (Dispositor)',
    description: 'Your deep psychological understanding of fear and greed is the result of the extreme volatility you are experiencing now. Relentless research and digging deep into order books have proved beneficial to the massive speculative gains happening currently.',
  },
  {
    name: 'Moon Transits the 5th House',
    description: 'Sudden inspiration to take a highly speculative position brings an optimistic attitude. Trading volatile assets is fun and feels like a game. Rapid market movements can be emotional and drain your energy. The mind seems to wander, without focus, daydreaming of jackpot gains and lottery wins.',
  },
  {
    name: 'Mars Transits the 12th House',
    description: 'Secret enemies and hackers are lurking behind the scenes; be careful and don\'t leave funds on vulnerable exchanges. Protect your assets with cold storage. At work, others are jealous of your gains; be careful what is shared about your portfolio to avoid targeting. Sleep is disturbed, waking up with nightmares about liquidations.',
  },
  {
    name: 'Mercury aspect Jupiter in 5th house',
    description: 'Interest in trading bots and technology that enhances the ability to make rapid investments becomes a focus. New algorithmic ways of trading open the awareness to massive profits. A desire to pursue high-risk, high-reward plays is strong. You receive positive reinforcement through compounding gains.',
  },
  {
    name: 'Sun aspect Moon in 6th house',
    description: 'Changes in your portfolio’s health inspire you to change your risk management and everyday trading habits. Taking profits or opting for a better, more secure asset allocation throughout the day will make you feel financially healthier and affect lifelong wealth accumulation.',
  },
  {
    name: 'Sun Transits the 1st House',
    description: 'Energy and stamina inspire a new, aggressive trading campaign. A sense of self-confidence comes from feeling strong about your market positions. It is time to get back into the active markets with a renewed sense of purpose. A new sense of conviction leads to massive speculative success.',
  },
  {
    name: 'Mercury Transits the 12th House',
    description: 'Thoughts of old, forgotten altcoins intuit a sudden urge to check old wallets out of the blue. Intuitive reads on hidden market manipulation are developed. Interest in foreign markets may initiate plans for offshore trading accounts. It is time to begin a trading journal to process and heal from painful past liquidations.',
  },
  {
    name: 'Ketu aspect Sun in the 9th house',
    description: 'The dominance of traditional market makers may be declining. Old issues concerning regulatory authorities seem to surface for retribution. Problems with the SEC or financial laws can rise in conflict. A major financial institution may fail. Your investment beliefs are changing with the changing direction of global finance.',
  },
  {
    name: 'Venus Aspecting Ascendant (ASC)',
    description: "Your portfolio will attract positive attention, making it a good time to focus on taking profits and enjoying the luxury your gains provide. Ensure you balance the thrill of the casino-like markets with risk-off self-care and daily responsibilities.",
  },
  {
    name: 'Jupiter in 5th (Dispositor)',
    description: 'Situations concerning highly speculative trades and lotteries bring massive happiness and a different perspective to wealth currently. You are extremely intuitive regarding market timing during this period and could be manifesting a jackpot, adding immense prosperity to your life.',
  },
  {
    name: 'Moon Transits the 6th House',
    description: 'The market structure is weak; pay attention to the quality of assets held, or there will be severe drawdowns. The trading environment is changing, and many retail investors are panicking because there is uncertainty and FUD in the air. Secure, yield-bearing stablecoins are comforting.',
  },
  {
    name: 'Moon Transits the 7th House',
    description: 'A change of heart regarding a major position may be worrisome, but don\'t despair because it is only a fleeting market correction. The broader market may be unpredictable, vacillating between bullish and bearish sentiment. An unforeseen lack of volume has an emotional effect. There is chaos in the order books, but remember, things are not as they may appear.',
  },
  {
    name: 'Saturn aspect Sun in 9th house',
    description: 'The traditional financial system is showing signs of weakness or looking at an overhaul. Many old beliefs about safe investments are breaking apart. There may be problems with financial advisors or regulatory bodies. The usual institutional support is now leaving or abandoning the sector.',
  },
  {
    name: 'Venus Transits the 2nd House',
    description: 'Financial accumulation is on a massive upswing with incredible luck and prosperity. Taking profits to purchase luxury items will beautify your life. Be clear in executing your trades to receive the exact desired result. The 2nd house rules wealth, therefore assets that yield high dividends or staking rewards are of intense interest.',
  },
  {
    name: 'Venus aspect Venus in 8th house',
    description: 'A deep longing for a massive windfall consumes the mind. The need to experience life-changing wealth opens your risk appetite. There may be a connection with a highly lucrative, hidden market that comes at this time. A current investment deepens with compounding returns. A special airdrop is given, and money generated through high volatility finally arrives.',
  },
  {
    name: 'Sun Aspecting Ascendant (ASC)',
    description: "You'll feel a massive boost in trading confidence and vitality, making it a great time to start a new fund or make a strong entry into a new token. Be mindful of balancing aggressive leverage with risk management to maintain harmony in your portfolio.",
  },
  {
    name: 'Mercury Aspecting Ascendant (ASC)',
    description: "You'll feel a strong urge to communicate your alpha and share trading setups, making it a productive time for networking with other speculators. Stay focused to avoid scattering your capital across too many shitcoins, and consider how your rapid decisions affect your overall strategy.",
  },
  {
    name: 'Venus aspect Mercury in 8th house',
    description: 'It is time to express your financial intuition concerning your highest-risk investments. Maybe securing profits for a luxury weekend getaway is the plan. Deep feelings of success in your trades bring a sense of contentment, even if it is romanticizing about the massive gains of the past bull market.',
  },
  {
    name: 'Venus aspect Mars in 8th house',
    description: 'You are awakened to the aggressive thrill of the gamble, use this power to attract calculated wealth and not reckless liquidation. Your charismatic powers of reading the market can be a bit dangerous as you must be careful not to over-leverage. Be intensely aware of your risk-to-reward and keep an eye on trading fees.',
  },
  {
    name: 'Mars aspect Venus in 8th house',
    description: 'The thrill of the speculative gamble awakens your aggressive trading style. Use this drive to accumulate wealth, not to chase green candles recklessly. Your appetite for high-risk assets is dangerous; you must be careful which volatile coins you buy. Closely monitor your margin and keep an eye on liquidation levels.',
  },
  {
    name: 'Venus Transits the 3rd House',
    description: 'Creative technical analysis develops a new profitable trading strategy. Writing a bot or script to automate this energy puts it to good use. Taking profits to beautify your trading desk brings cheerfulness. Interest in gaming or metaverse tokens will give the portfolio a new edge. A short break from the charts gives a sense of peace. Happy news regarding a token listing brings comfort.',
  },
  {
    name: 'Mercury Transits the 2nd House',
    description: 'Calculating your portfolio balance gives a clear perspective on what leverage can be afforded and where the capital should be allocated. This is a good time to discuss profit-taking expectations. Spending money on premium trading tools, data feeds, or charting software seems appropriate now. Look for undervalued dips, as buying the fear will bring big savings and future gains.',
  },
  {
    name: 'Sun Transits the 2nd House',
    description: 'Capital and wealth accumulation are a focus and may face unexpected resistance from market makers. There may be some unexpected drawdowns this month with the urge to revenge trade. A sudden change in regulatory policy may create a financial drain. Pay attention to your risk management habits; overexposure can cause severe portfolio health issues.',
  },
  {
    name: 'Mercury Transits the 1st House',
    description: 'Rapid execution and a more active trading nature are part of the need to capitalize on fast market movements. Speculation takes on an air of fun and adventure. New alpha comes that can activate the desire to long the market. It is time to learn a new technical indicator or study derivatives. The newer, volatile crypto markets give inspiration to view finance from a fresh approach.',
  },
  {
    name: 'Mars Transits the 1st House',
    description: 'Courage and aggressive energy give the ambition to take on high-risk speculative positions formally deemed too volatile. Aggravating price action inspires a forceful approach to scalp the markets. This driving force can yield massive profits that previously seemed insurmountable. A feeling of FOMO with an impulsive nature must be contained and balanced to avoid massive losses during this volatile time.',
  },
  {
    name: 'Mars aspect Ketu in 3rd house',
    description: 'Long-standing issues with a trading platform need to be addressed now. An unexpected sudden crash comes as a surprise, as support levels may not hold as planned. Your usual aggressive trading drive comes to a halt as a massive liquidation takes a toll on your psychology. Be careful with high leverage and margin trading as you are prone to wipeouts.',
  },
  {
    name: 'Mercury aspect Venus in 8th house',
    description: 'It is time to execute trades based on your deepest analytical research into hidden, high-potential assets. Maybe cashing out for a luxury purchase is the plan. Securing profits brings a sense of contentment, even if you are just analyzing the historic charts of past massive runners.',
  },
  {
    name: 'Sun aspect Venus in 8th house',
    description: "The desire for massive wealth and the thrill of the trade can be all-consuming; don't be overly compulsive or addicted to the charts. Memories of old missed 100x gains may enter your mind; find ways to let go and look for the next rotation. Clinging to past cycles paralyzes and prevents you from experiencing new lucrative market trends.",
  },
  {
    name: 'Mercury aspect Mercury in 8th house',
    description: 'Deep diving into tokenomics, smart contract audits, or on-chain data consumes your time today. Finding the specific wallet of a whale is overwhelming but highly rewarding. Be aware your intuitive reads on the data are really all you need to direct you to the perfect entry point for sudden gains.',
  },
  {
    name: 'Venus aspect Sun in 9th house',
    description: 'Taking profits allows travel plans to an exotic beautiful place. Your love of market philosophy opens many doors; opportunities to join exclusive mastermind trading groups come in a message today. Influential institutional figures inspire a trading lesson you will never forget.',
  },
  {
    name: 'Mars Aspecting Ascendant (ASC)',
    description: "You'll feel a massive surge of aggressive trading energy, making it a great time for bold, highly leveraged entries. Be extremely cautious of acting impulsively out of FOMO, as this could lead to sudden liquidations or burnout from watching the 1-minute charts.",
  },
  {
    name: 'Venus aspect Rahu in 9th house',
    description: 'Rahu brings immense luck in speculation! It is time to take profits and enjoy a luxurious vacation. Your relationship with institutional trends is important now; the market has a special massive windfall for you. You are learning how to ride the extreme volatility of crypto to project immense wealth. Regulatory legal matters will finalize with a positive outcome for your bags.',
  },
  {
    name: 'Venus aspect Ketu in 3rd house',
    description: 'Disconnect from the noise and study obscure, contrarian trading methods to expand your edge. This is where you can find alpha that will reconnect you with massive gains. Chance discoveries of micro-cap gems open your portfolio to sudden wealth. Spontaneous swing trades can lead to jackpot profits. Previous winning strategies spark that old flame of success.',
  },
  {
    name: 'Mercury aspect Mars in 8th house',
    description: "Investigative on-chain research finds hidden whale movements not normally seen by retail. Now is the time your mind is fully active to exploit these inefficiencies. Sometimes you can go on a tangent with deep fundamental analysis, just don't let it waste valuable time that can take you away from executing the trade. Your inner intuition for volatility will direct you at this time.",
  },
  {
    name: 'Mercury Transits the 3rd House',
    description: 'Writing a trading plan or setting limit orders will be of great value for the upcoming volatility. It is a good time to begin tracking your portfolio performance meticulously. Learning new technical indicators comes easy, and new speculative setups are spotted spontaneously. A short-term swing trade will be highly prosperous. Good news regarding a token you hold will arrive. It is time to upgrade your trading setup with new monitors or computers.',
  },
  {
    name: 'Mars aspect Mercury in 8th house',
    description: "Aggressive investigative research uncovers market manipulation or insider trading signals. Now is the time your analytical mind is fully active to capitalize on these sudden movements. Sometimes you can get lost in the complex data, just don't let it paralyze your execution. Your inner voice will direct you to pull the trigger on a massive, volatile trade at this time.",
  },
  {
    name: 'Jupiter Transits the 4th House',
    description: 'It is a fantastic time to secure your speculative gains by expanding assets into physical real estate. There is a desire to rotate profits from high-risk crypto into a new home or tangible land. Renovating the current portfolio to include more stable, dividend-yielding assets is the answer. This is the best time to take profits to buy a new car. Securing hardware wallets gives protection. Day trading from home is incredibly easy and profitable.',
  },
  {
    name: 'Jupiter aspect Venus in 8th house',
    description: 'Massive, sudden wealth will come through highly speculative, volatile markets at this time. This may manifest through massive airdrops, extreme crypto pumps, or leveraging other people\'s money. The investments you make now are wildly successful financially. Debts and margin loans are paid back, giving total financial freedom and windfall gains.',
  },
  {
    name: 'Sun aspect Mercury in 8th house',
    description: 'Your thoughts take you into a deep place to understand the complex tokenomics and hidden aspects of the markets. There is a questioning of why certain assets pump while others dump. This inner search leads you to master the psychology of market cycles and algorithmic trading.',
  },
  {
    name: 'Mercury aspect Sun in 9th house',
    description: 'Reading or listening to the macro-economic data opens your mind to global market shifts. You understand the profound technical trends that govern the long-term charts. This knowledge grants you the insight needed to position your speculative bets perfectly ahead of the crowd.'
  }
];

const insert = db.prepare('INSERT OR IGNORE INTO events (name, description) VALUES (?, ?)');

const seedAll = db.transaction(() => {
  let inserted = 0;
  let skipped = 0;
  for (const event of events) {
    const result = insert.run(event.name, event.description);
    if (result.changes > 0) inserted++;
    else skipped++;
  }
  return { inserted, skipped };
});

const { inserted, skipped } = seedAll();
console.log(`Seeding complete: ${inserted} inserted, ${skipped} already existed.`);