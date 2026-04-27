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
    name: 'Ketu aspect Sun in the 9th house',
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
    {
      name: 'Jupiter Aspecting Midheaven (MC) : Ends',
      description: 'The window of peak public recognition and expansive career growth is closing. Finalize any major architectural pitches or executive promotion requests now, as the momentum shifts towards maintaining the systems you have built rather than launching new ones.',
    },
    {
      name: 'Jupiter aspect Jupiter in 5th house : Exact',
      description: 'Peak intellectual luck and creative expansion. An incredibly auspicious moment for solving complex logic puzzles, finalizing high-level system architecture, or making successful speculative trades. Your resource optimization strategies yield massive returns today.',
    },
    {
      name: 'Jupiter aspect Mars in 8th house : Ends',
      description: 'The period of aggressive, expansive pushes for corporate funding or deep crisis management is concluding. The pressure of navigating hidden workplace politics or tackling deep-seated legacy issues subsides, leaving a more stabilized environment.',
    },
    {
      name: 'Jupiter aspect Mars in 8th house : Exact',
      description: 'Explosive energy for uncovering hidden corporate resources or aggressively executing a complex technical turnaround. You possess the strategic optimism to conquer deep structural debts and secure vital funding for stalled team initiatives.',
    },
    {
      name: 'Jupiter aspect Mars in 8th house : Starts',
      description: 'Entering a phase of heightened, strategic action regarding shared corporate resources, venture capital, or deeply hidden project flaws. You will feel an expansive drive to eliminate inefficiencies and overhaul failing systems.',
    },
    {
      name: 'Jupiter aspect Moon in 6th house : Ends',
      description: 'The period of enhanced emotional support and buoyant morale within your daily operational routines fades. You must now rely on established discipline rather than enthusiasm to manage your daily tasks and subordinate relationships.',
    },
    {
      name: 'Jupiter aspect Moon in 6th house : Exact',
      description: 'Tremendous harmony and optimism in your daily workflow. An excellent day for mentoring junior team members, resolving HR disputes, and naturally improving team morale. Your intuitive approach to resource allocation feels effortless and highly supported.',
    },
    {
      name: 'Jupiter aspect Moon in 6th house : Starts',
      description: 'A wave of positive, nurturing energy enters your daily work life. You begin to find greater meaning in your daily routines, and relationships with coworkers or reports naturally improve through your empathetic guidance.',
    },
    {
      name: 'Jupiter aspect Venus in 8th house : Ends',
      description: 'The phase of easy access to hidden corporate funding, sudden bonuses, or lucrative severance negotiations wraps up. Secure any pending financial partnerships or equity discussions immediately.',
    },
    {
      name: 'Jupiter aspect Venus in 8th house : Starts',
      description: 'A highly lucrative period begins, favoring deep-level financial negotiations, corporate mergers, or sudden influxes of venture capital. Your diplomatic approach to navigating hidden office politics will yield significant financial windfalls.',
    },
    {
      name: 'Ketu aspect Mars in 8th house : Exact',
      description: 'A surgical severance of toxic workplace elements or dead-end projects. You possess the detached precision to ruthlessly cut out operational bloat, terminate failing contracts, or aggressively refactor deeply flawed legacy structures without emotional hesitation.',
    },
    {
      name: 'Ketu aspect Sun in 9th house : Exact',
      description: 'A profound sense of disillusionment with upper management or the company’s grand vision. You may feel an overwhelming urge to step away from the traditional corporate ladder or an outdated mentorship to pursue a more authentic, independent professional path.',
    },
    {
      name: 'Mars Aspecting Midheaven (MC) : Ends',
      description: 'The aggressive drive and high-pressure push for executive dominance or career advancement cool down. The fierce competition for leadership roles subsides, allowing you to settle into your current level of authority.',
    },
    {
      name: 'Mars Aspecting Midheaven (MC) : Exact',
      description: 'Peak professional ambition and competitive drive. You are forcefully commanding authority and pushing major initiatives across the finish line. Beware of appearing too ruthless or combative with senior management as you assert your career goals.',
    },
    {
      name: 'Mars Aspecting Midheaven (MC) : Starts',
      description: 'A surge of intense ambition and drive for public career recognition begins. You will feel compelled to take decisive action, pursue promotions aggressively, and eliminate any obstacles blocking your path to the top.',
    },
    {
      name: 'Mars aspect Mars in 8th house : Exact',
      description: 'Intense, relentless focus on crisis management and resolving deep systemic failures. You are operating like a surgeon in a corporate emergency, fiercely dedicated to extracting the root cause of hidden project flaws or financial hemorrhaging.',
    },
    {
      name: 'Mars aspect Mars in 8th house : Starts',
      description: 'The onset of a highly pressurized period requiring extreme focus on obscured, complex problems. You will need to muster significant competitive energy to navigate impending corporate restructurings, audits, or deep technical debugging.',
    },
    {
      name: 'Mars aspect Mercury in 8th house : Ends',
      description: 'The period of fast-paced, highly critical communication regarding corporate crises or deep structural analytics concludes. The need for aggressive forensic accounting or intense debugging of complex logic issues finally eases.',
    },
    {
      name: 'Mars aspect Mercury in 8th house : Exact',
      description: 'Razor-sharp, aggressive communication and rapid problem-solving are highlighted. You possess a piercing intellect right now, perfect for cutting through corporate bureaucracy, arguing a critical technical pivot, or identifying fatal flaws in a contract.',
    },
    {
      name: 'Mars aspect Mercury in 8th house : Starts',
      description: 'Entering a phase of intense, rapid-fire mental activity focused on hidden data or crisis management. Expect heated debates over technical strategies, financial audits, or the restructuring of core operational logic.',
    },
    {
      name: 'Mars aspect Moon in 6th house : Ends',
      description: 'The acute emotional friction, coworker disputes, and daily operational burnout begin to dissipate. The workplace environment becomes less combative, allowing for physical and emotional recovery.',
    },
    {
      name: 'Mars aspect Moon in 6th house : Exact',
      description: 'High emotional volatility in the workplace. Agitation over inefficient workflows or incompetent colleagues may trigger aggressive responses. Channel this intense frustration into vigorously clearing administrative debt rather than clashing with coworkers.',
    },
    {
      name: 'Mars aspect Moon in 6th house : Starts',
      description: 'A period of heightened workplace tension and operational stress begins. Be prepared to actively manage your frustration with daily routines and avoid letting minor logistical hiccups escalate into major interpersonal conflicts.',
    },
    {
      name: 'Mars aspect Rahu in 9th house : Ends',
      description: 'The explosive urge to rebel against corporate authority, foreign management, or traditional industry standards subsides. The chaotic push for unorthodox, disruptive career paths begins to stabilize.',
    },
    {
      name: 'Mars aspect Rahu in 9th house : Exact',
      description: 'A highly disruptive and potentially explosive clash with senior management or corporate ideology. You are fiercely driven to break rules, disrupt traditional workflows, and force an unorthodox, high-risk strategy into play.',
    },
    {
      name: 'Mars aspect Rahu in 9th house : Starts',
      description: 'The beginning of an intense desire to challenge the status quo. You will feel a growing, aggressive impatience with conventional corporate wisdom and may start pushing for radical, unproven international or educational initiatives.',
    },
    {
      name: 'Mars aspect Saturn in 10th house : Ends',
      description: 'The immense frustration of applying maximum effort against rigid corporate bureaucracy finally lifts. The feeling of being professionally blocked or restricted by older management begins to clear.',
    },
    {
      name: 'Mars aspect Saturn in 10th house : Exact',
      description: 'Severe friction between your ambitious drive and rigid corporate structures. It feels like driving with the parking brake on. Avoid insubordination; this is a brutal test of endurance, requiring you to methodically dismantle bureaucratic roadblocks without losing your temper.',
    },
    {
      name: 'Mars aspect Saturn in 10th house : Starts',
      description: 'Entering a highly restrictive professional period where your aggressive initiatives will meet solid walls of corporate red tape, compliance issues, or resistant leadership. Prepare for a prolonged exercise in strategic patience.',
    },
    {
      name: 'Mars aspect Sun in 9th house : Ends',
      description: 'The fierce drive to assert your personal vision over the company’s direction cools down. Conflicts with mentors, senior executives, or stakeholders regarding the broader strategy begin to resolve.',
    },
    {
      name: 'Mars aspect Sun in 9th house : Exact',
      description: 'Boldly and aggressively pitching your grand vision to higher-ups. You are fearlessly defending your architectural plans or international strategies, but must be careful not to alienate the very leaders whose support you need.',
    },
    {
      name: 'Mars aspect Sun in 9th house : Starts',
      description: 'A surge of confidence and combativeness regarding your core professional beliefs begins. You will feel a strong urge to challenge the company’s long-term roadmap and aggressively advocate for your own expansive ideas.',
    },
    {
      name: 'Mars aspect Venus in 8th house : Ends',
      description: 'The volatile, highly competitive push for financial dominance, equity, or venture funding winds down. Passionate but exhausting workplace negotiations give way to finalized agreements.',
    },
    {
      name: 'Mars aspect Venus in 8th house : Exact',
      description: 'Intense, magnetic, and ruthless negotiations for corporate resources. You are fiercely competitive in securing funding, closing major B2B contracts, or maneuvering through complex financial restructurings. A high-stakes corporate power play.',
    },
    {
      name: 'Mars aspect Venus in 8th house : Starts',
      description: 'Beginning a phase of aggressive pursuit of hidden financial assets or lucrative partnerships. Expect a period of intense, emotionally charged negotiations regarding salaries, bonuses, or shared company resources.',
    },
    {
      name: 'Mercury Aspecting Ascendant (ASC) : Exact',
      description: 'Peak mental agility and articulate communication. An exceptional day to present a complex architectural design, ace a technical interview, or perfectly communicate your personal brand to leadership. Your logical clarity is highly persuasive.',
    },
    {
      name: 'Mercury aspect Jupiter in 5th house : Exact',
      description: 'Brilliant strategic forecasting and intellectual expansion. Your ability to optimize resources and solve complex algorithmic or business logic problems is unmatched today. Ideal for launching innovative projects or conducting high-level technical training.',
    },
    {
      name: 'Mercury aspect Jupiter in 5th house : Starts',
      description: 'Entering a phase of highly optimistic, expansive thinking. Your mind begins to synthesize complex, disparate pieces of information, making this an excellent time to start brainstorming large-scale technical or creative solutions.',
    },
    {
      name: 'Mercury aspect Ketu in 3rd house : Ends',
      description: 'The period of frustrating miscommunications, lost data, and technical glitches in your daily workflow concludes. Team communications and short-term logistics finally return to a state of clarity and reliability.',
    },
    {
      name: 'Mercury aspect Ketu in 3rd house : Starts',
      description: 'Prepare for bizarre miscommunications, out-of-sync team dynamics, and potential technical failures in your daily messaging. Standard logical approaches to communication will fail; you must rely on intuition and highly detached, precise language.',
    },
    {
      name: 'Mercury aspect Moon in 6th house : Exact',
      description: 'Perfect alignment between your logical mind and your daily operational routines. You can effortlessly communicate complex instructions to your team, resolve administrative debt, and streamline inefficient workflows with emotional intelligence.',
    },
    {
      name: 'Mercury aspect Moon in 6th house : Starts',
      description: 'A period begins where you feel highly compelled to organize, document, and analyze your daily work habits. You will start implementing new systems to improve team communication and operational efficiency.',
    },
    {
      name: 'Mercury aspect Rahu in 9th house : Ends',
      description: 'The obsessive mental focus on radical, futuristic industry trends, disruptive technologies, or unorthodox international strategies begins to fade, returning your focus to more grounded professional realities.',
    },
    {
      name: 'Mercury aspect Rahu in 9th house : Starts',
      description: 'Entering a phase of highly unconventional, borderline obsessive intellectual exploration. You will be drawn to cutting-edge, disruptive ideas, foreign markets, or entirely new programming paradigms that challenge industry norms.',
    },
    {
      name: 'Mercury aspect Saturn in 10th house : Starts',
      description: 'The onset of a serious, methodical period of corporate communication. You will need to focus heavily on compliance, drafting formal contracts, updating legacy documentation, and engaging in highly structured, conservative dialogues with management.',
    },
    {
      name: 'Mercury aspect Sun in 9th house : Ends',
      description: 'The window for highly visible, expansive communications with senior leadership or international clients closes. The period of successfully publishing thought leadership or presenting major strategic roadmaps concludes.',
    },
    {
      name: 'Mercury aspect Sun in 9th house : Starts',
      description: 'Beginning a highly favorable period for engaging with mentors, drafting expansive corporate strategies, and aligning your communications with the company’s highest ethical and long-term goals.',
    },
    {
      name: 'Moon Aspecting Ascendant (ASC) : Exact',
      description: 'Heightened professional intuition and adaptability. You are acutely aware of the emotional undercurrents in the office today. Use this empathy to navigate complex team dynamics and project an image of a highly attuned, emotionally intelligent leader.',
    },
    {
      name: 'Moon Aspecting Midheaven (MC) : Exact',
      description: 'Your public career reputation is heavily influenced by your emotional intelligence today. You are viewed as a nurturing, protective force for your team. Ensure your public decisions reflect empathy without compromising structural integrity.',
    },
    {
      name: 'Pluto conjunct Saturn : Ends',
      description: 'The grueling, transformative era of massive corporate restructuring, industry-wide purges, or the complete teardown of legacy systems finally concludes. You emerge from this intense crucible with immense resilience and a solidified professional foundation.',
    },
    {
      name: 'Pluto conjunct Saturn : Starts',
      description: 'The beginning of an epochal shift in your career or industry. You will face intense pressure as outdated corporate structures, old management regimes, or obsolete technological frameworks are ruthlessly dismantled to make way for a new order.',
    },
    {
      name: 'Rahu aspect Moon in 6th house : Exact',
      description: 'An obsessive, unorthodox approach to your daily workflow and team management. You may experience bizarre team dynamics or an intense paranoia regarding office politics. Avoid burning out your team with unrealistic, erratic operational demands.',
    },
    {
      name: 'Saturn aspect Rahu in 9th house : Ends',
      description: 'The heavy karmic testing of your professional ethics, legal compliance, and international dealings concludes. The intense pressure to reconcile traditional corporate rules with radical new visions finally lifts.',
    },
    {
      name: 'Saturn aspect Rahu in 9th house : Exact',
      description: 'A severe structural check on reckless expansion. Rigid corporate compliance, legal restrictions, or karmic debts halt your unorthodox, disruptive strategies. You must systematically dismantle illusions in your long-term roadmap and adhere strictly to ethical protocols.',
    },
    {
      name: 'Saturn aspect Rahu in 9th house : Starts',
      description: 'Entering a challenging period where your desire to disrupt the industry or pursue unconventional visions will clash directly with strict legal, ethical, or corporate boundaries. Expect a rigorous audit of your long-term strategies.',
    },
    {
      name: 'Saturn aspect Sun in 9th house : Ends',
      description: 'The frustrating delays in international projects, publishing, or higher-level promotions finally resolve. The restrictive, conservative grip of older management or mentors begins to loosen.',
    },
    {
      name: 'Saturn aspect Sun in 9th house : Exact',
      description: 'A profound test of your professional discipline and faith. Your expansive vision is being blocked by bureaucratic red tape, delayed funding, or conservative leadership. Success requires absolute patience, structural compliance, and an unwavering commitment to your long-term goals.',
    },
    {
      name: 'Saturn aspect Sun in 9th house : Starts',
      description: 'The beginning of a sobering period where your grand professional ideas and leadership ambitions will face harsh reality checks. Prepare for slow progress, structural delays, and the need to meticulously prove the viability of your corporate vision.',
    },
    {
      name: 'Sun aspect Jupiter in 5th house : Ends',
      description: 'The phase of immense optimism, easy success in speculative ventures, and highly recognized creative leadership winds down. Lock in your gains and transition from visionary pitching to operational execution.',
    },
    {
      name: 'Sun aspect Jupiter in 5th house : Starts',
      description: 'Entering a highly expansive, fortunate period for your career. You will feel a surge of confidence to step into advisory roles, launch major innovative projects, or execute highly successful, calculated risks in your professional domain.',
    },
    {
      name: 'Sun aspect Ketu in 3rd house : Ends',
      description: 'The period of feeling unheard, misunderstood, or professionally isolated in your team communications concludes. Your confidence in presenting short-term logistics and team strategy returns.',
    },
    {
      name: 'Sun aspect Ketu in 3rd house : Starts',
      description: 'A frustrating phase begins where your authoritative communication seems to fall on deaf ears. You may feel a dissolution of your ego in team meetings or experience strange technical failures that undermine your project proposals.',
    },
    {
      name: 'Sun aspect Mars in 8th house : Starts',
      description: 'Beginning a highly intense period of uncovering hidden corporate conflicts or tackling massive crisis management. Your ego and leadership will become deeply tied to how aggressively you can solve obscure, deeply buried systemic issues.',
    },
    {
      name: 'Sun aspect Mercury in 8th house : Ends',
      description: 'The deep dive into auditing, forensic accounting, or the meticulous uncovering of hidden corporate data concludes. The spotlight moves away from crisis analysis and back to standard operations.',
    },
    {
      name: 'Sun aspect Mercury in 8th house : Starts',
      description: 'Entering a phase where your intellect and leadership are focused entirely on deep, investigative tasks. You will be called upon to shine a light on hidden flaws in contracts, codebases, or financial strategies.',
    },
    {
      name: 'Sun aspect Moon in 6th house : Ends',
      description: 'The intense focus on improving daily health routines, streamlining operational debt, and managing team morale subsidies. The spotlight shifts away from the daily grind.',
    },
    {
      name: 'Sun aspect Moon in 6th house : Starts',
      description: 'A period begins where your leadership identity becomes deeply intertwined with daily operational efficiency. You will feel a strong drive to illuminate inefficiencies, improve team wellness, and tackle accumulating administrative or technical debt.',
    },
    {
      name: 'Sun aspect Rahu in 9th house : Ends',
      description: 'The chaotic, ego-driven pursuit of unorthodox international visions or rebellious corporate strategies concludes. You return to a more grounded, realistic assessment of your long-term career path.',
    },
    {
      name: 'Sun aspect Rahu in 9th house : Starts',
      description: 'Entering a phase of intense, rebellious ambition. You may feel a strong ego attachment to disruptive, highly unconventional industry visions, potentially leading to clashes with traditional mentors or corporate leadership.',
    },
    {
      name: 'Sun aspect Saturn in 10th house : Starts',
      description: 'The onset of a heavy, demanding professional period. You will step into the spotlight of major executive responsibilities, facing intense scrutiny, rigid structures, and the need for absolute, unwavering discipline in your career.',
    },
    {
      name: 'Sun aspect Sun in 9th house : Exact',
      description: 'A powerful alignment with your company’s highest vision and your own core ethics. Exceptional visibility with international clients, publishing, or senior mentors. Your leadership presence is radiant, authentic, and expansive.',
    },
    {
      name: 'Sun aspect Venus in 8th house : Ends',
      description: 'The spotlight fades from hidden financial negotiations, equity deals, or the resolution of deep-seated workplace betrayals. The window for securing lucrative severance or restructuring bonuses closes.',
    },
    {
      name: 'Sun aspect Venus in 8th house : Starts',
      description: 'Beginning a period where your leadership and reputation are tied to navigating complex corporate finances, mergers, or hidden partnerships. You will have the opportunity to illuminate and secure highly lucrative, obscure resources.',
    },
    {
      name: 'Uranus aspect Saturn in 10th house : Exact',
      description: 'A sudden, electrifying clash between radical innovation and rigid corporate structures. You may experience an abrupt change in management, a sudden release from a restrictive job, or the chaotic but necessary dismantling of obsolete legacy systems in your workplace.',
    },
    {
      name: 'Venus Aspecting Ascendant (ASC) : Exact',
      description: 'Peak professional charisma and magnetism. An incredibly auspicious day for personal branding, nailing a high-stakes interview, or effortlessly winning over difficult clients. Your diplomatic charm masks a highly effective strategic mind.',
    },
    {
      name: 'Venus aspect Ketu in 3rd house : Starts',
      description: 'Entering a phase of detachment from superficial networking and standard corporate communications. You will find more financial or aesthetic value in isolated, highly specialized work, or through sudden, brief, and unusual professional encounters.',
    },
    {
      name: 'Venus aspect Moon in 6th house : Ends',
      description: 'The period of enhanced harmony, aesthetic improvements to the workspace, and smooth emotional relations with subordinates concludes. Daily operations return to a more standard, less emotionally buffered state.',
    },
    {
      name: 'Venus aspect Moon in 6th house : Exact',
      description: 'A beautifully harmonious day for team dynamics and daily routines. Excellent for HR professionals, organizing team-building events, or simply enjoying a frictionless, highly collaborative day of operational execution.',
    },
    {
      name: 'Venus aspect Moon in 6th house : Starts',
      description: 'A phase of pleasant daily workflows begins. You will find yourself intuitively smoothing over office conflicts, improving the physical workspace (even a home office setup), and fostering a deeply supportive environment for your reports.',
    },
    {
      name: 'Venus aspect Rahu in 9th house : Starts',
      description: 'Beginning a period of intense, almost obsessive desire for international expansion, unorthodox financial investments, or breaking the rules in your corporate branding. Be wary of falling for "get-rich-quick" illusions on a global scale.',
    },
    {
      name: 'Venus aspect Saturn in 10th house : Ends',
      description: 'The slow, methodical building of your professional reputation and the delayed financial rewards from long-term corporate loyalty reach a culmination point. The restrictive feeling regarding your earning potential begins to lift.',
    },
    {
      name: 'Venus aspect Saturn in 10th house : Starts',
      description: 'Entering a phase where financial gains and professional reputation will only come through extreme patience, loyalty, and strict adherence to corporate hierarchy. Charm must be backed by undeniable, structural hard work.',
    },
    {
      name: 'Venus aspect Sun in 9th house : Ends',
      description: 'The favorable window for securing international contracts, publishing deals, or gaining financial favor from visionary executive mentors closes. Wrap up high-level ethical or legal negotiations.',
    },
    {
      name: 'Venus aspect Sun in 9th house : Starts',
      description: 'Beginning a highly auspicious period for expanding your professional network globally. You will find favor with senior leadership, experience smooth legal negotiations, and align your financial goals with your highest ethical ideals.',
    },
    {
      name: 'Venus ruler of the 7th House in the 8th House',
      description: 'B2B partnerships, client contracts, and professional alliances undergo intense transformation. You may face sudden contract terminations or discover hidden clauses. Navigate this period with extreme caution, as significant financial lessons regarding trust and corporate betrayal are at play.',
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