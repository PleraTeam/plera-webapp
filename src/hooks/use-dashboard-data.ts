'use client';

import useSWR from 'swr';
import { ClientDashboardResponse } from '@/types/airtable';

// Fetcher function for SWR
const fetcher = async (url: string): Promise<ClientDashboardResponse> => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: ClientDashboardResponse = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch dashboard data');
  }

  return data;
};

interface UseDashboardDataOptions {
  refreshInterval?: number; // in milliseconds
  enabled?: boolean;
}

export function useDashboardData(
  clientId: string | null,
  options: UseDashboardDataOptions = {}
) {
  const { refreshInterval = 30000, enabled = true } = options;

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    clientId && enabled ? `/api/dashboard/${clientId}` : null,
    fetcher,
    {
      refreshInterval,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000, // Prevent duplicate requests within 5 seconds
      errorRetryCount: 3,
      errorRetryInterval: 5000
    }
  );

  return {
    data: data || null,
    clientMetrics: data?.clientMetrics || null,
    loading: isLoading,
    error: error?.message || null,
    isRefreshing: isValidating && !isLoading,
    refresh: () => mutate(),
    retry: () => mutate()
  };
}
