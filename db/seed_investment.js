const db = require('./investment');

const events = [
  {
    name: 'Moon Transits the 8th House',
    description: "Chandra's transit through the Randhra Bhava indicates extreme emotional volatility in the markets. Avoid short-term speculative day-trading as sudden, unpredictable market swings can trigger panic selling. Favorable for researching hidden assets or long-term deep-value accumulations.",
  },
  {
    name: 'Moon aspect Venus in 8th house',
    description: 'A highly magnetic Dhana Yoga alignment for hidden wealth. This aspect draws unexpected financial windfalls, often through dividends, settlements, or institutional money. Excellent for investing in luxury commodities, cosmetics, or female-driven market sectors.',
  },
  {
    name: 'Venus ruler of the 2nd House in the 8th House',
    description: "The Dhana Karaka in the 8th Bhava creates a Vipareeta-like wealth effect. Sudden gains emerge through other people's money, inheritances, or institutional investments. Highly favorable for utilizing leverage or entering long-term value positions during market crashes.",
  },
  {
    name: 'Venus ruler of the 7th House in the 8th house',
    description: 'Counterparty risks are exceptionally high. Avoid entering new joint ventures or heavily leveraged partnerships. The market may experience sudden liquidations due to institutional betrayals or hidden agendas. Focus on capital preservation rather than speculation.',
  },
  {
    name: 'Moon aspect Mercury in 8th house',
    description: 'Chandra and Budha interacting in the 8th house grants profound analytical depth for algorithmic and quantitative trading. Your intuition is perfectly aligned with complex data. Highly auspicious for uncovering hidden market trends and executing data-driven arbitrage.',
  },
  {
    name: 'Mercury ruler of the 3rd House in the 8th House',
    description: 'The lord of trading and courage (3rd) entering the house of sudden changes (8th) warns against impulsive short-term trades. Algorithmic patterns may fail. Step back from the trading desk to research underlying market fundamentals and long-term macro trends.',
  },
  {
    name: 'Mercury ruler of the 6th House in the 8th House',
    description: 'This forms a powerful Vipareeta Raja Yoga (Harsha Yoga), indicating massive financial gains arising from market panic, bankruptcies, or sector crashes. Speculative luck is incredibly high for short-selling, distressed asset investing, and profiting from corporate restructuring.',
  },
  {
    name: 'Moon aspect Mars in 8th house',
    description: 'A volatile Chandra-Mangala Yoga in the house of crisis. Emotional trading will lead to severe capital destruction. Sublimate this aggressive energy into strict risk management. Beware of sudden stop-hunts and market manipulations designed to liquidate retail traders.',
  },
  {
    name: 'Mars ruler of the 1st House in the 8th House',
    description: 'Lagnesh in the 8th signifies that your financial edge comes from surviving extreme bear markets and market capitulations. Fortune favors the ultimate contrarian today. Buy when there is blood in the streets, but avoid using high leverage.',
  },
  {
    name: 'Mars ruler of the 8th House in the 8th House',
    description: 'Mangal forms Sarala Yoga in its own house, providing an ironclad shield over your assets during systemic market crashes. You possess a unique detective instinct to track whale wallets and hidden institutional order flow, leading to highly lucrative speculative entries.',
  },
  {
    name: 'Moon Transits the 9th House',
    description: 'Chandra crossing the Dharma and Bhagya Bhava shifts fortune towards long-term, global investments. Institutional backing and favorable regulatory news support your portfolio. A lucky day for investments in foreign markets, travel sectors, and sovereign bonds.',
  },
  {
    name: 'Moon aspect Sun in 9th house',
    description: 'An incredibly auspicious alignment of the luminaries in the house of luck. Institutional investors and government policies are working in your favor. Outstanding speculative luck for blue-chip equities, gold, and large-cap market leaders.',
  },
  {
    name: 'Sun ruler of the 5th House in the 9th House',
    description: 'The ultimate Dhana Yoga. The lord of speculation (5th) in the house of fortune (9th) grants the Midas touch. Purva Punya (past life merit) blesses your portfolio with outsized, explosive growth. Unprecedented luck in stocks, IPOs, and high-growth sectors.',
  },
  {
    name: 'Moon aspect Rahu in 9th house',
    description: 'Rahu casts a shadow of euphoric illusion over long-term investments. Speculative hype in emerging markets or crypto can yield massive, rapid returns, but the foundation is unstable. Trade the FOMO aggressively, but take profits before the bubble bursts.',
  },
  {
    name: 'Moon aspect Ketu in 3rd house',
    description: 'Ketu brings profound detachment to your short-term trading psychology (3rd house). Avoid mainstream financial news and rely solely on esoteric or highly contrarian technical indicators. Intuition overrides logic today, rewarding non-consensus bets.',
  },
  {
    name: 'Moon Transits the 10th House',
    description: 'Chandra in the Karma Bhava links your portfolio\'s performance directly to executive leadership changes and corporate governance. Trade news related to mergers, acquisitions, or CEO departures. Expect high intraday volatility in corporate equities.',
  },
  {
    name: 'Sun Transits the 12th House',
    description: 'Surya in the Vyaya Bhava indicates capital outflow and hidden expenses. The ego is disconnected from the market pulse. Halt all aggressive speculation and highly leveraged positions. Protect your capital or allocate to foreign exchange (Forex) and multinational defensives.',
  },
  {
    name: 'Moon aspect Saturn in 10th house',
    description: 'Saturn restricts market euphoria, leading to slow, grinding, sideways price action. Speculative luck is low; focus on dividend-yielding stocks, bonds, and infrastructure plays. Patience and capital preservation are your greatest assets today.',
  },
  {
    name: 'Saturn ruler of the 10th House in the 10th House',
    description: 'Shani forms a powerful Sasha Mahapurusha Yoga. Wealth is built through relentless consistency and institutional dominance. Forget quick speculation; massive, generational wealth is achieved through accumulating undervalued, foundational industry leaders.',
  },
  {
    name: 'Saturn ruler of the 11th House in the 10th House',
    description: 'The Labha lord (gains) in the house of profession guarantees that disciplined trading strategies lead to massive profitability. Networking with market makers or institutional whales provides the ultimate edge. Your long-term holdings will mature beautifully.',
  },
  {
    name: 'Moon Transits the 11th House',
    description: 'Chandra\'s transit through the Labha Bhava is highly auspicious for realizing gains. Market sentiment is retail-driven and optimistic. An ideal window to take profits on swing trades, secure your liquidity, and capitalize on widespread market euphoria.',
  },
  {
    name: 'Moon aspect Jupiter in 5th house',
    description: 'A phenomenal Gajakesari-type influence over the house of speculation. Your intuition regarding market expansion is perfectly tuned. Exceptional luck for opening new stock positions, investing in high-growth tech, and trusting your gut for calculated risks.',
  },
  {
    name: 'Jupiter ruler of the 9th House in the 5th House',
    description: 'A spectacular Maha Bhagya combination. The lord of luck sits in the house of speculation, granting divine protection and massive compounding returns. Long-term investments in banking, education, and large-cap growth stocks are exceptionally favored.',
  },
  {
    name: 'Jupiter ruler of the 12th House in the 5th House',
    description: 'The lord of foreign lands and loss in the house of speculation requires caution against over-leveraging. However, this is a highly profitable placement for investing in foreign markets, healthcare innovations, or hidden, undervalued tech startups.',
  },
  {
    name: 'Moon Transits the 12th House',
    description: 'The mind dwells on the Vyaya Bhava (losses). This is not a day for impulsive speculation or watching the ticker. Institutional money is leaving the market. Step back, set tight stop-losses, cut losing positions, and prioritize liquidity preservation.',
  },
  {
    name: 'Mars aspect Jupiter in 5th house',
    description: 'Mars injects aggressive, risk-on energy into Jupiter’s expansive nature. A highly potent time for bold, confident trades. Real estate investment trusts (REITs), tech sector breakouts, and aggressive growth portfolios show strong, bullish momentum.',
  },
  {
    name: 'Sun in 9th (Dispositor)',
    description: 'With the Sun empowering the house of luck, institutional backing and regulatory clarity heavily favor your long-term holdings. Align your portfolio with government initiatives, precious metals, or sovereign bonds for highly secure growth.',
  },
  {
    name: 'Moon aspect Moon in 6th house',
    description: 'Emotional fluctuations mirror the volatility of the 6th house of debts and obstacles. A day to manage risk strictly, set tight stop-losses, and focus on mitigating portfolio drawdowns rather than chasing new alpha or leveraging up.',
  },
  {
    name: 'Moon ruler of the 4th House in the 6th House',
    description: 'The lord of assets (4th) in the house of debt (6th) warns of potential liquidity crunches or depreciation in real estate holdings. Use this period to restructure loans, pay down margin debt, or invest in defensive, recession-proof sectors.',
  },
  {
    name: 'Moon Transits the 1st House',
    description: 'Chandra crossing the Lagna brings your personal financial intuition to its absolute peak. You are highly attuned to subtle shifts in market sentiment today. Excellent timing to initiate new investment strategies or actively rebalance your portfolio.',
  },
  {
    name: 'Moon Transits the 2nd House',
    description: 'The Moon in the Dhana Bhava brings fluctuations to your liquid net worth. Daily P&L may swing widely based on retail sentiment. Avoid locking up capital in illiquid assets today; keep cash reserves handy to buy upcoming market dips.',
  },
  {
    name: 'Venus aspect Moon in 6th house',
    description: 'Venus softening the 6th house brings lucrative opportunities to profit from distressed assets, debt purchasing, or the healthcare and wellness sectors. Minor speculative gains can beautifully offset recent portfolio losses if traded conservatively.',
  },
  {
    name: 'Mercury in 8th (Dispositor)',
    description: 'An incredible placement for deep-dive fundamental analysis and quantitative backtesting. You can uncover market inefficiencies, hidden institutional order blocks, and lucrative tax advantages that the broader market has completely missed.',
  },
  {
    name: 'Moon Transits the 3rd House',
    description: 'The 3rd house rules short-term trades, courage, and momentum. The market is fast and narrative-driven today. Agility is key—swing trading and taking quick scalps based on breaking news or social media sentiment will be highly profitable.',
  },
  {
    name: 'Venus Transits the 1st House',
    description: 'Venus on the Ascendant attracts wealth and favorable market conditions effortlessly. Your trading psychology is confident and relaxed. A highly auspicious period for pitching to investors, securing funding, or seeing your luxury investments appreciate.',
  },
  {
    name: 'Moon Transits the 4th House',
    description: 'Focus shifts to foundational assets—real estate, land, and hard commodities. Emotional need for security means it is a good day to buy stable, dividend-yielding equities or add to your long-term, risk-free holdings.',
  },
  {
    name: 'Mars aspect Moon in 6th house',
    description: 'Aggressive energy meets emotional obstacles. Market bears are in control, and sudden liquidations or algorithmic stop-hunts are highly probable. Protect your downside, stay out of heavily leveraged long positions, and keep dry powder ready.',
  },
  {
    name: 'Uranus conjunct Venus',
    description: 'A sudden, explosive black swan event to the upside for your portfolio. Cryptocurrencies, volatile tech stocks, or sudden market gaps can deliver massive overnight wealth. Ride the wave, but set trailing stops to secure this flash-luck.',
  },
  {
    name: 'Mars in 8th (Dispositor)',
    description: 'Strategic destruction of old portfolio strategies. You have the aggressive insight needed to cut heavy bags and reallocate capital into highly speculative, volatile assets that are currently in prime Wyckoff accumulation phases.',
  },
  {
    name: 'Moon Transits the 5th House',
    description: 'Chandra entering the house of speculation heavily activates your trading instinct. Retail euphoria is palpable. Trust your chart reads today, as your intuitive grasp of volume and momentum is peaking. Excellent for opening new equity or crypto positions.',
  },
  {
    name: 'Mars Transits the 12th House',
    description: 'Mangal in the house of loss warns of reckless capital destruction. Beware of hidden fees, margin calls, or sudden institutional dumps. Strictly avoid impulsive, revenge trading today; it is a time for capital preservation and strict risk management.',
  },
  {
    name: 'Mercury aspect Jupiter in 5th house',
    description: 'An incredible alignment for financial acumen. Mercury (data) and Jupiter (wealth) in the speculative house means technical analysis and fundamental growth perfectly align. Exceptional luck in trading tech stocks, utilizing new trading algorithms, or expanding your portfolio.',
  },
  {
    name: 'Sun aspect Moon in 6th house',
    description: 'Illumination of underlying market weaknesses. The Sun reveals the bad debt or struggling sectors of the market. Good time to short overvalued companies or invest heavily in defensive, recession-proof sectors like utilities and healthcare.',
  },
  {
    name: 'Sun Transits the 1st House',
    description: 'The Sun illuminates your Lagna, granting tremendous financial confidence and clarity. You possess a commanding presence in negotiations. A highly favorable time to execute large trades, lead investment syndicates, or restructure your core holdings for maximum authority.',
  },
  {
    name: 'Mercury Transits the 12th House',
    description: 'Commerce moves to the house of dissolution. Market data may be confusing, delayed, or manipulated by foreign entities. Avoid day-trading. Use this transit to audit your past trading journals and refine your quantitative edge in isolation.',
  },
  {
    name: 'Ketu aspect Sun in the 9th house',
    description: 'A sudden eclipse of luck or institutional support. Government regulations may unexpectedly hit your long-term holdings. This signature demands detachment; take profits on traditional blue-chip stocks and pivot towards decentralized or deeply contrarian assets.',
  },
  {
    name: 'Venus Aspecting Ascendant (ASC)',
    description: 'Wealth and favorable market conditions naturally gravitate toward you. Your trading psychology is calm and balanced, preventing impulsive errors. Favorable for realizing profits and upgrading your trading environment or personal assets.',
  },
  {
    name: 'Jupiter in 5th (Dispositor)',
    description: 'The ultimate placement for the retail investor. Jupiter expands your speculative luck, granting deep wisdom in reading market cycles. Compounding returns, successful dividend reinvestment, and major portfolio all-time highs are highly probable.',
  },
  {
    name: 'Moon Transits the 6th House',
    description: 'Emotional focus shifts to portfolio management and damage control. The market feels heavy and bearish. Use this day to organize your spreadsheets, pay down margin debt, or analyze technical charts for upcoming support levels.',
  },
  {
    name: 'Moon Transits the 7th House',
    description: 'Market sentiment is highly reactive to macroeconomic news and counterparty actions. Expect choppy, sideways price action as buyers and sellers battle for dominance. Not an ideal day for breakout trading; stick to mean-reversion strategies.',
  },
  {
    name: 'Saturn aspect Sun in 9th house',
    description: 'Institutional heavyweights cap market growth. A strong resistance level is hit in the broader market. Expect bearish pressure on blue-chip stocks. Wealth accumulation requires immense patience, dollar-cost averaging, and focusing on long-term value over quick speculation.',
  },
  {
    name: 'Venus Transits the 2nd House',
    description: 'Venus in its own house of wealth signifies a highly prosperous phase. Cash flow increases, and investments in art, cosmetics, or luxury brands yield excellent returns. It is an optimal time to lock in profits and enjoy the material fruits of your trading.',
  },
  {
    name: 'Venus aspect Venus in 8th house',
    description: 'A profound activation of hidden wealth. Sudden inflows of capital from external sources—such as venture capital, tax returns, or unexpected dividends—boost your portfolio. A great alignment for identifying deeply undervalued assets ready for a massive revaluation.',
  },
  {
    name: 'Sun Aspecting Ascendant (ASC)',
    description: 'Your financial vision is clear and authoritative. You can easily spot macroeconomic trends before the retail herd. A powerful day to execute confident trades and restructure your portfolio towards institutional-grade assets.',
  },
  {
    name: 'Mercury Aspecting Ascendant (ASC)',
    description: 'Your mind is sharp, making technical analysis and reading Level 2 order books highly effective today. Algorithmic and high-frequency trading concepts come easily. Excellent for swift, data-driven scalps in the market.',
  },
  {
    name: 'Venus aspect Mercury in 8th house',
    description: 'The blending of commerce (Mercury) and wealth (Venus) in the 8th house indicates lucrative opportunities in hidden or complex financial instruments. Options trading, derivatives, and deeply researched altcoins hold significant speculative promise now.',
  },
  {
    name: 'Venus aspect Mars in 8th house',
    description: 'High-risk, high-reward energy dominates. The desire to go all-in on heavily leveraged speculative bets is intensely strong. Fortunes can be made rapidly in volatile sectors, but strict stop-losses are mandatory to prevent equally rapid liquidations.',
  },
  {
    name: 'Mars aspect Venus in 8th house',
    description: 'Similar to Venus-Mars, this aggressive pursuit of hidden wealth can lead to immense speculative payouts. Capitalize on volatile market crashes to buy undervalued assets aggressively, but guard against greedy over-leveraging.',
  },
  {
    name: 'Venus Transits the 3rd House',
    description: 'Favorable for short-term swing trading, particularly in the tech, communications, or entertainment sectors. Your trading execution is smooth, and profits can be easily skimmed from minor daily market fluctuations.',
  },
  {
    name: 'Mercury Transits the 2nd House',
    description: 'A transit highly conducive to calculating compound interest, balancing the portfolio, and logical risk assessment. Investments in e-commerce, software, and communication networks will show steady, predictable gains.',
  },
  {
    name: 'Sun Transits the 2nd House',
    description: 'The ego becomes heavily attached to net worth. While you may attract large sums of capital or institutional backing, there is a risk of burning through cash due to arrogant trading decisions. Focus on gold and sovereign assets.',
  },
  {
    name: 'Mercury Transits the 1st House',
    description: 'Your analytical skills are at the forefront. A superb day for chart reading, recognizing complex technical patterns like Wyckoff accumulations, and executing rapid trades based on breaking fundamental news.',
  },
  {
    name: 'Mars Transits the 1st House',
    description: 'High risk appetite and aggressive trading posture. You are willing to step in and buy breakouts when others are fearful. Harness this competitive drive, but strictly avoid impulsive market orders that succumb to slippage.',
  },
  {
    name: 'Mars aspect Ketu in 3rd house',
    description: 'Sudden, unpredictable volatility in short-term momentum. Technical charts may experience fake-outs or sudden trend reversals. Step away from day trading to avoid algorithmic stop-hunts; intuition overrides logic today.',
  },
  {
    name: 'Mercury aspect Venus in 8th house',
    description: 'Favorable for deeply analyzing the fundamentals of luxury, art, or decentralized finance (DeFi) assets. Hidden market inefficiencies can be capitalized upon through meticulous research and smart contract analysis.',
  },
  {
    name: 'Sun aspect Venus in 8th house',
    description: 'Government or institutional money illuminates hidden value. A great time to spot assets that are about to experience a massive influx of corporate capital. Guard against holding onto dead investments purely out of ego.',
  },
  {
    name: 'Mercury aspect Mercury in 8th house',
    description: 'Hyper-focus on deep market research. You can uncover hidden divergences in indicators like RSI or MACD. An excellent period to backtest complex algorithmic trading strategies to find the ultimate edge.',
  },
  {
    name: 'Venus aspect Sun in 9th house',
    description: 'A beautiful alignment of wealth and fortune. Highly auspicious for securing institutional funding, seeing massive gains in blue-chip equities, or reaping the rewards of long-held investments. Luck is firmly on your side.',
  },
  {
    name: 'Mars Aspecting Ascendant (ASC)',
    description: 'A highly competitive day in the markets. You have the courage to buy deep dips and short parabolic tops. Utilize this aggressive energy to conquer market fear, but maintain strict positional sizing.',
  },
  {
    name: 'Venus aspect Rahu in 9th house',
    description: 'Massive, sudden expansion in wealth through foreign or highly speculative investments. Cryptocurrencies and disruptive tech stocks can see parabolic, euphoric runs. Ride the wave of global FOMO, but have a clear exit strategy before the bubble bursts.',
  },
  {
    name: 'Venus aspect Ketu in 3rd house',
    description: 'Disinterest in traditional wealth building. You may feel compelled to cash out of long-standing positions or trade in highly esoteric, non-correlated assets. Trust your contrarian instincts regarding market tops.',
  },
  {
    name: 'Mercury aspect Mars in 8th house',
    description: 'Analytical aggression. A powerful transit for spotting market manipulation, spoofing, or hidden sell walls. You have the mental sharpness to execute complex arbitrage opportunities or profit heavily during periods of extreme market fear.',
  },
  {
    name: 'Mercury Transits the 3rd House',
    description: 'Optimal conditions for day trading and scalping. The market respects technical patterns like VWAP and moving averages perfectly today. Fast, logical execution and momentum trading in tech stocks will yield consistent profits.',
  },
  {
    name: 'Mars aspect Mercury in 8th house',
    description: 'Swift execution based on deep data. You can outmaneuver the retail crowd during flash crashes. A great time to aggressively accumulate undervalued assets based on underlying fundamental metrics that others are ignoring.',
  },
  {
    name: 'Jupiter Transits the 4th House',
    description: 'Major portfolio expansion through foundational, hard assets. Real estate, REITs, agricultural stocks, and core blue-chip holdings experience steady, protected growth. A highly favorable time to lock in long-term generational wealth.',
  },
  {
    name: 'Jupiter aspect Venus in 8th house',
    description: 'A massive influx of wealth via hidden or institutional channels. Venture capital funding, massive tax returns, or the sudden realization of value in deeply speculative assets. Your portfolio experiences a significant wealth effect expansion.',
  },
  {
    name: 'Sun aspect Mercury in 8th house',
    description: 'Institutional illumination of hidden market data. A good time to analyze SEC filings, earnings reports, or on-chain data for cryptos. You can confidently trade the news, anticipating how large funds will move their capital.',
  },
  {
    name: 'Mercury aspect Sun in 9th house',
    description: 'A perfect alignment of data and luck. Your trading thesis aligns flawlessly with broader macroeconomic trends and government policies. A highly profitable day to hold long positions in fundamentally strong companies.',
  },
  {
    name: 'Mercury aspect Ketu in 3rd house',
    description: 'Breakdown of technical indicators. Traditional charting methods will fail as algorithmic noise causes chop. Step away from the screens; luck is found in doing nothing and protecting capital from erratic, directionless market chop.',
  },
  {
    name: 'Mercury aspect Rahu in 9th house',
    description: 'The mind locks onto massive, euphoric growth narratives. Highly favorable for trading breakout momentum in disruptive technologies like AI or crypto, but be intensely aware of algorithmic manipulation and false narratives driving the hype.',
  },
  {
    name: 'Venus Transits the 4th House',
    description: 'Financial security is paramount. Your portfolio enjoys smooth, steady appreciation, particularly in real estate, home builders, or dividend aristocrats. A great time to take profits and invest in tangible, luxury assets that improve your quality of life.',
  },
  {
    name: 'Sun aspect Mars in 8th house',
    description: 'Institutional dumping causes sudden market crashes. The Sun (government/whales) aggressively impacts the 8th house of hidden things. Prepare for extreme volatility. Capitalize by buying the deep fear and blood in the markets.',
  },
  {
    name: 'Venus Aspecting Midheaven (MC)',
    description: 'Your financial reputation peaks. An excellent transit for networking with high-net-worth individuals, securing funding, or seeing your public investments heavily rewarded by institutional buyers.',
  },
  {
    name: 'Saturn in 10th (Dispositor)',
    description: 'The heavy burden of long-term investing. The market may be in a prolonged consolidation or bear phase. Wealth is generated through supreme patience, dollar-cost averaging into blue-chips, and ignoring the lack of short-term dopamine hits.',
  },
  {
    name: 'Jupiter Aspecting Midheaven (MC)',
    description: 'Massive expansion of professional wealth. Your public portfolio and career trajectory hit a parabolic growth phase. Institutional money heavily backs your sectors. Time to take calculated, large-scale speculative leaps.',
  },
  {
    name: 'Sun Transits the 3rd House',
    description: 'Empowered short-term trading. Your confidence in executing swing trades and momentum plays is high. You can successfully ride the coat-tails of institutional volume spikes to secure quick, profitable scalps.',
  },
  {
    name: 'Mars aspect Mars in 8th house',
    description: 'Double activation of high-risk volatility. A period of intense market stress, short-squeezes, and liquidations. Unprecedented gains are possible if you have the nerves of steel to trade the extremes, but the risk of total ruin is equally high.',
  },
  {
    name: 'Venus aspect Saturn in 10th house',
    description: 'Wealth accumulation is slow, steady, and secure. A favorable transit for investing in bonds, dividend ETFs, and legacy infrastructure companies. Avoid get-rich-quick schemes; compound interest is your strongest ally here.',
  },
  {
    name: 'Sun Transits the 12th House',
    description: 'Institutional capital rotates out of the market. Expect market pullbacks and capital outflows. A crucial period to secure profits, hold cash, and avoid initiating large, new speculative positions until the Sun transits the Lagna.',
  },
  {
    name: 'Mercury aspects the Moon in the 6th house',
    description: 'Logical analysis of a bearish or struggling market. You can objectively assess your portfolio\'s weaknesses and strategically cut losses. A good day to rebalance and shift capital to defensive sectors.',
  },
  {
    name: 'Sun Transits the 2nd House',
    description: 'Capital preservation is tested. While your net worth is illuminated, ego-driven financial decisions or unexpected tax liabilities can drain liquidity. Stick to strict budgeting and avoid showing off recent trading profits.',
  },
  {
    name: 'Sun Transits the 3rd House',
    description: 'Government or institutional news heavily impacts short-term price action. You have the courage to trade the news effectively. Momentum and breakout trading strategies are highly favored.',
  },
  {
    name: 'Mars Transits the 2nd House',
    description: 'Kuja Dosha on your bank account. Capital is generated quickly through aggressive trades, but lost just as fast due to impulsive risk management. Protect your liquidity and avoid revenge trading to recover minor losses.',
  },
  {
    name: 'Mercury Transits the 4th House',
    description: 'Data and analysis shift toward foundational assets. A highly favorable time to research real estate markets, analyze agricultural commodities, or build long-term trading algorithms in the comfort of your home office.',
  },
  {
    name: 'Pluto conjunct Saturn',
    description: 'A macro-economic regime change. Whales and institutional monopolies (Pluto) force strict austerity and regulation (Saturn). Markets face severe pressure and deleveraging. Cash is king; survival and capital preservation are the only metrics of success during this intense reset.',
  },
  {
    name: 'Sun aspects Sun in 9th house',
    description: 'Maximum illumination of long-term fortune. A phenomenal transit for realizing the success of your long-term investment thesis. Institutional backing is strong. A great day to ride the bullish macro trend without overthinking.',
  },
  {
    name: 'Sun aspect Ketu in the 3rd house',
    description: 'A sudden loss of momentum. Market authorities or institutional sellers unexpectedly crush short-term rallies. Do not try to catch a falling knife. Cash out of swing trades and wait for the dust to settle.',
  },
  {
    name: 'Sun aspect Rahu in 9th house',
    description: 'Massive illusions regarding long-term wealth. The market is driven by euphoric, unsustainable institutional hype. Excellent for riding the parabolic bubble, but you must recognize it is a bubble. Take aggressive profits before the illusion shatters.',
  },
  {
    name: 'Venus Transits the 5th House',
    description: 'The pinnacle of speculative luck. Venus in the house of speculation grants the Midas Touch. Trading feels effortless, and portfolios swell. Growth stocks, entertainment sectors, and crypto investments are highly favored for massive percentage gains.',
  },
  {
    name: 'Mars aspect Sun in 9th house',
    description: 'Aggressive execution aligns with institutional fortune. A fantastic time to act boldly on long-term macro trends. Buying breakouts in leading sectors will yield fast, substantial rewards as big money supports your aggressive entries.',
  },
  {
    name: 'Mars aspect Rahu in 9th house',
    description: 'Reckless speculation fueled by FOMO. Highly dangerous market conditions where sudden, violent price swings liquidate both longs and shorts. Avoid highly leveraged trades in emerging markets or unproven tech, as volatility is completely irrational.',
  },
  {
    name: 'Jupiter aspect Saturn in 10th house',
    description: 'The perfect balance of growth (Jupiter) and consolidation (Saturn). Your portfolio experiences steady, secure, and permanent expansion. Value investing, dividend reinvestment, and holding dominant market-leader stocks pay off handsomely.',
  },
  {
    name: 'Sun Transits the 4th House',
    description: 'Institutional focus shifts to real estate, infrastructure, and domestic commodities. Ensure your portfolio\'s foundation is secure. Not a time for risky offshore speculation, but rather solidifying gains into hard, tangible assets.',
  },
  {
    name: 'Sun Aspecting Midheaven (MC)',
    description: 'You are positioned as an authority in the market. Your large, public investments are validated by broader market moves. A highly auspicious time to hold firm on your core portfolio as institutional money drives up your asset values.',
  },
  {
    name: 'Venus aspect Jupiter in 5th house',
    description: 'An immensely powerful Dhana Yoga alignment. The planets of wealth and expansion combine in the house of speculation. Unprecedented luck in trading, investing, and portfolio growth. Capitalize heavily on market opportunities now.',
  },
  {
    name: 'Sun aspect Saturn in 10th house',
    description: 'Government regulation clashes with corporate giants. Expect market stagnation, heavy resistance levels, and bearish pressure on major indices. Stay defensive, accumulate cash, and rely on the slow trickle of dividend income.',
  },
  {
    name: 'Venus Transits the 6th House',
    description: 'Venus softens the blow of market corrections. You can find diamonds in the rough among distressed assets or bankrupt companies. Minor gains can be made shorting overvalued luxury or consumer discretionary stocks.',
  },
  {
    name: 'Mars Transits the 3rd House',
    description: 'The ultimate transit for aggressive day-trading and scalping. Your execution speed and risk tolerance are perfectly calibrated. High success rate in trading momentum breakouts, specifically in the tech, AI, and industrial sectors.',
  },
  {
    name: 'Mars Aspecting Midheaven (MC)',
    description: 'Aggressive moves in your core portfolio. You are willing to challenge market consensus and take massive, contrarian positions. Highly profitable if you manage risk, but beware of trying to fight the broader institutional trend.',
  },
  {
    name: 'Mercury Aspecting Midheaven (MC)',
    description: 'Your technical analysis perfectly aligns with broader market movements. A superb time for algorithmic execution and trading based on earnings reports and corporate data releases. Quick, logical profits are highly favored.',
  },
  {
    name: 'Mercury aspect Saturn in 10th house',
    description: 'Data processing is slowed by market friction. Sideways chop, delayed earnings, or regulatory news stifle momentum. Avoid active day-trading; your algorithms and indicators will face a high failure rate in this constrained environment.',
  },
  {
    name: 'Sun Transits the 5th House',
    description: 'The King enters the house of speculation. Immense confidence in your trading thesis. You can take on large speculative positions, especially in gold, government bonds, or massive blue-chip equities, expecting sovereign-level protection and growth.',
  },
  {
    name: 'Mars aspect Saturn in 10th house',
    description: 'A violent clash between aggression and restriction. Expect massive market volatility, flash crashes, and painful liquidations for the over-leveraged. Capital preservation is critical. Sit on your hands and wait for the carnage to end.',
  },
  {
    name: 'Mercury Transits the 5th House',
    description: 'Analytical brilliance in speculation. Your ability to read technical indicators like VWAP and RSI is flawless today. A highly profitable period for options trading, algorithmic scalping, and predicting short-term market rotations.',
  },
  {
    name: 'Jupiter aspect Mercury in 8th house',
    description: 'Massive expansion of hidden data. An incredible transit for uncovering the next major crypto gem or deeply undervalued stock before the retail crowd finds it. Your fundamental research yields life-changing financial insights.',
  },
  {
    name: 'Venus Transits the 7th House',
    description: 'Favorable conditions for business partnerships and B2B investments. Market harmony means trend-following strategies work beautifully. Profitable to engage in joint ventures or copy-trade successful institutional investors.',
  },
  {
    name: 'Saturn aspect Rahu in 9th house',
    description: 'A harsh reality check for speculative bubbles. Strict regulations or macroeconomic tightening pop the euphoric balloons in crypto and tech. Short the hype, hold cash, and avoid catching the falling knives of shattered illusions.',
  },
  {
    name: 'Mercury Transits the 6th House',
    description: 'Data points toward market debts and weaknesses. A great time to audit your portfolio for underperforming assets and cut them loose. Focus on defensive trading strategies and optimizing your tax harvesting.',
  },
  {
    name: 'Sun aspect Jupiter in the 5th house',
    description: 'One of the most fortunate combinations for wealth. Institutional backing meets massive expansion. A highly auspicious day to go long on major indices, execute massive speculative trades, and watch your portfolio reach new all-time highs.',
  },
  {
    name: 'Sun Transits the 6th House',
    description: 'Illumination of the market\'s underlying rot. A powerful period to profit from short-selling, buying put options on bloated companies, or investing heavily in defensive, anti-fragile sectors like healthcare and basic materials.',
  },
  {
    name: 'Mars Transits the 4th House',
    description: 'Kuja Dosha in the house of assets. High risk of depreciation or sudden expenses regarding real estate holdings. Avoid making large property purchases right now. Protect your foundational portfolio from aggressive, impulsive liquidation.',
  },
  {
    name: 'Mercury Transits the 7th House',
    description: 'Excellent flow of information regarding market consensus. You can read the tape and order book with high accuracy. A great day to execute trades based on clear technical patterns, as the market acts highly logically and respectfully of support/resistance.',
  },
  {
    name: 'Sun Transits the 7th House',
    description: 'Institutional heavyweights dominate the counterparty. The market may feel highly manipulated by whales. Avoid fighting the trend; if the massive index movers are bearish, do not try to catch the bottom. Follow the big money quietly.',
  },
  {
    name: 'Jupiter Transits the 5th House',
    description: 'The absolute zenith of speculative investing. Jupiter in the 5th creates explosive wealth potential. Your intuition for picking multi-bagger stocks, perfectly timing Wyckoff mark-up phases, and compounding wealth is unparalleled. Maximize your exposure to high-growth assets.',
  },
  {
    name: 'Mars Transits the 5th House',
    description: 'High-risk, aggressive speculation. You are prone to massive leverage and all-or-nothing trades. While you can conquer the market with sheer force, you must strictly control FOMO and implement hard stop-losses to avoid devastating liquidations.',
  },
  {
    name: 'Sun Transits the 8th House',
    description: 'The King enters the house of death and rebirth. A period of profound market corrections, systemic crashes, or liquidity crises. Protect your capital at all costs. Exceptional wealth can be made by having dry powder ready to buy the absolute bottom of the fear cycle.',
  },
  {
    name: 'Rahu Transits the 10th House',
    description: 'Massive, unorthodox disruption in the corporate sector. Disruptive tech, AI, and crypto heavily outperform traditional legacy companies. A highly profitable time to invest in visionary, rebellious assets, but be prepared for extreme volatility and eventual regulatory backlash.',
  },
  {
    name: 'Ketu Transits the 4th House',
    description: 'Detachment from traditional assets. Real estate and foundational holdings may stagnate or face mysterious depreciation. Divest from heavy, illiquid assets and maintain a highly liquid, agile portfolio utilizing contrarian trading strategies.',
  },
  {
    name: 'Mercury Transits the 8th House',
    description: 'The ultimate transit for quantitative and on-chain analysis. You can penetrate market illusions to find hidden volume nodes, institutional accumulation, and complex derivatives pricing. Exceptional for building automated trading systems that capitalize on volatility.',
  },
  {
    name: 'Ketu aspect Mars in 8th house',
    description: 'A sudden, bizarre halt to volatility. Market momentum simply dies, leaving traders trapped in sideways chop. Do not force trades. Use this profound analytical energy to audit your past losses and completely restructure your risk-management parameters.',
  },
  {
    name: 'Rahu aspect Moon in the 6th house',
    description: 'Euphoric illusions regarding market recovery. You may be tempted to buy a dead cat bounce or over-leverage to recover debts. Fear and greed are hyper-amplified. Stick strictly to your technical indicators and do not trust the retail FOMO narrative.',
  },
  {
    name: 'Sun Transits the 9th House',
    description: 'Institutional capital flows directly into luck and fortune. A highly bullish macro phase. Long-term investments, index funds, and sovereign assets experience beautiful, unimpeded growth. Let your winners run and avoid micro-managing the portfolio.',
  },
  {
    name: 'Mercury Transits the 9th House',
    description: 'Macro-economic data aligns with a bullish thesis. Favorable for investing in foreign markets, educational tech, and global logistics. Your trading psychology is enlightened and forward-thinking, making long-term forecasting highly accurate.',
  },
  {
    name: 'Venus Transits the 8th House',
    description: 'Hidden wealth flows, but often through stressful restructuring. Profits come from distressed assets, liquidation events, or massive tax returns. Secure your portfolio with puts or insurance, as sudden market drawdowns provide the exact liquidity needed for your next major investment.',
  },
  {
    name: 'Mercury Transits the 10th House',
    description: 'Corporate earnings and institutional data drive the market. Technical analysis works perfectly on large-cap stocks today. A favorable time for executing systematic, algorithmic trades based strictly on volume and moving averages.',
  },
  {
    name: 'Sun Transits the 10th House',
    description: 'Maximum institutional power. The market trend is overwhelmingly strong and backed by major macroeconomic forces. The trend is your friend. Ride the momentum of industry leaders and blue-chip equities; do not try to short a parabolic bull market.',
  },
  {
    name: 'Jupiter aspect Mars in 8th house',
    description: 'Massive expansion of highly leveraged, volatile assets. An incredible opportunity to secure generational wealth through aggressive crypto or options plays, but the volatility is terrifying. Requires nerves of steel and impeccable entry timing on extreme dips.',
  },
  {
    name: 'Moon Aspecting Midheaven (MC)',
    description: 'Retail sentiment heavily influences major market indices today. Expect choppy intraday action as public emotion battles institutional resistance. Trust your gut for short-term swing trades, but avoid altering your long-term thesis.',
  },
  {
    name: 'Mercury Transits the 11th House',
    description: 'Flawless execution leads to realized gains. A perfect transit to take profits, scale out of successful swing trades, and network with other traders to share lucrative alpha. Tech and communication sectors show outsized profitability.',
  },
  {
    name: 'Moon Aspecting Ascendant (ASC)',
    description: 'High intuition regarding market psychology. You can easily read the fear and greed index of the crowd. Use this sensitivity to fade the public—buy when they are terrified, and take profits when they are euphoric.',
  },
  {
    name: 'Venus Transits the 9th House',
    description: 'A harmonious, lucky period for wealth expansion. Long-term investments in international markets, luxury brands, and ESG (Environmental, Social, Governance) companies yield beautiful returns. Fortune favors a graceful, patient holding strategy over frantic day-trading.',
  },
  {
    name: 'Sun Transits the 11th House',
    description: 'The absolute best transit for realizing massive institutional gains. Take profits on your most successful positions. The market is highly bullish, and your portfolio reaches its targets. Network with whales and large funds, as their capital inflow secures your exit liquidity.',
  },
  {
    name: 'Venus Transits the 10th House',
    description: 'Wealth accumulation through corporate dominance. Your portfolio enjoys prestige and solid appreciation. A highly favorable time to invest in companies with strong brand loyalty, aesthetics, and monopolistic consumer appeal. Profits are steady and highly secure.',
  },
  {
    name: 'Jupiter Aspecting Midheaven (MC) : Ends',
    description: '',
  },
  {
    name: 'Jupiter aspect Jupiter in 5th house : Exact',
    description: '',
  },
  {
    name: 'Jupiter aspect Mars in 8th house : Ends',
    description: '',
  },
  {
    name: 'Jupiter aspect Mars in 8th house : Exact',
    description: '',
  },
  {
    name: 'Jupiter aspect Mars in 8th house : Starts',
    description: '',
  },
  {
    name: 'Jupiter aspect Moon in 6th house : Ends',
    description: '',
  },
  {
    name: 'Jupiter aspect Moon in 6th house : Exact',
    description: '',
  },
  {
    name: 'Jupiter aspect Moon in 6th house : Starts',
    description: '',
  },
  {
    name: 'Jupiter aspect Venus in 8th house : Ends',
    description: '',
  },
  {
    name: 'Jupiter aspect Venus in 8th house : Starts',
    description: '',
  },
  {
    name: 'Ketu aspect Mars in 8th house : Exact',
    description: '',
  },
  {
    name: 'Ketu aspect Sun in 9th house : Exact',
    description: '',
  },
  {
    name: 'Mars Aspecting Midheaven (MC) : Ends',
    description: '',
  },
  {
    name: 'Mars Aspecting Midheaven (MC) : Exact',
    description: '',
  },
  {
    name: 'Mars Aspecting Midheaven (MC) : Starts',
    description: '',
  },
  {
    name: 'Mars aspect Mars in 8th house : Exact',
    description: '',
  },
  {
    name: 'Mars aspect Mars in 8th house : Starts',
    description: '',
  },
  {
    name: 'Mars aspect Mercury in 8th house : Ends',
    description: '',
  },
  {
    name: 'Mars aspect Mercury in 8th house : Exact',
    description: '',
  },
  {
    name: 'Mars aspect Mercury in 8th house : Starts',
    description: '',
  },
  {
    name: 'Mars aspect Moon in 6th house : Ends',
    description: '',
  },
  {
    name: 'Mars aspect Moon in 6th house : Exact',
    description: '',
  },
  {
    name: 'Mars aspect Moon in 6th house : Starts',
    description: '',
  },
  {
    name: 'Mars aspect Rahu in 9th house : Ends',
    description: '',
  },
  {
    name: 'Mars aspect Rahu in 9th house : Exact',
    description: '',
  },
  {
    name: 'Mars aspect Rahu in 9th house : Starts',
    description: '',
  },
  {
    name: 'Mars aspect Saturn in 10th house : Ends',
    description: '',
  },
  {
    name: 'Mars aspect Saturn in 10th house : Exact',
    description: '',
  },
  {
    name: 'Mars aspect Saturn in 10th house : Starts',
    description: '',
  },
  {
    name: 'Mars aspect Sun in 9th house : Ends',
    description: '',
  },
  {
    name: 'Mars aspect Sun in 9th house : Exact',
    description: '',
  },
  {
    name: 'Mars aspect Sun in 9th house : Starts',
    description: '',
  },
  {
    name: 'Mars aspect Venus in 8th house : Ends',
    description: '',
  },
  {
    name: 'Mars aspect Venus in 8th house : Exact',
    description: '',
  },
  {
    name: 'Mars aspect Venus in 8th house : Starts',
    description: '',
  },
  {
    name: 'Mercury Aspecting Ascendant (ASC) : Exact',
    description: '',
  },
  {
    name: 'Mercury aspect Jupiter in 5th house : Exact',
    description: '',
  },
  {
    name: 'Mercury aspect Jupiter in 5th house : Starts',
    description: '',
  },
  {
    name: 'Mercury aspect Ketu in 3rd house : Ends',
    description: '',
  },
  {
    name: 'Mercury aspect Ketu in 3rd house : Starts',
    description: '',
  },
  {
    name: 'Mercury aspect Moon in 6th house : Exact',
    description: '',
  },
  {
    name: 'Mercury aspect Moon in 6th house : Starts',
    description: '',
  },
  {
    name: 'Mercury aspect Rahu in 9th house : Ends',
    description: '',
  },
  {
    name: 'Mercury aspect Rahu in 9th house : Starts',
    description: '',
  },
  {
    name: 'Mercury aspect Saturn in 10th house : Starts',
    description: '',
  },
  {
    name: 'Mercury aspect Sun in 9th house : Ends',
    description: '',
  },
  {
    name: 'Mercury aspect Sun in 9th house : Starts',
    description: '',
  },
  {
    name: 'Moon Aspecting Ascendant (ASC) : Exact',
    description: '',
  },
  {
    name: 'Moon Aspecting Midheaven (MC) : Exact',
    description: '',
  },
  {
    name: 'Pluto conjunct Saturn : Ends',
    description: '',
  },
  {
    name: 'Pluto conjunct Saturn : Starts',
    description: '',
  },
  {
    name: 'Rahu aspect Moon in 6th house : Exact',
    description: '',
  },
  {
    name: 'Saturn aspect Rahu in 9th house : Ends',
    description: '',
  },
  {
    name: 'Saturn aspect Rahu in 9th house : Exact',
    description: '',
  },
  {
    name: 'Saturn aspect Rahu in 9th house : Starts',
    description: '',
  },
  {
    name: 'Saturn aspect Sun in 9th house : Ends',
    description: '',
  },
  {
    name: 'Saturn aspect Sun in 9th house : Exact',
    description: '',
  },
  {
    name: 'Saturn aspect Sun in 9th house : Starts',
    description: '',
  },
  {
    name: 'Sun aspect Jupiter in 5th house : Ends',
    description: '',
  },
  {
    name: 'Sun aspect Jupiter in 5th house : Starts',
    description: '',
  },
  {
    name: 'Sun aspect Ketu in 3rd house : Ends',
    description: '',
  },
  {
    name: 'Sun aspect Ketu in 3rd house : Starts',
    description: '',
  },
  {
    name: 'Sun aspect Mars in 8th house : Starts',
    description: '',
  },
  {
    name: 'Sun aspect Mercury in 8th house : Ends',
    description: '',
  },
  {
    name: 'Sun aspect Mercury in 8th house : Starts',
    description: '',
  },
  {
    name: 'Sun aspect Moon in 6th house : Ends',
    description: '',
  },
  {
    name: 'Sun aspect Moon in 6th house : Starts',
    description: '',
  },
  {
    name: 'Sun aspect Rahu in 9th house : Ends',
    description: '',
  },
  {
    name: 'Sun aspect Rahu in 9th house : Starts',
    description: '',
  },
  {
    name: 'Sun aspect Saturn in 10th house : Starts',
    description: '',
  },
  {
    name: 'Sun aspect Sun in 9th house : Exact',
    description: '',
  },
  {
    name: 'Sun aspect Venus in 8th house : Ends',
    description: '',
  },
  {
    name: 'Sun aspect Venus in 8th house : Starts',
    description: '',
  },
  {
    name: 'Uranus aspect Saturn in 10th house : Exact',
    description: '',
  },
  {
    name: 'Venus Aspecting Ascendant (ASC) : Exact',
    description: '',
  },
  {
    name: 'Venus aspect Ketu in 3rd house : Starts',
    description: '',
  },
  {
    name: 'Venus aspect Moon in 6th house : Ends',
    description: '',
  },
  {
    name: 'Venus aspect Moon in 6th house : Exact',
    description: '',
  },
  {
    name: 'Venus aspect Moon in 6th house : Starts',
    description: '',
  },
  {
    name: 'Venus aspect Rahu in 9th house : Starts',
    description: '',
  },
  {
    name: 'Venus aspect Saturn in 10th house : Ends',
    description: '',
  },
  {
    name: 'Venus aspect Saturn in 10th house : Starts',
    description: '',
  },
  {
    name: 'Venus aspect Sun in 9th house : Ends',
    description: '',
  },
  {
    name: 'Venus aspect Sun in 9th house : Starts',
    description: '',
  },
  {
    name: 'Venus ruler of the 7th House in the 8th House',
    description: '',
  },
];

const insert = db.prepare('INSERT INTO events (name, description) VALUES (?, ?) ON CONFLICT(name) DO UPDATE SET description = excluded.description');

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
