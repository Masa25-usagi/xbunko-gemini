import React from 'react';
import { Post, Character, TimelineFilter } from '../types';
import { TweetCard } from './TweetCard';
import { Sparkles, MessageSquare, ChevronDown } from 'lucide-react';

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
  totalPosts,
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

  return (
    <div className="flex-1 min-h-screen border-r border-[#2f3336]">
      {/* What's happening prompt / Read Next Bar */}
      {hasMore && (
        <div className="p-3 border-b border-[#2f3336] bg-[#16181c]/40 flex items-center justify-between gap-3 text-sm">
          <span className="text-[#71767b] text-xs">
            物語が進行中… ({displayedCount} / {filteredPosts.length} ポスト表示中)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onShowNext}
              className="px-3 py-1.5 rounded-full bg-[#202327] hover:bg-[#2c3035] text-xs font-semibold text-white border border-[#2f3336] transition-colors flex items-center gap-1"
            >
              <ChevronDown className="w-3.5 h-3.5" />
              <span>次の発言を読む</span>
            </button>
            <button
              onClick={onShowAll}
              className="px-3 py-1.5 rounded-full bg-xblue hover:bg-xblue-hover text-xs font-semibold text-white transition-colors"
            >
              一括全表示
            </button>
          </div>
        </div>
      )}

      {/* Posts List */}
      {visiblePosts.length > 0 ? (
        <div className="divide-y divide-[#2f3336]">
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
          <MessageSquare className="w-12 h-12 text-[#71767b] mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-bold text-white mb-1">表示するポストがありません</h3>
          <p className="text-sm text-[#71767b] max-w-sm mx-auto">
            フィルター条件に一致するポストが見つかりませんでした。別のフィルターをお試しください。
          </p>
        </div>
      )}

      {/* Timeline bottom footer */}
      {visiblePosts.length > 0 && !hasMore && (
        <div className="py-10 text-center text-xs text-[#71767b] border-t border-[#2f3336]/40">
          <p className="font-semibold text-neutral-400 mb-1">🎉 物語の最後まで到達しました</p>
          <p>他の作品を読んだり、セリフ限定・バズり順表示もお楽しみください。</p>
        </div>
      )}
    </div>
  );
};
