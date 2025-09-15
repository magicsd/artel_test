import { createFileRoute, redirect } from '@tanstack/react-router'

const SettingsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p>Settings page content will go here.</p>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/settings/')({
  component: SettingsPage,
  beforeLoad: ({ context }) => {
    // Require authentication
    if (!context.auth?.isAuthenticated) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: '/settings',
        },
      })
    }
  },
  meta: () => ({
    title: 'Settings',
    description: 'Application settings',
    requiresAuth: true,
    breadcrumb: 'Settings',
    icon: 'settings',
  }),
})

