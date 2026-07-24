import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";


function formatRupiah(value) {
    return "Rp " + new Intl.NumberFormat("id-ID").format(value ?? 0);
}

function formatRibuan(value) {
    if (value === "" || value === null || value === undefined) return "";
    const angka = String(value).replace(/\D/g, ""); 
    if (angka === "") return "";
    return new Intl.NumberFormat("id-ID").format(Number(angka));
}

function parseRibuan(value) {
    return value.replace(/\D/g, "");
}
export default function KasKeluar({ kasKeluar = [], akunOptions = [] }) {
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        tanggal: "",
        akun_referensi_id: "",
        unit: "",
        keterangan: "",
        qty: 1,
        satuan: "",
        nominal_per_unit: "",
        metode_bayar: "transfer",
        penerima: "",
        lampiran: null,
    });

    const total = (Number(data.qty) || 0) * (Number(data.nominal_per_unit) || 0);

    function submit(e) {
        e.preventDefault();
        post(route("finance.kas-keluar.store"), {
            forceFormData: true, 
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
            <Head title="Kas Keluar" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Kas Keluar</h1>
                        <p className="text-sm text-muted-foreground">
                            Jurnal pengeluaran proyek selain pembelian material
                            gudang
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border border-border bg-card shadow-sm">
                    <div className="flex items-center justify-between p-6 pb-4">
                        <h2 className="text-lg font-bold">Jurnal Kas Keluar</h2>
                        <button
                            onClick={() => setShowForm(true)}
                            className="cursor-pointer rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                        >
                            + Catat Kas Keluar
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                                    <th className="px-6 py-3">Tanggal</th>
                                    <th className="px-6 py-3">Nama Akun</th>
                                    <th className="px-6 py-3">Unit</th>
                                    <th className="px-6 py-3">Keterangan</th>
                                    <th className="px-6 py-3">Qty</th>
                                    <th className="px-6 py-3">Satuan</th>
                                    <th className="px-6 py-3">Nominal</th>
                                    <th className="px-6 py-3">Total</th>
                                    <th className="px-6 py-3">Lampiran</th>
                                </tr>
                            </thead>
                            <tbody>
                                {kasKeluar.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-border last:border-0"
                                    >
                                        <td className="px-6 py-4">
                                            {new Date(
                                                item.tanggal,
                                            ).toLocaleDateString("id-ID", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {item.akun_referensi?.nama_akun}
                                        </td>
                                        <td className="px-6 py-4 text-primary">
                                            {item.unit || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {item.keterangan}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.qty}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.satuan}
                                        </td>
                                        <td className="px-6 py-4">
                                            {formatRupiah(
                                                item.nominal_per_unit,
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-semibold">
                                            {formatRupiah(item.total)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.lampiran_url ? (
                                                <a
                                                    href={item.lampiran_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-primary underline"
                                                >
                                                    Lihat
                                                </a>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {kasKeluar.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="px-6 py-8 text-center text-muted-foreground"
                                        >
                                            Belum ada jurnal kas keluar.
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
                    <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold">
                                    Catat Kas Keluar
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    SPJ dibuat otomatis saat disimpan.
                                </p>
                            </div>
                            <button
                                onClick={closeForm}
                                className="cursor-pointer text-muted-foreground"
                            >
                                ✕
                            </button>
                        </div>

                        <form
                            onSubmit={submit}
                            className="mt-4 grid grid-cols-2 gap-4"
                        >
                            <div>
                                <label className="text-sm font-medium">
                                    Tanggal
                                </label>
                                <input
                                    type="date"
                                    className="mt-1 w-full rounded-xl border border-border px-3 py-2"
                                    value={data.tanggal}
                                    onChange={(e) =>
                                        setData("tanggal", e.target.value)
                                    }
                                />
                                {errors.tanggal && (
                                    <p className="text-xs text-red-500">
                                        {errors.tanggal}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Nama Akun
                                </label>
                                <select
                                    className="mt-1 w-full rounded-xl border border-border px-3 py-2"
                                    value={data.akun_referensi_id}
                                    onChange={(e) =>
                                        setData(
                                            "akun_referensi_id",
                                            e.target.value,
                                        )
                                    }
                                >
                                    <option value="">Pilih akun</option>
                                    {akunOptions.map((akun) => (
                                        <option key={akun.id} value={akun.id}>
                                            {akun.nama_akun}
                                        </option>
                                    ))}
                                </select>
                                {errors.akun_referensi_id && (
                                    <p className="text-xs text-red-500">
                                        {errors.akun_referensi_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Unit (opsional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="A1 / Infrastruktur"
                                    className="mt-1 w-full rounded-xl border border-border px-3 py-2"
                                    value={data.unit}
                                    onChange={(e) =>
                                        setData("unit", e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Keterangan
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 w-full rounded-xl border border-border px-3 py-2"
                                    value={data.keterangan}
                                    onChange={(e) =>
                                        setData("keterangan", e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Qty
                                </label>
                                <input
                                    type="number"
                                    step="1"
                                    min="1"
                                    className="mt-1 w-full rounded-xl border border-border px-3 py-2"
                                    value={data.qty}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        
                                        setData(
                                            "qty",
                                            v === ""
                                                ? ""
                                                : String(parseInt(v, 10) || ""),
                                        );
                                    }}
                                    onKeyDown={(e) => {
                                        if (
                                            [".", ",", "-", "e", "E"].includes(
                                                e.key,
                                            )
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                {errors.qty && (
                                    <p className="text-xs text-red-500">
                                        {errors.qty}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Satuan
                                </label>
                                <input
                                    type="text"
                                    placeholder="OH, Liter, dll"
                                    className="mt-1 w-full rounded-xl border border-border px-3 py-2"
                                    value={data.satuan}
                                    onChange={(e) =>
                                        setData("satuan", e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Nominal / unit
                                </label>
                                <div className="relative mt-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                        Rp
                                    </span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="0"
                                        className="w-full rounded-xl border border-border py-2 pl-9 pr-3"
                                        value={formatRibuan(
                                            data.nominal_per_unit,
                                        )}
                                        onChange={(e) =>
                                            setData(
                                                "nominal_per_unit",
                                                parseRibuan(e.target.value),
                                            )
                                        }
                                    />
                                </div>
                                {errors.nominal_per_unit && (
                                    <p className="text-xs text-red-500">
                                        {errors.nominal_per_unit}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Metode Bayar
                                </label>
                                <select
                                    className="mt-1 w-full rounded-xl border border-border px-3 py-2"
                                    value={data.metode_bayar}
                                    onChange={(e) =>
                                        setData("metode_bayar", e.target.value)
                                    }
                                >
                                    <option value="transfer">Transfer</option>
                                    <option value="tunai">Tunai</option>
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label className="text-sm font-medium">
                                    Penerima
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 w-full rounded-xl border border-border px-3 py-2"
                                    value={data.penerima}
                                    onChange={(e) =>
                                        setData("penerima", e.target.value)
                                    }
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="text-sm font-medium">
                                    Lampiran No Bukti (opsional, maks 10MB)
                                </label>
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    className="mt-1 w-full rounded-xl border border-border px-3 py-2"
                                    onChange={(e) =>
                                        setData(
                                            "lampiran",
                                            e.target.files[0] ?? null,
                                        )
                                    }
                                />
                                {errors.lampiran && (
                                    <p className="text-xs text-red-500">
                                        {errors.lampiran}
                                    </p>
                                )}
                            </div>

                            <div className="col-span-2 rounded-xl bg-secondary/50 p-3 text-sm">
                                Total:{" "}
                                <span className="font-semibold">
                                    {formatRupiah(total)}
                                </span>
                            </div>

                            <div className="col-span-2 flex justify-end gap-2">
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
                                    Simpan Kas Keluar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}