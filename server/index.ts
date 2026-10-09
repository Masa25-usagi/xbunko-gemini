import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { fetchAozoraNovel, cleanAozoraText } from './aozoraParser';
import { parseNovelWithGemini } from './geminiService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Presets mapping
const PRESET_FILES: Record<string, string> = {
  melos: 'melos.json',
  ryouriten: 'ryouriten.json',
  botchan: 'botchan.json',
};

// 1. Get presets list
app.get('/api/presets', (req, res) => {
  res.json([
    { id: 'melos', title: '走れメロス', author: '太宰治', description: '「メロスは激怒した」でおなじみ。友情と信念の疾走劇。' },
    { id: 'ryouriten', title: '注文の多い料理店', author: '宮沢賢治', description: '「どなたもどうかお入りください」山奥の怪しいレストラン。' },
    { id: 'botchan', title: '坊っちゃん', author: '夏目漱石', description: '「親譲りの無鉄砲」痛快な松山中学奮闘記。' },
  ]);
});

// 2. Get preset details
app.get('/api/presets/:id', (req, res) => {
  const { id } = req.params;
  const fileName = PRESET_FILES[id];

  if (!fileName) {
    return res.status(404).json({ error: 'プリセットが見つかりません' });
  }

  try {
    const filePath = path.join(__dirname, 'presets', fileName);
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    return res.json(data);
  } catch (error) {
    console.error(`Failed to read preset ${id}:`, error);
    return res.status(500).json({ error: 'プリセットの読み込みに失敗しました' });
  }
});

// 3. Parse Aozora novel using URL or Text + Gemini
app.post('/api/parse-aozora', async (req, res) => {
  const { url, rawText, title: inputTitle, author: inputAuthor, apiKey: clientApiKey } = req.body;
  const apiKey = clientApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(400).json({
      error: 'Gemini API Key が設定されていません。右側の「設定」からGemini APIキーを入力してください。',
    });
  }

  try {
    let title = inputTitle || '無題の作品';
    let author = inputAuthor || '不明な著者';
    let paragraphs: string[] = [];

    if (url) {
      console.log(`Fetching Aozora URL: ${url}`);
      const parsed = await fetchAozoraNovel(url);
      title = parsed.title || title;
      author = parsed.author || author;
      paragraphs = parsed.paragraphs;
    } else if (rawText) {
      const cleaned = cleanAozoraText(rawText);
      paragraphs = cleaned
        .split('\n')
        .map(p => p.trim())
        .filter(p => p.length > 0);
    } else {
      return res.status(400).json({ error: '青空文庫のURLまたは本文テキストを入力してください。' });
    }

    if (paragraphs.length === 0) {
      return res.status(400).json({ error: '本文の抽出ができませんでした。' });
    }

    console.log(`Analyzing novel "${title}" by ${author} with Gemini...`);
    const novelData = await parseNovelWithGemini(title, author, paragraphs, apiKey);

    return res.json(novelData);
  } catch (error: any) {
    console.error('Error during novel parsing:', error);
    return res.status(500).json({
      error: error.message || 'Geminiによる解析処理中にエラーが発生しました。',
    });
  }
});

// Serve frontend build if dist exists
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`X-Bunko Gemini Backend running on http://localhost:${PORT}`);
});
