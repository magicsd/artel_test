import { useRouteError } from '../hooks/use-router'
import type { RouteError } from '../types/router'

interface ErrorBoundaryProps {
  error?: RouteError
  reset?: () => void
  className?: string
}

export function ErrorBoundary({ error, reset, className = '' }: ErrorBoundaryProps) {
  const { error: routeError, clearError } = useRouteError()
  const displayError = error || routeError
  const handleReset = reset || clearError

  if (!displayError) {
    return null
  }

  const getErrorMessage = () => {
    if (displayError.status === 404) {
      return 'Page not found'
    }

    if (displayError.status === 403) {
      return 'Access denied'
    }

    if (displayError.status === 500) {
      return 'Internal server error'
    }

    return displayError.message || 'An unexpected error occurred'
  }

  const getErrorDescription = () => {
    if (displayError.status === 404) {
      return 'The page you are looking for does not exist.'
    }

    if (displayError.status === 403) {
      return 'You do not have permission to access this resource.'
    }

    if (displayError.status === 500) {
      return 'Something went wrong on our end. Please try again later.'
    }

    return 'Please try refreshing the page or contact support if the problem persists.'
  }

  return (
    <div
      className={`flex min-h-[400px] flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div className="mx-auto max-w-md">
        <div className="mb-4 text-6xl font-bold text-red-500">{displayError.status || '!'}</div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">{getErrorMessage()}</h1>

        <p className="mb-6 text-gray-600">{getErrorDescription()}</p>

        <div className="space-y-3">
          <button
            onClick={handleReset}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Try Again
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300"
          >
            Go Back
          </button>

          <a
            href="/"
            className="block w-full rounded-md bg-gray-100 px-4 py-2 text-gray-600 transition-colors hover:bg-gray-200"
          >
            Go Home
          </a>
        </div>

        {process.env.NODE_ENV === 'development' && displayError.data && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Error Details (Development)
            </summary>
            <pre className="mt-2 overflow-auto rounded bg-gray-100 p-3 text-xs">
              {JSON.stringify(displayError.data, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
