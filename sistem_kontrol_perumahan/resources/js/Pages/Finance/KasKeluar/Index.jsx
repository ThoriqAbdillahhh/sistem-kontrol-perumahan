import { useMemo } from "react";
import { useForm } from "@inertiajs/react";
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

export default function KasKeluarPage({ akunOptions = [], unitOptions = [], kasKeluar = [] }) {
    const kasKeluarForm = useForm({
        tanggal: "",
        akun_id: "",
        unit_id: "",
        nominal: "",
        no_spj: "",
        keterangan: "",
    });

    const kasKeluarRows = useMemo(() => kasKeluar, [kasKeluar]);

    function submitKasKeluar(event) {
        event.preventDefault();
        kasKeluarForm.post(route("finance.kas-keluar.store"), {
            preserveScroll: true,
            onSuccess: () => kasKeluarForm.reset(),
        });
    }

    return (
        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
            <TableCard title="Tambah Kas Keluar">
                <form onSubmit={submitKasKeluar} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Tanggal</label>
                        <input
                            type="date"
                            value={kasKeluarForm.data.tanggal}
                            onChange={(e) => kasKeluarForm.setData("tanggal", e.target.value)}
                            className="mt-2 w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        {kasKeluarForm.errors.tanggal && <p className="mt-1 text-xs text-red-600">{kasKeluarForm.errors.tanggal}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Akun</label>
                        <select
                            value={kasKeluarForm.data.akun_id}
                            onChange={(e) => kasKeluarForm.setData("akun_id", e.target.value)}
                            className="mt-2 w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                            className="mt-2 w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                            className="mt-2 w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                            className="mt-2 w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        {kasKeluarForm.errors.no_spj && <p className="mt-1 text-xs text-red-600">{kasKeluarForm.errors.no_spj}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Keterangan</label>
                        <textarea
                            value={kasKeluarForm.data.keterangan}
                            onChange={(e) => kasKeluarForm.setData("keterangan", e.target.value)}
                            rows={4}
                            className="mt-2 w-full rounded-2xl border border-border bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
            </TableCard>

            <TableCard title="Daftar Kas Keluar" action={<span className="text-xs text-muted-foreground">{kasKeluarRows.length} item</span>}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted text-[12px] uppercase tracking-[0.15em] text-muted-foreground">
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
                                    <tr key={row.id} className="border-t border-border hover:bg-muted/50">
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
                                    <td colSpan={6} className="px-3 py-10 text-center text-sm text-muted-foreground">
                                        Belum ada data kas keluar.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </TableCard>
        </div>
    );
}
