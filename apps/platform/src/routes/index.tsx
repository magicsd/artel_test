import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../pages/home-page'

export const Route = createFileRoute('/')({
  component: HomePage,
  meta: () => ({
    title: 'Home',
    description: 'Welcome to ArtelOnline platform',
    requiresAuth: false,
  }),
})

