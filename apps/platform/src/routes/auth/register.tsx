import { createFileRoute, redirect } from '@tanstack/react-router'
import { RegisterPage } from '../../pages/register-page'

interface RegisterSearch {
  redirect?: string
  message?: string
}

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
  validateSearch: (search: Record<string, unknown>): RegisterSearch => ({
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

