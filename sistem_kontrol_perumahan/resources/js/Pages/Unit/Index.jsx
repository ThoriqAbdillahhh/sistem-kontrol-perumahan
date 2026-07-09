import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Pencil, Trash2, Search } from 'lucide-react';

export default function UnitIndex({ units }) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState(null);
    const [deletingUnit, setDeletingUnit] = useState(null);
    const [search, setSearch] = useState('');

    const filteredUnits = units.filter((unit) => {
        const keyword = search.toLowerCase();
        return (
            unit.nama_unit.toLowerCase().includes(keyword) ||
            unit.zona.toLowerCase().includes(keyword) ||
            unit.tukang.toLowerCase().includes(keyword)
        );
    });

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nama_unit: '',
        zona: '',
        status: 'Aktif',
        tukang: '',
        tanggal_mulai: '',
        keterangan: '',
    });

    function openAdd() {
        setEditingUnit(null);
        reset();
        setDrawerOpen(true);
    }

    function openEdit(unit) {
        setEditingUnit(unit);
        setData({
            nama_unit: unit.nama_unit,
            zona: unit.zona,
            status: unit.status,
            tukang: unit.tukang,
            tanggal_mulai: unit.tanggal_mulai ?? '',
            keterangan: unit.keterangan ?? '',
        });
        setDrawerOpen(true);
    }

    function submit(e) {
        e.preventDefault();
        if (editingUnit) {
            put(route('unit.update', editingUnit.id), { onSuccess: () => setDrawerOpen(false) });
        } else {
            post(route('unit.store'), { onSuccess: () => setDrawerOpen(false) });
        }
    }

    function handleDelete(unit) {
        setDeletingUnit(unit);
    }

    function confirmDelete() {
        router.delete(route('unit.destroy', deletingUnit.id), {
            onSuccess: () => setDeletingUnit(null),
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Mengelola Unit" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6 gap-4">
                        <h1 className="text-xl font-semibold text-slate-900">Mengelola Unit</h1>

                        <div className="relative flex-1 max-w-xs">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari nama unit, zona, tukang..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm"
                            />
                        </div>

                        <button
                            onClick={openAdd}
                            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600/90"
                        >
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
                                    <th className="px-4 py-3">Keterangan</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUnits.map((unit) => (
                                    <tr key={unit.id} className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-slate-900">{unit.nama_unit}</td>
                                        <td className="px-4 py-3 text-slate-600">{unit.zona}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${unit.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                                    }`}
                                            >
                                                {unit.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{unit.tukang}</td>
                                        <td className="px-4 py-3 text-slate-600">{unit.tanggal_mulai ?? '-'}</td>
                                        <td className="px-4 py-3 text-slate-500 max-w-xs truncate" title={unit.keterangan}>
                                            {unit.keterangan || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => openEdit(unit)}
                                                title="Edit"
                                                className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-sky-600 hover:bg-sky-50"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(unit)}
                                                title="Hapus"
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUnits.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                                            Belum ada data unit.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {drawerOpen && (
                        <div
                            className="fixed inset-0 z-50 flex justify-end bg-black/30"
                            onClick={() => setDrawerOpen(false)}
                        >
                            <div
                                className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h2 className="mb-4 text-lg font-semibold text-slate-900">
                                    {editingUnit ? 'Edit Unit' : 'Tambah Unit'}
                                </h2>

                                <form onSubmit={submit} className="space-y-4">
                                    <div>
                                        <label className="mb-1 block text-sm text-slate-600">Nama Unit</label>
                                        <input
                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                            value={data.nama_unit}
                                            onChange={(e) => setData('nama_unit', e.target.value)}
                                        />
                                        {errors.nama_unit && <p className="mt-1 text-xs text-red-600">{errors.nama_unit}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm text-slate-600">Zona</label>
                                        <input
                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                            value={data.zona}
                                            onChange={(e) => setData('zona', e.target.value)}
                                        />
                                        {errors.zona && <p className="mt-1 text-xs text-red-600">{errors.zona}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm text-slate-600">Status</label>
                                        <select
                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                        >
                                            <option value="Aktif">Aktif</option>
                                            <option value="Non-aktif">Non-aktif</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm text-slate-600">Tukang</label>
                                        <input
                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                            value={data.tukang}
                                            onChange={(e) => setData('tukang', e.target.value)}
                                        />
                                        {errors.tukang && <p className="mt-1 text-xs text-red-600">{errors.tukang}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm text-slate-600">Tanggal Mulai</label>
                                        <input
                                            type="date"
                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                            value={data.tanggal_mulai}
                                            onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm text-slate-600">Keterangan</label>
                                        <textarea
                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                            rows={3}
                                            value={data.keterangan}
                                            onChange={(e) => setData('keterangan', e.target.value)}
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setDrawerOpen(false)}
                                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600/90 disabled:opacity-50"
                                        >
                                            Simpan
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {deletingUnit && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
                            onClick={() => setDeletingUnit(null)}
                        >
                            <div
                                className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h2 className="mb-2 text-lg font-semibold text-slate-900">Hapus Unit?</h2>
                                <p className="mb-6 text-sm text-slate-500">
                                    Unit <span className="font-medium text-slate-700">{deletingUnit.nama_unit}</span> akan
                                    dihapus permanen. Tindakan ini tidak bisa dibatalkan.
                                </p>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setDeletingUnit(null)}
                                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-600/90"
                                    >
                                        Ya, Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}