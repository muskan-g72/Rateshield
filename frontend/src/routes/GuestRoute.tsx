import { Navigate, Outlet } from 'react-router-dom'
import { PageLoader } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'

interface GuestRouteProps {
  redirectTo?: string
}

export function GuestRoute({ redirectTo = '/dashboard' }: GuestRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <PageLoader />
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}
