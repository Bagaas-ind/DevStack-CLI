import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => { if (user?.role === 'admin') api.get('/admin/dashboard').then((response) => setStats(response.data)).catch((err) => setError(err.response?.data?.message || 'Tidak dapat memuat ringkasan dashboard.')) }, [user?.role])
  const cards = stats ? [{ label: 'Total pengguna', value: stats.total_users }, { label: 'Administrator', value: stats.total_admins }, { label: 'Pengguna biasa', value: stats.total_regular_users }] : []
  return <div><h1 className="text-2xl font-semibold">Halo, {user?.name}</h1><p className="mt-1 text-sm text-ink-700">Ringkasan data aktual dari database aplikasi.</p>
    {user?.role !== 'admin' && <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5"><h2 className="font-semibold">Akun berhasil dibuat</h2><p className="mt-1 text-sm text-ink-700">Akun kamu memiliki akses pengguna. Hubungi administrator jika membutuhkan akses pengelolaan.</p></div>}
    {error && <p role="alert" className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {user?.role === 'admin' && !stats && !error && <p className="mt-6 text-sm text-ink-700">Memuat ringkasan...</p>}
    {user?.role === 'admin' && <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map((card) => <div key={card.label} className="rounded-lg border border-slate-200 bg-white p-5"><div className="text-sm text-ink-700">{card.label}</div><div className="mt-2 text-2xl font-semibold">{card.value.toLocaleString('id-ID')}</div></div>)}</div>
  </div>
}
