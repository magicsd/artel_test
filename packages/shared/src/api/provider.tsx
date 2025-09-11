/**
 * TanStack Query Provider
 * Provider component to wrap the app with query client
 */

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactNode } from 'react'
import { queryClient } from './query-client.js'

interface QueryProviderProps {
  children: ReactNode
  showDevtools?: boolean
}

export function QueryProvider({
  children,
  showDevtools = process.env.NODE_ENV === 'development',
}: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {showDevtools && <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />}
    </QueryClientProvider>
  )
}

// HOC for wrapping components with QueryProvider
export function withQueryProvider<P extends object>(
  Component: React.ComponentType<P>,
  options?: { showDevtools?: boolean },
) {
  const WrappedComponent = (props: P) => (
    <QueryProvider showDevtools={options?.showDevtools}>
      <Component {...props} />
    </QueryProvider>
  )

  WrappedComponent.displayName = `withQueryProvider(${Component.displayName || Component.name})`

  return WrappedComponent
}
