const db = require('./career');

const events = [
  {
    name: 'Moon Transits the 8th House',
    description: "Sudden shifts in workplace dynamics and hidden agendas from colleagues may lower your professional confidence. Avoid signing new contracts or initiating projects today, as corporate funding and client commitments are highly unpredictable. Trust your intuition over office gossip to navigate sudden organizational restructuring or potential project terminations.",
  },
  {
    name: 'Moon aspect Venus in 8th house',
    description: 'A favorable time to reconnect with past professional contacts for mutual benefit. You may receive unexpected funding, a sudden lucrative contract, or a financial settlement from a previous project. Your professional magnetism is high, making it easier to attract investors or secure corporate resources.',
  },
  {
    name: 'Venus ruler of the 2nd House in the 8th House',
    description: "Financial gains come through corporate funding, bonuses, investor capital, or severance packages rather than standard salary. Navigating intense office politics and keeping project secrets close to your chest will ultimately lead to a lucrative breakthrough or professional liberation.",
  },
  {
    name: 'Venus ruler of the 7th House in the 8th house',
    description: 'A highly challenging placement for B2B relationships and client contracts. Expect difficulties with business partners, potential contract terminations, or sudden layoffs. Be acutely aware of betrayal or hidden clauses in agreements; significant professional lessons regarding trust are occurring now.',
  },
  {
    name: 'Moon aspect Mercury in 8th house',
    description: 'Deep investigative research leads to a professional breakthrough. You are on the brink of uncovering critical data or identifying a hidden flaw in a company project. Rely on your analytical hunches, but keep your findings confidential until you have full verification.',
  },
  {
    name: 'Mercury ruler of the 3rd House in the 8th House',
    description: 'Miscommunications with team members or immediate colleagues can lead to project breakdowns or departmental separation. This transit favors solitary, investigative work, auditing, or transitioning into roles requiring deep analysis and crisis management rather than collaborative team efforts.',
  },
  {
    name: 'Mercury ruler of the 6th House in the 8th House',
    description: 'Toxic workplace environments or severe disputes with subordinates may arise. There is a high risk of sudden layoffs, contract cancellations, or workplace lawsuits. Exercise extreme caution in your daily operations and avoid getting drawn into the operational failures of coworkers.',
  },
  {
    name: 'Moon aspect Mars in 8th house',
    description: 'Frustrations with management or sudden, aggressive workplace conflicts can drain your professional drive. You must take charge, eliminate inefficient workflows, and channel this intense energy into solving stalled projects rather than dwelling on corporate politics.',
  },
  {
    name: 'Mars ruler of the 1st House in the 8th House',
    description: 'A challenging period for your professional brand, marked by intense office politics or career struggles. However, overcoming these corporate hurdles builds unmatched resilience. You excel in crisis management roles; analyze why you are attracting certain professional blockages to initiate a career turnaround.',
  },
  {
    name: 'Mars ruler of the 8th House in the 8th House',
    description: 'Unmatched ability to handle workplace crises, corporate restructurings, or financial turnarounds. You possess a sharp strategic insight that allows you to foresee industry shifts. Your ability to keep sensitive company information confidential makes you invaluable to upper management.',
  },
  {
    name: 'Moon Transits the 9th House',
    description: 'Changes in corporate vision or leadership philosophy may cause temporary confusion. Outdated operational beliefs are breaking down as you align with a new professional direction. Favorable for international business, publishing, or seeking mentorship from senior figures to advance your career.',
  },
  {
    name: 'Moon aspect Sun in 9th house',
    description: 'Recognition from higher-ups or industry mentors boosts your professional standing. An excellent time for pitching large-scale, expansive projects or seeking guidance for long-term career advancement. Your corporate vision aligns perfectly with management goals today.',
  },
  {
    name: 'Sun ruler of the 5th House in the 9th House',
    description: 'Highly favorable for career growth, especially in education, creative direction, or advisory roles. Senior management or a seasoned mentor provides a major boost to your trajectory. Expect fortunate breaks, successful project pitches, and a strong sense of professional purpose.',
  },
  {
    name: 'Moon aspect Rahu in 9th house',
    description: 'Unconventional career paths or sudden international business opportunities present themselves. Beware of over-promising on massive, unrealistic projects driven by industry hype. Use this disruptive energy to innovate, but ground your proposals in reality.',
  },
  {
    name: 'Moon aspect Ketu in 3rd house',
    description: 'Your communication and coding/writing style differ significantly from the team norm, which is your true professional advantage. Step away from standard team dynamics and work independently to develop highly specialized, unconventional solutions for your current contracts.',
  },
  {
    name: 'Moon Transits the 10th House',
    description: "Fluctuations in public reputation or sudden shifts in management may come as a surprise. The company is experiencing structural renovations or temporary changes in project direction. Maintain professionalism and avoid reacting to mixed messages from superiors; the volatility will pass.",
  },
  {
    name: 'Sun Transits the 12th House',
    description: "A period to work behind the scenes on major projects or wrap up long-term contracts. High potential for professional burnout leading to a desire for paid time off or a sabbatical. Avoid launching high-visibility initiatives; focus instead on strategic planning and closing out lingering corporate debts.",
  },
  {
    name: 'Moon aspect Saturn in 10th house',
    description: 'Heavy responsibilities and a somber, uninspired mood dominate the workplace. Bureaucracy and lack of immediate recognition can be depressing. Perseverance is required; a continued focus on diligent execution will eventually solidify your professional reputation.',
  },
  {
    name: 'Saturn ruler of the 10th House in the 10th House',
    description: 'A slow, steady, and inevitable rise to the top of your industry. You command respect and are seen as an authoritative leader. This is an excellent time to ask for a structural promotion, secure long-term contracts, or assume major executive responsibilities.',
  },
  {
    name: 'Saturn ruler of the 11th House in the 10th House',
    description: 'Career gains come through alignment with influential industry veterans and long-term organizational goals. Building powerful, disciplined professional networks is key. Seek out powerful stakeholders; their seasoned guidance will secure your next major contract or promotion.',
  },
  {
    name: 'Moon Transits the 11th House',
    description: "Networking events or industry associations demand your time. Colleagues may constantly seek your input, but beware of time-wasting collaborations that drain your productivity. Focus on professional connections that offer tangible ROI rather than office socializing.",
  },
  {
    name: 'Moon aspect Jupiter in 5th house',
    description: 'Creative projects and speculative business ventures are highly favored. An excellent time for team-building exercises, boosting departmental morale, and pitching innovative solutions that require expansive, out-of-the-box thinking.',
  },
  {
    name: 'Jupiter ruler of the 9th House in the 5th House',
    description: 'Stepping into a mentorship, training, or advisory role will bring significant professional success. Exceptional luck with new business pitches, creative contracts, or educational projects. Your strategic advice is highly sought after by senior management.',
  },
  {
    name: 'Jupiter ruler of the 12th House in the 5th House',
    description: 'Success in behind-the-scenes creative work, R&D, or international investments. You are developing hidden professional talents that will soon become lucrative. Trust your strategic intuition when navigating complex or obscure corporate projects.',
  },
  {
    name: 'Moon Transits the 12th House',
    description: 'Office dynamics feel emotionally draining, and corporate politics cause unnecessary anxiety. Consider taking remote work days or paid time off. Focus on wrapping up outstanding administrative tasks rather than starting new, high-visibility projects.',
  },
  {
    name: 'Mars aspect Jupiter in 5th house',
    description: 'High energy for creative, speculative, or high-risk business ventures. Taking bold, calculated risks in project management pays off handsomely. Highly favorable for careers in entertainment, sports, or aggressive financial trading.',
  },
  {
    name: 'Sun in 9th (Dispositor)',
    description: 'Leadership demands absolute integrity. Legal contracts, international compliance, or publishing deals are highlighted. A pivotal business trip or corporate retreat may bring significant professional freedom and align you with the company’s higher vision.',
  },
  {
    name: 'Moon aspect Moon in 6th house',
    description: "High emotional labor is required at work today. Supporting overwhelmed colleagues or subordinates takes a toll on your productivity. Maintain professional boundaries, offer diplomatic support, and focus heavily on day-to-day operational details.",
  },
  {
    name: 'Moon ruler of the 4th House in the 6th House',
    description: 'Work-from-home challenges or the blurring of professional and personal boundaries cause stress. Navigating departmental debts, budget constraints, or foundational structural flaws in current projects will require significant operational oversight.',
  },
  {
    name: 'Moon Transits the 1st House',
    description: 'Stepping into a new role or launching a new personal initiative at work. Heightened professional intuition helps you navigate office dynamics with ease. Projecting confidence today ensures you control the narrative of your career trajectory.',
  },
  {
    name: 'Moon Transits the 2nd House',
    description: 'Focus on salary, departmental budgets, and resource management. Avoid impulsive professional expenses or launching underfunded projects. A good day for internal financial reviews rather than aggressive salary or contract negotiations.',
  },
  {
    name: 'Venus aspect Moon in 6th house',
    description: 'Favorable for improving the physical workspace, team morale, and daily operational aesthetics. A diplomatic, tactful approach smooths over daily workflow conflicts with subordinates or vendors. Excellent for HR professionals.',
  },
  {
    name: 'Mercury in 8th (Dispositor)',
    description: 'A deep dive into company analytics, auditing, or competitive research. Uncovering hidden flaws in a contract, codebase, or project plan will save the department from future disaster. Excellent for roles requiring extreme investigative focus.',
  },
  {
    name: 'Moon Transits the 3rd House',
    description: "Excellent for short business trips, corporate communications, and team brainstorming sessions. Professional adaptability brings new project opportunities. Avoid getting caught up in distracting office rumors or spreading unverified corporate news.",
  },
  {
    name: 'Venus Transits the 1st House',
    description: 'Enhanced professional charm and charisma make this an excellent time for client-facing meetings, sales pitches, or personal branding updates. Higher-ups and clients are naturally drawn to your presentations and proposals.',
  },
  {
    name: 'Moon Transits the 4th House',
    description: 'Focus shifts to foundational business structures, office leases, or real estate projects. You may seek emotional security through job stability today. If possible, working remotely will enhance your productivity and professional peace of mind.',
  },
  {
    name: 'Mars aspect Moon in 6th house',
    description: 'Workplace friction and irritable colleagues cause significant operational distress. High risk of professional burnout from overworking or micromanaging. Avoid getting drawn into petty disputes; focus strictly on executing your tasks.',
  },
  {
    name: 'Uranus conjunct Venus',
    description: 'Sudden, unexpected lucrative contracts, bonuses, or job offers materialize out of nowhere. A radical shift in career direction, potentially towards tech, innovation, or highly unconventional fields. Be prepared for a fast-paced influx of professional opportunities.',
  },
  {
    name: 'Mars in 8th (Dispositor)',
    description: 'Thriving in high-pressure corporate environments. You are perfectly positioned to lead turnaround strategies for failing projects, manage major organizational restructurings, or execute aggressive competitive research.',
  },
  {
    name: 'Moon Transits the 5th House',
    description: 'Pitching creative solutions and highly innovative projects meets with optimism. Good rapport with junior colleagues or mentees. Ensure you do not lose focus or daydream during critical, detail-oriented strategy meetings.',
  },
  {
    name: 'Mars Transits the 12th House',
    description: 'Beware of hidden professional competitors or colleagues attempting to steal your ideas. High stress and potential for burnout are prevalent. Work independently, protect your intellectual property, and avoid sharing confidential strategies.',
  },
  {
    name: 'Mercury aspect Jupiter in 5th house',
    description: 'Brilliant strategic planning and corporate forecasting. Excellent for tech-related projects, publishing, or launching internal training programs. Your innovative ideas attract positive reinforcement from stakeholders and investors.',
  },
  {
    name: 'Sun aspect Moon in 6th house',
    description: 'A critical look at daily work habits prompts you to implement new systems to increase operational productivity. Recognition comes for your day-to-day diligence and ability to streamline inefficient team processes.',
  },
  {
    name: 'Sun Transits the 1st House',
    description: 'Taking charge and stepping into the professional spotlight. An excellent time to demonstrate leadership, push aggressively for a promotion, or spearhead a major corporate initiative. Command the room with renewed purpose.',
  },
  {
    name: 'Mercury Transits the 12th House',
    description: 'Strategic planning done best in isolation. Overseas contracts or multinational corporate communications are favored. Keep new business ideas and tech innovations confidential until they are fully developed and protected.',
  },
  {
    name: 'Ketu aspect Sun in the 9th house: Exact',
    description: 'Deep disillusionment with upper management or the company’s long-term vision. Potential clashes with corporate authorities or legal compliance issues. You may experience a sudden desire to leave a restrictive job to align with your true ethics.',
  },
  {
    name: 'Venus Aspecting Ascendant (ASC)',
    description: "Smoothing over professional relationships and building lucrative networks. A fantastic period for job interviews, client lunches, and forming mutually beneficial business partnerships. Ensure your charm is backed by solid deliverables.",
  },
  {
    name: 'Jupiter in 5th (Dispositor)',
    description: 'High success rate for speculative projects, product launches, or creative direction. A period of immense professional expansion where you may step into a highly respected advisory role or successfully train new industry talent.',
  },
  {
    name: 'Moon Transits the 6th House',
    description: 'Focus heavily on clearing the inbox, managing administrative tasks, and operational troubleshooting. Be wary of office gossip and unstable dynamics among subordinates. Do not let workplace anxieties affect your physical health.',
  },
  {
    name: 'Moon Transits the 7th House',
    description: 'Unpredictable business partners or volatile clients require careful handling. Contract negotiations may stall or change direction unexpectedly. Remain adaptable, maintain diplomacy, and do not panic over temporary B2B uncertainties.',
  },
  {
    name: 'Saturn aspect Sun in 9th house',
    description: 'Structural changes in corporate leadership or delays in international projects. A testing period for your professional ethics and long-term vision. Bureaucratic red tape may temporarily block your advancement; discipline is essential.',
  },
  {
    name: 'Venus Transits the 2nd House',
    description: 'Highly favorable for salary negotiations, asking for a raise, and closing lucrative deals. Financial prosperity comes through creative, design-oriented, or client-facing work. A great time to secure budget approvals for aesthetic or luxury projects.',
  },
  {
    name: 'Venus aspect Venus in 8th house',
    description: 'Deepening lucrative business partnerships and B2B alliances. You may receive a sudden bonus, severance package, or secure massive funding for a major project. Charismatic negotiations yield significant financial power and corporate leverage.',
  },
  {
    name: 'Sun Aspecting Ascendant (ASC)',
    description: "High visibility and recognition from upper management. An excellent period to pitch yourself for leadership roles, command authority in meetings, and spearhead new corporate initiatives that elevate your public professional standing.",
  },
  {
    name: 'Mercury Aspecting Ascendant (ASC)',
    description: "A strong period for corporate communications, PR, public speaking, and complex contract drafting. Networking and clearly articulating your professional ideas will yield tangible, fast-paced results in your career.",
  },
  {
    name: 'Venus aspect Mercury in 8th house',
    description: 'Diplomatic resolution to complex financial contracts or severance negotiations. You have a talent for discovering hidden corporate resources or securing unexpected funding for your department. Excellent for forensic accounting or HR resolutions.',
  },
  {
    name: 'Venus aspect Mars in 8th house',
    description: 'High-stakes corporate negotiations. A magnetic but potentially volatile professional energy; use it to aggressively pursue corporate funding or close major B2B deals, but be mindful not to alienate key stakeholders with overly aggressive tactics.',
  },
  {
    name: 'Mars aspect Venus in 8th house',
    description: 'Intense drive for financial dominance in business partnerships. You are fiercely competitive in securing funding or closing contracts. Beware of aggressive tactics that might burn bridges with key clients or investors.',
  },
  {
    name: 'Venus Transits the 3rd House',
    description: 'Excellent transit for sales, marketing, and corporate communications. Short business trips are successful and yield pleasant client relations. Good rapport with team members makes collaborative design or writing projects run smoothly.',
  },
  {
    name: 'Mercury Transits the 2nd House',
    description: 'Strategic financial planning takes center stage. An excellent time to review project budgets, negotiate vendor contracts, analyze market data, and optimize departmental revenue streams. Sales and commerce-driven roles will prosper.',
  },
  {
    name: 'Sun Transits the 2nd House',
    description: 'Focus heavily on corporate earnings, departmental budgets, and your personal salary. Be cautious of unexpected organizational expenses, sudden budget cuts, or business partners creating a financial drain on shared resources.',
  },
  {
    name: 'Mercury Transits the 1st House',
    description: 'Clear, articulate communication of your professional goals. A great time to present new ideas to the board, engage in technical training, or update your resume. Your intellectual agility opens doors for new project leadership.',
  },
  {
    name: 'Mars Transits the 1st House',
    description: 'High ambition and relentless drive to conquer workplace challenges. Excellent for initiating new, demanding projects, but beware of coming off as overly aggressive or insubordinate to colleagues and management. Avoid careless operational mistakes.',
  },
  {
    name: 'Mars aspect Ketu in 3rd house',
    description: 'Sudden disruptions in business travel, logistics, or communication lines. Frustration with team dynamics or incompetent colleagues. A project may unexpectedly halt; you must pivot your strategy rather than forcing a stalled initiative.',
  },
  {
    name: 'Mercury aspect Venus in 8th house',
    description: 'Smooth and tactful negotiations regarding corporate restructuring, mergers, or shared budgets. Highly favorable for professionals in finance, HR, or legal drafting who need to communicate complex, sensitive corporate transitions.',
  },
  {
    name: 'Sun aspect Venus in 8th house',
    description: "Navigating intense corporate politics regarding funding, bonuses, or equity. Let go of past professional grievances or failed contracts to secure new, lucrative partnerships. Clinging to old workplace resentments will paralyze your advancement.",
  },
  {
    name: 'Mercury aspect Mercury in 8th house',
    description: 'Deep, uninterrupted focus on complex technical, analytical, or auditing tasks. You possess the mental acuity to uncover critical data that alters the course of a major project. Trust your analytical instincts to solve deeply embedded system issues.',
  },
  {
    name: 'Venus aspect Sun in 9th house',
    description: 'Highly favorable for international business trips, publishing, or global marketing campaigns. Mentorship from female leaders or senior executives brings significant career advancement and opens doors to lucrative opportunities.',
  },
  {
    name: 'Mars Aspecting Ascendant (ASC)',
    description: "Taking decisive, bold action in your career. High energy for leadership and executing difficult tasks, but avoid unnecessary conflicts with management or burning out your team through overly aggressive project timelines.",
  },
  {
    name: 'Venus aspect Rahu in 9th house',
    description: 'Sudden, unconventional international business opportunities arise. Favorable for disruptive marketing campaigns, securing foreign contracts, and expanding your corporate vision. Legal matters regarding intellectual property conclude positively.',
  },
  {
    name: 'Venus aspect Ketu in 3rd house',
    description: 'Reconnecting with past professional networks yields surprising benefits. Unusual marketing or sales strategies produce unexpected results. Short, sudden business trips may lead to highly lucrative, unconventional partnerships.',
  },
  {
    name: 'Mercury aspect Mars in 8th house',
    description: "Sharp, incisive analytical skills are at your disposal. Excellent for auditing, debugging, crisis communication, or forensic accounting. Focus intensely on solving the core problem and do not waste time on irrelevant corporate data.",
  },
  {
    name: 'Mercury Transits the 3rd House',
    description: 'High productivity in administrative tasks, sales, and coding. An excellent time for brainstorming sessions, drafting project proposals, and optimizing logistics. Purchasing new tech equipment for the business will yield a high ROI.',
  },
  {
    name: 'Mars aspect Mercury in 8th house',
    description: "Fast-paced problem solving in corporate crisis situations. Your investigative skills easily cut through bureaucracy to find the hidden data. Avoid getting sidetracked by office debates; let your strategic inner voice direct your focus.",
  },
  {
    name: 'Jupiter Transits the 4th House',
    description: 'Expanding real estate portfolios or upgrading your work-from-home capabilities. Favorable for foundational business growth, securing corporate infrastructure, and creating a highly supportive, profitable workplace culture.',
  },
  {
    name: 'Jupiter aspect Venus in 8th house',
    description: 'Massive financial gains through corporate mergers, end-of-year bonuses, or external venture capital. Successful resolution of corporate debts and loans provides your department with newfound financial freedom and operational leverage.',
  },
  {
    name: 'Sun aspect Mercury in 8th house',
    description: 'High-level strategic reviews of company performance. You are questioning the structural integrity of current projects, leading to the uncovering of systemic issues and the proposition of deep, transformative corporate solutions.',
  },
  {
    name: 'Mercury aspect Sun in 9th house',
    description: 'Excellent communication with higher management, stakeholders, or international clients. Successful presentations and pitches for expansive projects align perfectly with the broader organizational vision. Expect a pivotal message from a mentor.',
  },
  {
    name: 'Mercury aspect Ketu in 3rd house',
    description: 'Miscommunications, lost emails, and tech glitches heavily disrupt work. Reevaluate your sales or communication strategy, as traditional methods will fail today. Think outside the box to solve logistical issues and listen carefully to frustrated team members.',
  },
  {
    name: 'Mercury aspect Rahu in 9th house',
    description: 'Unconventional approaches to international trade, corporate training, or massive scalability projects. Forward-thinking ideas that disrupt industry norms will succeed, though conservative management may initially resist your radical proposals.',
  },
  {
    name: 'Venus Transits the 4th House',
    description: 'Improving office aesthetics or investing in a premium work-from-home setup. Highly favorable for professionals in real estate, architecture, or family-run businesses. A lucrative time to secure foundational business assets.',
  },
  {
    name: 'Sun aspect Mars in 8th house',
    description: 'Intense clashes with authority figures or toxic corporate politics. Uncovering hidden sabotage or professional humiliation triggers a defensive response. Use this tension to fuel a major career pivot or execute a ruthless, necessary project overhaul.',
  },
  {
    name: 'Venus Aspecting Midheaven (MC)',
    description: 'High professional charm and diplomacy. Extremely favorable for securing promotions, public relations, and building a strong, favorable reputation with upper management. Ensure your charismatic networking is backed by solid financial decisions.',
  },
  {
    name: 'Saturn in 10th (Dispositor)',
    description: 'A heavy workload causing severe professional dissatisfaction and potential burnout. You feel unappreciated by management despite diligent execution. A critical time to either grind through the responsibilities or strategically plan an exit to a more fulfilling role.',
  },
  {
    name: 'Jupiter Aspecting Midheaven (MC)',
    description: 'Major career expansion and public visibility. An excellent time to ask for a promotion, launch a new enterprise, or take on high-level leadership. Ensure these new expansive roles align with your long-term financial security.',
  },
  {
    name: 'Sun Transits the 3rd House',
    description: 'Taking decisive charge of team projects. High ambition drives success in sales, marketing, and corporate negotiations. Effective, authoritative communication ensures subordinates and colleagues follow your lead without hesitation.',
  },
  {
    name: 'Mars aspect Mars in 8th house',
    description: 'Relentless drive to conquer complex, hidden problems at work. Excellent for crisis management, deep technical debugging, or aggressive corporate turnarounds. You will tenaciously force projects to completion regardless of the obstacles.',
  },
  {
    name: 'Venus aspect Saturn in 10th house',
    description: 'Assuming heavy corporate responsibilities gracefully. Slow but steady career advancement is guaranteed through discipline. Diplomacy is needed to navigate older, rigid management structures who may feel threatened by your modern talents.',
  },
  {
    name: 'Sun Transits the 12th House',
    description: 'Working behind the scenes on confidential initiatives. Wrapping up projects and retiring obsolete workflows. A strong need for professional rest and boundary setting, as managing overwhelmed colleagues is causing severe burnout.',
  },
  {
    name: 'Mercury aspects the Moon in the 6th house',
    description: 'High productivity in daily tasks and operational troubleshooting. Excellent communication with subordinates and team members leads to effective workflow optimization. A great day to implement new software or organizational systems.',
  },
  {
    name: 'Sun Transits the 2nd House',
    description: 'Intense focus on corporate earnings, ROI, and personal salary. Be highly cautious of unexpected departmental expenses, budget cuts, or business partners draining shared financial resources. Audit your project budgets closely.',
  },
  {
    name: 'Sun Transits the 3rd House',
    description: 'Commanding authority in team communications and short-term logistics. Your ambitious drive allows you to tackle stalled projects without procrastination. Short business trips yield valuable competitive intelligence.',
  },
  {
    name: 'Mars Transits the 2nd House',
    description: 'Aggressive pursuit of revenue, sales, and bonuses. However, impulsive corporate spending or burning through departmental budgets is a major risk. Beware of using abrupt, combative language during financial negotiations.',
  },
  {
    name: 'Mercury Transits the 4th House',
    description: 'Favorable for working from home, organizing foundational business documents, or conducting internal corporate training. Communications center around securing office leases or restructuring foundational team dynamics.',
  },
  {
    name: 'Pluto conjunct Saturn',
    description: 'Massive structural changes in the industry or your specific workplace. Intense pressure and heavy executive responsibilities test your limits. Surviving corporate purges and organizational restructuring requires extreme discipline and time management.',
  },
  {
    name: 'Sun aspects Sun in 9th house',
    description: 'Strong alignment with the broader corporate vision. Positive interactions with executive mentors and highly successful international projects. Your professional judgment is sharp, leading to expansive career growth and leadership opportunities.',
  },
  {
    name: 'Sun aspect Ketu in the 3rd house',
    description: 'Setbacks in negotiations, sales pitches, or marketing campaigns due to a lack of team cohesion. A feeling of professional isolation or humiliation. Learn from these logistical failures to deeply refine your communication strategy.',
  },
  {
    name: 'Sun aspect Rahu in 9th house',
    description: 'Questioning the ethical direction of the company or the validity of a major project. Disillusionment with senior management causes professional confusion. You are seeking unconventional, disruptive paths for career growth outside the standard corporate ladder.',
  },
  {
    name: 'Venus Transits the 5th House',
    description: 'Highly favorable for speculative investments, creative direction, and pitching innovative, aesthetically pleasing projects. A harmonious, fun workplace environment fosters excellent team collaboration. Luck is on your side for high-risk business ventures.',
  },
  {
    name: 'Mars aspect Sun in 9th house',
    description: 'Boldly pushing for expansive projects and international growth. Expect friction with senior management or mentors over the company’s strategic direction. High energy for demanding business travel and aggressive corporate expansions.',
  },
  {
    name: 'Mars aspect Rahu in 9th house',
    description: 'Sudden disruptions in international logistics, legal contracts, or higher education projects. Severe clashes with rigid corporate structures or incompetent professors/mentors. You must aggressively search for a new strategic paradigm.',
  },
  {
    name: 'Jupiter aspect Saturn in 10th house',
    description: 'The ultimate transit for long-term career success. Hard work and strict discipline pay off with a major executive promotion, industry recognition, or a highly successful business launch. You are entering a powerful cycle of corporate authority.',
  },
  {
    name: 'Sun Transits the 4th House',
    description: 'Focus turns to internal company dynamics, office politics, and foundational security. Potential desires to relocate for a new role or establish a permanent home office. Ensure your operational base is secure before launching new public initiatives.',
  },
  {
    name: 'Sun Aspecting Midheaven (MC)',
    description: 'Peak career visibility and public recognition. Taking the lead on major initiatives puts you in the spotlight. Upper management is closely watching your successes; ensure your actions align with the company’s highest objectives.',
  },
  {
    name: 'Venus aspect Jupiter in 5th house',
    description: 'Extremely favorable for creative professionals, designers, and investors. Financial windfalls through speculative projects, corporate bonuses, or successful product launches. Your expansive, artistic vision is highly profitable now.',
  },
  {
    name: 'Sun aspect Saturn in 10th house',
    description: 'Frustrations with slow corporate bureaucracy or feeling blocked by older, conservative management. A severe test of professional endurance and discipline. Avoid insubordination; navigate the structural pressure with meticulous compliance.',
  },
  {
    name: 'Venus Transits the 6th House',
    description: 'Harmonious relationships with coworkers and subordinates. Favorable for HR professionals, team-building, and improving daily operational workflows. A diplomatic approach easily resolves any lingering office disputes.',
  },
  {
    name: 'Mars Transits the 3rd House',
    description: 'Highly competitive drive in sales, marketing, and contract negotiations. Fast-paced problem solving is your asset, but there is a high potential for aggressive arguments with teammates. Use this courage to secure difficult accounts.',
  },
  {
    name: 'Mars Aspecting Midheaven (MC)',
    description: 'Aggressive pursuit of career goals and executive dominance. A time to boldly ask for what you want or launch independent ventures. Beware of appearing too ruthless or combative to higher-ups, which could trigger professional backlash.',
  },
  {
    name: 'Mercury Aspecting Midheaven (MC)',
    description: 'Clear, authoritative communication of your professional objectives. Excellent for public relations, corporate presentations, and drafting reports for stakeholders. Your intellectual output directly influences your public career reputation.',
  },
  {
    name: 'Mercury aspect Saturn in 10th house',
    description: 'Stalled negotiations and heavy bureaucratic red tape. Focus on meticulous planning, compliance, and structural adjustments rather than pitching radical new ideas. Management is highly risk-averse right now.',
  },
  {
    name: 'Sun Transits the 5th House',
    description: 'Stepping into a creative leadership role. Favorable for corporate training, mentoring junior staff, and presenting highly innovative ideas to the board. Your confidence and expansive vision naturally attract investors and followers.',
  },
  {
    name: 'Mars aspect Saturn in 10th house',
    description: 'Severe workplace friction and blocked ambitions. Feeling trapped in a demanding job with rigid management or government compliance issues. Corporate restructuring causes deep frustration, yet you feel tethered by financial responsibilities.',
  },
  {
    name: 'Mercury Transits the 5th House',
    description: 'Brilliant creative brainstorming and technical problem-solving. Excellent for writing complex proposals, drafting technical documentation, or speaking at industry events. You possess a compelling need to teach and present your discoveries.',
  },
  {
    name: 'Jupiter aspect Mercury in 8th house',
    description: 'High-level strategic financial planning and deep market research. Uncovering lucrative market gaps or hidden corporate assets. Excellent for auditing, psychological profiling in marketing, and executing complex corporate strategy.',
  },
  {
    name: 'Venus Transits the 7th House',
    description: 'Highly favorable for signing new client contracts, forming lucrative joint ventures, and smoothing over B2B relations. Your diplomatic skills and professional charm easily secure buy-in from key stakeholders and business partners.',
  },
  {
    name: 'Saturn aspect Rahu in 9th house',
    description: 'Navigating complex legal, international, or compliance issues. Karmic professional debts surface. You face strict ethical tests in the workplace that require absolute adherence to rules and the dismantling of unrealistic corporate projections.',
  },
  {
    name: 'Mercury Transits the 6th House',
    description: 'High focus on technical skills, coding efficiency, and administrative precision. Travel for routine operational duties is likely. Watch out for miscommunications with subordinates, contractors, or IT failures that weaken productivity.',
  },
  {
    name: 'Sun aspect Jupiter in the 5th house',
    description: 'Massive optimism and success in speculative projects or product launches. Taking on an esteemed advisory or consultancy role. Expanding your professional influence and securing highly profitable investments.',
  },
  {
    name: 'Sun Transits the 6th House',
    description: 'The daily grind and operational hard work take precedence. Managing difficult subordinates, navigating a highly demanding boss, or surviving a high-stress workplace. Focus strictly on efficiency and eliminating bad operational habits.',
  },
  {
    name: 'Mars Transits the 4th House',
    description: 'Internal conflicts within the company regarding infrastructure, office leases, or foundational business structures. High stress in a work-from-home environment. Avoid destructive arguments with co-founders or internal management.',
  },
  {
    name: 'Mercury Transits the 7th House',
    description: 'Active, fast-paced contract negotiations. Favorable for B2B communications, finalizing joint ventures, and resolving logistical disputes with business partners. Incorporate outside perspectives to break a professional stalemate.',
  },
  {
    name: 'Sun Transits the 7th House',
    description: 'Dealing with dominant business partners or highly demanding key clients. Extreme diplomacy is required to maintain balanced corporate relationships. Allow key stakeholders to feel in control to avoid deal-breaking disruptions.',
  },
  {
    name: 'Jupiter Transits the 5th House',
    description: 'Massive expansion of creative projects and product lines. Great success in speculative markets, tech, entertainment, or education sectors. Gaining industry recognition for your specialized expertise and cutting-edge ideas.',
  },
  {
    name: 'Mars Transits the 5th House',
    description: 'Fierce competitive drive in creative fields or speculative markets. Pitching projects aggressively. Beware of conflicts with junior staff or taking reckless, impulsive financial risks on unverified business models.',
  },
  {
    name: 'Sun Transits the 8th House',
    description: 'Navigating severe corporate crises or restructurings. Potential for sudden changes in departmental funding or executive power struggles. Address unpaid corporate debts or compliance issues immediately to avoid professional humiliation.',
  },
  {
    name: 'Rahu Transits the 10th House',
    description: 'Expect massive, fated shifts in your career trajectory. An absolute overhaul of your industry or workplace. You may experience a sudden rise to executive power or an abrupt pivot to a completely new profession. Relocation for career advancement is highly likely.',
  },
  {
    name: 'Ketu Transits the 4th House',
    description: 'Detachment from office politics and internal company dynamics. Potential relocation or feeling ungrounded in your current position due to a sudden career loss or shift. Favorable for independent, highly isolated technical or research work.',
  },
  {
    name: 'Mercury Transits the 8th House',
    description: 'Deep dive into corporate intelligence, auditing, or crisis communication. Discovering crucial, hidden information that entirely shifts project trajectories. Keep meticulous records of this sensitive data for future leverage.',
  },
  {
    name: 'Ketu aspect Mars in 8th house',
    description: 'Uncovering and resolving deep-seated workplace resentments and hidden operational failures. Highly favorable for technical debugging, forensic accounting, or executing swift, necessary corporate cuts and restructuring.',
  },
  {
    name: 'Rahu aspect Moon in the 6th house',
    description: 'Unconventional approaches to daily operations and team management. Beware of toxic office gossip, sudden staffing changes, or obsessive operational perfectionism leading to severe professional burnout.',
  },
  {
    name: 'Sun Transits the 9th House',
    description: 'Aligning with a broader, highly optimistic corporate vision. Favorable for international business expansions, legal affairs, and higher-level executive training. Mentorship from senior leaders shifts your career trajectory positively.',
  },
  {
    name: 'Mercury Transits the 9th House',
    description: 'Learning new, expansive technical skills or industry methodologies. Favorable for publishing, international corporate communications, and acting as an agile corporate trainer. Progressive ideas open massive new market opportunities.',
  },
  {
    name: 'Venus Transits the 8th House',
    description: 'Complex, high-stakes financial negotiations. Securing venture funding, bonuses, or executive severance. Be highly wary of hidden clauses in contracts or unreliable business partners failing to deliver on financial promises.',
  },
  {
    name: 'Mercury Transits the 10th House',
    description: 'High visibility in corporate communications and executive strategy meetings. Excellent for public relations, negotiating promotions, and drafting pivotal business plans. Ensure all lines of communication with stakeholders are open.',
  },
  {
    name: 'Sun Transits the 10th House',
    description: 'The absolute peak of professional recognition. Stepping into ultimate executive authority, securing major promotions, and commanding deep respect in your industry. A highly successful period for job interviews and launching public initiatives.',
  },
  {
    name: 'Jupiter aspect Mars in 8th house',
    description: 'Strategic execution of highly complex, high-risk projects. Favorable for executing corporate turnarounds, securing massive external funding, and making breakthrough discoveries in R&D or deep tech sectors.',
  },
  {
    name: 'Moon Aspecting Midheaven (MC)',
    description: 'Intuitive navigation of corporate politics is required. Your professional reputation is closely tied to your emotional intelligence and adaptability in leadership. Avoid letting temporary office moods dictate long-term strategic decisions.',
  },
  {
    name: 'Mercury Transits the 11th House',
    description: 'Expanding your professional network with highly progressive, tech-oriented, or forward-thinking groups. Favorable for team collaborations, agile project management, and receiving optimistic news regarding long-term business goals.',
  },
  {
    name: 'Moon Aspecting Ascendant (ASC)',
    description: 'High emotional intelligence is required in your professional dealings. Your personal brand is highly visible; maintain strict composure under pressure and do not let fluctuating office dynamics affect your leadership presence.',
  },
  {
    name: 'Venus Transits the 9th House',
    description: 'Favorable for international B2B relations, corporate retreats, and aligning your career with your highest ethical ideals. Success in legal matters, corporate compliance, and publishing. A highly liberating professional period.',
  },
  {
    name: 'Sun Transits the 11th House',
    description: 'Gaining immense support from powerful industry figures and executive authorities. Successful networking, achieving long-term professional revenue goals, and securing corporate bonuses. Align closely with influential organizational leaders.',
  },
  {
    name: 'Venus Transits the 10th House',
    description: 'Enhancing your professional public image and corporate brand. Tremendous success in PR, design, marketing, or diplomacy-related fields. A harmonious, highly lucrative period for expanding your career footprint.',
  },
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