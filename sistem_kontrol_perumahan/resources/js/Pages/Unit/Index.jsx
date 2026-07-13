import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Pencil, Trash2, Search, X, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

function SortableHeader({ label, column, sortBy, sortDir, onSort }) {
    const isActive = sortBy === column;

    return (
        <th
            onClick={() => onSort(column)}
            className="cursor-pointer select-none px-4 py-3 text-left font-semibold hover:text-slate-700"
        >
            <span className="inline-flex items-center gap-1">
                {label}
                <ArrowUpDown
                    size={12}
                    className={isActive ? 'text-sky-600' : 'text-slate-300'}
                />
                {isActive && <span className="text-[10px] text-sky-600">{sortDir === 'asc' ? '↑' : '↓'}</span>}
            </span>
        </th>
    );
}

function highlightText(text, keyword) {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
        regex.test(part) ? (
            <mark key={i} className="bg-yellow-200 text-slate-900 rounded-sm px-0.5">
                {part}
            </mark>
        ) : (
            part
        )
    );
}

export default function UnitIndex({ units }) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState(null);
    const [deletingUnit, setDeletingUnit] = useState(null);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('Semua');
    const [sortBy, setSortBy] = useState(null);
    const [sortDir, setSortDir] = useState('asc');
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    function toggleSort(column) {
        if (sortBy === column) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortDir('asc');
        }
    }

    const filteredUnits = units
        .filter((unit) => {
            const keyword = search.toLowerCase();
            const matchSearch =
                unit.nama_unit.toLowerCase().includes(keyword) ||
                unit.zona.toLowerCase().includes(keyword) ||
                unit.tukang.toLowerCase().includes(keyword);
            const matchStatus = filterStatus === 'Semua' || unit.status === filterStatus;

            return matchSearch && matchStatus;
        })
        .sort((a, b) => {
            if (!sortBy) return 0;

            let valA = a[sortBy] ?? '';
            let valB = b[sortBy] ?? '';

            if (sortBy === 'tanggal_mulai') {
                valA = valA ? new Date(valA).getTime() : 0;
                valB = valB ? new Date(valB).getTime() : 0;
                const result = valA - valB;
                return sortDir === 'asc' ? result : -result;
            }

            const result = valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' });
            return sortDir === 'asc' ? result : -result;
        });
    const totalPages = pageSize === 'all' ? 1 : Math.ceil(filteredUnits.length / pageSize);
    const paginatedUnits =
        pageSize === 'all' ? filteredUnits : filteredUnits.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    useEffect(() => {
        setCurrentPage(1);
    }, [search, filterStatus, pageSize]);

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
        setData({
            nama_unit: '',
            zona: '',
            status: 'Aktif',
            tukang: '',
            tanggal_mulai: '',
            keterangan: '',
        });
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
                    <div className="mb-5">
                        <h1 className="text-xl font-bold text-slate-900">Mengelola Unit</h1>
                    </div>

                    <div className={`grid gap-5 ${drawerOpen ? 'xl:grid-cols-[1fr_380px]' : ''}`}>
                        {/* Tabel */}
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                                <h2 className="text-sm font-bold text-slate-900">
                                    Daftar Unit ({filteredUnits.length})
                                </h2>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Cari unit, zona, tukang..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-56 rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-sky-600"
                                        />
                                    </div>

                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-sky-600"
                                    >
                                        <option value="Semua">Semua Status</option>
                                        <option value="Aktif">Aktif</option>
                                        <option value="Non-aktif">Non-aktif</option>
                                    </select>
                                    <select
                                        value={pageSize}
                                        onChange={(e) => setPageSize(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-sky-600"
                                    >
                                        <option value={10}>10 / halaman</option>
                                        <option value={50}>50 / halaman</option>
                                        <option value="all">Semua</option>
                                    </select>

                                    <button
                                        onClick={openAdd}
                                        className="whitespace-nowrap rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-600/90"
                                    >
                                        + Tambah Unit
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[720px] text-sm">
                                    <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-500">
                                        <tr>
                                            <SortableHeader label="Unit" column="nama_unit" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} />
                                            <SortableHeader label="Zona" column="zona" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} />
                                            <SortableHeader label="Kepala Tukang" column="tukang" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} />
                                            <th className="px-4 py-3 text-left font-semibold">Status</th>
                                            <SortableHeader label="Tgl Mulai" column="tanggal_mulai" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} />
                                            <th className="px-4 py-3 text-left font-semibold">Keterangan</th>
                                            <th className="px-4 py-3 text-left font-semibold">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedUnits.map((unit) => (
                                            <tr key={unit.id} className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
                                                <td className="px-4 py-3 font-mono font-bold text-sky-600">
                                                    {highlightText(unit.nama_unit, search)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="rounded-full bg-sky-600/10 px-2.5 py-0.5 text-xs font-bold text-sky-600">
                                                        {highlightText(unit.zona, search)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-xs font-semibold text-slate-700">
                                                    {highlightText(unit.tukang, search)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${unit.status === 'Aktif'
                                                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                                                            : 'bg-slate-100 text-slate-500 ring-slate-200'
                                                            }`}
                                                    >
                                                        {unit.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 font-mono text-xs text-slate-500">
                                                    {unit.tanggal_mulai ?? '-'}
                                                </td>
                                                <td className="max-w-[160px] truncate px-4 py-3 text-xs text-slate-500" title={unit.keterangan}>
                                                    {unit.keterangan || '—'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => openEdit(unit)}
                                                            title="Edit"
                                                            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:border-sky-600 hover:text-sky-600"
                                                        >
                                                            <Pencil size={13} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(unit)}
                                                            title="Hapus"
                                                            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:border-red-400 hover:text-red-500"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {paginatedUnits.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
                                                    Belum ada data unit.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm">
                                <div className="text-slate-500">
                                    {filteredUnits.length} unit ditemukan
                                </div>

                                {pageSize !== 'all' && totalPages > 1 && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            title="Sebelumnya"
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40"
                                        >
                                            <ChevronLeft size={15} />
                                        </button>
                                        <span className="text-slate-500">
                                            Halaman {currentPage} / {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            title="Selanjutnya"
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40"
                                        >
                                            <ChevronRight size={15} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Panel Tambah/Edit — nempel di samping, bukan overlay */}
                        {drawerOpen && (
                            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="mb-5 flex items-center justify-between">
                                    <h3 className="font-bold text-slate-900">
                                        {editingUnit ? 'Edit Unit' : 'Tambah Unit Baru'}
                                    </h3>
                                    <button
                                        onClick={() => setDrawerOpen(false)}
                                        className="rounded-lg p-1 text-slate-400 hover:text-slate-700"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                <form onSubmit={submit} className="space-y-4">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Nama Unit
                                        </label>
                                        <input
                                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-600"
                                            value={data.nama_unit}
                                            onChange={(e) => setData('nama_unit', e.target.value)}
                                        />
                                        {errors.nama_unit && <p className="mt-1 text-xs text-red-600">{errors.nama_unit}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Zona
                                        </label>
                                        <input
                                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-600"
                                            value={data.zona}
                                            onChange={(e) => setData('zona', e.target.value)}
                                        />
                                        {errors.zona && <p className="mt-1 text-xs text-red-600">{errors.zona}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Status
                                        </label>
                                        <select
                                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-600"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                        >
                                            <option value="Aktif">Aktif</option>
                                            <option value="Non-aktif">Non-aktif</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Kepala Tukang
                                        </label>
                                        <input
                                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-600"
                                            value={data.tukang}
                                            onChange={(e) => setData('tukang', e.target.value)}
                                        />
                                        {errors.tukang && <p className="mt-1 text-xs text-red-600">{errors.tukang}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Tanggal Mulai
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-600"
                                            value={data.tanggal_mulai}
                                            onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Keterangan
                                        </label>
                                        <textarea
                                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-600"
                                            rows={3}
                                            value={data.keterangan}
                                            onChange={(e) => setData('keterangan', e.target.value)}
                                        />
                                    </div>

                                    <div className="mt-6 flex gap-2">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex-1 rounded-xl bg-sky-600 py-3 text-sm font-bold text-white hover:bg-sky-600/90 disabled:opacity-50"
                                        >
                                            {editingUnit ? 'Simpan Perubahan' : 'Tambah Unit'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDrawerOpen(false)}
                                            className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            </aside>
                        )}
                    </div>

                    {/* Modal konfirmasi hapus — tetap overlay, karena memang harus modal-blocking */}
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