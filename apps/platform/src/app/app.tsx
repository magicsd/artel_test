import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryProvider, ThemeProvider } from '@artelonline/shared'
import { Toaster } from '@artelonline/ui'
import { router, queryClient } from '../router'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <QueryProvider>
        <ThemeProvider defaultTheme="system" storageKey="artel-ui-theme">
          <RouterProvider router={router} />
          <Toaster richColors position="bottom-right" />
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </ThemeProvider>
      </QueryProvider>
    </QueryClientProvider>
  )
}

export default App
