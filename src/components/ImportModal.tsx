import React, { useState } from 'react';
import { analyzeNovelWithGemini, getStoredApiKey } from '../services/api';
import { NovelData } from '../types';
import { X, Sparkles, Globe, FileText, Loader2, AlertCircle } from 'lucide-react';

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

  const inputClass =
    'w-full bg-xb-surface border border-xb-border focus:border-xb-accent focus:ring-2 focus:ring-xb-accent/30 focus:outline-none rounded-xl text-xb-text text-sm placeholder-xb-muted transition-shadow disabled:opacity-60';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-xb-overlay/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="青空文庫をGeminiで解析"
        className="bg-xb-bg border border-xb-border rounded-2xl w-full max-w-xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          aria-label="閉じる"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-xb-hoverstrong text-xb-muted hover:text-xb-strong transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-xb-strong">青空文庫をGeminiで解析</h3>
            <p className="text-xs text-xb-muted">小説をXタイムライン化する</p>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex rounded-xl bg-xb-surface p-1 mb-5 border border-xb-border">
          <button
            onClick={() => { setTab('url'); setError(null); }}
            disabled={loading}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              tab === 'url' ? 'bg-xb-accent text-white shadow' : 'text-xb-muted hover:text-xb-strong'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>青空文庫URL</span>
          </button>
          <button
            onClick={() => { setTab('text'); setError(null); }}
            disabled={loading}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              tab === 'text' ? 'bg-xb-accent text-white shadow' : 'text-xb-muted hover:text-xb-strong'
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
              <label className="block text-xs font-semibold text-xb-text mb-1.5">
                青空文庫 作品HTMLのURL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.aozora.gr.jp/cards/000879/files/127_15260.html"
                disabled={loading}
                className={`${inputClass} px-4 py-2.5`}
              />
            </div>

            {/* Quick Suggestions */}
            <div>
              <span className="text-xs text-xb-muted font-medium block mb-2">
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
                    className="p-2.5 rounded-xl bg-xb-surface hover:bg-xb-elevated border border-xb-border hover:border-xb-muted/50 text-left transition-all active:scale-[0.98] disabled:opacity-60"
                  >
                    <p className="text-xs font-bold text-xb-strong truncate">{sample.title}</p>
                    <p className="text-[11px] text-xb-muted truncate">{sample.author}</p>
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
                <label className="block text-xs font-semibold text-xb-text mb-1">
                  作品タイトル
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例: 羅生門"
                  disabled={loading}
                  className={`${inputClass} px-3 py-2`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-xb-text mb-1">
                  著者名
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="例: 芥川龍之介"
                  disabled={loading}
                  className={`${inputClass} px-3 py-2`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-xb-text mb-1">
                小説本文（会話や段落を含むテキスト）
              </label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="ある日の暮方の事である。一人の下人が、羅生門の下で雨やみを待っていた……"
                rows={6}
                disabled={loading}
                className={`${inputClass} px-3 py-2 resize-none`}
              />
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/50 text-xs text-rose-500 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="leading-relaxed">{error}</p>
              {error.includes('API Key') && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenApiKeyModal();
                  }}
                  className="mt-1.5 text-xs underline font-bold hover:opacity-80 transition-opacity rounded-sm"
                >
                  ここをクリックしてAPIキーを設定する
                </button>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-xb-border">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-bold text-xb-text hover:bg-xb-hoverstrong rounded-xl transition-colors disabled:opacity-50"
          >
            キャンセル
          </button>
          <button
            onClick={handleStartAnalysis}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-bold bg-xb-accent hover:bg-xb-accenthover text-white rounded-xl shadow-lg shadow-xb-accent/20 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-60"
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
