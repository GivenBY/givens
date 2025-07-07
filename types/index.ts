export interface Paste {
  id: string;
  title: string;
  content: string;
  language: string;
  isPublic: boolean;
  createdAt: Date;
  views: number;
  author: string;
  authorId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
}

export interface Analytics {
  totalPastes: number;
  totalViews: number;
  popularLanguages: { language: string; count: number }[];
  viewsOverTime: { date: string; views: number }[];
}
