const db = require('./advice');

const events = [
  {
    name: 'Moon Transits the 8th House',
    description: "Step back from external chaos and prioritize inner calm. Ground yourself with a hot, nourishing bowl of beef noodles and avoid initiating unpredictable financial transactions. Keep a low profile and trust your intuition over external advice.",
  },
  {
    name: 'Moon aspect Venus in 8th house',
    description: "Lean into nostalgia and reconnect with those you deeply trust. A small gesture of affection goes a long way today. Guard your energy and avoid overly demanding social settings; prioritize private, intimate moments.",
  },
  {
    name: 'Venus ruler of the 2nd House in the 8th House',
    description: "This is a favorable window for reviewing shared resources, passive income, or settlements. Practice radical honesty with yourself to release old emotional baggage. Avoid impulsive spending; instead, strategize your long-term wealth preservation.",
  },
  {
    name: 'Venus ruler of the 7th House in the 8th house',
    description: "Maintain clear, transparent communication with your partner, especially if their schedule is demanding. Avoid sweeping relationship issues under the rug. Focus on rebuilding trust through consistent, small actions rather than grand gestures.",
  },
  {
    name: 'Moon aspect Mercury in 8th house',
    description: "Your analytical mind is exceptionally sharp today. It is a perfect transit to dive deep into complex charts, analyzing technical indicators like MACD and RSI, or focusing on intricate software architecture. Keep your breakthroughs private until fully vetted.",
  },
  {
    name: 'Mercury ruler of the 3rd House in the 8th House',
    description: "Tread carefully in conversations with peers or siblings, as misunderstandings can quickly escalate. Channel this intense mental energy into metaphysical studies or deep self-analysis. Journaling your thoughts will help untangle complex emotions.",
  },
  {
    name: 'Mercury ruler of the 6th House in the 8th House',
    description: "Prioritize your physical well-being and do not ignore minor health ailments. Double-check all professional communications and code deployments to avoid critical errors. Keep your workspace quiet and minimize interactions with disruptive colleagues.",
  },
  {
    name: 'Moon aspect Mars in 8th house',
    description: "You may feel an undercurrent of frustration today. Actively transform this restless energy by engaging in a strenuous physical workout to clear your head. Avoid dwelling on past grievances; focus entirely on actionable, forward-moving tasks.",
  },
  {
    name: 'Mars ruler of the 1st House in the 8th House',
    description: "Patience is your greatest asset right now. If you encounter roadblocks, do not force a solution. Retreat, hydrate, and engage in deep introspection. Use this transit to study complex systems rather than trying to conquer them outwardly.",
  },
  {
    name: 'Mars ruler of the 8th House in the 8th House',
    description: "Your investigative instincts are heightened. Use this profound psychological awareness to uncover hidden inefficiencies in your work or personal habits. Protect your secrets, but don't let paranoia prevent you from making necessary transformative changes.",
  },
  {
    name: 'Moon Transits the 9th House',
    description: "Allow your rigid beliefs to soften today. Seek out a mentor or dive into philosophical literature. It is an excellent day to step outside your usual routine—take a different route on your walk or explore a new framework for your projects.",
  },
  {
    name: 'Moon aspect Sun in 9th house',
    description: "Start your morning with an inspirational podcast or reading. Let optimism drive your decision-making today. It is a highly favorable time to share your broader vision with others and tap into your spiritual or philosophical foundation.",
  },
  {
    name: 'Sun ruler of the 5th House in the 9th House',
    description: "Luck is on your side when you operate with absolute integrity. Engage in activities that blend teaching and spirituality. Trust your instincts on investments today, and take time to mentor someone who looks up to you.",
  },
  {
    name: 'Moon aspect Rahu in 9th house',
    description: "You may be triggered by extreme opinions in the news or online. Consciously unplug from media algorithms. Ground your perspective in reality and avoid getting swept up in fanatical debates that drain your energy.",
  },
  {
    name: 'Moon aspect Ketu in 3rd house',
    description: "Embrace your unconventional ideas today. Do not force yourself to communicate or work the way others expect. Utilize your unique genius to draft out-of-the-box solutions, but expect minor disruptions in your daily commute or schedule.",
  },
  {
    name: 'Moon Transits the 10th House',
    description: "Stay adaptable at work, as management dynamics or project directions may suddenly shift. Do not take mixed messages personally. Maintain your professionalism, focus on your immediate deliverables, and avoid office politics entirely.",
  },
  {
    name: 'Sun Transits the 12th House',
    description: "Carve out strict solitary time to recharge your drained batteries. Focus on wrapping up lingering projects rather than starting new ones. Prioritize a full night's sleep and avoid taking on the emotional baggage of those around you.",
  },
  {
    name: 'Moon aspect Saturn in 10th house',
    description: "The workplace atmosphere may feel heavy or uninspired today. Put your head down and focus strictly on executing tasks well. Your quiet diligence will eventually lift your own mood and set a stabilizing example for your peers.",
  },
  {
    name: 'Saturn ruler of the 10th House in the 10th House',
    description: "Embrace the weight of professional responsibility. Focus on eliminating technical debt and structuring long-term, scalable solutions. Your discipline now cements your reputation as a reliable leader. Update your resume and prepare for advancement.",
  },
  {
    name: 'Saturn ruler of the 11th House in the 10th House',
    description: "Seek out guidance from seasoned mentors in your industry. Align your daily tasks with your ultimate career purpose. Networking with powerful, established individuals will yield significant long-term benefits for your trajectory.",
  },
  {
    name: 'Moon Transits the 11th House',
    description: "Set firm boundaries with friends or acquaintances who demand too much of your time. Focus on light, enjoyable social interactions but avoid getting entangled in gossip. Protect your energy for your own long-term goals.",
  },
  {
    name: 'Moon aspect Jupiter in 5th house',
    description: "Inject playfulness into your day. Listen to uplifting music while you work, or engage in a purely creative hobby. Interacting with children or taking a lighthearted approach to your investments will yield positive emotional returns.",
  },
  {
    name: 'Jupiter ruler of the 9th House in the 5th House',
    description: "Your advice is highly valuable today; share your wisdom generously but humbly. Review your investment portfolio, as fortune favors your logical yet intuitive approach. Dedicate time to studying higher knowledge or spiritual texts.",
  },
  {
    name: 'Jupiter ruler of the 12th House in the 5th House',
    description: "Tap into your latent creative talents behind closed doors. Your intuition is acting as a direct guide today—trust your gut feelings on complex matters. Spend time in quiet meditation to cultivate your understanding of metaphysical concepts.",
  },
  {
    name: 'Moon Transits the 12th House',
    description: "Allow yourself to rest and process old memories that surface today. Keep your schedule light and avoid highly demanding social obligations. Pay close attention to your dreams tonight, as they hold keys to releasing past emotional pain.",
  },
  {
    name: 'Mars aspect Jupiter in 5th house',
    description: "Channel your vitality into competitive or entertaining pursuits. It's a great day for a high-energy sport or attending a live event. Take calculated risks in romance or investments, as your confidence naturally attracts positive outcomes.",
  },
  {
    name: 'Sun in 9th (Dispositor)',
    description: "Act with unshakeable integrity today. If you feel weighed down by ancestral or familial expectations, take a short trip or change your environment to reclaim your sense of freedom and personal truth.",
  },
  {
    name: 'Moon aspect Moon in 6th house',
    description: "Offer compassionate support to colleagues, but do not absorb their stress. Your digestive system is highly sensitive today; stick to a clean, easily digestible diet and avoid heavy, processed meals.",
  },
  {
    name: 'Moon ruler of the 4th House in the 6th House',
    description: "Memories of familial struggles or debts may surface, causing anxiety. Actively release this tension by organizing your physical workspace or home. Stick to a strict budget today and check in on maternal figures if you feel called to do so.",
  },
  {
    name: 'Moon Transits the 1st House',
    description: "Harness your clear mindset to instigate a fresh start on a stagnant project. Trust your heightened sensitivities to guide your immediate choices. Surround yourself with comforting environments and supportive, nurturing individuals.",
  },
  {
    name: 'Moon Transits the 2nd House',
    description: "Avoid making large financial investments or impulsive purchases today. Find stability by cooking a hearty meal and spending quiet time at home. Be mindful of emotional eating; nourish your body with intention.",
  },
  {
    name: 'Venus aspect Moon in 6th house',
    description: "Integrate beauty into your daily routines. Upgrade your skincare, attend a yoga class, or take extra care in selecting fresh produce at the market. Surrounding yourself with aesthetics will drastically improve your mental health.",
  },
  {
    name: 'Mercury in 8th (Dispositor)',
    description: "Use your piercing intellect to get to the root of a lingering problem. Silence external distractions and listen to your psychic awareness. Applying your understanding of human psychology will help you navigate complex negotiations today.",
  },
  {
    name: 'Moon Transits the 3rd House',
    description: "Stay entirely flexible with your schedule today. Take spontaneous short walks to clear your mind. It is a fantastic day to try a new recipe or read a fascinating article, but steer clear of participating in office rumors.",
  },
  {
    name: 'Venus Transits the 1st House',
    description: "Your natural charisma is amplified. Invest time in your personal grooming and wardrobe. It is an excellent day for public presentations, dates, or attending cultural events, as people are naturally drawn to your energy and ideas.",
  },
  {
    name: 'Moon Transits the 4th House',
    description: "Prioritize home and hearth. Nostalgic feelings are strong, so look at old photos or prepare a comforting family recipe. Cancel non-essential evening plans and allow yourself to retreat into your personal sanctuary for deep rest.",
  },
  {
    name: 'Mars aspect Moon in 6th house',
    description: "Patience is required with complaining coworkers. Your digestion is linked directly to your temper today; avoid spicy or overly rich foods. Practice deep breathing exercises to balance your hormonal and emotional fluctuations.",
  },
  {
    name: 'Uranus conjunct Venus',
    description: "Embrace spontaneity in your romantic and financial life, but avoid reckless commitments. You may experience sudden infatuations or windfalls. Enjoy the excitement, but wait 48 hours before making any major purchases or relationship declarations.",
  },
  {
    name: 'Mars in 8th (Dispositor)',
    description: "Your ability to research and dig deeply is unparalleled right now. Apply this intense focus to uncovering the root cause of technical bugs or psychological blocks. Use physical exercise to burn off any obsessive mental loops.",
  },
  {
    name: 'Moon Transits the 5th House',
    description: "Capture your sudden flashes of inspiration by jotting them down immediately. Approach your day with a playful, optimistic attitude. Take regular breaks to let your mind wander, as daydreaming will lead to your best creative solutions.",
  },
  {
    name: 'Mars Transits the 12th House',
    description: "Keep your plans and strategies strictly confidential today to avoid sabotage. Ensure your home security is active and lock your digital devices. Prioritize stress-relief practices before bed to prevent insomnia or anxiety-driven nightmares.",
  },
  {
    name: 'Mercury aspect Jupiter in 5th house',
    description: "Dive into new technologies or automation tools that can streamline your investments or workflow. Creative writing and brainstorming sessions will be highly productive. Keep an open mind, as a brilliant new idea is likely to strike.",
  },
  {
    name: 'Sun aspect Moon in 6th house',
    description: "Implement a small but impactful change to your daily health routine today, such as upgrading your vitamins or committing to a morning walk. These minor adjustments will solidify into powerful, lifelong healthy habits.",
  },
  {
    name: 'Sun Transits the 1st House',
    description: "Capitalize on your surging vitality by launching a new project or exercise regimen. Walk with confidence and tackle leadership tasks head-on. Ensure your assertiveness does not cross into arrogance when dealing with peers.",
  },
  {
    name: 'Mercury Transits the 12th House',
    description: "Begin a private journal to process complex past experiences. Research foreign cultures or plan a future retreat. Pay close attention to your intuition and coincidences, but avoid signing binding contracts until your mind feels more grounded.",
  },
  {
    name: 'Ketu aspect Sun in the 9th house',
    description: "Question your long-held beliefs, as outdated philosophies are crumbling. Avoid power struggles with authority figures or mentors. If a specific path feels blocked, accept it gracefully and pivot toward a more authentic direction.",
  },
  {
    name: 'Venus Aspecting Ascendant (ASC)',
    description: "Use your heightened sociability to smooth over past conflicts or network with key individuals. Treat yourself to something aesthetically pleasing, but ensure you maintain a balance between indulgence and your daily responsibilities.",
  },
  {
    name: 'Jupiter in 5th (Dispositor)',
    description: "Focus heavily on creative manifestation and bold new ideas. Your capacity to generate prosperity through original thinking is high. Spend joyous time with younger people or children to shift your perspective entirely.",
  },
  {
    name: 'Moon Transits the 6th House',
    description: "Your immune system is slightly compromised; stick to simple, wholesome foods to avoid stomach upset. Ignore the whirlwind of workplace gossip and focus strictly on your tasks. Spend time with pets to ground your anxious energy.",
  },
  {
    name: 'Moon Transits the 7th House',
    description: "Do not panic if your partner or a close collaborator seems emotionally erratic today. Give them space and avoid making permanent decisions based on fleeting chaos. Remember that the current uncertainty is temporary.",
  },
  {
    name: 'Saturn aspect Sun in 9th house',
    description: "You may feel disconnected from your usual spiritual or philosophical anchors. Use this period of disillusionment to build a more realistic, self-reliant belief system. Be patient with older mentors or father figures who may be struggling.",
  },
  {
    name: 'Venus Transits the 2nd House',
    description: "Treat yourself to a high-quality meal or a luxury item that truly brings you joy, but keep within your budget. Use your enhanced diplomacy to negotiate financial matters. Skincare and self-care routines are highly effective today.",
  },
  {
    name: 'Venus aspect Venus in 8th house',
    description: "Prioritize intimacy and deep connection. Plan a quiet evening at home with your partner—perhaps sharing a simple, sweet beancurd dessert. Financial matters involving shared resources look favorable, but keep the focus on emotional bonding.",
  },
  {
    name: 'Sun Aspecting Ascendant (ASC)',
    description: "Step into the spotlight and confidently present your ideas. Your vitality is high, making it a great day to tackle demanding tasks. Be mindful to soften your approach so you do not overpower quieter individuals in the room.",
  },
  {
    name: 'Mercury Aspecting Ascendant (ASC)',
    description: "Draft important emails, write documentation, or schedule crucial meetings today. Your communication is crisp and effective. Avoid multitasking too heavily; focus your mental energy on one complex problem at a time for best results.",
  },
  {
    name: 'Venus aspect Mercury in 8th house',
    description: "Express your deepest sentiments to those you trust. It is an excellent day for heart-to-heart conversations or planning a private weekend getaway. Allow yourself to romanticize your life lightly to boost your mood.",
  },
  {
    name: 'Venus aspect Mars in 8th house',
    description: "Your magnetic appeal is strong, but be discerning about who you draw into your orbit. Channel this intense passion into a creative project or a romantic evening. Keep a strict eye on your expenses to avoid impulsive indulgences.",
  },
  {
    name: 'Mars aspect Venus in 8th house',
    description: "Passions run hot today. Use this dynamic energy to break through creative blocks or deepen an intimate bond. Avoid utilizing your charm for manipulation, and forcefully resist the urge to make risky financial gambles.",
  },
  {
    name: 'Venus Transits the 3rd House',
    description: "Engage your hands in a creative hobby or home beautification project. Reach out to siblings or close neighbors with positive news. Take a short, relaxing drive or walk while listening to uplifting music to clear your head.",
  },
  {
    name: 'Mercury Transits the 2nd House',
    description: "Sit down and map out your financial budget or investment strategy clearly. It is a highly favorable time to purchase educational courses, tech equipment, or books. Discuss financial expectations calmly with your partner.",
  },
  {
    name: 'Sun Transits the 2nd House',
    description: "Keep a tight grip on your wallet, as unexpected expenses are likely to arise. Do not let financial stress dictate your self-worth. Stick to a clean diet today, as your physical energy is closely tied to what you consume.",
  },
  {
    name: 'Mercury Transits the 1st House',
    description: "Speak up in meetings and share your innovative ideas. Your mind is hungry for stimulation, so begin learning a new technical skill or language. Engage with younger peers to gain a fresh, modern perspective on old problems.",
  },
  {
    name: 'Mars Transits the 1st House',
    description: "Channel your surging ambition into conquering tasks you've been procrastinating on. Exercise vigorously to burn off feelings of agitation. Move mindfully and avoid rushing, as you are slightly more prone to minor accidents or headaches today.",
  },
  {
    name: 'Mars aspect Ketu in 3rd house',
    description: "Do not force your agenda today, as sudden roadblocks will frustrate your ambition. Postpone difficult conversations with siblings. Drive with extreme caution and avoid operating heavy machinery if you feel emotionally distracted.",
  },
  {
    name: 'Mercury aspect Venus in 8th house',
    description: "Write down your deepest feelings or articulate them to a trusted confidant. Your mind is attuned to the aesthetics of life, making it a good time to design or plan. Enjoy the quiet contentment of a committed bond.",
  },
  {
    name: 'Sun aspect Venus in 8th house',
    description: "Acknowledge memories of past relationships, but actively choose to release them. Focus on cultivating healthy independence rather than codependency. Pour your intense passion into a solo creative endeavor instead of external validation.",
  },
  {
    name: 'Mercury aspect Mercury in 8th house',
    description: "Your ability to focus on granular details is unmatched today. Dive into heavy research, debug complex code, or investigate market trends. Trust your sudden intuitive hunches when you hit a logical dead end.",
  },
  {
    name: 'Venus aspect Sun in 9th house',
    description: "Expand your horizons by planning future travel or signing up for a masterclass. Share your knowledge generously with others. Connect with female mentors or teachers who have profoundly shaped your worldview.",
  },
  {
    name: 'Mars Aspecting Ascendant (ASC)',
    description: "Channel your heightened ambition into physical and mental challenges. A vigorous game of badminton or a hard workout will burn off excess mental friction. Keep communication direct but tactful to avoid unnecessary peer rivalry.",
  },
  {
    name: 'Venus aspect Rahu in 9th house',
    description: "Allow yourself to dream big regarding travel and luxury. Cultivate your public image and learn from unconventional teachers. If legal matters are pending, expect forward momentum. Connect with your father or a father figure today.",
  },
  {
    name: 'Venus aspect Ketu in 3rd house',
    description: "Attend local meetups or classes to spark your creativity. Be open to chance encounters that reignite old passions. A spontaneous short trip could provide the exact shift in perspective you've been craving.",
  },
  {
    name: 'Mercury aspect Mars in 8th house',
    description: "Your mind is a razor today—use it to cut through complex data or psychological mysteries. Avoid getting dragged into philosophical arguments that waste your time. Trust your inner voice to lead you straight to the correct answer.",
  },
  {
    name: 'Mercury Transits the 3rd House',
    description: "Draft your to-do lists and organize your schedule for the upcoming month. Purchase that new tech gadget or software you need. Keep your communications light, quick, and positive, and take a short trip if possible.",
  },
  {
    name: 'Mars aspect Mercury in 8th house',
    description: "Focus intensely on investigative tasks and troubleshooting. Do not allow your thoughts to spiral into dark or overly cynical territory. Redirect your mental sharpness toward practical problem-solving and actionable research.",
  },
  {
    name: 'Jupiter Transits the 4th House',
    description: "Invest energy into your home environment—clean, renovate, or browse real estate. Host a cheerful gathering with family or close friends. Working from home will be highly productive and emotionally satisfying today.",
  },
  {
    name: 'Jupiter aspect Venus in 8th house',
    description: "Financial blessings may come through your partner or external investments. Focus on clearing outstanding debts to increase your sense of freedom. Be generous but wise with your newly acquired resources.",
  },
  {
    name: 'Sun aspect Mercury in 8th house',
    description: "Allow your mind to probe the deeper existential questions today. Read up on psychology or metaphysical topics to satisfy this curiosity. Use this introspective transit to understand your own underlying motivations.",
  },
  {
    name: 'Mercury aspect Sun in 9th house',
    description: "Engage in stimulating conversations with like-minded individuals. Read a book that broadens your worldview. Reach out to a mentor or father figure for advice, as their perspective will bring you immense clarity.",
  },
  {
    name: 'Mercury aspect Ketu in 3rd house',
    description: "Expect delays and miscommunications today. Triple-check your emails before sending and practice active listening, especially with siblings. Pivot your strategy if traditional learning or sales methods are failing you today.",
  },
  {
    name: 'Mercury aspect Rahu in 9th house',
    description: "Embrace unconventional ideas and out-of-the-box educational content. If an unexpected opportunity to travel or attend a conference arises, take it. Keep an open mind, as rigid thinking will block your progress today.",
  },
  {
    name: 'Venus Transits the 4th House',
    description: "Focus on beautifying your personal sanctuary and finding peace at home. Unwind by sharing a comforting treat, like a beancurd dessert, with family. Use this gentle energy to recharge away from professional demands.",
  },
  {
    name: 'Sun aspect Mars in 8th house',
    description: "Do not react defensively to perceived slights. Recognize that underlying anger is coloring your perception today. Channel this intense friction into a demanding scientific or analytical task where aggression becomes focus.",
  },
  {
    name: 'Venus Aspecting Midheaven (MC)',
    description: "Utilize your charm and diplomacy to smooth over workplace tensions. It is a highly favorable day to ask for favors from management or present a creative project. Keep your professional relationships harmonious and professional.",
  },
  {
    name: 'Saturn in 10th (Dispositor)',
    description: "Acknowledge any feelings of burnout or dissatisfaction with your current career trajectory. Do not make sudden moves; instead, quietly outline a transition plan. Take a designated break to restore your sense of meaning.",
  },
  {
    name: 'Jupiter Aspecting Midheaven (MC)',
    description: "Say yes to opportunities for career expansion. Take a calculated risk on a new project or leadership role. Ensure that this new professional venture aligns perfectly with your ultimate financial and personal boundaries.",
  },
  {
    name: 'Sun Transits the 3rd House',
    description: "Allow siblings or close peers to take the lead on group decisions today to avoid friction. Tackle your immediate to-do list with ambition and speed. A short change of scenery will highly benefit your mental state.",
  },
  {
    name: 'Mars aspect Mars in 8th house',
    description: "Your drive to uncover the truth is unstoppable today. Apply this relentless tenacity to your most difficult research or technical problems. Be cautious not to bulldoze over others in your quest for answers.",
  },
  {
    name: 'Venus aspect Saturn in 10th house',
    description: "Accept new workplace responsibilities with grace; your discipline is being observed. If you feel restricted by management, begin drafting a blueprint for your own independent business or a lateral career move.",
  },
  {
    name: 'Sun Transits the 12th House',
    description: "Retreat from the spotlight and protect your energy. Focus on concluding old business rather than launching anything new. Prioritize meditation and ample sleep to counteract any underlying anxiety or worry.",
  },
  {
    name: 'Mercury aspects the Moon in the 6th house',
    description: "Brainstorming with coworkers will yield highly effective solutions today. Review and adjust your dietary habits based on logical research. Take a brisk walk outside to clear mental fog and improve your physical vitality.",
  },
  {
    name: 'Sun Transits the 2nd House',
    description: "Audit your expenses and halt any impulsive buying. Financial curveballs are possible, so maintain a conservative budget. Eat clean, simple foods today, as your body is highly sensitive to toxins or rich meals.",
  },
  {
    name: 'Sun Transits the 3rd House',
    description: "Step back and let others manage the minor details today. Use your energy to swiftly execute your own standalone projects. A quick trip or focused study session will invigorate your ambition.",
  },
  {
    name: 'Mars Transits the 2nd House',
    description: "Lock away your credit cards to prevent impulsive spending. Guard your speech carefully, as you are prone to snapping at loved ones. Eat your meals slowly and mindfully to prevent stress-induced digestive issues.",
  },
  {
    name: 'Mercury Transits the 4th House',
    description: "Bring your work or studies into the comfort of your home today. Call your mother or familial figures to catch up. Use the quiet of your household to absorb new information or read deeply.",
  },
  {
    name: 'Pluto conjunct Saturn',
    description: "Embrace extreme discipline. You are being tested with heavy responsibilities, so create rigid structures and schedules to manage your time. Eliminate all frivolous distractions and focus purely on your core duties.",
  },
  {
    name: 'Sun aspects Sun in 9th house',
    description: "Reinvigorate your life by diving into a course on human development or philosophy. Seek out the counsel of a respected father figure. Suspend all judgment of others to keep your own energetic pathways open.",
  },
  {
    name: 'Sun aspect Ketu in the 3rd house',
    description: "Do not let a minor setback or humiliation derail your confidence. Extract the lesson and move forward immediately. Limit your interactions with friends or siblings who consistently bring complaints without solutions.",
  },
  {
    name: 'Sun aspect Rahu in 9th house',
    description: "It is normal to question your current educational or spiritual path today. Allow yourself to outgrow old teachings without bitterness. Seek out progressive, unconventional knowledge that aligns with your current reality.",
  },
  {
    name: 'Venus Transits the 5th House',
    description: "Immerse yourself in the arts, music, or a purely creative hobby to escape daily stress. Keep your heart open to romance and playful interactions. A minor, calculated speculation in the markets may prove lucky today.",
  },
  {
    name: 'Mars aspect Sun in 9th house',
    description: "Say yes to an adventure or a spontaneous learning opportunity. Your passion for discovery is high. Exercise extreme patience with family members, as their emotional pacing may be much slower than your own today.",
  },
  {
    name: 'Mars aspect Rahu in 9th house',
    description: "Expect logistical nightmares if traveling; pack extra patience. Question authority figures or gurus if their guidance feels off. Seek your own truth rather than blindly following established dogmas.",
  },
  {
    name: 'Jupiter aspect Saturn in 10th house',
    description: "Your relentless hard work is about to pay off. Step confidently into expanded leadership roles and ask for the compensation you deserve. Remain open-minded to unexpected, lucrative career offers from outside your current network.",
  },
  {
    name: 'Sun Transits the 4th House',
    description: "Focus your energy on establishing security within your home. Handle necessary repairs promptly. Spend quality time with family to build emotional warmth, and consider investing in a home security system for peace of mind.",
  },
  {
    name: 'Sun Aspecting Midheaven (MC)',
    description: "Your professional visibility is at its peak. Step confidently into technical leadership roles and own your architectural decisions. Ask for that promotion or tackle high-stakes migrations with public authority.",
  },
  {
    name: 'Venus aspect Jupiter in 5th house',
    description: "Your creative and investment instincts are perfectly aligned. Trust your analysis on the stock market today. Open your heart to romance and allow yourself to fully enjoy the playful, abundant energy surrounding you.",
  },
  {
    name: 'Sun aspect Saturn in 10th house',
    description: "Navigate workplace politics with extreme caution today. Do not openly challenge your superiors, as they are under immense pressure. Observe the structural flaws in management quietly and use this data for your future strategies.",
  },
  {
    name: 'Venus Transits the 6th House',
    description: "Bring a spirit of collaboration and kindness to your workplace. Tackle complex work projects by applying a creative, aesthetic perspective. Avoid sugary foods to maintain your energy, and spend soothing time with pets.",
  },
  {
    name: 'Mars Transits the 3rd House',
    description: "Use your competitive edge to crush your daily goals. Engage in strenuous physical exercise to maintain your sharp focus. Avoid petty arguments with siblings or peers, and channel that fire into rapid skill acquisition.",
  },
  {
    name: 'Mars Aspecting Midheaven (MC)',
    description: "Push aggressively for your career milestones today, but beware of steamrolling your colleagues. Your ambition is a weapon—use it to execute tasks, not to start office wars. Leave work at work to protect your personal life.",
  },
  {
    name: 'Mercury Aspecting Midheaven (MC)',
    description: "Articulate your professional ideas with precision. It is an excellent day for public speaking, writing reports, or pitching strategies. Ensure your tone remains professional, as your words carry significant weight today.",
  },
  {
    name: 'Mercury aspect Saturn in 10th house',
    description: "Do not push for new business negotiations today, as you will face bureaucratic walls. Simplify your daily tasks and focus on compliance rather than innovation. Save your brilliant brainstorming for a more receptive time.",
  },
  {
    name: 'Sun Transits the 5th House',
    description: "Write down the flood of creative insights hitting you today. Take time off to attend a cultural event or engage in a hobby. Step away from rigid routines and allow yourself to date, play, and experience joy.",
  },
  {
    name: 'Mars aspect Saturn in 10th house',
    description: "Frustration at work is high due to rigid, outdated management. Do not force progress today; bide your time. Begin actively searching for new opportunities that offer the autonomy you crave, but maintain your current responsibilities.",
  },
  {
    name: 'Mercury Transits the 5th House',
    description: "Your urge to teach and express is powerful. Document your knowledge, write articles, or mentor someone junior. Engage in lively, intellectual conversations with younger individuals to spark fresh inspiration.",
  },
  {
    name: 'Jupiter aspect Mercury in 8th house',
    description: "Dedicate time to serious financial planning and market analysis. Your ability to comprehend deep, complex data is amplified. Study human psychology to better understand the hidden motives of those around you.",
  },
  {
    name: 'Venus Transits the 7th House',
    description: "Lean heavily into diplomacy and collaboration. Be open to romantic gestures or strengthening your business partnerships. A polite, appreciative approach with management will yield significantly better results than demanding respect.",
  },
  {
    name: 'Saturn aspect Rahu in 9th house',
    description: "Accept the restrictive rules or laws currently in place, as they are serving a karmic purpose. Heal lingering issues with father figures. Discard unrealistic beliefs and ground your philosophy in practical, observable reality.",
  },
  {
    name: 'Mercury Transits the 6th House',
    description: "Communicate clearly and frequently with your coworkers to avoid logistical errors. Change up your daily routine to prevent boredom. Practice deep breathing exercises, as your nervous system is prone to overload today.",
  },
  {
    name: 'Sun aspect Jupiter in the 5th house',
    description: "Trust your optimistic outlook and take action on investment strategies today. Step up as an advisor to those who seek your wisdom. Allow yourself to be vulnerable and open to the joy of romantic possibilities.",
  },
  {
    name: 'Sun Transits the 6th House',
    description: "Prioritize your physical strength by adopting a stricter exercise or diet regimen. The workplace will be stressful; counter bossy colleagues by maintaining strict boundaries and focusing solely on your own output.",
  },
  {
    name: 'Mars Transits the 4th House',
    description: "Practice extreme patience at home to avoid explosive family arguments. Channel your restless energy into heavy house cleaning or DIY repairs. Check your vehicle and home appliances for safety hazards immediately.",
  },
  {
    name: 'Mercury Transits the 7th House',
    description: "Draft clear agreements and future plans with your partners today. Use humor to defuse any tense negotiations. Seek out the opinions of younger individuals to break out of stagnant, rigid mindsets.",
  },
  {
    name: 'Sun Transits the 7th House',
    description: "Sidestep power struggles with demanding partners or colleagues. Delegate tasks quietly rather than fighting for control. Let others believe they are leading while you efficiently guide the project from behind the scenes.",
  },
  {
    name: 'Jupiter Transits the 5th House',
    description: "Expose yourself to cutting-edge ideas and new entertainment venues. Investigate speculative markets carefully, as your intuition for gains is sharp. Celebrate the achievements of the younger people or children in your life.",
  },
  {
    name: 'Mars Transits the 5th House',
    description: "Burn off excess energy through competitive sports or games. Stand firm but calm against any disrespectful behavior from younger individuals. Channel your aggressive drive into pursuing a passion project or romance.",
  },
  {
    name: 'Sun Transits the 8th House',
    description: "Your physical vitality is low; prioritize rest, hydration, and vitamins to avoid illness. Confront past debts or ignored problems before they escalate. Monitor your partner's spending to prevent financial drain.",
  },
  {
    name: 'Rahu Transits the 10th House',
    description: "Embrace the massive transitions occurring in your career. Avoid purchasing property or vehicles during this unstable period. Ground your restless soul by cherishing small, stable moments with your immediate family.",
  },
  {
    name: 'Ketu Transits the 4th House',
    description: "Acknowledge the feelings of rootlessness or disconnect from your home life. Avoid major purchases like real estate or cars right now. Focus on internal, spiritual grounding rather than seeking comfort in external environments.",
  },
  {
    name: 'Mercury Transits the 8th House',
    description: "Your analytical mind is razor-sharp right now. Dive deep into complex problem-solving, like writing complex scripts or analyzing market charts. Keep your findings to yourself until fully validated and organized.",
  },
  {
    name: 'Ketu aspect Mars in 8th house',
    description: "Confront and release repressed anger through vigorous exercise or deep therapy. Apply your focus to scientific or technical breakthroughs rather than emotional rumination. Support your body with a clean, detoxifying diet.",
  },
  {
    name: 'Rahu aspect Moon in the 6th house',
    description: "Eat slowly and deliberately, as your digestive system is highly erratic today. Stay out of workplace drama and ignore gossip entirely. Balance your fluctuating moods through grounding routines and practical tasks.",
  },
  {
    name: 'Sun Transits the 9th House',
    description: "Let optimism guide your actions today. Read philosophical texts that challenge your worldview. Plan a getaway to refresh your perspective, and seek out the wisdom of a respected mentor or father figure.",
  },
  {
    name: 'Mercury Transits the 9th House',
    description: "Soak up new information like a sponge. Listen closely to the unconventional wisdom of younger generations. Keep an entirely open mind, as rigid dogmas will prevent you from seeing a massive new opportunity.",
  },
  {
    name: 'Venus Transits the 8th House',
    description: "Do not let a fear of betrayal prevent you from making sound financial or romantic choices. Renegotiate your boundaries clearly. Ensure your assets are protected with proper insurance, and be receptive to unexpected financial gains.",
  },
  {
    name: 'Mercury Transits the 10th House',
    description: "Speak clearly and lay out your expectations in all professional meetings today. Take detailed notes, as the strategies discussed will manifest quickly. Remain adaptable and heavily value the input of younger colleagues.",
  },
  {
    name: 'Sun Transits the 10th House',
    description: "This is your moment to shine professionally. Apply for that elevated role, ask for a promotion, or step into an advisory position. Accept recognition gracefully and use your high confidence to lead decisively.",
  },
  {
    name: 'Jupiter aspect Mars in 8th house',
    description: "Your capacity for deep, scientific analysis is at its peak. Reflect on the psychological patterns driving your current decisions. Ensure absolute fairness and transparency in all shared financial matters with your partner.",
  },
  {
    name: 'Moon Aspecting Midheaven (MC)',
    description: "You are highly sensitive to professional criticism today. Trust your intuition on projects, but do not let emotional reactions dictate your responses to management. Maintain a calm, objective exterior.",
  },
  {
    name: 'Mercury Transits the 11th House',
    description: "Network actively with progressive, forward-thinking groups. Listen closely to advice from an elder sibling or mentor. Maintain an optimistic outlook, as positive news regarding your future gains is on the way.",
  },
  {
    name: 'Moon Aspecting Ascendant (ASC)',
    description: "Honor your need for introspection today. Practice self-care and do not force yourself into highly visible or demanding situations. Monitor your moods closely to ensure they don't negatively impact your physical health.",
  },
  {
    name: 'Venus Transits the 9th House',
    description: "Embrace the freedom that comes from shifting your core beliefs. Allow female mentors to guide you toward a more adventurous life path. Release your grip on past traumas and look forward to the future with genuine hope.",
  },
  {
    name: 'Sun Transits the 11th House',
    description: "Leverage your connections with influential figures to advance your goals. Network heavily within your community, but remain discerning about the hidden motives of new acquaintances. Offer support to your mother or eldest sibling if needed.",
  },
  {
    name: 'Venus Transits the 10th House',
    description: "Inject creativity and superior design into your professional outputs. Utilize eye-catching aesthetics to promote your projects. Actively support and respect the women in your workplace, as they are key to your current success.",
  },
  {
    name: 'Jupiter Aspecting Midheaven (MC) : Ends',
    description: 'The period of rapid career expansion is cooling down. Take today to solidify your recent web architecture decisions. Review your resource optimization strategies and document your progress before moving to the next sprint.',
  },
  {
    name: 'Jupiter aspect Jupiter in 5th house : Exact',
    description: 'This is a peak intuitive day for financial analysis. Your technical reads on crypto or momentum stocks are highly favored right now. Take a moment to mentor a junior engineer, as your wisdom flows effortlessly today.',
  },
  {
    name: 'Jupiter aspect Mars in 8th house : Ends',
    description: 'The intense drive for deep, investigative research is winding down. Wrap up your complex technical debugging. Enjoy a warm, comforting broth tonight to ground yourself after days of intense mental focus.',
  },
  {
    name: 'Jupiter aspect Mars in 8th house : Exact',
    description: 'This is a powerful day for uncovering hidden volatility holes in your trading charts or solving deep backend architecture flaws. Burn off any excess, frustrated energy with a highly competitive game of badminton.',
  },
  {
    name: 'Jupiter aspect Mars in 8th house : Starts',
    description: 'You will begin to feel a surge of energy directed toward uncovering hidden truths. Start deep-diving into those complex Python or Swift issues you have been putting off. Trust your investigative instincts.',
  },
  {
    name: 'Jupiter aspect Moon in 6th house : Ends',
    description: 'As this expansive emotional phase wanes, focus on simple, grounding tasks like refactoring older React components or organizing your workspace. Keep your diet light and easy to digest today.',
  },
  {
    name: 'Jupiter aspect Moon in 6th house : Exact',
    description: 'Your emotional well-being is deeply tied to your daily routines today. It is an excellent evening to support your partner after a demanding nursing shift by preparing a comforting, home-cooked meal.',
  },
  {
    name: 'Jupiter aspect Moon in 6th house : Starts',
    description: 'A growing desire to improve your daily habits is emerging. Begin incorporating more mindful, brisk walks on your commute to work to align your physical health with your mental clarity.',
  },
  {
    name: 'Jupiter aspect Venus in 8th house : Ends',
    description: 'Discussions regarding shared resources and investments are coming to a close. Shift your focus away from financial planning and enjoy a quiet, private evening at home to recharge.',
  },
  {
    name: 'Jupiter aspect Venus in 8th house : Starts',
    description: 'Favorable energy is building for reviewing joint financial planning. It is a good time to calmly map out single-income household budgets or review your long-term wealth preservation strategies together.',
  },
  {
    name: 'Ketu aspect Mars in 8th house : Exact',
    description: 'You may experience a sudden urge to detach from intense, ongoing projects. Take a strict break from active trading today. Step entirely away from complex Micro Frontend puzzles if you feel your frustration rising.',
  },
  {
    name: 'Ketu aspect Sun in 9th house : Exact',
    description: 'You are highly likely to question your overarching beliefs today. It is an excellent time to rethink your software architecture philosophies or explore alternative spiritual concepts outside your usual Vedic studies.',
  },
  {
    name: 'Mars Aspecting Midheaven (MC) : Ends',
    description: 'Cool down your professional intensity. The heavy lifting of your recent career push is over. Walk home a different route today to actively decompress and leave work matters at the office.',
  },
  {
    name: 'Mars Aspecting Midheaven (MC) : Exact',
    description: 'Push forward aggressively on your web engineering milestones. Your leadership and technical authority are highly visible today. Tackle the most difficult tasks on your roster with absolute confidence.',
  },
  {
    name: 'Mars Aspecting Midheaven (MC) : Starts',
    description: 'Ambition is steadily building. Start organizing your strategy to tackle major replatforming projects. Channel this rising energy into drafting actionable, step-by-step technical plans.',
  },
  {
    name: 'Mars aspect Mars in 8th house : Exact',
    description: 'Highly intense, relentless energy dominates today. Burn off excess mental friction on the badminton court. Do not force trades in unpredictable markets, as impulsive actions will backfire.',
  },
  {
    name: 'Mars aspect Mars in 8th house : Starts',
    description: 'You will feel a sudden, sharp surge of energy to investigate stubborn bugs or uncover hidden data. Direct this laser focus purely into your work, avoiding unnecessary conflicts with peers.',
  },
  {
    name: 'Mars aspect Mercury in 8th house : Ends',
    description: 'Your mental engine needs a rest. Step away from the screens, close the trading charts, and rest your eyes. Prioritize silence and avoid overstimulating media this evening.',
  },
  {
    name: 'Mars aspect Mercury in 8th house : Exact',
    description: 'Your intellect is razor-sharp right now. It is a perfect transit for writing complex algorithms or deeply analyzing South Indian style charts. Watch your tone, as your words can be unintentionally cutting today.',
  },
  {
    name: 'Mars aspect Mercury in 8th house : Starts',
    description: 'Your mind is gearing up for serious technical analysis. Start gathering the data you need for your upcoming momentum trading reviews or complex coding sprints.',
  },
  {
    name: 'Mars aspect Moon in 6th house : Ends',
    description: 'The emotional heat and workplace irritations of the past few days are dissipating. Focus on resting and resetting your nervous system. Drink plenty of water and get to bed early.',
  },
  {
    name: 'Mars aspect Moon in 6th house : Exact',
    description: 'Workplace irritations may hit a peak today. Channel this frustrated energy directly into an aggressive workout or a fast-paced sport. Keep your diet very light to prevent stress-induced indigestion.',
  },
  {
    name: 'Mars aspect Moon in 6th house : Starts',
    description: 'Notice early signs of burnout or agitation with your daily routine. Drink soothing teas and take frequent, short breaks from your desk to maintain your emotional equilibrium.',
  },
  {
    name: 'Mars aspect Rahu in 9th house : Ends',
    description: 'The explosive urge to rebel against traditional knowledge or travel spontaneously is fading. Ground yourself back into your familiar daily routines and structured learning paths.',
  },
  {
    name: 'Mars aspect Rahu in 9th house : Exact',
    description: 'Avoid getting dragged into heated arguments over philosophical, technical, or astrological dogma. Channel this restless, boundary-pushing energy into a demanding solo physical activity.',
  },
  {
    name: 'Mars aspect Rahu in 9th house : Starts',
    description: 'A sudden urge to break out of your routine and explore foreign concepts is rising. Begin planning a future trip or exploring a completely new programming language to satisfy this itch.',
  },
  {
    name: 'Mars aspect Saturn in 10th house : Ends',
    description: 'The heavy feeling of restriction and management pushback is lifting. You can slowly begin to implement the technical changes you have been holding back on.',
  },
  {
    name: 'Mars aspect Saturn in 10th house : Exact',
    description: 'Patience is mandatory today. Bureaucracy may slow your projects down to a halt. Focus purely on resolving technical debt and code optimization rather than fighting to launch new features.',
  },
  {
    name: 'Mars aspect Saturn in 10th house : Starts',
    description: 'You may begin to feel a frustrating tension between your desire to move fast and the structural limitations of your workplace. Prepare to pace yourself and pick your battles wisely.',
  },
  {
    name: 'Mars aspect Sun in 9th house : Ends',
    description: 'Wind down your intense study sessions. Let the new astrological or technical frameworks you have been exploring integrate quietly into your mind without forcing further analysis.',
  },
  {
    name: 'Mars aspect Sun in 9th house : Exact',
    description: 'Your vitality and confidence are exceptionally high. It is an ideal day to boldly pitch your architectural designs to the new team or take decisive action on your long-term goals.',
  },
  {
    name: 'Mars aspect Sun in 9th house : Starts',
    description: 'Motivation to expand your higher knowledge is building. Start a new, challenging technical course or begin deeply analyzing upcoming planetary transits for the quarter.',
  },
  {
    name: 'Mars aspect Venus in 8th house : Ends',
    description: 'The emotional and passionate intensity of the last few days is cooling down. Return to a steady, calm baseline and focus on practical, routine tasks.',
  },
  {
    name: 'Mars aspect Venus in 8th house : Exact',
    description: 'Passion runs very high today. Plan a quiet but intensely connected evening with your partner. Forcefully resist any urge to make impulsive, high-risk stock buys under this energy.',
  },
  {
    name: 'Mars aspect Venus in 8th house : Starts',
    description: 'A drive to deepen intimacy or secretly research hidden financial assets is beginning. Keep your findings private for now and focus on nurturing trust in your closest relationships.',
  },
  {
    name: 'Mercury Aspecting Ascendant (ASC) : Exact',
    description: 'Your communication skills are unmatched today. It is a highly productive time to write thorough technical documentation, present your web app designs, or send out crucial emails.',
  },
  {
    name: 'Mercury aspect Jupiter in 5th house : Exact',
    description: 'Your logic and intuition are perfectly synchronized. This is the optimal timing to pull tarot spreads for strategic decision-making or to execute trades based on your momentum analysis.',
  },
  {
    name: 'Mercury aspect Jupiter in 5th house : Starts',
    description: 'Your mind is opening up to broader, more optimistic possibilities. Begin drafting plans that require a blend of creative vision and strict technical execution.',
  },
  {
    name: 'Mercury aspect Ketu in 3rd house : Ends',
    description: 'The mental fog and frustrating miscommunications of the past few days are finally clearing. You can safely resume important negotiations and sign off on technical specs.',
  },
  {
    name: 'Mercury aspect Ketu in 3rd house : Starts',
    description: 'Miscommunications and technical glitches are highly likely to arise. Double-check all code commits and read emails twice before hitting send. Practice active, patient listening.',
  },
  {
    name: 'Mercury aspect Moon in 6th house : Exact',
    description: 'You possess great emotional clarity regarding your work today. It is an excellent time to optimize your daily routine. Eat a comforting, warm broth tonight to soothe your active nervous system.',
  },
  {
    name: 'Mercury aspect Moon in 6th house : Starts',
    description: 'A desire to organize your daily life and improve your health routines is emerging. Start planning out your week meticulously to alleviate any background anxiety.',
  },
  {
    name: 'Mercury aspect Rahu in 9th house : Ends',
    description: 'Your mind is returning to standard, practical protocols. Implement the out-of-the-box ideas you recently generated into stable, workable solutions.',
  },
  {
    name: 'Mercury aspect Rahu in 9th house : Starts',
    description: 'Embrace highly unconventional, out-of-the-box thinking. Explore new frameworks, bleeding-edge tech, or alternative philosophical views that challenge your current paradigms.',
  },
  {
    name: 'Mercury aspect Saturn in 10th house : Starts',
    description: 'Your communication style is becoming more serious and structured. Use this sobering energy to sit down and draft realistic, long-term career transition plans.',
  },
  {
    name: 'Mercury aspect Sun in 9th house : Ends',
    description: 'The period of gathering high-level advice is closing. Take the wisdom you received from mentors and begin actively implementing it into your own life.',
  },
  {
    name: 'Mercury aspect Sun in 9th house : Starts',
    description: 'Your mind is seeking profound wisdom. Reach out to established mentors, father figures, or senior engineers to gain perspective on a complex problem you are facing.',
  },
  {
    name: 'Moon Aspecting Ascendant (ASC) : Exact',
    description: 'You are highly sensitive to your environment today. Prioritize gentle self-care, walk to work to clear your head, and wear comfortable clothing. Avoid harsh lighting and loud crowds.',
  },
  {
    name: 'Moon Aspecting Midheaven (MC) : Exact',
    description: 'Your professional intuition is heightened, but so is your sensitivity to feedback. Trust your gut on new project dynamics, but keep your outward reactions strictly neutral and professional.',
  },
  {
    name: 'Pluto conjunct Saturn : Ends',
    description: 'A major cycle of heavy discipline and restriction is concluding. Take time to reflect on the immense structural resilience and technical mastery you have built over this period.',
  },
  {
    name: 'Pluto conjunct Saturn : Starts',
    description: 'A period of deep, slow transformation in your professional responsibilities is beginning. Focus on absolute resource efficiency and building systems that can withstand extreme pressure.',
  },
  {
    name: 'Rahu aspect Moon in 6th house : Exact',
    description: 'High mental anxiety regarding your health or daily workload may surface. Stick to familiar, easily digestible foods today. Completely ignore office gossip to protect your peace of mind.',
  },
  {
    name: 'Saturn aspect Rahu in 9th house : Ends',
    description: 'The inner conflict between traditional rules and your desire for freedom is settling. A new, highly pragmatic worldview is taking root. Move forward with this stabilized perspective.',
  },
  {
    name: 'Saturn aspect Rahu in 9th house : Exact',
    description: 'It is time to permanently discard outdated philosophies. Find a practical, grounded approach to your astrological studies and software architecture rather than chasing illusions.',
  },
  {
    name: 'Saturn aspect Rahu in 9th house : Starts',
    description: 'You will begin to feel tension between tradition and rebellion in your core beliefs. Prepare to rigorously question the rules you have been blindly following up to this point.',
  },
  {
    name: 'Saturn aspect Sun in 9th house : Ends',
    description: 'The oppressive feeling of being restricted by authority figures or rigid rules is lifting. You can step back into your natural confidence and optimism today.',
  },
  {
    name: 'Saturn aspect Sun in 9th house : Exact',
    description: 'Focus entirely on building self-reliance. Rely on your own hard work and discipline rather than luck. Prioritize long-term wealth preservation and system stability over quick trades or hacks.',
  },
  {
    name: 'Saturn aspect Sun in 9th house : Starts',
    description: 'Authority figures or management may begin to feel overly restrictive. Keep your head down, follow protocol carefully, and avoid openly challenging those in charge right now.',
  },
  {
    name: 'Sun aspect Jupiter in 5th house : Ends',
    description: 'The wave of high optimism and speculative luck is receding. Lock in your recent gains, document your successful ideas, and return to a steady, baseline routine.',
  },
  {
    name: 'Sun aspect Jupiter in 5th house : Starts',
    description: 'Optimism and creative energy are steadily building. This is an excellent time to begin speculative financial analysis or brainstorm innovative solutions for your side projects.',
  },
  {
    name: 'Sun aspect Ketu in 3rd house : Ends',
    description: 'Any brief dips in your confidence or communication blockages are clearing up. Your natural self-assurance and clarity of thought are returning in full force.',
  },
  {
    name: 'Sun aspect Ketu in 3rd house : Starts',
    description: 'Your confidence might take a brief, unexpected hit today. Keep your head down, avoid pitching new ideas to the team, and focus on quietly completing routine tasks.',
  },
  {
    name: 'Sun aspect Mars in 8th house : Starts',
    description: 'Aggressive, focused research energy is building. Channel this rising intensity directly into your most difficult web engineering tasks or deep market analysis before it turns into frustration.',
  },
  {
    name: 'Sun aspect Mercury in 8th house : Ends',
    description: 'Wrap up your deep investigations and technical audits. The phase of intense psychological and analytical curiosity is closing; organize your findings and rest your mind.',
  },
  {
    name: 'Sun aspect Mercury in 8th house : Starts',
    description: 'A profound psychological or technical curiosity is awakening. Start gathering data and asking the hard questions required to get to the root of complex, hidden issues.',
  },
  {
    name: 'Sun aspect Moon in 6th house : Ends',
    description: 'Your new daily routines and health habits have been successfully established. Maintain the momentum of your morning walks and clean eating as this transit fades.',
  },
  {
    name: 'Sun aspect Moon in 6th house : Starts',
    description: 'Focus your vital energy on improving your daily health routines. Commit to walking to work or preparing your own meals to build physical resilience for the week ahead.',
  },
  {
    name: 'Sun aspect Rahu in 9th house : Ends',
    description: 'The intense urge to travel or radically change your life path is subsiding. Ground yourself back in daily reality and apply what you learned to your current situation.',
  },
  {
    name: 'Sun aspect Rahu in 9th house : Starts',
    description: 'You will feel a strong pull to break away from traditional learning and explore exotic or taboo subjects. Let your mind wander into these unconventional territories today.',
  },
  {
    name: 'Sun aspect Saturn in 10th house : Starts',
    description: 'Prepare yourself for a heavy, demanding workload. Pace your energy, focus strictly on scalable, long-term solutions, and maintain a highly professional demeanor with management.',
  },
  {
    name: 'Sun aspect Sun in 9th house : Exact',
    description: 'Your vitality, identity, and life purpose are perfectly aligned today. It is an excellent day for pursuing higher learning, exploring deep tarot spreads, or acting as a mentor to others.',
  },
  {
    name: 'Sun aspect Venus in 8th house : Ends',
    description: 'Discussions around shared finances and deep emotional bonding are concluding. Move forward with the mutual decisions you have made and enjoy the renewed sense of trust.',
  },
  {
    name: 'Sun aspect Venus in 8th house : Starts',
    description: 'It is time to shine a light on shared resources and hidden values. Begin reviewing financial plans and single-income strategies with your partner in a spirit of total transparency.',
  },
  {
    name: 'Uranus aspect Saturn in 10th house : Exact',
    description: 'Expect sudden, unexpected changes in your career structure or management hierarchy. Stay entirely adaptable in your software architecture approach to accommodate these rapid shifts.',
  },
  {
    name: 'Venus Aspecting Ascendant (ASC) : Exact',
    description: 'Your personal charm and magnetism are at their peak today. It is a fantastic day to lead team meetings, network, or enjoy a beautifully prepared dinner with your partner.',
  },
  {
    name: 'Venus aspect Ketu in 3rd house : Starts',
    description: 'Past hobbies or old acquaintances might suddenly resurface in your daily life. Keep these interactions pleasant but light, and avoid getting pulled back into old, draining habits.',
  },
  {
    name: 'Venus aspect Moon in 6th house : Ends',
    description: 'The strong desire to beautify your workspace and harmonize your daily routines is passing. Return to a focus on pure practicality and efficient execution of your tasks.',
  },
  {
    name: 'Venus aspect Moon in 6th house : Exact',
    description: 'Take time to beautify your immediate environment today. Treat yourself and your partner to a high-quality, comforting meal after a long day to soothe your emotional bodies.',
  },
  {
    name: 'Venus aspect Moon in 6th house : Starts',
    description: 'A deep desire for peace and harmony in your daily work environment is beginning to grow. Start clearing physical clutter from your desk to invite in better energetic flow.',
  },
  {
    name: 'Venus aspect Rahu in 9th house : Starts',
    description: 'You will begin to feel a strong urge for luxurious travel or diving into exotic, foreign studies. Allow yourself to dream big and look into planning an unconventional getaway.',
  },
  {
    name: 'Venus aspect Saturn in 10th house : Ends',
    description: 'The strict boundaries and cool dynamics in your professional relationships are easing up. You can expect warmer, more collaborative interactions with management moving forward.',
  },
  {
    name: 'Venus aspect Saturn in 10th house : Starts',
    description: 'Your professional relationships will require strict discipline and firm boundaries. Keep all workplace interactions formal, polite, and focused entirely on the tasks at hand.',
  },
  {
    name: 'Venus aspect Sun in 9th house : Ends',
    description: 'The phase of joyful vacation planning and expansive philosophical discussions is closing. Take the inspiration you gathered and apply it to your everyday reality.',
  },
  {
    name: 'Venus aspect Sun in 9th house : Starts',
    description: 'Enjoy a lighter, more expansive mood. It is a great time to engage in deep philosophical discussions or start browsing destinations for a future, culturally enriching trip.',
  },
  {
    name: 'Venus ruler of the 7th House in the 8th House',
    description: 'This is a critical period for re-evaluating trust and shared assets. Focus on highly transparent financial planning, especially when discussing adjustments for potential single-income transitions. Radical honesty will strengthen the bond.',
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