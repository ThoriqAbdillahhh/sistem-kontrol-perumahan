{/*
  Simpan di: resources/js/Pages/Finance/Hpp/Index.jsx
  Sesuaikan path import AppLayout kalau lokasi layout kamu berbeda.
*/}
import { useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { ChevronLeft, ChevronRight, ReceiptText, TrendingUp } from "lucide-react";

const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n || 0);

function Kpi({ label, value, meta, icon, tone = "primary" }) {
  const colors = {
    primary: "text-primary bg-primary/10",
    good: "text-emerald-600 bg-emerald-50",
    warn: "text-amber-600 bg-amber-50",
    danger: "text-red-600 bg-red-50",
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <span className={`grid size-8 place-items-center rounded-full ${colors[tone]}`}>
          {icon}
        </span>
      </div>
      <p className="mt-4 font-mono text-2xl font-bold tracking-[-0.03em]">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{meta}</p>
    </div>
  );
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function Index({ rows = [], summary = {} }) {
  const { total_proyek = 0, rata_rata = 0, unit_tertinggi = null } = summary;
  const dataRows = Array.isArray(rows) ? rows : [];
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(dataRows.length / pageSize));
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return dataRows.slice(start, start + pageSize);
  }, [dataRows, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages));
  }, [totalPages]);

  const rangeStart = dataRows.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, dataRows.length);

  return (
    <AuthenticatedLayout
      header={<h2 className="text-xl font-bold">HPP per Unit</h2>}
    >
      <Head title="HPP per Unit" />

      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-[-0.02em]">
              Harga Pokok Produksi per Unit
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Akumulasi biaya material, upah, dan operasional per unit
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Kpi
            label="Unit HPP Tertinggi"
            value={unit_tertinggi ? `${unit_tertinggi.nama_unit} · ${rupiah(unit_tertinggi.total_hpp)}` : "—"}
            meta="Akumulasi biaya sampai saat ini"
            icon={<ReceiptText size={17} />}
            tone="warn"
          />
          <Kpi
            label="Rata-rata HPP Seluruh Unit"
            value={rupiah(rata_rata)}
            meta={`${rows.length} unit dalam perhitungan`}
            icon={<TrendingUp size={17} />}
          />
        </div>

        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <h2 className="font-bold">Rekap HPP per Unit</h2>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                title="Baris per halaman"
                className="rounded-xl border border-border bg-white px-3 py-2 text-xs outline-none focus:border-primary"
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
            <table className="w-full min-w-[780px] text-sm">
              <thead className="bg-muted text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  {["Unit", "Zona", "Biaya Material", "Biaya Upah", "Biaya Operasional", "Total HPP"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left font-bold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length ? (
                  paginatedRows.map((row) => (
                    <tr key={row.id} className="border-t border-border">
                      <td className="px-5 py-3 font-mono font-bold text-primary">{row.nama_unit}</td>
                      <td className="px-5 py-3 text-xs">Zona {row.zona}</td>
                      <td className="px-5 py-3 font-mono text-xs">{rupiah(row.biaya_material)}</td>
                      <td className="px-5 py-3 font-mono text-xs">{rupiah(row.biaya_upah)}</td>
                      <td className="px-5 py-3 font-mono text-xs">{rupiah(row.biaya_operasional)}</td>
                      <td className="px-5 py-3 font-mono text-xs font-bold">{rupiah(row.total_hpp)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-14 text-center text-sm font-semibold text-muted-foreground">
                      Belum ada data untuk ditampilkan
                    </td>
                  </tr>
                )}
              </tbody>
              {dataRows.length > 0 && (
                <tfoot className="border-t border-border bg-muted/70">
                  <tr>
                    <td colSpan={5} className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider">
                      Total HPP Proyek
                    </td>
                    <td className="px-5 py-3 font-mono text-sm font-extrabold">{rupiah(total_proyek)}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
          {dataRows.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3 text-xs text-muted-foreground">
              <span>
                Menampilkan {rangeStart}–{rangeEnd} dari {dataRows.length} data
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
