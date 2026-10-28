import React from 'react';
import { NovelData, TimelineFilter } from '../types';
import { Sparkles, SlidersHorizontal, RefreshCw } from 'lucide-react';

interface HeaderProps {
  novel: NovelData;
  filter: TimelineFilter;
  onFilterChange: (f: TimelineFilter) => void;
  selectedCharacterName: string | null;
  onClearCharacter: () => void;
  onResetStream: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  novel,
  filter,
  onFilterChange,
  selectedCharacterName,
  onClearCharacter,
  onResetStream,
}) => {
  const tabBase =
    'flex-1 py-3 text-center transition-colors relative hover:bg-xb-hover focus-visible:bg-xb-hover';

  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-xb-bg/80 border-b border-xb-border">
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[19px] font-bold text-xb-strong truncate leading-tight">
              {novel.title}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-xb-elevated text-xb-muted font-medium border border-xb-border/60 flex-shrink-0">
              {novel.author}
            </span>
          </div>
          {selectedCharacterName ? (
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-xb-accent">
              <span>絞り込み: {selectedCharacterName} のみ</span>
              <button
                onClick={onClearCharacter}
                className="underline hover:text-xb-strong transition-colors rounded-sm"
              >
                (解除)
              </button>
            </div>
          ) : (
            <p className="text-xs text-xb-muted mt-0.5">
              全 {novel.posts.length} ポスト · 登場アカウント {novel.characters.length} 名
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onResetStream}
            className="p-2 rounded-full hover:bg-xb-hoverstrong text-xb-muted hover:text-xb-strong transition-all active:scale-90"
            title="最初から再生・リセット"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-t border-xb-border/60 text-sm font-medium">
        <button
          onClick={() => { onFilterChange('all'); onClearCharacter(); }}
          className={`${tabBase} ${
            filter === 'all' && !selectedCharacterName ? 'font-bold text-xb-strong' : 'text-xb-muted hover:text-xb-text'
          }`}
        >
          <span>すべて</span>
          {filter === 'all' && !selectedCharacterName && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-xb-accent rounded-full" />
          )}
        </button>

        <button
          onClick={() => { onFilterChange('dialogue_only'); onClearCharacter(); }}
          className={`${tabBase} ${
            filter === 'dialogue_only' ? 'font-bold text-xb-strong' : 'text-xb-muted hover:text-xb-text'
          }`}
        >
          <span>セリフだけ</span>
          {filter === 'dialogue_only' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-xb-accent rounded-full" />
          )}
        </button>

        <button
          onClick={() => { onFilterChange('buzz_order'); onClearCharacter(); }}
          className={`${tabBase} ${
            filter === 'buzz_order' ? 'font-bold text-xb-strong' : 'text-xb-muted hover:text-xb-text'
          }`}
        >
          <span>🔥 バズり順</span>
          {filter === 'buzz_order' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-rose-500 rounded-full" />
          )}
        </button>
      </div>
    </header>
  );
};
