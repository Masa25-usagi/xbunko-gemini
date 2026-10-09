import React from 'react';
import { NovelData, Character } from '../types';
import { PresetItem } from '../services/api';
import { ExternalLink, Sparkles, TrendingUp, CheckCircle2, BookOpen } from 'lucide-react';

interface SidebarRightProps {
  currentNovel: NovelData;
  presets: PresetItem[];
  selectedPresetId: string;
  onSelectPreset: (id: string) => void;
  onOpenImportModal: () => void;
  onSelectCharacter: (id: string | null) => void;
}

export const SidebarRight: React.FC<SidebarRightProps> = ({
  currentNovel,
  presets,
  selectedPresetId,
  onSelectPreset,
  onOpenImportModal,
  onSelectCharacter,
}) => {
  return (
    <aside className="w-[350px] h-screen sticky top-0 hidden lg:flex flex-col gap-4 px-4 py-3 border-l border-[#2f3336] overflow-y-auto select-none">
      {/* Works Preset Selector Widget */}
      <div className="bg-[#16181c] rounded-2xl border border-[#2f3336] p-4">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-xblue" />
          <h2 className="font-bold text-[17px] text-white">名作プリセット</h2>
        </div>
        <p className="text-xs text-[#71767b] mb-3">
          Gemini解析済みの代表作。APIキー不要で即座に読めます。
        </p>
        <div className="flex flex-col gap-2">
          {presets.map((preset) => {
            const isActive = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset.id)}
                className={`p-3 rounded-xl text-left transition-all border ${
                  isActive
                    ? 'bg-xblue/10 border-xblue text-white shadow-sm'
                    : 'bg-[#202327]/60 border-transparent hover:border-[#333639] text-[#e7e9ea]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">{preset.title}</span>
                  <span className="text-xs text-[#71767b]">{preset.author}</span>
                </div>
                <p className="text-xs text-[#71767b] mt-1 line-clamp-1">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>

        <button
          onClick={onOpenImportModal}
          className="mt-3 w-full py-2 px-3 rounded-xl border border-dashed border-[#536471] hover:border-xblue text-xs font-semibold text-[#e7e9ea] hover:text-xblue flex items-center justify-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-xblue" />
          <span>他の作品をGeminiで解析する</span>
        </button>
      </div>

      {/* Trends Widget */}
      <div className="bg-[#16181c] rounded-2xl border border-[#2f3336] p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-rose-500" />
          <h2 className="font-bold text-[17px] text-white">作品トレンド</h2>
        </div>
        <div className="flex flex-col divide-y divide-[#2f3336]">
          {currentNovel.trends?.map((trend, idx) => (
            <div key={idx} className="py-2.5 first:pt-0 last:pb-0">
              <span className="text-[12px] text-[#71767b]">
                {trend.category || '文学トレンド'} · トレンド
              </span>
              <p className="font-bold text-[15px] text-white hover:underline cursor-pointer">
                {trend.tag}
              </p>
              <span className="text-[12px] text-[#71767b]">
                {trend.postsCount} 件のポスト
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Characters Widget */}
      <div className="bg-[#16181c] rounded-2xl border border-[#2f3336] p-4">
        <h2 className="font-bold text-[17px] text-white mb-3">登場人物一覧</h2>
        <div className="flex flex-col gap-3">
          {currentNovel.characters?.map((char) => (
            <div key={char.id} className="flex items-center justify-between gap-2">
              <div 
                className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
                onClick={() => onSelectCharacter(char.id)}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: char.avatarBg || '#374151' }}
                >
                  {char.avatar}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm text-white group-hover:underline truncate">
                      {char.name}
                    </span>
                    {char.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-xblue fill-xblue flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[#71767b] truncate">@{char.handle}</p>
                </div>
              </div>

              <button
                onClick={() => onSelectCharacter(char.id)}
                className="px-3 py-1 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-colors flex-shrink-0"
              >
                表示
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Aozora Source link */}
      {currentNovel.url && (
        <div className="px-2 text-xs text-[#71767b]">
          <a
            href={currentNovel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:underline text-xblue"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>青空文庫の原作ページを見る</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </aside>
  );
};
