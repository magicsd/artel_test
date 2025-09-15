import { createCodeBasedRouter, RouteBuilder } from '@artelonline/routing'
import { queryClient } from './router'
import { Layout } from './components/layout'
import { HomePage, AboutPage, DashboardPage, LoginPage, RegisterPage } from './pages'

// Router context
const routerContext = {
  queryClient,
  auth: {
    isAuthenticated: false, // This will be updated by auth provider
    user: undefined,
  },
}

// Create code-based router
export const codeBasedRouter = createCodeBasedRouter(routerContext)
  .setRootComponent(Layout)
  .addRoutes([
    // Public routes
    RouteBuilder.create('/')
      .component(HomePage)
      .meta(() => ({
        title: 'Home',
        description: 'Welcome to ArtelOnline platform',
        requiresAuth: false,
      }))
      .build(),

    RouteBuilder.create('/about')
      .component(AboutPage)
      .meta(() => ({
        title: 'About',
        description: 'Learn more about ArtelOnline',
        requiresAuth: false,
        breadcrumb: 'About',
      }))
      .build(),

    // Auth routes (guest only)
    RouteBuilder.create('/auth/login')
      .component(LoginPage)
      .requireGuest()
      .layout('auth')
      .meta(() => ({
        title: 'Login',
        description: 'Sign in to your account',
        requiresAuth: false,
      }))
      .build(),

    RouteBuilder.create('/auth/register')
      .component(RegisterPage)
      .requireGuest()
      .layout('auth')
      .meta(() => ({
        title: 'Register',
        description: 'Create a new account',
        requiresAuth: false,
      }))
      .build(),

    // Protected routes (auth required)
    RouteBuilder.create('/dashboard')
      .component(DashboardPage)
      .requireAuth()
      .loader(async ({ context }) => {
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
      })
      .meta(() => ({
        title: 'Dashboard',
        description: 'Your project dashboard',
        requiresAuth: true,
        breadcrumb: 'Dashboard',
        icon: 'dashboard',
      }))
      .build(),

    RouteBuilder.create('/profile')
      .component(() => (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Profile</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p>User profile page content will go here.</p>
          </div>
        </div>
      ))
      .requireAuth()
      .loader(async ({ context }) => {
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
      })
      .meta(() => ({
        title: 'Profile',
        description: 'Your user profile',
        requiresAuth: true,
        breadcrumb: 'Profile',
        icon: 'user',
      }))
      .build(),

    RouteBuilder.create('/settings')
      .component(() => (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p>Settings page content will go here.</p>
          </div>
        </div>
      ))
      .requireAuth()
      .meta(() => ({
        title: 'Settings',
        description: 'Application settings',
        requiresAuth: true,
        breadcrumb: 'Settings',
        icon: 'settings',
      }))
      .build(),

    // Admin routes
    RouteBuilder.create('/admin/users')
      .component(() => (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">User Management</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p>Admin user management will go here.</p>
          </div>
        </div>
      ))
      .requireAdmin()
      .meta(() => ({
        title: 'User Management',
        description: 'Manage system users',
        requiresAuth: true,
        roles: ['admin'],
        breadcrumb: 'Users',
        icon: 'users',
      }))
      .build(),
  ])

// Build the router
export const router = codeBasedRouter.build()

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Export router types
export type Router = typeof router

