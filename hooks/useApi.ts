"use client";
import { analyticsService, pasteService, type ApiResponse } from "@/lib/api";
import type { Paste, UserAnalytics } from "@/types";
import { useCallback, useState } from "react";

// Generic API hook for handling loading states and errors
export function useApiCall<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}

// Specific hooks for paste operations
export function usePasteApi() {
  const createPaste = useApiCall<ApiResponse<Paste>>();
  const updatePaste = useApiCall<ApiResponse<Paste>>();
  const deletePaste = useApiCall<ApiResponse<void>>();
  const getPaste = useApiCall<ApiResponse<Paste>>();
  const getUserPastes = useApiCall<ApiResponse<Paste[]>>();

  return {
    create: {
      ...createPaste,
      execute: (data: Parameters<typeof pasteService.create>[0]) =>
        createPaste.execute(() => pasteService.create(data)),
    },
    update: {
      ...updatePaste,
      execute: (data: Parameters<typeof pasteService.update>[0]) =>
        updatePaste.execute(() => pasteService.update(data)),
    },
    delete: {
      ...deletePaste,
      execute: (id: string) =>
        deletePaste.execute(() => pasteService.delete(id)),
    },
    getById: {
      ...getPaste,
      execute: (id: string) => getPaste.execute(() => pasteService.getById(id)),
    },
    getUserPastes: {
      ...getUserPastes,
      execute: () => getUserPastes.execute(() => pasteService.getUserPastes()),
    },
  };
}

// Analytics API hook
export function useAnalyticsApi() {
  const getUserAnalytics = useApiCall<ApiResponse<UserAnalytics>>();
  const getAnalytics = useApiCall<ApiResponse<any>>();

  return {
    getUserAnalytics: {
      ...getUserAnalytics,
      execute: (userId: string) =>
        getUserAnalytics.execute(() =>
          analyticsService.getUserAnalytics(userId)
        ),
    },
    getAnalytics: {
      ...getAnalytics,
      execute: () =>
        getAnalytics.execute(() => analyticsService.getAnalytics()),
    },
  };
}

// Hook for handling multiple API calls with loading states
export function useMultipleApiCalls() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const executeCall = useCallback(
    async <T>(key: string, apiCall: () => Promise<T>): Promise<T> => {
      setLoadingStates((prev) => ({ ...prev, [key]: true }));
      setErrors((prev) => ({ ...prev, [key]: "" }));

      try {
        const result = await apiCall();
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setErrors((prev) => ({ ...prev, [key]: errorMessage }));
        throw err;
      } finally {
        setLoadingStates((prev) => ({ ...prev, [key]: false }));
      }
    },
    []
  );

  const isLoading = (key: string) => loadingStates[key] || false;
  const getError = (key: string) => errors[key] || null;
  const isAnyLoading = Object.values(loadingStates).some(Boolean);

  return {
    executeCall,
    isLoading,
    getError,
    isAnyLoading,
    loadingStates,
    errors,
  };
}
