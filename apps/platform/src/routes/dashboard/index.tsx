import { createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardPage } from '../../pages/dashboard-page'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
  beforeLoad: ({ context }) => {
    // Require authentication
    if (!context.auth?.isAuthenticated) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: '/dashboard',
        },
      })
    }
  },
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

