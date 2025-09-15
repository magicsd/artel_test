# @artelonline/routing

A comprehensive routing package built on top of TanStack Router with full TypeScript support, TanStack Query integration, and enterprise-grade features.

## Features

- 🚀 **TanStack Router Integration** - Full type-safe routing with code-based configuration
- 🔄 **TanStack Query Integration** - Seamless data fetching and caching
- 🛡️ **Route Guards** - Authentication and authorization protection
- 🍞 **Breadcrumbs** - Automatic breadcrumb generation
- 📱 **Responsive** - Mobile-first design approach
- 🎨 **Customizable** - Flexible styling and theming
- 🔧 **Developer Tools** - Built-in devtools for debugging
- 📊 **Loading States** - Comprehensive loading and error handling
- 🌐 **i18n Ready** - Internationalization support

## Installation

```bash
pnpm add @artelonline/routing
```

## Quick Start

### 1. Create Router Configuration

```typescript
import { createRouter } from '@artelonline/routing'
import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

const router = createRouter({
  context: {
    queryClient,
    auth: {
      isAuthenticated: false,
    },
  },
  routes: [
    // Your routes here
  ],
})
```

### 2. Setup Router Provider

```tsx
import { RouterProvider } from '@artelonline/routing'

function App() {
  return (
    <RouterProvider router={router}>
      {/* Your app content */}
    </RouterProvider>
  )
}
```

### 3. Define Routes

```typescript
import { createRoute } from '@artelonline/routing'

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
  meta: {
    title: 'Home',
    requiresAuth: false,
  },
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
  beforeLoad: async ({ context }) => {
    // Route guard logic
    if (!context.auth?.isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  loader: async ({ context }) => {
    // Prefetch data
    return context.queryClient.ensureQueryData({
      queryKey: ['dashboard'],
      queryFn: fetchDashboardData,
    })
  },
  meta: {
    title: 'Dashboard',
    requiresAuth: true,
    breadcrumb: 'Dashboard',
  },
})
```

## Core Concepts

### Route Guards

Protect routes with authentication and authorization:

```typescript
import { RouteGuard, authGuard, createRoleGuard } from '@artelonline/routing'

// Built-in auth guard
const protectedRoute = createRoute({
  // ...
  beforeLoad: async ({ context }) => {
    const canActivate = await RouteGuards.canActivate('auth', context)
    if (!canActivate) {
      throw redirect({ to: '/login' })
    }
  },
})

// Custom role-based guard
const adminGuard = createRoleGuard(['admin'])
RouteGuards.register(adminGuard)
```

### TanStack Query Integration

Seamlessly integrate data fetching:

```typescript
const userRoute = createRoute({
  path: '/users/$userId',
  loader: async ({ context, params }) => {
    // Prefetch user data
    return context.queryClient.ensureQueryData({
      queryKey: ['users', params.userId],
      queryFn: () => fetchUser(params.userId),
    })
  },
  component: ({ useLoaderData }) => {
    const user = useLoaderData()
    return <UserProfile user={user} />
  },
})
```

### Breadcrumbs

Automatic breadcrumb generation:

```tsx
import { Breadcrumbs, useBreadcrumbs } from '@artelonline/routing'

function Layout() {
  return (
    <div>
      <Breadcrumbs 
        separator=">"
        maxItems={5}
        className="mb-4"
      />
      {/* Page content */}
    </div>
  )
}

// Or use the hook directly
function CustomBreadcrumbs() {
  const breadcrumbs = useBreadcrumbs()
  
  return (
    <nav>
      {breadcrumbs.map((item, index) => (
        <span key={index}>{item.label}</span>
      ))}
    </nav>
  )
}
```

### Loading States

Handle loading and error states:

```tsx
import { LoadingSpinner, ErrorBoundary } from '@artelonline/routing'

const route = createRoute({
  // ...
  pendingComponent: () => <LoadingSpinner text="Loading page..." />,
  errorComponent: ({ error, reset }) => (
    <ErrorBoundary error={error} reset={reset} />
  ),
})
```

## Hooks

### useRouter

Enhanced router hook with utilities:

```tsx
import { useRouter } from '@artelonline/routing'

function MyComponent() {
  const { navigate, goBack, refresh, location } = useRouter()
  
  const handleNavigate = () => {
    navigate('/dashboard', {
      search: { tab: 'settings' },
      replace: true,
    })
  }
  
  return <button onClick={handleNavigate}>Go to Dashboard</button>
}
```

### useRouteParams & useRouteSearch

Type-safe parameter and search handling:

```tsx
import { useRouteParams, useRouteSearch } from '@artelonline/routing'

interface UserParams {
  userId: string
}

interface UserSearch {
  tab?: string
  page?: number
}

function UserPage() {
  const { userId } = useRouteParams<UserParams>()
  const { tab, page } = useRouteSearch<UserSearch>()
  
  return <div>User {userId}, Tab: {tab}, Page: {page}</div>
}
```

### useNavigation

Navigation utilities:

```tsx
import { useNavigation } from '@artelonline/routing'

function SearchComponent() {
  const { updateSearch, clearSearch } = useNavigation()
  
  const handleSearch = (query: string) => {
    updateSearch({ q: query, page: 1 })
  }
  
  const handleClear = () => {
    clearSearch()
  }
  
  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      <button onClick={handleClear}>Clear</button>
    </div>
  )
}
```

## Advanced Features

### Route Metadata

Enhance routes with metadata:

```typescript
const route = createRoute({
  // ...
  meta: {
    title: 'User Profile',
    description: 'View and edit user profile',
    requiresAuth: true,
    roles: ['user', 'admin'],
    breadcrumb: 'Profile',
    icon: 'user',
    layout: 'default',
  },
})
```

### Error Handling

Comprehensive error handling:

```typescript
import { ErrorUtils } from '@artelonline/routing'

const route = createRoute({
  // ...
  errorComponent: ({ error }) => {
    const routeError = ErrorUtils.handleRouteError(error)
    return <ErrorBoundary error={routeError} />
  },
})
```

### Query Integration

Advanced query patterns:

```typescript
import { QueryIntegration } from '@artelonline/routing'

const route = createRoute({
  // ...
  beforeLoad: async ({ context }) => {
    // Prefetch related data
    await QueryIntegration.prefetchRouteData(
      context.queryClient,
      ['users'],
      fetchUsers,
      5 * 60 * 1000 // 5 minutes
    )
  },
  onLeave: ({ context }) => {
    // Cleanup on route leave
    QueryIntegration.invalidateQueries(context.queryClient, [
      ['temp-data'],
    ])
  },
})
```

## TypeScript Support

Full TypeScript support with type-safe routing:

```typescript
// Define your route tree
interface RouteTree {
  '/': {}
  '/users': {}
  '/users/$userId': { userId: string }
  '/dashboard': {}
}

// Type-safe navigation
const navigate = useNavigate<RouteTree>()
navigate('/users/123', { params: { userId: '123' } }) // ✅ Type-safe
navigate('/invalid') // ❌ TypeScript error
```

## Best Practices

1. **Route Organization**: Group related routes in feature folders
2. **Lazy Loading**: Use dynamic imports for code splitting
3. **Error Boundaries**: Always provide error components
4. **Loading States**: Show loading indicators for better UX
5. **Route Guards**: Protect sensitive routes
6. **Metadata**: Use route metadata for SEO and navigation
7. **Query Integration**: Leverage TanStack Query for data management

## Contributing

Please read our contributing guidelines and submit pull requests to help improve this package.

## License

MIT License - see LICENSE file for details.

