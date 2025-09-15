import { RouterProvider as TanStackRouterProvider } from '@tanstack/react-router'
import type { Router } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

interface RouterProviderProps {
  router: Router
  children?: React.ReactNode
  enableDevtools?: boolean
}

export function RouterProvider({
  router,
  children,
  enableDevtools = process.env.NODE_ENV === 'development',
}: RouterProviderProps) {
  return (
    <>
      <TanStackRouterProvider router={router}>{children}</TanStackRouterProvider>
      {enableDevtools && <TanStackRouterDevtools router={router} />}
    </>
  )
}
