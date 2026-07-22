import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Building2, Check, ClipboardList, TrendingUp, Search, ChevronDown,
    CheckCircle, AlertTriangle,
} from "lucide-react";

function StatusBadge({ value }) {
    const status = String(value).toLowerCase();
    const map = {
        aman: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        selesai: "bg-sky-50 text-sky-700 ring-sky-200",
        warning: "bg-amber-50 text-amber-700 ring-amber-200",
        boros: "bg-red-50 text-red-700 ring-red-200",
    };
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${map[status] ?? "bg-slate-100 text-slate-600 ring-slate-200"}`}>
            {value}
        </span>
    );
}

function progressBarColor(statusMaterial) {
    if (statusMaterial === "Selesai") return "bg-sky-500";
    if (statusMaterial === "Boros") return "bg-red-500";
    if (statusMaterial === "Warning") return "bg-amber-400";
    return "bg-emerald-500";
}

const STOK_LIMIT = 5;

function formatRupiah(value) {
    const rounded = Number(value) || 0;
    return rounded.toLocaleString("id-ID", {
        style: "currency", currency: "IDR",
        minimumFractionDigits: 0, maximumFractionDigits: 0,
    });
}

function OperasionalContent({ kpiOperasional, rows, monitoring }) {
    const [unitQuery, setUnitQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("Semua Status");
    const [expandedUnitId, setExpandedUnitId] = useState(null);

    const statusOptions = ["Semua Status", "Aktif", "Non-aktif", "Aman", "Warning", "Boros", "Selesai"];

    const filteredRows = (rows ?? []).filter((row) => {
        const q = unitQuery.toLowerCase();
        const matchesQuery =
            !q ||
            row.nama_unit?.toLowerCase().includes(q) ||
            row.zona?.toLowerCase().includes(q) ||
            row.tukang?.toLowerCase().includes(q);
        const matchesStatus =
            statusFilter === "Semua Status" ||
            row.status === statusFilter ||
            row.statusMaterial === statusFilter;
        return matchesQuery && matchesStatus;
    });

    const cards = [
        { title: "Total Unit", value: kpiOperasional.totalUnit, icon: <Building2 size={18} /> },
        { title: "Unit Aktif", value: kpiOperasional.unitAktif, icon: <TrendingUp size={18} /> },
        { title: "Unit Selesai", value: kpiOperasional.unitSelesai, icon: <CheckCircle size={18} /> },
        { title: "Perlu Perhatian", value: kpiOperasional.unitWarning + kpiOperasional.unitBoros, icon: <AlertTriangle size={18} /> },
    ];

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((c) => (
                    <div key={c.title} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{c.title}</p>
                                <p className="mt-4 text-3xl font-extrabold tracking-tight">{c.value}</p>
                            </div>
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
                                {c.icon}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
                    <h2 className="font-bold">Monitoring Unit</h2>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Cari unit, zona, tukang..."
                                value={unitQuery}
                                onChange={(e) => setUnitQuery(e.target.value)}
                                className="w-56 rounded-xl border border-border bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                        >
                            {statusOptions.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-sm">
                        <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold">Unit</th>
                                <th className="px-4 py-3 text-left font-semibold">Zona</th>
                                <th className="px-4 py-3 text-left font-semibold">Tukang</th>
                                <th className="px-4 py-3 text-left font-semibold">Progress</th>
                                <th className="px-4 py-3 text-left font-semibold">Status Unit</th>
                                <th className="px-4 py-3 text-left font-semibold">Status Material</th>
                                <th className="px-4 py-3 text-left font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRows.map((row) => (
                                <React.Fragment key={row.id}>
                                    <tr className="border-t border-border hover:bg-secondary/50">
                                        <td className="px-4 py-3 font-mono font-bold text-primary">{row.nama_unit}</td>
                                        <td className="px-4 py-3">{row.zona}</td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">{row.tukang ?? "-"}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-20 rounded-full bg-slate-100 overflow-hidden">
                                                    <div
                                                        className={`h-1.5 rounded-full ${progressBarColor(row.statusMaterial)}`}
                                                        style={{ width: `${row.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-semibold">{row.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3"><StatusBadge value={row.status} /></td>
                                        <td className="px-4 py-3"><StatusBadge value={row.statusMaterial} /></td>
                                        <td className="px-4 py-3">
                                            {monitoring[row.id] && monitoring[row.id].length > 0 && (
                                                <button
                                                    onClick={() => setExpandedUnitId(expandedUnitId === row.id ? null : row.id)}
                                                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-400"
                                                >
                                                    {expandedUnitId === row.id ? "Tutup" : "Detail"}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                    {expandedUnitId === row.id && (
                                        <tr>
                                            <td colSpan={7} className="bg-slate-50 px-4 py-4">
                                                <table className="w-full text-xs">
                                                    <thead className="text-muted-foreground">
                                                        <tr>
                                                            <th className="pb-2 text-left font-semibold">Material</th>
                                                            <th className="pb-2 text-left font-semibold">Standar</th>
                                                            <th className="pb-2 text-left font-semibold">Aktual</th>
                                                            <th className="pb-2 text-left font-semibold">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {monitoring[row.id].map((m, i) => (
                                                            <tr key={i} className="border-t border-border">
                                                                <td className="py-2 font-semibold">{m.nama_material}</td>
                                                                <td className="py-2 text-muted-foreground">{m.standar}</td>
                                                                <td className="py-2 text-muted-foreground">{m.aktual}</td>
                                                                <td className="py-2"><StatusBadge value={m.analisa} /></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            {filteredRows.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                        Tidak ada unit yang cocok.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function KeuanganContent({ kpiKeuangan, stokGudang, cashflowWeekly = [], topPengeluaran = [] }) {
    const [stokQuery, setStokQuery] = useState("");
    const [stokVisible, setStokVisible] = useState(STOK_LIMIT);
    const [stokSortBy, setStokSortBy] = useState("");
    const [stokSortDir, setStokSortDir] = useState("desc");

    const normalizedStok = (stokGudang ?? []).map((s) => {
        const totalMasuk = Number(s.total_masuk ?? s.totalMasuk ?? 1) || 1;
        const sisa = Number(s.sisa_stok ?? s.sisaStok ?? 0);
        const persen = Math.min(100, Math.round((sisa / totalMasuk) * 100));
        return {
            ...s,
            sisa_stok: s.sisa_stok ?? s.sisaStok ?? 0,
            harga_satuan: s.harga_satuan ?? s.hargaSatuan ?? s.harga ?? 0,
            sisaStok: sisa,
            persen,
            nama: s.nama ?? s.Nama ?? "",
        };
    });

    const filteredStok = normalizedStok
        .filter((s) => (s.nama || "").toLowerCase().includes(stokQuery.toLowerCase()))
        .sort((a, b) => {
            if (!stokSortBy) return 0;
            const dir = stokSortDir === "asc" ? 1 : -1;
            if (stokSortBy === "harga") {
                return (Number(a.nilai_rupiah ?? a.harga_satuan ?? 0) - Number(b.nilai_rupiah ?? b.harga_satuan ?? 0)) * dir;
            }
            if (stokSortBy === "stok") {
                return (Number(a.sisa_stok ?? 0) - Number(b.sisa_stok ?? 0)) * dir;
            }
            return 0;
        });

    const visibleStok = filteredStok.slice(0, stokVisible);
    const hasMore = filteredStok.length > stokVisible;

    const cards = [
        { title: "Total Modal Masuk", value: formatRupiah(kpiKeuangan.totalModalMasuk ?? 0), meta: "Total penerimaan kas masuk proyek", icon: <Building2 size={18} /> },
        { title: "Total Pengeluaran", value: formatRupiah(kpiKeuangan.totalPengeluaran ?? 0), meta: "Total biaya keluar proyek", icon: <TrendingUp size={18} />, tone: "down" },
        { title: "Saldo Kas", value: formatRupiah(kpiKeuangan.saldoKas ?? 0), meta: "Saldo kas minggu ini", icon: <Check size={18} />, tone: kpiKeuangan.saldoKas >= 0 ? "up" : "down" },
        { title: "Nilai Material Masuk", value: formatRupiah(kpiKeuangan.nilaiMaterialMasuk ?? 0), meta: "Nilai pembelian material masuk", icon: <ClipboardList size={18} /> },
    ];

    const maxCashflow = Math.max(1, ...(cashflowWeekly || []).flatMap((item) => [item.masuk ?? 0, item.keluar ?? 0]));

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((c) => (
                    <div key={c.title} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{c.title}</p>
                                <p className="mt-4 text-3xl font-extrabold tracking-tight">{c.value}</p>
                            </div>
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
                                {c.icon}
                            </span>
                        </div>
                        <p className={`mt-3 text-xs ${c.tone === "up" ? "text-emerald-600" : c.tone === "down" ? "text-red-500" : "text-muted-foreground"}`}>
                            {c.meta}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid gap-5 xl:grid-cols-[1.8fr_minmax(320px,1fr)]">
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="font-bold">Tren Cashflow Mingguan</h2>
                            <p className="mt-1 text-sm text-muted-foreground">Grafik perbandingan kas masuk dan kas keluar setiap minggu.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Masuk
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                                <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Keluar
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto px-5 py-5">
                        <table className="w-full min-w-[640px] text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold">Minggu</th>
                                    <th className="px-4 py-3 text-left font-semibold">Masuk</th>
                                    <th className="px-4 py-3 text-left font-semibold">Keluar</th>
                                    <th className="px-4 py-3 text-left font-semibold">Saldo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(cashflowWeekly || []).map((week) => (
                                    <tr key={week.weekLabel} className="border-t border-border hover:bg-slate-50">
                                        <td className="px-4 py-3 font-semibold text-slate-900">{week.weekLabel}</td>
                                        <td className="px-4 py-3 text-xs text-slate-700">{formatRupiah(week.masuk)}</td>
                                        <td className="px-4 py-3 text-xs text-slate-700">{formatRupiah(week.keluar)}</td>
                                        <td className="px-4 py-3 text-xs font-semibold text-slate-900">{formatRupiah(week.saldo)}</td>
                                    </tr>
                                ))}
                                {(cashflowWeekly || []).length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">Tidak ada data minggu ini.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm">
                        <h3 className="font-bold">Akun Pengeluaran Terbesar</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Ringkasan akun material dengan pengeluaran tertinggi.</p>
                        <div className="mt-5 space-y-4">
                            {topPengeluaran.length ? (
                                topPengeluaran.map((item) => (
                                    <div key={item.nama} className="rounded-2xl border border-border bg-white p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="font-semibold text-slate-900">{item.nama}</p>
                                            <p className="text-xs font-semibold text-slate-700">{formatRupiah(item.total)}</p>
                                        </div>
                                        <div className="mt-3 h-2.5 rounded-full bg-slate-100">
                                            <div className="h-2.5 rounded-full bg-emerald-500" style={{ width: `${Math.min(100, Math.round((item.total / maxCashflow) * 100))}%` }} />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-dashed border-border bg-slate-50 p-6 text-center text-sm text-muted-foreground">
                                    Belum ada data pengeluaran material.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <p className="font-bold">Stok Gudang</p>
                            <div className="relative">
                                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Cari material..."
                                    value={stokQuery}
                                    onChange={(e) => { setStokQuery(e.target.value); setStokVisible(STOK_LIMIT); }}
                                    className="w-40 rounded-2xl border border-border bg-white py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>
                        <div className="mt-5 space-y-3">
                            {visibleStok.map((s) => (
                                <div key={s.nama} className="rounded-2xl border border-border bg-white p-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-semibold">{s.nama}</span>
                                        <span className="font-mono text-xs font-bold text-slate-700">{s.sisaStok.toLocaleString("id-ID")}</span>
                                    </div>
                                    <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                        {s.persen > 0 && (
                                            <div
                                                className={`h-1.5 rounded-full ${s.persen > 50 ? "bg-emerald-500" : s.persen > 25 ? "bg-amber-400" : "bg-red-500"}`}
                                                style={{ width: `${s.persen}%` }}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div className="grid gap-2">
                                {hasMore && (
                                    <button type="button" onClick={() => setStokVisible((v) => v + STOK_LIMIT)} className="rounded-2xl border border-border bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                                        Tampilkan lainnya ({filteredStok.length - stokVisible} item)
                                    </button>
                                )}
                                {stokVisible > STOK_LIMIT && (
                                    <button type="button" onClick={() => setStokVisible(STOK_LIMIT)} className="rounded-2xl border border-border bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                                        Sembunyikan
                                    </button>
                                )}
                            </div>
                            {filteredStok.length === 0 && (
                                <p className="text-xs text-muted-foreground">
                                    {stokQuery ? `Tidak ada hasil untuk "${stokQuery}".` : "Belum ada data stok gudang."}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DashboardIndex(props) {
    const { canOperasional, canKeuangan } = props;
    const [tab, setTab] = useState(canOperasional ? "operasional" : "keuangan");

    const showTabs = canOperasional && canKeuangan;

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="space-y-5">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">
                                {showTabs ? "Dashboard" : tab === "operasional" ? "Ringkasan Operasional Proyek" : "Ringkasan Keuangan Proyek"}
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {tab === "operasional"
                                    ? "Progres pembangunan & status pemakaian material tiap unit."
                                    : "Cashflow mingguan & aktivitas kas."}
                            </p>
                        </div>

                        {showTabs && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setTab("operasional")}
                                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${tab === "operasional" ? "bg-primary text-white" : "border border-border bg-white"}`}
                                >
                                    Operasional
                                </button>
                                <button
                                    onClick={() => setTab("keuangan")}
                                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${tab === "keuangan" ? "bg-primary text-white" : "border border-border bg-white"}`}
                                >
                                    Keuangan
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {tab === "operasional" && canOperasional && (
                    <OperasionalContent kpiOperasional={props.kpiOperasional} rows={props.rows} monitoring={props.monitoring} />
                )}
                {tab === "keuangan" && canKeuangan && (
                    <KeuanganContent
                        kpiKeuangan={props.kpiKeuangan}
                        stokGudang={props.stokGudang}
                        cashflowWeekly={props.cashflowWeekly}
                        topPengeluaran={props.topPengeluaran}
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}