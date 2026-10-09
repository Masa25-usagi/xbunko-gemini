import React, { useState } from 'react';
import { Post, Character } from '../types';
import { 
  Heart, 
  Repeat2, 
  MessageCircle, 
  BarChart2, 
  Bookmark, 
  Share, 
  CheckCircle2,
  Flame,
  Volume2
} from 'lucide-react';

interface TweetCardProps {
  post: Post;
  character?: Character;
  isNew?: boolean;
}

export const TweetCard: React.FC<TweetCardProps> = ({ post, character, isNew = false }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [reposted, setReposted] = useState(false);
  const [repostsCount, setRepostsCount] = useState(post.reposts);
  const [bookmarked, setBookmarked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) {
      setLikesCount(prev => prev - 1);
      setLiked(false);
    } else {
      setLikesCount(prev => prev + 1);
      setLiked(true);
    }
  };

  const handleRepost = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (reposted) {
      setRepostsCount(prev => prev - 1);
      setReposted(false);
    } else {
      setRepostsCount(prev => prev + 1);
      setReposted(true);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const name = character?.name || '名無し';
  const handle = character?.handle || 'anonymous';
  const avatar = character?.avatar || '👤';
  const avatarBg = character?.avatarBg || '#374151';
  const isVerified = character?.verified ?? false;

  const getTypeBadge = () => {
    switch (post.type) {
      case 'narration':
        return (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700/60">
            地の文
          </span>
        );
      case 'dialogue':
        return (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-sky-950/80 text-sky-400 border border-sky-800/60">
            💬 セリフ
          </span>
        );
      case 'thought':
        return (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-400 border border-purple-800/60">
            💭 心の声
          </span>
        );
    }
  };

  return (
    <article 
      className={`border-b border-[#2f3336] p-4 hover:bg-[#080808] transition-colors cursor-pointer duration-200 ${
        isNew ? 'animate-in fade-in slide-in-from-top-4 duration-300' : ''
      }`}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-md select-none"
            style={{ backgroundColor: avatarBg }}
          >
            {avatar}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header info */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <span className="font-bold text-[15px] text-[#e7e9ea] hover:underline truncate">
                {name}
              </span>
              {isVerified && (
                <CheckCircle2 className="w-4 h-4 text-xblue fill-xblue inline flex-shrink-0" />
              )}
              <span className="text-[#71767b] text-[14px] truncate">
                @{handle}
              </span>
              <span className="text-[#71767b] text-[14px]">·</span>
              <span className="text-[#71767b] text-[14px] hover:underline">
                {post.timestamp}
              </span>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              {getTypeBadge()}
              {post.buzzRate >= 80 && (
                <span className="inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-950/70 text-rose-400 border border-rose-800/60">
                  <Flame className="w-3 h-3 fill-rose-400 text-rose-400" />
                  {post.buzzRate}%
                </span>
              )}
            </div>
          </div>

          {/* Tweet Text */}
          <p className="text-[#e7e9ea] text-[15px] leading-relaxed break-words whitespace-pre-line mt-1">
            {post.text}
          </p>

          {/* Action Bar */}
          <div className="flex items-center justify-between text-[#71767b] max-w-md mt-3 select-none">
            {/* Reply */}
            <button 
              className="flex items-center gap-1.5 hover:text-xblue group transition-colors"
              title="返信"
            >
              <div className="p-2 rounded-full group-hover:bg-xblue/10">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-xs">12</span>
            </button>

            {/* Repost */}
            <button 
              onClick={handleRepost}
              className={`flex items-center gap-1.5 group transition-colors ${
                reposted ? 'text-green-500' : 'hover:text-green-500'
              }`}
              title="リポスト"
            >
              <div className="p-2 rounded-full group-hover:bg-green-500/10">
                <Repeat2 className="w-4 h-4" />
              </div>
              <span className="text-xs">{formatNumber(repostsCount)}</span>
            </button>

            {/* Like */}
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 group transition-colors ${
                liked ? 'text-pink-600' : 'hover:text-pink-600'
              }`}
              title="いいね"
            >
              <div className="p-2 rounded-full group-hover:bg-pink-600/10">
                <Heart className={`w-4 h-4 ${liked ? 'fill-pink-600' : ''}`} />
              </div>
              <span className="text-xs">{formatNumber(likesCount)}</span>
            </button>

            {/* Views */}
            <div 
              className="flex items-center gap-1.5 hover:text-xblue group transition-colors"
              title="表示回数"
            >
              <div className="p-2 rounded-full group-hover:bg-xblue/10">
                <BarChart2 className="w-4 h-4" />
              </div>
              <span className="text-xs">{formatNumber(post.views)}</span>
            </div>

            {/* Bookmark & Share */}
            <div className="flex items-center">
              <button 
                onClick={(e) => { e.stopPropagation(); setBookmarked(!bookmarked); }}
                className={`p-2 rounded-full hover:bg-xblue/10 hover:text-xblue transition-colors ${
                  bookmarked ? 'text-xblue' : ''
                }`}
                title="ブックマーク"
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-xblue' : ''}`} />
              </button>
              <button 
                className="p-2 rounded-full hover:bg-xblue/10 hover:text-xblue transition-colors"
                title="共有"
              >
                <Share className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
