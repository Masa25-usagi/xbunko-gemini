import React from 'react';
import {
  Home,
  MessageSquareQuote,
  Flame,
  Play,
  Pause,
  Key,
  Sparkles
} from 'lucide-react';
import { TimelineFilter, Character } from '../types';

interface SidebarLeftProps {
  currentFilter: TimelineFilter;
  onFilterChange: (filter: TimelineFilter) => void;
  selectedCharacterId: string | null;
  onSelectCharacter: (id: string | null) => void;
  characters: Character[];
  isPlaying: boolean;
  onTogglePlay: () => void;
  onOpenImportModal: () => void;
  onOpenApiKeyModal: () => void;
  totalPosts: number;
  displayedPosts: number;
}

export const SidebarLeft: React.FC<SidebarLeftProps> = ({
  currentFilter,
  onFilterChange,
  selectedCharacterId,
  onSelectCharacter,
  characters,
  isPlaying,
  onTogglePlay,
  onOpenImportModal,
  onOpenApiKeyModal,
  totalPosts,
  displayedPosts,
}) => {
  const progress = totalPosts > 0 ? Math.min(100, (displayedPosts / totalPosts) * 100) : 0;

  const navButtonBase =
    'flex items-center justify-center xl:justify-start gap-4 px-3 xl:px-4 py-3 rounded-full text-[19px] transition-colors w-full text-left';

  return (
    <aside className="w-[76px] xl:w-[275px] h-screen sticky top-0 flex flex-col justify-between px-2 xl:px-3 py-4 border-r border-xb-border select-none transition-[width] duration-200">
      <div className="flex flex-col gap-2 items-center xl:items-stretch">
        {/* App Logo */}
        <div className="flex items-center gap-2 xl:px-3 py-2 mb-2">
          <div className="w-10 h-10 rounded-full bg-xb-contrast text-xb-contrasttext flex items-center justify-center font-black text-2xl shadow-lg flex-shrink-0">
            𝕏
          </div>
          <div className="hidden xl:block">
            <div className="flex items-center gap-1">
              <span className="font-bold text-lg text-xb-strong">X文庫</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold">
                Gemini
              </span>
            </div>
            <p className="text-[11px] text-xb-muted">青空文庫 × Xタイムライン</p>
          </div>
        </div>

        {/* Navigation Menus */}
        <nav className="flex flex-col gap-1 w-full">
          <button
            onClick={() => {
              onFilterChange('all');
              onSelectCharacter(null);
            }}
            title="すべて"
            className={`${navButtonBase} ${
              currentFilter === 'all' && !selectedCharacterId
                ? 'font-bold text-xb-strong bg-xb-hoverstrong'
                : 'text-xb-text hover:bg-xb-hoverstrong'
            }`}
          >
            <Home className="w-6 h-6 flex-shrink-0" />
            <span className="hidden xl:inline">すべて</span>
          </button>

          <button
            onClick={() => {
              onFilterChange('dialogue_only');
              onSelectCharacter(null);
            }}
            title="セリフだけ"
            className={`${navButtonBase} ${
              currentFilter === 'dialogue_only'
                ? 'font-bold text-xb-strong bg-xb-hoverstrong'
                : 'text-xb-text hover:bg-xb-hoverstrong'
            }`}
          >
            <MessageSquareQuote className="w-6 h-6 text-sky-500 flex-shrink-0" />
            <span className="hidden xl:inline">セリフだけ</span>
          </button>

          <button
            onClick={() => {
              onFilterChange('buzz_order');
              onSelectCharacter(null);
            }}
            title="バズり順"
            className={`${navButtonBase} ${
              currentFilter === 'buzz_order'
                ? 'font-bold text-xb-strong bg-xb-hoverstrong'
                : 'text-xb-text hover:bg-xb-hoverstrong'
            }`}
          >
            <Flame className="w-6 h-6 text-rose-500 flex-shrink-0" />
            <span className="hidden xl:inline">バズり順</span>
          </button>
        </nav>

        {/* Playback Control — compact (icon rail) */}
        <button
          onClick={onTogglePlay}
          title={isPlaying ? '再生を一時停止' : 'タイムラインを再生'}
          className={`xl:hidden mt-3 w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 ${
            isPlaying
              ? 'bg-amber-500/15 text-amber-500 border border-amber-500/40'
              : 'bg-xb-accent text-white hover:bg-xb-accenthover'
          }`}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current" />
          )}
        </button>

        {/* Playback Control (Auto-Stream Mode) — full */}
        <div className="hidden xl:block mt-3 p-3 rounded-2xl bg-xb-surface border border-xb-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-xb-muted uppercase tracking-wider">
              ライブ再生
            </span>
            <span className="text-xs font-medium text-xb-accent tabular-nums">
              {displayedPosts} / {totalPosts} 件
            </span>
          </div>

          {/* 読書進捗バー */}
          <div className="h-1 rounded-full bg-xb-elevated overflow-hidden mb-2.5">
            <div
              className="h-full bg-xb-accent rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <button
            onClick={onTogglePlay}
            className={`w-full py-2.5 px-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${
              isPlaying
                ? 'bg-amber-500/15 text-amber-500 border border-amber-500/40 hover:bg-amber-500/25'
                : 'bg-xb-accent text-white hover:bg-xb-accenthover'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>再生を一時停止</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>タイムラインを再生</span>
              </>
            )}
          </button>
        </div>

        {/* Character Filter */}
        <div className="mt-2 w-full">
          <div className="hidden xl:flex px-3 py-1 text-xs font-semibold text-xb-muted uppercase tracking-wider items-center justify-between">
            <span>登場人物で絞り込み</span>
            {selectedCharacterId && (
              <button
                onClick={() => onSelectCharacter(null)}
                className="text-[11px] text-xb-accent hover:underline lowercase font-normal"
              >
                解除
              </button>
            )}
          </div>
          <div className="flex flex-col items-center xl:items-stretch gap-0.5 mt-1 max-h-48 overflow-y-auto xl:pr-1">
            {characters.map((char) => {
              const isSelected = selectedCharacterId === char.id;
              return (
                <button
                  key={char.id}
                  onClick={() => onSelectCharacter(isSelected ? null : char.id)}
                  title={`${char.name} で絞り込み`}
                  className={`flex items-center justify-center xl:justify-start gap-2.5 px-2 xl:px-3 py-2 rounded-xl text-left transition-colors text-sm w-full ${
                    isSelected
                      ? 'bg-xb-accent/20 text-xb-strong border border-xb-accent/40 font-medium'
                      : 'text-xb-text hover:bg-xb-surface border border-transparent'
                  }`}
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                    style={{ backgroundColor: char.avatarBg || '#374151' }}
                  >
                    {char.avatar}
                  </span>
                  <span className="hidden xl:inline truncate flex-1">{char.name}</span>
                  <span className="hidden xl:inline text-[11px] text-xb-muted">@{char.handle}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button: Parse Novel */}
        <button
          onClick={onOpenImportModal}
          title="青空文庫を読み込む"
          className="mt-4 w-12 h-12 xl:w-full xl:h-auto xl:py-3 xl:px-4 bg-xb-accent hover:bg-xb-accenthover text-white font-bold rounded-full flex items-center justify-center gap-2 shadow-lg shadow-xb-accent/20 transition-all hover:shadow-xb-accent/30 active:scale-95"
        >
          <Sparkles className="w-5 h-5 flex-shrink-0" />
          <span className="hidden xl:inline">青空文庫を読み込む</span>
        </button>
      </div>

      {/* Bottom User / Settings Bar */}
      <div className="pt-3 border-t border-xb-border w-full">
        <button
          onClick={onOpenApiKeyModal}
          title="Gemini API 設定"
          className="w-full flex items-center justify-center xl:justify-start gap-3 p-2.5 rounded-full hover:bg-xb-hoverstrong transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white flex-shrink-0">
            <Key className="w-4 h-4" />
          </div>
          <div className="hidden xl:block flex-1 min-w-0">
            <p className="text-sm font-bold text-xb-strong truncate">Gemini API 設定</p>
            <p className="text-xs text-xb-muted truncate">モデル: gemini-1.5-flash</p>
          </div>
        </button>
      </div>
    </aside>
  );
};
