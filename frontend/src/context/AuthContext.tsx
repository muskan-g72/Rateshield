import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { fetchDashboardRequest, fetchProtectedRequest, loginRequest } from '@/api/endpoints'
import { TOKEN_STORAGE_KEY } from '@/api/client'
import type { AuthContextValue, AuthUser, LoginCredentials } from '@/types/auth'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setTokenState] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY),
  )
  const [user, setUser] = useState<AuthUser | null>(null)
  const [plan, setPlan] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const setToken = useCallback((nextToken: string | null) => {
    if (nextToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, nextToken)
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }

    setTokenState(nextToken)
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    setPlan(null)
  }, [setToken])

  const refreshAccount = useCallback(async () => {
    const dashboard = await fetchDashboardRequest()
    setPlan(dashboard.plan)
  }, [])

  const updatePlan = useCallback((nextPlan: string) => {
    setPlan(nextPlan)
  }, [])

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const response = await loginRequest(credentials)
      setToken(response.access_token)

      const protectedData = await fetchProtectedRequest()
      setUser(protectedData.user)
    },
    [setToken],
  )

  useEffect(() => {
    let cancelled = false

    async function restoreSession() {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY)

      if (!storedToken) {
        if (!cancelled) setIsLoading(false)
        return
      }

      try {
        const protectedData = await fetchProtectedRequest()

        if (cancelled) return

        setTokenState(storedToken)
        setUser(protectedData.user)
      } catch {
        if (cancelled) return

        localStorage.removeItem(TOKEN_STORAGE_KEY)
        setTokenState(null)
        setUser(null)
        setPlan(null)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void restoreSession()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const handleUnauthorized = () => {
      setTokenState(null)
      setUser(null)
      setPlan(null)
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }

    window.addEventListener('rateshield:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('rateshield:unauthorized', handleUnauthorized)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      plan,
      token,
      isAuthenticated: Boolean(token),
      isLoading,
      login,
      logout,
      setToken,
      refreshAccount,
      updatePlan,
    }),
    [user, plan, token, isLoading, login, logout, setToken, refreshAccount, updatePlan],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }

  return context
}
