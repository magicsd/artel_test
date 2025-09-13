# API Package

Переиспользуемый setup для работы с API на базе TanStack Query (React Query).

## 🚀 Возможности

- **HTTP Client** - Настроенный fetch-based клиент с interceptors
- **TanStack Query** - Кэширование, синхронизация и управление состоянием
- **TypeScript** - Полная типизация для безопасности типов
- **Error Handling** - Централизованная обработка ошибок
- **Auth Integration** - Встроенная поддержка аутентификации
- **Optimistic Updates** - Оптимистичные обновления UI
- **Infinite Queries** - Пагинация и бесконечная прокрутка
- **File Upload** - Поддержка загрузки файлов
- **DevTools** - React Query DevTools для разработки

## 📦 Установка

Пакет уже включен в shared package. TanStack Query установлен как зависимость.

```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

## 🔧 Настройка

### 1. Обернуть приложение в QueryProvider

```tsx
import { QueryProvider } from '@artelonline/shared'

function App() {
  return <QueryProvider>{/* Ваше приложение */}</QueryProvider>
}
```

### 2. Настроить API базовый URL

```tsx
import { apiClient } from '@artelonline/shared'

// В main.tsx или app.tsx
apiClient.setBaseURL(process.env.VITE_API_URL || 'http://localhost:3001/api')
```

## 📖 Использование

### Базовые CRUD операции

```tsx
import { useList, useDetail, useCreate, useUpdate, useDelete } from '@artelonline/shared'

function UsersList() {
  // Получение списка пользователей
  const {
    data: users,
    isLoading,
    error,
  } = useList<User>('/users', {
    page: 1,
    limit: 10,
    search: 'john',
  })

  // Создание пользователя
  const createUser = useCreate<User>('/users', {
    onSuccess: () => {
      console.log('User created successfully!')
    },
  })

  // Обновление пользователя
  const updateUser = useUpdate<User>('/users')

  // Удаление пользователя
  const deleteUser = useDelete('/users')

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {users?.data.data.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}

      <button onClick={() => createUser.mutate({ name: 'John', email: 'john@example.com' })}>
        Create User
      </button>
    </div>
  )
}
```

### Детальная информация

```tsx
import { useDetail } from '@artelonline/shared'

function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading } = useDetail<User>('/users', userId)

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h1>{user?.data.name}</h1>
      <p>{user?.data.email}</p>
    </div>
  )
}
```

### Бесконечная прокрутка

```tsx
import { useInfiniteList } from '@artelonline/shared'

function InfiniteUsersList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteList<User>('/users', {
    limit: 20,
  })

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.data.data.map((user) => (
            <div key={user.id}>{user.name}</div>
          ))}
        </div>
      ))}

      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  )
}
```

### Аутентификация

```tsx
import { useAuth, useLogin, useLogout } from '@artelonline/shared'

function AuthComponent() {
  const { data: user, isLoading } = useAuth()
  const login = useLogin()
  const logout = useLogout()

  const handleLogin = () => {
    login.mutate({
      email: 'user@example.com',
      password: 'password',
    })
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {user?.data ? (
        <div>
          <p>Welcome, {user.data.name}!</p>
          <button onClick={() => logout.mutate()}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  )
}
```

### Загрузка файлов

```tsx
import { useUpload } from '@artelonline/shared'

function FileUpload() {
  const upload = useUpload('/files/upload')

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append('file', file)

      upload.mutate(formData, {
        onSuccess: (data) => {
          console.log('File uploaded:', data.data)
        },
      })
    }
  }

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      {upload.isPending && <p>Uploading...</p>}
    </div>
  )
}
```

### Оптимистичные обновления

```tsx
import { useOptimisticUpdate, useUpdate } from '@artelonline/shared'

function OptimisticUserUpdate({ user }: { user: User }) {
  const updateUser = useUpdate<User>('/users')
  const optimistic = useOptimisticUpdate()

  const handleUpdate = (newName: string) => {
    // Оптимистично обновляем UI
    const previousData = optimistic.updateDetail(user.id, (old) => ({
      ...old,
      name: newName,
    }))

    updateUser.mutate(
      { id: user.id, name: newName },
      {
        onError: () => {
          // Откатываем изменения при ошибке
          if (previousData) {
            optimistic.updateDetail(user.id, () => previousData.data)
          }
        },
      },
    )
  }

  return <button onClick={() => handleUpdate('New Name')}>Update Name</button>
}
```

## 🔧 Конфигурация

### Настройка Query Client

```tsx
import { queryClient } from '@artelonline/shared'

// Настройка глобальных опций
queryClient.setDefaultOptions({
  queries: {
    staleTime: 10 * 60 * 1000, // 10 минут
    gcTime: 15 * 60 * 1000, // 15 минут
  },
})
```

### Настройка API Client

```tsx
import { apiClient } from '@artelonline/shared'

// Установка базового URL
apiClient.setBaseURL('https://api.example.com')

// Установка токена аутентификации
apiClient.setAuthToken('your-jwt-token')
```

## 🎯 Query Keys

Используйте предопределенные query keys для консистентности:

```tsx
import { queryKeys } from '@artelonline/shared'

// Примеры query keys
queryKeys.users.all // ['api', 'users']
queryKeys.users.list({}) // ['api', 'users', 'list', { filters: {} }]
queryKeys.users.detail(1) // ['api', 'users', 'detail', 1]
queryKeys.auth.user() // ['api', 'auth', 'user']
```

## 🛠️ Утилиты

### Cache Management

```tsx
import { cacheUtils } from '@artelonline/shared'

// Инвалидация всех запросов
cacheUtils.invalidateAll()

// Инвалидация по паттерну
cacheUtils.invalidateByPattern(queryKeys.users.all)

// Очистка всего кэша
cacheUtils.clearAll()

// Получение кэшированных данных
const cachedUser = cacheUtils.getCachedData(queryKeys.users.detail(1))
```

### Error Handling

```tsx
import { queryErrorUtils } from '@artelonline/shared'

function ErrorHandler({ error }: { error: unknown }) {
  if (queryErrorUtils.isApiError(error)) {
    return <div>API Error: {error.message}</div>
  }

  if (queryErrorUtils.isNetworkError(error)) {
    return <div>Network Error</div>
  }

  if (queryErrorUtils.isUnauthorizedError(error)) {
    return <div>Please login</div>
  }

  return <div>Unknown Error</div>
}
```

## 🔒 Типизация

Все API методы полностью типизированы:

```tsx
interface User {
  id: number
  name: string
  email: string
}

// Типизированные хуки
const { data } = useList<User>('/users') // data: ApiResponse<PaginatedResponse<User>>
const { data } = useDetail<User>('/users', 1) // data: ApiResponse<User>
const create = useCreate<User>('/users') // create.mutate принимает CreateInput<User>
```

## 🎨 Интеграция с UI

Пакет легко интегрируется с любыми UI компонентами:

```tsx
import { useList } from '@artelonline/shared'
import { Button, Card } from '@artelonline/ui'

function UserCard({ user }: { user: User }) {
  const deleteUser = useDelete('/users')

  return (
    <Card>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <Button onClick={() => deleteUser.mutate(user.id)} loading={deleteUser.isPending}>
        Delete
      </Button>
    </Card>
  )
}
```

## 🚀 Лучшие Практики

1. **Используйте TypeScript** - Всегда типизируйте ваши API responses
2. **Query Keys** - Используйте предопределенные query keys
3. **Error Boundaries** - Оберните компоненты в error boundaries
4. **Loading States** - Всегда обрабатывайте состояния загрузки
5. **Optimistic Updates** - Используйте для лучшего UX
6. **Cache Management** - Правильно инвалидируйте кэш после мутаций

## 🔍 Отладка

React Query DevTools автоматически включены в development режиме:

- Откройте DevTools в браузере
- Перейдите на вкладку "React Query"
- Исследуйте queries, mutations и cache

## 📚 Дополнительные Ресурсы

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Query Best Practices](https://react-query.tanstack.com/guides/best-practices)
- [TypeScript with React Query](https://react-query.tanstack.com/guides/typescript)
