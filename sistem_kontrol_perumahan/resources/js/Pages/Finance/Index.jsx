import { Head, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SectionHeader from "@/Components/SectionHeader";
import KasMasukPage from "./KasMasuk/Index";
import KasKeluarPage from "./KasKeluar/Index";
import HppPerUnitPage from "./HppPerUnit/Index";
import LogKeuanganPage from "./LogKeuangan/Index";
import SpjOtomatisPage from "./SpjOtomatis/Index";

const pages = {
    "Kas Masuk": KasMasukPage,
    "Kas Keluar": KasKeluarPage,
    "HPP per Unit": HppPerUnitPage,
    "Log Masuk & Keluar": LogKeuanganPage,
    "SPJ Otomatis": SpjOtomatisPage,
};

export default function FinanceIndex(props) {
    const { page, flash = {} } = usePage().props;
    const PageComponent = pages[page];

    return (
        <AuthenticatedLayout>
            <Head title={page ? `Keuangan - ${page}` : "Keuangan Proyek"} />

            <div className="space-y-6 p-6 md:p-8 bg-slate-50 min-h-screen">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <SectionHeader
                        title={page || "Keuangan"}
                        sub={page ? `Halaman manajemen ${page.toLowerCase()} untuk proses keuangan proyek.` : "Pilih modul keuangan di menu untuk mulai mengelola data."}
                    />
                </div>

                {flash.success && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700 shadow-sm">
                        {flash.success}
                    </div>
                )}

                {PageComponent ? (
                    <PageComponent {...props} />
                ) : (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Modul <strong>{page || "keuangan"}</strong> sedang disiapkan. Konten khusus akan segera ditambahkan.
                        </p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
