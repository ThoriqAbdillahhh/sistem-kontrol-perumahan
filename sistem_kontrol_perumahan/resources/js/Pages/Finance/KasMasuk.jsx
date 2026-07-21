import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

function formatRupiah(value) {
    return "Rp " + new Intl.NumberFormat("id-ID").format(value ?? 0);
}

// tambahan baru:
function formatRibuan(value) {
    if (value === "" || value === null || value === undefined) return "";
    const angka = String(value).replace(/\D/g, ""); // buang semua kecuali digit
    if (angka === "") return "";
    return new Intl.NumberFormat("id-ID").format(Number(angka));
}

function parseRibuan(value) {
    return value.replace(/\D/g, ""); // sisain digit doang, hasilnya string angka mentah
}

export default function KasMasuk({ kasMasuk = [], totalBulanIni = 0, akunOptions = [] }) {
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        tanggal: "",
        akun_referensi_id: "",
        keterangan: "",
        nominal: "",
        dari: "",
        untuk: "Kas Proyek EstateControl",
    });

    function submit(e) {
        e.preventDefault();
        post(route("keuangan.kasMasuk.store"), {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    }

    function closeForm() {
        setShowForm(false);
        reset();
    }

    return (
        <AuthenticatedLayout>
            <Head title="Kas Masuk" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Kas Masuk</h1>
                    <p className="text-sm text-muted-foreground">
                        Jurnal dana masuk untuk pembangunan proyek
                    </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm max-w-sm">
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                        Total kas masuk bulan ini
                    </p>
                    <p className="mt-2 text-2xl font-bold">{formatRupiah(totalBulanIni)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {kasMasuk.length} jurnal kas masuk
                    </p>
                </div>

                <div className="rounded-2xl border border-border bg-card shadow-sm">
                    <div className="flex items-center justify-between p-6 pb-4">
                        <h2 className="text-lg font-bold">Jurnal Kas Masuk</h2>
                        <button
                            onClick={() => setShowForm(true)}
                            className="cursor-pointer rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                        >
                            + Catat Kas Masuk
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                                    <th className="px-6 py-3">Tanggal</th>
                                    <th className="px-6 py-3">Tahap</th>
                                    <th className="px-6 py-3">Keterangan</th>
                                    <th className="px-6 py-3">Nominal</th>
                                    <th className="px-6 py-3">Dari</th>
                                    <th className="px-6 py-3">Untuk</th>
                                    <th className="px-6 py-3">Minggu ke-</th>
                                </tr>
                            </thead>
                            <tbody>
                                {kasMasuk.map((item) => (
                                    <tr key={item.id} className="border-b border-border last:border-0">
                                        <td className="px-6 py-4">
                                            {new Date(item.tanggal).toLocaleDateString("id-ID", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {item.akun_referensi?.nama_akun}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {item.keterangan}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-emerald-600">
                                            {formatRupiah(item.nominal)}
                                        </td>
                                        <td className="px-6 py-4">{item.dari}</td>
                                        <td className="px-6 py-4">{item.untuk}</td>
                                        <td className="px-6 py-4">Minggu ke-{item.minggu_ke}</td>
                                    </tr>
                                ))}
                                {kasMasuk.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                                            Belum ada jurnal kas masuk.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL POPUP + BLUR BACKDROP */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={closeForm}
                    />

                    {/* modal content */}
                    <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold">Catat Kas Masuk</h2>
                            <button onClick={closeForm} className="cursor-pointer text-muted-foreground">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={submit} className="mt-4 space-y-4">
                            <div>
                                <label className="text-sm font-medium">Tanggal</label>
                                <input
                                    type="date"
                                    className="mt-1 w-full rounded-xl border border-border px-3 py-2"
                                    value={data.tanggal}
                                    onChange={(e) => setData("tanggal", e.target.value)}
                                />
                                {errors.tanggal && <p className="text-xs text-red-500">{errors.tanggal}</p>}
                            </div>

                            <div>
                                <label className="text-sm font-medium">Tahap</label>
                                <select
                                    className="mt-1 w-full rounded-xl border border-border px-3 py-2"
                                    value={data.akun_referensi_id}
                                    onChange={(e) => setData("akun_referensi_id", e.target.value)}
                                >
                                    <option value="">Termin / sumber dana</option>
                                    {akunOptions.map((akun) => (
                                        <option key={akun.id} value={akun.id}>
                                            {akun.nama_akun}
                                        </option>
                                    ))}
                                </select>
                                {errors.akun_referensi_id && (
                                    <p className="text-xs text-red-500">{errors.akun_referensi_id}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium">Keterangan</label>
                                <textarea
                                    rows={3}
                                    className="mt-1 w-full rounded-xl border border-border px-3 py-2"
                                    value={data.keterangan}
                                    onChange={(e) => setData("keterangan", e.target.value)}
                                />
                            </div>

                            <div>
    <label className="text-sm font-medium">Nominal</label>
    <div className="relative mt-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            Rp
        </span>
        <input
            type="text"
            inputMode="numeric"
            placeholder="0"
            className="w-full rounded-xl border border-border py-2 pl-9 pr-3"
            value={formatRibuan(data.nominal)}
            onChange={(e) => setData("nominal", parseRibuan(e.target.value))}
        />
    </div>
    {errors.nominal && <p className="text-xs text-red-500">{errors.nominal}</p>}
</div>

                            <div>
                                <label className="text-sm font-medium">Dari</label>
                                <input
                                    type="text"
                                    className="mt-1 w-full rounded-xl border border-border px-3 py-2"
                                    value={data.dari}
                                    onChange={(e) => setData("dari", e.target.value)}
                                />
                                {errors.dari && <p className="text-xs text-red-500">{errors.dari}</p>}
                            </div>

                            <div>
                                <label className="text-sm font-medium">Untuk</label>
                                <input
                                    type="text"
                                    className="mt-1 w-full rounded-xl border border-border px-3 py-2"
                                    value={data.untuk}
                                    onChange={(e) => setData("untuk", e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="cursor-pointer rounded-xl border border-border px-4 py-2 text-sm font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="cursor-pointer rounded-xl bg-primary px-6 py-2 text-sm font-medium text-primary-foreground"
                                >
                                    ✓ Simpan Jurnal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}