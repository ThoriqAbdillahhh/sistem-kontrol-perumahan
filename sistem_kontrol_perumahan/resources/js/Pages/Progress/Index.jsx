import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';


const STATUS_COLOR = {
    AMAN: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    WARNING: 'bg-amber-50 text-amber-700 ring-amber-200',
    BOROS: 'bg-red-50 text-red-700 ring-red-200',
};

function StatusBadge({ status }) {
    if (!status) return <span className="text-xs text-slate-400">-</span>;
    return (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${STATUS_COLOR[status] ?? 'bg-slate-100 text-slate-500 ring-slate-200'}`}>
            {status}
        </span>
    );
}

function UnitStatusBadge({ status }) {
    const isAktif = status === 'Aktif';
    return (
        <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${isAktif
                ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                : 'bg-slate-100 text-slate-500 ring-slate-200'
                }`}
        >
            {status ?? 'Non-Aktif'}
        </span>
    );
}

const STATUS_PRIORITY = { BOROS: 3, WARNING: 2, AMAN: 1 };

function getOverallStatus(unitId, monitoring) {
    const rows = monitoring[unitId];
    if (!rows || rows.length === 0) return null;

    return rows.reduce((worst, row) => {
        if (!worst) return row.analisa;
        return STATUS_PRIORITY[row.analisa] > STATUS_PRIORITY[worst] ? row.analisa : worst;
    }, null);
}

export default function ProgressIndex({ units, monitoring }) {
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [expandedUnitId, setExpandedUnitId] = useState(null);
    const [historyUnit, setHistoryUnit] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        unit_id: '',
        progress_percent: '',
        tanggal_update: '',
        status: 'ON PROGRESS',
    });

    function openUpdate(unit) {
        setSelectedUnit(unit);
        setData({
            unit_id: unit.id,
            progress_percent: unit.latest_progress?.progress_percent ?? '',
            tanggal_update: '',
            status: 'ON PROGRESS',
        });
    }

    function submit(e) {
        e.preventDefault();
        post(route('progress.store'), {
            onSuccess: () => setSelectedUnit(null),
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Update Progress Unit" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-5">
                        <h1 className="text-xl font-bold text-slate-900">Update Progress Unit</h1>
                        <p className="text-sm text-slate-500">
                            Input klaim progres lapangan, sistem otomatis membandingkan dengan pemakaian material.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold">Unit</th>
                                    <th className="px-4 py-3 text-left font-semibold">Progress Terakhir</th>
                                    <th className="px-4 py-3 text-left font-semibold">Tanggal Update</th>
                                    <th className="px-4 py-3 text-left font-semibold">Status Unit</th>
                                    <th className="px-4 py-3 text-left font-semibold">Status Material</th>
                                    <th className="px-4 py-3 text-left font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {units.map((unit) => (
                                    <React.Fragment key={unit.id}>
                                        <tr className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 font-mono font-bold text-sky-600">{unit.nama_unit}</td>
                                            <td className="px-4 py-3">
                                                {unit.latest_progress ? `${unit.latest_progress.progress_percent}%` : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-slate-500">
                                                {unit.latest_progress?.tanggal_update ?? '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <UnitStatusBadge status={unit.status} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={getOverallStatus(unit.id, monitoring)} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openUpdate(unit)}
                                                        className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-sky-600 hover:border-sky-600"
                                                    >
                                                        Update Progress
                                                    </button>
                                                    {monitoring[unit.id] && (
                                                        <button
                                                            onClick={() => setExpandedUnitId(expandedUnitId === unit.id ? null : unit.id)}
                                                            className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-400"
                                                        >
                                                            {expandedUnitId === unit.id ? 'Tutup Detail' : 'Lihat Detail'}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setHistoryUnit(unit)}
                                                        className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-400"
                                                    >
                                                        Riwayat
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedUnitId === unit.id && (
                                            <tr>
                                                <td colSpan={6} className="bg-slate-50 px-4 py-4">
                                                    <table className="w-full text-xs">
                                                        <thead className="text-slate-400">
                                                            <tr>
                                                                <th className="pb-2 text-left font-semibold">Material</th>
                                                                <th className="pb-2 text-left font-semibold">Standar</th>
                                                                <th className="pb-2 text-left font-semibold">Aktual</th>
                                                                <th className="pb-2 text-left font-semibold">Sisa</th>
                                                                <th className="pb-2 text-left font-semibold">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {monitoring[unit.id].map((row, i) => (
                                                                <tr key={i} className="border-t border-slate-200">
                                                                    <td className="py-2 font-semibold text-slate-700">{row.nama_material}</td>
                                                                    <td className="py-2 text-slate-500">{row.standar}</td>
                                                                    <td className="py-2 text-slate-500">{row.aktual}</td>
                                                                    <td className="py-2 text-slate-500">
                                                                        {Math.max(row.sisa, 0)}
                                                                    </td>
                                                                    <td className="py-2">
                                                                        <StatusBadge status={row.analisa} />
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        )}

                                    </React.Fragment>

                                ))}
                            </tbody>
                        </table>
                    </div>

                    {selectedUnit && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                            onClick={() => setSelectedUnit(null)}
                        >
                            <div
                                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h2 className="mb-1 text-lg font-bold text-slate-900">
                                    Update Progress — {selectedUnit.nama_unit}
                                </h2>
                                <p className="mb-5 text-sm text-slate-500">
                                    Progress terakhir: {selectedUnit.latest_progress?.progress_percent ?? 0}%
                                </p>

                                <form onSubmit={submit} className="space-y-4">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Progress (%)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-600"
                                            value={data.progress_percent}
                                            onChange={(e) => setData('progress_percent', e.target.value)}
                                        />
                                        {errors.progress_percent && (
                                            <p className="mt-1 text-xs text-red-600">{errors.progress_percent}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Tanggal Update
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-600"
                                            value={data.tanggal_update}
                                            onChange={(e) => setData('tanggal_update', e.target.value)}
                                        />
                                        {errors.tanggal_update && (
                                            <p className="mt-1 text-xs text-red-600">{errors.tanggal_update}</p>
                                        )}
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
                                            <option value="NOT STARTED">NOT STARTED</option>
                                            <option value="ON PROGRESS">ON PROGRESS</option>
                                            <option value="DONE">DONE</option>
                                        </select>
                                    </div>

                                    <div className="mt-6 flex gap-2">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="cursor-pointer flex-1 rounded-xl bg-sky-600 py-3 text-sm font-bold text-white hover:bg-sky-600/90 disabled:opacity-50"
                                        >
                                            Simpan Progress
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedUnit(null)}
                                            className="cursor-pointer rounded-xl border border-slate-200 px-4 py-3 text-sm"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {historyUnit && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                            onClick={() => setHistoryUnit(null)}
                        >
                            <div
                                className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h2 className="mb-1 text-lg font-bold text-slate-900">
                                    Riwayat Progress - {historyUnit.nama_unit}
                                </h2>
                                <p className="mb-4 text-sm text-slate-500">
                                    Seluruh histori update progress unit ini, terbaru di atas.
                                </p>

                                <div className="max-h-96 overflow-y-auto">
                                    <table className="w-full text-sm">
                                        <thead className="sticky top-0 bg-slate-100 text-xs uppercase tracking-wider text-slate-500">
                                            <tr>
                                                <th className="px-3 py-2 text-left font-semibold">Tanggal</th>
                                                <th className="px-3 py-2 text-left font-semibold">Progress</th>
                                                <th className="px-3 py-2 text-left font-semibold">Status</th>
                                                <th className="px-3 py-2 text-left font-semibold">Material</th>
                                                <th className="px-3 py-2 text-left font-semibold">Oleh</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(historyUnit.progress ?? []).length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="px-3 py-4 text-center text-slate-400">
                                                        Belum ada histori.
                                                    </td>
                                                </tr>
                                            )}
                                            {(historyUnit.progress ?? []).map((h) => (
                                                <tr key={h.id} className="border-t border-slate-200">
                                                    <td className="px-3 py-2 text-slate-500">{h.tanggal_update}</td>
                                                    <td className="px-3 py-2 font-semibold text-slate-700">{h.progress_percent}%</td>
                                                    <td className="px-3 py-2 text-slate-500">{h.status}</td>
                                                    <td className="px-3 py-2"><StatusBadge status={h.status_material} /></td>
                                                    <td className="px-3 py-2 text-slate-500">{h.updated_by?.name ?? '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setHistoryUnit(null)}
                                    className="cursor-pointer mt-5 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}