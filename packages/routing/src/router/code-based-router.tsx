import { 
  createRouter, 
  createRoute, 
  createRootRoute,
  Router as TanStackRouter,
  RouteComponent,
  LoaderFn,
  BeforeLoadFn,
  redirect,
} from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

// Base router context interface
export interface BaseRouterContext {
  queryClient: QueryClient
  auth?: {
    isAuthenticated: boolean
    user?: {
      id: string
      email: string
      name: string
      roles?: string[]
    }
  }
}

// Route configuration interface
export interface RouteConfig<TParams = any, TSearch = any> {
  path: string
  component: RouteComponent
  loader?: LoaderFn<TParams, TSearch>
  beforeLoad?: BeforeLoadFn<TParams, TSearch>
  meta?: (params: { params: TParams; search: TSearch }) => RouteMeta
  guards?: string[]
  layout?: 'default' | 'auth' | 'minimal' | 'none'
  preload?: boolean | 'intent'
}

// Route metadata interface
export interface RouteMeta {
  title?: string
  description?: string
  requiresAuth?: boolean
  roles?: string[]
  breadcrumb?: string
  icon?: string
  keywords?: string[]
  ogImage?: string
}

// Route guard function type
export type RouteGuardFn = (context: BaseRouterContext) => boolean | Promise<boolean>

// Route guards registry
export class RouteGuards {
  private static guards = new Map<string, RouteGuardFn>()

  static register(name: string, guard: RouteGuardFn) {
    this.guards.set(name, guard)
  }

  static async check(name: string, context: BaseRouterContext): Promise<boolean> {
    const guard = this.guards.get(name)
    if (!guard) {
      console.warn(`Route guard "${name}" not found`)
      return true
    }
    return await guard(context)
  }

  static getRedirectPath(guardName: string): string {
    switch (guardName) {
      case 'auth':
        return '/auth/login'
      case 'guest':
        return '/dashboard'
      case 'admin':
        return '/unauthorized'
      default:
        return '/'
    }
  }
}

// Register default guards
RouteGuards.register('auth', (context) => {
  return context.auth?.isAuthenticated ?? false
})

RouteGuards.register('guest', (context) => {
  return !context.auth?.isAuthenticated
})

RouteGuards.register('admin', (context) => {
  return context.auth?.user?.roles?.includes('admin') ?? false
})

// Code-based router builder
export class CodeBasedRouter<TContext extends BaseRouterContext = BaseRouterContext> {
  private routes: RouteConfig[] = []
  private rootComponent?: RouteComponent
  private context?: TContext
  private router?: TanStackRouter

  constructor(context: TContext) {
    this.context = context
  }

  // Set root component
  setRootComponent(component: RouteComponent) {
    this.rootComponent = component
    return this
  }

  // Add a route
  addRoute(config: RouteConfig) {
    this.routes.push(config)
    return this
  }

  // Add multiple routes
  addRoutes(configs: RouteConfig[]) {
    this.routes.push(...configs)
    return this
  }

  // Create route with guards
  private createRouteWithGuards(config: RouteConfig, parentRoute: any) {
    const beforeLoad: BeforeLoadFn = async ({ context, search }) => {
      // Check route guards
      if (config.guards) {
        for (const guardName of config.guards) {
          const canActivate = await RouteGuards.check(guardName, context as TContext)
          if (!canActivate) {
            const redirectPath = RouteGuards.getRedirectPath(guardName)
            throw redirect({
              to: redirectPath,
              search: guardName === 'auth' ? { redirect: config.path } : undefined,
            })
          }
        }
      }

      // Call original beforeLoad if exists
      if (config.beforeLoad) {
        return await config.beforeLoad({ context, search } as any)
      }
    }

    return createRoute({
      getParentRoute: () => parentRoute,
      path: config.path,
      component: config.component,
      loader: config.loader,
      beforeLoad,
      meta: config.meta,
    })
  }

  // Build the router
  build(): TanStackRouter {
    if (this.router) {
      return this.router
    }

    // Create root route
    const rootRoute = createRootRoute<TContext>({
      component: this.rootComponent || (() => <div id="root-outlet" />),
    })

    // Create routes
    const routeInstances = this.routes.map(config => 
      this.createRouteWithGuards(config, rootRoute)
    )

    // Create route tree
    const routeTree = rootRoute.addChildren(routeInstances)

    // Create router
    this.router = createRouter({
      routeTree,
      context: this.context!,
      defaultPreload: 'intent',
      defaultComponent: () => (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ),
      defaultErrorComponent: ({ error }) => (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      ),
    })

    return this.router
  }

  // Get the built router
  getRouter(): TanStackRouter {
    if (!this.router) {
      throw new Error('Router not built yet. Call build() first.')
    }
    return this.router
  }
}

// Helper function to create a code-based router
export function createCodeBasedRouter<TContext extends BaseRouterContext>(
  context: TContext
): CodeBasedRouter<TContext> {
  return new CodeBasedRouter(context)
}

// Route builder helper
export class RouteBuilder {
  static create(path: string): RouteConfigBuilder {
    return new RouteConfigBuilder(path)
  }
}

class RouteConfigBuilder {
  private config: Partial<RouteConfig> = {}

  constructor(path: string) {
    this.config.path = path
  }

  component(component: RouteComponent) {
    this.config.component = component
    return this
  }

  loader(loader: LoaderFn) {
    this.config.loader = loader
    return this
  }

  beforeLoad(beforeLoad: BeforeLoadFn) {
    this.config.beforeLoad = beforeLoad
    return this
  }

  meta(meta: RouteConfig['meta']) {
    this.config.meta = meta
    return this
  }

  guards(guards: string[]) {
    this.config.guards = guards
    return this
  }

  requireAuth() {
    this.config.guards = [...(this.config.guards || []), 'auth']
    return this
  }

  requireGuest() {
    this.config.guards = [...(this.config.guards || []), 'guest']
    return this
  }

  requireAdmin() {
    this.config.guards = [...(this.config.guards || []), 'admin']
    return this
  }

  layout(layout: RouteConfig['layout']) {
    this.config.layout = layout
    return this
  }

  preload(preload: RouteConfig['preload']) {
    this.config.preload = preload
    return this
  }

  build(): RouteConfig {
    if (!this.config.component) {
      throw new Error('Route component is required')
    }
    return this.config as RouteConfig
  }
}

// Export types
export type { RouteConfig, RouteMeta, RouteGuardFn, BaseRouterContext }

