import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function UnitIndex({ units }) {
  return (
    <AuthenticatedLayout>
      <Head title="Mengelola Unit" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-slate-900">Mengelola Unit</h1>
            <button className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600/90">
              + Tambah Unit
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3">Nama Unit</th>
                  <th className="px-4 py-3">Zona</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Tukang</th>
                  <th className="px-4 py-3">Tanggal Mulai</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {units.map((unit) => (
                  <tr key={unit.id} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-medium text-slate-900">{unit.nama_unit}</td>
                    <td className="px-4 py-3 text-slate-600">{unit.zona}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          unit.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {unit.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{unit.tukang}</td>
                    <td className="px-4 py-3 text-slate-600">{unit.tanggal_mulai ?? '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-sky-600 hover:underline mr-3">Edit</button>
                      <button className="text-red-600 hover:underline">Hapus</button>
                    </td>
                  </tr>
                ))}
                {units.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                      Belum ada data unit.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}