export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Paste {
  id: string;
  title: string;
  content: string;
  language: string;
  isPublic: boolean;
  userId?: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  shortUrl: string;
}

export interface PasteView {
  id: string;
  pasteId: string;
  viewerIp?: string;
  viewerUserId?: string;
  createdAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreatePasteRequest {
  title: string;
  content: string;
  language: string;
  isPublic: boolean;
  expiresAt?: string;
}

export interface UpdatePasteRequest {
  title?: string;
  content?: string;
  language?: string;
  isPublic?: boolean;
}

export interface GetPastesRequest {
  page?: number;
  limit?: number;
  search?: string;
  language?: string;
  isPublic?: boolean;
}

export type UserWithoutSensitiveData = Omit<User, 'email'>;
export type PasteWithUser = Paste & { user: UserWithoutSensitiveData };
export type CreatePasteData = Omit<Paste, 'id' | 'viewCount' | 'createdAt' | 'updatedAt'>;

export const SUPPORTED_LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'cpp', 'c',
  'csharp', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
  'html', 'css', 'scss', 'json', 'xml', 'yaml', 'markdown',
  'bash', 'sql', 'r', 'matlab', 'perl', 'lua', 'dart'
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export const PASTE_EXPIRY_OPTIONS = [
  { label: 'Never', value: null },
  { label: '1 Hour', value: 60 * 60 * 1000 },
  { label: '1 Day', value: 24 * 60 * 60 * 1000 },
  { label: '1 Week', value: 7 * 24 * 60 * 60 * 1000 },
  { label: '1 Month', value: 30 * 24 * 60 * 60 * 1000 },
] as const;

export const MAX_PASTE_SIZE = 100000;
export const MAX_TITLE_LENGTH = 100;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
