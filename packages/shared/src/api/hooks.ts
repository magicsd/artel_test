/**
 * Reusable API Hooks
 * Custom hooks for common API operations using TanStack Query
 */

import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  UseQueryOptions,
  UseMutationOptions,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query'
import { apiClient, ApiResponse, ApiError } from './client.js'
import { queryKeys, cacheUtils } from './query-client.js'

// Generic types
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ListFilters {
  page?: number
  limit?: number
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
  [key: string]: any
}

// Generic CRUD hooks
export function useList<T>(
  endpoint: string,
  filters: ListFilters = {},
  options?: Omit<UseQueryOptions<ApiResponse<PaginatedResponse<T>>>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.list(filters),
    queryFn: () => apiClient.get<PaginatedResponse<T>>(endpoint, filters),
    ...options,
  })
}

export function useDetail<T>(
  endpoint: string,
  id: string | number,
  options?: Omit<UseQueryOptions<ApiResponse<T>>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.detail(id),
    queryFn: () => apiClient.get<T>(`${endpoint}/${id}`),
    enabled: !!id,
    ...options,
  })
}

export function useInfiniteList<T>(
  endpoint: string,
  filters: Omit<ListFilters, 'page'> = {},
  options?: Omit<
    UseInfiniteQueryOptions<ApiResponse<PaginatedResponse<T>>>,
    'queryKey' | 'queryFn' | 'getNextPageParam'
  >,
) {
  return useInfiniteQuery({
    queryKey: queryKeys.list(filters),
    queryFn: ({ pageParam = 1 }) =>
      apiClient.get<PaginatedResponse<T>>(endpoint, { ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage.data
      return pagination.hasNext ? pagination.page + 1 : undefined
    },
    initialPageParam: 1,
    ...options,
  })
}

// CRUD mutation hooks
export function useCreate<TData, TVariables = any>(
  endpoint: string,
  options?: UseMutationOptions<ApiResponse<TData>, ApiError, TVariables>,
) {
  return useMutation({
    mutationFn: (data: TVariables) => apiClient.post<TData>(endpoint, data),
    onSuccess: () => {
      // Invalidate list queries
      cacheUtils.invalidateByPattern(queryKeys.lists())
    },
    ...options,
  })
}

export function useUpdate<TData, TVariables = any>(
  endpoint: string,
  options?: UseMutationOptions<ApiResponse<TData>, ApiError, TVariables & { id: string | number }>,
) {
  return useMutation({
    mutationFn: ({ id, ...data }: TVariables & { id: string | number }) =>
      apiClient.put<TData>(`${endpoint}/${id}`, data),
    onSuccess: (data, variables) => {
      // Invalidate list queries
      cacheUtils.invalidateByPattern(queryKeys.lists())
      // Invalidate detail query
      cacheUtils.invalidateByPattern(queryKeys.detail(variables.id))
    },
    ...options,
  })
}

export function usePartialUpdate<TData, TVariables = any>(
  endpoint: string,
  options?: UseMutationOptions<ApiResponse<TData>, ApiError, TVariables & { id: string | number }>,
) {
  return useMutation({
    mutationFn: ({ id, ...data }: TVariables & { id: string | number }) =>
      apiClient.patch<TData>(`${endpoint}/${id}`, data),
    onSuccess: (data, variables) => {
      // Invalidate list queries
      cacheUtils.invalidateByPattern(queryKeys.lists())
      // Invalidate detail query
      cacheUtils.invalidateByPattern(queryKeys.detail(variables.id))
    },
    ...options,
  })
}

export function useDelete<TData = any>(
  endpoint: string,
  options?: UseMutationOptions<ApiResponse<TData>, ApiError, string | number>,
) {
  return useMutation({
    mutationFn: (id: string | number) => apiClient.delete<TData>(`${endpoint}/${id}`),
    onSuccess: (data, id) => {
      // Invalidate list queries
      cacheUtils.invalidateByPattern(queryKeys.lists())
      // Remove detail query
      cacheUtils.removeByPattern(queryKeys.detail(id))
    },
    ...options,
  })
}

// File upload hook
export function useUpload<TData = any>(
  endpoint: string,
  options?: UseMutationOptions<ApiResponse<TData>, ApiError, FormData>,
) {
  return useMutation({
    mutationFn: (formData: FormData) => apiClient.upload<TData>(endpoint, formData),
    ...options,
  })
}

// Auth hooks
export function useAuth() {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: () => apiClient.get('/auth/me'),
    retry: false,
    staleTime: Infinity, // Don't refetch auth data automatically
  })
}

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      apiClient.post('/auth/login', credentials),
    onSuccess: (data) => {
      // Set auth token
      if (data.data.token) {
        apiClient.setAuthToken(data.data.token)
      }
      // Invalidate auth queries
      cacheUtils.invalidateByPattern(queryKeys.auth.all)
    },
  })
}

export function useLogout() {
  return useMutation({
    mutationFn: () => apiClient.post('/auth/logout'),
    onSuccess: () => {
      // Clear auth token
      apiClient.setAuthToken(null)
      // Clear all cache
      cacheUtils.clearAll()
    },
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: (userData: { email: string; password: string; name: string; [key: string]: any }) =>
      apiClient.post('/auth/register', userData),
  })
}

// Utility hooks
export function usePrefetch() {
  return {
    prefetchList: <T>(endpoint: string, filters: ListFilters = {}) => {
      return cacheUtils.prefetch(queryKeys.list(filters), () =>
        apiClient.get<PaginatedResponse<T>>(endpoint, filters),
      )
    },
    prefetchDetail: <T>(endpoint: string, id: string | number) => {
      return cacheUtils.prefetch(queryKeys.detail(id), () => apiClient.get<T>(`${endpoint}/${id}`))
    },
  }
}

// Optimistic update utilities
export function useOptimisticUpdate() {
  return {
    updateList: <T>(filters: ListFilters, updater: (old: T[]) => T[]) => {
      const queryKey = queryKeys.list(filters)
      const previousData = cacheUtils.getCachedData<ApiResponse<PaginatedResponse<T>>>(queryKey)

      if (previousData) {
        cacheUtils.setCachedData(queryKey, {
          ...previousData,
          data: {
            ...previousData.data,
            data: updater(previousData.data.data),
          },
        })
      }

      return previousData
    },

    updateDetail: <T>(id: string | number, updater: (old: T) => T) => {
      const queryKey = queryKeys.detail(id)
      const previousData = cacheUtils.getCachedData<ApiResponse<T>>(queryKey)

      if (previousData) {
        cacheUtils.setCachedData(queryKey, {
          ...previousData,
          data: updater(previousData.data),
        })
      }

      return previousData
    },
  }
}
