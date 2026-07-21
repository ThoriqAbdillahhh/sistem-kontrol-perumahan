import TableCard from "@/Components/TableCard";

export default function LogKeuanganPage() {
    return (
        <div className="space-y-6">
            <TableCard title="Log Masuk & Keluar">
                <div className="space-y-4 text-sm text-slate-600">
                    <p>
                        Modul ini akan menampilkan riwayat mutasi kas masuk dan kas keluar secara bersamaan.
                    </p>
                    <p>
                        Gunakan halaman ini untuk memonitor semua aktivitas keuangan dalam satu tampilan.
                    </p>
                </div>
            </TableCard>

            <TableCard title="Riwayat Keuangan" action={<span className="text-xs text-muted-foreground">Fitur segera hadir</span>}>
                <div className="rounded-2xl border border-border bg-muted p-6 text-center text-sm text-muted-foreground">
                    Data log keuangan belum tersedia pada versi ini.
                </div>
            </TableCard>
        </div>
    );
}
