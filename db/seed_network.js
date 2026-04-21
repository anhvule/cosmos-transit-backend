const db = require('./network');

const events = [
  {
    name: 'Moon Transits the 8th House',
    description: "Deep emotional undercurrents define your social sphere today. Beware of toxic gossip or hidden jealousy from those you consider close. Friendships may be tested through secret reveals, but the ones that survive will offer profound, soul-level support.",
  },
  {
    name: 'Moon aspect Venus in 8th house',
    description: 'A powerful karmic pull may draw you toward a soulmate or an intensely close friend from the past. Deep emotional support is shared in private settings, but boundaries between platonic friendship and intense romance may blur.',
  },
  {
    name: 'Venus ruler of the 2nd House in the 8th House',
    description: "Financial entanglements with friends or shared resources at gatherings could cause hidden friction. Deep-seated jealousies over possessions or social status might surface, though true soulmates will offer material and emotional support when you need it most.",
  },
  {
    name: 'Venus ruler of the 7th House in the 8th house',
    description: 'Trust issues may plague your closest partnerships. A friend might act secretively or indulge in harmful gossip, leading to feelings of betrayal. It is a time to re-evaluate who truly has your back in your inner circle.',
  },
  {
    name: 'Moon aspect Mercury in 8th house',
    description: 'Expect deep, probing conversations with a close confidant. You might uncover hidden social dynamics or engage in intense, transformative gossip. Support comes from friends who are willing to listen to your darkest thoughts without judgment.',
  },
  {
    name: 'Mercury ruler of the 3rd House in the 8th House',
    description: 'Miscommunications can trigger sudden endings in superficial friendships. Jealousy among peers or siblings may peak. However, this transit favors connecting with a soulmate over deep, psychological, or esoteric subjects in a quiet, private setting.',
  },
  {
    name: 'Mercury ruler of the 6th House in the 8th House',
    description: 'Workplace gossip can turn toxic, revealing hidden enemies or jealous colleagues. Avoid oversharing at office gatherings. Social support comes from those who help you navigate crises or health matters behind the scenes.',
  },
  {
    name: 'Moon aspect Mars in 8th house',
    description: 'Intense social friction and sudden arguments may arise from simmering jealousies. A friend’s passive-aggressiveness could manifest openly. Channel this fiery energy into fiercely protecting your true soulmates rather than fighting with acquaintances.',
  },
  {
    name: 'Mars ruler of the 1st House in the 8th House',
    description: 'You may feel socially isolated or hyper-defensive at parties. Dominance struggles within your friend group can lead to power clashes. Seek the quiet support of a singular, trusted friend rather than trying to win over a crowd.',
  },
  {
    name: 'Mars ruler of the 8th House in the 8th House',
    description: 'You possess a piercing intuition regarding people’s true motives; you can easily spot jealousy or fake friends at any gathering. This is a powerful time for forging an unbreakable, protective bond with a soulmate who shares your intensity.',
  },
  {
    name: 'Moon Transits the 9th House',
    description: 'Your social circle expands to include people from diverse backgrounds or philosophical mindsets. Gathering with friends to discuss higher truths brings joy. You may find a soulmate connection through a spiritual group or while traveling.',
  },
  {
    name: 'Moon aspect Sun in 9th house',
    description: 'Friends act as vital mentors today, offering uplifting advice and loyal support. Attending a joyful gathering or cultural event will elevate your spirit and connect you with warm, generous companions.',
  },
  {
    name: 'Sun ruler of the 5th House in the 9th House',
    description: 'You are the light of the party, attracting joyful and wise friends. Romantic soulmate connections can easily blossom from existing friendships. Your social network supports your creative and spiritual endeavors flawlessly.',
  },
  {
    name: 'Moon aspect Rahu in 9th house',
    description: 'You may be drawn to eccentric or unconventional friends who challenge the status quo. Be cautious of falling in with a crowd that thrives on fanatical gossip or extreme party lifestyles that distance you from your true path.',
  },
  {
    name: 'Moon aspect Ketu in 3rd house',
    description: 'You may feel a sense of detachment from your usual neighborhood chatter or casual friend group. Meaningless gossip drains you. Seek out a past-life soulmate who understands your need for silent, unspoken support.',
  },
  {
    name: 'Moon Transits the 10th House',
    description: "Your public reputation is under the spotlight; workplace friendships may shift suddenly. Avoid participating in office gossip, as it could backfire. Support comes from older, established mentors rather than casual party-goers.",
  },
  {
    name: 'Sun Transits the 12th House',
    description: "You require a break from the party scene. Secret jealousies or hidden enemies within your social circle may drain your energy. True support is found in solitude or in the company of a deeply spiritual soulmate hidden from the public eye.",
  },
  {
    name: 'Moon aspect Saturn in 10th house',
    description: 'A heavy, formal energy surrounds your social interactions today. Networking events feel like a chore rather than a party. Rely on your oldest, most reliable friends for grounded, practical support.',
  },
  {
    name: 'Saturn ruler of the 10th House in the 10th House',
    description: 'You attract high-status, powerful friends who can elevate your career. Gatherings are more about strategic networking than casual fun. Guard against jealousy from peers who envy your steady rise to the top.',
  },
  {
    name: 'Saturn ruler of the 11th House in the 10th House',
    description: 'Your long-term friendships are deeply intertwined with your professional life. A mentor-like friend offers structural support that helps you achieve your dreams. You value loyalty and substance over superficial party dynamics.',
  },
  {
    name: 'Moon Transits the 11th House',
    description: "Your social life buzzes with invitations and group gatherings. While it's a great time for networking, beware of fair-weather friends who drain your resources. Focus on your truest allies and ignore petty community gossip.",
  },
  {
    name: 'Moon aspect Jupiter in 5th house',
    description: 'Joyful gatherings and celebratory parties are highly favored! Your generosity attracts wonderful, supportive friends. A platonic friendship may blissfully evolve into a soulmate connection filled with mutual respect and laughter.',
  },
  {
    name: 'Jupiter ruler of the 9th House in the 5th House',
    description: 'You naturally act as a wise counselor to your friends. Gatherings centered around shared wisdom or creative pursuits bring immense joy. Your soulmate is likely someone who shares your deepest philosophical views and loves to celebrate life.',
  },
  {
    name: 'Jupiter ruler of the 12th House in the 5th House',
    description: 'You may harbor secret affections for a friend, or connect with a soulmate in a deeply spiritual, almost hidden way. Avoid friends who pull you into escapist partying; seek those who support your inner creative sanctuary.',
  },
  {
    name: 'Moon Transits the 12th House',
    description: 'Nostalgia for old friendships may overwhelm you. It is a time for quiet, intimate gatherings rather than loud parties. Watch out for secret enemies or hidden jealousies. A compassionate soulmate offers a safe harbor for your vulnerabilities.',
  },
  {
    name: 'Mars aspect Jupiter in 5th house',
    description: 'You are the dynamic instigator of fun, leading your friends to concerts, sports, or lively parties. Your enthusiasm is contagious, making you a magnet for new connections. A passionate, adventurous soulmate may enter your social sphere.',
  },
  {
    name: 'Sun in 9th (Dispositor)',
    description: 'Your integrity shines in your friend group. You are known as the honest, loyal companion who cuts through petty gossip. A trip with friends will deepen your bonds and bring supportive, enlightening experiences.',
  },
  {
    name: 'Moon aspect Moon in 6th house',
    description: "Friends may come to you with their daily crises, seeking your empathetic support. While gathering to help a friend in need is noble, guard against absorbing their anxieties or getting dragged into workplace gossip.",
  },
  {
    name: 'Moon ruler of the 4th House in the 6th House',
    description: 'Your closest friends feel like family, but there may be underlying jealousies or emotional debts that need clearing. Intimate gatherings at home might be interrupted by petty bickering or the need to care for a distressed loved one.',
  },
  {
    name: 'Moon Transits the 1st House',
    description: 'Your personal magnetism is high, drawing friends and potential soulmates to your side. You set the emotional tone for any gathering today. Lean into your intuition to sense who genuinely supports you and who is harboring envy.',
  },
  {
    name: 'Moon Transits the 2nd House',
    description: 'Gathering around a beautiful meal strengthens your closest friendships. You value loyalty and tangible support from your circle. However, possessiveness or jealousy over a best friend’s attention could temporarily disrupt the harmony.',
  },
  {
    name: 'Venus aspect Moon in 6th house',
    description: 'You enjoy pampering yourself alongside your closest friends—think spa days or wellness gatherings. Friendly support comes through acts of service. Beware of sweet-faced acquaintances who spread subtle gossip in your daily routines.',
  },
  {
    name: 'Mercury in 8th (Dispositor)',
    description: 'Your conversations with friends plunge into deep, psychological territory. You easily detect lies, making it impossible for gossip or fake friends to survive your scrutiny. A soulmate connection deepens through shared secrets.',
  },
  {
    name: 'Moon Transits the 3rd House',
    description: "Your social calendar is full of short trips, coffee dates, and lively chatter. Gossip flies fast today—be a listener, not a spreader. Spontaneous gatherings with siblings or lifelong friends provide a refreshing sense of supportive camaraderie.",
  },
  {
    name: 'Venus Transits the 1st House',
    description: 'You are radiating charm and attractiveness, making you the center of attention at any party. New friends flock to you, and romantic interest from your social circle peaks. Enjoy the support and adoration, but remain discerning about true soulmate qualities.',
  },
  {
    name: 'Moon Transits the 4th House',
    description: 'You prefer cozy, intimate gatherings at home with your innermost circle over wild parties. Reminiscing with old friends brings deep emotional support. A soulmate connection feels deeply familiar, safe, and nurturing.',
  },
  {
    name: 'Mars aspect Moon in 6th house',
    description: 'Irritations within your friend group may boil over into petty arguments. Jealousy or competitive behavior from a peer could disrupt your peace. Protect your energy and avoid gatherings where toxic gossip is the main event.',
  },
  {
    name: 'Uranus conjunct Venus',
    description: 'A sudden, electrifying encounter at a gathering could introduce you to a wild, unconventional soulmate. Existing friendships may experience sudden shifts. Expect the unexpected at parties—new, exciting connections are favored over stale routines.',
  },
  {
    name: 'Mars in 8th (Dispositor)',
    description: 'You are fiercely protective of your trusted inner circle. Superficial parties bore you; you crave intense, transformative bonds. You will actively confront any gossip or jealousy directed at your soulmate or best friends.',
  },
  {
    name: 'Moon Transits the 5th House',
    description: 'Your playful energy makes you the life of the party! Gatherings are filled with laughter, creativity, and flirtation. A casual friendship could easily spark into a joyful soulmate romance. Your friends enthusiastically support your self-expression.',
  },
  {
    name: 'Mars Transits the 12th House',
    description: 'Hidden jealousies and secret enemies are active; be very careful who you trust with your secrets. Avoid large parties where gossip can be weaponized behind your back. Seek the quiet, steadfast support of a single, proven soulmate.',
  },
  {
    name: 'Mercury aspect Jupiter in 5th house',
    description: 'Lively, intellectual gatherings bring you immense joy. You and your friends inspire each other with brilliant ideas and optimistic support. A soulmate connection may begin through shared hobbies, witty banter, or a creative community.',
  },
  {
    name: 'Sun aspect Moon in 6th house',
    description: 'A friend’s honest, constructive feedback helps you improve your daily habits. Social support is practical and grounded. Avoid nitpicking your friends, and steer clear of circles that thrive on complaining or jealous comparisons.',
  },
  {
    name: 'Sun Transits the 1st House',
    description: 'Your confidence is radiant, naturally elevating your status in your friend group. You take the lead in organizing gatherings and inspiring your peers. Your bold authenticity attracts a soulmate who admires your strength and offers unwavering support.',
  },
  {
    name: 'Mercury Transits the 12th House',
    description: 'You may reconnect with an old friend from the past through a sudden message. Gossip should be strictly avoided, as misunderstandings thrive in the shadows. A telepathic, unspoken support system develops with a spiritual soulmate.',
  },
  {
    name: 'Ketu aspect Sun in the 9th house',
    description: 'You may feel a sudden disconnect from your usual social groups or belief systems. Superficial party friends fall away, leaving only those karmically bound to you. Support comes from stepping back from the crowd to find your own truth.',
  },
  {
    name: 'Venus Aspecting Ascendant (ASC)',
    description: "Your charm is irresistible, making you highly sought after for parties and gatherings. It is a beautiful time for cultivating friendships and attracting a sweet, loving soulmate who supports your desire for harmony and joy.",
  },
  {
    name: 'Jupiter in 5th (Dispositor)',
    description: 'Your social circle expands with vibrant, creative, and generous people. You are a source of great advice and joy to your friends. Karmic blessings bring a soulmate who shares your playful spirit and supports your happiness.',
  },
  {
    name: 'Moon Transits the 6th House',
    description: 'Friends may lean heavily on you for practical help, or you may need their support to navigate a stressful day. Beware of critical, jealous acquaintances in your daily routine. Avoid gatherings; focus on serving your true inner circle.',
  },
  {
    name: 'Moon Transits the 7th House',
    description: 'Your focus shifts entirely to your best friend or soulmate. While emotional support in one-on-one settings is strong, fluctuations in your partner’s mood may cause worry. Keep gossip out of your closest relationships to maintain trust.',
  },
  {
    name: 'Saturn aspect Sun in 9th house',
    description: 'Older or more mature friends offer sobering, structured support. You may outgrow a superficial friend group that no longer aligns with your evolving morals. Quality over quantity is your mantra for gatherings and social connections.',
  },
  {
    name: 'Venus Transits the 2nd House',
    description: 'You delight in hosting luxurious gatherings and treating your friends to the finer things. Shared values solidify your soulmate bond. Be mindful of possessiveness or jealousy over a friend’s time, and express your affection through sweet, supportive words.',
  },
  {
    name: 'Venus aspect Venus in 8th house',
    description: 'A magnetic, almost hypnotic attraction pulls you toward a deep soulmate connection. Casual parties hold no interest; you crave intense, private encounters. Be cautious of intense jealousy or obsessive behavior, but enjoy the profound emotional support.',
  },
  {
    name: 'Sun Aspecting Ascendant (ASC)',
    description: "You shine brightly in any social setting, naturally commanding respect and admiration from your peers. Your friends look to you for leadership and support. A soulmate is drawn to your vitality and clear sense of self.",
  },
  {
    name: 'Mercury Aspecting Ascendant (ASC)',
    description: "You are the ultimate conversationalist at any gathering today. Networking and mingling come easily. Your friends appreciate your witty advice and mental support. Keep the chatter positive to avoid accidentally stirring up gossip.",
  },
  {
    name: 'Venus aspect Mercury in 8th house',
    description: 'Heartfelt, secretive conversations deepen your bond with a best friend or soulmate. You may dissect social dynamics or share juicy, exclusive gossip in a safe space. Emotional support is communicated clearly and intimately.',
  },
  {
    name: 'Venus aspect Mars in 8th house',
    description: 'Passions run incredibly high; a platonic friendship could suddenly turn fiercely romantic. While your charisma is powerful at parties, be warned that intense jealousy and possessiveness can quickly complicate your closest bonds.',
  },
  {
    name: 'Mars aspect Venus in 8th house',
    description: 'You project a magnetic, seductive energy that draws intense admirers. Friendships may become complicated by hidden desires or rivalries. Protect your soulmate connection from external jealousy, and avoid parties where drama is likely to erupt.',
  },
  {
    name: 'Venus Transits the 3rd House',
    description: 'Friendly banter, local gatherings, and neighborhood parties bring immense joy. You express your support through sweet messages and kind words. A sibling-like friendship may introduce you to a new, exciting social circle or romantic interest.',
  },
  {
    name: 'Mercury Transits the 2nd House',
    description: 'Conversations with friends center around shared values, finances, or planning group events. You offer practical, grounded support to your inner circle. Keep communication honest to prevent any jealousy regarding money or resources among friends.',
  },
  {
    name: 'Sun Transits the 2nd House',
    description: 'You take pride in providing for your friends, perhaps hosting a lavish gathering. However, differences in financial status could breed subtle jealousy within your circle. Focus on soulmates who value your character over your resources.',
  },
  {
    name: 'Mercury Transits the 1st House',
    description: 'You are highly communicative, eager to connect, and the life of the intellectual party. Friends seek you out for your engaging stories and bright ideas. A youthful, energetic soulmate may be drawn to your expressive and supportive nature.',
  },
  {
    name: 'Mars Transits the 1st House',
    description: 'Your bold, assertive energy can either make you the dynamic leader of your friend group or cause friction and arguments. Jealousy from others may arise as you fiercely pursue your goals. Cultivate patience with your soulmate to avoid unnecessary clashes.',
  },
  {
    name: 'Mars aspect Ketu in 3rd house',
    description: 'Old, unresolved conflicts with a friend or sibling may unexpectedly flare up. Gossip can be sharp and cutting. Avoid argumentative gatherings; instead, rely on the quiet, unspoken support of a karmic soulmate who understands your frustrations.',
  },
  {
    name: 'Mercury aspect Venus in 8th house',
    description: 'You are compelled to express your deepest, most hidden feelings to your soulmate. Secretive gatherings or private getaways are highly favored. You provide profound psychological support to a friend navigating a complex emotional issue.',
  },
  {
    name: 'Sun aspect Venus in 8th house',
    description: "Intense, karmic ties with a soulmate dominate your focus. Jealousy and codependency can threaten the harmony of your friendships. Release past social grievances and let go of friends who drain you, allowing supportive, transformative relationships to thrive.",
  },
  {
    name: 'Mercury aspect Mercury in 8th house',
    description: 'You and a close friend may dive deep into researching a shared interest, ignoring the outside world. Gossip takes on an investigative tone. Trust your intuition to see through any superficial social masks presented at gatherings.',
  },
  {
    name: 'Venus aspect Sun in 9th house',
    description: 'Traveling with friends brings incredible joy and expansive new connections. You may meet a soulmate through an educational or cultural gathering. Your friends support your highest ideals, and jealousy is replaced by mutual admiration.',
  },
  {
    name: 'Mars Aspecting Ascendant (ASC)',
    description: "Your assertive energy makes you a fierce protector of your friends, but it can also make you easily provoked at parties. Channel your passion into enthusiastically supporting your soulmate, and walk away from petty social competitions.",
  },
  {
    name: 'Venus aspect Rahu in 9th house',
    description: 'You are drawn to exotic, glamorous gatherings and may form fast friendships with people from very different backgrounds. An unconventional soulmate could enter your life. Enjoy the lavish support of your network, but stay grounded in your values.',
  },
  {
    name: 'Venus aspect Ketu in 3rd house',
    description: 'You may randomly bump into an old friend or a past-life soulmate, instantly rekindling a deep bond. Large parties feel overwhelming; you prefer spontaneous, small gatherings. Support comes from those who understand your eccentricities without needing explanation.',
  },
  {
    name: 'Mercury aspect Mars in 8th house',
    description: "Your mind is sharp, easily cutting through fake friendships and toxic gossip. You provide fiercely honest support to your closest allies. Avoid getting into verbal sparring matches at gatherings; use your insight to protect your soulmate instead.",
  },
  {
    name: 'Mercury Transits the 3rd House',
    description: 'Your phone is blowing up with messages, invitations, and harmless gossip. It is a fantastic time for local gatherings, short road trips with friends, and lively debates. You are the connective tissue offering communicative support to your entire circle.',
  },
  {
    name: 'Mars aspect Mercury in 8th house',
    description: "You possess a piercing ability to uncover secrets within your social network. While you can offer profound, psychological support to a friend in crisis, be careful not to use your investigative skills to spread damaging gossip or stir up jealousy.",
  },
  {
    name: 'Jupiter Transits the 4th House',
    description: 'Hosting friends in your home brings immense joy and a deep sense of belonging. Your home becomes the favored gathering place for your inner circle. A soulmate connection provides you with expansive, nurturing support and unshakeable emotional security.',
  },
  {
    name: 'Jupiter aspect Venus in 8th house',
    description: 'A wealthy or highly generous friend may offer you significant material or emotional support. Deep, soulful connections expand your worldview. Jealousy is easily healed through open-hearted forgiveness, making room for a truly transformative soulmate bond.',
  },
  {
    name: 'Sun aspect Mercury in 8th house',
    description: 'You step away from superficial parties to engage in deep, psychoanalytical discussions with your most trusted confidant. You are uncovering the root causes of past friendship betrayals, allowing you to build healthier, more supportive soulmate connections.',
  },
  {
    name: 'Mercury aspect Sun in 9th house',
    description: 'Uplifting conversations with philosophical friends boost your spirits. Gatherings focused on learning or spiritual growth are highly favored. You and your soulmate provide mutual support through encouraging words and a shared vision for the future.',
  },
  {
    name: 'Mercury aspect Ketu in 3rd house',
    description: 'Miscommunications can plague your social plans, leading to missed gatherings or misunderstood texts. Gossip may be completely misinterpreted. Rely on the silent, intuitive support of a karmic soulmate rather than trying to explain yourself to the crowd.',
  },
  {
    name: 'Mercury aspect Rahu in 9th house',
    description: 'Conversations with foreign or highly unconventional friends expand your mind. You may be invited to unusual, out-of-the-box gatherings. Support comes from a soulmate who challenges your traditional ways of thinking and encourages radical honesty.',
  },
  {
    name: 'Venus Transits the 4th House',
    description: 'You seek harmony and beauty in your closest, home-based friendships. Hosting a beautifully curated gathering for your inner circle brings deep satisfaction. Your soulmate provides a comforting, peaceful sanctuary away from the jealousy of the outside world.',
  },
  {
    name: 'Sun aspect Mars in 8th house',
    description: 'A perceived slight at a gathering could trigger deep-seated anger or memories of past social humiliations. Hidden jealousies among friends may suddenly ignite. Lean on a trusted soulmate to help you process these intense emotions rather than lashing out.',
  },
  {
    name: 'Venus Aspecting Midheaven (MC)',
    description: 'Your social grace makes you incredibly popular in professional circles. Office parties and networking events are highly successful. You attract supportive friends who elevate your public standing, but be mindful of subtle jealousy from less successful peers.',
  },
  {
    name: 'Saturn in 10th (Dispositor)',
    description: 'You may feel burdened by social obligations or the expectations of your friend group. Party invitations feel like a duty rather than fun. Seek the support of a mature, grounded soulmate who understands your need to pull back and focus on your goals.',
  },
  {
    name: 'Jupiter Aspecting Midheaven (MC)',
    description: 'Your reputation in your social circle is sterling; you are viewed as a generous, supportive leader. Influential friends actively champion your success. Gatherings centered around big goals or community expansion bring you closer to a visionary soulmate.',
  },
  {
    name: 'Sun Transits the 3rd House',
    description: 'You take the lead in organizing neighborhood gatherings or trips with close friends. Your communication is bold and authoritative, shutting down petty gossip quickly. You offer strong, direct support to siblings and your most loyal companions.',
  },
  {
    name: 'Mars aspect Mars in 8th house',
    description: 'You fiercely pursue deep, authentic connections and have zero tolerance for fake friends. Any hidden jealousy or betrayal in your circle will be confronted head-on. You and your soulmate share an intense, protective bond that can weather any storm.',
  },
  {
    name: 'Venus aspect Saturn in 10th house',
    description: 'You value loyalty and longevity in friendships over fleeting party connections. A mentor-like friend offers serious, practical support. While romance with a soulmate may develop slowly, it is built on an unshakeable foundation of mutual respect.',
  },
  {
    name: 'Sun Transits the 12th House',
    description: 'You need a retreat from the social scene. Large gatherings drain your vitality, and secret jealousies may be operating behind the scenes. True support is found in quiet isolation or in the comforting presence of a deeply empathetic, spiritual soulmate.',
  },
  {
    name: 'Mercury aspects the Moon in the 6th house',
    description: 'You are the practical problem-solver for your friends today. Your support is hands-on and deeply appreciated. Avoid getting sucked into petty workplace gossip; instead, use your communication skills to bring harmony to your daily social routines.',
  },
  {
    name: 'Sun Transits the 2nd House',
    description: 'Your focus is on the value and loyalty of your innermost circle. Financial disparities between friends might trigger subtle jealousy. You show support through generosity, but ensure your soulmate values you for your heart, not just your resources.',
  },
  {
    name: 'Sun Transits the 3rd House',
    description: 'You shine in local social settings, easily gathering friends and neighbors for spontaneous fun. Your confident communication wards off gossip. You are a pillar of energetic support for your close friends, driving group plans forward with enthusiasm.',
  },
  {
    name: 'Mars Transits the 2nd House',
    description: 'You may be quick to aggressively defend your values or your closest friends. Be careful that your blunt communication doesn’t alienate your soulmate. Avoid arguments over shared expenses at gatherings, as possessiveness can quickly turn into destructive jealousy.',
  },
  {
    name: 'Mercury Transits the 4th House',
    description: 'Your home becomes a hub for lively discussions and intimate gatherings. You reconnect with childhood friends, sharing memories and emotional support. A soulmate bond is strengthened through open, heartfelt communication in a safe, private environment.',
  },
  {
    name: 'Pluto conjunct Saturn',
    description: 'A major restructuring of your friend group is occurring; superficial ties are severed, leaving only those who can handle extreme loyalty. You and a soulmate may face a heavy burden together, forging an unbreakable bond through shared hardship and intense support.',
  },
  {
    name: 'Sun aspects Sun in 9th house',
    description: 'You connect with friends who share your highest ideals and spiritual beliefs. Gatherings are expansive, optimistic, and uplifting. A soulmate provides radiant support, encouraging you to step into your authentic power and ignore the judgments of lesser minds.',
  },
  {
    name: 'Sun aspect Ketu in the 3rd house',
    description: 'You may feel eclipsed or ignored in your usual social circles, leading to a desire to withdraw from casual gossip. Friends may seem unsupportive or self-involved. Seek solace with a past-life soulmate who requires no explanation for your quiet mood.',
  },
  {
    name: 'Sun aspect Rahu in 9th house',
    description: 'You are drawn to powerful, unconventional friends who challenge your worldview. Beware of charismatic individuals who use gatherings to inflate their own egos. A soulmate connection may suddenly appear, offering exciting but unpredictable support.',
  },
  {
    name: 'Venus Transits the 5th House',
    description: 'This is the ultimate transit for parties, romance, and joy! You attract beautiful, creative friends and are the center of adoration. A platonic friendship easily blossoms into a passionate soulmate connection. Generous, loving support flows freely in your circle.',
  },
  {
    name: 'Mars aspect Sun in 9th house',
    description: 'You enthusiastically champion your friends\' goals, offering fiery, optimistic support. A spontaneous trip with your social circle brings adventure. Be mindful that your strong opinions don’t steamroll your soulmate or trigger ideological arguments at gatherings.',
  },
  {
    name: 'Mars aspect Rahu in 9th house',
    description: 'Friction may arise with friends from different backgrounds or belief systems. Gatherings could be disrupted by fanatical arguments. Protect your soulmate from aggressive gossip, and seek out friends who support your growth rather than trying to control your mind.',
  },
  {
    name: 'Jupiter aspect Saturn in 10th house',
    description: 'Your mature, disciplined approach to relationships wins you the deep respect of your peers. Older or influential friends provide substantial career support. You and your soulmate build a solid, long-lasting foundation based on mutual goals and unwavering loyalty.',
  },
  {
    name: 'Sun Transits the 4th House',
    description: 'You draw your energy from your innermost circle and family-like friends. Hosting a private gathering brings warmth and security. You ferociously protect your soulmate from outside negativity. Jealousy from the public sphere cannot penetrate your private sanctuary.',
  },
  {
    name: 'Sun Aspecting Midheaven (MC)',
    description: 'You are highly visible and celebrated within your social network and professional circles. Friends flock to support your ambitions. While you are the star of the party, ensure you still make time for the quiet, foundational support of your true soulmate.',
  },
  {
    name: 'Venus aspect Jupiter in 5th house',
    description: 'Abundant love, joyous parties, and creative gatherings define your social life right now! You attract wealthy, generous friends and easily brush off any petty jealousy. It is a highly auspicious time to meet a soulmate who brings out your absolute best.',
  },
  {
    name: 'Sun aspect Saturn in 10th house',
    description: 'You may feel a cooling off in your social life, as duties restrict your ability to attend parties. Some friends may seem demanding or unsupportive of your goals. Lean on the proven, steadfast loyalty of a long-term soulmate to get you through this heavy period.',
  },
  {
    name: 'Venus Transits the 6th House',
    description: 'Romance or deep friendship may blossom in the workplace or while volunteering. You show your love through practical support and acts of service. Beware of sweet-talking colleagues who use gossip to mask their jealousy of your talents.',
  },
  {
    name: 'Mars Transits the 3rd House',
    description: 'Your social interactions are fast-paced and slightly competitive. You enthusiastically debate friends and neighbors, but beware of crossing the line into aggressive arguments. Defend your soulmate against neighborhood gossip with your sharp wit and courage.',
  },
  {
    name: 'Mars Aspecting Midheaven (MC)',
    description: 'Your drive to succeed dominates your social interactions. You align with highly ambitious friends who push you forward. Be cautious of stepping on toes at networking gatherings; professional jealousy is high. A soulmate will support your fierce ambition.',
  },
  {
    name: 'Mercury Aspecting Midheaven (MC)',
    description: 'You are the primary communicator in your social and professional circles today. Networking parties are highly successful due to your eloquence. You offer brilliant advice to friends, and your soulmate supports your public voice and ideas.',
  },
  {
    name: 'Mercury aspect Saturn in 10th house',
    description: 'Communication with friends feels restricted or overly formal. Gatherings lack spontaneity. You may need to have a serious boundary-setting conversation with a friend. Support comes from a practical soulmate who helps you organize your thoughts and responsibilities.',
  },
  {
    name: 'Sun Transits the 5th House',
    description: 'You are radiant, playful, and the undeniable star of any gathering! Friends flock to your warm, entertaining energy. It is an ideal time for romance; a soulmate is drawn to your joyous self-expression. You easily banish jealousy with your generous spirit.',
  },
  {
    name: 'Mars aspect Saturn in 10th house',
    description: 'Frustration within your social or professional circles may boil over. You feel blocked by older, more rigid friends. Avoid parties where power struggles are likely. Find solace in the quiet, patient support of a soulmate who helps you strategize for the long term.',
  },
  {
    name: 'Mercury Transits the 5th House',
    description: 'Your conversations at parties are witty, creative, and flirtatious. You easily connect with younger, vibrant friends who inspire you. A soulmate bond is deepened through sharing artistic ideas and playful banter. Gossip is lighthearted and harmless right now.',
  },
  {
    name: 'Jupiter aspect Mercury in 8th house',
    description: 'You provide immense psychological support and wise counsel to friends in crisis. Deep, transformative conversations at intimate gatherings reveal hidden truths. You and your soulmate share an intuitive understanding that makes petty jealousy completely irrelevant.',
  },
  {
    name: 'Venus Transits the 7th House',
    description: 'Your focus is on establishing pure harmony with your best friend or soulmate. You are highly popular, and social gatherings are filled with grace and mutual appreciation. Jealousy dissolves in the face of your diplomatic, loving support for all your companions.',
  },
  {
    name: 'Saturn aspect Rahu in 9th house',
    description: 'Karmic tests arise within your friendships regarding differing moral beliefs. You may need to cut ties with friends who lack integrity or spread harmful gossip. A serious, grounded soulmate helps you navigate these heavy social lessons with wisdom.',
  },
  {
    name: 'Mercury Transits the 6th House',
    description: 'You connect with friends through shared daily routines or health goals. Support is practical—running errands or organizing events together. Be highly cautious of getting involved in workplace gossip, as words spoken now can easily trigger professional jealousy.',
  },
  {
    name: 'Sun aspect Jupiter in the 5th house',
    description: 'Your social life is filled with immense joy, optimism, and grand gatherings! Friends elevate your spirit and offer incredibly generous support. A soulmate connection thrives under this expansive energy, completely free from the shadows of jealousy or petty drama.',
  },
  {
    name: 'Sun Transits the 6th House',
    description: 'You may need to distance yourself from toxic friends or energy vampires to protect your health. Gossip in your daily environment feels draining. Focus your social energy on a single, supportive soulmate who encourages your journey toward self-improvement.',
  },
  {
    name: 'Mars Transits the 4th House',
    description: 'Friction and arguments may disrupt your usually peaceful inner circle or home gatherings. A close friend may act defensively, or hidden familial jealousies may surface. Protect your soulmate connection by refusing to let outside chaos into your private sanctuary.',
  },
  {
    name: 'Mercury Transits the 7th House',
    description: 'Communication flows beautifully between you and your best friend or soulmate. It is a great time to clear the air of any past misunderstandings. You act as a brilliant mediator at gatherings, easily smoothing over potential jealousies with your objective support.',
  },
  {
    name: 'Sun Transits the 7th House',
    description: 'Your attention is entirely fixed on your one-on-one relationships. A soulmate or best friend takes center stage. However, be cautious of ego clashes or a partner becoming too bossy. True support requires balancing your needs with theirs, avoiding power struggles.',
  },
  {
    name: 'Jupiter Transits the 5th House',
    description: 'Your social circle expands magnificently, bringing new, uplifting friends into your life. Gatherings are celebrations of creativity and joy. You easily attract a highly supportive, generous soulmate. Envy cannot exist in the radiant warmth you project to your peers.',
  },
  {
    name: 'Mars Transits the 5th House',
    description: 'You are highly energetic and competitive in your social interactions. Gatherings around sports or active hobbies are favored. While you passionately pursue romantic soulmates, be careful that your aggressive enthusiasm doesn’t trigger jealousy or drama among friends.',
  },
  {
    name: 'Sun Transits the 8th House',
    description: 'You crave extreme privacy, stepping away from the party scene to focus on intense, transformative bonds. Superficial friendships fall away. Hidden jealousies or betrayals may be brought to light. Rely solely on the unwavering, psychological support of a true soulmate.',
  },
  {
    name: 'Rahu Transits the 10th House',
    description: 'Your social status is shifting rapidly; you are drawn to powerful, highly ambitious friends. Networking gatherings are crucial, but beware of ruthless professional jealousy. A soulmate must be able to support your intense drive for public recognition without feeling left behind.',
  },
  {
    name: 'Ketu Transits the 4th House',
    description: 'You feel a strange detachment from your oldest friends or your usual inner circle. Home gatherings feel empty. You are releasing karmic ties to people who no longer support your soul’s growth. Seek out a past-life soulmate who understands this profound emotional transition.',
  },
  {
    name: 'Mercury Transits the 8th House',
    description: 'Your conversations bypass small talk and dive straight into the taboo. You are a vault for your friends\' deepest secrets, offering profound mental support. Use your sharp intuition to uncover the truth behind any malicious gossip circulating in your social sphere.',
  },
  {
    name: 'Ketu aspect Mars in 8th house',
    description: 'Old, buried angers or betrayals from past friendships unexpectedly resurface. Avoid toxic gatherings where jealousy runs rampant. You and a soulmate may need to engage in deep, psychological clearing to support each other through these intense karmic triggers.',
  },
  {
    name: 'Rahu aspect Moon in the 6th house',
    description: 'Your social environment at work or in daily life feels chaotic and filled with strange gossip. You may attract needy or unpredictable friends who drain your energy. Shield your soulmate from this instability, and focus on maintaining healthy boundaries and routines.',
  },
  {
    name: 'Sun Transits the 9th House',
    description: 'You surround yourself with friends who uplift your spirit and share your philosophical views. Traveling with your inner circle creates joyous memories. A soulmate connection deepens through mutual spiritual support, completely bypassing the mundane jealousies of everyday life.',
  },
  {
    name: 'Mercury Transits the 9th House',
    description: 'Your friend group expands to include teachers, foreigners, or philosophers. Gatherings are filled with expansive, mind-opening conversations. You offer brilliant, big-picture support to your soulmate, helping them see beyond petty neighborhood gossip.',
  },
  {
    name: 'Venus Transits the 8th House',
    description: 'Superficial partying holds zero appeal; you seek a soulmate bond of intense, merging depth. However, this placement can trigger extreme jealousy, possessiveness, or fears of betrayal within friendships. Support comes through absolute loyalty and sharing your deepest secrets.',
  },
  {
    name: 'Mercury Transits the 10th House',
    description: 'You strategically communicate with influential friends to advance your goals. Office parties and networking gatherings are highly productive. You offer excellent professional support to your soulmate, though you must ignore the jealous whispers of those you leave behind.',
  },
  {
    name: 'Sun Transits the 10th House',
    description: 'You are the recognized leader of your social and professional circles. Friends look up to you and offer strong support for your ambitions. While you shine at high-status gatherings, remain humble to prevent stirring up unnecessary jealousy among your peers.',
  },
  {
    name: 'Jupiter aspect Mars in 8th house',
    description: 'You are a fierce, philosophical protector of your closest friends. Your support is both deeply psychological and aggressively loyal. You and your soulmate easily cut through any toxic gossip, transforming jealousy into an opportunity for profound mutual growth.',
  },
  {
    name: 'Moon Aspecting Midheaven (MC)',
    description: 'Your emotional well-being is highly dependent on your public reputation and your standing in your friend group. You seek a soulmate who will proudly support you in public. Be careful not to let fear of workplace gossip dictate your authentic social connections.',
  },
  {
    name: 'Mercury Transits the 11th House',
    description: 'Your social network is buzzing! You are the hub of communication, connecting various friend groups at lively gatherings. Networking brings brilliant new allies. You offer excellent intellectual support to a soulmate who shares your visionary dreams for the future.',
  },
  {
    name: 'Moon Aspecting Ascendant (ASC)',
    description: 'You are highly empathetic, naturally drawing friends who need emotional support. Your sensitive vibe makes you deeply attractive to a nurturing soulmate. However, you easily absorb the moods of the party, so protect yourself from individuals harboring secret jealousies.',
  },
  {
    name: 'Venus Transits the 9th House',
    description: 'You attract friends who are adventurous, cultured, and philosophically aligned with you. A soulmate connection may be found abroad or in an educational setting. Gatherings are harmonious and expanding, completely devoid of petty local gossip or narrow-minded jealousy.',
  },
  {
    name: 'Sun Transits the 11th House',
    description: 'You step into a position of authority within large social networks or organizations. Powerful friends offer substantial support for your dreams. Gatherings are large and goal-oriented. A soulmate stands proudly by your side as you achieve group success and bypass petty rivals.',
  },
  {
    name: 'Venus Transits the 10th House',
    description: 'You charm your way to the top of your social hierarchy. Professional gatherings and high-status parties are where you shine. You attract a successful, supportive soulmate. While your popularity peaks, graciously ignore any jealousy from those who envy your effortless rise.',
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