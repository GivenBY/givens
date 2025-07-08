// API endpoint definitions
export const API_ENDPOINTS = {
  PASTE: "/api/paste",
  PASTE_BY_ID: (id: string) => `/api/paste/${id}`,
  USER_PASTES: "/api/user/pastes",

  ANALYTICS: "/api/analytics",
  USER_ANALYTICS: (userId: string) => `/api/analytics/user/${userId}`,

  AUTH_SESSION: "/api/auth/session",
  AUTH_SIGNIN: "/api/auth/signin",
  AUTH_SIGNOUT: "/api/auth/signout",

  // Public endpoints
  PUBLIC_PASTES: "/api/public/pastes",
  TRENDING_PASTES: "/api/public/trending",
} as const;

// API response types
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API request types
export interface CreatePasteRequest {
  title: string;
  content: string;
  language: string;
  isPublic: boolean;
  anonEditId?: string;
}

export interface UpdatePasteRequest extends Partial<CreatePasteRequest> {
  id: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
