import { createRouter, createMemoryHistory } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { routeTree } from './routes'

// Create query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false
        }
        return failureCount < 3
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: false,
    },
  },
})

// Mock auth context (replace with real auth implementation)
const mockAuth = {
  isAuthenticated: false,
  user: undefined,
}

// Create router with code-based routes
export const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: mockAuth,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
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
  defaultPendingComponent: () => (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="text-gray-600">Loading...</span>
      </div>
    </div>
  ),
  // Use memory history for better control (can switch to browser history)
  history: createMemoryHistory({
    initialEntries: ['/'],
  }),
})

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Export router types
export type Router = typeof router

