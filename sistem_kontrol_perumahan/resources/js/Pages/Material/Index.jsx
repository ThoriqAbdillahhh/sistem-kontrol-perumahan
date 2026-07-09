import { useMemo, useState } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

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

export default function MaterialIndex({ materials, kategoriOptions, satuanOptions }) {
   const { flash, auth } = usePage().props;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // material row being edited, or null = add mode
  const [query, setQuery] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("Semua");

  const form = useForm({
    kode_material: "",
    nama_material: "",
    satuan: satuanOptions[0],
    kategori: kategoriOptions[0],
    harga: 0,
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return materials.filter((m) => {
      const matchQ =
        !q ||
        m.kode_material.toLowerCase().includes(q) ||
        m.nama_material.toLowerCase().includes(q);
      const matchK = kategoriFilter === "Semua" || m.kategori === kategoriFilter;
      return matchQ && matchK;
    });
  }, [materials, query, kategoriFilter]);

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

  function handleDelete(m) {
    if (
      window.confirm(
        `Hapus material "${m.nama_material}" (${m.kode_material})? Histori transaksi lama tidak ikut terhapus.`
      )
    ) {
      router.delete(route("material.destroy", m.id), {
        preserveScroll: true,
        onSuccess: () => {
          if (editTarget?.id === m.id) closeDrawer();
        },
      });
    }
  }

  return (
    <AuthenticatedLayout auth={usePage().props.auth}>
      <Head title="Master Material" />

      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold">Master Material</h1>
          <p className="text-sm text-muted-foreground">
            CRUD data material acuan — kode, kategori, satuan, dan harga acuan proyek.
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
                    {["Kode", "Nama Material", "Kategori", "Satuan", "Harga Acuan", "Aksi"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m) => (
                    <tr
                      key={m.id}
                      className={`border-t border-border hover:bg-secondary/50 ${
                        editTarget?.id === m.id ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-mono text-xs font-bold text-primary">
                        {m.kode_material}
                      </td>
                      <td className="px-4 py-3 font-semibold">{m.nama_material}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-md bg-muted px-2 py-0.5 text-xs">{m.kategori}</span>
                      </td>
                      <td className="px-4 py-3 text-xs">{m.satuan}</td>
                      <td className="px-4 py-3 font-mono text-xs font-semibold">
                        {formatRupiah(m.harga)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(m)}
                            className="rounded-lg border border-border px-2 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(m)}
                            className="rounded-lg border border-border px-2 py-1 text-xs text-muted-foreground hover:border-red-400 hover:text-red-500"
                          >
                            Hapus
                          </button>
                        </div>
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
    </AuthenticatedLayout>
  );
}
