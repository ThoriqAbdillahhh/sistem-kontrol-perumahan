import { Head, useForm, usePage } from "@inertiajs/react";
import { useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SectionHeader from "@/Components/SectionHeader";
import TableCard from "@/Components/TableCard";

function formatRupiah(value) {
    const amount = Number(value ?? 0);
    return amount.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function formatDate(value) {
    if (!value) return "-";
    return value;
}

export default function FinanceIndex({ page, akunOptions = [], unitOptions = [], kasMasuk = [], kasKeluar = [] }) {
    const { flash = {} } = usePage().props;

    const kasMasukForm = useForm({
        tanggal: "",
        akun_id: "",
        nominal: "",
        keterangan: "",
    });

    const kasKeluarForm = useForm({
        tanggal: "",
        akun_id: "",
        unit_id: "",
        nominal: "",
        no_spj: "",
        keterangan: "",
    });

    const kasMasukRows = useMemo(() => kasMasuk, [kasMasuk]);
    const kasKeluarRows = useMemo(() => kasKeluar, [kasKeluar]);

    function submitKasMasuk(event) {
        event.preventDefault();
        kasMasukForm.post(route("finance.kas-masuk.store"), {
            preserveScroll: true,
            onSuccess: () => kasMasukForm.reset(),
        });
    }

    function submitKasKeluar(event) {
        event.preventDefault();
        kasKeluarForm.post(route("finance.kas-keluar.store"), {
            preserveScroll: true,
            onSuccess: () => kasKeluarForm.reset(),
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title={page ? `Keuangan - ${page}` : "Keuangan Proyek"} />

            <div className="space-y-6 p-6 md:p-8 bg-slate-50 min-h-screen">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <SectionHeader
                    title={page}
                    sub={`Halaman manajemen ${page.toLowerCase()} untuk proses keuangan proyek.`}
                />
            </div>

                {flash.success && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700 shadow-sm">
                        {flash.success}
                    </div>
                )}

                {page === "Kas Masuk" && (
                    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
                        <TableCard title="Tambah Kas Masuk">
                            <form onSubmit={submitKasMasuk} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Tanggal</label>
                                    <input
                                        type="date"
                                        value={kasMasukForm.data.tanggal}
                                        onChange={(e) => kasMasukForm.setData("tanggal", e.target.value)}
                                        className="mt-2 w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                    {kasMasukForm.errors.tanggal && <p className="mt-1 text-xs text-red-600">{kasMasukForm.errors.tanggal}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Akun</label>
                                    <select
                                        value={kasMasukForm.data.akun_id}
                                        onChange={(e) => kasMasukForm.setData("akun_id", e.target.value)}
                                        className="mt-2 w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="">Pilih akun</option>
                                        {akunOptions.map((akun) => (
                                            <option key={akun.id} value={akun.id}>
                                                {akun.kode_akun} - {akun.nama_akun}
                                            </option>
                                        ))}
                                    </select>
                                    {kasMasukForm.errors.akun_id && <p className="mt-1 text-xs text-red-600">{kasMasukForm.errors.akun_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Nominal</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={kasMasukForm.data.nominal}
                                        onChange={(e) => kasMasukForm.setData("nominal", e.target.value)}
                                        placeholder="0.00"
                                        className="mt-2 w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                    {kasMasukForm.errors.nominal && <p className="mt-1 text-xs text-red-600">{kasMasukForm.errors.nominal}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Keterangan</label>
                                    <textarea
                                        value={kasMasukForm.data.keterangan}
                                        onChange={(e) => kasMasukForm.setData("keterangan", e.target.value)}
                                        rows={4}
                                        className="mt-2 w-full rounded-2xl border border-border bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Catatan tambahan..."
                                    />
                                    {kasMasukForm.errors.keterangan && <p className="mt-1 text-xs text-red-600">{kasMasukForm.errors.keterangan}</p>}
                                </div>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
                                >
                                    Simpan Kas Masuk
                                </button>
                            </form>
                        </TableCard>

                        <TableCard title="Daftar Kas Masuk" action={<span className="text-xs text-muted-foreground">{kasMasukRows.length} item</span>}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted text-[12px] uppercase tracking-[0.15em] text-muted-foreground">
                                        <tr>
                                            <th className="px-3 py-3">Tanggal</th>
                                            <th className="px-3 py-3">Akun</th>
                                            <th className="px-3 py-3">Nominal</th>
                                            <th className="px-3 py-3">Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {kasMasukRows.length > 0 ? (
                                            kasMasukRows.map((row) => (
                                                <tr key={row.id} className="border-t border-border hover:bg-muted/50">
                                                    <td className="px-3 py-3 text-sm text-slate-700">{formatDate(row.tanggal)}</td>
                                                    <td className="px-3 py-3 text-sm text-slate-700">{row.akun}</td>
                                                    <td className="px-3 py-3 font-mono text-sm text-slate-900">{formatRupiah(row.nominal)}</td>
                                                    <td className="px-3 py-3 text-sm text-slate-700">{row.keterangan || "-"}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-3 py-10 text-center text-sm text-muted-foreground">
                                                    Belum ada data kas masuk.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </TableCard>
                    </div>
                )}

                {page === "Kas Keluar" && (
                    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 px-6 py-5">
                                <h2 className="text-lg font-semibold text-slate-900">Tambah Kas Keluar</h2>
                                <p className="mt-1 text-sm text-slate-500">Rekam pengeluaran kas proyek per unit.</p>
                            </div>
                            <form onSubmit={submitKasKeluar} className="space-y-4 px-6 py-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Tanggal</label>
                                    <input
                                        type="date"
                                        value={kasKeluarForm.data.tanggal}
                                        onChange={(e) => kasKeluarForm.setData("tanggal", e.target.value)}
                                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                    {kasKeluarForm.errors.tanggal && <p className="mt-1 text-xs text-red-600">{kasKeluarForm.errors.tanggal}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Akun</label>
                                    <select
                                        value={kasKeluarForm.data.akun_id}
                                        onChange={(e) => kasKeluarForm.setData("akun_id", e.target.value)}
                                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="">Pilih akun</option>
                                        {akunOptions.map((akun) => (
                                            <option key={akun.id} value={akun.id}>
                                                {akun.kode_akun} - {akun.nama_akun}
                                            </option>
                                        ))}
                                    </select>
                                    {kasKeluarForm.errors.akun_id && <p className="mt-1 text-xs text-red-600">{kasKeluarForm.errors.akun_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Unit</label>
                                    <select
                                        value={kasKeluarForm.data.unit_id}
                                        onChange={(e) => kasKeluarForm.setData("unit_id", e.target.value)}
                                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="">Pilih unit</option>
                                        {unitOptions.map((unit) => (
                                            <option key={unit.id} value={unit.id}>
                                                {unit.nama_unit}
                                            </option>
                                        ))}
                                    </select>
                                    {kasKeluarForm.errors.unit_id && <p className="mt-1 text-xs text-red-600">{kasKeluarForm.errors.unit_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Nominal</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={kasKeluarForm.data.nominal}
                                        onChange={(e) => kasKeluarForm.setData("nominal", e.target.value)}
                                        placeholder="0.00"
                                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                    {kasKeluarForm.errors.nominal && <p className="mt-1 text-xs text-red-600">{kasKeluarForm.errors.nominal}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">No SPJ</label>
                                    <input
                                        type="text"
                                        value={kasKeluarForm.data.no_spj}
                                        onChange={(e) => kasKeluarForm.setData("no_spj", e.target.value)}
                                        placeholder="Optional"
                                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                    {kasKeluarForm.errors.no_spj && <p className="mt-1 text-xs text-red-600">{kasKeluarForm.errors.no_spj}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Keterangan</label>
                                    <textarea
                                        value={kasKeluarForm.data.keterangan}
                                        onChange={(e) => kasKeluarForm.setData("keterangan", e.target.value)}
                                        rows={4}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Catatan tambahan..."
                                    />
                                    {kasKeluarForm.errors.keterangan && <p className="mt-1 text-xs text-red-600">{kasKeluarForm.errors.keterangan}</p>}
                                </div>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
                                >
                                    Simpan Kas Keluar
                                </button>
                            </form>
                        </section>

                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 px-6 py-5">
                                <h2 className="text-lg font-semibold text-slate-900">Daftar Kas Keluar</h2>
                                <p className="mt-1 text-sm text-slate-500">Riwayat pengeluaran kas proyek.</p>
                            </div>
                            <div className="overflow-x-auto px-6 py-5">
                                <table className="w-full text-sm text-left">
                                    <thead className="border-b border-slate-200 text-[12px] uppercase tracking-[0.15em] text-slate-500">
                                        <tr>
                                            <th className="px-3 py-3">Tanggal</th>
                                            <th className="px-3 py-3">Akun</th>
                                            <th className="px-3 py-3">Unit</th>
                                            <th className="px-3 py-3">Nominal</th>
                                            <th className="px-3 py-3">No SPJ</th>
                                            <th className="px-3 py-3">Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {kasKeluarRows.length > 0 ? (
                                            kasKeluarRows.map((row) => (
                                                <tr key={row.id} className="border-b border-slate-200 hover:bg-slate-50">
                                                    <td className="px-3 py-3 text-sm text-slate-700">{formatDate(row.tanggal)}</td>
                                                    <td className="px-3 py-3 text-sm text-slate-700">{row.akun}</td>
                                                    <td className="px-3 py-3 text-sm text-slate-700">{row.unit || "-"}</td>
                                                    <td className="px-3 py-3 font-mono text-sm text-slate-900">{formatRupiah(row.nominal)}</td>
                                                    <td className="px-3 py-3 text-sm text-slate-700">{row.no_spj || "-"}</td>
                                                    <td className="px-3 py-3 text-sm text-slate-700">{row.keterangan || "-"}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-3 py-10 text-center text-sm text-slate-500">
                                                    Belum ada data kas keluar.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                )}

                {page !== "Kas Masuk" && page !== "Kas Keluar" && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Modul <strong>{page}</strong> sedang disiapkan. Konten khusus akan ditambahkan segera.
                        </p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
