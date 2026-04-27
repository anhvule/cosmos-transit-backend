const db = require('./loss');

const events = [
  {
    name: 'Moon Transits the 8th House',
    description: "This transit triggers extreme emotional volatility and a fickle mind, making traders prone to selling low due to panic. As the 8th house governs unexpected changes, this period is ripe for sudden market crashes, algorithmic bear raids, and liquidity traps that result in abrupt portfolio wipeouts.",
  },
  {
    name: 'Moon aspect Venus in 8th house',
    description: "The illusion of market stability is shattered. Speculative investments in luxury or consumer sectors face sudden devaluation. Emotional trading during this aspect often leads retail investors into bull traps set by institutional manipulators, resulting in the rapid erosion of capital and sudden losses.",
  },
  {
    name: 'Venus ruler of the 2nd House in the 8th House',
    description: "A highly destructive placement indicating the depletion of funds. Accumulated wealth (2nd house) is directly threatened by sudden, unforeseen events. This signals immense financial ruin through hidden market manipulation, insider trading scandals, or the abrupt bankruptcy of heavily weighted assets.",
  },
  {
    name: 'Venus ruler of the 7th House in the 8th house',
    description: "Public markets and trading partnerships (7th house) become highly deceptive. Indicates severe market manipulation where foreign or hidden entities orchestrate sudden sell-offs. Investors face catastrophic losses due to breached contracts, delisting of stocks, or systemic betrayal by market makers.",
  },
  {
    name: 'Moon aspect Mercury in 8th house',
    description: "A period characterized by poor chart reading and wrong timing  fueled by emotional panic. Investors fall victim to false news and manipulated earnings reports. Algorithmic trading systems execute erratic, high-frequency dumps, causing sharp intraday market crashes.",
  },
  {
    name: 'Mercury ruler of the 3rd House in the 8th House',
    description: "Communication breakdowns and technical failures in trading platforms lead to sudden, unmanageable losses. This indicates poor speculation ability  where rumors and targeted misinformation campaigns trigger massive panic selling, destroying short-term trades.",
  },
  {
    name: 'Mercury ruler of the 6th House in the 8th House',
    description: "Debt and litigation (6th house) suddenly spiral out of control. This combination turns potentially winning investments into loss-makers. Margin calls are aggressively enforced by brokers, and sudden regulatory crackdowns cause immediate, heavy losses in the tech and communication sectors.",
  },
  {
    name: 'Moon aspect Mars in 8th house',
    description: "A highly aggressive indicator of sudden market wipeouts. Panic-selling, emotional trading, and erratic decisions  are amplified by aggressive short-selling (Mars). Indicates flash crashes driven by fear and predatory market manipulation.",
  },
  {
    name: 'Mars ruler of the 1st House in the 8th House',
    description: "The investor's core decisions lead directly into financial traps. Impulsive, aggressive market entries are met with sharp, negative reversals in the market. Reckless leverage and a failure to perceive hidden market manipulation result in total portfolio liquidation.",
  },
  {
    name: 'Mars ruler of the 8th House in the 8th House',
    description: "Concentrated destruction. The 8th house governs unexpected changes, and Mars here indicates violent market volatility. Whales and institutional insiders forcefully crash asset prices to trigger stop-losses, orchestrating a massive wealth transfer away from retail traders.",
  },
  {
    name: 'Moon Transits the 9th House',
    description: "Long-term investments and foreign holdings face sudden instability. Emotional attachment to failing assets causes investors to hold the bag during major sell-offs. Predicts the collapse of international markets spreading fear and contagion into domestic portfolios.",
  },
  {
    name: 'Moon aspect Sun in 9th house',
    description: "Ego-driven wrong decisions  collide with emotional trading. Government interventions or sudden geopolitical shifts crash long-term market trends. Institutional investors pull liquidity without warning, leaving retail traders stranded in collapsing sectors.",
  },
  {
    name: 'Sun ruler of the 5th House in the 9th House',
    description: "Speculative markets (5th house) are heavily influenced by government or international regulatory actions. A sudden shift in foreign policy, tariffs, or interest rates shatters the illusion of safety, turning long-held speculative investments into massive liabilities.",
  },
  {
    name: 'Moon aspect Rahu in 9th house',
    description: "Extreme illusions govern long-term investments. Known to cause panic-selling, emotional trading, and erratic decisions that lead to losses. Indicates falling for massive financial scams, offshore Ponzi schemes, or artificially inflated market bubbles that abruptly burst.",
  },
  {
    name: 'Moon aspect Ketu in 3rd house',
    description: "A devastating combination for day traders. Erroneous market data and extreme hesitation lead to missed exits. Ketu causes sharp, negative reversals  in short-term trends, while the Moon triggers panic, resulting in devastating losses through mistimed trades.",
  },
  {
    name: 'Moon Transits the 10th House',
    description: "Volatility strikes the highest echelons of the market. Sudden changes in corporate leadership or government regulatory announcements cause immediate sector-wide crashes. The public perception of the market plummets, triggering widespread institutional offloading.",
  },
  {
    name: 'Sun Transits the 12th House',
    description: "A transit marking severe losses in speculative trading. The governing authorities (Sun) implement policies that lead to the direct depletion of wealth. Indicates capital flight, foreign market dumps, and the silent erosion of portfolio value through hidden fees and inflation.",
  },
  {
    name: 'Moon aspect Saturn in 10th house',
    description: "A heavy, depressive influence on the market. Saturn brings unpredictable, severe financial setbacks  while the Moon brings panic. Institutional gridlock and severe liquidity crunches lead to prolonged bear markets and the agonizing, slow death of overvalued stocks.",
  },
  {
    name: 'Saturn ruler of the 10th House in the 10th House',
    description: "Regulatory bodies and institutional giants exert oppressive control. While appearing stable, this placement creates immense obstacles and delays. The market becomes highly illiquid, and retail investors are slowly bled dry by systemic manipulation and lack of upward momentum.",
  },
  {
    name: 'Saturn ruler of the 11th House in the 10th House',
    description: "Expected gains (11th house) are heavily restricted by regulatory forces or institutional blockades. Corporate earnings are artificially manipulated downward, and dividends are suddenly slashed, crushing investor expectations and halting market growth.",
  },
  {
    name: 'Moon Transits the 11th House',
    description: "False hopes regarding gains and liquidity. Herd mentality drives retail investors into over-hyped assets right before a massive dump. Emotional trading  leads to buying the absolute top, followed by a sudden withdrawal of institutional liquidity.",
  },
  {
    name: 'Moon aspect Jupiter in 5th house',
    description: "A classic signature for a market bubble. Over-optimism and extreme greed inflate speculative asset prices (5th house). The fickle mind of the masses  buys into the hype, setting the stage for a sudden, devastating crash when the smart money quietly exits.",
  },
  {
    name: 'Jupiter ruler of the 9th House in the 5th House',
    description: "While traditionally auspicious, in a volatile market this creates a false sense of invincibility. Investors over-leverage based on 'guru' advice or overly optimistic projections, leading to catastrophic wipeouts when underlying systemic flaws are suddenly exposed.",
  },
  {
    name: 'Jupiter ruler of the 12th House in the 5th House',
    description: "The lord of losses (12th house) directly afflicts speculation (5th house), indicating severe losses in speculative trading. Wealth is squandered on phantom investments and 'too good to be true' schemes, leading to sudden and total bankruptcy.",
  },
  {
    name: 'Moon Transits the 12th House',
    description: "A period of immense psychological distress due to financial ruin. The 12th house indicates severe losses. Secret manipulation by market makers forces massive liquidations. Investors lose sleep as their funds are depleted in foreign markets or hidden dark pools.",
  },
  {
    name: 'Mars aspect Jupiter in 5th house',
    description: "Aggressive, impulsive speculation fueled by false optimism. This aspect indicates reckless gambling in high-risk derivatives or volatile commodities. Sudden, sharp negative reversals  obliterate the over-leveraged positions, destroying wealth instantly.",
  },
  {
    name: 'Sun in 9th (Dispositor)',
    description: "Severe losses due to ego-driven wrong decisions  tied to macro-economic beliefs. Blind faith in a failing national economy or foreign policy causes investors to hold onto sinking assets until total capital destruction occurs.",
  },
  {
    name: 'Moon aspect Moon in 6th house',
    description: "Extreme market panic driven by debt crises. The 6th house rules debt, and an afflicted Moon causes a fickle mind. Massive margin calls sweep the market, forcing retail traders to sell at the absolute bottom during a severe liquidity crunch.",
  },
  {
    name: 'Moon ruler of the 4th House in the 6th House',
    description: "A dire indicator for real estate and domestic markets. Asset values plummet due to skyrocketing interest rates or debt defaults. Investors face the threat of repossession and sudden bankruptcy as foundational market stability completely disintegrates.",
  },
  {
    name: 'Moon Transits the 1st House',
    description: "The investor's judgment is clouded by intense emotional volatility. Prone to panic-selling and erratic decisions, the individual falls victim to sudden market shifts. A high-risk period for executing poorly timed trades that result in immediate, heavy losses.",
  },
  {
    name: 'Moon Transits the 2nd House',
    description: "Accumulated wealth (2nd house) fluctuates wildly. Emotional attachment to money leads to irrational hoarding or sudden panic selling. Indicates extreme vulnerability to sudden market crashes that rapidly deplete personal savings and capital reserves.",
  },
  {
    name: 'Venus aspect Moon in 6th house',
    description: "Deceptive market conditions where debt (6th house) is masked as opportunity. Investors are lured into toxic loans or high-yield traps. A fickle mind  leads to sudden panic when the underlying assets devalue, triggering massive financial distress.",
  },
  {
    name: 'Mercury in 8th (Dispositor)',
    description: "A critical indicator of poor chart reading and wrong timing  colliding with the house of unexpected changes. Algorithms fail catastrophically. Insider information proves to be a trap, leading to sudden, devastating portfolio crashes.",
  },
  {
    name: 'Moon Transits the 3rd House',
    description: "Erratic trading behavior based on rumors and fake news. High emotional volatility  leads to impulsive day trading. Short-term manipulation by market whales forces retail investors into buying the top and selling the bottom, destroying capital rapidly.",
  },
  {
    name: 'Venus Transits the 1st House',
    description: "A false sense of financial security clouds the investor's judgment. Vanity and greed lead to over-exposure in luxury or tech sectors. This complacency makes the investor highly susceptible to sudden market reversals and unforeseen institutional dumps.",
  },
  {
    name: 'Moon Transits the 4th House',
    description: "Panic strikes domestic markets and real estate. Emotional trading  causes investors to abruptly liquidate foundational assets. Hidden vulnerabilities in the housing sector or domestic economy are exposed, leading to sudden, deep corrections.",
  },
  {
    name: 'Mars aspect Moon in 6th house',
    description: "Violent destruction of capital through debt and margin calls. Sharp, negative reversals in the market  force aggressive liquidations. The fickle mind of the investor  is overwhelmed by sheer panic as portfolios are wiped out by sudden short-seller attacks.",
  },
  {
    name: 'Uranus conjunct Venus',
    description: "The ultimate signature for a flash crash in tech, luxury, or crypto sectors. Unprecedented, sudden volatility destroys asset values in minutes. What appears as a sudden influx of wealth instantly reverses, trapping investors in catastrophic, unpredictable losses.",
  },
  {
    name: 'Mars in 8th (Dispositor)',
    description: "Brutal and abrupt market destruction. The 8th house governs unexpected changes, and Mars ensures these changes are violent. Predicts extreme market manipulation, forced bankruptcies, and sudden regulatory strikes that completely annihilate specific market sectors.",
  },
  {
    name: 'Moon Transits the 5th House',
    description: "Speculative illusions reach their peak. The fickle mind  dives into high-risk trades right before the bubble bursts. Emotional trading leads to devastating losses as market manipulators suddenly pull the rug on hyped, overvalued assets.",
  },
  {
    name: 'Mars Transits the 12th House',
    description: "Severe and aggressive destruction of wealth. Indicates massive losses in speculative trading  driven by hidden enemies—such as predatory hedge funds and institutional short-sellers. Capital is violently drained through offshore accounts or hidden market mechanisms.",
  },
  {
    name: 'Mercury aspect Jupiter in 5th house',
    description: "Over-confidence in technical analysis leads to disaster. Algorithms and 'foolproof' trading systems miscalculate market sentiment, driving massive capital into speculative traps. The subsequent bubble burst results in profound, sudden financial ruin.",
  },
  {
    name: 'Sun aspect Moon in 6th house',
    description: "Ego-driven decisions  clash with emotional panic  amidst rising debt (6th house). Government reports or economic data releases trigger immediate market sell-offs, forcing investors into catastrophic margin liquidations.",
  },
  {
    name: 'Sun Transits the 1st House',
    description: "Over-leverage driven by arrogance. The investor takes on massive risk, blind to underlying market weakness. This ego-driven exposure sets the stage for severe losses  when institutional forces suddenly reverse the market trend.",
  },
  {
    name: 'Mercury Transits the 12th House',
    description: "Total failure of market data and communication. The planet of calculation is lost in the house of expenses, leading to poor chart reading and wrong timing. Severe losses in speculation  occur due to invisible algorithms and dark pool manipulation.",
  },
  {
    name: 'Ketu aspect Sun in the 9th house',
    description: "A sudden, unexplainable collapse of long-term investments. Ketu brings sharp, negative reversals. Government bonds, international holdings, and trusted blue-chip stocks mysteriously plummet as institutional support vanishes without a trace.",
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
    description: "Panic over debt and litigation. A fickle mind  is overwhelmed as sudden economic downturns trigger massive loan defaults. The market is gripped by fear, leading to aggressive sell-offs and the rapid depletion of investor capital.",
  },
  {
    name: 'Moon Transits the 7th House',
    description: "Betrayal in public markets. Panic-selling  is triggered when market makers or trusted corporate partners suddenly dump their shares. The retail investor is left holding worthless assets as market liquidity abruptly disappears.",
  },
  {
    name: 'Saturn aspect Sun in 9th house',
    description: "A grim period of wealth destruction caused by heavy regulatory crackdowns or geopolitical stagnation. Unpredictable, severe financial setbacks  crush long-term investments as institutional giants actively suppress market growth, enforcing a brutal bear market.",
  },
  {
    name: 'Venus Transits the 2nd House',
    description: "A dangerous illusion of wealth accumulation. The 2nd house of capital appears strong, luring investors into over-leveraged positions. This sets the trap for a sudden, devastating crash that completely wipes out accumulated assets and savings.",
  },
  {
    name: 'Venus aspect Venus in 8th house',
    description: "Absolute destruction of luxury, consumer, or crypto assets. The 8th house governs unexpected changes, and this aspect indicates sudden, massive wealth erosion through hidden financial scandals, corporate bankruptcies, and predatory market manipulation.",
  },
  {
    name: 'Sun Aspecting Ascendant (ASC)',
    description: "Extreme ego leads to catastrophic risk-taking. Investors ignore critical warning signs and double down on failing positions. This arrogance results in severe losses due to ego-driven wrong decisions  when the market violently corrects.",
  },
  {
    name: 'Mercury Aspecting Ascendant (ASC)',
    description: "Information overload leads to fatal trading errors. Poor chart reading and wrong timing  cause investors to buy at the peak and sell at the bottom. Algorithms heavily manipulate the tape, trapping the investor in a cycle of rapid, sudden losses.",
  },
  {
    name: 'Venus aspect Mercury in 8th house',
    description: "Financial data is deliberately manipulated to hide massive corporate losses. The 8th house triggers sudden events, leading to catastrophic stock collapses when cooked books and fraudulent accounting are finally exposed to the public.",
  },
  {
    name: 'Venus aspect Mars in 8th house',
    description: "Violent and sudden destruction of capital. Sharp, negative reversals in the market  are orchestrated by aggressive institutional short-sellers. Greed turns into immediate panic as margin calls force the liquidation of heavily leveraged portfolios.",
  },
  {
    name: 'Mars aspect Venus in 8th house',
    description: "A brutal transfer of wealth from retail to whales. Sudden changes  obliterate speculative investments. Aggressive dumping of assets causes extreme volatility, wiping out those who bought into the false safety of the market peak.",
  },
  {
    name: 'Venus Transits the 3rd House',
    description: "Short-term trading relies on false rumors and manipulative hype. Day traders are lured into pump-and-dump schemes. The sudden withdrawal of liquidity leaves them trapped with worthless assets, resulting in rapid and severe financial losses.",
  },
  {
    name: 'Mercury Transits the 2nd House',
    description: "Algorithmic targeting of accumulated wealth. High-frequency trading systems drain retail capital through microscopic manipulations. Poor calculation  leads investors to mismanage their core funds, resulting in a sudden and irreversible depletion of capital.",
  },
  {
    name: 'Sun Transits the 2nd House',
    description: "Government interventions, sudden tax levies, or inflation destroy the value of accumulated wealth (2nd house). Ego-driven wrong decisions  cause investors to hold onto depreciating assets, leading to a massive, unexpected financial drain.",
  },
  {
    name: 'Mercury Transits the 1st House',
    description: "Over-trading and systemic miscalculation. The investor is highly susceptible to market noise, leading to poor timing. Constant shifting of positions incurs massive hidden fees and sudden losses as the market chops violently in both directions.",
  },
  {
    name: 'Mars Transits the 1st House',
    description: "Impulsive, aggressive trading behavior leads straight into disaster. Driven by a desire to recover past losses, the investor heavily over-leverages. This recklessness is met with sharp negative reversals, causing an immediate and total portfolio wipeout.",
  },
  {
    name: 'Mars aspect Ketu in 3rd house',
    description: "A sudden, violent disruption in trading execution. Sharp, negative reversals  occur precisely when platforms freeze or algorithms fail. This chaotic combination guarantees massive losses for short-term traders trapped in collapsing positions.",
  },
  {
    name: 'Mercury aspect Venus in 8th house',
    description: "Sophisticated financial fraud is executed flawlessly. The 8th house brings sudden changes  as manipulated earnings reports and fake corporate news trap retail investors. A massive rug-pull completely destroys the value of seemingly secure investments.",
  },
  {
    name: 'Sun aspect Venus in 8th house',
    description: "Ego-driven decisions  blind the investor to massive underlying corruption. Government or regulatory bodies suddenly freeze assets or delist major companies, resulting in the instantaneous destruction of wealth in the blink of an eye.",
  },
  {
    name: 'Mercury aspect Mercury in 8th house',
    description: "A catastrophic failure of technical analysis. The market behaves completely irrationally, driven by hidden institutional algorithms (8th house). Predictive models fail, causing automated trading systems to execute massive sell-offs at the absolute bottom.",
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
    description: "The ultimate financial illusion. Immense fluctuation in wealth  occurs as investors pour money into offshore scams or massive market bubbles. When Rahu's illusion fades, the collapse is sudden, leaving investors with absolutely nothing.",
  },
  {
    name: 'Venus aspect Ketu in 3rd house',
    description: "Apathy and confusion lead to missed exit points. Ketu brings sudden detachment and sharp negative reversals. Short-term speculative trades rapidly decay in value, and the investor is paralyzed, watching their capital slowly burn away.",
  },
  {
    name: 'Mercury aspect Mars in 8th house',
    description: "Vicious algorithmic warfare. High-frequency trading bots execute predatory strategies that trigger massive flash crashes. Poor chart reading  guarantees retail traders are crushed by these sudden, violent market manipulations.",
  },
  {
    name: 'Mercury Transits the 3rd House',
    description: "Information overload creates extreme market noise. Retail traders are manipulated by coordinated fake news and social media pump-and-dump schemes. Rapid, impulsive trades based on bad data lead to severe and sudden financial losses.",
  },
  {
    name: 'Mars aspect Mercury in 8th house',
    description: "Aggressive short-sellers use targeted disinformation to destroy stock value. The 8th house  indicates unexpected ruin as rumor-driven panic causes a mass exodus of liquidity, resulting in an immediate and vicious market crash.",
  },
  {
    name: 'Jupiter Transits the 4th House',
    description: "A dangerous over-expansion in real estate or foundational assets. The bubble inflates to unsustainable levels. This transit sets the stage for a catastrophic housing market crash, where sudden illiquidity traps investors in massively devalued properties.",
  },
  {
    name: 'Jupiter aspect Venus in 8th house',
    description: "Massive institutional wealth is suddenly destroyed. The 8th house  turns expected inheritances, mergers, or corporate payouts to dust. Large-scale bankruptcies and hidden debt explosions wipe out huge segments of the financial market.",
  },
  {
    name: 'Sun aspect Mercury in 8th house',
    description: "Government regulators or central banks issue sudden data that shatters market confidence. Poor calculation and timing  leave investors exposed as systemic manipulation (8th house) forces a severe, unexpected contraction in asset prices.",
  },
  {
    name: 'Mercury aspect Sun in 9th house',
    description: "False optimism driven by manipulated economic reports. Ego-driven wrong decisions  cause investors to heavily allocate capital right before a major geopolitical crisis triggers a massive, sudden sell-off in global markets.",
  },
  {
    name: 'Mercury aspect Ketu in 3rd house',
    description: "A total blackout of reliable market data. Ketu causes sharp reversals , and weak Mercury causes poor chart reading. Trading systems freeze during critical volatility, trapping investors in crashing assets with no way to exit.",
  },
  {
    name: 'Mercury aspect Rahu in 9th house',
    description: "Extreme speculation in foreign, unregulated markets. Immense fluctuation in wealth  is driven by global scams and algorithmic illusions. Investors suffer catastrophic losses as the fabricated international market completely implodes.",
  },
  {
    name: 'Venus Transits the 4th House',
    description: "Over-leveraging to acquire real estate or luxury assets right before a crash. The illusion of domestic stability is shattered by a sudden economic downturn, leaving the investor drowning in debt and facing the immediate loss of foundational wealth.",
  },
  {
    name: 'Sun aspect Mars in 8th house',
    description: "Violent destruction of wealth through aggressive institutional and government actions. Ego-driven decisions  meet violent market changes. Portfolios are obliterated by sudden regulatory bans, targeted short-selling, and forced liquidations.",
  },
  {
    name: 'Venus Aspecting Midheaven (MC)',
    description: "Corporate greed reaches its peak, signaling a market top. Executives cash out while retail investors hold the bag. A sudden, massive correction destroys the company's valuation, leading to severe portfolio losses for public shareholders.",
  },
  {
    name: 'Saturn in 10th (Dispositor)',
    description: "A brutal, grinding bear market. Unpredictable, severe financial setbacks  dominate as institutional investors heavily suppress prices. Retail liquidity is slowly bled dry through delays, obstacles, and the agonizing stagnation of asset values.",
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
    description: "The absolute pinnacle of market violence. Brutal flash crashes, aggressive margin calls, and predatory short-selling completely dominate. The 8th house brings unexpected ruin, annihilating portfolios in a matter of seconds through sheer market manipulation.",
  },
  {
    name: 'Venus aspect Saturn in 10th house',
    description: "Severe financial blockades. Expected corporate payouts, dividends, or mergers are abruptly canceled. Saturn creates massive obstacles, freezing liquidity and causing the slow, agonizing destruction of accumulated investor wealth.",
  },
  {
    name: 'Sun Transits the 12th House',
    description: "A transit of absolute financial ruin. Indicates severe losses in speculative trading. Capital is completely wiped out by foreign market collapses, hidden institutional fees, and the disastrous, ego-driven refusal to cut losses early.",
  },
  {
    name: 'Mercury aspects the Moon in the 6th house',
    description: "A dangerous combination of a fickle mind  and poor calculation. Over-analyzing chaotic market data leads to panic selling at the exact wrong moment. Debt and margin pressures force the realization of massive financial losses.",
  },
  {
    name: 'Sun Transits the 2nd House',
    description: "Sudden, massive expenses completely drain accumulated capital. Regulatory fines, massive inflation, or unexpected taxes destroy the portfolio. Ego-driven wrong decisions  prevent the investor from protecting their wealth before the crash hits.",
  },
  {
    name: 'Sun Transits the 3rd House',
    description: "Arrogance in short-term trading. The investor mistakenly believes they can outsmart market algorithms. This overconfidence leads directly into a manipulated liquidity trap, resulting in a swift and devastating depletion of trading capital.",
  },
  {
    name: 'Mars Transits the 2nd House',
    description: "Violent and sudden destruction of savings. Impulsive, aggressive investments deplete accumulated wealth (2nd house) at terrifying speeds. Sharp, negative market reversals  ensure that capital is lost much faster than it was ever gained.",
  },
  {
    name: 'Mercury Transits the 4th House',
    description: "Hidden market data reveals terrifying weakness in foundational assets and real estate. Poor timing  leads investors to buy into a collapsing domestic market. Sudden panic ensues as foundational wealth evaporates uncontrollably.",
  },
  {
    name: 'Pluto conjunct Saturn',
    description: "A catastrophic combination signaling systemic market failure and deep institutional manipulation. Indicates the total restructuring of financial markets through extreme crashes, regulatory crackdowns, and the destruction of over-leveraged portfolios. Severe delays and sharp, negative reversals  cause historic wealth destruction.",
  },
  {
    name: 'Sun aspects Sun in 9th house',
    description: "Macro-economic arrogance leads to systemic market failure. Blind faith in failing national policies causes devastating losses. Ego-driven wrong decisions  cause investors to hold bags in collapsing international markets until total bankruptcy.",
  },
  {
    name: 'Sun aspect Ketu in the 3rd house',
    description: "Total paralysis in the face of a crash. Ketu brings sudden, sharp negative reversals, and the Sun's ego prevents admitting defeat. The investor is caught in a rapidly depreciating asset, unable to execute a trade, leading to total ruin.",
  },
  {
    name: 'Sun aspect Rahu in 9th house',
    description: "Severe losses due to ego-driven wrong decisions  based on massive market illusions. The investor falls for high-level institutional scams or foreign Ponzi schemes. The inevitable collapse causes immense, unrecoverable wealth destruction.",
  },
  {
    name: 'Venus Transits the 5th House',
    description: "Dangerous over-indulgence in speculative trading. Driven by greed, investors pour capital into highly volatile, overvalued assets. This sets up a massive bull trap; when the smart money exits, retail traders suffer catastrophic and sudden losses.",
  },
  {
    name: 'Mars aspect Sun in 9th house',
    description: "Violent geopolitical shifts or sudden regulatory actions crash the markets. Ego-driven decisions  combined with aggressive market volatility lead to the immediate destruction of long-term investments and international holdings.",
  },
  {
    name: 'Mars aspect Rahu in 9th house',
    description: "A highly explosive and destructive combination. Immense fluctuation in wealth  is driven by aggressive market manipulation and foreign economic warfare. Sudden, unpredictable crashes wipe out long-term speculative portfolios entirely.",
  },
  {
    name: 'Jupiter aspect Saturn in 10th house',
    description: "The illusion of stable, institutional growth masks a decaying market core. Saturn's unpredictable, severe financial setbacks  eventually overpower Jupiter's optimism. The resulting crash is a slow, agonizing bleed that traps all invested capital.",
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
    description: "A brutal suppression of the market by governing bodies. Unpredictable, severe financial setbacks  are enforced by institutional manipulation. The market enters a suffocating bear phase where liquidity is drained and portfolios slowly die.",
  },
  {
    name: 'Venus Transits the 6th House',
    description: "Deceptive loans and toxic debt products are disguised as safe investments. When the underlying assets fail, a massive liquidity crisis ensues. Margin calls force sudden liquidations, completely destroying the investor's capital base.",
  },
  {
    name: 'Mars Transits the 3rd House',
    description: "Hyper-aggressive day trading leads to ruin. The urge to conquer the market results in over-leveraging on volatile assets. Sudden, sharp negative reversals  trigger massive stop-losses, resulting in immediate and catastrophic capital destruction.",
  },
  {
    name: 'Mars Aspecting Midheaven (MC)',
    description: "Hostile corporate takeovers and aggressive short-selling campaigns destroy company valuations. Driven by market violence, institutional players deliberately crash sectors, resulting in massive wealth transfer and sudden ruin for retail investors.",
  },
  {
    name: 'Mercury Aspecting Midheaven (MC)',
    description: "Algorithmic manipulation of the highest order. High-frequency trading systems spoof the market, creating false trends. Poor chart reading  by retail investors leads them directly into these traps, resulting in sudden, heavy losses.",
  },
  {
    name: 'Mercury aspect Saturn in 10th house',
    description: "Total stagnation and technical failure. The market grinds to a halt due to institutional blockades. Technical analysis completely fails as prices are artificially pinned down, slowly draining theta and capital from retail traders.",
  },
  {
    name: 'Sun Transits the 5th House',
    description: "Ego and speculation collide disastrously. The investor over-commits to high-risk trades, blinded by arrogance. This sets the stage for a catastrophic wipeout when the market violently corrects and the speculative bubble bursts.",
  },
  {
    name: 'Mars aspect Saturn in 10th house',
    description: "A highly destructive clash between aggressive market forces and institutional suppression. Sharp, negative reversals  are met with severe liquidity freezes. The market crashes violently, and trading halts prevent any chance of escape.",
  },
  {
    name: 'Mercury Transits the 5th House',
    description: "Over-analyzing speculative markets leads to fatal errors. The 'misplaced' house lord configuration turns a potentially winning investment into a loss-maker. Algorithms misfire, causing sudden, steep declines in trading portfolios.",
  },
  {
    name: 'Jupiter aspect Mercury in 8th house',
    description: "Massive financial calculations are fundamentally flawed. The 8th house brings unexpected changes, completely invalidating complex financial models. Sudden market shocks destroy hedge funds and heavily calculated institutional portfolios.",
  },
  {
    name: 'Venus Transits the 7th House',
    description: "Public market partnerships fail catastrophically. The illusion of safety in blue-chip stocks is shattered by sudden corporate scandals or massive institutional dumping. Retail investors face sudden, severe devaluation of trusted assets.",
  },
  {
    name: 'Saturn aspect Rahu in 9th house',
    description: "Karmic destruction of wealth through systemic market failure. Unpredictable, severe financial setbacks  collide with extreme market illusions. Massive international fraud is exposed, resulting in the sudden and total collapse of global market sectors.",
  },
  {
    name: 'Mercury Transits the 6th House',
    description: "Trading algorithms trigger an unstoppable avalanche of debt liquidations. Weak Mercury leads to poor timing, and margin calls (6th house) violently sweep the market, resulting in abrupt and absolute financial ruin for over-leveraged traders.",
  },
  {
    name: 'Sun aspect Jupiter in the 5th house',
    description: "Extreme arrogance fuels the peak of a speculative bubble. Ego-driven decisions  cause investors to bet everything on a fatally flawed market narrative. The resulting crash is sudden, historic, and wipes out vast amounts of wealth.",
  },
  {
    name: 'Sun Transits the 6th House',
    description: "Crushing debt and aggressive regulatory fines destroy portfolios. Ego-driven wrong decisions  lead to massive over-exposure. When the market turns, the investor is trapped in toxic positions, leading to rapid bankruptcy.",
  },
  {
    name: 'Mars Transits the 4th House',
    description: "Violent destruction of foundational assets. The real estate market or core domestic sectors suffer sudden, aggressive crashes. Sharp negative reversals  leave the investor with heavily depreciated assets and massive, unpayable debt.",
  },
  {
    name: 'Mercury Transits the 7th House',
    description: "False agreements and manipulated public data. Market makers use deceptive algorithms to lure retail into buying the top. Poor chart reading  guarantees the investor is left holding the bag when the massive, sudden dump occurs.",
  },
  {
    name: 'Sun Transits the 7th House',
    description: "Institutional dominance crushes retail traders. Governing entities and market makers violently suppress public markets. Ego-driven trading  against these massive forces results in immediate, catastrophic losses and total portfolio liquidation.",
  },
  {
    name: 'Jupiter Transits the 5th House',
    description: "A dangerous expansion of speculative risk. The market is euphoric, blinding investors to underlying decay. This transit inflates the mother of all bubbles; its sudden bursting results in a catastrophic, generation-defining wealth wipeout.",
  },
  {
    name: 'Mars Transits the 5th House',
    description: "Aggressive, high-risk speculation leads to sudden ruin. The urge to gamble on volatile derivatives results in sharp, negative market reversals. Entire portfolios are liquidated in minutes during vicious, manipulated flash crashes.",
  },
  {
    name: 'Sun Transits the 8th House',
    description: "Total, unexpected financial ruin. The 8th house governs sudden changes , and the Sun exposes the destruction of the ego. Portfolios are obliterated by massive, unforeseen market crashes, hidden bankruptcies, and forced liquidations.",
  },
  {
    name: 'Rahu Transits the 10th House',
    description: "Immense, chaotic disruption in the highest levels of the market. Rahu causes panic and erratic decisions. Institutional leadership fails, corporate scandals erupt, and massive market manipulation completely destroys the perceived value of blue-chip assets.",
  },
  {
    name: 'Ketu Transits the 4th House',
    description: "A sudden, unexplainable drain on foundational wealth. Ketu creates obstacles and sharp, negative reversals. Real estate markets mysteriously crash, and domestic security vanishes, leaving the investor with massive, unexpected financial voids.",
  },
  {
    name: 'Mercury Transits the 8th House',
    description: "Algorithmic manipulation triggers an unexpected market collapse. Weak Mercury leads to catastrophic miscalculations. Dark pool trading and hidden institutional dumps completely wipe out the retail trader in a matter of seconds.",
  },
  {
    name: 'Ketu aspect Mars in 8th house',
    description: "The ultimate signature of sudden, violent market destruction. Sharp, negative reversals  combine with unexpected 8th house events. Panic selling, flash crashes, and brutal short-squeezes totally annihilate trading accounts without warning.",
  },
  {
    name: 'Rahu aspect Moon in the 6th house',
    description: "Extreme psychological panic driven by massive debt. Rahu causes immense illusion, and an afflicted Moon causes emotional trading. Margin calls trigger erratic, desperate sell-offs, resulting in devastating, unrecoverable financial losses.",
  },
  {
    name: 'Sun Transits the 9th House',
    description: "Ego-driven faith in failing macro-economics. The investor stubbornly holds onto crashing international assets or government bonds. The refusal to acknowledge the market shift results in the total, sudden destruction of long-term capital.",
  },
  {
    name: 'Mercury Transits the 9th House',
    description: "Flawed economic theories and poor timing  lead to disastrous long-term allocations. Institutional algorithms manipulate global trends, causing retail investors to suffer massive, unexpected losses in foreign and long-term markets.",
  },
  {
    name: 'Venus Transits the 8th House',
    description: "The complete destruction of luxury and speculative wealth. The 8th house guarantees unexpected changes. Trust in the market is shattered by sudden, massive devaluation of assets, hidden corporate debt, and orchestrated financial crashes.",
  },
  {
    name: 'Mercury Transits the 10th House',
    description: "Corporate announcements are deliberately manipulated to trigger algorithmic panic. Weak calculation  forces retail traders to sell at the bottom. Institutional whales absorb the liquidity, leaving the public sector with severe, sudden losses.",
  },
  {
    name: 'Sun Transits the 10th House',
    description: "Government or regulatory bodies execute a sudden, massive crackdown on the markets. Ego-driven wrong decisions  leave the investor highly over-exposed when the ruling authorities violently deflate the market capitalization.",
  },
  {
    name: 'Jupiter aspect Mars in 8th house',
    description: "A violent explosion of hidden debt. The 8th house  and Mars create sharp, negative reversals. Over-leveraged institutional funds collapse suddenly, triggering a massive chain reaction that wipes out the broader financial market.",
  },
  {
    name: 'Moon Aspecting Midheaven (MC)',
    description: "Public perception of the market plummets due to extreme emotional panic. A fickle, fearful mindset drives massive retail sell-offs, which institutional manipulators use to completely drain liquidity and crash the major indices.",
  },
  {
    name: 'Mercury Transits the 11th House',
    description: "The 'misplaced' house lord configuration turns expected gains into sudden losses. Miscalculated earnings reports and poor timing  result in a sudden, violent contraction of market liquidity, trapping the investor in heavy losses.",
  },
  {
    name: 'Moon Aspecting Ascendant (ASC)',
    description: "The investor is entirely consumed by a fickle mind and panic. Emotional, erratic trading leads to selling the absolute bottom during a manipulated market dip, cementing sudden, severe, and irreversible portfolio destruction.",
  },
  {
    name: 'Venus Transits the 9th House',
    description: "A false sense of long-term security in overvalued sectors. Investors blindly follow trends into foreign or high-end markets. The illusion abruptly breaks, resulting in a sudden, catastrophic market crash that wipes out international holdings.",
  },
  {
    name: 'Sun Transits the 11th House',
    description: "Institutional whales artificially inflate market liquidity (11th house) only to violently pull the rug. Ego-driven decisions  cause the retail investor to buy the peak right before the massive, orchestrated market dump occurs.",
  },
  {
    name: 'Venus Transits the 10th House',
    description: "Corporate greed masks deep institutional decay. High-profile companies appear prosperous but are heavily over-leveraged. A sudden, massive correction destroys these bloated valuations, resulting in sudden, severe wealth erosion for all shareholders.",
  },
  {
    name: 'Jupiter Aspecting Midheaven (MC) : Ends',
    description: "The sudden collapse of extreme, unwarranted optimism. The 'bubble' pops as institutional support completely vanishes, ending the false rally and permanently crashing the major indices, leaving retail portfolios completely drained.",
  },
  {
    name: 'Jupiter aspect Jupiter in 5th house : Exact',
    description: "Peak of the speculative bubble. Extreme overvaluation hits its absolute mathematical limit. Retail investors are lured into maximum leverage through overwhelming false optimism right before a monumental, historic market crash is orchestrated.",
  },
  {
    name: 'Jupiter aspect Mars in 8th house : Ends',
    description: "The brutal aftermath of a massive wealth transfer. The sharp, negative market reversals conclude, leaving retail portfolios completely decimated by the coordinated, violent explosion of hidden institutional debt and forced liquidations.",
  },
  {
    name: 'Jupiter aspect Mars in 8th house : Exact',
    description: "Violent explosion of hidden debt. The 8th house triggers sharp, negative reversals. Over-leveraged institutional funds collapse suddenly, triggering a massive chain reaction of margin calls that ruthlessly wipes out the broader financial market.",
  },
  {
    name: 'Jupiter aspect Mars in 8th house : Starts',
    description: "The initial trigger of hidden debt exploding. Over-leveraged institutions begin secret, aggressive liquidations, setting the stage for a violent market chain reaction that will abruptly destroy speculative wealth.",
  },
  {
    name: 'Jupiter aspect Moon in 6th house : Ends',
    description: "The catastrophic debt trap snaps shut completely. Over-leveraged retail investors are forcibly liquidated, and the extreme psychological panic subsides into a harsh reality of total, unrecoverable financial ruin.",
  },
  {
    name: 'Jupiter aspect Moon in 6th house : Exact',
    description: "Margin calls violently sweep the market. The emotional panic of the fickle mind (Moon) is amplified by massive financial over-exposure (Jupiter in 6th), resulting in catastrophic, realized losses during a sudden liquidity crunch.",
  },
  {
    name: 'Jupiter aspect Moon in 6th house : Starts',
    description: "False optimism leads investors to confidently take on immense debt or toxic margin. A highly dangerous setup where greed blinds traders to impending liquidity crises and massive sudden drops.",
  },
  {
    name: 'Jupiter aspect Venus in 8th house : Ends',
    description: "Absolute eradication of institutional wealth and speculative bubbles. Large-scale corporate payouts turn to dust, and the market violently realizes the total extent of the hidden financial rot, finalizing the crash.",
  },
  {
    name: 'Jupiter aspect Venus in 8th house : Starts',
    description: "The beginning of a massive wealth destruction cycle. Hidden financial scandals or underlying corporate bankruptcies begin to secretly surface, threatening supposedly 'safe', heavily capitalized investments.",
  },
  {
    name: 'Ketu aspect Mars in 8th house : Exact',
    description: "The ultimate astrological signature of sudden, violent market destruction. Sharp, negative reversals combine with unexpected 8th house ruin. Panic selling, flash crashes, and brutal short-squeezes totally annihilate trading accounts without any warning.",
  },
  {
    name: 'Ketu aspect Sun in 9th house : Exact',
    description: "A sudden, unexplainable collapse of long-term investments. Ketu brings sharp, negative reversals. Government bonds, international holdings, and trusted macro-assets mysteriously plummet as systemic institutional support vanishes without a trace.",
  },
  {
    name: 'Mars Aspecting Midheaven (MC) : Ends',
    description: "The violent market suppression completes its cycle. Retail investors are left holding worthless assets following the targeted, aggressive annihilation of the sector by predatory institutional shorts.",
  },
  {
    name: 'Mars Aspecting Midheaven (MC) : Exact',
    description: "Hostile corporate takeovers and aggressive short-selling campaigns destroy company valuations. Driven by sheer market violence, institutional players deliberately crash sectors, resulting in massive wealth transfer and sudden ruin for retail traders.",
  },
  {
    name: 'Mars Aspecting Midheaven (MC) : Starts',
    description: "Hostile market forces begin accumulating massive short positions. Aggressive, hidden campaigns are secretly launched to actively destroy specific sector valuations and trigger widespread panic.",
  },
  {
    name: 'Mars aspect Mars in 8th house : Exact',
    description: "The absolute pinnacle of market violence. Brutal flash crashes, aggressive margin calls, and predatory short-selling completely dominate. The 8th house brings unexpected ruin, annihilating portfolios in a matter of seconds through sheer market manipulation.",
  },
  {
    name: 'Mars aspect Mars in 8th house : Starts',
    description: "The initiation of brutal market violence. Predatory algorithms and whales begin aggressively hunting stop-losses to trigger a cascading, unstoppable flash crash.",
  },
  {
    name: 'Mars aspect Mercury in 8th house : Ends',
    description: "The algorithmic dump concludes. Retail liquidity is completely drained as rumor-driven panic and vicious high-frequency trading formally bankrupt over-leveraged day traders.",
  },
  {
    name: 'Mars aspect Mercury in 8th house : Exact',
    description: "Vicious algorithmic warfare. High-frequency trading bots execute predatory strategies triggered by false data. Poor chart reading guarantees retail traders are immediately crushed by these sudden, violent market manipulations.",
  },
  {
    name: 'Mars aspect Mercury in 8th house : Starts',
    description: "Rumors and targeted disinformation campaigns are launched by aggressive short-sellers. The technical groundwork for an algorithmic flash crash is actively laid in the dark pools.",
  },
  {
    name: 'Mars aspect Moon in 6th house : Ends',
    description: "The devastating wave of forced liquidations ends, leaving completely wiped-out accounts. The aggressive extraction of retail wealth through weaponized debt mechanisms is finalized.",
  },
  {
    name: 'Mars aspect Moon in 6th house : Exact',
    description: "Violent destruction of capital through forced margin calls. Sharp, negative reversals in the market force aggressive liquidations. The fickle mind of the investor is completely overwhelmed by sheer panic as portfolios are wiped out.",
  },
  {
    name: 'Mars aspect Moon in 6th house : Starts',
    description: "Margin pressures begin to mount aggressively. The very first waves of panic selling hit the tape as short-sellers apply maximum pressure on heavily indebted retail positions.",
  },
  {
    name: 'Mars aspect Rahu in 9th house : Ends',
    description: "The sudden collapse of the global market illusion is complete. Investors realize their international holdings have been entirely eradicated by predatory foreign entities and massive algorithmic scams.",
  },
  {
    name: 'Mars aspect Rahu in 9th house : Exact',
    description: "A highly explosive and destructive combination. Immense fluctuation in wealth is driven by aggressive market manipulation and foreign economic warfare. Sudden, unpredictable crashes wipe out long-term speculative portfolios entirely.",
  },
  {
    name: 'Mars aspect Rahu in 9th house : Starts',
    description: "Aggressive foreign economic warfare or massive offshore algorithmic manipulation begins to deeply destabilize long-term investments, setting the trap for a catastrophic drop.",
  },
  {
    name: 'Mars aspect Saturn in 10th house : Ends',
    description: "The agonizing market gridlock breaks downwards. The combination of structural institutional suppression and aggressive dumping finalizes the devastating bear market phase.",
  },
  {
    name: 'Mars aspect Saturn in 10th house : Exact',
    description: "A highly destructive clash between aggressive market forces and massive institutional suppression. Sharp, negative reversals are met with severe liquidity freezes. The market crashes violently, and trading halts prevent any chance of escape.",
  },
  {
    name: 'Mars aspect Saturn in 10th house : Starts',
    description: "Aggressive market forces collide with severe institutional blockades. A violent struggle for liquidity begins, threatening massive market halts and sudden, sharp devaluations.",
  },
  {
    name: 'Mars aspect Sun in 9th house : Ends',
    description: "The terrifying fallout of a sudden geopolitical market crash. Long-term portfolios are left entirely devastated by the aggressive, sweeping macro-economic destruction.",
  },
  {
    name: 'Mars aspect Sun in 9th house : Exact',
    description: "Violent geopolitical shifts or sudden regulatory actions completely crash the markets. Ego-driven decisions combined with aggressive market volatility lead to the immediate destruction of long-term investments and international holdings.",
  },
  {
    name: 'Mars aspect Sun in 9th house : Starts',
    description: "Rising geopolitical tensions or sudden regulatory threats begin to aggressively threaten long-term global market stability, initiating violent underlying volatility.",
  },
  {
    name: 'Mars aspect Venus in 8th house : Ends',
    description: "The sudden extraction of speculative wealth finishes. Heavily leveraged portfolios in luxury or crypto sectors are completely liquidated, abandoned by market makers, and left at zero.",
  },
  {
    name: 'Mars aspect Venus in 8th house : Exact',
    description: "A brutal transfer of wealth from retail directly to whales. Sudden changes obliterate speculative investments. Aggressive dumping of assets causes extreme volatility, wiping out those who bought into the false safety of the market peak.",
  },
  {
    name: 'Mars aspect Venus in 8th house : Starts',
    description: "Whales begin aggressively targeting speculative and luxury assets. The dark pool setup for a brutal and sudden extraction of retail wealth rapidly commences.",
  },
  {
    name: 'Mercury Aspecting Ascendant (ASC) : Exact',
    description: "Information overload leads to fatal trading errors. Poor chart reading and terrible timing cause investors to buy at the absolute peak. Algorithms heavily manipulate the tape, trapping the investor in a cycle of rapid, sudden losses.",
  },
  {
    name: 'Mercury aspect Jupiter in 5th house : Exact',
    description: "Over-confidence in technical analysis leads to complete disaster. Algorithms and 'foolproof' systems miscalculate market sentiment, driving massive capital into speculative traps. The subsequent bubble burst results in profound financial ruin.",
  },
  {
    name: 'Mercury aspect Jupiter in 5th house : Starts',
    description: "Flawed algorithms and over-confident technical models begin aggressively miscalculating market sentiment, blindly feeding massive capital directly into a disguised speculative trap.",
  },
  {
    name: 'Mercury aspect Ketu in 3rd house : Ends',
    description: "The total blackout of reliable data resolves, only to reveal total portfolio destruction. Weak calculation and platform freezes guaranteed massive, unpreventable losses.",
  },
  {
    name: 'Mercury aspect Ketu in 3rd house : Starts',
    description: "Trading platforms begin to experience erratic failures and data feeds actively glitch, deliberately masking the sharp, negative reversals orchestrating the impending crash.",
  },
  {
    name: 'Mercury aspect Moon in 6th house : Exact',
    description: "A highly dangerous combination of a fickle mind and poor calculation. Over-analyzing chaotic market data leads to severe panic selling at the exact wrong moment. Debt and margin pressures force the realization of massive, portfolio-ending losses.",
  },
  {
    name: 'Mercury aspect Moon in 6th house : Starts',
    description: "Over-analyzing chaotic data triggers the initial waves of deep financial anxiety and poor timing, right as margin debt reaches critical, unsustainable levels.",
  },
  {
    name: 'Mercury aspect Rahu in 9th house : Ends',
    description: "The catastrophic collapse of the fabricated international market is finalized. Extreme speculation in unregulated global markets yields permanent, unexpected losses.",
  },
  {
    name: 'Mercury aspect Rahu in 9th house : Starts',
    description: "Algorithmic illusions and complex foreign scams begin to heavily distort international market data, luring immense retail capital into a massive, unregulated trap.",
  },
  {
    name: 'Mercury aspect Saturn in 10th house : Starts',
    description: "Institutional algorithms begin actively pinning prices down. Technical analysis starts to completely fail as market makers systematically choke off all upward liquidity.",
  },
  {
    name: 'Mercury aspect Sun in 9th house : Ends',
    description: "The devastating fallout of manipulated macro-data. Investors realize their ego-driven long-term allocations were based on entirely fraudulent economic projections.",
  },
  {
    name: 'Mercury aspect Sun in 9th house : Starts',
    description: "Manipulated economic data and government reports begin circulating, feeding highly toxic false optimism and poor timing for fundamentally exposed long-term investors.",
  },
  {
    name: 'Moon Aspecting Ascendant (ASC) : Exact',
    description: "The investor is entirely consumed by a fickle mind and overwhelming panic. Emotional, erratic trading leads to selling the absolute bottom during a manipulated market dip, cementing sudden, severe, and irreversible portfolio destruction.",
  },
  {
    name: 'Moon Aspecting Midheaven (MC) : Exact',
    description: "Public perception of the market plummets due to extreme emotional panic. A fickle, fearful mindset drives massive retail sell-offs, which institutional manipulators use to completely drain liquidity and crash the major indices.",
  },
  {
    name: 'Pluto conjunct Saturn : Ends',
    description: "The systemic market collapse forcefully concludes. The total restructuring of financial markets leaves a barren landscape of destroyed over-leveraged portfolios and historic wealth annihilation.",
  },
  {
    name: 'Pluto conjunct Saturn : Starts',
    description: "The deep, structural decay of the financial system begins to violently fracture. Institutional manipulation sets the groundwork for a catastrophic, generation-defining market restructuring.",
  },
  {
    name: 'Rahu aspect Moon in 6th house : Exact',
    description: "Extreme psychological panic driven by massive, inescapable debt. Rahu causes immense illusion, and an afflicted Moon causes volatile emotional trading. Margin calls trigger erratic, desperate sell-offs, resulting in devastating, unrecoverable financial wipeouts.",
  },
  {
    name: 'Saturn aspect Rahu in 9th house : Ends',
    description: "The agonizing exposure of the massive global financial scam concludes. Investors are left with nothing as institutional giants finalize the total, brutal suppression of the fabricated market.",
  },
  {
    name: 'Saturn aspect Rahu in 9th house : Exact',
    description: "Karmic destruction of wealth through systemic market failure. Unpredictable, severe financial setbacks collide with extreme market illusions. Massive international fraud is suddenly exposed, resulting in the total collapse of global market sectors.",
  },
  {
    name: 'Saturn aspect Rahu in 9th house : Starts',
    description: "Massive international fraud and systemic market illusions begin to violently crack under the crushing weight of inevitable, severe institutional blockades.",
  },
  {
    name: 'Saturn aspect Sun in 9th house : Ends',
    description: "The brutal bear market suppression of global assets completes. Institutional gridlock has successfully suffocated all macro-economic growth, finalizing massive capital decay.",
  },
  {
    name: 'Saturn aspect Sun in 9th house : Exact',
    description: "A grim period of severe wealth destruction caused by heavy regulatory crackdowns or geopolitical stagnation. Unpredictable financial setbacks crush long-term investments as institutional giants actively suppress market growth, enforcing a brutal bear market.",
  },
  {
    name: 'Saturn aspect Sun in 9th house : Starts',
    description: "Governing bodies secretly begin signaling heavy regulatory crackdowns, initiating a slow, agonizing bleed in formerly secure long-term international investments.",
  },
  {
    name: 'Sun aspect Jupiter in 5th house : Ends',
    description: "The historic speculative crash bottoms out. The catastrophic wealth wipeout is complete, completely humbling ego-driven investors who bet heavily on engineered false optimism.",
  },
  {
    name: 'Sun aspect Jupiter in 5th house : Starts',
    description: "Extreme arrogance begins to heavily inflate a speculative bubble. Investors blindly follow ego-driven narratives directly into a fatally flawed, over-leveraged market setup.",
  },
  {
    name: 'Sun aspect Ketu in 3rd house : Ends',
    description: "The period of trading paralysis ends with total ruin. Caught in rapidly depreciating assets, the investor's ego-driven inability to execute an exit trade leads to complete capital destruction.",
  },
  {
    name: 'Sun aspect Ketu in 3rd house : Starts',
    description: "Sudden, sharp negative reversals begin to aggressively hit short-term trades, while the ego stubbornly refuses to cut losses early, setting up fatal trading paralysis.",
  },
  {
    name: 'Sun aspect Mars in 8th house : Starts',
    description: "Governing entities and massive institutions initiate sudden, aggressive regulatory bans or forced liquidations, sparking the very beginning of violent market destruction.",
  },
  {
    name: 'Sun aspect Mercury in 8th house : Ends',
    description: "The market fully absorbs the devastating regulatory shock. Poor calculation combined with extreme systemic manipulation leaves retail investors permanently stripped of their capital.",
  },
  {
    name: 'Sun aspect Mercury in 8th house : Starts',
    description: "Central banks or regulators prepare sudden, heavily manipulated data releases designed to shatter market confidence and trigger a massive, systemic liquidity contraction.",
  },
  {
    name: 'Sun aspect Moon in 6th house : Ends',
    description: "The devastating margin liquidation cycle permanently concludes. Ego-driven decisions and panic selling have completely finalized the total destruction of the debt-laden portfolio.",
  },
  {
    name: 'Sun aspect Moon in 6th house : Starts',
    description: "Government economic reports trigger initial, sharp market sell-offs, colliding dangerously with rising debt levels and sparking the beginnings of extreme emotional panic.",
  },
  {
    name: 'Sun aspect Rahu in 9th house : Ends',
    description: "The massive market illusion completely dissipates. Unrecoverable wealth destruction is cemented as the foreign Ponzi scheme fully collapses under aggressive regulatory scrutiny.",
  },
  {
    name: 'Sun aspect Rahu in 9th house : Starts',
    description: "Ego-driven investors begin funneling massive capital directly into high-level institutional scams or foreign Ponzi schemes, entirely blinded by the ultimate financial illusion.",
  },
  {
    name: 'Sun aspect Saturn in 10th house : Starts',
    description: "Governing bodies and institutional giants initiate a brutal, coordinated suppression of the market, draining vital liquidity to violently force a suffocating bear phase.",
  },
  {
    name: 'Sun aspect Sun in 9th house : Exact',
    description: "Macro-economic arrogance leads to absolute systemic market failure. Blind faith in failing national policies causes devastating losses. Ego-driven wrong decisions cause investors to hold bags in collapsing international markets until total bankruptcy.",
  },
  {
    name: 'Sun aspect Venus in 8th house : Ends',
    description: "The instantaneous destruction of wealth is finalized. The delisting or bankruptcy of major corrupt assets is complete, leaving over-confident retail investors with absolutely zero value.",
  },
  {
    name: 'Sun aspect Venus in 8th house : Starts',
    description: "Ego-driven decisions blind investors as government regulators suddenly begin to secretly freeze assets or prepare to delist massively corrupt, highly valued companies.",
  },
  {
    name: 'Uranus aspect Saturn in 10th house : Exact',
    description: "A sudden, violent fracture in established institutional markets. Unprecedented tech or infrastructure crashes collide with massive regulatory blockades, trapping liquidity and instantly destroying heavily leveraged positions.",
  },
  {
    name: 'Venus Aspecting Ascendant (ASC) : Exact',
    description: "Greed and the desire for luxury completely blind the investor to impending danger. An inflated sense of market safety leads to extreme over-exposure. When the sudden reversal hits, the heavily leveraged portfolio is decimated instantly.",
  },
  {
    name: 'Venus aspect Ketu in 3rd house : Starts',
    description: "Short-term trades begin to rapidly decay in value. Ketu introduces sudden emotional detachment, paralyzing the investor and preventing an exit as the liquidity trap is slowly sprung.",
  },
  {
    name: 'Venus aspect Moon in 6th house : Ends',
    description: "The massive financial distress concludes with total bankruptcy. The underlying toxic debt has fully imploded, permanently wiping out all capital lured by the initial market deception.",
  },
  {
    name: 'Venus aspect Moon in 6th house : Exact',
    description: "Deceptive market conditions shatter. Panic sets in as toxic loans and high-yield traps rapidly devalue. A fickle mind triggers massive financial distress as margin calls force catastrophic, unexpected liquidations.",
  },
  {
    name: 'Venus aspect Moon in 6th house : Starts',
    description: "Investors are aggressively lured into toxic loans or high-yield debt traps dangerously masked as safe opportunities. The grand illusion of safety sets the stage for a catastrophic liquidity crisis.",
  },
  {
    name: 'Venus aspect Rahu in 9th house : Starts',
    description: "Immense fluctuation in wealth begins as the ultimate financial illusion takes hold. Massive retail capital is blindly poured into highly orchestrated, entirely fraudulent offshore bubbles.",
  },
  {
    name: 'Venus aspect Saturn in 10th house : Ends',
    description: "The agonizing destruction of accumulated investor wealth concludes. Expected mergers, payouts, or dividends are permanently canceled, leaving capital hopelessly trapped in dead assets.",
  },
  {
    name: 'Venus aspect Saturn in 10th house : Starts',
    description: "Severe financial blockades begin to sharply materialize. Saturn creates sudden obstacles, delaying expected corporate payouts and actively freezing broader market liquidity.",
  },
  {
    name: 'Venus aspect Sun in 9th house : Ends',
    description: "The catastrophic international market crash is complete. Arrogant, heavy allocations into foreign luxury or global assets are permanently wiped out by sudden, unpreventable geopolitical events.",
  },
  {
    name: 'Venus aspect Sun in 9th house : Starts',
    description: "Over-confidence in global economic stability dangerously masks the hidden beginning of a sudden, brutal collapse in foreign markets or heavily inflated international luxury sectors.",
  },
  {
    name: 'Venus ruler of the 7th House in the 8th House',
    description: "Public markets and trading partnerships (7th house) become highly deceptive. Indicates severe market manipulation where hidden entities orchestrate sudden sell-offs. Investors face catastrophic losses due to breached contracts, delisting, or systemic betrayal.",
  }
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