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
  Flame
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
        return <span className="xb-badge xb-badge-narration">地の文</span>;
      case 'dialogue':
        return <span className="xb-badge xb-badge-dialogue">💬 セリフ</span>;
      case 'thought':
        return <span className="xb-badge xb-badge-thought">💭 心の声</span>;
    }
  };

  return (
    <article
      className={`group border-b border-xb-border p-4 hover:bg-xb-hover transition-colors cursor-pointer duration-200 ${
        isNew ? 'animate-in fade-in slide-in-from-top-4 duration-300' : ''
      }`}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-md select-none ring-1 ring-xb-border/40 transition-transform duration-200 group-hover:scale-[1.04]"
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
              <span className="font-bold text-[15px] text-xb-strong hover:underline truncate">
                {name}
              </span>
              {isVerified && (
                <CheckCircle2 className="w-4 h-4 text-xb-accent fill-xb-accent inline flex-shrink-0" />
              )}
              <span className="text-xb-muted text-[14px] truncate">
                @{handle}
              </span>
              <span className="text-xb-muted text-[14px]">·</span>
              <span className="text-xb-muted text-[14px] hover:underline">
                {post.timestamp}
              </span>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              {getTypeBadge()}
              {post.buzzRate >= 80 && (
                <span className="xb-badge xb-badge-buzz">
                  <Flame className="w-3 h-3 fill-current" />
                  {post.buzzRate}%
                </span>
              )}
            </div>
          </div>

          {/* Tweet Text — 地の文は明朝体で没入感を演出 */}
          <p
            className={`text-xb-text text-[15px] break-words whitespace-pre-line mt-1 ${
              post.type === 'narration'
                ? 'font-literary text-[15.5px] leading-loose'
                : post.type === 'thought'
                  ? 'italic leading-relaxed'
                  : 'leading-relaxed'
            }`}
          >
            {post.text}
          </p>

          {/* Action Bar */}
          <div className="flex items-center justify-between text-xb-muted max-w-md mt-3 -ml-2 select-none">
            {/* Reply */}
            <button
              className="flex items-center gap-1.5 hover:text-xb-accent group/btn transition-colors"
              title="返信"
            >
              <div className="p-2 rounded-full group-hover/btn:bg-xb-accent/10 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-xs tabular-nums">12</span>
            </button>

            {/* Repost */}
            <button
              onClick={handleRepost}
              className={`flex items-center gap-1.5 group/btn transition-colors ${
                reposted ? 'text-green-500' : 'hover:text-green-500'
              }`}
              title="リポスト"
            >
              <div className="p-2 rounded-full group-hover/btn:bg-green-500/10 transition-colors">
                <Repeat2 className="w-4 h-4" />
              </div>
              <span className="text-xs tabular-nums">{formatNumber(repostsCount)}</span>
            </button>

            {/* Like */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 group/btn transition-colors ${
                liked ? 'text-pink-600' : 'hover:text-pink-600'
              }`}
              title="いいね"
            >
              <div className="p-2 rounded-full group-hover/btn:bg-pink-600/10 transition-colors">
                <Heart className={`w-4 h-4 transition-transform ${liked ? 'fill-pink-600 scale-110' : ''}`} />
              </div>
              <span className="text-xs tabular-nums">{formatNumber(likesCount)}</span>
            </button>

            {/* Views */}
            <div
              className="flex items-center gap-1.5 hover:text-xb-accent group/btn transition-colors"
              title="表示回数"
            >
              <div className="p-2 rounded-full group-hover/btn:bg-xb-accent/10 transition-colors">
                <BarChart2 className="w-4 h-4" />
              </div>
              <span className="text-xs tabular-nums">{formatNumber(post.views)}</span>
            </div>

            {/* Bookmark & Share */}
            <div className="flex items-center">
              <button
                onClick={(e) => { e.stopPropagation(); setBookmarked(!bookmarked); }}
                className={`p-2 rounded-full hover:bg-xb-accent/10 hover:text-xb-accent transition-all active:scale-90 ${
                  bookmarked ? 'text-xb-accent' : ''
                }`}
                title="ブックマーク"
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-xb-accent' : ''}`} />
              </button>
              <button
                className="p-2 rounded-full hover:bg-xb-accent/10 hover:text-xb-accent transition-colors"
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
