import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI gracefully
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini AI client successfully initialized server-side.");
  } catch (err) {
    console.error("Error initializing Gemini client:", err);
  }
} else {
  console.log("GEMINI_API_KEY not set or placeholder. Running in local mock simulation fallback mode.");
}

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    aiConfigured: !!ai, 
    time: new Date().toISOString() 
  });
});

// 1. AI Tutor Feedback & Correction Endpoint
app.post("/api/gemini/tutor-feedback", async (req: express.Request, res: express.Response) => {
  const { userText, language, contextMode, taskContext } = req.body;

  if (!userText || !language) {
    return res.status(400).json({ error: "Missing userText or language parameter." });
  }

  // If Gemini client is not initialized, return high-quality mock feedback
  if (!ai) {
    return res.json(getMockFeedback(userText, language, contextMode));
  }

  try {
    const prompt = `You are LingoJet's expert friendly AI language tutor. 
Analyze the user's input in ${language}.
The learning context is: "${contextMode}" (Details: ${taskContext || "General Conversation"}).

User's response to analyze: "${userText}"

You must analyze this input, provide grammar and spelling corrections, vocabulary suggestions (better alternatives), an accuracy/quality score, a pronunciation phonetic transcription, and a helpful tutor response in ${language} that continues the conversation.

Provide your response in strict JSON format matching the schema requested. Do not wrap in markdown blocks, just return raw JSON text.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            correctedText: { 
              type: Type.STRING, 
              description: "The user's text with grammatical, spelling, and style corrections applied. Keep it very similar to their original but grammatically perfect." 
            },
            hasCorrections: { 
              type: Type.BOOLEAN, 
              description: "True if there were errors or styling corrections made, false if the input was 100% perfect." 
            },
            correctionsList: {
              type: Type.ARRAY,
              description: "Detailed list of corrected phrases or words.",
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING, description: "The mistake or suboptimal phrase." },
                  corrected: { type: Type.STRING, description: "The corrected or standard phrase." },
                  explanation: { type: Type.STRING, description: "Friendly explanation in English of why this change is necessary." }
                },
                required: ["original", "corrected", "explanation"]
              }
            },
            vocabUpgrades: {
              type: Type.ARRAY,
              description: "Words or phrases that could be upgraded to sound more native or sophisticated.",
              items: {
                type: Type.OBJECT,
                properties: {
                  originalWord: { type: Type.STRING, description: "Word or simple phrase from user's text." },
                  suggestedWord: { type: Type.STRING, description: "A higher-level, more idiomatic or natural word." },
                  explanation: { type: Type.STRING, description: "Explanation of why this word is a great upgrade." }
                },
                required: ["originalWord", "suggestedWord", "explanation"]
              }
            },
            accuracyScore: { 
              type: Type.INTEGER, 
              description: "Language accuracy/quality score from 0 (poor) to 100 (native/perfect)." 
            },
            pronunciationPhonetics: { 
              type: Type.STRING, 
              description: "Phonetic / romanized guide on how to pronounce the corrected sentence naturally." 
            },
            tutorResponse: { 
              type: Type.STRING, 
              description: "A warm, natural, engaging reply to the user's statement in the target language (${language}). If in Debate mode, provide a friendly counterargument. Keep it to 1-2 sentences." 
            }
          },
          required: ["correctedText", "hasCorrections", "correctionsList", "vocabUpgrades", "accuracyScore", "pronunciationPhonetics", "tutorResponse"]
        }
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Gemini tutor-feedback error:", error);
    res.status(500).json({ 
      error: "Failed to generate AI tutor feedback.", 
      details: error.message,
      fallback: getMockFeedback(userText, language, contextMode)
    });
  }
});

// 2. Interactive Bilingual Story Generator (Reading Screen)
app.post("/api/gemini/generate-story", async (req: express.Request, res: express.Response) => {
  const { language, level, theme } = req.body;

  if (!language) {
    return res.status(400).json({ error: "Missing language parameter." });
  }

  if (!ai) {
    return res.json(getMockStory(language, level || "Intermediate", theme || "Daily Life"));
  }

  try {
    const prompt = `Create an interactive bilingual reading story for a language learner.
Target Language: ${language}
Level: ${level || "Intermediate"}
Theme/Topic: ${theme || "Daily Life"}

Generate:
1. An engaging title in ${language} and its English translation.
2. A short story of 2 paragraphs in ${language}.
3. A paragraph-by-paragraph translation in English.
4. A collection of 6-8 key vocabulary words extracted from the story. For each word, provide:
   - The word in ${language}
   - Its English translation
   - A pronunciation / Romanization phonetic guide
   - A short explanation or grammar tip.

Format your output as structured JSON matching the requested schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            titleTranslation: { type: Type.STRING },
            storyText: { type: Type.STRING, description: "Full text of the story in the target language." },
            storyTranslation: { type: Type.STRING, description: "Paragraph-by-paragraph English translation." },
            wordTranslations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING, description: "The exact word or phrase from the story." },
                  translation: { type: Type.STRING, description: "Direct English translation." },
                  pronunciation: { type: Type.STRING, description: "Phonetic or Romanized pronunciation guide." },
                  explanation: { type: Type.STRING, description: "Brief grammar, context, or lexical note." }
                },
                required: ["word", "translation", "pronunciation", "explanation"]
              }
            }
          },
          required: ["title", "titleTranslation", "storyText", "storyTranslation", "wordTranslations"]
        }
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Gemini generate-story error:", error);
    res.status(500).json({ 
      error: "Failed to generate reading story.", 
      details: error.message,
      fallback: getMockStory(language, level, theme)
    });
  }
});

// 3. Listening Comprehension Dialog Generator
app.post("/api/gemini/generate-listening", async (req: express.Request, res: express.Response) => {
  const { language, level, scenario } = req.body;

  if (!language) {
    return res.status(400).json({ error: "Missing language parameter." });
  }

  if (!ai) {
    return res.json(getMockListening(language, level || "Beginner", scenario || "At the Cafe"));
  }

  try {
    const prompt = `Create a listening comprehension dialogue for an audio lesson scenario.
Target Language: ${language}
Level: ${level || "Beginner"}
Scenario: ${scenario || "At the Cafe"}

Generate:
1. A descriptive title.
2. An audio scenario description in English.
3. A dialogue transcript consisting of 4-6 back-and-forth turns between 2 native speaker characters (include speaker name, dialogue text in the target language, and English translation).
4. A 3-question multiple choice quiz testing listening comprehension. For each question:
   - Question text in English
   - 4 options (strings)
   - Correct option index (0-based)
   - Explanation of the correct answer.

Format your output as structured JSON matching the requested schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            audioScenarioDescription: { type: Type.STRING, description: "Description of the dialogue setting and speaker context." },
            dialogue: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  speaker: { type: Type.STRING, description: "Name of the speaker." },
                  text: { type: Type.STRING, description: "What they say in the target language." },
                  translation: { type: Type.STRING, description: "English translation of what they say." }
                },
                required: ["speaker", "text", "translation"]
              }
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.INTEGER, description: "0-based index of correct option." },
                  explanation: { type: Type.STRING, description: "Short explanation of the correct choice." }
                },
                required: ["question", "options", "correctIndex", "explanation"]
              }
            }
          },
          required: ["title", "audioScenarioDescription", "dialogue", "questions"]
        }
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Gemini generate-listening error:", error);
    res.status(500).json({ 
      error: "Failed to generate listening quiz.", 
      details: error.message,
      fallback: getMockListening(language, level, scenario)
    });
  }
});


// 4. Simple Chat Endpoint
app.post("/api/gemini/chat", async (req: express.Request, res: express.Response) => {
  const { messages, language } = req.body;

  if (!messages || !language) {
    return res.status(400).json({ error: "Missing messages or language parameter." });
  }

  if (!ai) {
    // Return standard mock reply
    const lastMsg = messages[messages.length - 1]?.text || "";
    return res.json({ 
      reply: `[Offline Mode] Simulated conversational AI response in ${language} to: "${lastMsg}". Feel free to continue speaking!`
    });
  }

  try {
    const systemInstruction = `You are LingoJet's advanced AI Chat companion. 
The user is learning ${language}. 
Have a warm, helpful, natural conversation in ${language} with them.
Helpfully respond to their message in the target language ${language}. Keep your message friendly, conversational, and relatively short (2-3 sentences max) to ensure it is easily digestible. Add an English translation of your reply in parentheses at the very end.`;

    const formattedContents = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    res.json({ reply: response.text || "No response received." });
  } catch (error: any) {
    console.error("Gemini chat error:", error);
    res.status(500).json({ 
      error: "Chat generation failed.", 
      details: error.message,
      reply: `[Fallback Mode] Let's continue practicing ${language}! You said: "${messages[messages.length - 1]?.text || ""}"`
    });
  }
});

// -------------------------------------------------------------
// LOCAL FALLBACK DATA GENERATORS (MOCK ENGINES)
// -------------------------------------------------------------

function getMockFeedback(userText: string, language: string, contextMode: string) {
  // Simple heuristics to create a realistic feedback card
  const length = userText.trim().length;
  const isShort = length < 10;
  
  const corrections = [];
  const upgrades = [];
  let score = 90;
  let correctedText = userText;
  let pronunciation = "";
  let tutorResponse = "";

  if (language === "Swedish") {
    correctedText = userText.replace(/ja /gi, "Jag ").replace(/är bra/gi, "mår bra");
    if (correctedText !== userText) {
      corrections.push({ original: "ja", corrected: "Jag", explanation: "Remember to capitalize 'Jag' (I) in Swedish." });
      corrections.push({ original: "är bra", corrected: "mår bra", explanation: "Use 'mår bra' to express feeling well or doing fine." });
      score = 78;
    }
    upgrades.push({ originalWord: "mår bra", suggestedWord: "mår alldeles utmärkt", explanation: "Mår alldeles utmärkt sounds much more vibrant and native, meaning 'feeling absolutely excellent'." });
    pronunciation = "Yag mawr bra";
    tutorResponse = "Vad trevligt att höra! Vad har du för planer för resten av dagen?";
  } else if (language === "Urdu") {
    correctedText = userText;
    pronunciation = "Mera naam ... hai.";
    tutorResponse = "بہت اچھا! آپ کو اردو سیکھتے ہوئے کتنا وقت ہو گیا ہے؟ (Very nice! How long have you been learning Urdu?)";
  } else if (language === "Turkish") {
    correctedText = userText;
    pronunciation = "Mer-ha-ba";
    tutorResponse = "Harika! Türkçe konuşmak çok eğlencelidir. Bugün ne yapmak istersin?";
  } else if (language === "Korean") {
    correctedText = userText;
    pronunciation = "An-nyeong-ha-se-yo";
    tutorResponse = "안녕하세요! 오늘 기분은 어떠신가요?";
  } else if (language === "Chinese") {
    correctedText = userText;
    pronunciation = "Nǐ hǎo";
    tutorResponse = "你好！很高兴和你交流。你今天过得怎么样？";
  } else {
    // English or generic fallback
    correctedText = userText;
    pronunciation = "Hah-loh";
    tutorResponse = `Awesome! Your ${language} sounds clear. Let's keep talking!`;
  }

  return {
    correctedText,
    hasCorrections: corrections.length > 0,
    correctionsList: corrections,
    vocabUpgrades: upgrades,
    accuracyScore: isShort ? score - 5 : score,
    pronunciationPhonetics: pronunciation,
    tutorResponse
  };
}

function getMockStory(language: string, level: string, theme: string) {
  const stories: Record<string, any> = {
    "Swedish": {
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
    },
    "Korean": {
      title: "서울의 특별한 아침",
      titleTranslation: "A Special Morning in Seoul",
      storyText: "민우는 매일 아침 남산 공원에 올라갑니다. 아침 공기는 신선하고 서울 타워의 전망은 눈부십니다. 공원 벤치에 앉아 따뜻한 녹차를 마시며 하루를 계획합니다. 이 시간은 그에게 가장 평화롭고 조용한 순간입니다.",
      storyTranslation: "Min-woo climbs Namsan Park every morning. The morning air is fresh, and the view of Seoul Tower is dazzling. Sitting on a park bench, drinking warm green tea, he plans his day. This is the most peaceful and quiet moment for him.",
      wordTranslations: [
        { word: "아침", translation: "morning", pronunciation: "ah-chim", explanation: "Can mean morning or breakfast." },
        { word: "전망", translation: "view / prospect", pronunciation: "jeon-mang", explanation: "Usually refers to a scenic scenic overlook." },
        { word: "눈부십니다", translation: "is dazzling", pronunciation: "nun-bu-sip-ni-da", explanation: "From 눈부시다 (to be dazzling/blinding)." },
        { word: "녹차", translation: "green tea", pronunciation: "nok-cha", explanation: "Traditional Korean green tea." },
        { word: "평화롭고", translation: "peaceful and", pronunciation: "pyeong-hwa-rop-go", explanation: "From 평화롭다 (to be peaceful) + 고 (and)." }
      ]
    },
    "Chinese": {
      title: "茶馆里的午后",
      titleTranslation: "Afternoon in a Teahouse",
      storyText: "张伟喜欢在成都的传统茶馆里度过下午。那里竹椅舒适，茶香四溢。人们聚在一起聊天、打麻将，生活节奏变得非常慢。他点了一杯盖碗茶，静静享受着属于自己的轻松时光。",
      storyTranslation: "Zhang Wei likes to spend his afternoons in a traditional teahouse in Chengdu. The bamboo chairs are comfortable, and the tea aroma is everywhere. People gather to chat and play mahjong, and the pace of life becomes very slow. He ordered a cup of Gaiwan tea, quietly enjoying his own relaxing time.",
      wordTranslations: [
        { word: "喜欢", translation: "to like", pronunciation: "xǐ huan", explanation: "Verb used for general preferences." },
        { word: "茶馆", translation: "teahouse", pronunciation: "chá guǎn", explanation: "A traditional venue for tea culture." },
        { word: "舒服", translation: "comfortable", pronunciation: "shū fu", explanation: "Relates to physical or mental ease." },
        { word: "聊天", translation: "to chat", pronunciation: "liáo tiān", explanation: "Literal meaning: 'to talk about the sky'." },
        { word: "轻松", translation: "relaxed / light", pronunciation: "qīng sōng", explanation: "Free from stress or burden." }
      ]
    },
    "Turkish": {
      title: "Boğaz'da Simit Keyfi",
      titleTranslation: "Simit Joy on the Bosphorus",
      storyText: "Selin her cumartesi İstanbul Boğazı kenarında yürüyüş yapmayı sever. Martıların çığlıkları eşliğinde taze, çıtır bir simit yer ve çayını yudumlar. Denizden gelen rüzgar ona huzur verir. Bu, haftanın en sevdiği ritüelidir.",
      storyTranslation: "Selin loves walking along the Istanbul Bosphorus every Saturday. Accompanied by the cries of seagulls, she eats a fresh, crispy simit and sips her tea. The wind coming from the sea gives her peace. This is her favorite ritual of the week.",
      wordTranslations: [
        { word: "sever", translation: "loves / likes", pronunciation: "seh-ver", explanation: "From the verb 'sevmek'." },
        { word: "çıtır", translation: "crispy", pronunciation: "chuh-tuhr", explanation: "Onomatopoeic word for crunchy food." },
        { word: "simit", translation: "sesame bread ring", pronunciation: "sih-miht", explanation: "Traditional Turkish circular bread encrusted with sesame seeds." },
        { word: "rüzgar", translation: "wind", pronunciation: "ruhz-gahr", explanation: "Noun meaning breeze or wind." },
        { word: "huzur", translation: "peace / serenity", pronunciation: "hu-zuhr", explanation: "Deep mental tranquility." }
      ]
    },
    "Urdu": {
      title: "شالیمار باغ کی سیر",
      titleTranslation: "A Visit to Shalimar Gardens",
      storyText: "عامر اپنے خاندان کے ساتھ اتوار کو شالیمار باغ دیکھنے گیا۔ وہاں خوبصورت فوارے اور ہریالی دیکھ کر دل خوش ہو گیا۔ انہوں نے آموں کے درختوں کے نیچے بیٹھ کر کھانا کھایا اور پرانی یادیں تازہ کیں۔",
      storyTranslation: "Aamir went to visit Shalimar Gardens on Sunday with his family. Seeing the beautiful fountains and greenery, his heart became happy. They sat under mango trees, ate food, and refreshed old memories.",
      wordTranslations: [
        { word: "خاندان", translation: "family", pronunciation: "khan-daan", explanation: "Noun for household / relatives." },
        { word: "خوبصورت", translation: "beautiful", pronunciation: "khoob-soorat", explanation: "Adjective combining 'khoob' (good) and 'soorat' (face/appearance)." },
        { word: "فوارے", translation: "fountains", pronunciation: "fa-waa-ray", explanation: "Plural form of 'fawara'." },
        { word: "درختوں", translation: "trees", pronunciation: "da-rakh-ton", explanation: "Plural oblique form of 'darakht'." },
        { word: "یادیں", translation: "memories", pronunciation: "yaa-dain", explanation: "Feminine plural noun." }
      ]
    }
  };

  return stories[language] || stories["Swedish"];
}

function getMockListening(language: string, level: string, scenario: string) {
  const listenings: Record<string, any> = {
    "Swedish": {
      title: "Fika med en kompass",
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
          question: "Who is paying for the coffee?",
          options: ["Anders", "Sofia", "They split the bill", "The café gives it for free"],
          correctIndex: 1,
          explanation: "Sofia says: 'jag bjuder', which means 'my treat' or 'I'm paying'."
        },
        {
          question: "What is Anders planning to do on Saturday?",
          options: ["Go to the cinema", "Visit a museum", "Hike in Tyresta national park", "Study Swedish"],
          correctIndex: 2,
          explanation: "Anders says: 'Jag ska vandra i Tyresta nationalpark på lördag' (I will hike on Saturday)."
        }
      ]
    },
    "Korean": {
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
  };

  return listenings[language] || listenings["Swedish"];
}

// -------------------------------------------------------------
// VITE DEV SERVER & PRODUCTION ROUTING
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development server with Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    app.use(vite.middlewares);
    console.log("Mounted Vite development middleware.");
  } else {
    // Production file server
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log(`Serving static files from ${distPath} in production mode.`);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LingoJet Backend server running on http://localhost:${PORT}`);
  });
}

startServer();
