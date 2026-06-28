import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { loginRequest } from '@/api/endpoints'
import { TOKEN_STORAGE_KEY } from '@/api/client'
import type { AuthContextValue, LoginCredentials } from '@/types/auth'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setTokenState] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY),
  )
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
  }, [setToken])

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const response = await loginRequest(credentials)
      setToken(response.access_token)
    },
    [setToken],
  )

  useEffect(() => {
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const handleUnauthorized = () => {
      setTokenState(null)
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }

    window.addEventListener('rateshield:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('rateshield:unauthorized', handleUnauthorized)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      isLoading,
      login,
      logout,
      setToken,
    }),
    [token, isLoading, login, logout, setToken],
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
