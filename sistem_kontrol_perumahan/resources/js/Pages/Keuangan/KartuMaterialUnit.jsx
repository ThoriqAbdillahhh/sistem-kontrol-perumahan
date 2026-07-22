import { useEffect, useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, PackageCheck } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// SESUAIKAN import layout di atas dengan layout yang sudah dipakai
// di dashboard Super Admin Anda (nama & lokasi file mungkin berbeda).

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function KartuMaterialUnit({ units = [], materialList = [], materialSatuan = {} }) {
  const [query, setQuery] = useState('');
  const [zone, setZone] = useState('Semua Zona');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const safeUnits = Array.isArray(units) ? units : [];
  const safeMaterialList = Array.isArray(materialList) ? materialList : [];
  const safeMaterialSatuan = materialSatuan && typeof materialSatuan === 'object' ? materialSatuan : {};

  const zones = [...new Set(safeUnits.map((u) => u.zona).filter(Boolean))];

  const rows = safeUnits.filter(
    (u) =>
      (zone === 'Semua Zona' || u.zona === zone) &&
      `${u.id} ${u.zona}`.toLowerCase().includes(query.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [query, zone, pageSize]);

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages));
  }, [totalPages]);

  const rangeStart = rows.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, rows.length);

  return (
    <AuthenticatedLayout
      header={<h2 className="text-xl font-bold">Kartu Material Unit</h2>}
    >
      <Head title="Kartu Material Unit" />

      <div className="space-y-6 p-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-[-0.02em]">
            Kartu Material per Unit
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Rekap pemakaian material aktual dari log keluar gudang
          </p>
        </div>

        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <h2 className="font-bold">Kartu Material per Unit</h2>
            <div className="flex flex-wrap gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari unit, zona..."
                className="w-36 rounded-xl border border-border bg-white px-3 text-xs outline-none focus:ring-2 focus:ring-primary/20"
              />
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="rounded-xl border border-border bg-white px-3 text-xs font-semibold"
              >
                <option>Semua Zona</option>
                {zones.map((z) => (
                  <option key={z}>{z}</option>
                ))}
              </select>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                title="Baris per halaman"
                className="rounded-xl border border-border bg-white px-3 text-xs outline-none focus:ring-2 focus:ring-primary/20"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size} / halaman
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1380px] text-sm">
              <thead className="bg-muted text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  {['Unit', 'Zona', 'Progress', ...safeMaterialList].map((h) => (
                    <th key={h} className="whitespace-nowrap px-4 py-3 text-left font-bold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length ? (
                  paginatedRows.map((unit) => (
                    <tr key={unit.id} className="border-t border-border hover:bg-muted/40">
                      <td className="px-4 py-3 font-mono text-sm font-bold text-primary">
                        {unit.id}
                      </td>
                      <td className="px-4 py-3 text-xs">Zona {unit.zona}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-muted">
                            <div
                              className="h-1.5 rounded-full bg-primary"
                              style={{ width: `${unit.progress}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs">{unit.progress}%</span>
                        </div>
                      </td>
                      {safeMaterialList.map((mat) => (
                        <td key={mat} className="px-4 py-3 font-mono text-xs">
                          {unit.usage[mat] ? `${unit.usage[mat]} ${safeMaterialSatuan[mat] || ''}` : '—'}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3 + safeMaterialList.length} className="px-5 py-14 text-center">
                      <PackageCheck size={26} className="mx-auto mb-2 text-muted-foreground/40" />
                      <p className="text-sm font-semibold text-muted-foreground">
                        Tidak ada unit pada filter ini
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {rows.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3 text-xs text-muted-foreground">
              <span>
                Menampilkan {rangeStart}–{rangeEnd} dari {rows.length} data
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
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
                  onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
                  disabled={page >= totalPages}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border disabled:opacity-40 hover:bg-secondary/50"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </AuthenticatedLayout>
  );
}
