import { Head } from "@inertiajs/react";

export default function FinanceIndex({ page }) {
    return (
        <div>
            <Head title="Keuangan Proyek" />
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h1 className="text-xl font-bold">Keuangan Proyek</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Halaman placeholder untuk <strong>{page}</strong>.
                </p>
                <div className="mt-4 rounded-2xl border border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
                    Konten ini akan ditambahkan sesuai fitur Keuangan Proyek.
                </div>
            </div>
        </div>
    );
}
