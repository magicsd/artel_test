# @artelonline/routing - Code-Based Routing

A comprehensive, enterprise-grade routing package for React applications built on top of TanStack Router. This package provides **code-based routing** approach with full TypeScript support, authentication guards, and TanStack Query integration.

## Features

### 🎯 **Code-Based Routing**

- **Programmatic route definitions** - Define routes in code, not files
- **Fluent API** - Chainable route builder for clean configuration
- **Type-safe navigation** - Full TypeScript support with autocomplete
- **Route guards** - Built-in authentication and authorization
- **Metadata support** - SEO, breadcrumbs, and navigation data

### 🔒 **Authentication & Authorization**

- **Route guards** - Protect routes with custom logic
- **Role-based access** - Support for user roles and permissions
- **Automatic redirects** - Smart redirection with context preservation
- **Guest routes** - Restrict authenticated users from auth pages

### 🚀 **Performance & Developer Experience**

- **TanStack Query integration** - Route-level data prefetching
- **Loading states** - Consistent loading indicators
- **Error boundaries** - Graceful error handling with recovery
- **DevTools support** - Built-in debugging tools

## Quick Start - Code-Based Routing

### 1. Create Router Configuration

```typescript
import { createCodeBasedRouter, RouteBuilder } from '@artelonline/routing'
import { queryClient } from './query-client'
import { Layout } from './components/Layout'
import { HomePage, LoginPage, DashboardPage } from './pages'

// Router context
const routerContext = {
  queryClient,
  auth: {
    isAuthenticated: false,
    user: undefined,
  },
}

// Create code-based router
export const router = createCodeBasedRouter(routerContext)
  .setRootComponent(Layout)
  .addRoutes([
    // Public route
    RouteBuilder.create('/')
      .component(HomePage)
      .meta(() => ({
        title: 'Home',
        description: 'Welcome to our platform',
      }))
      .build(),

    // Auth route (guest only)
    RouteBuilder.create('/login').component(LoginPage).requireGuest().layout('auth').build(),

    // Protected route
    RouteBuilder.create('/dashboard')
      .component(DashboardPage)
      .requireAuth()
      .loader(async ({ context }) => {
        return context.queryClient.ensureQueryData({
          queryKey: ['dashboard'],
          queryFn: fetchDashboardData,
        })
      })
      .meta(() => ({
        title: 'Dashboard',
        requiresAuth: true,
        breadcrumb: 'Dashboard',
      }))
      .build(),

    // Admin route
    RouteBuilder.create('/admin').component(AdminPage).requireAdmin().build(),
  ])
  .build()
```

### 2. Setup Router Provider

```typescript
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router-config'

function App() {
  return <RouterProvider router={router} />
}
```

## Route Builder API

The `RouteBuilder` provides a fluent API for defining routes:

### Basic Route

```typescript
RouteBuilder.create('/path').component(MyComponent).build()
```

### Route with Data Loading

```typescript
RouteBuilder.create('/users/$userId')
  .component(UserProfile)
  .loader(async ({ params, context }) => {
    return context.queryClient.ensureQueryData({
      queryKey: ['users', params.userId],
      queryFn: () => fetchUser(params.userId),
    })
  })
  .build()
```

### Protected Route

```typescript
RouteBuilder.create('/dashboard')
  .component(Dashboard)
  .requireAuth() // Requires authentication
  .build()
```

### Admin Route

```typescript
RouteBuilder.create('/admin')
  .component(AdminPanel)
  .requireAdmin() // Requires admin role
  .build()
```

### Route with Metadata

```typescript
RouteBuilder.create('/products')
  .component(ProductList)
  .meta(() => ({
    title: 'Products',
    description: 'Browse our products',
    breadcrumb: 'Products',
    icon: 'shopping-bag',
    keywords: ['products', 'shop', 'buy'],
  }))
  .build()
```

### Custom Guards

```typescript
RouteBuilder.create('/premium')
  .component(PremiumContent)
  .guards(['auth', 'premium']) // Custom guards
  .build()
```

## Route Guards

### Built-in Guards

- **`auth`** - Requires user to be authenticated
- **`guest`** - Requires user to be NOT authenticated
- **`admin`** - Requires user to have admin role

### Custom Guards

```typescript
import { RouteGuards } from '@artelonline/routing'

// Register custom guard
RouteGuards.register('premium', (context) => {
  return context.auth?.user?.subscription === 'premium'
})

// Use in route
RouteBuilder.create('/premium-content')
  .component(PremiumContent)
  .guards(['auth', 'premium'])
  .build()
```

## Best Practices

### 1. **Organize Routes by Feature**

```typescript
// routes/auth.ts
export const authRoutes = [
  RouteBuilder.create('/login').component(LoginPage).requireGuest().build(),
  RouteBuilder.create('/register').component(RegisterPage).requireGuest().build(),
]

// routes/dashboard.ts
export const dashboardRoutes = [
  RouteBuilder.create('/dashboard').component(DashboardPage).requireAuth().build(),
  RouteBuilder.create('/dashboard/settings').component(SettingsPage).requireAuth().build(),
]

// router.ts
const router = createCodeBasedRouter(context)
  .addRoutes([...authRoutes, ...dashboardRoutes])
  .build()
```

### 2. **Use Route Metadata Consistently**

```typescript
const createPageRoute = (path: string, component: any, title: string) =>
  RouteBuilder.create(path)
    .component(component)
    .meta(() => ({
      title: `${title} | MyApp`,
      description: `${title} page`,
    }))
    .build()
```

## TypeScript Support

The package provides full TypeScript support with:

- **Route parameter typing**
- **Search parameter validation**
- **Context typing**
- **Metadata typing**
- **Guard typing**

```typescript
// Typed route parameters
interface UserParams {
  userId: string
}

RouteBuilder.create('/users/$userId')
  .component(UserProfile)
  .loader(async ({ params }: { params: UserParams }) => {
    // params.userId is typed as string
    return fetchUser(params.userId)
  })
  .build()
```
