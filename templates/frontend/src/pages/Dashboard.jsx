import { useAuth } from '../context/AuthContext'

const stats = [
  { label: 'Total pengguna', value: '1.248' },
  { label: 'Pesanan hari ini', value: '86' },
  { label: 'Pendapatan bulan ini', value: 'Rp 24,5 jt' },
  { label: 'Tiket terbuka', value: '12' },
]

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-2xl font-semibold">Halo, {user?.name}</h1>
      <p className="mt-1 text-sm text-ink-700">Ringkasan aktivitas terbaru. Ganti data ini dengan data API kamu.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="text-sm text-ink-700">{s.label}</div>
            <div className="mt-2 text-2xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
