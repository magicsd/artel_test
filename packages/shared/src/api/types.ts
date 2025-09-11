/**
 * Common API Types
 * Shared TypeScript types for API responses and entities
 */

// Base entity interface
export interface BaseEntity {
  id: string | number
  createdAt: string
  updatedAt: string
}

// User types
export interface User extends BaseEntity {
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'user' | 'moderator'
  isActive: boolean
  lastLoginAt?: string
  emailVerifiedAt?: string
}

export interface UserProfile extends User {
  bio?: string
  phone?: string
  address?: {
    street?: string
    city?: string
    country?: string
    postalCode?: string
  }
  preferences?: {
    language: string
    timezone: string
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
    }
  }
}

// Auth types
export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  email: string
  password: string
  name: string
  confirmPassword: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

// Pagination types
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedData<T> {
  data: T[]
  pagination: PaginationMeta
}

// API Response types
export interface ApiSuccessResponse<T = any> {
  data: T
  message?: string
  success: true
}

export interface ApiErrorResponse {
  message: string
  success: false
  errors?: Record<string, string[]>
  code?: string
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse

// Filter and sort types
export interface BaseFilters {
  page?: number
  limit?: number
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
}

export interface DateRangeFilter {
  startDate?: string
  endDate?: string
}

export interface UserFilters extends BaseFilters, DateRangeFilter {
  role?: User['role']
  isActive?: boolean
}

// File upload types
export interface FileUpload {
  file: File
  name?: string
  description?: string
}

export interface UploadedFile extends BaseEntity {
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  path: string
}

// Notification types
export interface Notification extends BaseEntity {
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  userId: string | number
  data?: Record<string, any>
}

// Settings types
export interface AppSettings {
  siteName: string
  siteDescription: string
  logo?: string
  favicon?: string
  theme: {
    primaryColor: string
    secondaryColor: string
    darkMode: boolean
  }
  features: {
    registration: boolean
    emailVerification: boolean
    socialLogin: boolean
  }
  integrations: {
    analytics?: {
      googleAnalyticsId?: string
    }
    email?: {
      provider: 'smtp' | 'sendgrid' | 'mailgun'
      config: Record<string, any>
    }
    storage?: {
      provider: 'local' | 's3' | 'cloudinary'
      config: Record<string, any>
    }
  }
}

// Error types
export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ApiErrorDetails {
  message: string
  status: number
  code?: string
  errors?: ValidationError[]
  timestamp: string
  path: string
}

// Utility types
export type CreateInput<T extends BaseEntity> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateInput<T extends BaseEntity> = Partial<CreateInput<T>>
export type EntityId = string | number

// Query key types for type safety
export type QueryKey = readonly unknown[]

// Mutation types
export interface MutationContext<T = any> {
  previousData?: T
  optimisticData?: T
}

// WebSocket types (for real-time features)
export interface WebSocketMessage<T = any> {
  type: string
  data: T
  timestamp: string
  id?: string
}

export interface WebSocketEvent {
  event: string
  data: any
  room?: string
}

// Export utility type helpers
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>

