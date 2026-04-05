const db = require('./index');

const events = [
  {
    name: 'Moon Transits the 8th House',
    description: "Thoughts of past humiliation lower your self-confidence. Personal affairs are causing deep worries. Women may be a source of aggravation, gossiping, and hiding information. Trust the intuition to make the correct choices. Financial matters with others are unpredictable and cannot be trusted. The mother's emotional stability is in question.",
  },
  {
    name: 'Moon aspect Venus in 8th house',
    description: 'You are longing for the intimacy you once had in the past. It may be time to rekindle these feelings again. You may receive a gift or message of love. You have the power of attraction now.',
  },
  {
    name: 'Venus ruler of the 2nd House in the 8th House',
    description: "Financial income comes from other people's money such as investors, investments, insurance, or inheritance. You will receive money through some kind of settlement now. Money is made through investments from other people. You have many secrets from early childhood and telling the truth is hard for you but will give a new sense of freedom now.",
  },
  {
    name: 'Venus ruler of the 7th House in the 8th house',
    description: 'The partner is very secretive and not very trustworthy. This is a very difficult placement for marriage and may indicate divorce. Be aware of issues around betrayal this can cause separation. There is a major lesson to be leaned pertaining to trust through relationships currently.',
  },
  {
    name: 'Moon aspect Mercury in 8th house',
    description: 'Deep analysis and research in your studies keeps you locked up in your mind today. You feel you are on the brink of a new discovery. You can rely on your hunches as they are leading you in the right direction.',
  },
  {
    name: 'Mercury ruler of the 3rd House in the 8th House',
    description: 'Difficult relationships with a sibling can cause early trauma, and in extreme cases now is the time for separation and an ending in your relationship. There is an intense interest in life after death and metaphysical subjects. You may begin reading or studying metaphysical, spiritual, or psychological works. Willpower is needed now as you need some deep self-analysis.',
  },
  {
    name: 'Mercury ruler of the 6th House in the 8th House',
    description: 'Acute illnesses may be hard to diagnose turning into more serious and chronic disease. There may be many surgeries throughout life. Caution and care are required around your place of work for there is a risk of accidents or lawsuits. Be cautious with coworkers or employees! Pets may have problems or are prone to sickness now.',
  },
  {
    name: 'Moon aspect Mars in 8th house',
    description: 'You may dwell on negative emotions that drain your energy. Today you must take charge and eliminate and change these feelings into a new hope and positive affirmations for a better future.',
  },
  {
    name: 'Mars ruler of the 1st House in the 8th House',
    description: 'Life can be a struggle today! Poor health or lack of drive-through early hardship builds character. Deep introspection can give a rational reason for why you are experiencing hardship. Try to understand why you are attracting certain situations today. There is an interest in metaphysical studies and an interest in things beyond this world.',
  },
  {
    name: 'Mars ruler of the 8th House in the 8th House',
    description: 'Deep psychological awareness means you are constantly doing self-analysis. You have profound intuition and psychic abilities and a great interest in life after death. Your interest in research could lead you to be a detective of sorts. You could be a therapist or psychic. Issues with past shame or guilt cause you to be very secretive. Deep realizations that may transform your life surface today.',
  },
  {
    name: 'Moon Transits the 9th House',
    description: 'Spiritual guidance seems unclear and wavering beliefs begin a journey to find the truth. Emotional attachments to beliefs are difficult to change. Past conditioning is breaking down as new beliefs are developed. A transformation is occurring like a butterfly. Female teachers or mothers will set the tone for new realizations. The father may be unpredictable and instill insecurities.',
  },
  {
    name: 'Moon aspect Sun in 9th house',
    description: 'Read or listen to inspirational messages. Today you will open your mind to new possibilities with positive thoughts. Understanding and tapping into the spiritual forces around you gives constructive reinforcement.',
  },
  {
    name: 'Sun ruler of the 5th House in the 9th House',
    description: 'Spirituality and philosophical studies are a dominant part of your life involving teaching and writing spiritual truths. The paternal grandfather can be a major influence in life. There is an ease and comfort that comes from a certain amount of luck. You are very lucky today.',
  },
  {
    name: 'Moon aspect Rahu in 9th house',
    description: 'Extreme and fanatical beliefs are surfaced briefly in external triggers seen in the news or experienced. You have come to a new realization but these annoyances are great reminders.',
  },
  {
    name: 'Moon aspect Ketu in 3rd house',
    description: 'You learn and communicate in a different way from the norm but this is your true stroke of genius. Be in control of your talents and use them to develop something different from the conventional norm.',
  },
  {
    name: 'Moon Transits the 10th House',
    description: "Fluctuations and changes in leadership at work may come as a surprise. The management or company is going through a renovation or change. The changes may not be permanent only fleeting thoughts. Women superiors may be unpredictable and send mixed messages. Don't be attached to the messages or thoughts because everything is subject to change. Tomorrow is another day.",
  },
  {
    name: 'Sun Transit the 12th House',
    description: "Quality time spent alone for solitude rebuilds the spirit and gives time to meditate and find peace. It is time to retire and end and bring closure to many projects. Children may be a source of emotional drain and sadness. Past memories are awakening a new awareness and reality of the changes that have occurred over the years. Responsibility for others who need help keeps you awake at night with worry.",
  },
  {
    name: 'Moon aspect Saturn in 10th house',
    description: 'The mood is a little depressing today at work. No one wants to claim responsibility in the lack of inspiration occurring. A continued focus on a job well done will eventually boost the mood and spirit in the office.',
  },
  {
    name: 'Saturn ruler of the 10th House in the 10th House',
    description: 'Career success is a driving force in life and consumes your time and thoughts. You are a leader and command respect in the workplace. The profession defines and labels you. This is a great time to secure and advance in your work. It is time to get those resumes out, ask for a raise, or go for a new position.',
  },
  {
    name: 'Saturn ruler of the 11th House in the 10th House',
    description: 'Career pursuits should give a sense of purpose and meaning in your life. There must be love and passion for your work. You will be connected to powerful people through your work and career. Their guidance is what you need now.',
  },
  {
    name: 'Moon Transits the 11th House',
    description: "Friends seem to call needing attention and council. Take a step back from frivolous attention. Don't let friends cause an emotional drain, with demands or needs. They will change their minds and disappear. Social events with acquaintances are fun but amount to anything. Don't pay attention to gossiping women, they are a waste of time.",
  },
  {
    name: 'Moon aspect Jupiter in 5th house',
    description: 'Time to reconnect to yourself through being creative or having fun. Listening to your favorite music raises happy feelings. Children can bring affection and open your heart.',
  },
  {
    name: 'Jupiter ruler of the 9th House in the 5th House',
    description: 'The father is a great teacher and is very close to you. Spiritual teachings are a passion and could be a profession. Luck and fortune come from investments and children. You are very truthful, and many seek out your guidance. You give valuable advice to others today.',
  },
  {
    name: 'Jupiter ruler of the 12th House in the 5th House',
    description: 'You may have experienced difficulties around children or the inability to have them. Now is the time to develop the hidden and latent creativity of a special talent. Interest in the supernatural cultivates learning and mastering metaphysical sciences. Your intuition is strong, use this gift for guidance now.',
  },
  {
    name: 'Moon Transits the 12th House',
    description: 'Memories of childhood and people known creep into the mind. Daydreaming of sentimental times and loved ones consumes the mind. Children are a concern with worry over life conditions. It is time to sleep, and pay attention to the dreams. It is easier to release past emotional pain that controls life.',
  },
  {
    name: 'Mars aspect Jupiter in 5th house',
    description: 'You are more active in the area of entertainment and the arts, attending sporting events, concerts or plays. Open to romance and consider dating, this could be the time you meet someone special. You are lucky with investments. Children bring joy and happiness to the family.',
  },
  {
    name: 'Sun in 9th (Dispositor)',
    description: 'Your sense of truthfulness and integrity are at the bottom of what is occurring now. Your father could be the culprit of what has been occurring in your life even if he is no longer alive. A trip gives you freedom.',
  },
  {
    name: 'Moon aspect Moon in 6th house',
    description: "People in the workplace need your support, even though they drain your energy. Give compassion but don't lower yourself to their level. Watch what you eat today, for your tummy is a little overly sensitive.",
  },
  {
    name: 'Moon ruler of the 4th House in the 6th House',
    description: 'The mother may have many illnesses or need emotional council. The home and family seem to struggle and have debts. The mother worked hard to make ends meet. Aunts and uncles cause the family many problems. All these issues or memories of these struggles surface now.',
  },
  {
    name: 'Moon Transits the 1st House',
    description: 'Clarity of mind gives power to instigate a new beginning. A deeper sensitivity plays a major part in the choices of the direction life takes with new projects. This new outlook on life initiates a different perception of the world with a renewed mindset on how to achieve the desires. Visits from the mother or a nurturing female bring comfort and security.',
  },
  {
    name: 'Moon Transits the 2nd House',
    description: 'Financial issues fluctuate unable to balance the books. It is not the time to make large investments. Spending more time with the family, cooking, and gathering the family around food will bring peace to the home. Stay away from emotional eating that can cause excessive weight gain.',
  },
  {
    name: 'Venus aspect Moon in 6th house',
    description: 'Any health practice that beautifies your appearance is on your to do list, such as getting a facial or going to an exercise or yoga class. Learning more about healthy eating attracts your attention. Shopping at the grocery store is unusually interesting.',
  },
  {
    name: 'Mercury in 8th (Dispositor)',
    description: 'Deep thoughts to get to the bottom of things will uncover hidden truths. Listening to your psychic awareness helps and heals. Emotional healing comes from your vast understanding of psychology.',
  },
  {
    name: 'Moon Transits the 3rd House',
    description: "Being flexible and open-minded brings in new opportunities that open your mind to new possibilities. Unplanned and spontaneous trips give a new sense of freedom. It is a good time to go grocery shopping, follow a recipe, or take a cooking class. Gossip is very entertaining but don't get caught spreading rumors.",
  },
  {
    name: 'Venus Transits the 1st House',
    description: 'The personal appearance becomes more important as complements inspire a sense of personal attraction. There is a glow in the face with a powerful attractive force. Style and image are important and it is a good time to go shopping for new clothes. Partners suddenly recognize the new appeal planning more time together. The arts and entertainment are important with visits to concerts, galleries, plays, or movies.',
  },
  {
    name: 'Moon Transits the 4th House',
    description: 'Family gatherings are around food and conversations of the past. Nostalgic feelings dreams of old times and sentimental memories bring comfort. The mother and her memory may be a fleeting thought throughout the day. Events and people inspire thoughts of childhood. Seeking a sense of security compels home and rest.',
  },
  {
    name: 'Mars aspect Moon in 6th house',
    description: 'Women in the workplace cause distress for others with their complaints. Your digestion is very sensitive, be careful with your intake and aware of what causes stomach distress. Hormonal changes may be the cause of fluctuating moods. Find a way to balance your emotions to heal the body.',
  },
  {
    name: 'Uranus conjunct Venus',
    description: 'Unexpected meetings with a new love spark an exciting romance. Chance meetings happen at the most unexpected places. You will fall in love suddenly. A romance begins with a bang and takes you on a fast world wind full of intrigue and excitement. There may be a sudden influx of money that affords you to be part of a new life of luxury. You may impulsively want to buy a new car.',
  },
  {
    name: 'Mars in 8th (Dispositor)',
    description: 'Your deep psychological understanding of your psyche is the result of what you are experiencing now. Research and digging deep has proved beneficial to the current events happening in your life currently.',
  },
  {
    name: 'Moon Transits the 5th House',
    description: 'Sudden inspiration to be creative brings an optimistic attitude to daily life. Having parties and entertainment is fun. Children can be more emotional and drained of energy. Women look for emotional support. The mind seems to wander, without focus, daydreaming.',
  },
  {
    name: 'Mars Transits the 12th House',
    description: 'Secret enemies are lurking behind the scenes, be careful and don\'t be vulnerable. Protect the home from thieves with a security system. At work some are jealous, be careful what is shared in confidence at work to avoid backstabbing. Sleep is disturbed waking up with nightmares and worries. It is time to take care of your health and avoid certain stresses.',
  },
  {
    name: 'Mercury aspect Jupiter in 5th house',
    description: 'Interest in technology that enhances the ability to make investments becomes a focus. New ways of thinking and inventions open the awareness. Creative writing is all inspiring. A desire to pursue romance can attract a new love interest. Children receive awards and positive reinforcement in learning achievements.',
  },
  {
    name: 'Sun aspect Moon in 6th house',
    description: 'Changes in your health inspire you to change your diet and everyday habits. Taking vitamins or opting for a better meal choice throughout the day will make you feel healthier and affect lifelong habits.',
  },
  {
    name: 'Sun Transits the 1st House',
    description: 'Energy and stamina inspire a new exercise program. A sense of self-confidence comes from feeling strong and vital. It is time to get back into action with a renewed sense of purpose. A new sense of confidence leads to career success. Exercise consideration for others.',
  },
  {
    name: 'Mercury Transits the 12th House',
    description: 'Thoughts of old friends intuit a sudden call out of the blue. Psychic and mental telepathy is developed with others. Interest in foreign places and cultures may initiate plans for foreign travel. It is time to begin a journal to process and heal a painful past. Understanding, compassion, and forgiveness heal the life.',
  },
  {
    name: 'Ketu aspect Sun in the 9th house',
    description: 'The health of the father may be declining. Old issues concerning the father seem to surface for retribution. Problems with the law or authority figures can rise in conflict. An important teacher or spiritual guide may pass away. Your beliefs are changing with the changing direction of your life.',
  },
  {
    name: 'Venus Aspecting Ascendant (ASC)',
    description: "You'll attract positive attention and feel more sociable, making it a good time to focus on your appearance and relationships. Ensure you balance social activities with self-care and daily responsibilities.",
  },
  {
    name: 'Jupiter in 5th (Dispositor)',
    description: 'Situations concerning children bring happiness and a different perspective to life currently. You are extremely creative during this time and could be manifesting something new, adding prosperity to your life.',
  },
  {
    name: 'Moon Transits the 6th House',
    description: 'The health is weak, pay attention to the quality of foods eaten or there will be stomach upsets. The work environment is changing and many people particularly women are gossiping because there is uncertainty in the air. Animals and pets are comforting.',
  },
  {
    name: 'Moon Transits the 7th House',
    description: 'A change of heart may be worrisome but don\'t despair because it is only a fleeting emotion. The partner may be unpredictable and may change their mind, vacillating between many feelings and thoughts. An unforeseen lack of security has an emotional effect on the mind. There are changes and chaos in the office with uncertainty on job security, remember things are not as they may appear.',
  },
  {
    name: 'Saturn aspect Sun in 9th house',
    description: 'The father is declining in health or he may be looking at retirement. Many old beliefs are breaking apart, particularly concerning religion. There may be problems with a teacher, professor or guru. Your guides are now leaving or abandoning you.',
  },
  {
    name: 'Venus Transits the 2nd House',
    description: 'Financial matters are on an upswing; with luck and prosperity. Purchases of aesthetic or luxury items will beautify the home, environment, and the self. Be clear in expressing your desire to receive the desired result. Speech is sweet and nicely touches others. The 2nd house rules the face therefore products that adorn the face, like makeup or lotions are of interest. It is a good time to schedule surgery or work done on the face or teeth.',
  },
  {
    name: 'Venus aspect Venus in 8th house',
    description: 'A deep longing for love and romance consumes the mind. The need to be loved and feel love opens your heart. There may be a love connection with a long lost love that comes at this time. A current relationship deepens with passion and sensuality. You have a powerful and charismatic attraction now. Commitment and a deep connection are shared. A special gift is given and money shared with others finally comes at this time.',
  },
  {
    name: 'Sun Aspecting Ascendant (ASC)',
    description: "You'll feel a boost in confidence and vitality, making it a great time to start new projects or make a strong personal impression. Be mindful of balancing assertiveness with consideration for others to maintain harmony in relationships.",
  },
  {
    name: 'Mercury Aspecting Ascendant (ASC)',
    description: "You'll feel a strong urge to communicate and share ideas, making it a productive time for networking and writing. Stay focused to avoid scattering your energy, and consider how your communication style might affect partnerships and routines.",
  },
  {
    name: 'Venus aspect Mercury in 8th house',
    description: 'It is time to express your heartfelt sentiments concerning your intimate relationships. Maybe a weekend getaway is the plan. Deep feelings in love and commitment bring a sense of contentment, even if it is romanticizing about a potential lover or love of the past.',
  },
  {
    name: 'Venus aspect Mars in 8th house',
    description: 'You are awakened to your own seductive sensuality and sexuality, use this power to attract love and not lust. Your charismatic powers of attraction can be a bit dangerous as you must be careful who you attract. Be aware of your finances and keep an eye on expenses.',
  },
  {
    name: 'Mars aspect Venus in 8th house',
    description: 'You are awakened to your own seductive sensuality and sexuality, use this power to attract love and not lust. Your charismatic powers of attraction can be a bit dangerous as you must be careful whom you attract. Be aware of your finances and keep an eye on expenses.',
  },
  {
    name: 'Venus Transits the 3rd House',
    description: 'Creative work using the hands develops a new hobby. Composing a letter to inspire someone puts this energy to good use. Decorating and beautifying the home or surroundings bring cheerfulness. There are good relations with siblings. Interest in the arts will give the mind and emotions, movies, and concerts a form of escape. A short vacation can give a sense of peace and relaxation. Happy news brings comfort.',
  },
  {
    name: 'Mercury Transits the 2nd House',
    description: 'Financial planning gives a clear perspective on what can be afforded and where the money should be distributed. This is a good time to discuss expectations in love and money. Spending money on learning, classes, computers or travel seems appropriate now. Look for sales, as bargains will bring big savings. A business in sales will prosper.',
  },
  {
    name: 'Sun Transit the 2nd House',
    description: 'Money and financial matters are a focus and create unexpected problems. There may be some unexpected expenses this month with the mood to spend. The partner may create a financial drain. Pay attention to diet and daily habits, certain foods can cause upsets or health issues.',
  },
  {
    name: 'Mercury Transits the 1st House',
    description: 'Verbal expressions and a more talkative nature are a part of the need to communicate ideas and self-expression. Life takes on an air of fun and adventure. New information comes that can activate the desire to learn and grow. It is time to take on a new skill, take a class, and learn subjects. The younger generation gives inspiration to view life from a fresh approach.',
  },
  {
    name: 'Mars Transits the 1st House',
    description: 'Courage and energy give drive and ambition to take on projects formally put on the back burner. Aggravating irritating issues inspire a force to accomplish unfinished projects. This driving force can accomplish tasks that previously seemed insurmountable. A feeling of agitation with an impulsive nature must be contained and balanced to avoid accidents during this accident-prone time. Headaches or head injuries are indicated.',
  },
  {
    name: 'Mars aspect Ketu in 3rd house',
    description: 'Long standing issues with a sibling need to be addressed now. An unexpected trip comes as a surprise, as schedules may not go as planned. Your usual drive and ambition comes to a halt as an emotional issue takes a toll on your mind. Be careful with machinery and driving as you are accident prone.',
  },
  {
    name: 'Mercury aspect Venus in 8th house',
    description: 'It is time to express your heartfelt sentiments concerning your intimate relationships. Maybe a weekend getaway is the plan. Deep feelings in love and commitment bring a sense of contentment, even if it is romanticizing about a certain potential love or lover of the past.',
  },
  {
    name: 'Sun aspect Venus in 8th house',
    description: "Passion and love can be all consuming, don't be overly compulsive or codependent. Memories of old love affairs may enter your mind, find ways to let go and move forward. Clinging to the past paralyzes and prevents you from experiencing new healthy relationships.",
  },
  {
    name: 'Mercury aspect Mercury in 8th house',
    description: 'Working on a research project or just researching something for your own needs consumes your time and awareness today. Finding a specific answer is overwhelming. Be aware your intuitive hunches are really all you need to direct you to the right answer.',
  },
  {
    name: 'Venus aspect Sun in 9th house',
    description: 'Travel plans can take you to an exotic beautiful place. Your love of learning opens many doors, opportunities to teach or share information you love comes in a message today. Female teachers inspired a lesson you have never forgotten and still share today.',
  },
  {
    name: 'Mars Aspecting Ascendant (ASC)',
    description: "You'll feel a surge of energy and determination, making it a great time for bold moves. Be cautious of acting impulsively, as this could lead to conflicts or burnout in your personal and professional life.",
  },
  {
    name: 'Venus aspect Rahu in 9th house',
    description: 'It is time to take a vacation! Travel to beautiful and luxurious resorts will bring needed relaxation. Your relationship with your father is important now, he has a special gift for you. Look at how you can benefit from teachers of all kinds, you are learning how to create and project your image to the world. Legal matters will finalize with a positive outcome.',
  },
  {
    name: 'Venus aspect Ketu in 3rd house',
    description: 'Take classes or go to meetings to expand your creative talents. This is where you can meet friends that will reconnect you with love. Chance meetings open your heart. Spontaneous trips can lead to romance. Lovers from the past spark that old flame. You may be traveling to visit a friend or sibling.',
  },
  {
    name: 'Mercury aspect Mars in 8th house',
    description: "Investigative research finds answers not normally seen. Now is the time your mind is fully active to find these answers. Sometimes you can go on a tangent with deep philosophical thought, just don't let it waste valuable time that can take you off your course. Your inner voice will direct you at this time.",
  },
  {
    name: 'Mercury Transits the 3rd House',
    description: 'Writing a list of things to do or accomplish will be of great value for the following month. It is a good time to begin a journal. Learning new information comes easy and new ideas are presented spontaneously. A short trip will be prosperous. Good news will come. Sales and shopping are fun and productive. It is time to buy electronics, phones, televisions, or computers. The gift of gab is used to spread good words.',
  },
  {
    name: 'Mars aspect Mercury in 8th house',
    description: "Investigative research finds answers not normally seen. Now is the time your mind is fully active to find these answers. Sometimes you can go on a tangent with deep philosophical thought, just don't let it waste valuable time that can take you off your course. Your inner voice will direct you at this time.",
  },
  {
    name: 'Jupiter Transits the 4th House',
    description: 'It is a good time to expand assets through real-estate or change the residence. There is a desire for a new home with more room or land. Renovating the current home or changing the look and feel could be the answer. This is the best time to buy a new car. Insurance for the car or home gives security and protection. Working at home is easy and profitable, along with a business on the side. As the house of happiness, there is a sense of well-being and contentment being at home. Family celebrations in the home bring fun and gratification.',
  },
  {
    name: 'Jupiter aspect Venus in 8th house',
    description: 'Money will come through other people at this time. This may manifest through inheritances, legacies or marriage. The partner is very successful financially. Debts and loans are paid back giving financial freedom.',
  },
  {
    name: 'Sun aspect Mercury in 8th house',
    description: 'Your thoughts take you into a deep place to understand the deeper aspects of your life. There is a questioning of why things have turned out the way they have. This inner search leads you to different tools of self-discovery, such as psychology or metaphysics.',
  },
  {
    name: 'Mercury aspect Sun in 9th house',
    description: 'Reading or listening to inspirational works gives you a positive outlook on life today. Conversations sharing your beliefs gives a sense of commonality and connection with others of like mindedness. You will receive a message from a teacher or your father.',
  },
  {
    name: 'Mercury aspect Ketu in 3rd house',
    description: 'Revelations in a new way of learning or transferring information will change your business outlook today. Sales come from unsuspected places. Traveling is hectic due to confusion. Communications are misread and or disconnected. Take time to listen and hear others, especially a sibling. There may be issues with hearing or listening.',
  },
  {
    name: 'Mercury aspect Rahu in 9th house',
    description: 'Travel to faraway places stimulates and opens your mind to a new perspective. Unexpected travel opportunities are presented, be spontaneous for there is much to learn from these experiences. Traveling to conferences or classes will prove to be fruitful. Your mind is open to learning unconventional and unusual ideas. Your father may need a sympathetic ear.',
  },
  {
    name: 'Venus Transits the 4th House',
    description: 'The appearance of the home gives the inspiration to decorate, remodel, or renovate. A sense of creativity invents new colors and designs. Gardening is a way to relax and surround the home with beauty and expression. Home is where the heart is adding comfort and peace. This can be a good time to purchase any luxury items such as a new car.',
  },
  {
    name: 'Sun aspect Mars in 8th house',
    description: 'Personal attacks on your character affect you on a deep psychological level. This unconsciously reminds you of instances of past humiliation. This surfaces a subtle anger you perceive the world through. Analysis of this response gives a great opportunity to realize and release the anger once and for all. Study on a scientific level leads to a new discovery.',
  },
  {
    name: 'Venus Aspecting Midheaven (MC)',
    description: 'Your charm and diplomacy can lead to career advancements and improved professional relationships. Focus on building harmonious connections, but stay grounded in your financial decisions.',
  },
  {
    name: 'Saturn in 10th (Dispositor)',
    description: 'Dissatisfaction around the workplace is causing upset because there is a sense of no meaning and purpose. You have worked diligently for others and need a break currently.',
  },
  {
    name: 'Jupiter Aspecting Midheaven (MC)',
    description: 'Opportunities for career growth are likely, and taking calculated risks could lead to substantial rewards. However, stay grounded and ensure that these opportunities align with your long-term financial and personal goals.',
  },
  {
    name: 'Sun Transit the 3rd House',
    description: 'Siblings take charge and become bossy around areas of concern. Let them take the lead and life will be easier. Strength and ambition allow one to take on new projects without procrastination. Short travels open the mind to learning valuable information.',
  },
  {
    name: 'Mars aspect Mars in 8th house',
    description: 'You are passionate to understand the deep meaning of life and especially human nature. You find your deeper mission is activated and you will move forward in exploring and researching your quest with much tenacity. You will make things happen.',
  },
  {
    name: 'Venus aspect Saturn in 10th house',
    description: 'You are given more responsibility at work, discipline and focus will bring future success. Your boss may feel threatened by your talent, it may be time to consider your own business plan.',
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
