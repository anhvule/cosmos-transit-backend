const db = require('./food');

const events = [
  {
    name: 'Moon Transits the 8th House',
    description: "During this intense emotional transit, your digestive fire can be erratic. Focus on deep, grounding root vegetables like roasted sweet potatoes, carrots, and beets. Avoid raw, cold salads which can aggravate internal anxieties, and instead sip warm ginger and turmeric tea to aid in digestion and detoxification.",
  },
  {
    name: 'Moon aspect Venus in 8th house',
    description: 'This placement creates a craving for deeply sensual and juicy foods. Pomegranates, fresh figs, and ripe berries are highly recommended. Substitute heavy, tamasic dairy products with lighter almond or coconut milk infused with a pinch of cardamom to satisfy the need for sweetness without congesting the body.',
  },
  {
    name: 'Venus ruler of the 2nd House in the 8th House',
    description: "You may be drawn to rich, luxurious, and hidden calories. To honor this energy in a healthy way, incorporate high-quality fats into your diet. A small handful of soaked almonds, a spoonful of pure ghee over warm basmati rice, or saffron-infused warm milk will deeply nourish the tissues without overwhelming the liver.",
  },
  {
    name: 'Venus ruler of the 7th House in the 8th house',
    description: 'Relational stress can affect your stomach. Share warm, easily digestible, and purifying meals with others. A traditional, mild kitchari made of yellow mung dal and white rice with cumin and coriander is the perfect harmonizing food to soothe the digestive tract and calm interpersonal tensions.',
  },
  {
    name: 'Moon aspect Mercury in 8th house',
    description: 'Your mind is working overtime, requiring specific brain-boosting nutrition. Incorporate walnuts, flaxseeds, and dark leafy green salads tossed with olive oil. Drink peppermint or gotu kola tea to support deep research and mental clarity without overstimulating the nervous system like coffee would.',
  },
  {
    name: 'Mercury ruler of the 3rd House in the 8th House',
    description: 'Nervous energy may lead to skipped meals or fast, thoughtless eating. Ground yourself with warm, restorative broths. A hearty chicken or mushroom bone broth packed with mineral-rich seaweed will repair the nervous system and provide sustained energy during periods of intense self-analysis.',
  },
  {
    name: 'Mercury ruler of the 6th House in the 8th House',
    description: 'Gut health is paramount now as acute sensitivities may arise. Focus entirely on probiotic and prebiotic foods. Incorporate kefir, mild sauerkraut, or homemade yogurt into your diet. Strictly avoid highly processed foods, artificial sugars, and deep-fried items to prevent intestinal inflammation.',
  },
  {
    name: 'Moon aspect Mars in 8th house',
    description: 'Internal frustration and heat (Pitta) are high. You must actively cool your system to prevent acidic indigestion. Consume hydrating, cooling foods like fresh cucumber, watermelon, and coconut water. Avoid chilies, garlic, and excessive salt, which will only fuel emotional and physical inflammation.',
  },
  {
    name: 'Mars ruler of the 1st House in the 8th House',
    description: 'Your body requires strong, blood-building fuel to overcome lethargy, but the digestion may be sluggish. Opt for high-protein, easily assimilated legumes like red lentils (masoor dal) cooked with digestive spices like fennel and cumin. Avoid heavy red meats which will stagnate in the gut.',
  },
  {
    name: 'Mars ruler of the 8th House in the 8th House',
    description: 'A powerful time for cellular detoxification and physical transformation. Embrace bitter greens such as dandelion, arugula, and kale to deeply cleanse the liver and blood. A morning tonic of warm water with fresh lemon juice and a dash of cayenne pepper will ignite a healthy metabolism.',
  },
  {
    name: 'Moon Transits the 9th House',
    description: 'A deeply auspicious transit that favors a pure, sattvic diet. Fresh, sun-ripened fruits, whole grains, and light dairy are recommended. A bowl of warm oatmeal topped with fresh apples and cinnamon, or a simple dish of basmati rice with turmeric, will elevate your spiritual and physical vibration.',
  },
  {
    name: 'Moon aspect Sun in 9th house',
    description: 'Your digestive fire is strong and bright. Absorb the sun’s energy through vibrant, golden foods. Fresh oranges, sweet corn, yellow squash, and a moderate amount of raw, unheated honey will provide exceptional vitality and uplift your spirits today.',
  },
  {
    name: 'Sun ruler of the 5th House in the 9th House',
    description: 'Hearty, noble grains and natural sweets are favored to support philosophical thought. Quinoa, spelt, and amaranth dishes sprinkled with chopped dates or raisins are highly recommended. Avoid all leftover or stale foods (tamasic), as they will immediately dull your naturally bright energy.',
  },
  {
    name: 'Moon aspect Rahu in 9th house',
    description: 'Erratic cravings for foreign, artificial, or highly processed junk foods may arise. Ground this chaotic Vata energy with heavy, earth-grown root vegetables. Roasted sweet potatoes, yams, and parsnips with a touch of ghee will satisfy the hunger and prevent toxic binges.',
  },
  {
    name: 'Moon aspect Ketu in 3rd house',
    description: 'A detachment from heavy foods is natural today. Honor this by consuming light, airy, and easily digestible foods. Puffed rice, simple clear vegetable soups, and herbal teas like chamomile or holy basil (tulsi) will keep you nourished without weighing down your physical vessel.',
  },
  {
    name: 'Moon Transits the 10th House',
    description: "Structured, reliable meals are necessary to combat workplace fluctuations. Focus on slow-burning complex carbohydrates like steel-cut oats, black beans, and roasted squash to ensure a steady release of energy throughout the day, preventing the afternoon crash and reliance on office sweets.",
  },
  {
    name: 'Sun Transits the 12th House',
    description: "Your digestive fire is resting. This is the optimal time for a liquid diet or intermittent fasting. Consume clear vegetable broths, hot water with lemon, and very light, watery fruits like papaya or melon to allow your body to focus its energy on deep cellular repair rather than heavy digestion.",
  },
  {
    name: 'Moon aspect Saturn in 10th house',
    description: 'Cold, dry energy can cause stiffness and sluggish digestion. Counteract this by eating warm, heavily oiled, and spiced foods. Sautéed spinach in sesame oil, warm roasted root vegetables, and dishes spiced with black pepper and ginger will stimulate the metabolism and lift a depressed mood.',
  },
  {
    name: 'Saturn ruler of the 10th House in the 10th House',
    description: 'Sustain your career drive with traditional, slow-cooked, and preserving foods. Thick root vegetable stews, fermented foods like kimchi, and dishes utilizing black sesame seeds or black lentils (urad dal) provide the deep, sustained endurance required for your heavy professional responsibilities.',
  },
  {
    name: 'Saturn ruler of the 11th House in the 10th House',
    description: 'When networking or working long hours, rely on structured, protein-dense snacks rather than sugary treats. Roasted chickpeas, hard-boiled eggs, and almonds are recommended. Strictly avoid ice-cold drinks, which will freeze your digestive fire and cause bloating.',
  },
  {
    name: 'Moon Transits the 11th House',
    description: "Social eating is highlighted, but you must keep it light to avoid feeling drained. Opt for fresh fruit platters, vibrant berry salads, and sparkling water with lime. Avoid heavy, deep-fried appetizers at social gatherings to maintain your high energetic frequency.",
  },
  {
    name: 'Moon aspect Jupiter in 5th house',
    description: 'A joyful transit that craves natural sweetness and expansive foods. Satisfy this urge healthily with sweet potatoes, ripe bananas, and a modest amount of pure maple syrup or ghee. These foods nourish the reproductive and creative tissues (Shukra) without causing excessive weight gain.',
  },
  {
    name: 'Jupiter ruler of the 9th House in the 5th House',
    description: 'Honor the guru within by consuming pure, golden, and wholesome foods. Turmeric-spiced milk (golden milk), hearty chickpea curries, and roasted pumpkin are deeply nourishing and spiritually elevating, perfectly aligning with your role as a guide to others.',
  },
  {
    name: 'Jupiter ruler of the 12th House in the 5th House',
    description: 'Hidden desires for heavy sweets can sabotage your health. Channel this energy into naturally sweet, nutrient-dense fruits like fresh figs, dates, and persimmons. These provide the luxurious mouthfeel you crave while actually delivering vital minerals and fiber to the body.',
  },
  {
    name: 'Moon Transits the 12th House',
    description: 'Your body needs deep rest and calming foods to process subconscious memories. Sip warm milk with a pinch of nutmeg before bed to induce restful sleep. Avoid all caffeine, spicy foods, or heavy meats in the evening, as they will cause vivid nightmares and disrupt your necessary rest.',
  },
  {
    name: 'Mars aspect Jupiter in 5th house',
    description: 'Your physical energy is immense, demanding robust, high-protein fuel. Grilled lean meats, lentil stews, and quinoa salads are highly recommended to support an active lifestyle. However, be cautious of overly greasy or heavy restaurant foods, as your liver is working overtime.',
  },
  {
    name: 'Sun in 9th (Dispositor)',
    description: 'A return to the purest, most natural form of eating is required. Highly sattvic foods—fresh apples, raw honey, organic wheat, and pure cow’s milk (if tolerated)—will align your physical health with your deep integrity and spiritual truth.',
  },
  {
    name: 'Moon aspect Moon in 6th house',
    description: "Your stomach lining is highly sensitive to the emotional drain of others today. Protect your gut with incredibly soothing, bland foods. Rice gruel (kanji), plain oatmeal, and buttermilk spiced with a little cumin will coat and protect the stomach from stress-induced acidity.",
  },
  {
    name: 'Moon ruler of the 4th House in the 6th House',
    description: 'Childhood emotional patterns may trigger digestive distress. Counteract this with easily digestible comfort foods that don’t tax the system. Steamed zucchini, mashed sweet potatoes, and warm, mild vegetable broths will provide a sense of maternal nourishment without causing debt to the physical body.',
  },
  {
    name: 'Moon Transits the 1st House',
    description: 'Your physical vessel is highly receptive and prone to retaining water. Focus heavily on hydrating, diuretic foods. Fresh melons, cucumber slices, celery juice, and mint tea will flush out toxins and reduce puffiness, giving you a clear, vital glow for your new beginnings.',
  },
  {
    name: 'Moon Transits the 2nd House',
    description: 'The desire for substantial, earthy nourishment is incredibly strong today. Grounding, savory meals that require thorough chewing are ideal. Roasted root vegetables, rich lentil stews, and wholesome, dense breads will bring peace to the home and satisfy the urge to consume.',
  },
  {
    name: 'Venus aspect Moon in 6th house',
    description: 'Beautifying foods are your best medicine today. Incorporate foods rich in antioxidants and healthy fats to give your skin a glow. Fresh berries, rose water infused beverages, avocados, and raw almonds are highly recommended. Avoid refined sugars, which will immediately cause breakouts or inflammation.',
  },
  {
    name: 'Mercury in 8th (Dispositor)',
    description: 'Deep physical and mental detoxification is favored. Focus on highly alkaline, green foods. Celery juice, spirulina smoothies, and bitter green salads will purify the blood and sharpen your psychic awareness, allowing you to easily process complex psychological truths.',
  },
  {
    name: 'Moon Transits the 3rd House',
    description: "Nervous, active energy demands quick but healthy, crunchy snacks. Keep raw carrots, apple slices, pumpkin seeds, and walnuts on hand. These provide the satisfying crunch needed to dissipate restless energy while fueling your spontaneous trips and active communications.",
  },
  {
    name: 'Venus Transits the 1st House',
    description: 'You crave aesthetic beauty in your meals. Aromatic and visually stunning foods enhance your personal glow. Saffron-infused rice, vibrant strawberry salads, and dishes spiced with cardamom and vanilla are recommended. Food must look as beautiful as it tastes to truly satisfy you today.',
  },
  {
    name: 'Moon Transits the 4th House',
    description: 'Emotional comfort is paramount during this transit, making it an ideal time to nourish the soul with deeply grounding, nostalgic meals. A hearty bowl of beef noodles followed by a soothing beancurd dessert provides the perfect energetic anchor, bringing a sense of peace, security, and bodily warmth to the home.',
  },
  {
    name: 'Mars aspect Moon in 6th house',
    description: 'Workplace stress creates a fiery, acidic environment in your gut. You must eat highly cooling foods to extinguish this Pitta imbalance. Aloe vera juice, coconut milk, fresh cilantro, and sweet fruits are essential. Strictly avoid coffee, alcohol, and spicy peppers today.',
  },
  {
    name: 'Uranus conjunct Venus',
    description: 'Sudden cravings for exotic, unusual, or highly stimulating foods will strike. Satisfy this with tropical or unique ingredients like dragonfruit, starfruit, or fusion cuisine. Avoid impulsively bingeing on extreme junk food; instead, let your palate experience a sudden, exciting culinary adventure.',
  },
  {
    name: 'Mars in 8th (Dispositor)',
    description: 'Your intense psychological digging requires deep, blood-building nutrition. Incorporate dark, iron-rich foods like beetroot juice, pomegranates, spinach, and (if non-vegetarian) high-quality liver or red meat. This provides the physical fortitude needed to sustain your profound internal research.',
  },
  {
    name: 'Moon Transits the 5th House',
    description: 'The desire for fun and entertainment translates to a craving for festive, colorful foods. Vibrant mango salsas, fresh pineapple, and colorful, varied tapas are perfect. Keep meals playful but light to prevent sluggishness from ruining your creative and romantic energy.',
  },
  {
    name: 'Mars Transits the 12th House',
    description: 'Hidden stresses and poor sleep are exhausting your adrenal glands. You must rely on deeply restorative, adaptogenic foods. Ashwagandha powder in warm milk, thick bone broths, and cooked root vegetables are vital. Strictly avoid caffeine and dry, crunchy foods which will further aggravate your anxiety.',
  },
  {
    name: 'Mercury aspect Jupiter in 5th house',
    description: 'Your brain is absorbing immense amounts of information and needs sustained fuel. Complex carbohydrates are your best friend. Brown rice, sweet potatoes, and oatmeal will provide a steady stream of glucose to the brain, enhancing your creative writing and technological pursuits.',
  },
  {
    name: 'Sun aspect Moon in 6th house',
    description: 'This is the perfect day to adopt a deeply immune-boosting, cleansing diet. Incorporate fresh ginger, garlic, turmeric, and abundant citrus fruits into your meals. A large, vibrant salad for lunch will permanently shift your everyday habits toward lasting vitality.',
  },
  {
    name: 'Sun Transits the 1st House',
    description: 'Your vitality is surging, requiring heating, energizing foods to fuel your new exercise program. High-quality lean proteins, lentils spiced with cinnamon and ginger, and fresh citrus juices will support muscle growth and your renewed sense of purpose.',
  },
  {
    name: 'Mercury Transits the 12th House',
    description: 'Overactive thoughts and psychic sensitivity require deeply calming nervines. Warm almond milk, soaked chia seeds, and chamomile tea will soothe the mind. Avoid heavy, hard-to-digest meats in the evening, as they will disrupt your dreams and block mental telepathy.',
  },
  {
    name: 'Ketu aspect Sun in the 9th house',
    description: 'Your physical digestion is weakened as energy pulls inward toward spiritual matters. Fasting, or a very simple diet of plain rice and steamed zucchini, is highly recommended. Avoid heavy, complex meals, as your body currently lacks the vital fire (Agni) to process them.',
  },
  {
    name: 'Venus Aspecting Ascendant (ASC)',
    description: "Your glowing appearance requires foods rich in healthy fats and vitamin E. Avocados, olive oil, dark chocolate, and fresh berries will enhance your natural sociability and charm. Avoid refined sugars, which will instantly dull your radiant complexion.",
  },
  {
    name: 'Jupiter in 5th (Dispositor)',
    description: 'A period of creative and physical abundance. Nourish this prosperous energy with high-quality, sweet, and grounding foods. Dates, pure ghee, sweet almonds, and rich pumpkin dishes will support your manifesting power without causing stagnation.',
  },
  {
    name: 'Moon Transits the 6th House',
    description: 'Your digestion is incredibly weak and highly susceptible to stomach upsets due to workplace uncertainty. Rely exclusively on medicinal, easy-to-digest foods. Fennel tea, warm ginger water, and simple, pureed vegetable soups will provide comfort and prevent illness.',
  },
  {
    name: 'Moon Transits the 7th House',
    description: 'Seek harmony and balance on your plate. Sharing a light, beautifully arranged Mediterranean salad with olives, feta, and fresh greens is ideal. Avoid heavy, unpredictable foods like deep-fried dishes, which will mirror the chaotic and vacillating energy in your partnerships.',
  },
  {
    name: 'Saturn aspect Sun in 9th house',
    description: 'Vitality is suppressed, requiring slow, sustained nourishment. Thick, slow-cooked root vegetable stews, black beans, and warm grains are necessary to combat the cold, restrictive energy of this transit. Avoid raw salads, which will make you feel colder and more depleted.',
  },
  {
    name: 'Venus Transits the 2nd House',
    description: 'You crave the finest, most luxurious ingredients. Indulge intelligently with high-quality pure honey, fine cheeses, and saffron-infused dishes. As the 2nd house rules the face, foods rich in collagen and vitamin C, like citrus and bone broth, will beautifully adorn your appearance.',
  },
  {
    name: 'Venus aspect Venus in 8th house',
    description: 'Deep sensual longing requires rich, intense, and romantic foods. Raw cacao, fresh figs, strawberries, and a touch of red wine (if tolerated) will satisfy the passionate yearning of the heart. Share these luxurious, dark foods to deepen your intimate connections.',
  },
  {
    name: 'Sun Aspecting Ascendant (ASC)',
    description: "Your digestive fire is blazing, allowing you to process heavy, vital foods efficiently. Consume high-quality complex carbs and lean proteins, like grilled chicken with quinoa or a hearty lentil loaf, to fuel your new projects and maintain your strong personal impression.",
  },
  {
    name: 'Mercury Aspecting Ascendant (ASC)',
    description: "Mental energy is high, but can become scattered. Fuel your brain with omega-3 rich foods like walnuts, flaxseeds, and light fish. Sip green tea instead of coffee to maintain steady focus for networking without jittery anxiety.",
  },
  {
    name: 'Venus aspect Mercury in 8th house',
    description: 'Elegant, light, and beautiful meals support your heartfelt conversations. Steamed asparagus, fresh berries, and delicately seasoned fish or tofu are ideal. The food should not sit heavily in the stomach, allowing your mind and heart to remain open for intimate connection.',
  },
  {
    name: 'Venus aspect Mars in 8th house',
    description: 'A craving for intense, stimulating flavors arises. Sweet and spicy combinations, like chili-infused dark chocolate or ginger-spiced fruit compote, will satisfy your awakened sensuality. Be mindful of portion sizes, as your appetite is aggressive and impulsive.',
  },
  {
    name: 'Mars aspect Venus in 8th house',
    description: 'High energy and seductive sensuality demand robust, stimulating, but refined foods. Lean proteins spiced with black pepper and cardamom, along with dark, iron-rich greens, will fuel your charismatic attraction without leaving you feeling heavy or lethargic.',
  },
  {
    name: 'Venus Transits the 3rd House',
    description: 'You find joy in sweet snacks and beautiful baked goods. Baking a delicate fruit tart or enjoying high-quality pastries with siblings brings happiness. Keep portions small and focus on the artistic presentation and the cheerful conversations accompanying the food.',
  },
  {
    name: 'Mercury Transits the 2nd House',
    description: 'Your mind is focused on intake, making crunchy, intellectual foods appealing. Keep celery sticks, mixed nuts, and roasted seeds on hand while planning your finances. These foods provide the satisfying crunch your active mind needs while maintaining a clear perspective.',
  },
  {
    name: 'Sun Transits the 2nd House',
    description: 'A robust appetite demands hearty, warm meals. Roasted root vegetables, wholesome breads, and high-quality proteins are favored. However, avoid overly acidic or spicy foods (like tomatoes or heavy chilies), as they can easily cause digestive upsets during this intense focus on intake.',
  },
  {
    name: 'Mercury Transits the 1st House',
    description: 'Your varied interests crave a diverse, tapas-style diet. Small, frequent meals consisting of mixed nuts, fresh berries, and light salads are ideal. Trying new recipes or taking a healthy cooking class perfectly aligns with your current desire for fun, learning, and adventure.',
  },
  {
    name: 'Mars Transits the 1st House',
    description: 'Explosive energy requires heating, highly stimulating foods. Cayenne pepper, garlic, and high-protein meals will fuel your ambition and drive. However, drink plenty of cooling coconut water to balance this intense heat and prevent headaches or inflammation.',
  },
  {
    name: 'Mars aspect Ketu in 3rd house',
    description: 'Chaotic, frustrating energy disrupts your routine. Ground yourself immediately with warm, heavily cooked, earthy foods. A warm sweet potato mash or a thick, grounding porridge will calm your agitated mind and settle your accident-prone, impulsive nature.',
  },
  {
    name: 'Mercury aspect Venus in 8th house',
    description: 'You appreciate aesthetically pleasing, meticulously prepared meals. Colorful, symmetrical fruit bowls or elegantly plated sushi are highly recommended. The visual beauty of the food will bring a deep sense of contentment and soothe your intimate reflections.',
  },
  {
    name: 'Sun aspect Venus in 8th house',
    description: "Deep, compulsive emotions require warming, luxurious, but healthy comfort foods. Baked apples with cinnamon and nutmeg, or a warm bowl of oatmeal with a drizzle of honey, will help soothe the sting of old memories without triggering codependent binge-eating.",
  },
  {
    name: 'Mercury aspect Mercury in 8th house',
    description: 'Deep research requires pure, detoxifying hydration. Focus on dandelion root tea, clear green juices, and celery. These sharp, clean flavors will clear mental fog and allow your intuitive hunches to break through the overwhelming flood of information.',
  },
  {
    name: 'Venus aspect Sun in 9th house',
    description: 'Your palate desires exotic, imported, and sun-drenched foods. Fine olive oils, fresh olives, pomegranates, and Mediterranean dishes are highly favored. These luxurious, worldly foods will inspire your love of learning and transport you to the beautiful places you dream of.',
  },
  {
    name: 'Mars Aspecting Ascendant (ASC)',
    description: "You require dense, high-performance fuel to support your bold moves. Lean steaks, heavy lentil stews, and generous portions of spinach will provide the iron and protein needed to maintain your determination without burning out.",
  },
  {
    name: 'Venus aspect Rahu in 9th house',
    description: 'Beware of the temptation to overindulge in artificially flavored or overly processed "luxury" resort foods. Stick to genuinely rich, natural, earth-grown foods like avocados, pure coconuts, and high-quality olive oil to truly nourish yourself during your travels.',
  },
  {
    name: 'Venus aspect Ketu in 3rd house',
    description: 'A spiritual detachment from heavy, rich foods occurs. Honor this by eating very simple, unadorned meals. Plain white rice, steamed zucchini, and mild broths will support your creative talents and chance meetings without burdening your physical body.',
  },
  {
    name: 'Mercury aspect Mars in 8th house',
    description: "Your sharp, investigative mind needs clean, alkaline foods. Lemon water, bitter melon, and dark, leafy greens will cool the mental friction and keep your inner voice clear. Avoid acidic, fried foods that will cause your philosophical tangents to become irritable rants.",
  },
  {
    name: 'Mercury Transits the 3rd House',
    description: 'You are moving quickly and need portable, high-energy snacks. Almonds, pumpkin seeds, and fresh, crisp apples are perfect for your short trips and busy schedule. Chewing these crisp foods helps process the rapid influx of new ideas and information.',
  },
  {
    name: 'Mars aspect Mercury in 8th house',
    description: "Intense mental analysis creates acidity. Avoid coffee and highly spiced foods. Instead, focus on highly alkaline, cooling vegetables like cucumbers, celery, and steamed green beans to keep your stomach calm while your mind digs deep for hidden answers.",
  },
  {
    name: 'Jupiter Transits the 4th House',
    description: 'The home is a place of absolute abundance. Plentiful, expansive, and deeply comforting foods are favored. Creamy pumpkin soups, warm freshly baked breads, and generous uses of pure ghee will bring immense gratification and happiness to your family gatherings.',
  },
  {
    name: 'Jupiter aspect Venus in 8th house',
    description: 'A tendency to indulge in rich, sweet, and heavy foods accompanies financial windfalls. While celebrating is encouraged, favor naturally luxurious foods like dates, high-quality dark chocolate, and raw honey to enjoy the sweetness of life without overwhelming your digestion.',
  },
  {
    name: 'Sun aspect Mercury in 8th house',
    description: 'Your inner search for meaning requires clear, mental-clarity foods. Fresh blueberries, rosemary-infused dishes, and light, flaky fish or chia seeds will provide the omega-3s and antioxidants necessary to support your deep psychological and metaphysical studies.',
  },
  {
    name: 'Mercury aspect Sun in 9th house',
    description: 'Sun-cooked and positive-vibration foods are ideal. Dried fruits like apricots, sun-dried tomatoes, and warm, golden grains will uplift your outlook and physically support the inspiring conversations and connections you are making today.',
  },
  {
    name: 'Mercury aspect Ketu in 3rd house',
    description: 'Hectic travel and confusion lead to scattered eating. Ground yourself strictly with heavy, earthy foods. Root vegetable stews, potatoes, and warm oat bowls will anchor your nervous system. Avoid caffeine entirely, as it will only exacerbate the miscommunications.',
  },
  {
    name: 'Mercury aspect Rahu in 9th house',
    description: 'You are susceptible to unusual or bizarre food fads. Ignore artificial additives and highly processed "miracle" foods. Stick firmly to clean, whole, earth-grown vegetables and grains to keep your mind clear while exploring unconventional ideas.',
  },
  {
    name: 'Venus Transits the 4th House',
    description: 'You crave sweet, home-baked comfort foods. Spending time baking breads, sweet fruit pies, or making creamy, rich soups will bring emotional peace and beautify the home. Enjoy these luxurious comforts to deeply relax and soothe your soul.',
  },
  {
    name: 'Sun aspect Mars in 8th house',
    description: 'Subtle, repressed anger makes your internal environment highly acidic and Pitta-dominant. You must consume intensely cooling, soothing foods. Fresh coconut meat, cilantro, mint teas, and cucumber salads are vital to calm the inflammatory response and aid your psychological healing.',
  },
  {
    name: 'Venus Aspecting Midheaven (MC)',
    description: 'Impressive, high-end foods are favored for networking. Opt for fine dining, but make smart, elegant choices like grilled asparagus, high-quality sushi, or dishes flavored with delicate truffles and saffron to advance your career while staying physically grounded.',
  },
  {
    name: 'Saturn in 10th (Dispositor)',
    description: 'Dissatisfaction and exhaustion at work demand traditional, slow-cooked, and preserving foods. Pickled vegetables, heavy root stews, and bone broths require little daily effort but provide the deep, sustained nourishment your tired body desperately needs right now.',
  },
  {
    name: 'Jupiter Aspecting Midheaven (MC)',
    description: 'Career growth brings celebratory feasts. Rich sauces and large portions are tempting. Enjoy the abundance, but balance the rich, heavy celebratory foods with digestive spices like cumin and fennel to ensure these opportunities don’t physically weigh you down.',
  },
  {
    name: 'Sun Transits the 3rd House',
    description: 'Quick, active solar energy is high. Fuel your short travels and ambitious projects with quick-digesting, vibrant fruits. Fresh oranges, grapefruits, and light, protein-rich snacks will provide the immediate stamina you need without slowing you down.',
  },
  {
    name: 'Mars aspect Mars in 8th house',
    description: 'Your passionate quest requires intense, blood-building foods to sustain your tenacity. Dark berries, beetroot, red lentils, and dark leafy greens will provide the formidable physical energy necessary to relentlessly explore the deep meaning of human nature.',
  },
  {
    name: 'Venus aspect Saturn in 10th house',
    description: 'Increased responsibility requires austere but high-quality nourishment. A small piece of dark chocolate or dishes made with black sesame and high-quality olive oil will provide a necessary touch of luxury while maintaining the strict discipline needed for future success.',
  },
  {
    name: 'Sun Transits the 12th House',
    description: 'Your digestive system needs profound rest. A strict liquid diet or very light eating is prescribed. Clear vegetable broths, hot water with lemon, and herbal teas will facilitate the closure of old projects and help release the deep emotional worries keeping you awake.',
  },
  {
    name: 'Mercury aspects the Moon in the 6th house',
    description: 'Your mind and gut are deeply connected today. Focus on gut-friendly, communicative foods like kefir, kombucha, and light, easy-to-digest soups. This is the absolute best day to devise a highly effective, personalized diet plan that your sensitive stomach will love.',
  },
  {
    name: 'Sun Transits the 2nd House',
    description: 'Your focus is on hearty, substantial intake. Roasted root vegetables, dense wholesome breads, and high-quality proteins are favored. Avoid overly acidic or spicy foods to prevent unexpected digestive upsets and stomach issues while your appetite is this robust.',
  },
  {
    name: 'Sun Transits the 3rd House',
    description: 'Quick, active solar energy is high. Fuel your short travels and ambitious projects with quick-digesting, vibrant fruits. Fresh oranges, grapefruits, and light, protein-rich snacks will provide the immediate stamina you need without slowing you down.',
  },
  {
    name: 'Mars Transits the 2nd House',
    description: 'Impulsive energy leads to eating too quickly, which will severely upset your digestion. Focus on high-protein, slightly spicy, warm foods, but you must force yourself to sit down and chew slowly. Avoid cold drinks, which will clash violently with your heated digestive fire.',
  },
  {
    name: 'Mercury Transits the 4th House',
    description: 'Comforting, conversational foods are needed for family gatherings. Warm chamomile or ginger teas, light home-cooked casseroles, and nostalgic family recipes will facilitate the educational and historical conversations happening in your home.',
  },
  {
    name: 'Pluto conjunct Saturn',
    description: 'An extreme transit demanding absolute dietary control. You must eliminate all toxic, heavy, or processed foods. Embrace a highly structured, clean diet consisting of raw vegetables, steamed greens, and pure water to handle the incredible physical burdens and responsibilities placed upon you.',
  },
  {
    name: 'Sun aspects Sun in 9th house',
    description: 'Your vitality demands highly sattvic, fresh, and life-affirming foods. Organic, fresh-picked fruits, vibrant salads, and pure grains will invigorate your trust in your beliefs and provide the high-vibration energy needed for exotic travel and philosophical study.',
  },
  {
    name: 'Sun aspect Ketu in the 3rd house',
    description: 'A sudden setback suppresses your appetite. Do not force heavy meals. A very light, fasting-mimicking diet of simple clear broths and warm water will allow your body to gently process the humiliation and learn the spiritual lesson without taxing your physical strength.',
  },
  {
    name: 'Sun aspect Rahu in 9th house',
    description: 'Disillusionment can lead to erratic eating. Avoid highly processed or fake "health" foods. Ground your confusing thoughts with deeply rooted vegetables like potatoes, carrots, and turnips. Earth-grown foods are the only way to stabilize your mind during this crisis of faith.',
  },
  {
    name: 'Venus Transits the 5th House',
    description: 'The desire for sweet, playful, and elegant foods is at a peak. Berries, fine chocolates, delicate pastries, and vibrant, artistic salads will fulfill your desire to break out of reality. Share these beautiful, romantic foods to open your heart to new love.',
  },
  {
    name: 'Mars aspect Sun in 9th house',
    description: 'Your adventurous spirit needs heating, energetic foods. Meals heavily spiced with ginger, garlic, and black pepper, along with high-quality proteins, will fuel your spontaneous trips. Be mindful to eat in a calm environment to prevent family discord from causing indigestion.',
  },
  {
    name: 'Mars aspect Rahu in 9th house',
    description: 'Unexpected travel disrupts your routine, making you vulnerable to toxic junk food. You must pack structured, home-cooked, grounding snacks like roasted nuts and hard-boiled eggs. Avoid all artificial fast foods, which will only increase your confusion and disappointment.',
  },
  {
    name: 'Jupiter aspect Saturn in 10th house',
    description: 'Hard work pays off, and your diet should reflect this stability. Traditional, hearty, and structured meals like roasted root vegetables, heavy whole-grain breads, and slow-cooked stews will ground your success and provide the sustained energy for your new career expansion.',
  },
  {
    name: 'Sun Transits the 4th House',
    description: 'The kitchen is your sanctuary. Hearty, comforting, family-style meals like warm casseroles, thick vegetable soups, and freshly baked breads will bring immense warmth and happiness. Focus on nourishing your family with these secure, heavily grounding foods.',
  },
  {
    name: 'Sun Aspecting Midheaven (MC)',
    description: 'Your public image requires power foods. Clean, high-protein meals like lean grilled chicken, lentils, and vibrant, steamed vegetables will give you the commanding vitality and sharp focus needed to take on leadership roles and achieve your professional goals.',
  },
  {
    name: 'Venus aspect Jupiter in 5th house',
    description: 'Creativity and romance demand decadent, rich foods. Creamy desserts, rich cheeses, and luxurious sauces are incredibly tempting now. Enjoy this culinary abundance, but use strict moderation to prevent these heavy, sweet foods from overwhelming your physical system.',
  },
  {
    name: 'Sun aspect Saturn in 10th house',
    description: 'Career pressure slows your metabolism to a crawl. You must eat slow-cooked, easily digestible, warm foods. Bone broths, well-cooked stews, and soft, warm grains will nourish your depleted energy without requiring your stressed body to work hard at digestion.',
  },
  {
    name: 'Venus Transits the 6th House',
    description: 'Workplace romance and health routines are favored. Beautiful, healthy salads topped with edible flowers, colorful chopped vegetables, and light, aesthetic meals will improve your health. You must strictly avoid relying on office sweets to maintain your creative genius.',
  },
  {
    name: 'Mars Transits the 3rd House',
    description: 'Fierce ambition and strenuous exercise require quick, high-energy fuel. Protein bars, handfuls of nuts, seeds, and lean meats will support your competitive drive. Ensure you are getting enough dense calories to fuel your athletic output and short, profitable travels.',
  },
  {
    name: 'Mars Aspecting Midheaven (MC)',
    description: 'Heightened ambition requires high-performance fuel. Clean proteins, complex carbohydrates like brown rice, and iron-rich greens will give you the decisive energy needed for career action. Avoid heavy, greasy meals that will cause lethargy and make you irritable with colleagues.',
  },
  {
    name: 'Mercury Aspecting Midheaven (MC)',
    description: 'Professional communication demands premium brain fuel. Walnuts, green tea, fresh blueberries, and light fish or flaxseeds will keep your mind sharp and your words clear. Avoid heavy lunches that draw blood away from the brain and dull your public image.',
  },
  {
    name: 'Mercury aspect Saturn in 10th house',
    description: 'Business standstills create knotty anxiety in the gut. Simplify your diet immensely. Grounding, slow-to-digest complex carbohydrates like warm oatmeal or plain rice with ghee will lubricate your digestive tract and provide steady, calming energy amidst the bureaucratic restrictions.',
  },
  {
    name: 'Sun Transits the 5th House',
    description: 'Your expanded consciousness craves festive, sun-drenched foods. Sweet mangoes, bright citrus fruits, and vibrant, varied salads will fuel your flashes of insight. Enjoy beautiful, artistic meals before heading out to the theater or a romantic date.',
  },
  {
    name: 'Mars aspect Saturn in 10th house',
    description: 'Government or boss-related setbacks create intense, acidic frustration. You must actively cool your system to balance this heat. Consuming cucumber, coconut water, and mild, alkaline green vegetables will extinguish the internal fire and prevent stress-induced ulcers.',
  },
  {
    name: 'Mercury Transits the 5th House',
    description: 'A playful, active mind desires fun, varied, tapas-style eating. Small, colorful bites, fresh fruit skewers, and mixed nuts will satisfy your need to graze while you write, teach, or brainstorm incredible new ideas with children.',
  },
  {
    name: 'Jupiter aspect Mercury in 8th house',
    description: 'Deep study into human nature pairs well with complex, layered flavors. Rich, spiced curries, heavily seasoned roasted vegetables, and foods that take time to prepare and digest will ground your intense financial planning and psychological investigations.',
  },
  {
    name: 'Venus Transits the 7th House',
    description: 'Intimate affairs require shared, romantic meals. Fondue, beautifully arranged shared platters, and sweet treats like strawberries and dark chocolate will attract admirers and deepen your connections. Let the aesthetic beauty of the food speak your love.',
  },
  {
    name: 'Saturn aspect Rahu in 9th house',
    description: 'Karmic healing requires incredibly strict, disciplined eating. You must abide by restrictive dietary laws right now to heal. Completely avoid all artificial, processed, or unnatural foods. A highly regimented diet of simple, whole grains and steamed vegetables is necessary for your growth.',
  },
  {
    name: 'Mercury Transits the 6th House',
    description: 'Nerves are weakening your immune system. You need highly medicinal, gut-healing, probiotic-rich foods. Fermented vegetables, ginger tea, and light, communicative foods like clear broths will soothe the gut-brain axis and protect your breathing and respiratory health.',
  },
  {
    name: 'Sun aspect Jupiter in the 5th house',
    description: 'Optimism and expanded awareness crave large, joyful meals. Rich, golden grains, roasted sweet potatoes, and generous uses of high-quality ghee will fuel your financial visions and open your heart to romance. Enjoy the abundance, but be mindful of portion control.',
  },
  {
    name: 'Sun Transits the 6th House',
    description: 'Health concerns are your top priority. This is the optimal time for a strict, detoxifying, clean-eating regimen. Bitter greens, hot lemon water, and exceptionally clean, lean proteins will build your stamina and help you successfully eradicate bad habits from your stressful daily routine.',
  },
  {
    name: 'Mars Transits the 4th House',
    description: 'Domestic disturbances create a fiery, volatile environment. You must strictly avoid spicy foods, which will only aggravate the anger in the home. Choose highly cooling, soothing meals like cucumber raita, mild squash, and sweet melons to pacify the emotional and physical heat.',
  },
  {
    name: 'Mercury Transits the 7th House',
    description: 'Future planning with partners requires light, conversational foods. Small plates, tapas, and easily digestible, humorous foods like playful appetizers will keep your mind sharp and open-minded, allowing laughter and fresh perspectives to heal any stalemates.',
  },
  {
    name: 'Sun Transits the 7th House',
    description: 'Dealing with demanding partners requires balanced, high-quality, and elegant meals. Do not let others control your diet. Maintain your strength by eating pure, vitalizing foods like fresh salads and lean proteins, refusing to indulge in the heavy, draining foods others might push on you.',
  },
  {
    name: 'Jupiter Transits the 5th House',
    description: 'Expansive business and entertainment opportunities lead to a diet of rich, celebratory foods. High-quality fats, extravagant desserts, and rich sauces are a constant temptation. Enjoy the blessings and cutting-edge ideas, but apply strict portion control to avoid rapid weight gain.',
  },
  {
    name: 'Mars Transits the 5th House',
    description: 'A competitive, sporting drive demands high-protein, energetic foods. Grilled vegetables, lean meats, and spicy, stimulating snacks will fuel your passionate romance and athletic pursuits. Avoid heavy, greasy bar foods that will slow your fun, competitive spirit.',
  },
  {
    name: 'Sun Transits the 8th House',
    description: 'Life force is critically low. You must eat the most easily digestible, warm foods possible to avoid illness. A simple kitchari of mung dal and rice, or mild vegetable broths, is essential. Avoid all heavy meats, cold raw foods, and heavy sweets to prevent severe lethargy and depression.',
  },
  {
    name: 'Rahu Transits the 10th House',
    description: 'Career transitions and unsettled feelings create highly erratic, toxic eating patterns. You must combat this wandering energy with intensely grounding foods. Roasted sweet potatoes, heavy root vegetables, and thick stews will anchor your soul and protect your physical security amidst the chaos.',
  },
  {
    name: 'Ketu Transits the 4th House',
    description: 'An empty feeling in the heart leads to a detachment from food. You may forget to eat entirely. You must consciously consume simple, ascetic, but grounding foods. Plain rice, light warm broths, and mild root vegetables will provide the necessary anchor for your wandering, unsettled soul.',
  },
  {
    name: 'Mercury Transits the 8th House',
    description: 'Vast research into hidden problems requires deep-hued, antioxidant-rich foods to fuel the brain. Blackberries, dark leafy greens, and strong, clear teas will sharpen your mind. Keep your meals light so your energy can remain focused on resolving these past issues.',
  },
  {
    name: 'Ketu aspect Mars in 8th house',
    description: 'Repressed anger surfacing requires intensely cooling, purifying foods to aid your psychological release. Fresh cilantro, aloe vera juice, and cooling cucumber salads will soothe the internal burn and support the final healing and elimination processes of the physical body.',
  },
  {
    name: 'Rahu aspect Moon in the 6th house',
    description: 'Your digestion is severely compromised by unpredictable stomach issues. You must eat strictly organic, natural, and highly pure foods to heal the gut. Completely avoid all artificial ingredients, fake foods, and complex, heavily processed meals, which will cause immediate upset.',
  },
  {
    name: 'Sun Transits the 9th House',
    description: 'Renewed spiritual optimism favors a highly sattvic, pure diet. Fresh, sun-ripened fruits, raw nuts, and pure, whole grains will invigorate your trust in your beliefs. Avoid all heavy, tamasic foods (like old leftovers or heavy meats) to maintain this high-vibration, peaceful energy.',
  },
  {
    name: 'Mercury Transits the 9th House',
    description: 'Learning new, progressive information requires complex, brain-stimulating foods. Dishes flavored with fresh rosemary, walnuts, and omega-rich foods will keep your mind open and adaptable. Embrace foreign or unfamiliar healthy dishes to align with your new wave of learning.',
  },
  {
    name: 'Venus Transits the 8th House',
    description: 'Disappointment and suspicion lead to a craving for rich, intense, and sensual foods for comfort. Dark chocolate, fresh figs, and pomegranates will satisfy the emotional void. Be highly cautious of binge eating rich, heavy sweets in secret to mask your fear of betrayal.',
  },
  {
    name: 'Mercury Transits the 10th House',
    description: 'Business conferences require quick, efficient, and brain-boosting lunches. Light, crisp salads with a clean vinaigrette, and lean proteins will keep your lines of communication open and adaptable. Avoid heavy pastas or breads that will cause a mid-meeting mental crash.',
  },
  {
    name: 'Sun Transits the 10th House',
    description: 'Rising star energy demands high-quality, powerful, and vital foods to match your peak self-confidence. Lean, high-quality meats (or dense lentils), vibrant steamed vegetables, and clean, energizing citrus will physically project the authority and success you are experiencing in your career.',
  },
  {
    name: 'Jupiter aspect Mars in 8th house',
    description: 'Deep psychological research and scientific discoveries demand high-energy, expansive meals. Rich, spiced stews, complex curries, and generous portions of high-quality proteins will fuel your profound reflections. Ensure the rich foods are balanced with digestive spices.',
  },
  {
    name: 'Moon Aspecting Midheaven (MC)',
    description: 'Your emotional sensitivity at work requires comforting but professional fuel. Warm, structured grain bowls with roasted vegetables and a mild tahini dressing will provide emotional soothing without compromising your professional energy or causing a sluggish afternoon crash.',
  },
  {
    name: 'Mercury Transits the 11th House',
    description: 'Connecting with progressive groups involves social, shareable foods. Opt for healthy party platters, light fruit snacks, and crisp, fresh vegetables with hummus. These light foods facilitate excessive talking and the sharing of optimistic, hopeful ideas for the future.',
  },
  {
    name: 'Moon Aspecting Ascendant (ASC)',
    description: 'Introspection and emotional sensitivity make you prone to water retention. Focus entirely on hydrating, soothing foods. Cucumber water, fresh melons, and light, clear soups will protect your fluctuating moods and prevent emotional heaviness from affecting your physical health.',
  },
  {
    name: 'Venus Transits the 9th House',
    description: 'A new life direction opens your palate to exotic, foreign, and beautiful foods. Imported fruits, delicate foreign pastries, and culturally rich, flavorful dishes will dissolve your usual fears and align your physical body with this new, magical, and adventurous life.',
  },
  {
    name: 'Sun Transits the 11th House',
    description: 'Broadening social circles with powerful people involves high-quality, impressive social foods. Fine dining, elegant appetizers, and high-end, vitalizing meals are favored. Keep your choices clean and protein-rich to maintain your energetic presence among these influential authority figures.',
  },
  {
    name: 'Venus Transits the 10th House',
    description: 'Fresh business ventures require elegant, aesthetically pleasing business lunches. High-quality sushi, vibrant, colorful salads, and beautifully designed, artistic meals will promote your positive perspective and honor the women driving force in your creative workplace.',
  },
  {
    name: 'Jupiter Aspecting Midheaven (MC) : Ends',
    description: 'As this expansive career influence fades, taper off heavy, rich celebratory meals. Return to optimizing your daily fuel with complex carbohydrates like sweet potatoes to maintain stamina for your daily walks.',
  },
  {
    name: 'Jupiter aspect Jupiter in 5th house : Exact',
    description: 'The peak of this prosperous transit demands naturally sweet, sattvic foods. Incorporate pure ghee, dates, and rich pumpkin dishes to nourish your creative and spiritual pursuits without causing sluggishness.',
  },
  {
    name: 'Jupiter aspect Mars in 8th house : Ends',
    description: 'As the metabolic fire cools, transition away from heavy proteins. Opt for lighter, turmeric-spiced mung dal to gently detoxify the liver and maintain balanced energy for your daily activities.',
  },
  {
    name: 'Jupiter aspect Mars in 8th house : Exact',
    description: 'Your physical vitality is at its zenith. Consume robust, protein-dense meals like grilled chicken or chickpeas seasoned with ginger to perfectly optimize your energy for intense badminton sessions.',
  },
  {
    name: 'Jupiter aspect Mars in 8th house : Starts',
    description: 'Begin introducing blood-building, energetic foods. Spiced lentils and warming curries will stoke your digestive fire and prepare your body for a highly active phase.',
  },
  {
    name: 'Jupiter aspect Moon in 6th house : Ends',
    description: 'As emotional sensitivity in the gut subsides, you can slowly reintroduce more complex meals. Continue to favor mild, expansive foods like roasted squash to maintain balance.',
  },
  {
    name: 'Jupiter aspect Moon in 6th house : Exact',
    description: 'Your stomach is highly receptive but sensitive. A warm, soothing bowl of spiced oatmeal or a traditional kitchari provides the necessary, easily digestible fuel without slowing down your active routine.',
  },
  {
    name: 'Jupiter aspect Moon in 6th house : Starts',
    description: 'Anticipate incoming digestive sensitivity by preparing calming, sattvic meals. Begin incorporating more warm almond milk and fennel tea to soothe the gut lining.',
  },
  {
    name: 'Jupiter aspect Venus in 8th house : Ends',
    description: 'The craving for intense sweets and luxurious dining is passing. Gently return to a cleaner diet by substituting heavy desserts with fresh berries and dark chocolate.',
  },
  {
    name: 'Jupiter aspect Venus in 8th house : Starts',
    description: 'A powerful desire for rich, sensual foods is emerging. Indulge intelligently by stocking up on high-quality figs, raw honey, and healthy fats before the cravings peak.',
  },
  {
    name: 'Ketu aspect Mars in 8th house : Exact',
    description: 'Subconscious heat requires intensely cooling and purifying foods. Fresh cilantro, aloe vera juice, and cucumber salads are vital to soothe internal inflammation and support psychological release.',
  },
  {
    name: 'Ketu aspect Sun in 9th house : Exact',
    description: 'Your vital energy pulls inward toward spiritual matters. Honor this by eating a very simple, ascetic diet of plain rice and steamed zucchini to align with your deepest tarot and astrological reflections.',
  },
  {
    name: 'Mars Aspecting Midheaven (MC) : Ends',
    description: 'As professional pressures ease, you no longer need such dense, aggressive fuel. Shift from heavy proteins to lighter, alkaline greens to cool the digestive tract and relax the mind.',
  },
  {
    name: 'Mars Aspecting Midheaven (MC) : Exact',
    description: 'Heightened ambition requires high-performance fuel. Clean proteins and iron-rich greens give you the decisive energy needed, Jack, to optimize your architectural workflows and leadership tasks.',
  },
  {
    name: 'Mars Aspecting Midheaven (MC) : Starts',
    description: 'Prepare for a surge in career demands by increasing your intake of sustained energy sources. Lean meats and complex carbohydrates like brown rice will build the necessary stamina.',
  },
  {
    name: 'Mars aspect Mars in 8th house : Exact',
    description: 'Your competitive drive is absolute. Fuel your most intense badminton matches with high-protein, blood-building foods like red lentils spiced with black pepper.',
  },
  {
    name: 'Mars aspect Mars in 8th house : Starts',
    description: 'Your internal fire is building rapidly. Start integrating heating, energetic foods like garlic and cayenne into your meals to match your rising physical ambition.',
  },
  {
    name: 'Mars aspect Mercury in 8th house : Ends',
    description: 'Mental friction is cooling down. Replace the heavily alkaline diet with balanced, grounding foods like roasted root vegetables to restore your nervous system.',
  },
  {
    name: 'Mars aspect Mercury in 8th house : Exact',
    description: 'Intense mental analysis creates high stomach acidity. Stick to cooling vegetables like celery and steamed green beans to keep your gut calm while you decode complex technical systems.',
  },
  {
    name: 'Mars aspect Mercury in 8th house : Starts',
    description: 'Anticipate mental stress by cutting out coffee and highly spiced foods early. Begin relying on herbal teas and light, crisp greens to maintain a clear, unagitated mind.',
  },
  {
    name: 'Mars aspect Moon in 6th house : Ends',
    description: 'The fiery, acidic environment in your gut is settling. Gradually reintroduce normal spices, but continue to favor cooling coconut water after your walks to work.',
  },
  {
    name: 'Mars aspect Moon in 6th house : Exact',
    description: 'Emotional stress creates severe heat in the stomach. You must eat highly cooling foods like aloe vera juice, fresh cilantro, and sweet fruits to extinguish this Pitta imbalance.',
  },
  {
    name: 'Mars aspect Moon in 6th house : Starts',
    description: 'Begin protecting your stomach lining from impending stress. Incorporate more cooling dairy or coconut milk and completely avoid hot peppers and excess salt.',
  },
  {
    name: 'Mars aspect Rahu in 9th house : Ends',
    description: 'The chaotic, impulsive cravings are fading. Ground your system by returning to structured, whole-food meals and entirely abandoning any fast food habits picked up recently.',
  },
  {
    name: 'Mars aspect Rahu in 9th house : Exact',
    description: 'Erratic energy makes you vulnerable to toxic junk food binges. You must enforce strict discipline, packing structured, high-protein snacks to avoid artificial foods while on the go.',
  },
  {
    name: 'Mars aspect Rahu in 9th house : Starts',
    description: 'A wave of unpredictable cravings is approaching. Preempt this by meal-prepping clean, deeply grounding earthy foods to anchor your system before the Vata energy spikes.',
  },
  {
    name: 'Mars aspect Saturn in 10th house : Ends',
    description: 'The intense, acidic frustration at work is passing. Transition from a strict alkaline diet back to warm, moderately spiced stews to gently rebuild your digestive fire.',
  },
  {
    name: 'Mars aspect Saturn in 10th house : Exact',
    description: 'Deep professional friction demands an actively cooling, alkaline diet. Consuming cucumbers and mild green vegetables will extinguish the internal fire and prevent stress-induced inflammation.',
  },
  {
    name: 'Mars aspect Saturn in 10th house : Starts',
    description: 'Prepare for bureaucratic delays by simplifying your diet. Begin removing acidic triggers like alcohol and red meat to keep your physical vessel calm under incoming pressure.',
  },
  {
    name: 'Mars aspect Sun in 9th house : Ends',
    description: 'The intense, fiery energy is dissipating. Move away from heavily spiced foods and return to lighter, sattvic meals to maintain a balanced, peaceful vibration.',
  },
  {
    name: 'Mars aspect Sun in 9th house : Exact',
    description: 'Your adventurous spirit needs heating, energetic foods. Meals heavily spiced with ginger and high-quality proteins will perfectly optimize your energy for spontaneous exploration.',
  },
  {
    name: 'Mars aspect Sun in 9th house : Starts',
    description: 'Begin fueling your rising vitality with warming spices. Introduce more black pepper and garlic to stoke the digestive fire for the active days ahead.',
  },
  {
    name: 'Mars aspect Venus in 8th house : Ends',
    description: 'The aggressive, impulsive appetite for sweets is waning. Gently detoxify the liver with bitter greens and return to a moderate, balanced diet.',
  },
  {
    name: 'Mars aspect Venus in 8th house : Exact',
    description: 'High energy and sensuality demand robust, stimulating foods. Lean proteins spiced with cardamom and dark, iron-rich greens will fuel your charisma without causing sluggishness.',
  },
  {
    name: 'Mars aspect Venus in 8th house : Starts',
    description: 'A craving for intense, sweet-and-spicy flavors is brewing. Satisfy this emerging desire with controlled portions of chili-infused dark chocolate to prevent later bingeing.',
  },
  {
    name: 'Mercury Aspecting Ascendant (ASC) : Exact',
    description: 'Mental energy is high but scattered. Jack, fuel your brain with omega-3 rich walnuts and flaxseeds, and sip green tea to maintain steady focus during your frontend development tasks.',
  },
  {
    name: 'Mercury aspect Jupiter in 5th house : Exact',
    description: 'Your brain is absorbing immense information. Complex carbohydrates like brown rice and sweet potatoes will provide a steady stream of glucose to support your creative programming.',
  },
  {
    name: 'Mercury aspect Jupiter in 5th house : Starts',
    description: 'Start optimizing your diet for heavy mental lifting. Introduce more brain-boosting healthy fats and slow-burning oats to prepare for deep learning phases.',
  },
  {
    name: 'Mercury aspect Ketu in 3rd house : Ends',
    description: 'The scattered, ungrounded energy is lifting. You can move away from heavy root vegetables and reintroduce lighter, crisp foods like apples and raw carrots.',
  },
  {
    name: 'Mercury aspect Ketu in 3rd house : Starts',
    description: 'Anticipate miscommunications and hectic schedules by grounding your diet immediately. Begin relying on warm oat bowls and thick stews to anchor your nervous system.',
  },
  {
    name: 'Mercury aspect Moon in 6th house : Exact',
    description: 'Your mind and gut are deeply linked today. Focus entirely on gut-friendly, communicative foods like kefir and light broths to soothe your highly sensitive enteric nervous system.',
  },
  {
    name: 'Mercury aspect Moon in 6th house : Starts',
    description: 'Begin prepping light, easily digestible meals. Transitioning to simple rice and steamed vegetables now will protect your stomach from incoming mental stress.',
  },
  {
    name: 'Mercury aspect Rahu in 9th house : Ends',
    description: 'The temptation of bizarre dietary fads is passing. Return firmly to traditional, earth-grown whole foods to re-stabilize your physical and mental energy.',
  },
  {
    name: 'Mercury aspect Rahu in 9th house : Starts',
    description: 'You may soon be drawn to extreme nutritional trends. Anchor your diet in simple, whole grains now to prevent chaotic Vata energy from disrupting your digestion.',
  },
  {
    name: 'Mercury aspect Saturn in 10th house : Starts',
    description: 'Prepare for business standstills by simplifying your intake. Begin eating grounding, slow-to-digest complex carbohydrates like warm oatmeal to lubricate the digestive tract.',
  },
  {
    name: 'Mercury aspect Sun in 9th house : Ends',
    description: 'As the intense focus on health philosophies fades, you can relax rigid dietary rules. Maintain the core benefits by continuing to enjoy sun-dried fruits and golden grains.',
  },
  {
    name: 'Mercury aspect Sun in 9th house : Starts',
    description: 'Start aligning your diet with positive, sun-cooked foods. Introducing dried apricots and walnuts now will physically support the inspiring ideas coming your way.',
  },
  {
    name: 'Moon Aspecting Ascendant (ASC) : Exact',
    description: 'Emotional sensitivity makes you prone to water retention. Focus entirely on hydrating, diuretic foods like cucumber water and fresh melons to flush out toxins after a long walk.',
  },
  {
    name: 'Moon Aspecting Midheaven (MC) : Exact',
    description: 'Career stress triggers emotional eating. Keep only structured, warm grain bowls with roasted vegetables on hand to provide emotional soothing without compromising your professional energy.',
  },
  {
    name: 'Pluto conjunct Saturn : Ends',
    description: 'The period of absolute dietary restriction is concluding. Slowly reintroduce more varied, complex foods, but maintain the clean, structured foundation you have built.',
  },
  {
    name: 'Pluto conjunct Saturn : Starts',
    description: 'An extreme transit begins, demanding absolute dietary control. Immediately eliminate processed foods and embrace a highly structured diet of steamed greens and pure water.',
  },
  {
    name: 'Rahu aspect Moon in 6th house : Exact',
    description: 'Your digestion is severely compromised by toxic cravings. You must eat strictly organic, natural foods—completely avoiding artificial ingredients to heal the gut flora.',
  },
  {
    name: 'Saturn aspect Rahu in 9th house : Ends',
    description: 'The need for incredibly strict karmic dietary laws is lifting. You can cautiously expand your palate, but continue to avoid highly processed or unnatural foods.',
  },
  {
    name: 'Saturn aspect Rahu in 9th house : Exact',
    description: 'Karmic healing requires absolute discipline. Abide by restrictive, clean dietary rules, relying entirely on simple whole grains and steamed vegetables to restore metabolic balance.',
  },
  {
    name: 'Saturn aspect Rahu in 9th house : Starts',
    description: 'Begin enforcing non-negotiable rules around your diet. Cut out artificial additives immediately to prepare your body for a period of necessary physical healing.',
  },
  {
    name: 'Saturn aspect Sun in 9th house : Ends',
    description: 'The cold, restrictive energy dampening your vitality is fading. Slowly reintroduce lighter, more vibrant foods, though keep meals warm to fully reignite the digestive fire.',
  },
  {
    name: 'Saturn aspect Sun in 9th house : Exact',
    description: 'Vitality is suppressed, requiring slow, sustained nourishment. Thick, slow-cooked root vegetable stews and warm grains are necessary to combat the cold, restrictive energy.',
  },
  {
    name: 'Saturn aspect Sun in 9th house : Starts',
    description: 'Anticipate a drop in digestive fire by shifting to warmer, heavier meals. Begin incorporating slow-cooked black beans and stews to build endurance.',
  },
  {
    name: 'Sun aspect Jupiter in 5th house : Ends',
    description: 'The phase of massive appetite and celebration is over. Consciously rein in portion sizes and return to a moderate, balanced daily intake to prevent residual weight gain.',
  },
  {
    name: 'Sun aspect Jupiter in 5th house : Starts',
    description: 'Your vitality is expanding. Begin preparing for an increased appetite by stocking up on high-quality, rich foods like sweet potatoes and pure ghee, practicing portion control early.',
  },
  {
    name: 'Sun aspect Ketu in 3rd house : Ends',
    description: 'The sudden drop in physical confidence is resolving. Gently transition from light broths back to solid, easily digestible meals like rice and steamed vegetables.',
  },
  {
    name: 'Sun aspect Ketu in 3rd house : Starts',
    description: 'Prepare for a drop in digestive fire. Switch to a very light, fasting-mimicking diet of simple clear broths to allow your body to process incoming spiritual shifts.',
  },
  {
    name: 'Sun aspect Mars in 8th house : Starts',
    description: 'Internal heat and subtle anger are rising. Preemptively cool your system by introducing fresh coconut water and cucumber salads to calm the upcoming inflammatory response.',
  },
  {
    name: 'Sun aspect Mercury in 8th house : Ends',
    description: 'The deep psychological investigation into your habits is complete. Solidify your new, clean eating patterns by consistently choosing omega-rich foods and fresh berries.',
  },
  {
    name: 'Sun aspect Mercury in 8th house : Starts',
    description: 'Begin fueling your mind for deep introspection. Introduce clear, antioxidant-rich foods like blueberries and rosemary to sharpen your psychic and mental clarity.',
  },
  {
    name: 'Sun aspect Moon in 6th house : Ends',
    description: 'The profound cleansing phase is concluding. Maintain the benefits by continuing to incorporate fresh ginger and vibrant salads into your daily routine.',
  },
  {
    name: 'Sun aspect Moon in 6th house : Starts',
    description: 'Start an immune-boosting regimen immediately. Introduce abundant citrus fruits, garlic, and turmeric to prepare your body for a deep cellular cleanse.',
  },
  {
    name: 'Sun aspect Rahu in 9th house : Ends',
    description: 'The chaotic, disillusioning energy is passing. You can gently diversify your diet again, remaining anchored in the earth-grown foods that stabilized you.',
  },
  {
    name: 'Sun aspect Rahu in 9th house : Starts',
    description: 'Anticipate erratic eating urges by firmly grounding your diet now. Stock up on deeply rooted vegetables like potatoes and turnips to stabilize your mind.',
  },
  {
    name: 'Sun aspect Saturn in 10th house : Starts',
    description: 'Career pressure is about to slow your metabolism. Transition immediately to slow-cooked, easily digestible bone broths and soft grains to conserve your vital energy.',
  },
  {
    name: 'Sun aspect Sun in 9th house : Exact',
    description: 'Your vitality demands highly sattvic, life-affirming foods. Organic fruits and pure grains will provide the high-vibration energy needed to align with your astrological studies.',
  },
  {
    name: 'Sun aspect Venus in 8th house : Ends',
    description: 'The compulsive emotional cravings are subsiding. Taper off the rich comfort foods and return to a clean, balanced diet of whole vegetables and lean proteins.',
  },
  {
    name: 'Sun aspect Venus in 8th house : Starts',
    description: 'Prepare for intense emotional triggers by having healthy comfort foods ready. Baked apples with cinnamon will soothe old memories without resorting to processed sugars.',
  },
  {
    name: 'Uranus aspect Saturn in 10th house : Exact',
    description: 'Erratic professional changes clash with your need for structure. Maintain your physical baseline by strictly meal-prepping reliable, dense proteins and complex carbs, refusing to skip meals.',
  },
  {
    name: 'Venus Aspecting Ascendant (ASC) : Exact',
    description: 'Your glowing appearance craves foods rich in vitamin E. Avocados, olive oil, and fresh berries will enhance your natural charm while keeping your energy light and social.',
  },
  {
    name: 'Venus aspect Ketu in 3rd house : Starts',
    description: 'A spiritual detachment from rich foods is beginning. Start simplifying your meals, moving towards plain white rice and mild broths to support this subtle detoxification.',
  },
  {
    name: 'Venus aspect Moon in 6th house : Ends',
    description: 'The acute need for beautifying foods is passing. Continue to enjoy antioxidants, but you can safely expand your diet to include heartier, grounding meals.',
  },
  {
    name: 'Venus aspect Moon in 6th house : Exact',
    description: 'Beautifying foods are your best medicine today. Incorporate fresh berries, rose water, and raw almonds to give your skin a vibrant glow and soothe emotional sensitivities.',
  },
  {
    name: 'Venus aspect Moon in 6th house : Starts',
    description: 'Begin adjusting your diet for aesthetic and emotional nourishment. Stock up on avocados and colorful, antioxidant-rich fruits to preemptively protect your skin and gut.',
  },
  {
    name: 'Venus aspect Rahu in 9th house : Starts',
    description: 'A dangerous craving for artificial luxury foods is approaching. Anchor yourself now with genuinely rich, natural foods like pure coconuts and high-quality olive oil.',
  },
  {
    name: 'Venus aspect Saturn in 10th house : Ends',
    description: 'The austere discipline required for your career is softening. You can slightly increase your intake of luxurious, high-quality fats without compromising your goals.',
  },
  {
    name: 'Venus aspect Saturn in 10th house : Starts',
    description: 'Increased responsibility demands austere nourishment. Start incorporating small amounts of high-quality dark chocolate or black sesame to provide luxury while maintaining strict discipline.',
  },
  {
    name: 'Venus aspect Sun in 9th house : Ends',
    description: 'The desire for exotic, imported foods is winding down. Transition back to local, simple ingredients to rest your palate and digestion.',
  },
  {
    name: 'Venus aspect Sun in 9th house : Starts',
    description: 'Prepare for an expanding palate. Begin integrating fine olive oils and Mediterranean flavors to satisfy the upcoming urge for luxurious, culturally rich foods.',
  },
  {
    name: 'Venus ruler of the 7th House in the 8th House',
    description: 'Jack, relational dynamics deeply impact your digestion. Share warm, easily digestible, and purifying meals like traditional kitchari to soothe the tract and calm interpersonal tensions.',
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