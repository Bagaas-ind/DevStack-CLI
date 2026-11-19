import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const nav = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/users', label: 'Pengguna' },
  { to: '/settings', label: 'Pengaturan' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    try {
      await logout()
    } catch (error) {
      console.error('Logout request failed; local session was cleared.', error)
    } finally {
      navigate('/login')
    }
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-ink-700 hover:text-white'
    }`

  return (
    <div className="min-h-screen lg:flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-60 bg-ink-900 p-4 transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 px-3 text-lg font-semibold text-white">Admin Panel</div>
        <nav className="space-y-1" onClick={() => setOpen(false)}>
          {nav.filter((item) => item.to !== '/users' || user?.role === 'admin').map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      {open && (
        <button
          aria-label="Tutup menu"
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Konten */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
          <button
            className="rounded-md px-2 py-1 text-sm text-ink-700 hover:bg-paper lg:hidden"
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-ink-700">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-paper"
            >
              Keluar
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
