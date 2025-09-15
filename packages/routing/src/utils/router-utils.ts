import type { QueryClient } from '@tanstack/react-query'
import type { Router } from '@tanstack/react-router'
import type {
  RouteLoaderContext,
  RouteGuard,
  BreadcrumbItem,
  RouteMeta,
  NavigationOptions,
} from '../types/router'

/**
 * Create route loader context
 */
export function createRouteLoaderContext(
  queryClient: QueryClient,
  router: Router,
  auth?: RouteLoaderContext['auth'],
): RouteLoaderContext {
  return {
    queryClient,
    router,
    auth,
  }
}

/**
 * Route guard utilities
 */
export class RouteGuards {
  private static guards: Map<string, RouteGuard> = new Map()

  static register(guard: RouteGuard) {
    this.guards.set(guard.name, guard)
  }

  static async canActivate(guardName: string, context: RouteLoaderContext): Promise<boolean> {
    const guard = this.guards.get(guardName)
    if (!guard) {
      console.warn(`Route guard "${guardName}" not found`)
      return true
    }

    try {
      return await guard.canActivate(context)
    } catch (error) {
      console.error(`Route guard "${guardName}" failed:`, error)
      return false
    }
  }

  static getRedirectPath(guardName: string): string | undefined {
    const guard = this.guards.get(guardName)
    return guard?.redirectTo
  }

  static getErrorMessage(guardName: string): string | undefined {
    const guard = this.guards.get(guardName)
    return guard?.errorMessage
  }
}

/**
 * Authentication guard
 */
export const authGuard: RouteGuard = {
  name: 'auth',
  canActivate: (context) => {
    return context.auth?.isAuthenticated ?? false
  },
  redirectTo: '/login',
  errorMessage: 'Authentication required',
}

/**
 * Guest guard (for login/register pages)
 */
export const guestGuard: RouteGuard = {
  name: 'guest',
  canActivate: (context) => {
    return !context.auth?.isAuthenticated
  },
  redirectTo: '/dashboard',
  errorMessage: 'Already authenticated',
}

/**
 * Role-based guard
 */
export function createRoleGuard(requiredRoles: string[]): RouteGuard {
  return {
    name: `role:${requiredRoles.join(',')}`,
    canActivate: (context) => {
      if (!context.auth?.isAuthenticated) return false

      const userRoles = context.auth.user?.roles || []
      return requiredRoles.some((role) => userRoles.includes(role))
    },
    redirectTo: '/dashboard',
    errorMessage: 'Insufficient permissions',
  }
}

/**
 * Breadcrumb utilities
 */
export class BreadcrumbUtils {
  static generateFromPath(path: string, meta?: RouteMeta): BreadcrumbItem[] {
    const segments = path.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', path: '/', icon: 'home' }]

    let currentPath = ''
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === segments.length - 1

      breadcrumbs.push({
        label: isLast && meta?.breadcrumb ? meta.breadcrumb : this.formatSegment(segment),
        path: isLast ? undefined : currentPath,
        active: isLast,
      })
    })

    return breadcrumbs
  }

  private static formatSegment(segment: string): string {
    // Handle dynamic segments
    if (segment.startsWith('$')) {
      return segment.slice(1).charAt(0).toUpperCase() + segment.slice(2)
    }

    // Format regular segments
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
  }
}

/**
 * Query integration utilities
 */
export class QueryIntegration {
  /**
   * Prefetch data for a route
   */
  static async prefetchRouteData(
    queryClient: QueryClient,
    queryKey: string[],
    queryFn: () => Promise<unknown>,
    staleTime = 5 * 60 * 1000, // 5 minutes
  ) {
    await queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime,
    })
  }

  /**
   * Invalidate queries when leaving a route
   */
  static invalidateQueries(queryClient: QueryClient, queryKeys: string[][]) {
    queryKeys.forEach((queryKey) => {
      queryClient.invalidateQueries({ queryKey })
    })
  }

  /**
   * Ensure fresh data on route enter
   */
  static async ensureFreshData(
    queryClient: QueryClient,
    queryKey: string[],
    queryFn: () => Promise<unknown>,
  ) {
    const data = queryClient.getQueryData(queryKey)
    if (!data) {
      await queryClient.fetchQuery({
        queryKey,
        queryFn,
      })
    }
  }
}

/**
 * Navigation utilities
 */
export class NavigationUtils {
  /**
   * Build search params string
   */
  static buildSearchParams(params: Record<string, unknown>): string {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, String(value))
      }
    })

    return searchParams.toString()
  }

  /**
   * Parse search params from string
   */
  static parseSearchParams(search: string): Record<string, string> {
    const params = new URLSearchParams(search)
    const result: Record<string, string> = {}

    params.forEach((value, key) => {
      result[key] = value
    })

    return result
  }

  /**
   * Merge navigation options
   */
  static mergeNavigationOptions(
    base: NavigationOptions,
    override: NavigationOptions,
  ): NavigationOptions {
    return {
      ...base,
      ...override,
      search: { ...base.search, ...override.search },
      params: { ...base.params, ...override.params },
    }
  }
}

/**
 * Route metadata utilities
 */
export class MetaUtils {
  /**
   * Update document title
   */
  static updateTitle(title?: string, siteName = 'ArtelOnline') {
    document.title = title ? `${title} | ${siteName}` : siteName
  }

  /**
   * Update meta description
   */
  static updateDescription(description?: string) {
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription && description) {
      metaDescription.setAttribute('content', description)
    }
  }

  /**
   * Apply route meta
   */
  static applyRouteMeta(meta?: RouteMeta) {
    if (!meta) return

    if (meta.title) {
      this.updateTitle(meta.title)
    }

    if (meta.description) {
      this.updateDescription(meta.description)
    }
  }
}

/**
 * Error handling utilities
 */
export class ErrorUtils {
  /**
   * Create standardized route error
   */
  static createRouteError(status: number, statusText: string, message: string, data?: unknown) {
    return {
      status,
      statusText,
      message,
      data,
    }
  }

  /**
   * Handle route errors
   */
  static handleRouteError(error: unknown) {
    console.error('Route error:', error)

    if (error instanceof Error) {
      return this.createRouteError(500, 'Internal Error', error.message)
    }

    return this.createRouteError(500, 'Unknown Error', 'An unknown error occurred')
  }
}

// Register default guards
RouteGuards.register(authGuard)
RouteGuards.register(guestGuard)
