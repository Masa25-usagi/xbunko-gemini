import React from 'react';
import { 
  Home, 
  MessageSquareQuote, 
  Flame, 
  Users, 
  Play, 
  Pause, 
  PlusCircle, 
  Key, 
  BookOpen, 
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
  return (
    <aside className="w-[275px] h-screen sticky top-0 flex flex-col justify-between px-3 py-4 border-r border-[#2f3336] select-none">
      <div className="flex flex-col gap-2">
        {/* App Logo */}
        <div className="flex items-center gap-2 px-3 py-2 mb-2">
          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-black text-2xl shadow-lg">
            𝕏
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-lg text-white">X文庫</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold">
                Gemini
              </span>
            </div>
            <p className="text-[11px] text-[#71767b]">青空文庫 × Xタイムライン</p>
          </div>
        </div>

        {/* Navigation Menus */}
        <nav className="flex flex-col gap-1">
          <button
            onClick={() => {
              onFilterChange('all');
              onSelectCharacter(null);
            }}
            className={`flex items-center gap-4 px-4 py-3 rounded-full text-[19px] transition-colors w-full text-left ${
              currentFilter === 'all' && !selectedCharacterId
                ? 'font-bold text-white bg-[#181818]'
                : 'text-[#e7e9ea] hover:bg-[#181818]'
            }`}
          >
            <Home className="w-6 h-6" />
            <span>すべて</span>
          </button>

          <button
            onClick={() => {
              onFilterChange('dialogue_only');
              onSelectCharacter(null);
            }}
            className={`flex items-center gap-4 px-4 py-3 rounded-full text-[19px] transition-colors w-full text-left ${
              currentFilter === 'dialogue_only'
                ? 'font-bold text-white bg-[#181818]'
                : 'text-[#e7e9ea] hover:bg-[#181818]'
            }`}
          >
            <MessageSquareQuote className="w-6 h-6 text-sky-400" />
            <span>セリフだけ</span>
          </button>

          <button
            onClick={() => {
              onFilterChange('buzz_order');
              onSelectCharacter(null);
            }}
            className={`flex items-center gap-4 px-4 py-3 rounded-full text-[19px] transition-colors w-full text-left ${
              currentFilter === 'buzz_order'
                ? 'font-bold text-white bg-[#181818]'
                : 'text-[#e7e9ea] hover:bg-[#181818]'
            }`}
          >
            <Flame className="w-6 h-6 text-rose-500" />
            <span>バズり順</span>
          </button>
        </nav>

        {/* Playback Control (Auto-Stream Mode) */}
        <div className="mt-3 p-3 rounded-2xl bg-[#16181c] border border-[#2f3336]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#71767b] uppercase tracking-wider">
              ライブ再生
            </span>
            <span className="text-xs font-medium text-xblue">
              {displayedPosts} / {totalPosts} 件
            </span>
          </div>

          <button
            onClick={onTogglePlay}
            className={`w-full py-2.5 px-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-xblue text-white hover:bg-xblue-hover'
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
        <div className="mt-2">
          <div className="px-3 py-1 text-xs font-semibold text-[#71767b] uppercase tracking-wider flex items-center justify-between">
            <span>登場人物で絞り込み</span>
            {selectedCharacterId && (
              <button
                onClick={() => onSelectCharacter(null)}
                className="text-[11px] text-xblue hover:underline lowercase font-normal"
              >
                解除
              </button>
            )}
          </div>
          <div className="flex flex-col gap-0.5 mt-1 max-h-48 overflow-y-auto pr-1">
            {characters.map((char) => {
              const isSelected = selectedCharacterId === char.id;
              return (
                <button
                  key={char.id}
                  onClick={() => onSelectCharacter(isSelected ? null : char.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors text-sm ${
                    isSelected ? 'bg-xblue/20 text-white border border-xblue/40 font-medium' : 'text-[#e7e9ea] hover:bg-[#16181c]'
                  }`}
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                    style={{ backgroundColor: char.avatarBg || '#374151' }}
                  >
                    {char.avatar}
                  </span>
                  <span className="truncate flex-1">{char.name}</span>
                  <span className="text-[11px] text-[#71767b]">@{char.handle}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button: Parse Novel */}
        <button
          onClick={onOpenImportModal}
          className="mt-4 w-full py-3 px-4 bg-xblue hover:bg-xblue-hover text-white font-bold rounded-full flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
        >
          <Sparkles className="w-5 h-5" />
          <span>青空文庫を読み込む</span>
        </button>
      </div>

      {/* Bottom User / Settings Bar */}
      <div className="pt-3 border-t border-[#2f3336]">
        <button
          onClick={onOpenApiKeyModal}
          className="w-full flex items-center gap-3 p-2.5 rounded-full hover:bg-[#181818] transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white">
            <Key className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">Gemini API 設定</p>
            <p className="text-xs text-[#71767b] truncate">モデル: gemini-1.5-flash</p>
          </div>
        </button>
      </div>
    </aside>
  );
};
