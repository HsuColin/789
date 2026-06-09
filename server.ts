import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

// Set up larger limits for media files upload (audio recording or slide images)
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Lazy init of Gemini API according to robust guidelines
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY missing in environment variables');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// REST helper to handle AI Core responses
app.post('/api/generate-note', async (req, res) => {
  try {
    const { type, sourceName, textContent, audioData, audioMime, imageData, imageMime } = req.body;
    const ai = getGeminiClient();

    let parts: any[] = [];
    let promptMsg = '';

    if (type === 'recording') {
      if (audioData && audioData.includes('base64,')) {
        const rawBase64 = audioData.split('base64,')[1];
        parts.push({
          inlineData: {
            data: rawBase64,
            mimeType: audioMime || 'audio/mp3',
          },
        });
        promptMsg = `這是一段課堂錄音檔案（${sourceName}）。請仔細聆聽這段高解析度語音內容並將其完全聽寫、整理：
1. 找出教授講課的核心主題與完整論述邏輯。
2. 進行精準的高質量繁體中文聽寫與摘要整理。
3. 如果裡面有一些背景雜音或不清楚的詞彙，請根據課堂情境與上下文進行合理解讀與修正。`;
      } else {
        // Fallback if audio data is not provided but text transcription input from client microphone exist
        promptMsg = `這是學生的課堂速記或語音聽寫文字：\n\n"${textContent || '無輸入'}"\n\n請根據此語音聽寫文字進行深度課堂筆記整理。`;
      }
    } else if (type === 'ppt') {
      if (imageData && imageData.includes('base64,')) {
        const rawBase64 = imageData.split('base64,')[1];
        parts.push({
          inlineData: {
            data: rawBase64,
            mimeType: imageMime || 'image/png',
          },
        });
        promptMsg = `這是一張課堂簡報、講義或黑板板書圖片（${sourceName}）。
1. 請深度識別圖片中的文字、精緻公式、圖表與核心概念。
2. 將圖片中出現的英文名詞翻譯，並以繁體中文 (zh-TW) 重新梳理。
3. 對簡報中省略的細節或公式含義，進行充裕且詳實的補充說明。`;
        if (textContent) {
          promptMsg += `\n學生隨附之備忘：\n"${textContent}"`;
        }
      } else {
        promptMsg = `這是一段包含課堂講義或 PPT 的文字內容：\n\n"${textContent || '無輸入'}"\n\n請針對此資料進行整理。`;
      }
    } else if (type === 'youtube') {
      promptMsg = `這是一個關於 YouTube 影片的連結（網址：${sourceName}）。
隨附的影片資訊或學生筆記摘要如下：\n\n"${textContent || '無輸入'}"\n\n
請化身為專業助教，針對此 YouTube 教學主題，用精確、充沛且好吸收的繁體中文整理出完美筆記。`;
    }

    // Append standard formatting instructions for comprehensive learning materials
    promptMsg += `\n\n你的輸出必須嚴格符合以下繁體中文 (zh-TW) JSON 格式：
1. title: 生成一個精準且具吸引力的課堂筆記標題（不要有 markdown 符號，例如 "#"）。
2. summary: 高質量的詳細摘要，大約 300~500 字，使用漂亮的 Markdown 格式（可以包含段落、加粗、精緻表格等）來排版，務必結構井然。
3. keyPoints: 回傳此堂課的至少 4 個最重要的邏輯重點（直接以繁體中文句子字串陣列表示，不要加前綴編號如 1., 2.）。
4. cheatSheet: 含有以下子屬性：
   - structure: 考前精簡口訣、定理推導、或關鍵架構整理（支持 Markdown，建議包含步驟、記憶要點，以供學生在考前兩分鐘迅速複習）。
   - mnemonics: 至少 2 個幫助記憶的「趣味口訣/記憶法」 (Mnemonics)，每個包含 term（名詞）、context（背景/意思）、trick（口訣/聯想技巧，例如諧音、圖像聯想法）。
   - formulasOrBriefs: 至少 2 個必考精選公式或核心術語複習，包含 title（公式/名詞名稱）與 desc（詳細推導或白話解釋）。
5. quizzes: 正好 5 題互動測驗題目。每一題包含 question（題目敘述，著重觀念理解與應用）、options（4個選項的一維陣列）、correctIndex（正確答案索引 0-3）、explanation（詳盡的解析，告訴學生為什麼選這個、其他選項為什麼不對）。

請使用 'gemini-3.5-flash' 模型，並確保 JSON 屬性完整無缺。`;

    parts.push({
      text: promptMsg,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: { parts: parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['title', 'summary', 'keyPoints', 'cheatSheet', 'quizzes'],
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            cheatSheet: {
              type: Type.OBJECT,
              required: ['structure', 'mnemonics', 'formulasOrBriefs'],
              properties: {
                structure: { type: Type.STRING },
                mnemonics: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ['term', 'context', 'trick'],
                    properties: {
                      term: { type: Type.STRING },
                      context: { type: Type.STRING },
                      trick: { type: Type.STRING },
                    },
                  },
                },
                formulasOrBriefs: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ['title', 'desc'],
                    properties: {
                      title: { type: Type.STRING },
                      desc: { type: Type.STRING },
                    },
                  },
                },
              },
            },
            quizzes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ['question', 'options', 'correctIndex', 'explanation'],
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    const bodyText = response.text;
    if (!bodyText) {
      throw new Error('Gemini did not return any JSON text');
    }

    const parsedData = JSON.parse(bodyText.trim());
    res.json(parsedData);
  } catch (err: any) {
    console.error('API Error:', err);
    res.status(500).json({ error: err?.message || '伺服器端錯誤，請確認 GEMINI_API_KEY 設定是否正確' });
  }
});

// Serve assets based on environment settings and SPA fallbacks
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running actively on http://0.0.0.0:${PORT}`);
  });
}

startServer();
