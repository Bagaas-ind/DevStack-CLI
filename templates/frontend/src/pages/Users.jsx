const rows = [
  { id: 1, name: 'Admin', email: 'admin@example.com', role: 'Admin' },
  { id: 2, name: 'Sari Dewi', email: 'sari@example.com', role: 'Editor' },
  { id: 3, name: 'Budi Santoso', email: 'budi@example.com', role: 'Viewer' },
]

export default function Users() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Pengguna</h1>
      <p className="mt-1 text-sm text-ink-700">Contoh tabel. Sambungkan ke endpoint /api/users milikmu.</p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-paper text-ink-700">
            <tr>
              <th className="px-4 py-3 font-medium">Nama</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Peran</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3">{r.email}</td>
                <td className="px-4 py-3">{r.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
