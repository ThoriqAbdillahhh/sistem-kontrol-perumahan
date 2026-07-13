import { useMemo, useState } from "react";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import { Plus, Edit3, Trash2, X } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SectionHeader from "@/Components/SectionHeader";
import TableCard from "@/Components/TableCard";
import SearchBar from "@/Components/SearchBar";
import MaterialSelect from "@/Components/MaterialSelect";

function formatRupiah(v) {
    return "Rp " + Number(v ?? 0).toLocaleString("id-ID");
}

export default function LogGudangIndex({
    logMasuk,
    logKeluar,
    materials,
    units,
    stok,
}) {
    const [tab, setTab] = useState("masuk");
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);

    const masukForm = useForm({
        tanggal: "",
        supplier: "",
        material_id: "",
        qty: "",
        harga_satuan: "",
        total_harga: "",
        keterangan: "",
    });

    const keluarForm = useForm({
        tanggal: "",
        unit_id: "",
        material_id: "",
        qty: "",
        harga: "",
        total: "",
        keterangan: "",
    });

    const form = tab === "masuk" ? masukForm : keluarForm;
    const selectedMaterial = (materials ?? []).find(
    (m) => String(m.id) === String(form.data.material_id)
    );

    const filteredMasuk = useMemo(
        () =>
            logMasuk.filter((r) =>
                `${r.supplier} ${r.material?.nama_material}`
                    .toLowerCase()
                    .includes(search.toLowerCase()),
            ),
        [logMasuk, search],
    );

    const materialsTersedia = useMemo(() => {
        if (tab !== "keluar") return materials;
        const stokMap = new Map(stok.map((s) => [s.material_id, s.sisa_stok]));
        return materials.filter((m) => (stokMap.get(m.id) ?? 0) > 0);
    }, [materials, stok, tab]);

    const filteredKeluar = useMemo(
        () =>
            logKeluar.filter((r) =>
                `${r.unit?.nama_unit ?? ""} ${r.material?.nama_material}`
                    .toLowerCase()
                    .includes(search.toLowerCase()),
            ),
        [logKeluar, search],
    );

    function openAdd() {
        setEditTarget(null);
        form.reset();
        setModalOpen(true);
    }

    function openEdit(row) {
        setEditTarget(row);
        if (tab === "masuk") {
            masukForm.setData({
                tanggal: row.tanggal.slice(0, 10),
                supplier: row.supplier,
                material_id: row.material_id,
                qty: row.qty,
                harga_satuan: row.harga_satuan,
                total_harga: row.total_harga,
                keterangan: row.keterangan ?? "",
            });
        } else {
            keluarForm.setData({
                tanggal: row.tanggal.slice(0, 10),
                unit_id: row.unit_id,
                material_id: row.material_id,
                qty: row.qty,
                harga: row.harga,
                total: row.total,
                keterangan: row.keterangan ?? "",
            });
        }
        setModalOpen(true);
    }

    function handleSave(e) {
        e.preventDefault();
        const options = {
            onSuccess: () => setModalOpen(false),
            preserveScroll: true,
        };

        if (tab === "masuk") {
            editTarget
                ? masukForm.put(
                      route("log-gudang.masuk.update", editTarget.id),
                      options,
                  )
                : masukForm.post(route("log-gudang.masuk.store"), options);
        } else {
            editTarget
                ? keluarForm.put(
                      route("log-gudang.keluar.update", editTarget.id),
                      options,
                  )
                : keluarForm.post(route("log-gudang.keluar.store"), options);
        }
    }

    function handleDelete(row) {
        if (!confirm("Hapus log ini?")) return;
        const routeName =
            tab === "masuk"
                ? "log-gudang.masuk.destroy"
                : "log-gudang.keluar.destroy";
        router.delete(route(routeName, row.id), { preserveScroll: true });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Log Transaksi Gudang" />

            <div className="space-y-5">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <SectionHeader
                        title="Log Transaksi Gudang"
                        sub="Masuk dari supplier · Keluar ke unit — stok otomatis terbarui."
                    />
                    <div className="flex gap-2">
                        {["masuk", "keluar"].map((t) => (
                            <button
                                key={t}
                                onClick={() => {
                                    setTab(t);
                                    setModalOpen(false);
                                }}
                                className={`cursor-pointer rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                                    tab === t
                                        ? "bg-primary text-white"
                                        : "border border-border bg-white"
                                }`}
                            >
                                Log{" "}
                                {t === "masuk" ? "Masuk (In)" : "Keluar (Out)"}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-5 xl:grid-cols-[1fr_290px]">
                    {tab === "masuk" ? (
                        <TableCard
                            title="Log Masuk "
                            action={
                                <div className="flex gap-2">
                                    <SearchBar
                                        value={search}
                                        onChange={setSearch}
                                    />
                                    <button
                                        onClick={openAdd}
                                        className="cursor-pointer rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white"
                                    >
                                        <Plus size={14} className="inline" />{" "}
                                        Tambah
                                    </button>
                                </div>
                            }
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[760px] text-sm">
                                    <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
                                        <tr>
                                            {[
                                                "Tanggal",
                                                "Supplier",
                                                "Kode",
                                                "Material",
                                                "Qty",
                                                "Satuan",
                                                "Harga Satuan",
                                                "Total",
                                                "Keterangan",
                                                "",
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
                                        {filteredMasuk.map((r) => (
                                            <tr
                                                key={r.id}
                                                className="border-t border-border hover:bg-secondary/50"
                                            >
                                                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                                    {r.tanggal.slice(0, 10)}
                                                </td>
                                                <td className="px-4 py-3 text-xs">
                                                    {r.supplier}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs font-bold text-primary">
                                                        {
                                                            r.material
                                                                ?.kode_material
                                                        }
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-xs">
                                                    {r.material?.nama_material}
                                                </td>
                                                <td className="px-4 py-3 font-mono text-xs font-bold">
                                                    {r.qty}
                                                </td>
                                                <td className="px-4 py-3 text-xs">
                                                    {r.material?.satuan}
                                                </td>
                                                <td className="px-4 py-3 font-mono text-xs">
                                                    {formatRupiah(
                                                        r.harga_satuan,
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 font-mono text-xs">
                                                    {formatRupiah(
                                                        r.total_harga,
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                                    {r.keterangan}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2 text-muted-foreground">
                                                        <Edit3
                                                            size={14}
                                                            className="cursor-pointer hover:text-primary"
                                                            onClick={() =>
                                                                openEdit(r)
                                                            }
                                                        />
                                                        <Trash2
                                                            size={14}
                                                            className="cursor-pointer hover:text-red-500"
                                                            onClick={() =>
                                                                handleDelete(r)
                                                            }
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </TableCard>
                    ) : (
                        <TableCard
                            title="Log Keluar "
                            action={
                                <div className="flex gap-2">
                                    <SearchBar
                                        value={search}
                                        onChange={setSearch}
                                    />
                                    <button
                                        onClick={openAdd}
                                        className="cursor-pointer rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white"
                                    >
                                        <Plus size={14} className="inline" />{" "}
                                        Tambah
                                    </button>
                                </div>
                            }
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[760px] text-sm">
                                    <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
                                        <tr>
                                            {[
                                                "Tanggal",
                                                "Unit",
                                                "Kode",
                                                "Material",
                                                "Qty",
                                                "Satuan",
                                                "Harga satuan",
                                                "Total",
                                                "Keterangan",
                                                "",
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
                                        {filteredKeluar.map((r) => (
                                            <tr
                                                key={r.id}
                                                className="border-t border-border hover:bg-secondary/50"
                                            >
                                                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                                    {r.tanggal.slice(0, 10)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="rounded-md bg-sky-50 px-2 py-0.5 font-mono text-xs font-bold text-sky-700">
                                                        {r.unit?.nama_unit}
                                                    </span>
                                                    <span className="ml-1 text-[11px] text-muted-foreground">
                                                        Zona {r.unit?.zona}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs font-bold text-primary">
                                                        {
                                                            r.material
                                                                ?.kode_material
                                                        }
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-xs">
                                                    {r.material?.nama_material}
                                                </td>
                                                <td className="px-4 py-3 font-mono text-xs font-bold">
                                                    {r.qty}
                                                </td>
                                                <td className="px-4 py-3 text-xs">
                                                    {r.material?.satuan}
                                                </td>
                                                <td className="px-4 py-3 font-mono text-xs">
                                                    {formatRupiah(r.harga)}
                                                </td>
                                                <td className="px-4 py-3 font-mono text-xs">
                                                    {formatRupiah(r.total)}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                                    {r.keterangan}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2 text-muted-foreground">
                                                        <Edit3
                                                            size={14}
                                                            className="cursor-pointer hover:text-primary"
                                                            onClick={() =>
                                                                openEdit(r)
                                                            }
                                                        />
                                                        <Trash2
                                                            size={14}
                                                            className="cursor-pointer hover:text-red-500"
                                                            onClick={() =>
                                                                handleDelete(r)
                                                            }
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </TableCard>
                    )}

                    <div className="space-y-2.5">
                        <p className="font-bold">Stok Real-time</p>
                        {stok.map((s) => {
                            const pct =
                                s.total_masuk > 0
                                    ? Math.min(
                                          100,
                                          (s.sisa_stok / s.total_masuk) * 100,
                                      )
                                    : 0;
                            const barColor = s.is_warning
                                ? "bg-red-500"
                                : pct > 50
                                  ? "bg-emerald-500"
                                  : "bg-amber-400";
                            return (
                                <div
                                    key={s.material_id}
                                    className="rounded-xl border border-border bg-white p-3"
                                >
                                    <div className="flex justify-between text-sm">
                                        <span className="font-semibold">
                                            {s.nama}
                                        </span>
                                        <span className="font-mono text-xs font-bold">
                                            {s.sisa_stok} {s.satuan}
                                        </span>
                                    </div>
                                    <div className="mt-2 h-1.5 rounded-full bg-secondary">
                                        <div
                                            className={`h-1.5 rounded-full ${barColor}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <div className="mt-1 text-[11px] text-muted-foreground">
                                        {formatRupiah(s.nilai_rupiah)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                        <form
                            onSubmit={handleSave}
                            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold">
                                    {editTarget ? "Edit" : "Tambah"} Log{" "}
                                    {tab === "masuk" ? "Masuk" : "Keluar"}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="cursor-pointer rounded-lg p-1 text-muted-foreground hover:text-foreground"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="mt-5 space-y-4">
                                <Field
                                    label="Tanggal"
                                    type="date"
                                    value={form.data.tanggal}
                                    onChange={(v) => form.setData("tanggal", v)}
                                    error={form.errors.tanggal}
                                />

                                {tab === "masuk" && (
                                    <Field
                                        label="Supplier"
                                        value={masukForm.data.supplier}
                                        onChange={(v) =>
                                            masukForm.setData("supplier", v)
                                        }
                                        placeholder="Nama supplier"
                                        error={masukForm.errors.supplier}
                                    />
                                )}

                                {tab === "keluar" && (
                                    <label className="block">
                                        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Unit
                                        </span>
                                        <select
                                            value={keluarForm.data.unit_id}
                                            onChange={(e) =>
                                                keluarForm.setData(
                                                    "unit_id",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-border bg-input-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                                        >
                                            <option value="">
                                                — pilih unit —
                                            </option>
                                            {units.map((u) => (
                                                <option key={u.id} value={u.id}>
                                                    {u.nama_unit} — Zona{" "}
                                                    {u.zona}
                                                </option>
                                            ))}
                                        </select>
                                        {keluarForm.errors.unit_id && (
                                            <span className="mt-1 block text-xs text-red-500">
                                                {keluarForm.errors.unit_id}
                                            </span>
                                        )}
                                    </label>
                                )}

                                <MaterialSelect
                                    materials={materialsTersedia}
                                    value={form.data.material_id}
                                    onChange={(id) =>
                                        form.setData("material_id", id)
                                    }
                                    error={form.errors.material_id}
                                />

                                <div>
                                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Satuan
                                    </span>

                                    <input
                                        type="text"
                                        value={selectedMaterial?.satuan ?? ""}
                                        readOnly
                                        placeholder="Otomatis"
                                        className="w-full rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm text-muted-foreground"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Field
                                        label={`Qty${selectedMaterial?.satuan ? ` (${selectedMaterial.satuan})` : ""}`}
                                        type="number"
                                        value={form.data.qty}
                                        onChange={(v) => form.setData("qty", v)}
                                        error={form.errors.qty}
                                    />

                                    {tab === "masuk" ? (
                                        <CurrencyField
                                            label="Harga Satuan"
                                            value={masukForm.data.harga_satuan}
                                            onChange={(v) =>
                                                masukForm.setData(
                                                    "harga_satuan",
                                                    v,
                                                )
                                            }
                                            error={
                                                masukForm.errors.harga_satuan
                                            }
                                        />
                                    ) : (
                                        <CurrencyField
                                            label="Harga"
                                            value={keluarForm.data.harga}
                                            onChange={(v) =>
                                                keluarForm.setData("harga", v)
                                            }
                                            error={keluarForm.errors.harga}
                                        />
                                    )}
                                </div>

                                {tab === "masuk" ? (
                                    <CurrencyField
                                        label="Total Harga"
                                        value={masukForm.data.total_harga}
                                        onChange={(v) =>
                                            masukForm.setData("total_harga", v)
                                        }
                                        error={masukForm.errors.total_harga}
                                    />
                                ) : (
                                    <CurrencyField
                                        label="Total"
                                        value={keluarForm.data.total}
                                        onChange={(v) =>
                                            keluarForm.setData("total", v)
                                        }
                                        error={keluarForm.errors.total}
                                    />
                                )}

                                <Field
                                    label="Keterangan"
                                    value={form.data.keterangan}
                                    onChange={(v) =>
                                        form.setData("keterangan", v)
                                    }
                                    placeholder="opsional"
                                    error={form.errors.keterangan}
                                />
                            </div>

                            <div className="mt-6 flex gap-2">
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="cursor-pointer flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-white disabled:opacity-60"
                                >
                                    {editTarget ? "Simpan Perubahan" : "Tambah"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="cursor-pointer rounded-xl border border-border px-5 py-3 text-sm"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

function Field({ label, value, onChange, placeholder, error, type = "text" }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
            </span>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                step={type === "number" ? "any" : undefined}
                className="w-full rounded-xl border border-border bg-input-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {error && (
                <span className="mt-1 block text-xs text-red-500">{error}</span>
            )}
        </label>
    );
}

// Input Rupiah: tampilan terformat "Rp 1.250.000", value yang dikirim ke form tetap angka mentah (string digit).
function CurrencyField({ label, value, onChange, error }) {
    function handleChange(e) {
        const digits = e.target.value.replace(/\D/g, "");
        onChange(digits);
    }

    const displayValue =
        value === "" || value === null || value === undefined
            ? ""
            : Number(value).toLocaleString("id-ID");

    return (
        <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {label} (Rp)
            </span>
            <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    Rp
                </span>
                <input
                    type="text"
                    inputMode="numeric"
                    value={displayValue}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full rounded-xl border border-border bg-input-background py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
            </div>
            {error && (
                <span className="mt-1 block text-xs text-red-500">{error}</span>
            )}
        </label>
    );
}
