const db = require('./loss');

const events = [
  {
    name: 'Moon Transits the 8th House',
    description: "This transit triggers extreme emotional volatility and a fickle mind, making traders prone to selling low due to panic[cite: 48]. As the 8th house governs unexpected changes[cite: 30], this period is ripe for sudden market crashes, algorithmic bear raids, and liquidity traps that result in abrupt portfolio wipeouts.",
  },
  {
    name: 'Moon aspect Venus in 8th house',
    description: "The illusion of market stability is shattered. Speculative investments in luxury or consumer sectors face sudden devaluation. Emotional trading during this aspect often leads retail investors into bull traps set by institutional manipulators, resulting in the rapid erosion of capital and sudden losses.",
  },
  {
    name: 'Venus ruler of the 2nd House in the 8th House',
    description: "A highly destructive placement indicating the depletion of funds[cite: 33]. Accumulated wealth (2nd house) is directly threatened by sudden, unforeseen events[cite: 30]. This signals immense financial ruin through hidden market manipulation, insider trading scandals, or the abrupt bankruptcy of heavily weighted assets.",
  },
  {
    name: 'Venus ruler of the 7th House in the 8th house',
    description: "Public markets and trading partnerships (7th house) become highly deceptive. Indicates severe market manipulation where foreign or hidden entities orchestrate sudden sell-offs. Investors face catastrophic losses due to breached contracts, delisting of stocks, or systemic betrayal by market makers.",
  },
  {
    name: 'Moon aspect Mercury in 8th house',
    description: "A period characterized by poor chart reading and wrong timing [cite: 50] fueled by emotional panic[cite: 48]. Investors fall victim to false news and manipulated earnings reports. Algorithmic trading systems execute erratic, high-frequency dumps, causing sharp intraday market crashes.",
  },
  {
    name: 'Mercury ruler of the 3rd House in the 8th House',
    description: "Communication breakdowns and technical failures in trading platforms lead to sudden, unmanageable losses. This indicates poor speculation ability [cite: 42] where rumors and targeted misinformation campaigns trigger massive panic selling, destroying short-term trades.",
  },
  {
    name: 'Mercury ruler of the 6th House in the 8th House',
    description: "Debt and litigation (6th house) suddenly spiral out of control. This combination turns potentially winning investments into loss-makers[cite: 49]. Margin calls are aggressively enforced by brokers, and sudden regulatory crackdowns cause immediate, heavy losses in the tech and communication sectors.",
  },
  {
    name: 'Moon aspect Mars in 8th house',
    description: "A highly aggressive indicator of sudden market wipeouts. Panic-selling, emotional trading, and erratic decisions [cite: 36] are amplified by aggressive short-selling (Mars). Indicates flash crashes driven by fear and predatory market manipulation.",
  },
  {
    name: 'Mars ruler of the 1st House in the 8th House',
    description: "The investor's core decisions lead directly into financial traps. Impulsive, aggressive market entries are met with sharp, negative reversals in the market[cite: 40]. Reckless leverage and a failure to perceive hidden market manipulation result in total portfolio liquidation.",
  },
  {
    name: 'Mars ruler of the 8th House in the 8th House',
    description: "Concentrated destruction. The 8th house governs unexpected changes[cite: 30], and Mars here indicates violent market volatility. Whales and institutional insiders forcefully crash asset prices to trigger stop-losses, orchestrating a massive wealth transfer away from retail traders.",
  },
  {
    name: 'Moon Transits the 9th House',
    description: "Long-term investments and foreign holdings face sudden instability. Emotional attachment to failing assets causes investors to hold the bag during major sell-offs. Predicts the collapse of international markets spreading fear and contagion into domestic portfolios.",
  },
  {
    name: 'Moon aspect Sun in 9th house',
    description: "Ego-driven wrong decisions [cite: 37] collide with emotional trading[cite: 48]. Government interventions or sudden geopolitical shifts crash long-term market trends. Institutional investors pull liquidity without warning, leaving retail traders stranded in collapsing sectors.",
  },
  {
    name: 'Sun ruler of the 5th House in the 9th House',
    description: "Speculative markets (5th house) are heavily influenced by government or international regulatory actions. A sudden shift in foreign policy, tariffs, or interest rates shatters the illusion of safety, turning long-held speculative investments into massive liabilities.",
  },
  {
    name: 'Moon aspect Rahu in 9th house',
    description: "Extreme illusions govern long-term investments. Known to cause panic-selling, emotional trading, and erratic decisions that lead to losses[cite: 36]. Indicates falling for massive financial scams, offshore Ponzi schemes, or artificially inflated market bubbles that abruptly burst.",
  },
  {
    name: 'Moon aspect Ketu in 3rd house',
    description: "A devastating combination for day traders. Erroneous market data and extreme hesitation lead to missed exits. Ketu causes sharp, negative reversals [cite: 40] in short-term trends, while the Moon triggers panic, resulting in devastating losses through mistimed trades.",
  },
  {
    name: 'Moon Transits the 10th House',
    description: "Volatility strikes the highest echelons of the market. Sudden changes in corporate leadership or government regulatory announcements cause immediate sector-wide crashes. The public perception of the market plummets, triggering widespread institutional offloading.",
  },
  {
    name: 'Sun Transits the 12th House',
    description: "A transit marking severe losses in speculative trading[cite: 32]. The governing authorities (Sun) implement policies that lead to the direct depletion of wealth. Indicates capital flight, foreign market dumps, and the silent erosion of portfolio value through hidden fees and inflation.",
  },
  {
    name: 'Moon aspect Saturn in 10th house',
    description: "A heavy, depressive influence on the market. Saturn brings unpredictable, severe financial setbacks [cite: 45] while the Moon brings panic. Institutional gridlock and severe liquidity crunches lead to prolonged bear markets and the agonizing, slow death of overvalued stocks.",
  },
  {
    name: 'Saturn ruler of the 10th House in the 10th House',
    description: "Regulatory bodies and institutional giants exert oppressive control. While appearing stable, this placement creates immense obstacles and delays[cite: 40]. The market becomes highly illiquid, and retail investors are slowly bled dry by systemic manipulation and lack of upward momentum.",
  },
  {
    name: 'Saturn ruler of the 11th House in the 10th House',
    description: "Expected gains (11th house) are heavily restricted by regulatory forces or institutional blockades. Corporate earnings are artificially manipulated downward, and dividends are suddenly slashed, crushing investor expectations and halting market growth.",
  },
  {
    name: 'Moon Transits the 11th House',
    description: "False hopes regarding gains and liquidity. Herd mentality drives retail investors into over-hyped assets right before a massive dump. Emotional trading [cite: 48] leads to buying the absolute top, followed by a sudden withdrawal of institutional liquidity.",
  },
  {
    name: 'Moon aspect Jupiter in 5th house',
    description: "A classic signature for a market bubble. Over-optimism and extreme greed inflate speculative asset prices (5th house). The fickle mind of the masses [cite: 48] buys into the hype, setting the stage for a sudden, devastating crash when the smart money quietly exits.",
  },
  {
    name: 'Jupiter ruler of the 9th House in the 5th House',
    description: "While traditionally auspicious, in a volatile market this creates a false sense of invincibility. Investors over-leverage based on 'guru' advice or overly optimistic projections, leading to catastrophic wipeouts when underlying systemic flaws are suddenly exposed.",
  },
  {
    name: 'Jupiter ruler of the 12th House in the 5th House',
    description: "The lord of losses (12th house) directly afflicts speculation (5th house), indicating severe losses in speculative trading[cite: 32]. Wealth is squandered on phantom investments and 'too good to be true' schemes, leading to sudden and total bankruptcy.",
  },
  {
    name: 'Moon Transits the 12th House',
    description: "A period of immense psychological distress due to financial ruin. The 12th house indicates severe losses[cite: 32]. Secret manipulation by market makers forces massive liquidations. Investors lose sleep as their funds are depleted in foreign markets or hidden dark pools.",
  },
  {
    name: 'Mars aspect Jupiter in 5th house',
    description: "Aggressive, impulsive speculation fueled by false optimism. This aspect indicates reckless gambling in high-risk derivatives or volatile commodities. Sudden, sharp negative reversals [cite: 40] obliterate the over-leveraged positions, destroying wealth instantly.",
  },
  {
    name: 'Sun in 9th (Dispositor)',
    description: "Severe losses due to ego-driven wrong decisions [cite: 37] tied to macro-economic beliefs. Blind faith in a failing national economy or foreign policy causes investors to hold onto sinking assets until total capital destruction occurs.",
  },
  {
    name: 'Moon aspect Moon in 6th house',
    description: "Extreme market panic driven by debt crises. The 6th house rules debt, and an afflicted Moon causes a fickle mind[cite: 48]. Massive margin calls sweep the market, forcing retail traders to sell at the absolute bottom during a severe liquidity crunch.",
  },
  {
    name: 'Moon ruler of the 4th House in the 6th House',
    description: "A dire indicator for real estate and domestic markets. Asset values plummet due to skyrocketing interest rates or debt defaults. Investors face the threat of repossession and sudden bankruptcy as foundational market stability completely disintegrates.",
  },
  {
    name: 'Moon Transits the 1st House',
    description: "The investor's judgment is clouded by intense emotional volatility[cite: 48]. Prone to panic-selling and erratic decisions, the individual falls victim to sudden market shifts. A high-risk period for executing poorly timed trades that result in immediate, heavy losses.",
  },
  {
    name: 'Moon Transits the 2nd House',
    description: "Accumulated wealth (2nd house) fluctuates wildly. Emotional attachment to money leads to irrational hoarding or sudden panic selling. Indicates extreme vulnerability to sudden market crashes that rapidly deplete personal savings and capital reserves.",
  },
  {
    name: 'Venus aspect Moon in 6th house',
    description: "Deceptive market conditions where debt (6th house) is masked as opportunity. Investors are lured into toxic loans or high-yield traps. A fickle mind [cite: 48] leads to sudden panic when the underlying assets devalue, triggering massive financial distress.",
  },
  {
    name: 'Mercury in 8th (Dispositor)',
    description: "A critical indicator of poor chart reading and wrong timing [cite: 50] colliding with the house of unexpected changes[cite: 30]. Algorithms fail catastrophically. Insider information proves to be a trap, leading to sudden, devastating portfolio crashes.",
  },
  {
    name: 'Moon Transits the 3rd House',
    description: "Erratic trading behavior based on rumors and fake news. High emotional volatility [cite: 48] leads to impulsive day trading. Short-term manipulation by market whales forces retail investors into buying the top and selling the bottom, destroying capital rapidly.",
  },
  {
    name: 'Venus Transits the 1st House',
    description: "A false sense of financial security clouds the investor's judgment. Vanity and greed lead to over-exposure in luxury or tech sectors. This complacency makes the investor highly susceptible to sudden market reversals and unforeseen institutional dumps.",
  },
  {
    name: 'Moon Transits the 4th House',
    description: "Panic strikes domestic markets and real estate. Emotional trading [cite: 48] causes investors to abruptly liquidate foundational assets. Hidden vulnerabilities in the housing sector or domestic economy are exposed, leading to sudden, deep corrections.",
  },
  {
    name: 'Mars aspect Moon in 6th house',
    description: "Violent destruction of capital through debt and margin calls. Sharp, negative reversals in the market [cite: 40] force aggressive liquidations. The fickle mind of the investor [cite: 48] is overwhelmed by sheer panic as portfolios are wiped out by sudden short-seller attacks.",
  },
  {
    name: 'Uranus conjunct Venus',
    description: "The ultimate signature for a flash crash in tech, luxury, or crypto sectors. Unprecedented, sudden volatility destroys asset values in minutes. What appears as a sudden influx of wealth instantly reverses, trapping investors in catastrophic, unpredictable losses.",
  },
  {
    name: 'Mars in 8th (Dispositor)',
    description: "Brutal and abrupt market destruction. The 8th house governs unexpected changes[cite: 30], and Mars ensures these changes are violent. Predicts extreme market manipulation, forced bankruptcies, and sudden regulatory strikes that completely annihilate specific market sectors.",
  },
  {
    name: 'Moon Transits the 5th House',
    description: "Speculative illusions reach their peak. The fickle mind [cite: 48] dives into high-risk trades right before the bubble bursts. Emotional trading leads to devastating losses as market manipulators suddenly pull the rug on hyped, overvalued assets.",
  },
  {
    name: 'Mars Transits the 12th House',
    description: "Severe and aggressive destruction of wealth. Indicates massive losses in speculative trading [cite: 32] driven by hidden enemies—such as predatory hedge funds and institutional short-sellers. Capital is violently drained through offshore accounts or hidden market mechanisms.",
  },
  {
    name: 'Mercury aspect Jupiter in 5th house',
    description: "Over-confidence in technical analysis leads to disaster. Algorithms and 'foolproof' trading systems miscalculate market sentiment, driving massive capital into speculative traps. The subsequent bubble burst results in profound, sudden financial ruin.",
  },
  {
    name: 'Sun aspect Moon in 6th house',
    description: "Ego-driven decisions [cite: 37] clash with emotional panic [cite: 48] amidst rising debt (6th house). Government reports or economic data releases trigger immediate market sell-offs, forcing investors into catastrophic margin liquidations.",
  },
  {
    name: 'Sun Transits the 1st House',
    description: "Over-leverage driven by arrogance. The investor takes on massive risk, blind to underlying market weakness. This ego-driven exposure sets the stage for severe losses [cite: 37] when institutional forces suddenly reverse the market trend.",
  },
  {
    name: 'Mercury Transits the 12th House',
    description: "Total failure of market data and communication. The planet of calculation is lost in the house of expenses, leading to poor chart reading and wrong timing[cite: 50]. Severe losses in speculation [cite: 32] occur due to invisible algorithms and dark pool manipulation.",
  },
  {
    name: 'Ketu aspect Sun in the 9th house',
    description: "A sudden, unexplainable collapse of long-term investments. Ketu brings sharp, negative reversals[cite: 40]. Government bonds, international holdings, and trusted blue-chip stocks mysteriously plummet as institutional support vanishes without a trace.",
  },
  {
    name: 'Venus Aspecting Ascendant (ASC)',
    description: "Greed and the desire for luxury blind the investor to impending danger. An inflated sense of market safety leads to extreme over-exposure. When the sudden reversal hits, the heavily leveraged portfolio is decimated instantly.",
  },
  {
    name: 'Jupiter in 5th (Dispositor)',
    description: "The classic signature of a massive speculative bubble. Extreme overvaluation occurs in the 5th house of trading. When reality sets in, the bubble bursts violently, causing a catastrophic chain reaction of sudden wealth destruction.",
  },
  {
    name: 'Moon Transits the 6th House',
    description: "Panic over debt and litigation. A fickle mind [cite: 48] is overwhelmed as sudden economic downturns trigger massive loan defaults. The market is gripped by fear, leading to aggressive sell-offs and the rapid depletion of investor capital.",
  },
  {
    name: 'Moon Transits the 7th House',
    description: "Betrayal in public markets. Panic-selling [cite: 48] is triggered when market makers or trusted corporate partners suddenly dump their shares. The retail investor is left holding worthless assets as market liquidity abruptly disappears.",
  },
  {
    name: 'Saturn aspect Sun in 9th house',
    description: "A grim period of wealth destruction caused by heavy regulatory crackdowns or geopolitical stagnation. Unpredictable, severe financial setbacks [cite: 45] crush long-term investments as institutional giants actively suppress market growth, enforcing a brutal bear market.",
  },
  {
    name: 'Venus Transits the 2nd House',
    description: "A dangerous illusion of wealth accumulation. The 2nd house of capital appears strong, luring investors into over-leveraged positions. This sets the trap for a sudden, devastating crash that completely wipes out accumulated assets and savings.",
  },
  {
    name: 'Venus aspect Venus in 8th house',
    description: "Absolute destruction of luxury, consumer, or crypto assets. The 8th house governs unexpected changes[cite: 30], and this aspect indicates sudden, massive wealth erosion through hidden financial scandals, corporate bankruptcies, and predatory market manipulation.",
  },
  {
    name: 'Sun Aspecting Ascendant (ASC)',
    description: "Extreme ego leads to catastrophic risk-taking. Investors ignore critical warning signs and double down on failing positions. This arrogance results in severe losses due to ego-driven wrong decisions [cite: 37] when the market violently corrects.",
  },
  {
    name: 'Mercury Aspecting Ascendant (ASC)',
    description: "Information overload leads to fatal trading errors. Poor chart reading and wrong timing [cite: 50] cause investors to buy at the peak and sell at the bottom. Algorithms heavily manipulate the tape, trapping the investor in a cycle of rapid, sudden losses.",
  },
  {
    name: 'Venus aspect Mercury in 8th house',
    description: "Financial data is deliberately manipulated to hide massive corporate losses. The 8th house triggers sudden events[cite: 30], leading to catastrophic stock collapses when cooked books and fraudulent accounting are finally exposed to the public.",
  },
  {
    name: 'Venus aspect Mars in 8th house',
    description: "Violent and sudden destruction of capital. Sharp, negative reversals in the market [cite: 40] are orchestrated by aggressive institutional short-sellers. Greed turns into immediate panic as margin calls force the liquidation of heavily leveraged portfolios.",
  },
  {
    name: 'Mars aspect Venus in 8th house',
    description: "A brutal transfer of wealth from retail to whales. Sudden changes [cite: 30] obliterate speculative investments. Aggressive dumping of assets causes extreme volatility, wiping out those who bought into the false safety of the market peak.",
  },
  {
    name: 'Venus Transits the 3rd House',
    description: "Short-term trading relies on false rumors and manipulative hype. Day traders are lured into pump-and-dump schemes. The sudden withdrawal of liquidity leaves them trapped with worthless assets, resulting in rapid and severe financial losses.",
  },
  {
    name: 'Mercury Transits the 2nd House',
    description: "Algorithmic targeting of accumulated wealth. High-frequency trading systems drain retail capital through microscopic manipulations. Poor calculation [cite: 50] leads investors to mismanage their core funds, resulting in a sudden and irreversible depletion of capital.",
  },
  {
    name: 'Sun Transits the 2nd House',
    description: "Government interventions, sudden tax levies, or inflation destroy the value of accumulated wealth (2nd house). Ego-driven wrong decisions [cite: 37] cause investors to hold onto depreciating assets, leading to a massive, unexpected financial drain.",
  },
  {
    name: 'Mercury Transits the 1st House',
    description: "Over-trading and systemic miscalculation. The investor is highly susceptible to market noise, leading to poor timing[cite: 50]. Constant shifting of positions incurs massive hidden fees and sudden losses as the market chops violently in both directions.",
  },
  {
    name: 'Mars Transits the 1st House',
    description: "Impulsive, aggressive trading behavior leads straight into disaster. Driven by a desire to recover past losses, the investor heavily over-leverages. This recklessness is met with sharp negative reversals[cite: 40], causing an immediate and total portfolio wipeout.",
  },
  {
    name: 'Mars aspect Ketu in 3rd house',
    description: "A sudden, violent disruption in trading execution. Sharp, negative reversals [cite: 40] occur precisely when platforms freeze or algorithms fail. This chaotic combination guarantees massive losses for short-term traders trapped in collapsing positions.",
  },
  {
    name: 'Mercury aspect Venus in 8th house',
    description: "Sophisticated financial fraud is executed flawlessly. The 8th house brings sudden changes [cite: 30] as manipulated earnings reports and fake corporate news trap retail investors. A massive rug-pull completely destroys the value of seemingly secure investments.",
  },
  {
    name: 'Sun aspect Venus in 8th house',
    description: "Ego-driven decisions [cite: 37] blind the investor to massive underlying corruption. Government or regulatory bodies suddenly freeze assets or delist major companies, resulting in the instantaneous destruction of wealth in the blink of an eye.",
  },
  {
    name: 'Mercury aspect Mercury in 8th house',
    description: "A catastrophic failure of technical analysis[cite: 50]. The market behaves completely irrationally, driven by hidden institutional algorithms (8th house). Predictive models fail, causing automated trading systems to execute massive sell-offs at the absolute bottom.",
  },
  {
    name: 'Venus aspect Sun in 9th house',
    description: "Long-term investments in foreign markets or luxury sectors suffer a sudden, devastating collapse. Arrogance and over-confidence in global economic stability lead to extreme losses when geopolitical events trigger an unexpected international market crash.",
  },
  {
    name: 'Mars Aspecting Ascendant (ASC)',
    description: "Reckless ambition causes the investor to ignore risk management entirely. Aggressive entries into highly volatile markets are punished by brutal, sudden corrections. The portfolio is violently liquidated due to forced margin calls.",
  },
  {
    name: 'Venus aspect Rahu in 9th house',
    description: "The ultimate financial illusion. Immense fluctuation in wealth [cite: 38] occurs as investors pour money into offshore scams or massive market bubbles. When Rahu's illusion fades, the collapse is sudden, leaving investors with absolutely nothing.",
  },
  {
    name: 'Venus aspect Ketu in 3rd house',
    description: "Apathy and confusion lead to missed exit points. Ketu brings sudden detachment and sharp negative reversals[cite: 40]. Short-term speculative trades rapidly decay in value, and the investor is paralyzed, watching their capital slowly burn away.",
  },
  {
    name: 'Mercury aspect Mars in 8th house',
    description: "Vicious algorithmic warfare. High-frequency trading bots execute predatory strategies that trigger massive flash crashes. Poor chart reading [cite: 50] guarantees retail traders are crushed by these sudden, violent market manipulations.",
  },
  {
    name: 'Mercury Transits the 3rd House',
    description: "Information overload creates extreme market noise. Retail traders are manipulated by coordinated fake news and social media pump-and-dump schemes. Rapid, impulsive trades based on bad data lead to severe and sudden financial losses.",
  },
  {
    name: 'Mars aspect Mercury in 8th house',
    description: "Aggressive short-sellers use targeted disinformation to destroy stock value. The 8th house [cite: 30] indicates unexpected ruin as rumor-driven panic causes a mass exodus of liquidity, resulting in an immediate and vicious market crash.",
  },
  {
    name: 'Jupiter Transits the 4th House',
    description: "A dangerous over-expansion in real estate or foundational assets. The bubble inflates to unsustainable levels. This transit sets the stage for a catastrophic housing market crash, where sudden illiquidity traps investors in massively devalued properties.",
  },
  {
    name: 'Jupiter aspect Venus in 8th house',
    description: "Massive institutional wealth is suddenly destroyed. The 8th house [cite: 30] turns expected inheritances, mergers, or corporate payouts to dust. Large-scale bankruptcies and hidden debt explosions wipe out huge segments of the financial market.",
  },
  {
    name: 'Sun aspect Mercury in 8th house',
    description: "Government regulators or central banks issue sudden data that shatters market confidence. Poor calculation and timing [cite: 50] leave investors exposed as systemic manipulation (8th house) forces a severe, unexpected contraction in asset prices.",
  },
  {
    name: 'Mercury aspect Sun in 9th house',
    description: "False optimism driven by manipulated economic reports. Ego-driven wrong decisions [cite: 37] cause investors to heavily allocate capital right before a major geopolitical crisis triggers a massive, sudden sell-off in global markets.",
  },
  {
    name: 'Mercury aspect Ketu in 3rd house',
    description: "A total blackout of reliable market data. Ketu causes sharp reversals [cite: 40], and weak Mercury causes poor chart reading[cite: 50]. Trading systems freeze during critical volatility, trapping investors in crashing assets with no way to exit.",
  },
  {
    name: 'Mercury aspect Rahu in 9th house',
    description: "Extreme speculation in foreign, unregulated markets. Immense fluctuation in wealth [cite: 38] is driven by global scams and algorithmic illusions. Investors suffer catastrophic losses as the fabricated international market completely implodes.",
  },
  {
    name: 'Venus Transits the 4th House',
    description: "Over-leveraging to acquire real estate or luxury assets right before a crash. The illusion of domestic stability is shattered by a sudden economic downturn, leaving the investor drowning in debt and facing the immediate loss of foundational wealth.",
  },
  {
    name: 'Sun aspect Mars in 8th house',
    description: "Violent destruction of wealth through aggressive institutional and government actions. Ego-driven decisions [cite: 37] meet violent market changes[cite: 30]. Portfolios are obliterated by sudden regulatory bans, targeted short-selling, and forced liquidations.",
  },
  {
    name: 'Venus Aspecting Midheaven (MC)',
    description: "Corporate greed reaches its peak, signaling a market top. Executives cash out while retail investors hold the bag. A sudden, massive correction destroys the company's valuation, leading to severe portfolio losses for public shareholders.",
  },
  {
    name: 'Saturn in 10th (Dispositor)',
    description: "A brutal, grinding bear market. Unpredictable, severe financial setbacks [cite: 45] dominate as institutional investors heavily suppress prices. Retail liquidity is slowly bled dry through delays, obstacles, and the agonizing stagnation of asset values.",
  },
  {
    name: 'Jupiter Aspecting Midheaven (MC)',
    description: "Extreme, unwarranted optimism inflates the market to dangerous levels. The 'bubble' signature. When the tipping point is reached, institutional support vanishes instantly, resulting in a sudden, historic market crash that destroys trillions in value.",
  },
  {
    name: 'Sun Transits the 3rd House',
    description: "Impulsive, aggressive trading driven by overconfidence. Ego leads the investor to ignore technical warnings. This hubris guarantees falling directly into a bear trap, resulting in sudden, painful, and irreversible capital destruction.",
  },
  {
    name: 'Mars aspect Mars in 8th house',
    description: "The absolute pinnacle of market violence. Brutal flash crashes, aggressive margin calls, and predatory short-selling completely dominate. The 8th house brings unexpected ruin[cite: 30], annihilating portfolios in a matter of seconds through sheer market manipulation.",
  },
  {
    name: 'Venus aspect Saturn in 10th house',
    description: "Severe financial blockades. Expected corporate payouts, dividends, or mergers are abruptly canceled. Saturn creates massive obstacles[cite: 40], freezing liquidity and causing the slow, agonizing destruction of accumulated investor wealth.",
  },
  {
    name: 'Sun Transits the 12th House',
    description: "A transit of absolute financial ruin. Indicates severe losses in speculative trading[cite: 32]. Capital is completely wiped out by foreign market collapses, hidden institutional fees, and the disastrous, ego-driven refusal to cut losses early[cite: 37].",
  },
  {
    name: 'Mercury aspects the Moon in the 6th house',
    description: "A dangerous combination of a fickle mind [cite: 48] and poor calculation[cite: 50]. Over-analyzing chaotic market data leads to panic selling at the exact wrong moment. Debt and margin pressures force the realization of massive financial losses.",
  },
  {
    name: 'Sun Transits the 2nd House',
    description: "Sudden, massive expenses completely drain accumulated capital. Regulatory fines, massive inflation, or unexpected taxes destroy the portfolio. Ego-driven wrong decisions [cite: 37] prevent the investor from protecting their wealth before the crash hits.",
  },
  {
    name: 'Sun Transits the 3rd House',
    description: "Arrogance in short-term trading. The investor mistakenly believes they can outsmart market algorithms. This overconfidence leads directly into a manipulated liquidity trap, resulting in a swift and devastating depletion of trading capital.",
  },
  {
    name: 'Mars Transits the 2nd House',
    description: "Violent and sudden destruction of savings. Impulsive, aggressive investments deplete accumulated wealth (2nd house) at terrifying speeds. Sharp, negative market reversals [cite: 40] ensure that capital is lost much faster than it was ever gained.",
  },
  {
    name: 'Mercury Transits the 4th House',
    description: "Hidden market data reveals terrifying weakness in foundational assets and real estate. Poor timing [cite: 50] leads investors to buy into a collapsing domestic market. Sudden panic ensues as foundational wealth evaporates uncontrollably.",
  },
  {
    name: 'Pluto conjunct Saturn',
    description: "A catastrophic combination signaling systemic market failure and deep institutional manipulation. Indicates the total restructuring of financial markets through extreme crashes, regulatory crackdowns, and the destruction of over-leveraged portfolios. Severe delays and sharp, negative reversals [cite: 40] cause historic wealth destruction.",
  },
  {
    name: 'Sun aspects Sun in 9th house',
    description: "Macro-economic arrogance leads to systemic market failure. Blind faith in failing national policies causes devastating losses. Ego-driven wrong decisions [cite: 37] cause investors to hold bags in collapsing international markets until total bankruptcy.",
  },
  {
    name: 'Sun aspect Ketu in the 3rd house',
    description: "Total paralysis in the face of a crash. Ketu brings sudden, sharp negative reversals[cite: 40], and the Sun's ego prevents admitting defeat. The investor is caught in a rapidly depreciating asset, unable to execute a trade, leading to total ruin.",
  },
  {
    name: 'Sun aspect Rahu in 9th house',
    description: "Severe losses due to ego-driven wrong decisions [cite: 37] based on massive market illusions. The investor falls for high-level institutional scams or foreign Ponzi schemes. The inevitable collapse causes immense, unrecoverable wealth destruction.",
  },
  {
    name: 'Venus Transits the 5th House',
    description: "Dangerous over-indulgence in speculative trading. Driven by greed, investors pour capital into highly volatile, overvalued assets. This sets up a massive bull trap; when the smart money exits, retail traders suffer catastrophic and sudden losses.",
  },
  {
    name: 'Mars aspect Sun in 9th house',
    description: "Violent geopolitical shifts or sudden regulatory actions crash the markets. Ego-driven decisions [cite: 37] combined with aggressive market volatility lead to the immediate destruction of long-term investments and international holdings.",
  },
  {
    name: 'Mars aspect Rahu in 9th house',
    description: "A highly explosive and destructive combination. Immense fluctuation in wealth [cite: 38] is driven by aggressive market manipulation and foreign economic warfare. Sudden, unpredictable crashes wipe out long-term speculative portfolios entirely.",
  },
  {
    name: 'Jupiter aspect Saturn in 10th house',
    description: "The illusion of stable, institutional growth masks a decaying market core. Saturn's unpredictable, severe financial setbacks [cite: 45] eventually overpower Jupiter's optimism. The resulting crash is a slow, agonizing bleed that traps all invested capital.",
  },
  {
    name: 'Sun Transits the 4th House',
    description: "Foundational wealth is under siege. Government interventions or sudden economic downturns crash the real estate market. The investor's core security is abruptly ripped away, resulting in heavy debt and massive portfolio devaluation.",
  },
  {
    name: 'Sun Aspecting Midheaven (MC)',
    description: "Corporate egos clash, triggering massive sell-offs. Top-heavy companies collapse under their own weight. Institutional investors suddenly dump shares, leaving the public sector with worthless assets and completely devastated portfolios.",
  },
  {
    name: 'Venus aspect Jupiter in 5th house',
    description: "The ultimate 'too big to fail' bubble. Extreme greed inflates the 5th house of speculation to breaking point. This placement virtually guarantees a historic, sudden market crash, resulting in catastrophic wealth erosion for the blinded masses.",
  },
  {
    name: 'Sun aspect Saturn in 10th house',
    description: "A brutal suppression of the market by governing bodies. Unpredictable, severe financial setbacks [cite: 45] are enforced by institutional manipulation. The market enters a suffocating bear phase where liquidity is drained and portfolios slowly die.",
  },
  {
    name: 'Venus Transits the 6th House',
    description: "Deceptive loans and toxic debt products are disguised as safe investments. When the underlying assets fail, a massive liquidity crisis ensues. Margin calls force sudden liquidations, completely destroying the investor's capital base.",
  },
  {
    name: 'Mars Transits the 3rd House',
    description: "Hyper-aggressive day trading leads to ruin. The urge to conquer the market results in over-leveraging on volatile assets. Sudden, sharp negative reversals [cite: 40] trigger massive stop-losses, resulting in immediate and catastrophic capital destruction.",
  },
  {
    name: 'Mars Aspecting Midheaven (MC)',
    description: "Hostile corporate takeovers and aggressive short-selling campaigns destroy company valuations. Driven by market violence, institutional players deliberately crash sectors, resulting in massive wealth transfer and sudden ruin for retail investors.",
  },
  {
    name: 'Mercury Aspecting Midheaven (MC)',
    description: "Algorithmic manipulation of the highest order. High-frequency trading systems spoof the market, creating false trends. Poor chart reading [cite: 50] by retail investors leads them directly into these traps, resulting in sudden, heavy losses.",
  },
  {
    name: 'Mercury aspect Saturn in 10th house',
    description: "Total stagnation and technical failure. The market grinds to a halt due to institutional blockades[cite: 40]. Technical analysis completely fails as prices are artificially pinned down, slowly draining theta and capital from retail traders.",
  },
  {
    name: 'Sun Transits the 5th House',
    description: "Ego and speculation collide disastrously. The investor over-commits to high-risk trades, blinded by arrogance[cite: 37]. This sets the stage for a catastrophic wipeout when the market violently corrects and the speculative bubble bursts.",
  },
  {
    name: 'Mars aspect Saturn in 10th house',
    description: "A highly destructive clash between aggressive market forces and institutional suppression. Sharp, negative reversals [cite: 40] are met with severe liquidity freezes. The market crashes violently, and trading halts prevent any chance of escape.",
  },
  {
    name: 'Mercury Transits the 5th House',
    description: "Over-analyzing speculative markets leads to fatal errors. The 'misplaced' house lord configuration turns a potentially winning investment into a loss-maker[cite: 49]. Algorithms misfire, causing sudden, steep declines in trading portfolios.",
  },
  {
    name: 'Jupiter aspect Mercury in 8th house',
    description: "Massive financial calculations are fundamentally flawed. The 8th house brings unexpected changes[cite: 30], completely invalidating complex financial models. Sudden market shocks destroy hedge funds and heavily calculated institutional portfolios.",
  },
  {
    name: 'Venus Transits the 7th House',
    description: "Public market partnerships fail catastrophically. The illusion of safety in blue-chip stocks is shattered by sudden corporate scandals or massive institutional dumping. Retail investors face sudden, severe devaluation of trusted assets.",
  },
  {
    name: 'Saturn aspect Rahu in 9th house',
    description: "Karmic destruction of wealth through systemic market failure. Unpredictable, severe financial setbacks [cite: 45] collide with extreme market illusions. Massive international fraud is exposed, resulting in the sudden and total collapse of global market sectors.",
  },
  {
    name: 'Mercury Transits the 6th House',
    description: "Trading algorithms trigger an unstoppable avalanche of debt liquidations. Weak Mercury leads to poor timing[cite: 50], and margin calls (6th house) violently sweep the market, resulting in abrupt and absolute financial ruin for over-leveraged traders.",
  },
  {
    name: 'Sun aspect Jupiter in the 5th house',
    description: "Extreme arrogance fuels the peak of a speculative bubble. Ego-driven decisions [cite: 37] cause investors to bet everything on a fatally flawed market narrative. The resulting crash is sudden, historic, and wipes out vast amounts of wealth.",
  },
  {
    name: 'Sun Transits the 6th House',
    description: "Crushing debt and aggressive regulatory fines destroy portfolios. Ego-driven wrong decisions [cite: 37] lead to massive over-exposure. When the market turns, the investor is trapped in toxic positions, leading to rapid bankruptcy.",
  },
  {
    name: 'Mars Transits the 4th House',
    description: "Violent destruction of foundational assets. The real estate market or core domestic sectors suffer sudden, aggressive crashes. Sharp negative reversals [cite: 40] leave the investor with heavily depreciated assets and massive, unpayable debt.",
  },
  {
    name: 'Mercury Transits the 7th House',
    description: "False agreements and manipulated public data. Market makers use deceptive algorithms to lure retail into buying the top. Poor chart reading [cite: 50] guarantees the investor is left holding the bag when the massive, sudden dump occurs.",
  },
  {
    name: 'Sun Transits the 7th House',
    description: "Institutional dominance crushes retail traders. Governing entities and market makers violently suppress public markets. Ego-driven trading [cite: 37] against these massive forces results in immediate, catastrophic losses and total portfolio liquidation.",
  },
  {
    name: 'Jupiter Transits the 5th House',
    description: "A dangerous expansion of speculative risk. The market is euphoric, blinding investors to underlying decay. This transit inflates the mother of all bubbles; its sudden bursting results in a catastrophic, generation-defining wealth wipeout.",
  },
  {
    name: 'Mars Transits the 5th House',
    description: "Aggressive, high-risk speculation leads to sudden ruin. The urge to gamble on volatile derivatives results in sharp, negative market reversals[cite: 40]. Entire portfolios are liquidated in minutes during vicious, manipulated flash crashes.",
  },
  {
    name: 'Sun Transits the 8th House',
    description: "Total, unexpected financial ruin. The 8th house governs sudden changes [cite: 30], and the Sun exposes the destruction of the ego[cite: 37]. Portfolios are obliterated by massive, unforeseen market crashes, hidden bankruptcies, and forced liquidations.",
  },
  {
    name: 'Rahu Transits the 10th House',
    description: "Immense, chaotic disruption in the highest levels of the market. Rahu causes panic and erratic decisions[cite: 36]. Institutional leadership fails, corporate scandals erupt, and massive market manipulation completely destroys the perceived value of blue-chip assets.",
  },
  {
    name: 'Ketu Transits the 4th House',
    description: "A sudden, unexplainable drain on foundational wealth. Ketu creates obstacles and sharp, negative reversals[cite: 40]. Real estate markets mysteriously crash, and domestic security vanishes, leaving the investor with massive, unexpected financial voids.",
  },
  {
    name: 'Mercury Transits the 8th House',
    description: "Algorithmic manipulation triggers an unexpected market collapse[cite: 30]. Weak Mercury leads to catastrophic miscalculations[cite: 50]. Dark pool trading and hidden institutional dumps completely wipe out the retail trader in a matter of seconds.",
  },
  {
    name: 'Ketu aspect Mars in 8th house',
    description: "The ultimate signature of sudden, violent market destruction. Sharp, negative reversals [cite: 40] combine with unexpected 8th house events[cite: 30]. Panic selling, flash crashes, and brutal short-squeezes totally annihilate trading accounts without warning.",
  },
  {
    name: 'Rahu aspect Moon in the 6th house',
    description: "Extreme psychological panic driven by massive debt. Rahu causes immense illusion, and an afflicted Moon causes emotional trading[cite: 48]. Margin calls trigger erratic, desperate sell-offs, resulting in devastating, unrecoverable financial losses.",
  },
  {
    name: 'Sun Transits the 9th House',
    description: "Ego-driven faith in failing macro-economics[cite: 37]. The investor stubbornly holds onto crashing international assets or government bonds. The refusal to acknowledge the market shift results in the total, sudden destruction of long-term capital.",
  },
  {
    name: 'Mercury Transits the 9th House',
    description: "Flawed economic theories and poor timing [cite: 50] lead to disastrous long-term allocations. Institutional algorithms manipulate global trends, causing retail investors to suffer massive, unexpected losses in foreign and long-term markets.",
  },
  {
    name: 'Venus Transits the 8th House',
    description: "The complete destruction of luxury and speculative wealth. The 8th house guarantees unexpected changes[cite: 30]. Trust in the market is shattered by sudden, massive devaluation of assets, hidden corporate debt, and orchestrated financial crashes.",
  },
  {
    name: 'Mercury Transits the 10th House',
    description: "Corporate announcements are deliberately manipulated to trigger algorithmic panic. Weak calculation [cite: 50] forces retail traders to sell at the bottom. Institutional whales absorb the liquidity, leaving the public sector with severe, sudden losses.",
  },
  {
    name: 'Sun Transits the 10th House',
    description: "Government or regulatory bodies execute a sudden, massive crackdown on the markets. Ego-driven wrong decisions [cite: 37] leave the investor highly over-exposed when the ruling authorities violently deflate the market capitalization.",
  },
  {
    name: 'Jupiter aspect Mars in 8th house',
    description: "A violent explosion of hidden debt. The 8th house [cite: 30] and Mars create sharp, negative reversals[cite: 40]. Over-leveraged institutional funds collapse suddenly, triggering a massive chain reaction that wipes out the broader financial market.",
  },
  {
    name: 'Moon Aspecting Midheaven (MC)',
    description: "Public perception of the market plummets due to extreme emotional panic[cite: 48]. A fickle, fearful mindset drives massive retail sell-offs, which institutional manipulators use to completely drain liquidity and crash the major indices.",
  },
  {
    name: 'Mercury Transits the 11th House',
    description: "The 'misplaced' house lord configuration turns expected gains into sudden losses[cite: 49]. Miscalculated earnings reports and poor timing [cite: 50] result in a sudden, violent contraction of market liquidity, trapping the investor in heavy losses.",
  },
  {
    name: 'Moon Aspecting Ascendant (ASC)',
    description: "The investor is entirely consumed by a fickle mind and panic[cite: 48]. Emotional, erratic trading leads to selling the absolute bottom during a manipulated market dip, cementing sudden, severe, and irreversible portfolio destruction.",
  },
  {
    name: 'Venus Transits the 9th House',
    description: "A false sense of long-term security in overvalued sectors. Investors blindly follow trends into foreign or high-end markets. The illusion abruptly breaks, resulting in a sudden, catastrophic market crash that wipes out international holdings.",
  },
  {
    name: 'Sun Transits the 11th House',
    description: "Institutional whales artificially inflate market liquidity (11th house) only to violently pull the rug. Ego-driven decisions [cite: 37] cause the retail investor to buy the peak right before the massive, orchestrated market dump occurs.",
  },
  {
    name: 'Venus Transits the 10th House',
    description: "Corporate greed masks deep institutional decay. High-profile companies appear prosperous but are heavily over-leveraged. A sudden, massive correction destroys these bloated valuations, resulting in sudden, severe wealth erosion for all shareholders."
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