import { Head } from "@inertiajs/react";
import { useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

function formatRupiah(value) {
    return "Rp " + new Intl.NumberFormat("id-ID").format(value ?? 0);
}

function formatTanggal(tanggal) {
    return new Date(tanggal).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

export default function SpjOtomatis({ dokumen = [], summary = {} }) {
    const [search, setSearch] = useState("");
    const [filterJenis, setFilterJenis] = useState("Semua");
    const now = new Date();
    const [bulanExport, setBulanExport] = useState(now.getMonth() + 1);
    const [tahunExport, setTahunExport] = useState(now.getFullYear());

    const filtered = useMemo(() => {
        return dokumen.filter((item) => {
            const cocokJenis = filterJenis === "Semua" || item.jenis === filterJenis;
            const q = search.toLowerCase();
            const cocokSearch =
                !q ||
                item.no_dokumen.toLowerCase().includes(q) ||
                (item.akun ?? "").toLowerCase().includes(q) ||
                (item.penerima ?? "").toLowerCase().includes(q);
            return cocokJenis && cocokSearch;
        });
    }, [dokumen, search, filterJenis]);

    return (
        <AuthenticatedLayout>
            <Head title="SPJ Otomatis" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">SPJ Otomatis</h1>
                        <p className="text-sm text-muted-foreground">
                            Surat pertanggungjawaban dibuat otomatis dari setiap transaksi kas masuk dan keluar
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            className="rounded-xl border border-border px-3 py-2 text-sm"
                            value={bulanExport}
                            onChange={(e) => setBulanExport(Number(e.target.value))}
                        >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((b) => (
                                <option key={b} value={b}>
                                    {new Date(2000, b - 1).toLocaleDateString("id-ID", { month: "long" })}
                                </option>
                            ))}
                        </select>
                       <select
                            className="rounded-xl border border-border px-3 py-2 text-sm"
                            value={tahunExport}
                            onChange={(e) => setTahunExport(Number(e.target.value))}
                        >
                            {Array.from({ length: 5 }, (_, i) => now.getFullYear() - i).map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        <a
                            href={route("finance.spj-otomatis.export", {
                                bulan: bulanExport,
                                tahun: tahunExport,
                            })}
                            className="cursor-pointer rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                        >
                            Download PDF
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <p className="text-xs font-medium uppercase text-muted-foreground">
                            Total SPJ terbit
                        </p>
                        <p className="mt-2 text-2xl font-bold">{summary.total_dokumen ?? 0} Dokumen</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {summary.jumlah_pengeluaran ?? 0} pengeluaran · {summary.jumlah_penerimaan ?? 0} penerimaan
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <p className="text-xs font-medium uppercase text-muted-foreground">
                            Total nilai pengeluaran
                        </p>
                        <p className="mt-2 text-2xl font-bold">
                            {formatRupiah(summary.total_nilai_pengeluaran)}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">Akumulasi kas keluar</p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <p className="text-xs font-medium uppercase text-muted-foreground">
                            Total nilai penerimaan
                        </p>
                        <p className="mt-2 text-2xl font-bold">
                            {formatRupiah(summary.total_nilai_penerimaan)}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">Akumulasi kas masuk</p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <p className="text-xs font-medium uppercase text-muted-foreground">
                            Selisih / saldo
                        </p>
                        <p className="mt-2 text-2xl font-bold">{formatRupiah(summary.saldo_akhir)}</p>
                        <p className="mt-1 text-xs text-muted-foreground">Penerimaan dikurangi pengeluaran</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-border bg-card shadow-sm">
                    <div className="flex flex-col gap-3 p-6 pb-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-lg font-bold">Daftar Dokumen SPJ</h2>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Cari nomor, akun, penerima..."
                                className="rounded-xl border border-border px-3 py-2 text-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <select
                                className="rounded-xl border border-border px-3 py-2 text-sm"
                                value={filterJenis}
                                onChange={(e) => setFilterJenis(e.target.value)}
                            >
                                <option value="Semua">Semua</option>
                                <option value="Penerimaan">Penerimaan</option>
                                <option value="Pengeluaran">Pengeluaran</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                                    <th className="px-6 py-3">No SPJ/BPT</th>
                                    <th className="px-6 py-3">Tanggal</th>
                                    <th className="px-6 py-3">Jenis</th>
                                    <th className="px-6 py-3">Akun / Termin</th>
                                    <th className="px-6 py-3">Unit</th>
                                    <th className="px-6 py-3">Penerima</th>
                                    <th className="px-6 py-3">Debit</th>
                                    <th className="px-6 py-3">Kredit</th>
                                    <th className="px-6 py-3">Metode</th>
                                    <th className="px-6 py-3">Saldo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((item) => (
                                    <tr key={item.no_dokumen} className="border-b border-border last:border-0">
                                        <td className="px-6 py-4 font-mono text-xs text-primary">
                                            {item.no_dokumen}
                                        </td>
                                        <td className="px-6 py-4">{formatTanggal(item.tanggal)}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={
                                                    "rounded-full px-2 py-1 text-xs font-medium " +
                                                    (item.jenis === "Penerimaan"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-amber-100 text-amber-700")
                                                }
                                            >
                                                {item.jenis}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{item.akun}</td>
                                        <td className="px-6 py-4 text-primary">{item.unit || "-"}</td>
                                        <td className="px-6 py-4">{item.penerima || "-"}</td>
                                        <td className="px-6 py-4 text-emerald-600">
                                            {item.debit > 0 ? formatRupiah(item.debit) : "-"}
                                        </td>
                                        <td className="px-6 py-4 text-red-600">
                                            {item.kredit > 0 ? formatRupiah(item.kredit) : "-"}
                                        </td>
                                        <td className="px-6 py-4">{item.metode}</td>
                                        <td className="px-6 py-4 font-semibold">{formatRupiah(item.saldo)}</td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={10} className="px-6 py-8 text-center text-muted-foreground">
                                            Tidak ada dokumen SPJ yang cocok.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between border-t border-border p-4 text-xs text-muted-foreground">
                        <span>Menampilkan {filtered.length} dari {dokumen.length} dokumen</span>
                        <span>Diperbarui otomatis saat ada transaksi baru</span>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}