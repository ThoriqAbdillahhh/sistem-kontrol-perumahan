import TableCard from "@/Components/TableCard";

export default function SpjOtomatisPage() {
    return (
        <div className="space-y-6">
            <TableCard title="SPJ Otomatis">
                <div className="space-y-4 text-sm text-slate-600">
                    <p>
                        Fitur SPJ otomatis akan membantu membuat dokumen SPJ berdasarkan pengeluaran kas dan unit terkait.
                    </p>
                    <p>
                        Saat ini halaman ini masih menjadi placeholder dan akan diisi sesuai logika bisnis yang dibutuhkan.
                    </p>
                </div>
            </TableCard>

            <TableCard title="Status Proses" action={<span className="text-xs text-muted-foreground">Menunggu pengembangan</span>}>
                <div className="rounded-2xl border border-border bg-muted p-6 text-center text-sm text-muted-foreground">
                    Fungsi otomatisasi SPJ belum diaktifkan.
                </div>
            </TableCard>
        </div>
    );
}
