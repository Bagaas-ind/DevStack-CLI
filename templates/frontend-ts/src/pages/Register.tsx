import { useState, type FormEvent, type ChangeEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function Register() {
  const { user, register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', passwordConfirmation: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  if (user) return <Navigate to="/" replace />
  function update(event: ChangeEvent<HTMLInputElement>) { setForm((current) => ({ ...current, [event.target.name]: event.target.value })) }
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setSubmitting(true)
    try { await register(form.name, form.email, form.password, form.passwordConfirmation); navigate('/') }
    catch (err) { const response = axios.isAxiosError<{message?: string; errors?: Record<string,string[]>}>(err) ? err.response?.data : undefined; setError(response?.message || Object.values(response?.errors || {}).flat()[0] || (err instanceof Error ? err.message : 'Registrasi gagal.')) }
    finally { setSubmitting(false) }
  }
  return <div className="grid min-h-screen place-items-center px-4"><form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
    <h1 className="text-2xl font-semibold">Buat akun</h1><p className="mt-1 text-sm text-ink-700">Daftar untuk mulai menggunakan aplikasi.</p>
    {error && <div role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
    {([['name','Nama lengkap','text'],['email','Email','email'],['password','Kata sandi','password'],['passwordConfirmation','Konfirmasi kata sandi','password']] as const).map(([name,label,type]) => <label key={name} className="mt-4 block text-sm font-medium">{label}<input name={name} type={type} required minLength={type === 'password' ? 10 : undefined} value={form[name]} onChange={update} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" /></label>)}
    <button disabled={submitting} className="mt-6 w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{submitting ? 'Memproses...' : 'Daftar'}</button>
    <p className="mt-4 text-center text-sm text-ink-700">Sudah punya akun? <Link className="font-medium text-brand-700" to="/login">Masuk</Link></p>
  </form></div>
}
