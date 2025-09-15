import type { QueryClient } from '@tanstack/react-query'
import type { Router } from '@tanstack/react-router'

// Router context type
export interface RouterContext {
  queryClient: QueryClient
  auth?: {
    isAuthenticated: boolean
    user?: {
      id: string
      email: string
      name: string
    }
  }
}

// Route search params types
export interface SearchParams {
  page?: number
  limit?: number
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
}

// Auth route search params
export interface AuthSearchParams {
  redirect?: string
  error?: string
  message?: string
}

// Route loader context
export interface RouteLoaderContext {
  queryClient: QueryClient
  router: Router
  auth?: RouterContext['auth']
}

// Route error types
export interface RouteError {
  status: number
  statusText: string
  message: string
  data?: unknown
}

// Navigation options
export interface NavigationOptions {
  replace?: boolean
  resetScroll?: boolean
  from?: string
  search?: Record<string, unknown>
  params?: Record<string, string>
  hash?: string
  state?: unknown
}

// Route meta information
export interface RouteMeta {
  title?: string
  description?: string
  requiresAuth?: boolean
  roles?: string[]
  breadcrumb?: string
  icon?: string
  hidden?: boolean
  layout?: 'default' | 'auth' | 'minimal'
}

// Route configuration
export interface RouteConfig {
  path: string
  component?: React.ComponentType
  loader?: (context: RouteLoaderContext) => Promise<unknown> | unknown
  beforeLoad?: (context: RouteLoaderContext) => Promise<void> | void
  errorComponent?: React.ComponentType<{ error: RouteError }>
  pendingComponent?: React.ComponentType
  notFoundComponent?: React.ComponentType
  meta?: RouteMeta
  children?: RouteConfig[]
}

// Router configuration
export interface RouterConfig {
  basepath?: string
  defaultPreload?: 'intent' | 'render' | false
  defaultPreloadStaleTime?: number
  defaultComponent?: React.ComponentType
  defaultErrorComponent?: React.ComponentType<{ error: RouteError }>
  defaultPendingComponent?: React.ComponentType
  defaultNotFoundComponent?: React.ComponentType
  context?: RouterContext
  routes: RouteConfig[]
}

// Route params for different routes
export interface RouteParams {
  '/': Record<string, never>
  '/login': Record<string, never>
  '/register': Record<string, never>
  '/dashboard': Record<string, never>
  '/profile': Record<string, never>
  '/settings': Record<string, never>
  '/users': Record<string, never>
  '/users/$userId': { userId: string }
  '/projects': Record<string, never>
  '/projects/$projectId': { projectId: string }
  '/projects/$projectId/tasks': { projectId: string }
  '/projects/$projectId/tasks/$taskId': { projectId: string; taskId: string }
}

// Type-safe navigation function
export type Navigate = <T extends keyof RouteParams>(
  to: T,
  options?: NavigationOptions & {
    params?: RouteParams[T]
  },
) => void

// Route guards
export interface RouteGuard {
  name: string
  canActivate: (context: RouteLoaderContext) => Promise<boolean> | boolean
  redirectTo?: string
  errorMessage?: string
}

// Breadcrumb item
export interface BreadcrumbItem {
  label: string
  path?: string
  icon?: string
  active?: boolean
}

// Layout props
export interface LayoutProps {
  children: React.ReactNode
  meta?: RouteMeta
  breadcrumbs?: BreadcrumbItem[]
}
