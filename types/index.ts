export interface Paste {
  _id: string;
  title: string;
  content: string;
  language: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt?: Date;
  views: number;
  authorId?: string;
  authorName?: string;
  authorAvatar?: string;
  anonEditId?: string;
}

export interface UserAnalytics {
  userId: string;
  totalPastes: number;
  totalViews: number;
  popularLanguages: {
    language: string;
    count: number;
  }[];
  viewsOverTime: {
    date: string;
    views: number;
  }[];
}

export interface Theme {
  _id: string;
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
