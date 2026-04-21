const db = require('./engineering');

const events = [
  {
    name: 'Moon Transits the 8th House',
    description: "Hidden complexities in legacy architectures may drain your confidence today. Imposter syndrome could surface as you navigate the psychological pivot from mobile to web paradigms. Trust your T-shaped intuition when dealing with cross-team dependencies or unpredictable API contracts. A period to quietly debug your overarching career strategy.",
  },
  {
    name: 'Moon aspect Venus in 8th house',
    description: 'You are longing for the elegant syntax of a familiar framework you mastered in the past. It may be time to revisit your mobile roots to inspire your current web architecture. You have a heightened ability to attract venture backing or equity through your technical charisma now.',
  },
  {
    name: 'Venus ruler of the 2nd House in the 8th House',
    description: "Financial gains come through strategic retail investing and secondary streams. Applying technical analysis—like VWAP, RSI, or Wyckoff accumulation phases—to crypto or equity markets yields results now. Keep your portfolio strategies and potential startup pivots private for maximum leverage.",
  },
  {
    name: 'Venus ruler of the 7th House in the 8th house',
    description: 'A third-party vendor or collaborative partner is proving unreliable, risking the integrity of your architecture. Be aware of technical debt introduced by others; this could cause a separation from a current tech stack. There is a major lesson regarding trust in open-source or external dependencies.',
  },
  {
    name: 'Moon aspect Mercury in 8th house',
    description: 'Deep analysis of frontend system design keeps you locked in deep work today. You feel you are on the brink of a breakthrough regarding micro-frontend orchestration. Rely on your hunches; your debugging instincts are sharp and leading you to the root cause.',
  },
  {
    name: 'Mercury ruler of the 3rd House in the 8th House',
    description: 'Difficulties with a peer engineer can cause workflow bottlenecks; it may be time to cleanly deprecate a shared project. You are intensely drawn to the underlying infrastructure of the web. Willpower is needed as you conduct a deep self-analysis of your technical blind spots.',
  },
  {
    name: 'Mercury ruler of the 6th House in the 8th House',
    description: 'Intermittent bugs may be hard to reproduce, turning into chronic tech debt. Caution is required in your deployment pipeline as there is a risk of production outages. Be cautious with junior engineers or direct reports bypassing code review! Automated tests may fail unpredictably now.',
  },
  {
    name: 'Moon aspect Mars in 8th house',
    description: 'You may dwell on negative emotions regarding a difficult migration or refactor. Today you must take charge, embrace sustainable intensity, and transform this frustration into actionable pull requests and a positive architectural roadmap.',
  },
  {
    name: 'Mars ruler of the 1st House in the 8th House',
    description: 'Navigating complex system integrations can be a struggle today. Early struggles with strict typed languages or difficult compilers build your character as a leader. Try to understand why your team is attracting certain scope creep today. You possess a sharp insight into deep backend logic.',
  },
  {
    name: 'Mars ruler of the 8th House in the 8th House',
    description: 'Deep analytical awareness means you are constantly optimizing your code and career path. You have profound intuition for security vulnerabilities and system architecture. Your research skills make you an excellent technical detective. Embrace realizations that will fundamentally pivot your tech stack today.',
  },
  {
    name: 'Moon Transits the 9th House',
    description: 'Your long-term architectural vision seems wavering as you explore new paradigms. Emotional attachments to older mobile frameworks are breaking down as you master scalable web applications. Female mentors will set the tone for new realizations. Legacy leadership may be unpredictable.',
  },
  {
    name: 'Moon aspect Sun in 9th house',
    description: 'Read or listen to high-level engineering podcasts or system design whitepapers. Today you will open your mind to new scalable possibilities. Tapping into the broader open-source community provides constructive reinforcement for your career trajectory.',
  },
  {
    name: 'Sun ruler of the 5th House in the 9th House',
    description: 'Mentorship and writing technical documentation are dominant parts of your professional life. A senior principal engineer can be a major influence. There is an ease and comfort in your career that comes from having a robust, T-shaped skill set. You are highly favored in interviews today.',
  },
  {
    name: 'Moon aspect Rahu in 9th house',
    description: 'Fanatical debates over tech stacks (e.g., React vs. Vue) surface briefly in your network. You have come to a nuanced, senior-level realization about choosing the right tool for the job, but these tribal developer debates serve as great reminders of past rigid thinking.',
  },
  {
    name: 'Moon aspect Ketu in 3rd house',
    description: 'You communicate complex engineering concepts differently from the norm, and this is your true stroke of genius. Be in control of your unique background—blending mobile intuition with web execution—to develop architectures that defy conventional silos.',
  },
  {
    name: 'Moon Transits the 10th House',
    description: "Fluctuations in engineering leadership may come as a surprise. The company is going through an agile reorganization. Changes in the roadmap may only be fleeting sprints, not permanent pivots. Don't be too attached to current product requirements; in software, everything is subject to change.",
  },
  {
    name: 'Sun Transits the 12th House',
    description: "Quality time spent in 'do not disturb' mode rebuilds your mental stack and gives time to focus. It is time to deprecate old services and bring closure to legacy projects. Junior engineers may be a source of mentorship fatigue. Responsibility for unoptimized code keeps you awake with worry.",
  },
  {
    name: 'Moon aspect Saturn in 10th house',
    description: 'The mood is a little heavy in the repository today. No one wants to claim responsibility for a breaking change. A continued focus on sustainable intensity and a job well done will eventually boost the engineering culture in your team.',
  },
  {
    name: 'Saturn ruler of the 10th House in the 10th House',
    description: 'Engineering excellence is a driving force that defines your professional identity. You command respect in code reviews and architecture boards. This is a great time to secure your role as a technical leader. Get your resume ready for senior roles; your foundation is rock solid.',
  },
  {
    name: 'Saturn ruler of the 11th House in the 10th House',
    description: 'Your career pursuits must align with your internal values and offer a sense of scalable impact. You must possess a passion for the product. You will be connected to influential tech founders and CTOs through your networking. Their architectural guidance is what you need now.',
  },
  {
    name: 'Moon Transits the 11th House',
    description: "Peers in your network seem to call needing technical advice or referrals. Take a step back from frivolous side projects. Don't let endless tech meetups cause a drain on your energy. Avoid office politics and Slack gossip; they are a waste of your valuable deep-work time.",
  },
  {
    name: 'Moon aspect Jupiter in 5th house',
    description: 'Time to reconnect to your passion for coding by building something fun and creative. Exploring a new AI coding assistant or UI framework raises your enthusiasm. Mentoring younger developers opens your heart and reinforces your own knowledge.',
  },
  {
    name: 'Jupiter ruler of the 9th House in the 5th House',
    description: 'A senior leader is a great teacher and is closely guiding your pivot. System design teaching is a passion and could be a dedicated pathway. Luck and fortune come from your crypto or tech stock investments. Others seek out your code reviews for your truthful, valuable advice.',
  },
  {
    name: 'Jupiter ruler of the 12th House in the 5th House',
    description: 'You may have experienced difficulties launching side projects in the past. Now is the time to develop the hidden potential of your T-shaped expertise. Interest in machine learning or AI cultivates a desire to master new sciences. Your architectural intuition is strong; use it for guidance.',
  },
  {
    name: 'Moon Transits the 12th House',
    description: 'Memories of early career struggles or outdated programming languages creep into the mind. Daydreaming of simpler technical times consumes you. You may worry about the future of AI replacing jobs. It is time to step away from the IDE, sleep, and release past burnout.',
  },
  {
    name: 'Mars aspect Jupiter in 5th house',
    description: 'You are highly active in hackathons, creative coding, or tech community events. Your energy is contagious, making you a magnet for collaborative projects. You are lucky with retail investments and stock options currently. Building elegant UI/UX brings joy to your daily routine.',
  },
  {
    name: 'Sun in 9th (Dispositor)',
    description: 'Your sense of technical integrity is at the foundation of your current system designs. A foundational mentor or your original engineering principles are driving your current success. A tech conference or offsite will give you a fresh perspective.',
  },
  {
    name: 'Moon aspect Moon in 6th house',
    description: "People in your squad need your technical support, even though resolving their merge conflicts drains your energy. Give compassionate feedback, but don't lower your coding standards. Watch your posture and screen time today; physical burnout is a subtle risk.",
  },
  {
    name: 'Moon ruler of the 4th House in the 6th House',
    description: 'The foundational codebase may be suffering from vulnerabilities or require severe refactoring. The team struggles with technical debt. You remember the hard work it took to build this initially. All these issues regarding base-level stability surface in today\'s sprints.',
  },
  {
    name: 'Moon Transits the 1st House',
    description: 'Clarity of mind gives you the power to instigate a new career phase. A deeper sensitivity to user experience plays a major part in the direction your next project takes. This renewed mindset on product development initiates a fresh perception of how to achieve your leadership goals.',
  },
  {
    name: 'Moon Transits the 2nd House',
    description: 'Equity valuations or freelance income may fluctuate. It is not the time to make large hardware purchases or risky crypto investments. Spending time optimizing your current development environment and finding peace in steady, sustainable intensity will ground you.',
  },
  {
    name: 'Venus aspect Moon in 6th house',
    description: 'Any practice that beautifies your code—like implementing a strict linter or a new design system—is on your to-do list. Learning more about clean architecture attracts your attention. Curating your GitHub profile is unusually satisfying right now.',
  },
  {
    name: 'Mercury in 8th (Dispositor)',
    description: 'Deep thought is required to get to the bottom of a complex memory leak or architectural flaw. Listening to your engineering intuition heals broken systems. Your vast understanding of both mobile and web ecosystems allows you to uncover hidden truths in the code.',
  },
  {
    name: 'Moon Transits the 3rd House',
    description: "Being open-minded to new frameworks brings opportunities that expand your T-shaped profile. Spontaneous pairing sessions give a new sense of freedom. It is a good time to consume technical documentation or take an advanced course. Tech gossip is entertaining, but stay focused.",
  },
  {
    name: 'Venus Transits the 1st House',
    description: 'Your personal brand and technical presence become more magnetic. There is a powerful attractive force in how you present your portfolio and system design ideas. It is a great time to update your LinkedIn or resume. Peers and stakeholders suddenly recognize your leadership appeal.',
  },
  {
    name: 'Moon Transits the 4th House',
    description: 'Team retrospectives focus on past sprints and foundational architecture. Nostalgic feelings for old tech stacks bring comfort. Working from the security of your home setup is highly compelling. You seek a stable remote environment to rest and recharge your engineering mind.',
  },
  {
    name: 'Mars aspect Moon in 6th house',
    description: 'Stakeholders or QA testers cause distress with endless edge-case complaints. Your tolerance for bad code is very sensitive; be careful not to lash out in PR reviews. Context-switching may be the cause of fluctuating moods. Find a way to balance your workload with sustainable intensity.',
  },
  {
    name: 'Uranus conjunct Venus',
    description: 'Unexpected networking leads to an exciting new startup opportunity. Chance meetings with founders happen at the most unexpected places. You may become infatuated with a disruptive new technology (like a new AI tool). A sudden influx of equity or crypto gains may afford you a luxury purchase.',
  },
  {
    name: 'Mars in 8th (Dispositor)',
    description: 'Your deep understanding of system vulnerabilities and backend logic is the result of past production outages you\'ve endured. Researching and digging deep into micro-frontends or distributed systems proves highly beneficial to your current career trajectory.',
  },
  {
    name: 'Moon Transits the 5th House',
    description: 'Sudden inspiration to build a creative side project brings an optimistic attitude to your daily standup. Gamifying your workflow is fun. Junior engineers may need more emotional support and drain your energy. Your mind wanders toward innovative UI/UX concepts, daydreaming of new products.',
  },
  {
    name: 'Mars Transits the 12th House',
    description: 'Secret competitive threats are lurking in the market; protect your intellectual property. Secure your servers and API keys against vulnerabilities. At work, guard your architectural proposals to avoid colleagues claiming your ideas. Sleep is disturbed by imposter syndrome. Protect your mental health.',
  },
  {
    name: 'Mercury aspect Jupiter in 5th house',
    description: 'Interest in AI coding assistants that enhance your deployment speed becomes a focus. New ways of structuring data open your awareness. Writing technical blogs is inspiring. A desire to explore new languages attracts you. Mentorship efforts yield positive reinforcement and team growth.',
  },
  {
    name: 'Sun aspect Moon in 6th house',
    description: 'Changes in your daily productivity inspire you to alter your sprint routines. Adopting sustainable intensity—optimizing your commit times and taking proper breaks—will make you feel sharper and positively affect your lifelong engineering habits.',
  },
  {
    name: 'Sun Transits the 1st House',
    description: 'Energy and stamina inspire a new proactive approach to your career. A sense of self-confidence comes from mastering a difficult technical concept. It is time to get back into the job market or step up for leadership with a renewed sense of purpose. Exercise consideration for junior peers.',
  },
  {
    name: 'Mercury Transits the 12th House',
    description: 'Thoughts of former colleagues intuit a sudden LinkedIn message out of the blue. You develop a sixth sense for debugging complex, obfuscated code. Interest in remote roles for foreign companies initiates new plans. It is time to document past failures to process and learn from them.',
  },
  {
    name: 'Ketu aspect Sun in the 9th house',
    description: 'The relevance of an older technology you relied on is declining. Old architectural arguments seem to surface for retribution. Problems with compliance or regulatory guidelines can cause conflict. A senior mentor may leave the company. Your technical philosophies are changing rapidly.',
  },
  {
    name: 'Venus Aspecting Ascendant (ASC)',
    description: "You'll attract positive attention from recruiters and leadership, making it a good time to focus on your professional brand. Ensure you balance these networking activities with your daily coding responsibilities and self-care.",
  },
  {
    name: 'Jupiter in 5th (Dispositor)',
    description: 'Situations concerning creative problem solving and side projects bring a fresh perspective to your tech career. You are extremely innovative during this time and could be manifesting a new app or service, adding prosperity to your portfolio.',
  },
  {
    name: 'Moon Transits the 6th House',
    description: 'Your tolerance for technical debt is weak; pay attention to code quality or there will be critical bugs. The engineering org is reorganizing, and many are gossiping due to uncertainty. Focusing on routine tasks and taking walks away from the keyboard brings comfort.',
  },
  {
    name: 'Moon Transits the 7th House',
    description: 'A change of heart regarding a vendor or co-founder may be worrisome, but it is a fleeting emotion. Your pair-programming partner may be unpredictable, vacillating on architectural decisions. Chaos in the agile processes creates uncertainty about job security; remember, it is just noise.',
  },
  {
    name: 'Saturn aspect Sun in 9th house',
    description: 'A legacy system is declining in stability, or a senior architect is looking at retirement. Many old software engineering dogmas are breaking apart. There may be friction with a principal engineer or CTO. The frameworks that previously guided you are being replaced.',
  },
  {
    name: 'Venus Transits the 2nd House',
    description: 'Financial matters are on an upswing; expect lucrative stock options, a raise, or crypto gains. Purchases of high-end tech gear or ergonomic office furniture will beautify your workspace. Be clear in salary negotiations. Your communication in PRs is graceful and well-received.',
  },
  {
    name: 'Venus aspect Venus in 8th house',
    description: 'A deep longing to build something truly impactful consumes your mind. The need to create elegant, scalable solutions opens your passion for coding. You have a powerful charismatic presence in interviews now. A financial settlement, bonus, or unexpected venture capital arrives.',
  },
  {
    name: 'Sun Aspecting Ascendant (ASC)',
    description: "You'll feel a boost in technical confidence and leadership vitality, making it a great time to lead a major system migration or make a strong impression in an interview. Balance assertiveness with empathy in code reviews.",
  },
  {
    name: 'Mercury Aspecting Ascendant (ASC)',
    description: "You'll feel a strong urge to communicate architectural ideas and write documentation. It is a highly productive time for networking and publishing technical blogs. Stay focused to avoid scattering your energy across too many open source projects.",
  },
  {
    name: 'Venus aspect Mercury in 8th house',
    description: 'It is time to express your thoughtful sentiments regarding a complex team dynamic or migration strategy. Deep dive into the underlying systems with a sense of contentment. You may find yourself romanticizing the elegance of a past tech stack you once used.',
  },
  {
    name: 'Venus aspect Mars in 8th house',
    description: 'You are awakened to your own ambition and power to influence major engineering decisions. Use this charismatic pull to attract high-quality projects, not office politics. Be aware of your cloud computing costs and keep an eye on project expenses.',
  },
  {
    name: 'Mars aspect Venus in 8th house',
    description: 'You are driven to refactor and beautify complex, hidden backend systems. Your aggressive push for clean architecture is magnetic but can be intimidating; be careful how you critique others. Keep an eye on impulsive spending regarding your retail investments.',
  },
  {
    name: 'Venus Transits the 3rd House',
    description: 'Creative work using your coding skills develops into a new, profitable side hustle. Composing an elegant technical proposal puts this energy to good use. Optimizing your local dev environment brings cheerfulness. You have excellent rapport in your daily standups. Happy tech news brings comfort.',
  },
  {
    name: 'Mercury Transits the 2nd House',
    description: 'Financial planning gives a clear perspective on your equity and salary expectations. This is a good time to discuss compensation in performance reviews. Spending money on advanced certifications, a new MacBook, or SaaS tools is appropriate now. Your technical skills are highly marketable.',
  },
  {
    name: 'Sun Transits the 2nd House',
    description: 'Your tech salary, equity, and crypto investments are a major focus and may present unexpected tax or valuation issues. The mood to spend on hardware is high. An external vendor may create a financial drain on the project. Maintain sustainable intensity to avoid physical burnout.',
  },
  {
    name: 'Mercury Transits the 1st House',
    description: 'Verbal expressions and a talkative nature fuel your need to share system design ideas. Life takes on an air of hackathon adventure. You are eager to adopt new skills, perhaps mastering a new AI framework. Junior developers give you inspiration to view problems from a fresh approach.',
  },
  {
    name: 'Mars Transits the 1st House',
    description: 'Courage and energy give you the drive to tackle the technical debt you put on the back burner. Aggravating legacy code inspires a forceful refactoring effort. Contain your impulsive nature to avoid breaking production during this error-prone time. Guard against burnout headaches.',
  },
  {
    name: 'Mars aspect Ketu in 3rd house',
    description: 'Long-standing issues with your Git workflow or communication with a peer need to be addressed now. An unexpected deployment rollback comes as a surprise. Your usual ambition halts as an architectural flaw takes a toll on your mind. Be careful with manual deployments; automate where possible.',
  },
  {
    name: 'Mercury aspect Venus in 8th house',
    description: 'It is time to negotiate the finer details of a complex vendor contract or equity package. Deep feelings of alignment with your core team bring contentment. You may find yourself eloquently defending a legacy system that still holds immense value.',
  },
  {
    name: 'Sun aspect Venus in 8th house',
    description: "Passion for a specific architecture can be all-consuming; don't be overly dogmatic. Memories of successful past projects may cloud your judgment on current needs. Clinging to outdated tech stacks paralyzes your ability to transition to modern, scalable web ecosystems.",
  },
  {
    name: 'Mercury aspect Mercury in 8th house',
    description: 'Working on a deep technical spike or researching an obscure bug consumes your time today. Finding the specific StackOverflow answer feels overwhelming. Be aware your intuitive engineering hunches are really all you need to architect the right solution.',
  },
  {
    name: 'Venus aspect Sun in 9th house',
    description: 'Travel plans for an international tech conference take you to an exciting place. Your love of T-shaped learning opens doors; opportunities to speak or lead a workshop arise. A former mentor inspired a design pattern you have never forgotten and still advocate for today.',
  },
  {
    name: 'Mars Aspecting Ascendant (ASC)',
    description: "You'll feel a surge of coding velocity and determination, making it a great time for bold refactoring. Be cautious of acting impulsively in code reviews, as this could lead to conflicts or burnout in your team dynamics.",
  },
  {
    name: 'Venus aspect Rahu in 9th house',
    description: 'It is time to take a PTO vacation to recharge your engineering mind! Your relationship with senior leadership is important now; they have a promotional opportunity for you. You are learning how to project your technical authority to the broader industry. Contract negotiations finalize positively.',
  },
  {
    name: 'Venus aspect Ketu in 3rd house',
    description: 'Take advanced courses to expand your UI/UX or frontend talents. You can reconnect with former colleagues who may offer referral opportunities. Chance networking opens doors. Spontaneous hackathons lead to great ideas. You may travel to a tech meetup or visit a peer developer.',
  },
  {
    name: 'Mercury aspect Mars in 8th house',
    description: "Investigative debugging finds the root cause not normally seen by standard monitoring tools. Your mind is fully active to resolve this critical issue. Don't go on a tangent over-engineering a solution; keep it MVP to not waste valuable sprint time. Your logic will direct you perfectly.",
  },
  {
    name: 'Mercury Transits the 3rd House',
    description: 'Writing a robust Jira backlog or technical spec will be of great value. It is a good time to begin technical blogging. Learning new web frameworks comes easily. A short business trip will be prosperous. It is time to upgrade your tech hardware. Your communication skills unify the team.',
  },
  {
    name: 'Mars aspect Mercury in 8th house',
    description: "Aggressive investigative research uncovers hidden security flaws or legacy bottlenecks. Your mind is hyper-focused on finding these answers. Avoid deep philosophical arguments about code syntax that take you off course from shipping the product. Trust your inner engineering voice.",
  },
  {
    name: 'Jupiter Transits the 4th House',
    description: 'It is a good time to expand your remote office setup or invest in real estate. You have a desire to build a more robust foundational architecture at work, like an enterprise design system. Working from home is highly profitable and supports your need for sustainable intensity and deep work.',
  },
  {
    name: 'Jupiter aspect Venus in 8th house',
    description: 'Financial rewards will come through venture capital, equity vesting, or profit-sharing at this time. The tech company you partner with is very successful financially. Technical debts are finally paid down, giving your team the freedom to build new features.',
  },
  {
    name: 'Sun aspect Mercury in 8th house',
    description: 'Your thoughts take you into a deep place to understand the root logic of your software architecture. You question why the tech stack evolved the way it did. This inner search leads you to master more complex, distributed systems and advanced backend paradigms.',
  },
  {
    name: 'Mercury aspect Sun in 9th house',
    description: 'Reading tech whitepapers gives you a visionary outlook on the industry today. Debating architectural beliefs with peers provides a sense of commonality and alignment. You will receive an important email from a tech lead or principal mentor.',
  },
  {
    name: 'Mercury aspect Ketu in 3rd house',
    description: 'Revelations regarding a deprecated framework will change your development approach today. Solutions come from unsuspected, older codebases. API integrations are hectic due to misread documentation. Take time to carefully read error logs and listen to peer engineers.',
  },
  {
    name: 'Mercury aspect Rahu in 9th house',
    description: 'Attending a global tech summit stimulates your mind to a new architectural perspective. Unexpected opportunities to adopt bleeding-edge AI tools are presented; be spontaneous, as there is much to learn. Your mind is open to highly unconventional software design patterns.',
  },
  {
    name: 'Venus Transits the 4th House',
    description: 'The desire to improve your remote workspace inspires you to upgrade your monitors or office aesthetics. You invent new, scalable design systems for the frontend. Cultivating a peaceful home environment allows for the sustainable intensity needed to thrive in senior engineering roles.',
  },
  {
    name: 'Sun aspect Mars in 8th house',
    description: 'Harsh code reviews or personal attacks on your pull requests affect you deeply. This unconsciously reminds you of past technical failures or imposter syndrome. Use this as an opportunity to detach your ego from your code. Deep technical focus will lead to a major architectural discovery.',
  },
  {
    name: 'Venus Aspecting Midheaven (MC)',
    description: 'Your diplomatic communication in PRs and meetings can lead to a promotion to a senior leadership role. Focus on building harmonious cross-functional connections with product and design, while ensuring you negotiate your compensation accurately.',
  },
  {
    name: 'Saturn in 10th (Dispositor)',
    description: 'Dissatisfaction with the current agile process or tech leadership is causing upset, as you feel your engineering talents lack purpose here. You have worked diligently maintaining legacy systems and desperately need to pivot to more innovative, modern web architectures.',
  },
  {
    name: 'Jupiter Aspecting Midheaven (MC)',
    description: 'Massive opportunities for a tech career pivot are likely; taking a calculated risk on a new startup or role (like at a major Fintech) could yield substantial equity. Ensure this leap aligns with your long-term goal of T-shaped expertise and sustainable intensity.',
  },
  {
    name: 'Sun Transits the 3rd House',
    description: 'Peer engineers or product managers become bossy regarding the sprint backlog. Let them take the lead on timeline management so you can focus on the code. Your technical ambition allows you to tackle complex system designs without procrastination. Short courses open your mind.',
  },
  {
    name: 'Mars aspect Mars in 8th house',
    description: 'You are passionate to understand the deepest logic of distributed systems and backend engineering. Your mission to completely refactor the architecture is activated. You will move forward in executing this complex migration with immense tenacity. You will make the deployment happen.',
  },
  {
    name: 'Venus aspect Saturn in 10th house',
    description: 'You are given more architectural responsibility; discipline and focus on scalable systems will bring promotion. Your engineering manager may feel threatened by your rapid upskilling. It may be time to consider becoming a staff engineer or starting your own technical consultancy.',
  },
  {
    name: 'Sun Transits the 12th House',
    description: 'Quality time spent in deep, uninterrupted coding rebuilds your technical confidence. It is time to deprecate old services and bring closure to legacy systems. Junior developers may drain your energy. Responsibility for failing infrastructure keeps you awake. Prioritize mental health.',
  },
  {
    name: 'Mercury aspects the Moon in the 6th house',
    description: 'Refactoring becomes the focus, as you have brilliant ideas for resolving technical debt. Listen to your QA and junior devs, as they spot edge cases you missed. Thoughts concerning your work-life balance are accurate; optimize your daily routine for sustainable intensity.',
  },
  {
    name: 'Sun Transits the 2nd House',
    description: 'Your tech salary, stock options, and crypto portfolio are in focus and may present unexpected volatility. You are in the mood to purchase expensive developer tools or hardware. Pay attention to your physical health; sitting at the desk too long without breaks will cause issues.',
  },
  {
    name: 'Sun Transits the 3rd House',
    description: 'Lead developers or PMs take charge and become demanding around project scope. Let them handle the agile ceremonies while you focus on execution. Strength in your coding abilities allows you to take on complex micro-frontend integrations without delay.',
  },
  {
    name: 'Mars Transits the 2nd House',
    description: 'Money flows in and out quickly, perhaps through volatile crypto trades or hardware purchases. While your tech salary is strong, avoid impulsive investments. Be aware of your tone in Slack; abrupt, aggressive code reviews can anger peers. Take proper lunch breaks away from the keyboard.',
  },
  {
    name: 'Mercury Transits the 4th House',
    description: 'There is a need to establish a stronger base architecture. Remote work is highly communicative today. You may dream of old coding projects. Virtual meetings gather the team to discuss foundational engineering principles. Time at home is best spent upskilling and reading documentation.',
  },
  {
    name: 'Pluto conjunct Saturn',
    description: 'You will be in a position to learn immense technical discipline and architectural control. Your ability to handle a massive system migration will be tested. Many restrictions come with senior engineering responsibilities. Organize your sprint time wisely to avoid catastrophic burnout.',
  },
  {
    name: 'Sun aspects Sun in 9th house',
    description: 'A new perspective on software engineering comes from trusting your architectural vision. Advanced courses in system design inspire a pivot in your tech stack. Mentorship from a principal engineer provides invaluable guidance. Exploring foreign tech markets brings visionary ideas.',
  },
  {
    name: 'Sun aspect Ketu in the 3rd house',
    description: 'Your usual aggressive sprint velocity is derailed due to a rejected PR or technical setback. If you can learn the lesson the compiler or reviewer is presenting, you will grow immensely. Miscommunications with peer developers arise because they cannot grasp your advanced approach.',
  },
  {
    name: 'Sun aspect Rahu in 9th house',
    description: 'You question the purpose of your current tech stack, realizing you have outgrown the frameworks you once relied on. Disillusionment with your engineering leadership or agile processes causes a desire to separate and explore disruptive new paradigms like AI-driven development.',
  },
  {
    name: 'Venus Transits the 5th House',
    description: 'Inspiration to build beautiful, intuitive UI/UX surfaces. Creating elegant code helps fulfill a desire to break out of boring maintenance tasks. You attract collaborative peers for hackathons. Luck with tech startup investments, crypto speculation, or equity grants is strongly indicated.',
  },
  {
    name: 'Mars aspect Sun in 9th house',
    description: 'Take advantage of a spontaneous opportunity to attend a tech conference. Inspirational leaders create a new passion for mastering complex system design. Disagreements with upper management cause discord. Be patient with junior developers; they are not as technically evolved yet.',
  },
  {
    name: 'Mars aspect Rahu in 9th house',
    description: 'Unexpected shifts in the product roadmap disrupt your planned architecture. Upskilling runs into problems due to poorly written documentation. Disappointment with an engineering methodology (like strict Agile) comes under scrutiny. You are forced to forge a new, unconventional technical path.',
  },
  {
    name: 'Jupiter aspect Saturn in 10th house',
    description: 'Your disciplined approach to sustainable intensity and clean code awards you with a senior leadership position. The tech org finally recognizes your architectural effort. Job opportunities lead to a cycle of success; you are due for a raise or a leap to a top-tier fintech company.',
  },
  {
    name: 'Sun Transits the 4th House',
    description: 'Foundational infrastructure is a major concern. There may be critical patches needed in your core systems. Working remotely brings warmth and high productivity. Security is an issue; audit your cloud permissions. There is a desire to completely rebuild the base repository.',
  },
  {
    name: 'Sun Aspecting Midheaven (MC)',
    description: 'Your technical expertise and public GitHub presence are highlighted, making it an ideal time to pursue senior engineering goals or CTO roles. Recognition for your system designs is likely, but ensure your ambition doesn’t disrupt your commitment to sustainable intensity.',
  },
  {
    name: 'Venus aspect Jupiter in 5th house',
    description: 'Technical creativity is at a peak; you excel in building micro-frontends and beautiful user interfaces. Interest in algorithmic trading or crypto investing can be very successful now. Mentoring brings blessings. Be open to networking; a highly lucrative partnership is possible.',
  },
  {
    name: 'Sun aspect Saturn in 10th house',
    description: 'Your engineering role is changing, and maintaining legacy systems is no longer satisfying. Be careful not to refactor too aggressively without approval. Leadership is under pressure; you become acutely aware of the political stresses involved in being an Engineering Manager or Staff Engineer.',
  },
  {
    name: 'Venus Transits the 6th House',
    description: 'Coding is smooth and easy with the support of well-intentioned QA and peers. A complex frontend project requires your creative genius and a polished UI perspective. Optimizing your daily routine for sustainable intensity improves your health. A clean workspace brings comfort.',
  },
  {
    name: 'Mars Transits the 3rd House',
    description: 'Drive and ambition promote a new level of T-shaped expertise. Friendly competition in the team motivates improvement. Rapid prototyping and hackathons give you energy. Short sprints bring quick, profitable wins. Guard against impatient, aggressive comments during code reviews.',
  },
  {
    name: 'Mars Aspecting Midheaven (MC)',
    description: 'Your technical ambition is heightened, pushing you to take decisive action on major architectural overhauls. While this velocity leads to success, be mindful of bulldozer behavior in PRs and the impact on your team’s morale.',
  },
  {
    name: 'Mercury Aspecting Midheaven (MC)',
    description: 'Clear documentation and system design communication are key in your professional life right now. Express your architectural visions clearly, and be aware of how your technical leadership influences your public reputation in the engineering community.',
  },
  {
    name: 'Mercury aspect Saturn in 10th house',
    description: 'Negotiating technical specs is at a standstill due to conflicts with enterprise architecture boards. There are difficult adjustments to account for new security regulations. Simplify your codebase; do not over-engineer. Leadership is not open to your brainstorming today; save it for later.',
  },
  {
    name: 'Sun Transits the 5th House',
    description: 'Inspiration to build innovative features comes with flashes of insight. With an expanded understanding of AI tools, it is good to draft new system architectures. Your specialized expertise is sought out for advisory roles. Enjoy building side projects; coding feels like creative play right now.',
  },
  {
    name: 'Mars aspect Saturn in 10th house',
    description: 'Compliance and DevOps red tape cause deployments to fail. Your tech lead is set in their ways and resistant to adopting modern frameworks. You may receive an offer for a senior role elsewhere but feel locked into your current legacy project by a sense of duty.',
  },
  {
    name: 'Mercury Transits the 5th House',
    description: 'Architectural ideas must be captured; begin writing technical RFCs. Your deep knowledge could produce a great dev blog. The mind is full of logic and needs to code. You have a compelling need to mentor juniors—a leadership talent emerging. Gamifying your work brings pleasure.',
  },
  {
    name: 'Jupiter aspect Mercury in 8th house',
    description: 'Deep study of complex distributed systems and memory management is a focus. Understanding the root logic of obscure bugs is part of your mastery. You are making excellent, calculated financial plans regarding your stock options and crypto holdings for the future.',
  },
  {
    name: 'Venus Transits the 7th House',
    description: 'Appreciation comes from collaborative pair programming and empathetic code reviews. You are highly valued by product and design teams. Your ability to build consensus on technical directions is strong. Attempts to negotiate a higher salary or better equity will have a welcome outcome.',
  },
  {
    name: 'Saturn aspect Rahu in 9th house',
    description: 'Karmic technical debt surfaces around core architectural decisions made long ago. Abiding by strict enterprise compliance is restrictive but necessary to scale the system. Unrealistic agile expectations are balanced with hard engineering truths and lessons.',
  },
  {
    name: 'Mercury Transits the 6th House',
    description: 'Debugging and writing tests changes your typical product-building routine. You must communicate clearly across different engineering squads. Junior developers present a vital piece of information. Ensure your work setup is ergonomic; repetitive stress injuries are a risk.',
  },
  {
    name: 'Sun aspect Jupiter in the 5th house',
    description: 'Optimism regarding a new technology expands your mind with heightened creativity. A new vision regarding your crypto or startup investments opens doors for financial gains. You will be asked to be a technical advisor. Your passion for elegant software design is fully ignited.',
  },
  {
    name: 'Sun Transits the 6th House',
    description: 'Technical debt and system health become a priority. You are focused on making the codebase stronger and more resilient. Sprints can be demanding and stressful. A demanding product manager makes the workflow difficult. It is time to change bad coding habits and enforce linters.',
  },
  {
    name: 'Mars Transits the 4th House',
    description: 'Disturbances in the core infrastructure cause production issues. Disagreements regarding the base architecture disrupt team peace. Senior engineers find fault with your deployment decisions. Be careful with database migrations; there can be data destruction or rollbacks required.',
  },
  {
    name: 'Mercury Transits the 7th House',
    description: 'API contracts and SLAs are successfully negotiated with partner teams. Brainstorming with junior devs helps you perceive old problems in a modern way. Find the humor in messy legacy code. Attending a tech retreat gives a fresh perspective on a stalled project. Collaborate openly.',
  },
  {
    name: 'Sun Transits the 7th House',
    description: 'A key stakeholder or co-founder is bossy and demanding. Let them feel they control the product vision to avoid disruption, while you quietly control the technical execution. Rely on your engineering team to get the work done. Do not let politics drain your energy.',
  },
  {
    name: 'Jupiter Transits the 5th House',
    description: 'Adopting cutting-edge frameworks expands your technical capability. This transit opens doors to new startup opportunities and visionary peers. Validating your theories with like-minded engineers leads to breakthroughs. Your keen insight into crypto or tech stocks yields gains. You are stepping into a highly valued advisory position; your T-shaped knowledge is your greatest asset.',
  },
  {
    name: 'Mars Transits the 5th House',
    description: 'A competitive drive makes hackathons and rapid prototyping thrilling. You are inspired to push your coding limits. Peers encourage you to showcase your UI/frontend talents. However, junior developers may challenge your authority belligerently. Direct this aggressive energy into passionate creation.',
  },
  {
    name: 'Sun Transits the 8th House',
    description: 'Your physical resistance to burnout is low; step away from the IDE. Complex legacy code causes a sudden drop in technical confidence. Do not push aggressive refactoring agendas on the team now. Past technical debt that was ignored will cause critical failures, requiring immediate patching.',
  },
  {
    name: 'Rahu Transits the 10th House',
    description: 'Expect major, disruptive changes in your engineering career. Your company will undergo a massive technical or agile overhaul. You may pivot entirely (e.g., from mobile to web). A project cancellation forces you in a new, ultimately better direction. Avoid purchasing locked-in enterprise software now. Financial valuations of your equity fluctuate. You yearn to find an engineering culture that truly feels like home.',
  },
  {
    name: 'Ketu Transits the 4th House',
    description: 'You feel detached from the foundational codebase you used to maintain. A shift in the company\'s core architecture leaves you feeling disconnected. Avoid heavy investments in personal hardware right now. You are releasing your reliance on old, comfortable frameworks. There is a wandering, unsettled feeling in your technical identity as you search for modern paradigms.',
  },
  {
    name: 'Mercury Transits the 8th House',
    description: 'Your powers of technical investigation and debugging are profound. Reading industry news and understanding market shifts leads your career in the right direction. Listen closely in post-mortems; the information revealed is enlightening. You will uncover the root cause of a deep architectural flaw.',
  },
  {
    name: 'Ketu aspect Mars in 8th house',
    description: 'Frustration over deeply embedded legacy systems boils over, offering a chance for a final, clean refactor. Old arguments over system architecture are re-examined. Deep analysis leads to breakthroughs in backend efficiency. Focus on deleting dead code and cleansing the repository.',
  },
  {
    name: 'Rahu aspect Moon in the 6th house',
    description: 'Slow down; your obsession with productivity is causing burnout. Stress from complex coding tasks strikes out unexpectedly. You obsessively research new productivity hacks. Workplace gossip and shifting agile requirements cause anxiety. Hormonal or physical stress requires you to enforce sustainable intensity.',
  },
  {
    name: 'Sun Transits the 9th House',
    description: 'Optimism brings a renewed passion for software engineering. A new perspective comes from mastering advanced system design concepts. Technical books and whitepapers inspire a pivot in your architectural approach. Attending a global tech summit brings freedom and vision. Avoid being dogmatic.',
  },
  {
    name: 'Mercury Transits the 9th House',
    description: 'Learning AI tools or distributed systems opens a wave of knowledge that elevates your career. Listen to principal engineers; they have the mentorship you need. It is time to speak at a conference or lead a guild. Embrace open-mindedness to successfully transition your tech stack.',
  },
  {
    name: 'Venus Transits the 8th House',
    description: 'Disappointment in a vendor API or open-source library ruins trust in third-party integrations. Their lack of support falls short. It is time to rewrite the logic in-house. Suspicion comes from a fear of security breaches. Money may come through an unexpected tech buyout or crypto spike.',
  },
  {
    name: 'Mercury Transits the 10th House',
    description: 'High-level architecture meetings are necessary to clear the air for new product roadmaps. Expectations are defined; write the technical RFCs because these ideas will become reality. Be adaptable to new micro-frontend ideas from the team. Your communication secures your status as a tech leader.',
  },
  {
    name: 'Sun Transits the 10th House',
    description: 'This is your time to shine in senior technical leadership interviews. You are positioned as an authority on scalable architecture. Schedule interviews for top-tier tech roles; expect offers and promotions. As a rising T-shaped engineer, your self-confidence is at a peak.',
  },
  {
    name: 'Jupiter aspect Mars in 8th house',
    description: 'Your analytical mind delves into deep architectural research, making massive technical discoveries. You reflect on the logic behind your career pivots. Ensure your startup partners or employers are handling your equity and compensation fairly.',
  },
  {
    name: 'Moon Aspecting Midheaven (MC)',
    description: 'Your intuition is closely tied to your tech career, making you sensitive to code review feedback and leadership changes. Trust your gut on system design choices, but avoid letting imposter syndrome overly influence your professional trajectory.',
  },
  {
    name: 'Mercury Transits the 11th House',
    description: 'Engineering peers reach out with exciting startup news. Connecting to open-source communities with progressive tech stacks is inspiring. Listen to junior developers; they understand the next wave of tooling. A technical breakthrough brings hope for a highly scalable, prosperous future.',
  },
  {
    name: 'Moon Aspecting Ascendant (ASC)',
    description: 'You may feel more introspective about your identity as an engineer. It is a good time to focus on your portfolio and personal brand, but guard your energy against burnout to ensure your fluctuating motivation doesn\'t affect your sprint deliverables.',
  },
  {
    name: 'Venus Transits the 9th House',
    description: 'A new architectural philosophy opens your creative mind. Don\'t be afraid to adopt bleeding-edge frameworks (like advanced AI assistants) because they offer newfound development speed. A visionary approach cures the burnout of past technical debt. Your career is an adventure of continuous learning.',
  },
  {
    name: 'Sun Transits the 11th House',
    description: 'Influential CTOs or tech founders offer you mentorship and leverage. Your network in the engineering community is broadening rapidly. Opportunities for equity growth are presented in new startups. However, be wary of peers who merely want to use your coding talents for their own gain.',
  },
  {
    name: 'Venus Transits the 10th House',
    description: 'Your approach to technical leadership becomes more graceful and UI-focused. Look for opportunities to lead projects that blend frontend design systems with complex engineering. Elegant architectural diagrams will be the missing link to win over stakeholders. Champion diversity in your engineering org.',
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