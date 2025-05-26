'use client';

import useSWR from 'swr';
import { ActivityFeed, ClientDashboardResponse } from '@/types/airtable';

// Fetcher function specifically for activity feed
const fetcher = async (url: string): Promise<ActivityFeed[]> => {
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
    throw new Error(data.error || 'Failed to fetch activity feed');
  }

  return data.activityFeed || [];
};

interface UseActivityFeedOptions {
  refreshInterval?: number;
  enabled?: boolean;
  limit?: number; // Limit number of activities to return
}

export function useActivityFeed(
  clientId: string | null,
  options: UseActivityFeedOptions = {}
) {
  const { refreshInterval = 30000, enabled = true, limit } = options;

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    clientId && enabled ? `/api/dashboard/${clientId}` : null,
    fetcher,
    {
      refreshInterval,
      revalidateOnFocus: false, // Less aggressive for activity feed
      revalidateOnReconnect: true,
      dedupingInterval: 10000, // Activity feed can be cached longer
      errorRetryCount: 2,
      errorRetryInterval: 3000
    }
  );

  // Apply limit if specified, ensure data is an array
  const safeData = Array.isArray(data) ? data : [];
  const limitedData = limit ? safeData.slice(0, limit) : safeData;

  return {
    activities: limitedData || [],
    loading: isLoading,
    error: error?.message || null,
    isRefreshing: isValidating && !isLoading,
    refresh: () => mutate(),
    retry: () => mutate(),
    hasMore: limit ? (data?.length || 0) > limit : false
  };
}
