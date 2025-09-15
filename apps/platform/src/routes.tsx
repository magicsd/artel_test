import { createRootRoute, createRoute, redirect } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Layout } from './components/layout'
import { HomePage, AboutPage, DashboardPage, LoginPage, RegisterPage } from './pages'

// Router context type
interface RouterContext {
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

// Root route
export const rootRoute = createRootRoute<RouterContext>({
  component: () => (
    <>
      <Layout />
      {process.env.NODE_ENV === 'development' && (
        <TanStackRouterDevtools position="bottom-right" />
      )}
    </>
  ),
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">The page you are looking for does not exist.</p>
      <a
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go Home
      </a>
    </div>
  ),
})

// Home route
export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
  meta: () => ({
    title: 'Home',
    description: 'Welcome to ArtelOnline platform',
    requiresAuth: false,
  }),
})

// About route
export const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
  meta: () => ({
    title: 'About',
    description: 'Learn more about ArtelOnline',
    requiresAuth: false,
    breadcrumb: 'About',
  }),
})

// Auth routes (without layout)
export const authRootRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: () => <div id="auth-outlet" />,
})

// Login route
export const loginRoute = createRoute({
  getParentRoute: () => authRootRoute,
  path: '/login',
  component: LoginPage,
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: search.redirect as string,
    error: search.error as string,
  }),
  beforeLoad: ({ context, search }) => {
    // Redirect if already authenticated
    if (context.auth?.isAuthenticated) {
      throw redirect({
        to: search.redirect || '/dashboard',
      })
    }
  },
  meta: () => ({
    title: 'Login',
    description: 'Sign in to your account',
    requiresAuth: false,
    layout: 'auth',
  }),
})

// Register route
export const registerRoute = createRoute({
  getParentRoute: () => authRootRoute,
  path: '/register',
  component: RegisterPage,
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: search.redirect as string,
    message: search.message as string,
  }),
  beforeLoad: ({ context, search }) => {
    // Redirect if already authenticated
    if (context.auth?.isAuthenticated) {
      throw redirect({
        to: search.redirect || '/dashboard',
      })
    }
  },
  meta: () => ({
    title: 'Register',
    description: 'Create a new account',
    requiresAuth: false,
    layout: 'auth',
  }),
})

// Protected routes (with layout)
export const protectedRootRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app',
  component: () => <div id="app-outlet" />,
  beforeLoad: ({ context }) => {
    // Require authentication for all protected routes
    if (!context.auth?.isAuthenticated) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: '/app/dashboard',
        },
      })
    }
  },
})

// Dashboard route
export const dashboardRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/dashboard',
  component: DashboardPage,
  loader: async ({ context }) => {
    // Prefetch dashboard data
    return context.queryClient.ensureQueryData({
      queryKey: ['dashboard'],
      queryFn: async () => {
        // Mock dashboard data
        return {
          stats: {
            totalProjects: 12,
            activeProjects: 8,
            completedTasks: 156,
            pendingTasks: 23,
          },
          recentActivity: [
            { id: 1, type: 'project_created', message: 'New project created', timestamp: new Date() },
            { id: 2, type: 'task_completed', message: 'Task completed', timestamp: new Date() },
          ],
        }
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  },
  meta: () => ({
    title: 'Dashboard',
    description: 'Your project dashboard',
    requiresAuth: true,
    breadcrumb: 'Dashboard',
    icon: 'dashboard',
  }),
})

// Profile route
export const profileRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/profile',
  component: () => (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p>User profile page content will go here.</p>
      </div>
    </div>
  ),
  loader: async ({ context }) => {
    // Prefetch user profile data
    return context.queryClient.ensureQueryData({
      queryKey: ['profile', context.auth?.user?.id],
      queryFn: async () => {
        // Mock profile data
        return {
          id: context.auth?.user?.id,
          name: context.auth?.user?.name,
          email: context.auth?.user?.email,
          avatar: null,
          bio: '',
          location: '',
          website: '',
          joinedAt: new Date(),
        }
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
    })
  },
  meta: () => ({
    title: 'Profile',
    description: 'Your user profile',
    requiresAuth: true,
    breadcrumb: 'Profile',
    icon: 'user',
  }),
})

// Settings route
export const settingsRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/settings',
  component: () => (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p>Settings page content will go here.</p>
      </div>
    </div>
  ),
  meta: () => ({
    title: 'Settings',
    description: 'Application settings',
    requiresAuth: true,
    breadcrumb: 'Settings',
    icon: 'settings',
  }),
})

// Projects routes
export const projectsRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/projects',
  component: () => (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p>Projects list will go here.</p>
      </div>
    </div>
  ),
  meta: () => ({
    title: 'Projects',
    description: 'Manage your projects',
    requiresAuth: true,
    breadcrumb: 'Projects',
    icon: 'folder',
  }),
})

// Project detail route
export const projectDetailRoute = createRoute({
  getParentRoute: () => projectsRoute,
  path: '/$projectId',
  component: ({ useParams }) => {
    const { projectId } = useParams()
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Project {projectId}</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Project details for {projectId} will go here.</p>
        </div>
      </div>
    )
  },
  loader: async ({ context, params }) => {
    // Prefetch project data
    return context.queryClient.ensureQueryData({
      queryKey: ['projects', params.projectId],
      queryFn: async () => {
        // Mock project data
        return {
          id: params.projectId,
          name: `Project ${params.projectId}`,
          description: 'Project description',
          status: 'active',
          createdAt: new Date(),
        }
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  },
  meta: ({ params }) => ({
    title: `Project ${params.projectId}`,
    description: `Details for project ${params.projectId}`,
    requiresAuth: true,
    breadcrumb: `Project ${params.projectId}`,
  }),
})

// Create route tree
export const routeTree = rootRoute.addChildren([
  homeRoute,
  aboutRoute,
  authRootRoute.addChildren([
    loginRoute,
    registerRoute,
  ]),
  protectedRootRoute.addChildren([
    dashboardRoute,
    profileRoute,
    settingsRoute,
    projectsRoute.addChildren([
      projectDetailRoute,
    ]),
  ]),
])

// Export route types for type safety
export type RouteTree = typeof routeTree

