import { useCallback, useEffect, useState } from 'react'
import api from '../lib/api'

export default function Users() {
  const [users, setUsers] = useState([]); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', role: 'user' })
  const load = useCallback(() => api.get('/admin/users').then((r) => setUsers(r.data.data || [])).catch((e) => setError(e.response?.data?.message || 'Gagal memuat pengguna.')), [])
  useEffect(() => { load() }, [load])
  async function create(event) { event.preventDefault(); setBusy(true); setError(''); try { await api.post('/admin/users', form); setForm({ name: '', email: '', password: '', password_confirmation: '', role: 'user' }); await load() } catch (e) { setError(e.response?.data?.message || Object.values(e.response?.data?.errors || {}).flat()[0] || 'Gagal membuat pengguna.') } finally { setBusy(false) } }
  async function remove(id) { if (!window.confirm('Hapus pengguna ini?')) return; try { await api.delete(`/admin/users/${id}`); await load() } catch (e) { setError(e.response?.data?.message || 'Gagal menghapus pengguna.') } }
  return <div><h1 className="text-2xl font-semibold">Pengguna</h1><p className="mt-1 text-sm text-ink-700">Kelola akun yang tersimpan di database. Hanya administrator yang dapat mengakses halaman ini.</p>
    {error && <p role="alert" className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <form onSubmit={create} className="mt-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2 xl:grid-cols-5">
      <input aria-label="Nama" placeholder="Nama" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="rounded-md border border-slate-300 px-3 py-2 text-sm"/>
      <input aria-label="Email" placeholder="Email" type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="rounded-md border border-slate-300 px-3 py-2 text-sm"/>
      <input aria-label="Password" placeholder="Password (min. 10 karakter)" type="password" minLength="10" required value={form.password} onChange={e=>setForm({...form,password:e.target.value,password_confirmation:e.target.value})} className="rounded-md border border-slate-300 px-3 py-2 text-sm"/>
      <select aria-label="Role" value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="rounded-md border border-slate-300 px-3 py-2 text-sm"><option value="user">User</option><option value="admin">Admin</option></select>
      <button disabled={busy} className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{busy ? 'Menyimpan...' : 'Tambah pengguna'}</button>
    </form>
    <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white"><table className="w-full text-left text-sm"><thead className="border-b border-slate-200 bg-paper text-ink-700"><tr><th className="px-4 py-3">Nama</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Peran</th><th className="px-4 py-3">Aksi</th></tr></thead><tbody>{users.map(u=><tr key={u.id} className="border-b border-slate-100 last:border-0"><td className="px-4 py-3">{u.name}</td><td className="px-4 py-3">{u.email}</td><td className="px-4 py-3">{u.role}</td><td className="px-4 py-3"><button onClick={()=>remove(u.id)} className="text-red-700 hover:underline">Hapus</button></td></tr>)}{users.length===0 && <tr><td colSpan="4" className="px-4 py-6 text-center text-ink-700">Belum ada data pengguna.</td></tr>}</tbody></table></div>
  </div>
}
