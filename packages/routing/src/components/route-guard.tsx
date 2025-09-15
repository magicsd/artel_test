import { useEffect, useState } from 'react'
import { useRouteGuards } from '../hooks/use-router'

interface RouteGuardProps {
  children: React.ReactNode
  guards: string[]
  auth?: any
  fallback?: React.ReactNode
  onGuardFail?: (guardName: string) => void
}

export function RouteGuard({
  children,
  guards,
  auth,
  fallback = null,
  onGuardFail,
}: RouteGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const { checkGuard, redirectIfGuardFails } = useRouteGuards()

  useEffect(() => {
    const checkAllGuards = async () => {
      try {
        for (const guardName of guards) {
          const canActivate = await checkGuard(guardName, auth)

          if (!canActivate) {
            setIsAuthorized(false)
            onGuardFail?.(guardName)
            await redirectIfGuardFails(guardName, auth)
            return
          }
        }

        setIsAuthorized(true)
      } catch (error) {
        console.error('Route guard check failed:', error)
        setIsAuthorized(false)
      }
    }

    checkAllGuards()
  }, [guards, auth, checkGuard, redirectIfGuardFails, onGuardFail])

  // Loading state
  if (isAuthorized === null) {
    return fallback
  }

  // Guard failed
  if (!isAuthorized) {
    return fallback
  }

  // Guard passed
  return <>{children}</>
}
