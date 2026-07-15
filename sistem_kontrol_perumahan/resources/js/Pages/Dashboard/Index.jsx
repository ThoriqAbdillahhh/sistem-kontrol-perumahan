import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import {
    Building2,
    Check,
    AlertTriangle,
    TrendingUp,
    Search,
} from "lucide-react";
    
function widthClass(v) {
    if (v >= 100) return "w-full";
    if (v >= 80) return "w-4/5";
    if (v >= 70) return "w-[70%]";
    if (v >= 60) return "w-3/5";
    if (v >= 45) return "w-[45%]";
    return "w-1/3";
}

function StatusBadge({ value }) {
    const map = {
        Aman: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        Selesai: "bg-sky-50 text-sky-700 ring-sky-200",
        Boros: "bg-red-50 text-red-700 ring-red-200",
    };
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${map[value] ?? ""}`}>
            {value}
        </span>
    );
}

function formatRupiahJt(value) {
    const jt = value / 1_000_000;
    return `Rp ${jt.toLocaleString("id-ID", { maximumFractionDigits: 0 })} Jt`;
}

const STOK_LIMIT = 5;

export default function Dashboard({ kpi, rows, stokGudang }) {
    const [stokQuery, setStokQuery] = useState("");
    const [stokVisible, setStokVisible] = useState(STOK_LIMIT);

    const filteredStok = stokGudang.filter((s) =>
        s.nama.toLowerCase().includes(stokQuery.toLowerCase())
    );
    const visibleStok = filteredStok.slice(0, stokVisible);
    const hasMore = filteredStok.length > stokVisible;

    const cards = [
        {
            title: "Total Unit Aktif",
            value: `${kpi.unitAktif} Unit`,
            meta: `${kpi.totalUnit} total unit`,
            icon: <Building2 size={18} />,
        },
        {
            title: "Unit Selesai",
            value: `${kpi.unitSelesai} Unit`,
            meta: "Progress 100%",
            icon: <Check size={18} />,
            tone: "up",
        },
        {
            title: "Unit Boros Material",
            value: `${kpi.unitBoros} Unit`,
            meta: "Pemakaian over standar",
            icon: <AlertTriangle size={18} />,
            tone: "warn",
        },
        {
            title: "Pengeluaran Bulan Ini",
            value: formatRupiahJt(kpi.pengeluaranBulanIni),
            meta: "Log keluar gudang bulan berjalan",
            icon: <TrendingUp size={18} />,
            tone: "down",
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {cards.map((c) => (
                        <div
                            key={c.title}
                            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                        >
                            <div className="flex items-start justify-between">
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    {c.title}
                                </p>
                                <span className="text-primary/70">
                                    {c.icon}
                                </span>
                            </div>
                            <p className="mt-3 text-3xl font-extrabold">
                                {c.value}
                            </p>
                            <p
                                className={`mt-1 text-xs ${
                                    c.tone === "up"
                                        ? "text-emerald-600"
                                        : c.tone === "warn"
                                          ? "text-amber-500"
                                          : c.tone === "down"
                                            ? "text-red-500"
                                            : "text-muted-foreground"
                                }`}
                            >
                                {c.meta}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="grid gap-5 xl:grid-cols-[1fr_270px]">
                    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
                            <h2 className="font-bold">
                                Progres Unit — Operasional
                            </h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px] text-sm">
                                <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
                                    <tr>
                                        {[
                                            "Unit",
                                            "Zona",
                                            "Tukang",
                                            "Progress",
                                            "Status Unit",
                                            "Status Material",
                                        ].map((h) => (
                                            <th
                                                key={h}
                                                className="px-4 py-3 text-left font-semibold"
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="border-t border-border hover:bg-secondary/50"
                                        >
                                            <td className="px-4 py-3 font-bold font-mono text-primary">
                                                {row.id}
                                            </td>
                                            <td className="px-4 py-3 text-xs">
                                                {row.zona}
                                            </td>
                                            <td className="px-4 py-3 text-xs">
                                                {row.tukang}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1.5 w-20 rounded-full bg-secondary">
                                                        <div
                                                            className={`h-1.5 rounded-full ${
                                                                row.statusMaterial ===
                                                                "Selesai"
                                                                    ? "bg-sky-500"
                                                                    : row.statusMaterial ===
                                                                        "Boros"
                                                                      ? "bg-red-500"
                                                                      : "bg-emerald-500"
                                                            } ${widthClass(row.progress)}`}
                                                        />
                                                    </div>
                                                    <span className="font-mono text-xs">
                                                        {row.progress}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${
                                                        row.status === "Aktif"
                                                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                                            : "bg-slate-100 text-slate-500 ring-slate-200"
                                                    }`}
                                                >
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge
                                                    value={row.statusMaterial}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    {rows.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-4 py-8 text-center text-sm text-muted-foreground"
                                            >
                                                Belum ada data unit.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        {/* Header: judul + search */}
                        <div className="flex items-center justify-between gap-2">
                            <p className="font-bold">Stok Gudang</p>

                            <div className="relative">
                                <Search
                                    size={13}
                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                                />
                                <input
                                    type="text"
                                    placeholder="Cari material…"
                                    value={stokQuery}
                                    onChange={(e) => {
                                        setStokQuery(e.target.value);
                                        setStokVisible(STOK_LIMIT);
                                    }}
                                    className="w-40 rounded-lg border border-border bg-white py-1 pl-7 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>

                        {/* List item */}
                        {visibleStok.map((s) => (
                            <div
                                key={s.nama}
                                className="rounded-xl border border-border bg-white p-3"
                            >
                                <div className="flex justify-between text-sm">
                                    <span className="font-semibold">
                                        {s.nama}
                                    </span>
                                    <span className="font-mono text-xs font-bold">
                                        {s.sisaStok.toLocaleString("id-ID")}
                                    </span>
                                </div>
                                <div className="mt-2 h-1.5 rounded-full bg-secondary">
                                    <div
                                        className={`h-1.5 rounded-full ${
                                            s.persen > 50
                                                ? "bg-emerald-500"
                                                : s.persen > 25
                                                  ? "bg-amber-400"
                                                  : "bg-red-500"
                                        }`}
                                        style={{ width: `${s.persen}%` }}
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Tampilkan lainnya / Sembunyikan */}
                        <div className="flex gap-2">
                            {hasMore && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setStokVisible((v) => v + STOK_LIMIT)
                                    }
                                    className="flex-1 rounded-xl border border-border py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary"
                                >
                                    Tampilkan lainnya ({filteredStok.length - stokVisible} item)
                                </button>
                            )}

                            {stokVisible > STOK_LIMIT && (
                                <button
                                    type="button"
                                    onClick={() => setStokVisible(STOK_LIMIT)}
                                    className="flex-1 rounded-xl border border-border py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary"
                                >
                                    Sembunyikan
                                </button>
                            )}
                        </div>

                        {/* Kosong */}
                        {filteredStok.length === 0 && (
                            <p className="text-xs text-muted-foreground">
                                {stokQuery
                                    ? `Tidak ada hasil untuk "${stokQuery}".`
                                    : "Belum ada data stok gudang."}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}