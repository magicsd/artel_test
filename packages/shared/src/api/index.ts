/**
 * API Package Index
 * Main entry point for the API utilities
 */

// Client exports
export { apiClient, ApiClient, ApiError } from './client.js'
export type { ApiResponse } from './client.js'

// Query client exports
export { queryClient, queryKeys, cacheUtils, queryErrorUtils } from './query-client.js'

// Hooks exports
export {
  useList,
  useDetail,
  useInfiniteList,
  useCreate,
  useUpdate,
  usePartialUpdate,
  useDelete,
  useUpload,
  useAuth,
  useLogin,
  useLogout,
  useRegister,
  usePrefetch,
  useOptimisticUpdate,
} from './hooks.js'
export type { PaginatedResponse, ListFilters } from './hooks.js'

// Provider exports
export { QueryProvider, withQueryProvider } from './provider.js'

// Types exports
export type {
  BaseEntity,
  User,
  UserProfile,
  AuthTokens,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  PaginationMeta,
  PaginatedData,
  ApiSuccessResponse,
  ApiErrorResponse,
  BaseFilters,
  DateRangeFilter,
  UserFilters,
  FileUpload,
  UploadedFile,
  Notification,
  AppSettings,
  ValidationError,
  ApiErrorDetails,
  CreateInput,
  UpdateInput,
  EntityId,
  QueryKey,
  MutationContext,
  WebSocketMessage,
  WebSocketEvent,
  Optional,
  RequiredFields,
  PartialExcept,
} from './types.js'

