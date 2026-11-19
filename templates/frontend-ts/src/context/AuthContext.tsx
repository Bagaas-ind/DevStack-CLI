import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import api from '../lib/api'

export interface AuthUser {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('token')))

  useEffect(() => {
    if (!localStorage.getItem('token')) return

    api
      .get<AuthUser>('/user')
      .then((response) => setUser(response.data))
      .catch(() => {
        localStorage.removeItem('token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  async function login(email: string, password: string): Promise<void> {
    const response = await api.post<{ token: string; user: AuthUser }>('/login', { email, password })
    if (!response.data?.token || !response.data?.user) {
      throw new Error('Respons autentikasi dari server tidak lengkap.')
    }
    localStorage.setItem('token', response.data.token)
    setUser(response.data.user)
  }

  async function register(name: string, email: string, password: string, passwordConfirmation: string): Promise<void> {
    const response = await api.post<{ token: string; user: AuthUser }>('/register', { name, email, password, password_confirmation: passwordConfirmation })
    if (!response.data?.token || !response.data?.user) throw new Error('Respons registrasi dari server tidak lengkap.')
    localStorage.setItem('token', response.data.token)
    setUser(response.data.user)
  }

  async function logout(): Promise<void> {
    try {
      await api.post('/logout')
    } finally {
      localStorage.removeItem('token')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth harus digunakan di dalam AuthProvider.')
  return context
}
