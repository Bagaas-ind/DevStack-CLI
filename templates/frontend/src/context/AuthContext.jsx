import { createContext, useContext, useEffect, useState } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(!!localStorage.getItem('token'))

  useEffect(() => {
    if (!localStorage.getItem('token')) return
    api
      .get('/user')
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const res = await api.post('/login', { email, password })
    if (!res.data?.token || !res.data?.user) {
      throw new Error('Respons autentikasi dari server tidak lengkap.')
    }
    localStorage.setItem('token', res.data.token)
    setUser(res.data.user)
  }

  async function register(name, email, password, passwordConfirmation) {
    const res = await api.post('/register', { name, email, password, password_confirmation: passwordConfirmation })
    if (!res.data?.token || !res.data?.user) throw new Error('Respons registrasi dari server tidak lengkap.')
    localStorage.setItem('token', res.data.token)
    setUser(res.data.user)
  }

  async function logout() {
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

export const useAuth = () => useContext(AuthContext)
