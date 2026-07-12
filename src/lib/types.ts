export interface BookSettings {
  title: string;
  author: string;
  description: string;
  coverTitle: string;
  accentColor: string;
}

export interface BookPage {
  id?: string;
  chapterNumber: number;
  title: string;
  content: string; // TipTap JSON stringified
  order: number;
  published: boolean;
  views: number;
  section?: "lifestyle" | "cars" | "writing";
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  email: string;
  createdAt: string;
}
