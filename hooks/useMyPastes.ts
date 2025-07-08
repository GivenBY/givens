"use client";
import { analyticsService, pasteService } from "@/lib/api";
import type { Paste } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Hook for managing user's pastes
export function useMyPastes() {
  const [pastes, setPastes] = useState<Paste[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchPastes = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await pasteService.getUserPastes();

      if (response.success) {
        setPastes(response.data);
        setPagination(response.pagination);
      } else {
        throw new Error(response.error || "Failed to fetch pastes");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch pastes";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deletePaste = async (id: string) => {
    try {
      const response = await pasteService.delete(id);

      if (response.success) {
        setPastes((prev) => prev.filter((paste) => paste._id !== id));
        toast.success("Paste deleted successfully");
      } else {
        throw new Error(response.error || "Failed to delete paste");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete paste";
      toast.error(errorMessage);
      throw err;
    }
  };

  const updatePaste = async (id: string, updates: Partial<Paste>) => {
    try {
      const response = await pasteService.update({ id, ...updates });

      if (response.success) {
        setPastes((prev) =>
          prev.map((paste) =>
            paste._id === id ? { ...paste, ...response.data } : paste
          )
        );
        toast.success("Paste updated successfully");
        return response.data;
      } else {
        throw new Error(response.error || "Failed to update paste");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update paste";
      toast.error(errorMessage);
      throw err;
    }
  };

  // Load pastes on mount
  useEffect(() => {
    fetchPastes();
  }, []);

  return {
    pastes,
    loading,
    error,
    pagination,
    fetchPastes,
    deletePaste,
    updatePaste,
    refetch: () => fetchPastes(pagination.page),
  };
}

// Hook for analytics data
export function useAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await analyticsService.getAnalytics();

      if (response.success) {
        setAnalytics(response.data);
      } else {
        throw new Error(response.error || "Failed to fetch analytics");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch analytics";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load analytics on mount
  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  };
}
