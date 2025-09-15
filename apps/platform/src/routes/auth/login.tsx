import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginPage } from '../../pages/login-page'

interface LoginSearch {
  redirect?: string
  error?: string
}

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
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

