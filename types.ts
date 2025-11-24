export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  author: string;
  publishedAt: string;
  imageUrl: string;
  views: number;
  commentCount: number;
  shareCount: number;
}

export enum Category {
  HOME = 'Terkini',
  KRIMINAL = 'Kriminal',
  KEAMANAN = 'Keamanan',
  KEGIATAN = 'Kegiatan',
  INSPIRASI = 'Inspirasi',
  PRESS_RELEASE = 'Press Release'
}

export type NavItem = {
  label: string;
  path: string;
  category: Category | null;
};

export interface Comment {
  id: string;
  articleId: string;
  name: string;
  email?: string;
  text: string;
  date: string;
}

export interface AdConfig {
  id?: string;
  position: 'sidebar_top' | 'sidebar_bottom';
  title: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
}