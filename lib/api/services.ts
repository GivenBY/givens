// API service functions for paste operations
import type { Paste, UserAnalytics } from "@/types";
import { apiClient } from "./client";
import {
  API_ENDPOINTS,
  type ApiResponse,
  type CreatePasteRequest,
  type PaginatedResponse,
  type UpdatePasteRequest,
} from "./endpoints";

export const pasteService = {
  async create(data: CreatePasteRequest): Promise<ApiResponse<Paste>> {
    return apiClient.post<ApiResponse<Paste>>(API_ENDPOINTS.PASTE, data);
  },

  async getById(id: string): Promise<ApiResponse<Paste>> {
    return apiClient.get<ApiResponse<Paste>>(API_ENDPOINTS.PASTE_BY_ID(id));
  },

  async update(data: UpdatePasteRequest): Promise<ApiResponse<Paste>> {
    return apiClient.put<ApiResponse<Paste>>(
      API_ENDPOINTS.PASTE_BY_ID(data.id),
      data
    );
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.PASTE_BY_ID(id));
  },

  async getUserPastes(): Promise<PaginatedResponse<Paste>> {
    return apiClient.get<PaginatedResponse<Paste>>(API_ENDPOINTS.USER_PASTES);
  },

  async getPublicPastes(): Promise<ApiResponse<Paste[]>> {
    return apiClient.get<ApiResponse<Paste[]>>(API_ENDPOINTS.PUBLIC_PASTES);
  },

  async getTrendingPastes(): Promise<ApiResponse<Paste[]>> {
    return apiClient.get<ApiResponse<Paste[]>>(API_ENDPOINTS.TRENDING_PASTES);
  },
};

export const analyticsService = {
  async getUserAnalytics(userId: string): Promise<ApiResponse<UserAnalytics>> {
    return apiClient.get<ApiResponse<UserAnalytics>>(
      API_ENDPOINTS.USER_ANALYTICS(userId)
    );
  },

  async getAnalytics(): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>(API_ENDPOINTS.ANALYTICS);
  },
};
