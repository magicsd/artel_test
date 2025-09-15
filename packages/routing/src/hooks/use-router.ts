import { useQueryClient } from '@tanstack/react-query'
import {
  useRouter as useTanStackRouter,
  useNavigate,
  useLocation,
  useParams,
  useSearch,
} from '@tanstack/react-router'
import { useMemo, useCallback } from 'react'
import type { NavigationOptions, BreadcrumbItem, RouteMeta } from '../types/router'
import { BreadcrumbUtils, MetaUtils } from '../utils/router-utils'

/**
 * Enhanced router hook with additional utilities
 */
export function useRouter() {
  const router = useTanStackRouter()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()

  const navigateWithOptions = useCallback(
    (to: string, options?: NavigationOptions) => {
      navigate({
        to,
        replace: options?.replace,
        resetScroll: options?.resetScroll,
        search: options?.search,
        params: options?.params,
        hash: options?.hash,
        state: options?.state,
      })
    },
    [navigate],
  )

  const goBack = useCallback(() => {
    window.history.back()
  }, [])

  const goForward = useCallback(() => {
    window.history.forward()
  }, [])

  const refresh = useCallback(() => {
    router.invalidate()
  }, [router])

  return {
    router,
    navigate: navigateWithOptions,
    location,
    queryClient,
    goBack,
    goForward,
    refresh,
  }
}

/**
 * Hook for route parameters with type safety
 */
export function useRouteParams<T = Record<string, string>>(): T {
  return useParams() as T
}

/**
 * Hook for search parameters with type safety
 */
export function useRouteSearch<T = Record<string, unknown>>(): T {
  return useSearch() as T
}

/**
 * Hook for breadcrumbs generation
 */
export function useBreadcrumbs(meta?: RouteMeta): BreadcrumbItem[] {
  const location = useLocation()

  return useMemo(() => {
    return BreadcrumbUtils.generateFromPath(location.pathname, meta)
  }, [location.pathname, meta])
}

/**
 * Hook for route metadata management
 */
export function useRouteMeta(meta?: RouteMeta) {
  const location = useLocation()

  // Apply meta on route change
  useMemo(() => {
    MetaUtils.applyRouteMeta(meta)
  }, [meta, location.pathname])

  const updateTitle = useCallback((title: string) => {
    MetaUtils.updateTitle(title)
  }, [])

  const updateDescription = useCallback((description: string) => {
    MetaUtils.updateDescription(description)
  }, [])

  return {
    updateTitle,
    updateDescription,
  }
}

/**
 * Hook for route guards
 */
export function useRouteGuards() {
  const { router } = useRouter()
  const queryClient = useQueryClient()

  const checkGuard = useCallback(
    async (guardName: string, auth?: any) => {
      const { RouteGuards } = await import('../utils/router-utils')
      const context = {
        queryClient,
        router: router.router,
        auth,
      }
      
      return RouteGuards.canActivate(guardName, context)
    },
    [router, queryClient]
  )

  const redirectIfGuardFails = useCallback(
    async (guardName: string, auth?: any) => {
      const canActivate = await checkGuard(guardName, auth)
      
      if (!canActivate) {
        const { RouteGuards } = await import('../utils/router-utils')
        const redirectPath = RouteGuards.getRedirectPath(guardName)
        
        if (redirectPath) {
          router.navigate(redirectPath, { replace: true })
        }
      }
      
      return canActivate
    },
    [checkGuard, router]
  )

  return {
    checkGuard,
    redirectIfGuardFails,
  }
}

/**
 * Hook for query integration
 */
export function useRouteQuery() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const prefetchData = useCallback(
    async (queryKey: string[], queryFn: () => Promise<unknown>, staleTime?: number) => {
      const { QueryIntegration } = await import('../utils/router-utils')
      return QueryIntegration.prefetchRouteData(queryClient, queryKey, queryFn, staleTime)
    },
    [queryClient],
  )

  const invalidateQueries = useCallback(
    (queryKeys: string[][]) => {
      const { QueryIntegration } = await import('../utils/router-utils')
      QueryIntegration.invalidateQueries(queryClient, queryKeys)
    },
    [queryClient],
  )

  const ensureFreshData = useCallback(
    async (queryKey: string[], queryFn: () => Promise<unknown>) => {
      const { QueryIntegration } = await import('../utils/router-utils')
      return QueryIntegration.ensureFreshData(queryClient, queryKey, queryFn)
    },
    [queryClient],
  )

  return {
    prefetchData,
    invalidateQueries,
    ensureFreshData,
  }
}

/**
 * Hook for navigation utilities
 */
export function useNavigation() {
  const { navigate } = useRouter()
  const location = useLocation()

  const navigateWithSearch = useCallback(
    (to: string, searchParams: Record<string, unknown>, options?: NavigationOptions) => {
      import('../utils/router-utils').then(({ NavigationUtils }) => {
        const search = NavigationUtils.buildSearchParams(searchParams)
        
        navigate(to, {
          ...options,
          search: search ? `?${search}` : undefined,
        })
      })
    },
    [navigate]
  )

  const updateSearch = useCallback(
    (searchParams: Record<string, unknown>, options?: NavigationOptions) => {
      navigateWithSearch(location.pathname, searchParams, options)
    },
    [navigateWithSearch, location.pathname],
  )

  const clearSearch = useCallback(
    (options?: NavigationOptions) => {
      navigate(location.pathname, options)
    },
    [navigate, location.pathname],
  )

  return {
    navigateWithSearch,
    updateSearch,
    clearSearch,
  }
}

/**
 * Hook for route loading states
 */
export function useRouteLoading() {
  const router = useTanStackRouter()

  const isLoading = router.state.isLoading
  const isPending = router.state.status === 'pending'
  const isTransitioning = router.state.isTransitioning

  return {
    isLoading,
    isPending,
    isTransitioning,
    isIdle: !isLoading && !isPending && !isTransitioning,
  }
}

/**
 * Hook for route errors
 */
export function useRouteError() {
  const router = useTanStackRouter()
  const location = useLocation()

  const error = router.state.matches.find((match) => match.error)?.error
  const hasError = !!error

  const clearError = useCallback(() => {
    router.invalidate()
  }, [router])

  return {
    error,
    hasError,
    clearError,
  }
}
