export interface Character {
  id: string;
  name: string;
  handle: string;
  avatar: string; // emoji or image url
  avatarBg?: string; // hex color for avatar background
  bio: string;
  verified?: boolean;
}

export type PostType = 'narration' | 'dialogue' | 'thought';

export interface Post {
  id: string;
  speakerId: string;
  text: string;
  type: PostType;
  likes: number;
  reposts: number;
  views: number;
  buzzRate: number; // 0 - 100%
  timestamp: string; // e.g., "1分前", "10:24", etc.
  replyTo?: {
    speakerName: string;
    handle: string;
  };
}

export interface NovelData {
  title: string;
  author: string;
  url?: string;
  characters: Character[];
  posts: Post[];
  trends: {
    tag: string;
    postsCount: string;
    category?: string;
  }[];
}

export type TimelineFilter = 'all' | 'dialogue_only' | 'buzz_order' | 'character';
