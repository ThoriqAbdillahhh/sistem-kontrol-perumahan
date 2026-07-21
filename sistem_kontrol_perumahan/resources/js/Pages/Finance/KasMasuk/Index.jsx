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

export default function KasMasukPage({ akunOptions = [], kasMasuk = [] }) {
    const kasMasukForm = useForm({
        tanggal: "",
        akun_id: "",
        nominal: "",
        keterangan: "",
    });

    const kasMasukRows = useMemo(() => kasMasuk, [kasMasuk]);

    function submitKasMasuk(event) {
        event.preventDefault();
        kasMasukForm.post(route("finance.kas-masuk.store"), {
            preserveScroll: true,
            onSuccess: () => kasMasukForm.reset(),
        });
    }

    return (
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
    );
}
