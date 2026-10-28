import React from 'react';
import { Post, Character, TimelineFilter } from '../types';
import { TweetCard } from './TweetCard';
import { MessageSquare, ChevronDown, PartyPopper } from 'lucide-react';

interface TimelineProps {
  posts: Post[];
  characters: Character[];
  filter: TimelineFilter;
  selectedCharacterId: string | null;
  displayedCount: number;
  onShowNext: () => void;
  onShowAll: () => void;
  totalPosts: number;
}

export const Timeline: React.FC<TimelineProps> = ({
  posts,
  characters,
  filter,
  selectedCharacterId,
  displayedCount,
  onShowNext,
  onShowAll,
}) => {
  const characterMap = React.useMemo(() => {
    const map = new Map<string, Character>();
    characters.forEach((char) => map.set(char.id, char));
    return map;
  }, [characters]);

  // Apply filters
  const filteredPosts = React.useMemo(() => {
    let result = [...posts];

    // Filter by character if selected
    if (selectedCharacterId) {
      result = result.filter((p) => p.speakerId === selectedCharacterId);
    }

    // Filter by type or buzz
    if (filter === 'dialogue_only') {
      result = result.filter((p) => p.type === 'dialogue');
    } else if (filter === 'buzz_order') {
      result.sort((a, b) => b.buzzRate - a.buzzRate || b.likes - a.likes);
    }

    return result;
  }, [posts, filter, selectedCharacterId]);

  // When in chronological mode, only show up to displayedCount posts
  const visiblePosts = React.useMemo(() => {
    if (filter === 'buzz_order' || selectedCharacterId) {
      return filteredPosts; // In buzz order or filter, show all matching
    }
    return filteredPosts.slice(0, displayedCount);
  }, [filteredPosts, filter, selectedCharacterId, displayedCount]);

  const hasMore = !selectedCharacterId && filter !== 'buzz_order' && displayedCount < filteredPosts.length;
  const progress = filteredPosts.length > 0
    ? Math.min(100, (Math.min(displayedCount, filteredPosts.length) / filteredPosts.length) * 100)
    : 0;

  return (
    <div className="flex-1 min-h-screen">
      {/* What's happening prompt / Read Next Bar */}
      {hasMore && (
        <div className="border-b border-xb-border bg-xb-surface/40">
          {/* 読書進捗バー */}
          <div className="h-[3px] bg-xb-elevated/60">
            <div
              className="h-full bg-xb-accent transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="p-3 flex items-center justify-between gap-3 text-sm">
            <span className="text-xb-muted text-xs tabular-nums">
              物語が進行中… ({displayedCount} / {filteredPosts.length} ポスト表示中)
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={onShowNext}
                className="px-3 py-1.5 rounded-full bg-xb-elevated hover:bg-xb-hoverstrong text-xs font-semibold text-xb-strong border border-xb-border transition-all active:scale-95 flex items-center gap-1"
              >
                <ChevronDown className="w-3.5 h-3.5" />
                <span>次の発言を読む</span>
              </button>
              <button
                onClick={onShowAll}
                className="px-3 py-1.5 rounded-full bg-xb-accent hover:bg-xb-accenthover text-xs font-semibold text-white transition-all active:scale-95"
              >
                一括全表示
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts List */}
      {visiblePosts.length > 0 ? (
        <div className="divide-y divide-xb-border">
          {visiblePosts.map((post, idx) => (
            <TweetCard
              key={post.id}
              post={post}
              character={characterMap.get(post.speakerId)}
              isNew={idx === visiblePosts.length - 1}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-xb-surface border border-xb-border flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-7 h-7 text-xb-muted" />
          </div>
          <h3 className="text-lg font-bold text-xb-strong mb-1">表示するポストがありません</h3>
          <p className="text-sm text-xb-muted max-w-sm mx-auto leading-relaxed">
            フィルター条件に一致するポストが見つかりませんでした。別のフィルターをお試しください。
          </p>
        </div>
      )}

      {/* Timeline bottom footer */}
      {visiblePosts.length > 0 && !hasMore && (
        <div className="py-10 text-center text-xs text-xb-muted border-t border-xb-border/40">
          <p className="inline-flex items-center gap-1.5 font-semibold text-xb-text mb-1">
            <PartyPopper className="w-4 h-4 text-xb-accent" />
            物語の最後まで到達しました
          </p>
          <p>他の作品を読んだり、セリフ限定・バズり順表示もお楽しみください。</p>
        </div>
      )}
    </div>
  );
};
