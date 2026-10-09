import iconv from 'iconv-lite';

export interface ParsedAozora {
  title: string;
  author: string;
  bodyText: string;
  paragraphs: string[];
}

/**
 * Clean Aozora Bunko text by removing ruby annotations, formatting tags, etc.
 */
export function cleanAozoraText(rawText: string): string {
  let cleaned = rawText;

  // Remove HTML tags if present
  cleaned = cleaned.replace(/<rt>.*?<\/rt>/g, '');
  cleaned = cleaned.replace(/<rp>.*?<\/rp>/g, '');
  cleaned = cleaned.replace(/<[^>]+>/g, '');

  // Remove text-based ruby: ｜漢字《かんじ》 or 漢字《かんじ》
  cleaned = cleaned.replace(/｜([^《]+)《[^》]+》/g, '$1');
  cleaned = cleaned.replace(/([一-龠々〆ヵヶ]+)《[^》]+》/g, '$1');
  cleaned = cleaned.replace(/《[^》]+》/g, ''); // Any remaining ruby tags

  // Remove input notes: ［＃...］
  cleaned = cleaned.replace(/［＃[^］]+］/g, '');

  // Normalize full-width spaces and trailing whitespace
  cleaned = cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  return cleaned;
}

/**
 * Fetch and parse Aozora Bunko HTML from a given URL.
 */
export async function fetchAozoraNovel(url: string): Promise<ParsedAozora> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`青空文庫ページの取得に失敗しました: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Try decoding as Shift_JIS first (most Aozora HTMLs are Shift_JIS), fallback to UTF-8
  let html = iconv.decode(buffer, 'Shift_JIS');
  if (html.includes('charset=utf-8') || html.includes('charset=UTF-8')) {
    html = iconv.decode(buffer, 'utf-8');
  }

  // Extract Title
  let title = '不明な作品';
  const titleMatch = html.match(/<h1 class="title">([\s\S]*?)<\/h1>/i) || html.match(/<title>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    title = cleanAozoraText(titleMatch[1]).trim();
  }

  // Extract Author
  let author = '不明な著者';
  const authorMatch = html.match(/<h2 class="author">([\s\S]*?)<\/h2>/i);
  if (authorMatch) {
    author = cleanAozoraText(authorMatch[1]).trim();
  }

  // Extract Main Text
  let bodyText = '';
  const mainTextMatch = html.match(/<div class="main_text">([\s\S]*?)<\/div>/i);
  if (mainTextMatch) {
    bodyText = mainTextMatch[1];
  } else {
    // If no main_text div, try cleaning all body
    const bodyMatch = html.match(/<body[\s\S]*?>([\s\S]*?)<\/body>/i);
    bodyText = bodyMatch ? bodyMatch[1] : html;
  }

  bodyText = cleanAozoraText(bodyText);

  // Split into paragraphs/sentences suitable for X timeline
  const rawParagraphs = bodyText
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0 && !p.startsWith('底本：') && !p.startsWith('初出：'));

  return {
    title,
    author,
    bodyText,
    paragraphs: rawParagraphs,
  };
}
