import { Language, StoryData, ListeningData } from "../types";

export interface WritingScenario {
  id: string;
  imageDescription: string;
  imageUrl: string;
  prompt: string;
}

export interface DebateTopic {
  id: string;
  topic: string;
  description: string;
  startingCounterargument: string;
}

export const staticStories: Record<Language, StoryData[]> = {
  "Swedish": [
    {
      title: "En promenad i Gamla Stan",
      titleTranslation: "A Walk in the Old Town",
      storyText: "Elin älskar att promenera i Gamla Stan på söndagar. Gatorna är smala och kantade av färgglada, gamla hus från 1600-talet. Doften av nybakat kanelbulle sprider sig från det lilla bageriet runt hörnet. Hon sätter sig på ett café och beställer en stor kopp kaffe.",
      storyTranslation: "Elin loves to stroll in Gamla Stan (the Old Town) on Sundays. The streets are narrow and lined with colorful, old houses from the 17th century. The smell of freshly baked cinnamon buns spreads from the small bakery around the corner. She sits down at a café and orders a large cup of coffee.",
      wordTranslations: [
        { word: "älskar", translation: "loves", pronunciation: "el-skar", explanation: "From the verb 'älska' (to love)." },
        { word: "promenera", translation: "to walk/stroll", pronunciation: "pro-me-nee-ra", explanation: "A leisurely walk." },
        { word: "smala", translation: "narrow", pronunciation: "smah-la", explanation: "Plural form of 'smal'." },
        { word: "kanelbulle", translation: "cinnamon bun", pronunciation: "ka-neel-bul-leh", explanation: "Sweden's iconic pastry." },
        { word: "bageriet", translation: "the bakery", pronunciation: "bah-ge-ree-et", explanation: "Definite form of 'bageri'." }
      ]
    }
  ],
  "English": [
    {
      title: "Rainy Day in London",
      titleTranslation: "En regnig dag i London",
      storyText: "Thomas took his black umbrella and walked outside. The rain was drumming gently on the dark pavement. He decided to visit the British Museum to stay warm. Inside, the massive glass dome sparkled against the gray afternoon sky.",
      storyTranslation: "Thomas tog sitt svarta paraply och gick ut. Regnet trummade mjukt mot den mörka asfalten. Han bestämde sig för att besöka British Museum för att hålla sig varm. Inuti glittrade den enorma glaskupolen mot den gråa eftermiddagshimlen.",
      wordTranslations: [
        { word: "umbrella", translation: "paraply", pronunciation: "uhm-brel-uh", explanation: "A portable device for protection against rain." },
        { word: "drumming", translation: "trummande", pronunciation: "drum-ing", explanation: "Making a rhythmic beating sound." },
        { word: "pavement", translation: "trottoar", pronunciation: "peyv-muhnt", explanation: "The sidewalk or paved surface." },
        { word: "massive", translation: "enorm", pronunciation: "mas-iv", explanation: "Very large and heavy." },
        { word: "sparkled", translation: "glittrade", pronunciation: "spahr-kuhld", explanation: "Shone brightly with flashes of light." }
      ]
    }
  ],
  "Urdu": [
    {
      title: "شالیمار باغ کی سیر",
      titleTranslation: "A Visit to Shalimar Gardens",
      storyText: "عامر اپنے خاندان کے ساتھ اتوار کو شالیمار باغ دیکھنے گیا۔ وہاں خوبصورت فوارے اور ہریالی دیکھ کر دل خوش ہو گیا۔ انہوں نے آموں کے درختوں کے نیچے بیٹھ کر کھانا کھایا اور پرانی یادیں تازہ کیں۔",
      storyTranslation: "Aamir went to visit Shalimar Gardens on Sunday with his family. Seeing the beautiful fountains and greenery, his heart became happy. They sat under mango trees, ate food, and refreshed old memories.",
      wordTranslations: [
        { word: "خاندان", translation: "family", pronunciation: "khan-daan", explanation: "Noun for household / relatives." },
        { word: "خوبصورت", translation: "beautiful", pronunciation: "khoob-soorat", explanation: "Adjective combining 'khoob' (good) and 'soorat' (face/appearance)." },
        { word: "ہریالی", translation: "greenery", pronunciation: "ha-ryaa-lee", explanation: "Lush green vegetation." },
        { word: "درختوں", translation: "trees", pronunciation: "da-rakh-ton", explanation: "Plural oblique form of 'darakht'." },
        { word: "یادیں", translation: "memories", pronunciation: "yaa-dain", explanation: "Feminine plural noun." }
      ]
    }
  ],
  "Turkish": [
    {
      title: "Boğaz'da Simit Keyfi",
      titleTranslation: "Simit Joy on the Bosphorus",
      storyText: "Selin her cumartesi İstanbul Boğazı kenarında yürüyüş yapmayı sever. Martıların çığlıkları eşliğinde taze, çıtır bir simit yer ve çayını yudumlar. Denizden gelen rüzgar ona huzur verir. Bu, haftanın en sevdiği ritüelidir.",
      storyTranslation: "Selin loves walking along the Istanbul Bosphorus every Saturday. Accompanied by the cries of seagulls, she eats a fresh, crispy simit and sips her tea. The wind coming from the sea gives her peace. This is her favorite ritual of the week.",
      wordTranslations: [
        { word: "yürüyüş", translation: "walk / hike", pronunciation: "yu-ru-yush", explanation: "From the verb 'yürümek' (to walk)." },
        { word: "martıların", translation: "of the seagulls", pronunciation: "mahr-tuh-lah-ruhn", explanation: "Genitive plural of 'martı'." },
        { word: "çıtır", translation: "crispy", pronunciation: "chuh-tuhr", explanation: "Onomatopoeic word for crunchy food." },
        { word: "simit", translation: "sesame bread ring", pronunciation: "sih-miht", explanation: "Traditional Turkish circular bread encrusted with sesame seeds." },
        { word: "huzur", translation: "peace / serenity", pronunciation: "hu-zuhr", explanation: "Deep mental tranquility." }
      ]
    }
  ],
  "Korean": [
    {
      title: "서울의 특별한 아침",
      titleTranslation: "A Special Morning in Seoul",
      storyText: "민우는 매일 아침 남산 공원에 올라갑니다. 아침 공기는 신선하고 서울 타워의 전망은 눈부십니다. 공원 벤치에 앉아 따뜻한 녹차를 마시며 하루를 계획합니다. 이 시간은 그에게 가장 평화롭고 조용한 순간입니다.",
      storyTranslation: "Min-woo climbs Namsan Park every morning. The morning air is fresh, and the view of Seoul Tower is dazzling. Sitting on a park bench, drinking warm green tea, he plans his day. This is the most peaceful and quiet moment for him.",
      wordTranslations: [
        { word: "아침", translation: "morning", pronunciation: "ah-chim", explanation: "Can mean morning or breakfast." },
        { word: "전망", translation: "view / prospect", pronunciation: "jeon-mang", explanation: "Usually refers to a scenic outlook." },
        { word: "눈부십니다", translation: "is dazzling", pronunciation: "nun-bu-sip-ni-da", explanation: "From 눈부시다 (to be dazzling/blinding)." },
        { word: "녹차", translation: "green tea", pronunciation: "nok-cha", explanation: "Traditional Korean green tea." },
        { word: "평화롭고", translation: "peaceful and", pronunciation: "pyeong-hwa-rop-go", explanation: "From 평화롭다 (to be peaceful) + 고 (and)." }
      ]
    }
  ],
  "Chinese": [
    {
      title: "茶馆里的午后",
      titleTranslation: "Afternoon in a Teahouse",
      storyText: "张伟喜欢在成都的传统茶馆里度过下午。那里竹椅舒适，茶香四溢。人们聚在一起聊天、打麻将，生活节奏变得非常慢。他点了一杯盖碗茶，静静享受着属于自己的轻松时光。",
      storyTranslation: "Zhang Wei likes to spend his afternoons in a traditional teahouse in Chengdu. The bamboo chairs are comfortable, and the tea aroma is everywhere. People gather to chat and play mahjong, and the pace of life becomes very slow. He ordered a cup of Gaiwan tea, quietly enjoying his own relaxing time.",
      wordTranslations: [
        { word: "茶馆", translation: "teahouse", pronunciation: "chá guǎn", explanation: "A traditional venue for tea culture." },
        { word: "舒适", translation: "comfortable", pronunciation: "shū shì", explanation: "Relates to physical or mental ease." },
        { word: "打麻将", translation: "play mahjong", pronunciation: "dǎ má jiàng", explanation: "A popular tile-based game in China." },
        { word: "节奏", translation: "pace / rhythm", pronunciation: "jié zòu", explanation: "Speed or tempo of activities." },
        { word: "轻松", translation: "relaxed / light", pronunciation: "qīng sōng", explanation: "Free from stress or burden." }
      ]
    }
  ]
};

export const staticListenings: Record<Language, ListeningData[]> = {
  "Swedish": [
    {
      title: "Fika med en kompis",
      audioScenarioDescription: "Two friends, Anders and Sofia, meet up at a bakery in Stockholm for their traditional afternoon coffee and cinnamon buns (Fika). They discuss their plans for the weekend in Swedish.",
      dialogue: [
        { speaker: "Anders", text: "Hej Sofia! Hur mår du idag?", translation: "Hi Sofia! How are you doing today?" },
        { speaker: "Sofia", text: "Hej Anders! Jag mår jättebra tack. Ska vi ta en fika?", translation: "Hi Anders! I'm doing great, thanks. Shall we have coffee and pastries?" },
        { speaker: "Anders", text: "Ja, gärna! Jag vill ha en bryggkaffe och en kanelbulle.", translation: "Yes, gladly! I want a brewed coffee and a cinnamon bun." },
        { speaker: "Sofia", text: "Perfekt, jag bjuder. Har du några planer för helgen?", translation: "Perfect, my treat. Do you have any plans for the weekend?" },
        { speaker: "Anders", text: "Jag ska vandra i Tyresta nationalpark på lördag.", translation: "I'm going to hike in Tyresta National Park on Saturday." }
      ],
      questions: [
        {
          question: "What does Anders want to eat and drink?",
          options: ["Tea and a cardamom bun", "Brewed coffee and a cinnamon bun", "An espresso and a sandwich", "Orange juice and a chocolate ball"],
          correctIndex: 1,
          explanation: "Anders says: 'Jag vill ha en bryggkaffe (brewed coffee) och en kanelbulle (cinnamon bun).'"
        },
        {
          question: "Who is paying for the fika?",
          options: ["Anders", "Sofia", "They split the bill", "The café owner"],
          correctIndex: 1,
          explanation: "Sofia says: 'jag bjuder', which means 'my treat' or 'I'm paying'."
        },
        {
          question: "What is Anders planning to do on Saturday?",
          options: ["Go to the cinema", "Visit a museum", "Hike in Tyresta national park", "Study Swedish at home"],
          correctIndex: 2,
          explanation: "Anders says: 'Jag ska vandra i Tyresta nationalpark på lördag' (I will hike on Saturday)."
        }
      ]
    }
  ],
  "English": [
    {
      title: "Booking a Train Ticket",
      audioScenarioDescription: "An interaction at a London underground/train ticket counter where a commuter requests a day travelcard to Oxford.",
      dialogue: [
        { speaker: "Agent", text: "Next in line, please! Hello, how can I help you today?", translation: "Nästa i kön, tack! Hej, hur kan jag hjälpa dig idag?" },
        { speaker: "Passenger", text: "Hi, I'd like a return day travelcard to Oxford, please.", translation: "Hej, jag skulle vilja ha ett dags-tur-och-retur-resekort till Oxford, tack." },
        { speaker: "Agent", text: "Sure, that will be twenty-five pounds. Will you be paying by cash or card?", translation: "Självklart, det blir tjugofem pund. Betalar du med kontanter eller kort?" },
        { speaker: "Passenger", text: "Card, please. Here you go.", translation: "Kort, tack. Varsågod." }
      ],
      questions: [
        {
          question: "What destination is the commuter traveling to?",
          options: ["Cambridge", "Oxford", "Manchester", "Liverpool"],
          correctIndex: 1,
          explanation: "The passenger says 'a return day travelcard to Oxford, please.'"
        },
        {
          question: "How much does the ticket cost?",
          options: ["£15", "£20", "£25", "£35"],
          correctIndex: 2,
          explanation: "The ticket agent states 'that will be twenty-five pounds (£25).'"
        },
        {
          question: "How does the passenger choose to pay?",
          options: ["By cash", "By mobile tap", "By credit card", "By check"],
          correctIndex: 2,
          explanation: "The passenger responds 'Card, please.'"
        }
      ]
    }
  ],
  "Urdu": [
    {
      title: "بازار میں خریداری",
      audioScenarioDescription: "A conversation in Urdu between a customer and a shopkeeper in Lahore, bargaining over the price of traditional clothing.",
      dialogue: [
        { speaker: "دکاندار", text: "آئیے صاحب! ہماری دکان پر بہترین کپڑے دستیاب ہیں۔", translation: "Come, sir! Best clothes are available in our shop." },
        { speaker: "خریدار", text: "یہ لال رنگ کا کرتا کتنے کا ہے؟", translation: "How much is this red Kurta?" },
        { speaker: "دکاندار", text: "یہ صرف دو ہزار روپے کا ہے۔ بہت اعلیٰ کوالٹی ہے۔", translation: "This is only two thousand rupees. It is very high quality." },
        { speaker: "خریدار", text: "کچھ مناسب کریں، پندرہ سو روپے ٹھیک ہیں؟", translation: "Make it reasonable, is fifteen hundred rupees okay?" },
        { speaker: "دکاندار", text: "ٹھیک ہے، آپ کے لیے ساڑھے سترہ سو فائنل کرتے ہیں۔", translation: "Okay, we finalize it at seventeen hundred and fifty for you." }
      ],
      questions: [
        {
          question: "What item is the customer interested in?",
          options: ["Blue Shawl", "Red Kurta", "Green Shoes", "Black Hat"],
          correctIndex: 1,
          explanation: "The buyer asks: 'یہ لال رنگ کا کرتا کتنے کا ہے؟' (How much is this red Kurta?)"
        },
        {
          question: "What was the shopkeeper's starting price?",
          options: ["1000 rupees", "1500 rupees", "2000 rupees", "2500 rupees"],
          correctIndex: 2,
          explanation: "The shopkeeper says: 'یہ صرف دو ہزار روپے کا ہے' (This is only 2000 rupees)."
        },
        {
          question: "What is the final negotiated price?",
          options: ["1500 rupees", "1750 rupees", "1800 rupees", "2000 rupees"],
          correctIndex: 1,
          explanation: "The shopkeeper says: 'ساڑھے سترہ سو فائنل کرتے ہیں' (Seventeen hundred and fifty/1750 rupees final)."
        }
      ]
    }
  ],
  "Turkish": [
    {
      title: "Otobüs Durağında",
      audioScenarioDescription: "Two commuters waiting for the bus in Ankara talk about the delays and weather conditions.",
      dialogue: [
        { speaker: "Ahmet", text: "Merhaba, otuz sekiz numaralı otobüs geçti mi acaba?", translation: "Hello, has bus number thirty-eight passed yet, I wonder?" },
        { speaker: "Leyla", text: "Merhaba, hayır geçmedi. Ben de yirmi dakikadır bekliyorum.", translation: "Hello, no it hasn't. I've been waiting for twenty minutes too." },
        { speaker: "Ahmet", text: "Trafik bugün çok yoğun sanırım. Hava da yağmurlu.", translation: "I think traffic is very heavy today. Also the weather is rainy." },
        { speaker: "Leyla", text: "Evet, İstanbul yolu kilitlenmiş diyorlar. Metro daha hızlı olabilirdi.", translation: "Yes, they say the Istanbul road is locked up. The subway could have been faster." }
      ],
      questions: [
        {
          question: "Which bus number is Ahmet asking about?",
          options: ["Bus 18", "Bus 28", "Bus 38", "Bus 48"],
          correctIndex: 2,
          explanation: "Ahmet asks: 'otuz sekiz (38) numaralı otobüs geçti mi?'"
        },
        {
          question: "How long has Leyla been waiting?",
          options: ["5 minutes", "10 minutes", "20 minutes", "an hour"],
          correctIndex: 2,
          explanation: "Leyla says: 'Ben de yirmi (20) dakikadır bekliyorum' (I have been waiting for 20 minutes too)."
        },
        {
          question: "What alternative transport does Leyla suggest would be faster?",
          options: ["Subway (Metro)", "Taxi", "Walking", "Ferry"],
          correctIndex: 0,
          explanation: "Leyla says: 'Metro daha hızlı olabilirdi' (Metro could have been faster)."
        }
      ]
    }
  ],
  "Korean": [
    {
      title: "식당에서 주문하기",
      audioScenarioDescription: "A customer visits a traditional Korean restaurant in Seoul. They ask the server for recommendations and order a popular dish.",
      dialogue: [
        { speaker: "종업원", text: "어서 오세요! 몇 분이세요?", translation: "Welcome! How many people?" },
        { speaker: "손님", text: "한 명이에요. 여기 뭐가 맛있어요?", translation: "Just one person. What's delicious here?" },
        { speaker: "종업원", text: "비빔밥과 불고기가 아주 인기 많아요.", translation: "Bibimbap and Bulgogi are very popular." },
        { speaker: "손님", text: "그럼 비빔밥 하나 주세요. 그리고 물도 좀 주세요.", translation: "Then give me one Bibimbap, please. And some water too." }
      ],
      questions: [
        {
          question: "How many guests are in the party?",
          options: ["One", "Two", "Three", "Four"],
          correctIndex: 0,
          explanation: "The customer answers: '한 명이에요' (It's one person)."
        },
        {
          question: "Which dishes are recommended by the server?",
          options: ["Kimchi Stew and Ramen", "Kimbap and Tteokbokki", "Bibimbap and Bulgogi", "Cold Noodles and Fried Chicken"],
          correctIndex: 2,
          explanation: "The server says: '비빔밥과 불고기가 아주 인기 많아요' (Bibimbap and Bulgogi are very popular)."
        },
        {
          question: "What extra item did the customer request?",
          options: ["Spoon", "Side dishes", "Kimchi", "Water"],
          correctIndex: 3,
          explanation: "The customer says: '그리고 물도 좀 주세요' (And also give me some water, please)."
        }
      ]
    }
  ],
  "Chinese": [
    {
      title: "在超市买水果",
      audioScenarioDescription: "A shopper visits a market in Beijing and asks the fruit vendor about prices of grapes and apples.",
      dialogue: [
        { speaker: "顾客", text: "老板，今天的苹果怎么卖？", translation: "Boss, how are today's apples being sold?" },
        { speaker: "摊主", text: "苹果八块钱一斤，很甜很新鲜！", translation: "Apples are 8 yuan a jin, very sweet and very fresh!" },
        { speaker: "顾客", text: "那葡萄呢？我想买两斤葡萄。", translation: "Then what about grapes? I want to buy two jin of grapes." },
        { speaker: "摊主", text: "葡萄十五块一斤。一共就是三十块加十六块，四十六块。", translation: "Grapes are 15 yuan a jin. The total is 30 plus 16, which is 46 yuan." }
      ],
      questions: [
        {
          question: "How much are the apples per jin?",
          options: ["5 yuan", "8 yuan", "10 yuan", "15 yuan"],
          correctIndex: 1,
          explanation: "The vendor says: '苹果八块 (8) 钱一斤'."
        },
        {
          question: "How many jins of grapes does the customer buy?",
          options: ["1 jin", "2 jins", "3 jins", "4 jins"],
          correctIndex: 1,
          explanation: "The customer states: '我想买两 (2) 斤葡萄'."
        },
        {
          question: "What is the grand total for the customer's purchase?",
          options: ["30 yuan", "38 yuan", "46 yuan", "50 yuan"],
          correctIndex: 2,
          explanation: "The vendor states: '一共就是三十块加十六块，四十六 (46) 块'."
        }
      ]
    }
  ]
};

export const writingScenarios: Record<Language, WritingScenario[]> = {
  "Swedish": [
    {
      id: "s1",
      imageDescription: "A serene red Swedish summer cottage (stuga) by a calm blue lake, framed by green pine trees.",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60", // Autumn summer vibe
      prompt: "Beskriv denna typiska svenska sommarstuga och sjön. Vad skulle du vilja göra här?"
    }
  ],
  "English": [
    {
      id: "e1",
      imageDescription: "A busy red double-decker bus driving past the Elizabeth Tower (Big Ben) under a clear sky in London.",
      imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ca1ad?w=500&auto=format&fit=crop&q=60",
      prompt: "Describe this London street scene. What are the commuters doing and where do you think they are going?"
    }
  ],
  "Urdu": [
    {
      id: "u1",
      imageDescription: "A vibrant mountain valley in Hunza, with majestic snow-covered peaks in the background and yellow apricot trees.",
      imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&auto=format&fit=crop&q=60",
      prompt: "اس خوبصورت پہاڑی منظر کی وضاحت کریں۔ آپ یہاں کیا دیکھ رہے ہیں؟"
    }
  ],
  "Turkish": [
    {
      id: "t1",
      imageDescription: "Majestic hot air balloons floating over the fairy chimneys and canyons of Cappadocia at sunrise.",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60",
      prompt: "Kapadokya'daki balonları ve vadiyi betimleyin. Gökyüzünde süzülmek nasıl bir his olurdu?"
    }
  ],
  "Korean": [
    {
      id: "k1",
      imageDescription: "A majestic traditional Korean palace (Gyeongbokgung) illuminated beautifully against the nighttime city skyline of Seoul.",
      imageUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&auto=format&fit=crop&q=60",
      prompt: "서울의 경복궁 야경입니다. 전통 궁궐과 현대 빌딩들의 조화에 대해 한국어로 묘사해 보세요."
    }
  ],
  "Chinese": [
    {
      id: "c1",
      imageDescription: "A peaceful red Chinese pavilion in the center of a lake, surrounded by blooming lotus flowers and weeping willows.",
      imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=500&auto=format&fit=crop&q=60",
      prompt: "请描述这个湖心亭的景色。在这样的环境里，你的心情是怎样的？"
    }
  ]
};

export const debateTopics: Record<Language, DebateTopic[]> = {
  "Swedish": [
    {
      id: "deb_s1",
      topic: "Är snabbmat acceptabelt?",
      description: "Diskutera om snabbmat är en bekväm del av det moderna livet eller om det är ett allvarligt folkhälsoproblem.",
      startingCounterargument: "Många tycker snabbmat är bra för att det sparar tid, men det är fyllt med ohälsosamma fetter och socker som skadar kroppen i längden. Vad anser du?"
    }
  ],
  "English": [
    {
      id: "deb_e1",
      topic: "Should artificial intelligence replace teachers?",
      description: "Debate whether AI can deliver personalized, affordable education or if the human touch of a teacher is irreplaceable.",
      startingCounterargument: "While AI can process vast knowledge and customize worksheets instantly, it lacks emotional intelligence, encouragement, and real human mentorship. Can a machine truly inspire a student?"
    }
  ],
  "Urdu": [
    {
      id: "deb_u1",
      topic: "کیا کتابیں اب ختم ہو رہی ہیں؟",
      description: "کیا ڈیجیٹل کتب (E-books) روایتی کاغذی کتابوں کی جگہ مکمل طور پر لے لیں گی؟",
      startingCounterargument: "اگرچہ ای-بکس سستی اور آسان ہیں، مگر جو سکون کاغذی کتاب کو ہاتھ میں پکڑ کر پڑھنے میں ہے وہ سکرین پر کبھی نہیں مل سکتا۔ آپ کا کیا خیال ہے؟"
    }
  ],
  "Turkish": [
    {
      id: "deb_t1",
      topic: "Sosyal medya insanları yalnızlaştırıyor mu?",
      description: "Sosyal ağların insanları birbirine mi bağladığı yoksa yüz yüze ilişkileri zayıflatarak izole mi ettiği üzerine tartışın.",
      startingCounterargument: "Sosyal medya mesafeleri kısaltsa da, sanal beğeniler gerçek dostlukların yerini tutamaz. İnsanlar artık kalabalıklar içinde daha yalnız hissediyorlar. Bu görüşe katılıyor musunuz?"
    }
  ],
  "Korean": [
    {
      id: "deb_k1",
      topic: "대도시 생활이 시골 생활보다 더 나은가요?",
      description: "편리하고 화려한 서울 같은 대도시의 삶과, 한적하고 자연 친화적인 시골의 삶 중 어느 쪽이 인생의 행복에 유익한지 토론하세요.",
      startingCounterargument: "도시는 문화시설과 병원이 많아 편리하지만, 소음과 대기오염으로 스트레스가 심합니다. 반면 자연 속에 살면 진정한 마음의 평화를 찾을 수 있지 않을까요?"
    }
  ],
  "Chinese": [
    {
      id: "deb_c1",
      topic: "手机支付是否应该完全取代现金？",
      description: "探讨电子支付的便利快捷与现金在隐私保护、无网环境及老年人群体中的必要性之间的冲突。",
      startingCounterargument: "虽然手机扫码非常高效省时，但如果发生停电、网络中断或黑客入侵，电子钱包将无法工作。此外，这让许多不会用智能手机的老年人感到寸步难行。难道现金不应该作为最后保障吗？"
    }
  ]
};
