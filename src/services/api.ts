import { NovelData } from '../types';

export interface PresetItem {
  id: string;
  title: string;
  author: string;
  description: string;
}

const API_BASE = '/api';
const LOCAL_STORAGE_API_KEY = 'xbunko_gemini_api_key';

export function getStoredApiKey(): string {
  return localStorage.getItem(LOCAL_STORAGE_API_KEY) || '';
}

export function setStoredApiKey(key: string): void {
  if (key) {
    localStorage.setItem(LOCAL_STORAGE_API_KEY, key.trim());
  } else {
    localStorage.removeItem(LOCAL_STORAGE_API_KEY);
  }
}

export async function getPresets(): Promise<PresetItem[]> {
  const res = await fetch(`${API_BASE}/presets`);
  if (!res.ok) throw new Error('プリセット一覧の取得に失敗しました');
  return res.json();
}

export async function getPresetData(id: string): Promise<NovelData> {
  const res = await fetch(`${API_BASE}/presets/${id}`);
  if (!res.ok) throw new Error(`プリセット(${id})の取得に失敗しました`);
  return res.json();
}

export async function analyzeNovelWithGemini(params: {
  url?: string;
  rawText?: string;
  title?: string;
  author?: string;
  apiKey?: string;
}): Promise<NovelData> {
  const apiKey = params.apiKey || getStoredApiKey();
  const res = await fetch(`${API_BASE}/parse-aozora`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...params, apiKey }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Geminiによる小説解析に失敗しました');
  }
  return data;
}
