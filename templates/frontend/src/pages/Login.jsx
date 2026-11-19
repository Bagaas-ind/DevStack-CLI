import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(
        err.response?.data?.errors?.email?.[0] ||
          err.response?.data?.message ||
          'Tidak bisa terhubung ke server. Pastikan backend berjalan dan alamat API sudah benar.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <h1 className="text-2xl font-semibold">Masuk</h1>
        <p className="mt-1 text-sm text-ink-700">Gunakan akun admin untuk melanjutkan.</p>

        {error && (
          <div role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <label className="mt-6 block text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />

        <label className="mt-4 block text-sm font-medium" htmlFor="password">
          Kata sandi
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? 'Memproses...' : 'Masuk'}
        </button>

        <p className="mt-4 text-center text-sm text-ink-700">
          Belum punya akun? <a className="font-medium text-brand-700" href="/register">Daftar</a>
        </p>
        <p className="mt-2 text-center text-xs text-ink-700">Akun demo hanya untuk development lokal.</p>
      </form>
    </div>
  )
}
