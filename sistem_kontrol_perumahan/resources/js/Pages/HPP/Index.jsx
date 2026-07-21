{/*
  Simpan di: resources/js/Pages/Finance/Hpp/Index.jsx
  Sesuaikan path import AppLayout kalau lokasi layout kamu berbeda.
*/}
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { ReceiptText, TrendingUp } from "lucide-react";

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

export default function Index({ rows = [], summary = {} }) {
  const { total_proyek = 0, rata_rata = 0, unit_tertinggi = null } = summary;

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
                {rows.length ? (
                  rows.map((row) => (
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
              {rows.length > 0 && (
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
        </section>
      </div>
    </AuthenticatedLayout>
  );
}
