/**
 * TanStack Query Client Configuration
 * Centralized query client setup with default options and error handling
 */

import { QueryClient, DefaultOptions } from '@tanstack/react-query'
import { ApiError } from './client.js'

// Default query options
const defaultQueryOptions: DefaultOptions = {
  queries: {
    // Stale time: 5 minutes
    staleTime: 5 * 60 * 1000,
    // Cache time: 10 minutes
    gcTime: 10 * 60 * 1000,
    // Retry failed requests 3 times
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        return false
      }
      return failureCount < 3
    },
    // Retry delay with exponential backoff
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Refetch on window focus in production
    refetchOnWindowFocus: process.env.NODE_ENV === 'production',
    // Refetch on reconnect
    refetchOnReconnect: true,
    // Don't refetch on mount if data is fresh
    refetchOnMount: true,
  },
  mutations: {
    // Retry failed mutations once
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        return false
      }
      return failureCount < 1
    },
    // Retry delay for mutations
    retryDelay: 1000,
  },
}

// Create query client instance
export const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions,
})

// Query key factory for consistent key generation
export const queryKeys = {
  // Generic keys
  all: ['api'] as const,
  lists: () => ['api', 'list'] as const,
  list: (filters: Record<string, any>) => ['api', 'list', { filters }] as const,
  details: () => ['api', 'detail'] as const,
  detail: (id: string | number) => ['api', 'detail', id] as const,

  // Auth keys
  auth: {
    all: ['api', 'auth'] as const,
    user: () => ['api', 'auth', 'user'] as const,
    profile: () => ['api', 'auth', 'profile'] as const,
  },

  // Users keys
  users: {
    all: ['api', 'users'] as const,
    lists: () => ['api', 'users', 'list'] as const,
    list: (filters: Record<string, any>) => ['api', 'users', 'list', { filters }] as const,
    details: () => ['api', 'users', 'detail'] as const,
    detail: (id: string | number) => ['api', 'users', 'detail', id] as const,
  },

  // Add more domain-specific keys as needed
  // posts: { ... },
  // comments: { ... },
} as const

// Utility functions for cache management
export const cacheUtils = {
  // Invalidate all queries
  invalidateAll: () => {
    return queryClient.invalidateQueries({ queryKey: queryKeys.all })
  },

  // Invalidate queries by pattern
  invalidateByPattern: (pattern: readonly unknown[]) => {
    return queryClient.invalidateQueries({ queryKey: pattern })
  },

  // Remove queries by pattern
  removeByPattern: (pattern: readonly unknown[]) => {
    return queryClient.removeQueries({ queryKey: pattern })
  },

  // Clear all cache
  clearAll: () => {
    return queryClient.clear()
  },

  // Get cached data
  getCachedData: <T>(queryKey: readonly unknown[]): T | undefined => {
    return queryClient.getQueryData<T>(queryKey)
  },

  // Set cached data
  setCachedData: <T>(queryKey: readonly unknown[], data: T) => {
    return queryClient.setQueryData<T>(queryKey, data)
  },

  // Prefetch query
  prefetch: <T>(
    queryKey: readonly unknown[],
    queryFn: () => Promise<T>,
    options?: { staleTime?: number },
  ) => {
    return queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: options?.staleTime,
    })
  },
}

// Error handling utilities
export const queryErrorUtils = {
  // Check if error is API error
  isApiError: (error: unknown): error is ApiError => {
    return error instanceof ApiError
  },

  // Get error message
  getErrorMessage: (error: unknown): string => {
    if (error instanceof ApiError) {
      return error.message
    }
    if (error instanceof Error) {
      return error.message
    }
    return 'An unexpected error occurred'
  },

  // Get validation errors
  getValidationErrors: (error: unknown): Record<string, string[]> | undefined => {
    if (error instanceof ApiError) {
      return error.errors
    }
    return undefined
  },

  // Check if error is network error
  isNetworkError: (error: unknown): boolean => {
    return error instanceof ApiError && error.status === 0
  },

  // Check if error is unauthorized
  isUnauthorizedError: (error: unknown): boolean => {
    return error instanceof ApiError && error.status === 401
  },

  // Check if error is forbidden
  isForbiddenError: (error: unknown): boolean => {
    return error instanceof ApiError && error.status === 403
  },

  // Check if error is not found
  isNotFoundError: (error: unknown): boolean => {
    return error instanceof ApiError && error.status === 404
  },

  // Check if error is server error
  isServerError: (error: unknown): boolean => {
    return error instanceof ApiError && error.status >= 500
  },
}
