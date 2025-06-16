'use client';

import { useState, useCallback } from 'react';
import { ApolloSearchFilters } from '@/types/targeting';

interface PersonResult {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  emailStatus: string;
  photoUrl: string | null;
  linkedinUrl: string;
  company: {
    id: string;
    name: string;
    website: string;
    industry: string;
    employeeCount: number;
    logoUrl: string | null;
  };
}

interface SearchFilters {
  label: string;
  field: string;
  value: string;
  displayName: string;
}

interface PaginationInfo {
  page: number;
  perPage: number;
  totalEntries: number;
  totalPages: number;
}

interface SearchResults {
  people: PersonResult[];
  filters: SearchFilters[];
  pagination: PaginationInfo;
  isPartialResults: boolean;
  partialResultsLimit: number;
}

interface UseTargetingSearchResult {
  results: SearchResults | null;
  isLoading: boolean;
  error: string | null;
  searchPeople: (filters: ApolloSearchFilters, page?: number) => Promise<void>;
  previewSearch: (filters: ApolloSearchFilters) => Promise<void>;
  clearResults: () => void;
  hasSearched: boolean;
}

export function useTargetingSearch(): UseTargetingSearchResult {
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const searchPeople = useCallback(
    async (filters: ApolloSearchFilters, page: number = 1) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/targeting/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            filters,
            page,
            per_page: 25
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Search failed');
        }

        setResults(data.data);
        setHasSearched(true);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Search failed';
        setError(errorMessage);
        console.error('❌ Search error:', errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const previewSearch = useCallback(
    async (filters: ApolloSearchFilters) => {
      // Preview search with limited results to save credits
      await searchPeople(filters, 1);
    },
    [searchPeople]
  );

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
    setHasSearched(false);
  }, []);

  return {
    results,
    isLoading,
    error,
    searchPeople,
    previewSearch,
    clearResults,
    hasSearched
  };
}

// Validation helpers
export function validateTargetingFilters(filters: ApolloSearchFilters): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if at least one filter is provided
  const hasFilters = Object.keys(filters).some((key) => {
    const value = filters[key as keyof ApolloSearchFilters];
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  });

  if (!hasFilters) {
    errors.push('At least one filter must be specified');
  }

  // Warn about overly broad searches
  const filterCount = Object.keys(filters).length;
  if (filterCount < 2) {
    warnings.push(
      'Consider adding more filters to narrow your search and get better results'
    );
  }

  // Check for potentially large result sets
  const hasLocationFilter = Boolean(
    filters.person_locations?.length || filters.organization_locations?.length
  );
  const hasCompanySizeFilter = Boolean(
    filters.organization_num_employees_ranges?.length
  );
  const hasIndustryFilter = Boolean(filters.organization_industries?.length);

  if (!hasLocationFilter && !hasCompanySizeFilter && !hasIndustryFilter) {
    warnings.push(
      'Your search may return a very large number of results. Consider adding location, company size, or industry filters.'
    );
  }

  // Validate array filters aren't empty
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length === 0) {
      warnings.push(`${key} filter is empty and will be ignored`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function estimateSearchSize(filters: ApolloSearchFilters): {
  estimate: 'small' | 'medium' | 'large' | 'very_large';
  description: string;
  recommendation: string;
} {
  let score = 0;

  // Score based on filter specificity
  if (filters.person_titles?.length) score += 2;
  if (filters.person_seniorities?.length) score += 2;
  if (filters.organization_industries?.length) score += 1;
  if (filters.organization_num_employees_ranges?.length) score += 1;
  if (
    filters.person_locations?.length ||
    filters.organization_locations?.length
  )
    score += 3;
  if (filters.q_keywords) score += 2;

  if (score >= 6) {
    return {
      estimate: 'small',
      description: 'Highly targeted search (likely < 1,000 results)',
      recommendation: 'Great targeting! This should give you quality leads.'
    };
  } else if (score >= 4) {
    return {
      estimate: 'medium',
      description: 'Well-targeted search (likely 1,000 - 10,000 results)',
      recommendation: 'Good balance of targeting and reach.'
    };
  } else if (score >= 2) {
    return {
      estimate: 'large',
      description: 'Broad search (likely 10,000 - 50,000 results)',
      recommendation: 'Consider adding more filters to improve targeting.'
    };
  } else {
    return {
      estimate: 'very_large',
      description: 'Very broad search (likely > 50,000 results)',
      recommendation:
        "Add more specific filters to avoid hitting Apollo's 50,000 result limit."
    };
  }
}
