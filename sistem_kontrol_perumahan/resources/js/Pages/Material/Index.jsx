import { useEffect, useMemo, useState } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Pencil, Trash2, ArrowUp, ArrowDown, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

function formatRupiah(n) {
  const num = Number(n) || 0;
  return "Rp " + Math.round(num).toLocaleString("id-ID");
}

function nextMaterialCode(materials) {
  const nums = materials
    .map((m) => /^MT(\d+)$/.exec(m.kode_material))
    .filter(Boolean)
    .map((m) => parseInt(m[1], 10));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return "MT" + String(next).padStart(3, "0");
}

function highlightMatch(text, keyword) {
    if (!keyword.trim()) return text;

    const regex = new RegExp(`(${keyword})`, "ig");
    const parts = text.split(regex);

    return parts.map((part, index) =>
        regex.test(part) ? (
            <mark
                key={index}
                className="rounded bg-yellow-200 px-0.5 text-black"
            >
                {part}
            </mark>
        ) : (
            part
        )
    );
}

// Kolom yang bisa disortir. key = null artinya kolom tidak bisa diklik.
const TABLE_COLUMNS = [
  { label: "Kode", key: "kode_material" },
  { label: "Nama Material", key: "nama_material" },
  { label: "Kategori", key: null },
  { label: "Satuan", key: null },
  { label: "Harga Acuan", key: "harga" },
  { label: "Aksi", key: null, align: "right" },
];

// Pilihan jumlah baris per halaman
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function MaterialIndex({ materials, kategoriOptions, satuanOptions }) {
   const { flash, auth } = usePage().props;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // material row being edited, or null = add mode
  const [deletingMaterial, setDeletingMaterial] = useState(null);
  const [query, setQuery] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("Semua");
  const [sortBy, setSortBy] = useState(null); // "kode_material" | "nama_material" | "harga" | null
  const [sortDir, setSortDir] = useState("asc"); // "asc" | "desc"
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const form = useForm({
    kode_material: "",
    nama_material: "",
    satuan: satuanOptions[0],
    kategori: kategoriOptions[0],
    harga: 0,
  });

  function toggleSort(key) {
    if (sortBy === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      // default arah: harga dari mahal ke murah, teks dari A ke Z
      setSortDir(key === "harga" ? "desc" : "asc");
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = materials.filter((m) => {
      const matchQ =
        !q ||
        m.kode_material.toLowerCase().includes(q) ||
        m.nama_material.toLowerCase().includes(q);
      const matchK = kategoriFilter === "Semua" || m.kategori === kategoriFilter;
      return matchQ && matchK;
    });

    if (sortBy) {
      result = [...result].sort((a, b) => {
        let cmp = 0;
        if (sortBy === "harga") {
          cmp = Number(a.harga) - Number(b.harga);
        } else {
          // "kode_material" & "nama_material": urut abjad + angka (natural sort)
          cmp = String(a[sortBy]).localeCompare(String(b[sortBy]), "id", {
            numeric: true,
            sensitivity: "base",
          });
        }
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [materials, query, kategoriFilter, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Balik ke halaman 1 setiap kali search/filter/sort/pageSize berubah
  useEffect(() => {
    setPage(1);
  }, [query, kategoriFilter, sortBy, sortDir, pageSize]);

  // Kalau data berkurang (misal habis delete) dan halaman aktif jadi kelebihan, tarik mundur
  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, filtered.length);

  function openAdd() {
    setEditTarget(null);
    form.reset();
    form.clearErrors();
    form.setData({
      kode_material: nextMaterialCode(materials),
      nama_material: "",
      satuan: satuanOptions[0],
      kategori: kategoriOptions[0],
      harga: 0,
    });
    setDrawerOpen(true);
  }

  function openEdit(m) {
    setEditTarget(m);
    form.clearErrors();
    form.setData({
      kode_material: m.kode_material,
      nama_material: m.nama_material,
      satuan: m.satuan,
      kategori: m.kategori,
      harga: m.harga,
    });
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setEditTarget(null);
    form.clearErrors();
  }

  function handleSave(e) {
    e.preventDefault();
    if (editTarget) {
      form.put(route("material.update", editTarget.id), {
        preserveScroll: true,
        onSuccess: () => closeDrawer(),
      });
    } else {
      form.post(route("material.store"), {
        preserveScroll: true,
        onSuccess: () => closeDrawer(),
      });
    }
  }

  function handleDelete(material) {
    setDeletingMaterial(material);
}

function confirmDelete() {
    if (!deletingMaterial) return;

    router.delete(route("material.destroy", deletingMaterial.id), {
        preserveScroll: true,
        onSuccess: () => {
            if (editTarget?.id === deletingMaterial.id) {
                closeDrawer();
            }
            setDeletingMaterial(null);
        },
    });
}

  return (
    <AuthenticatedLayout auth={usePage().props.auth}>
      <Head title="Master Material" />

      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold">Master Material</h1>
          <p className="text-sm text-muted-foreground">
          </p>
        </div>

        {flash?.success && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700">
            {flash.success}
          </div>
        )}

        <div className={`grid gap-5 ${drawerOpen ? "xl:grid-cols-[1fr_380px]" : ""}`}>
          {/* ── Table ───────────────────────────────────────────── */}
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-bold">
                Daftar Material ({filtered.length}
                {filtered.length !== materials.length ? ` / ${materials.length}` : ""})
              </h2>
              <div className="flex flex-wrap gap-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari kode atau nama..."
                  className="rounded-xl border border-border bg-white px-3 py-2 text-xs outline-none focus:border-primary"
                />
                <select
                  value={kategoriFilter}
                  onChange={(e) => setKategoriFilter(e.target.value)}
                  className="rounded-xl border border-border bg-white px-3 py-2 text-xs outline-none focus:border-primary"
                >
                  <option>Semua</option>
                  {kategoriOptions.map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  title="Baris per halaman"
                  className="rounded-xl border border-border bg-white px-3 py-2 text-xs outline-none focus:border-primary"
                >
                  {PAGE_SIZE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n} / halaman
                    </option>
                  ))}
                </select>
                <button
                  onClick={openAdd}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white"
                >
                  + Tambah Material
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[660px] text-sm">
                <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                {TABLE_COLUMNS.map((col) => (
                    <th
                        key={col.label}
                        onClick={col.key ? () => toggleSort(col.key) : undefined}
                        className={`px-4 py-3 font-semibold ${
                        col.align === "right" ? "text-right" : "text-left"
                        } ${col.key ? "cursor-pointer select-none hover:text-foreground" : ""}`}
                >
                    <span
                    className={`inline-flex items-center gap-1 ${
                        col.align === "right" ? "justify-end w-full" : ""
                    }`}
                    >
                    {col.label}
                    {col.key &&
                        (sortBy === col.key ? (
                        sortDir === "asc" ? (
                            <ArrowUp size={12} />
                        ) : (
                            <ArrowDown size={12} />
                        )
                        ) : (
                        <ArrowUpDown size={12} className="opacity-40" />
                        ))}
                    </span>
                </th>
                ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((m) => (
                    <tr
                      key={m.id}
                      className={`border-t border-border hover:bg-secondary/50 ${
                        editTarget?.id === m.id ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-mono text-xs font-bold text-primary">
                        {highlightMatch(m.kode_material, query)}
                    </td>
                      <td className="px-4 py-3 font-semibold">
                    {highlightMatch(m.nama_material, query)}
                </td>
                      <td className="px-4 py-3">
                        <span className="rounded-md bg-muted px-2 py-0.5 text-xs">{m.kategori}</span>
                      </td>
                      <td className="px-4 py-3 text-xs">{m.satuan}</td>
                      <td className="px-4 py-3 font-mono text-xs font-semibold">
                        {formatRupiah(m.harga)}
                      </td>
                                        <td className="px-4 py-3 text-right">
                        <button
                            onClick={() => openEdit(m)}
                            title="Edit"
                            className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-sky-600 hover:bg-sky-50 transition-colors"
                        >
                            <Pencil size={16} />
                        </button>

                        <button
                            onClick={() => handleDelete(m)}
                            title="Hapus"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                        Tidak ada material yang cocok.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Pagination footer ──────────────────────────────── */}
            {filtered.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>
                  Menampilkan {rangeStart}–{rangeEnd} dari {filtered.length} data
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border disabled:opacity-40 hover:bg-secondary/50"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="font-semibold text-foreground">
                    Halaman {page} / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border disabled:opacity-40 hover:bg-secondary/50"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Drawer: Add / Edit form ─────────────────────────── */}
          {drawerOpen && (
            <aside className="h-fit rounded-2xl border border-border bg-white p-6 shadow-lg">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-bold">{editTarget ? "Edit Material" : "Tambah Material Baru"}</h3>
                <button
                  onClick={closeDrawer}
                  className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Kode Material
                  </span>
                  <input
                    value={form.data.kode_material}
                    onChange={(e) => form.setData("kode_material", e.target.value)}
                    placeholder="MT061"
                    className="w-full rounded-xl border border-border bg-input-background px-3 py-2.5 text-sm font-mono outline-none focus:border-primary"
                  />
                  {form.errors.kode_material && (
                    <span className="mt-1 block text-xs text-red-600">{form.errors.kode_material}</span>
                  )}
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Nama Material
                  </span>
                  <input
                    value={form.data.nama_material}
                    onChange={(e) => form.setData("nama_material", e.target.value)}
                    placeholder="Nama material"
                    className="w-full rounded-xl border border-border bg-input-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                  {form.errors.nama_material && (
                    <span className="mt-1 block text-xs text-red-600">{form.errors.nama_material}</span>
                  )}
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Kategori
                    </span>
                    <select
                      value={form.data.kategori}
                      onChange={(e) => form.setData("kategori", e.target.value)}
                      className="w-full rounded-xl border border-border bg-input-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                    >
                      {kategoriOptions.map((k) => (
                        <option key={k}>{k}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Satuan
                    </span>
                    <select
                      value={form.data.satuan}
                      onChange={(e) => form.setData("satuan", e.target.value)}
                      className="w-full rounded-xl border border-border bg-input-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                    >
                      {satuanOptions.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Harga Acuan (Rp)
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={form.data.harga}
                    onChange={(e) => form.setData("harga", e.target.value)}
                    className="w-full rounded-xl border border-border bg-input-background px-3 py-2.5 text-sm font-mono outline-none focus:border-primary"
                  />
                  {form.errors.harga && (
                    <span className="mt-1 block text-xs text-red-600">{form.errors.harga}</span>
                  )}
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {formatRupiah(form.data.harga)}
                  </span>
                </label>

                <div className="mt-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={form.processing}
                    className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-white disabled:opacity-60"
                  >
                    {form.processing ? "Menyimpan..." : "Simpan"}
                  </button>
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="rounded-xl border border-border px-4 py-3 text-sm"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </aside>
          )}
        </div>
      </div>

      {deletingMaterial && (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
        onClick={() => setDeletingMaterial(null)}
    >
        <div
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
        >
            <h2 className="mb-2 text-lg font-semibold text-slate-900">
                Hapus Material?
            </h2>

            <p className="mb-6 text-sm text-slate-500">
                Material{" "}
                <span className="font-medium text-slate-700">
                    {deletingMaterial.nama_material}
                </span>{" "}
                ({deletingMaterial.kode_material}) akan dihapus permanen.
                Histori transaksi lama tidak ikut terhapus.
            </p>

            <div className="flex justify-end gap-2">
                <button
                    onClick={() => setDeletingMaterial(null)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
                >
                    Batal
                </button>

                <button
                    onClick={confirmDelete}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                    Ya, Hapus
                </button>
            </div>
        </div>
    </div>
)}
    </AuthenticatedLayout>
  );
}