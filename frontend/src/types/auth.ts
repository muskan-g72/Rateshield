export interface AuthUser {
  id: number
  email: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
}

export interface RegisterResponse {
  message: string
  user_id: number
}

export interface AuthContextValue {
  user: AuthUser | null
  plan: string | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  setToken: (token: string | null) => void
  refreshAccount: () => Promise<void>
  updatePlan: (plan: string) => void
}
