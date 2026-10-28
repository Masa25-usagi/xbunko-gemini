import React, { useState, useEffect } from 'react';
import { getStoredApiKey, setStoredApiKey } from '../services/api';
import { X, Key, ExternalLink, ShieldCheck, Check } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredApiKey());
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setStoredApiKey(apiKey.trim());
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setStoredApiKey('');
    setApiKey('');
    setSaved(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-xb-overlay/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Gemini API 設定"
        className="bg-xb-bg border border-xb-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="閉じる"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-xb-hoverstrong text-xb-muted hover:text-xb-strong transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white flex-shrink-0">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-xb-strong">Gemini API 設定</h3>
            <p className="text-xs text-xb-muted">青空文庫のリアルタイム解析に使用</p>
          </div>
        </div>

        {/* Info */}
        <div className="mb-4 p-3 rounded-xl bg-xb-surface border border-xb-border text-xs text-xb-muted space-y-1.5">
          <div className="flex items-center gap-1.5 text-emerald-500 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>ローカル安全保存</span>
          </div>
          <p className="leading-relaxed">
            APIキーはお使いのブラウザ（LocalStorage）にのみ保存され、外部サーバーに共有されることはありません。
          </p>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xb-accenttext hover:underline mt-1 font-medium rounded-sm"
          >
            <span>Google AI Studio で無料のAPIキーを取得</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Input Field */}
        <div className="space-y-2 mb-6">
          <label className="block text-xs font-semibold text-xb-text">
            Gemini API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-4 py-2.5 bg-xb-surface border border-xb-border focus:border-xb-accent focus:ring-2 focus:ring-xb-accent/30 focus:outline-none rounded-xl text-xb-text text-sm placeholder-xb-muted transition-shadow"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
          >
            キーを削除
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-xb-text hover:bg-xb-hoverstrong rounded-xl transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-sm font-bold bg-xb-accent hover:bg-xb-accenthover text-white rounded-xl shadow-lg shadow-xb-accent/20 transition-all active:scale-95 flex items-center gap-1.5"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>保存完了!</span>
                </>
              ) : (
                <span>保存する</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
