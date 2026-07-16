import { useMemo, useState, useEffect  } from "react";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import { Plus, Edit3, Trash2, X, History } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SectionHeader from "@/Components/SectionHeader";
import TableCard from "@/Components/TableCard";
import SearchBar from "@/Components/SearchBar";
import MaterialSelect from "@/Components/MaterialSelect";
import ConfirmDialog from "@/Components/ConfirmDialog";

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
    const { auth } = usePage().props;
    const userRole = auth?.user?.roles?.[0] ?? "";

    const [tab, setTab] = useState("masuk");
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [qtyMode, setQtyMode] = useState("total"); // "total" | "per_unit"
    const [qtyInputRaw, setQtyInputRaw] = useState("");
    const [unitRows, setUnitRows] = useState([""]); // array of unit_id string, default 1 slot kosong

    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    function openHistory() {
        setHistoryModalOpen(true);
        setLoadingHistory(true);
        fetch(route("log-gudang.history"))
            .then((res) => res.json())
            .then((data) => {
                setHistoryData(data);
                setLoadingHistory(false);
            })
            .catch((err) => {
                console.error(err);
                setLoadingHistory(false);
            });
    }

    function addUnitRow() {
        setUnitRows((prev) => [...prev, ""]);
    }

    function removeUnitRow(index) {
        setUnitRows((prev) => prev.filter((_, i) => i !== index));
    }

    function updateUnitRow(index, value) {
        setUnitRows((prev) => prev.map((v, i) => (i === index ? value : v)));
    }

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
        (m) => String(m.id) === String(form.data.material_id),
    );
    const selectedUnitIds = unitRows.filter((id) => id !== "");

    // Log Keluar (tambah, multi-unit): qty yg dikirim ke backend selalu "total barang",
    // dihitung dari mode toggle (total langsung, atau per-unit x jumlah unit terpilih).
    useEffect(() => {
        if (tab !== "keluar" || editTarget) return;
        const raw = Number(qtyInputRaw) || 0;
        const jumlahUnit = selectedUnitIds.length || 0;
        const totalQty = qtyMode === "total" ? raw : raw * jumlahUnit;
        keluarForm.setData("qty", totalQty);
    }, [tab, editTarget, qtyInputRaw, qtyMode, selectedUnitIds]);

    // Log Keluar: saat material dipilih, harga otomatis ambil dari rata-rata bergerak (moving average) stok material tsb.
    useEffect(() => {
        if (tab !== "keluar") return;
        if (!selectedMaterial) return;

        keluarForm.setData("harga", selectedMaterial.harga_terakhir ?? 0);
    }, [tab, selectedMaterial?.id]);

    // Total Harga (masuk) otomatis = qty x harga_satuan.
    useEffect(() => {
        const qty = Number(masukForm.data.qty) || 0;
        const harga = Number(masukForm.data.harga_satuan) || 0;
        masukForm.setData("total_harga", qty * harga);
    }, [masukForm.data.qty, masukForm.data.harga_satuan]);

    // Total (keluar) otomatis = qty x harga.
    useEffect(() => {
        const qty = Number(keluarForm.data.qty) || 0;
        const harga = Number(keluarForm.data.harga) || 0;
        keluarForm.setData("total", qty * harga);
    }, [keluarForm.data.qty, keluarForm.data.harga]);

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
        setQtyMode("total");
        setQtyInputRaw("");
        setUnitRows([""]);
        setModalOpen(true);
    }

    function openEdit(row) {
        setEditTarget(row);
        setQtyMode("total");
        setQtyInputRaw("");
        setUnitRows([""]);
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
        } else if (editTarget) {
            keluarForm.put(
                route("log-gudang.keluar.update", editTarget.id),
                options,
            );
        } else {
            keluarForm.transform((data) => ({
                ...data,
                unit_ids: selectedUnitIds,
            }));
            keluarForm.post(route("log-gudang.keluar.store"), options);
        }
    }

    function handleDelete(row) {
        setDeleteTarget(row);
    }

    function confirmDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        const routeName =
            tab === "masuk"
                ? "log-gudang.masuk.destroy"
                : "log-gudang.keluar.destroy";
        router.delete(route(routeName, deleteTarget.id), {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(null);
            },
        });
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
                    <div className="flex flex-wrap gap-2">
                        {userRole === "Super Admin" && (
                            <button
                                onClick={openHistory}
                                className="cursor-pointer rounded-xl border border-border bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary transition flex items-center gap-2"
                            >
                                <History size={16} />
                                Riwayat Perubahan
                            </button>
                        )}
                        {["masuk", "keluar"].map((t) => (
                            <button
                                key={t}
                                onClick={() => {
                                    setTab(t);
                                    setModalOpen(false);
                                    setDeleteTarget(null);
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
                                                    {Number(
                                                        r.qty,
                                                    ).toLocaleString("id-ID")}
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
                                                    {Number(
                                                        r.qty,
                                                    ).toLocaleString("id-ID")}
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

                                {tab === "keluar" && editTarget && (
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

                                {tab === "keluar" && !editTarget && (
                                    <div>
                                        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Unit Tujuan
                                        </span>
                                        <div className="space-y-2">
                                            {unitRows.map((unitId, index) => {
                                                const usedElsewhere =
                                                    unitRows.filter(
                                                        (_, i) => i !== index,
                                                    );
                                                const availableUnits =
                                                    units.filter(
                                                        (u) =>
                                                            !usedElsewhere.includes(
                                                                String(u.id),
                                                            ),
                                                    );
                                                return (
                                                    <div
                                                        key={index}
                                                        className="flex gap-2"
                                                    >
                                                        <select
                                                            value={unitId}
                                                            onChange={(e) =>
                                                                updateUnitRow(
                                                                    index,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="flex-1 rounded-xl border border-border bg-input-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                                                        >
                                                            <option value="">
                                                                — pilih unit —
                                                            </option>
                                                            {availableUnits.map(
                                                                (u) => (
                                                                    <option
                                                                        key={
                                                                            u.id
                                                                        }
                                                                        value={String(
                                                                            u.id,
                                                                        )}
                                                                    >
                                                                        {
                                                                            u.nama_unit
                                                                        }{" "}
                                                                        — Zona{" "}
                                                                        {
                                                                            u.zona
                                                                        }
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                        {unitRows.length >
                                                            1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeUnitRow(
                                                                        index,
                                                                    )
                                                                }
                                                                className="cursor-pointer rounded-xl border border-border px-3 text-muted-foreground hover:text-red-500"
                                                            >
                                                                <X
                                                                    size={14}
                                                                />
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {unitRows.length < units.length && (
                                            <button
                                                type="button"
                                                onClick={addUnitRow}
                                                className="mt-2 flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary hover:underline"
                                            >
                                                <Plus size={12} /> Tambah Unit
                                            </button>
                                        )}
                                        {keluarForm.errors.unit_ids && (
                                            <span className="mt-1 block text-xs text-red-500">
                                                {keluarForm.errors.unit_ids}
                                            </span>
                                        )}
                                    </div>
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

                                {tab === "keluar" && !editTarget && (
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Input Berdasarkan
                                        </span>
                                        <label className="flex cursor-pointer items-center gap-1.5 text-xs">
                                            <input
                                                type="radio"
                                                checked={qtyMode === "total"}
                                                onChange={() =>
                                                    setQtyMode("total")
                                                }
                                            />
                                            Total Barang
                                        </label>
                                        <label className="flex cursor-pointer items-center gap-1.5 text-xs">
                                            <input
                                                type="radio"
                                                checked={
                                                    qtyMode === "per_unit"
                                                }
                                                onChange={() =>
                                                    setQtyMode("per_unit")
                                                }
                                            />
                                            Per Unit
                                        </label>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Field
                                            label={
                                                tab === "keluar" &&
                                                !editTarget
                                                    ? qtyMode === "total"
                                                        ? `Total Barang${selectedMaterial?.satuan ? ` (${selectedMaterial.satuan})` : ""}`
                                                        : `Qty per Unit${selectedMaterial?.satuan ? ` (${selectedMaterial.satuan})` : ""}`
                                                    : `Qty${selectedMaterial?.satuan ? ` (${selectedMaterial.satuan})` : ""}`
                                            }
                                            type="number"
                                            value={
                                                tab === "keluar" &&
                                                !editTarget
                                                    ? qtyInputRaw
                                                    : form.data.qty
                                            }
                                            onChange={
                                                tab === "keluar" &&
                                                !editTarget
                                                    ? setQtyInputRaw
                                                    : (v) =>
                                                          form.setData(
                                                              "qty",
                                                              v,
                                                          )
                                            }
                                            error={form.errors.qty}
                                        />
                                        {tab === "keluar" &&
                                            !editTarget &&
                                            selectedUnitIds.length > 0 &&
                                            Number(qtyInputRaw) > 0 && (
                                                <p className="mt-1 text-[11px] text-muted-foreground">
                                                    {qtyMode === "total"
                                                        ? `≈ ${(
                                                              Number(
                                                                  qtyInputRaw,
                                                              ) /
                                                              selectedUnitIds.length
                                                          ).toLocaleString(
                                                              "id-ID",
                                                          )} per unit`
                                                        : `Total: ${(
                                                              Number(
                                                                  qtyInputRaw,
                                                              ) *
                                                              selectedUnitIds.length
                                                          ).toLocaleString(
                                                              "id-ID",
                                                          )}`}
                                                </p>
                                            )}
                                    </div>

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
                                            error={keluarForm.errors.harga}
                                            readOnly
                                        />
                                    )}
                                </div>

                                {tab === "masuk" ? (
                                    <CurrencyField
                                        label="Total Harga"
                                        value={masukForm.data.total_harga}
                                        error={masukForm.errors.total_harga}
                                        readOnly
                                    />
                                ) : (
                                    <CurrencyField
                                        label="Total"
                                        value={keluarForm.data.total}
                                        error={keluarForm.errors.total}
                                        readOnly
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
                                    disabled={
                                        form.processing ||
                                        (tab === "keluar" &&
                                            !editTarget &&
                                            selectedUnitIds.length === 0)
                                    }
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

                <ConfirmDialog
                    open={!!deleteTarget}
                    title="Hapus data log gudang?"
                    message={
                        deleteTarget
                            ? `Data ${
                                  tab === "masuk" ? "masuk" : "keluar"
                              } untuk ${deleteTarget?.material?.nama_material ?? "material ini"} akan dihapus.`
                            : ""
                    }
                    confirmText="Ya, Hapus"
                    cancelText="Batal"
                    danger
                    processing={deleting}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteTarget(null)}
                />

                {historyModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl flex flex-col max-h-[85vh]">
                            <div className="flex items-center justify-between pb-4 border-b border-border">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                                        <History className="text-primary" size={20} />
                                        Riwayat Perubahan Log Gudang
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setHistoryModalOpen(false)}
                                    className="cursor-pointer rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-secondary transition"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="mt-4 flex-1 overflow-y-auto pr-1 space-y-4 min-h-[300px]">
                                {loadingHistory ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                        <span className="mt-2 text-sm">Memuat data riwayat...</span>
                                    </div>
                                ) : historyData.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground text-sm">
                                        Belum ada riwayat perubahan yang tercatat.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {historyData.map((item) => {
                                            const actionColors = {
                                                create: "bg-emerald-50 text-emerald-700 border-emerald-200",
                                                update: "bg-amber-50 text-amber-700 border-amber-200",
                                                delete: "bg-red-50 text-red-700 border-red-200",
                                            };
                                            const actionLabels = {
                                                create: "TAMBAH",
                                                update: "EDIT",
                                                delete: "HAPUS",
                                            };
                                            return (
                                                <div
                                                    key={item.id}
                                                    className="border border-border rounded-xl p-4 space-y-2 bg-card hover:shadow-sm transition"
                                                >
                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-sm text-foreground">
                                                                {item.user_name}
                                                            </span>
                                                            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                                                                {item.user_role}
                                                            </span>
                                                        </div>
                                                        <span className="text-[11px] font-mono text-muted-foreground">
                                                            {item.created_at}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${actionColors[item.action] || "bg-gray-50"}`}>
                                                            {actionLabels[item.action] || item.action.toUpperCase()}
                                                        </span>
                                                        <p className="text-xs font-semibold text-gray-800">
                                                            {item.summary}
                                                        </p>
                                                    </div>

                                                    {item.details && item.details.length > 0 && (
                                                        <div className="bg-muted/40 rounded-lg p-3 border border-border/50">
                                                            <ul className="list-disc list-inside space-y-1">
                                                                {item.details.map((detail, idx) => (
                                                                    <li key={idx} className="text-xs text-muted-foreground">
                                                                        {detail}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-border flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setHistoryModalOpen(false)}
                                    className="cursor-pointer rounded-xl border border-border px-5 py-2.5 text-sm bg-white hover:bg-gray-50 transition"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
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
                onKeyDown={(e) => {
                    if (
                        type === "number" &&
                        ["-", "+", "e", "E"].includes(e.key)
                    ) {
                        e.preventDefault();
                    }
                }}
                placeholder={placeholder}
                step={type === "number" ? "any" : undefined}
                min={type === "number" ? 0 : undefined}
                className="w-full rounded-xl border border-border bg-input-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {error && (
                <span className="mt-1 block text-xs text-red-500">{error}</span>
            )}
        </label>
    );
}

// Input Rupiah: tampilan terformat "Rp 1.250.000", value yang dikirim ke form tetap angka mentah (string digit).
function CurrencyField({ label, value, onChange, error, readOnly = false, }) {
    function handleChange(e) {
    if (readOnly) return;

    const digits = e.target.value.replace(/\D/g, "");
    onChange?.(digits);
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
                    readOnly={readOnly}
                    placeholder="0"
                    className={`w-full rounded-xl border border-border py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                        readOnly ? "bg-secondary" : "bg-input-background"
                    }`}
                />
            </div>
            {error && (
                <span className="mt-1 block text-xs text-red-500">{error}</span>
            )}
        </label>
    );
}
