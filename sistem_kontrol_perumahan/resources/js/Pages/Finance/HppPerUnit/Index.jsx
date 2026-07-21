import TableCard from "@/Components/TableCard";

export default function HppPerUnitPage() {
    return (
        <div className="space-y-6">
            <TableCard title="Ringkasan HPP per Unit">
                <div className="space-y-4 text-sm text-slate-600">
                    <p>
                        Halaman ini akan menampilkan perhitungan Harga Pokok Produksi (HPP) per unit berdasarkan biaya material, tenaga kerja, dan biaya operasional.
                    </p>
                    <p>
                        Untuk sementara, ringkasan akan muncul di sini ketika data perhitungan tersedia.
                    </p>
                </div>
            </TableCard>

            <TableCard title="Daftar Unit HPP" action={<span className="text-xs text-muted-foreground">Belum ada data</span>}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted text-[12px] uppercase tracking-[0.15em] text-muted-foreground">
                            <tr>
                                <th className="px-3 py-3">Unit</th>
                                <th className="px-3 py-3">Total Material</th>
                                <th className="px-3 py-3">Biaya Tenaga</th>
                                <th className="px-3 py-3">Overhead</th>
                                <th className="px-3 py-3">HPP</th>
                                <th className="px-3 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={6} className="px-3 py-10 text-center text-sm text-muted-foreground">
                                    Data HPP per unit belum tersedia. Pastikan log kas dan log gudang telah terisi.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </TableCard>
        </div>
    );
}
