import { createFileRoute, redirect } from '@tanstack/react-router'

const ProfilePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p>User profile page content will go here.</p>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/profile/')({
  component: ProfilePage,
  beforeLoad: ({ context }) => {
    // Require authentication
    if (!context.auth?.isAuthenticated) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: '/profile',
        },
      })
    }
  },
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

