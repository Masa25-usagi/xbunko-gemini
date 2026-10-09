import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { NovelData } from '../src/types';

export async function parseNovelWithGemini(
  title: string,
  author: string,
  paragraphs: string[],
  apiKey: string
): Promise<NovelData> {
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Choose flash model for speed and quality
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.3,
    },
  });

  // Limit paragraphs for prompt if text is too long (around 30-50 key paragraphs)
  const sampleParagraphs = paragraphs.slice(0, 40).join('\n\n');

  const systemPrompt = `
あなたは青空文庫の小説を「X（旧Twitter）のタイムライン」風に変換する敏腕演出プロデューサー兼AIです。
与えられた小説のタイトル、著者、および本文を読み解き、以下の指示に従って「X文庫」形式のJSONデータを出力してください。

【出力仕様】
1. **characters（登場人物アカウント一覧）**:
   - 小説の主要登場人物と、地の文を担当する「語り手（太宰治（語り手）など）」のアカウントを作成してください。
   - id: 英数字（例: "merosu", "narrator", "dionisu"）
   - name: キャラクター名（例: "メロス", "太宰治（語り手）"）
   - handle: Xのアカウント名（@は不要。例: "merosu_run", "narrator_dazai", "tyrant_dionysus"）
   - avatar: キャラクターを象徴する絵文字1文字（例: "🏃‍♂️", "📖", "👑", "🎩"）
   - avatarBg: アバター背景色（HEXカラーコード。例: "#2563EB", "#374151"）
   - bio: Xのプロフィール文（100文字以内でその人物の性格・立場をユーモラスかつ的確に表現）
   - verified: 主人公や王、語り手など主要人物は true、モブは false

2. **trends（この物語の世界でのXトレンド 4〜5件）**:
   - 物語の出来事や名言に基づいたハッシュタグまたはトピック（例: "#メロス激怒", "#邪智暴虐の王", "#友を人質に"）
   - postsCount: 投稿数（例: "54.2K", "12.8K"）
   - category: カテゴリ名（例: "シラクス速報", "ギリシャ・トレンド"）

3. **posts（タイムラインに流れるポスト一覧）**:
   - 小説の段落やセリフを、各登場人物や語り手がXにリアルタイム投稿しているかのように順番に並べてください（15〜25件程度）。
   - id: ユニークなID（例: "p1", "p2", ...）
   - speakerId: 発言したキャラクターのid（地の文は語り手のid）
   - text: 投稿本文。小説の味わいを残しつつ、Xのポストとして自然に読める形。
   - type: "narration"（地の文） | "dialogue"（セリフ） | "thought"（心の声）
   - likes: いいね数（名言やクライマックスは数万〜10万以上、日常は数百〜数千）
   - reposts: リポスト数
   - views: インプレッション（表示回数）
   - buzzRate: バズ度（0〜100%）。特に有名なセリフや激怒シーン、クライマックスは95〜100%！
   - timestamp: "5分前", "3分前", "1分前", "たった今" など時系列

出力は必ず指定のJSONスキーマに従ってください。
`;

  const userContent = `
【作品名】${title}
【著者】${author}
【本文抜粋】
${sampleParagraphs}
`;

  const result = await model.generateContent([
    { text: systemPrompt },
    { text: userContent },
  ]);

  const responseText = result.response.text();
  try {
    const parsed = JSON.parse(responseText);
    return {
      title,
      author,
      characters: parsed.characters || [],
      posts: parsed.posts || [],
      trends: parsed.trends || [],
    };
  } catch (error) {
    console.error('Failed to parse Gemini JSON output:', responseText);
    throw new Error('Geminiの出力解析に失敗しました。もう一度お試しください。');
  }
}
