import React, { useState } from 'react';
import { analyzeNovelWithGemini, getStoredApiKey } from '../services/api';
import { NovelData } from '../types';
import { X, Sparkles, Globe, FileText, Loader2, AlertCircle, Bookmark } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNovelParsed: (novel: NovelData) => void;
  onOpenApiKeyModal: () => void;
}

const SAMPLE_AOZORA_URLS = [
  {
    title: '羅生門',
    author: '芥川龍之介',
    url: 'https://www.aozora.gr.jp/cards/000879/files/127_15260.html',
  },
  {
    title: '山月記',
    author: '中島敦',
    url: 'https://www.aozora.gr.jp/cards/000119/files/624_14544.html',
  },
  {
    title: '檸檬',
    author: '梶井基次郎',
    url: 'https://www.aozora.gr.jp/cards/000074/files/424_19826.html',
  },
  {
    title: 'ごんぎつね',
    author: '新美南吉',
    url: 'https://www.aozora.gr.jp/cards/000121/files/628_14895.html',
  }
];

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onNovelParsed,
  onOpenApiKeyModal,
}) => {
  const [tab, setTab] = useState<'url' | 'text'>('url');
  const [url, setUrl] = useState('');
  const [rawText, setRawText] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartAnalysis = async () => {
    setError(null);
    const hasKey = getStoredApiKey();

    if (!hasKey) {
      setError('Gemini API Key が設定されていません。「APIキーを設定」から登録してください。');
      return;
    }

    if (tab === 'url' && !url.trim()) {
      setError('青空文庫の作品URLを入力してください。');
      return;
    }

    if (tab === 'text' && !rawText.trim()) {
      setError('小説の本文を入力してください。');
      return;
    }

    try {
      setLoading(true);
      const parsedData = await analyzeNovelWithGemini({
        url: tab === 'url' ? url.trim() : undefined,
        rawText: tab === 'text' ? rawText.trim() : undefined,
        title: title.trim() || undefined,
        author: author.trim() || undefined,
      });

      onNovelParsed(parsedData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Geminiの解析に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-[#000000] border border-[#2f3336] rounded-2xl w-full max-w-xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#181818] text-[#71767b] hover:text-white transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">青空文庫をGeminiで解析</h3>
            <p className="text-xs text-[#71767b]">小説をXタイムライン化する</p>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex rounded-xl bg-[#16181c] p-1 mb-5 border border-[#2f3336]">
          <button
            onClick={() => { setTab('url'); setError(null); }}
            disabled={loading}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
              tab === 'url' ? 'bg-xblue text-white shadow' : 'text-[#71767b] hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>青空文庫URL</span>
          </button>
          <button
            onClick={() => { setTab('text'); setError(null); }}
            disabled={loading}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
              tab === 'text' ? 'bg-xblue text-white shadow' : 'text-[#71767b] hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>本文直接貼り付け</span>
          </button>
        </div>

        {/* URL Mode */}
        {tab === 'url' && (
          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-xs font-semibold text-[#e7e9ea] mb-1.5">
                青空文庫 作品HTMLのURL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.aozora.gr.jp/cards/000879/files/127_15260.html"
                disabled={loading}
                className="w-full px-4 py-2.5 bg-[#16181c] border border-[#2f3336] focus:border-xblue focus:outline-none rounded-xl text-white text-sm placeholder-[#71767b]"
              />
            </div>

            {/* Quick Suggestions */}
            <div>
              <span className="text-xs text-[#71767b] font-medium block mb-2">
                ワンクリックでおすすめ作品を入力:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_AOZORA_URLS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setUrl(sample.url);
                      setTitle(sample.title);
                      setAuthor(sample.author);
                    }}
                    disabled={loading}
                    className="p-2.5 rounded-xl bg-[#16181c] hover:bg-[#202327] border border-[#2f3336] text-left transition-colors"
                  >
                    <p className="text-xs font-bold text-white truncate">{sample.title}</p>
                    <p className="text-[11px] text-[#71767b] truncate">{sample.author}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Text Mode */}
        {tab === 'text' && (
          <div className="space-y-3 mb-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#e7e9ea] mb-1">
                  作品タイトル
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例: 羅生門"
                  disabled={loading}
                  className="w-full px-3 py-2 bg-[#16181c] border border-[#2f3336] focus:border-xblue focus:outline-none rounded-xl text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#e7e9ea] mb-1">
                  著者名
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="例: 芥川龍之介"
                  disabled={loading}
                  className="w-full px-3 py-2 bg-[#16181c] border border-[#2f3336] focus:border-xblue focus:outline-none rounded-xl text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#e7e9ea] mb-1">
                小説本文（会話や段落を含むテキスト）
              </label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="ある日の暮方の事である。一人の下人が、羅生門の下で雨やみを待っていた……"
                rows={6}
                disabled={loading}
                className="w-full px-3 py-2 bg-[#16181c] border border-[#2f3336] focus:border-xblue focus:outline-none rounded-xl text-white text-sm resize-none"
              />
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p>{error}</p>
              {error.includes('API Key') && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenApiKeyModal();
                  }}
                  className="mt-1.5 text-xs text-rose-200 underline font-bold hover:text-white"
                >
                  ここをクリックしてAPIキーを設定する
                </button>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#2f3336]">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-bold text-[#e7e9ea] hover:bg-[#181818] rounded-xl transition-colors disabled:opacity-50"
          >
            キャンセル
          </button>
          <button
            onClick={handleStartAnalysis}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-bold bg-xblue hover:bg-xblue-hover text-white rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Geminiで話者・TL解析中…</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>タイムラインを生成</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
