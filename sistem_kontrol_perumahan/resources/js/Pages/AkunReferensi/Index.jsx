import { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import ConfirmDialog from "@/Components/ConfirmDialog";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const KATEGORI_OPTIONS = [
    { value: "HPP", label: "HPP" },
    { value: "Operasional", label: "Operasional" },
];

function KategoriBadge({ kategori }) {
    const isHpp = kategori === "HPP";
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                isHpp
                    ? "bg-teal-50 text-teal-700 border-teal-200"
                    : "bg-slate-100 text-slate-600 border-slate-200"
            }`}
        >
            {kategori}
        </span>
    );
}

function AkunModal({ open, onClose, editingAkun }) {
    const isEdit = Boolean(editingAkun);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            kode_akun: editingAkun?.kode_akun ?? "",
            nama_akun: editingAkun?.nama_akun ?? "",
            kategori: editingAkun?.kategori ?? "HPP",
        });

    function handleClose() {
        reset();
        clearErrors();
        onClose();
    }

    function handleSubmit(e) {
        e.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: handleClose,
        };

        if (isEdit) {
            put(
                route("finance.akun-referensi.update", {
                    akunReferensi: editingAkun.id,
                }),
                options,
            );
        } else {
            post(route("finance.akun-referensi.store"), options);
        }
    }

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
        >
            <div
                className="absolute inset-0 bg-slate-900/40"
                onClick={handleClose}
            />

            <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl">
                <div className="flex items-start justify-between px-6 pt-6 pb-2">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            {isEdit ? "Edit Akun" : "Tambah Akun"}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Simpan akun agar tersedia pada jurnal kas keluar.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Tutup"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="px-6 pb-6 pt-3 space-y-4"
                >
                    <div>
                        <label
                            htmlFor="kode_akun"
                            className="block text-sm font-medium text-slate-700 mb-1.5"
                        >
                            Kode Akun
                        </label>
                        <input
                            id="kode_akun"
                            type="text"
                            value={data.kode_akun}
                            onChange={(e) =>
                                setData("kode_akun", e.target.value)
                            }
                            placeholder="Contoh: 6103"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                        />
                        {errors.kode_akun && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.kode_akun}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="nama_akun"
                            className="block text-sm font-medium text-slate-700 mb-1.5"
                        >
                            Nama Akun
                        </label>
                        <input
                            id="nama_akun"
                            type="text"
                            value={data.nama_akun}
                            onChange={(e) =>
                                setData("nama_akun", e.target.value)
                            }
                            placeholder="Contoh: Listrik Proyek"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                        />
                        {errors.nama_akun && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.nama_akun}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="kategori"
                            className="block text-sm font-medium text-slate-700 mb-1.5"
                        >
                            Kategori
                        </label>
                        <select
                            id="kategori"
                            value={data.kategori}
                            onChange={(e) =>
                                setData("kategori", e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                        >
                            {KATEGORI_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        {errors.kategori && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.kategori}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
                        >
                            Simpan
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function Index({ akunList = [] }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingAkun, setEditingAkun] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [akunToDelete, setAkunToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Data asli dari backend (controller AkunReferensiController@index)

    function openAdd() {
        setEditingAkun(null);
        setModalOpen(true);
    }

    function openEdit(akun) {
        setEditingAkun(akun);
        setModalOpen(true);
    }

    function openDelete(akun) {
        setAkunToDelete(akun);
        setShowDeleteConfirm(true);
    }

    function handleDeleteConfirm() {
        setDeleting(true);
        router.delete(
            route("finance.akun-referensi.destroy", {
                akunReferensi: akunToDelete.id,
            }),
            {
                preserveScroll: true,
                onFinish: () => {
                    setDeleting(false);
                    setShowDeleteConfirm(false);
                },
            },
        );
    }

    return (
        <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-slate-900">
                    Akun Referensi
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Kelola kelompok akun untuk transaksi keuangan proyek
                </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                    <h2 className="text-base font-semibold text-slate-900">
                        Daftar Akun
                    </h2>
                    <button
                        type="button"
                        onClick={openAdd}
                        className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
                    >
                        <Plus size={16} />
                        Tambah Akun
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-medium uppercase tracking-wide text-slate-400 bg-slate-50">
                                <th className="px-6 py-3">Kode Akun</th>
                                <th className="px-6 py-3">Nama Akun</th>
                                <th className="px-6 py-3">Kategori</th>
                                <th className="px-6 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {akunList.map((akun) => (
                                <tr
                                    key={akun.id}
                                    className="border-t border-slate-100 hover:bg-slate-50/60"
                                >
                                    <td className="px-6 py-4 font-medium text-teal-700">
                                        {akun.kode_akun}
                                    </td>
                                    <td className="px-6 py-4 text-slate-700">
                                        {akun.nama_akun}
                                    </td>
                                    <td className="px-6 py-4">
                                        <KategoriBadge
                                            kategori={akun.kategori}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={() => openEdit(akun)}
                                                className="text-teal-600 hover:text-teal-800"
                                                aria-label="Edit akun"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openDelete(akun)}
                                                className="text-red-500 hover:text-red-700"
                                                aria-label="Hapus akun"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AkunModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                editingAkun={editingAkun}
            />

            <ConfirmDialog
                open={showDeleteConfirm}
                title="Hapus akun ini?"
                message={
                    akunToDelete
                        ? `"${akunToDelete.nama_akun}" (${akunToDelete.kode_akun}) akan dihapus permanen dan tidak bisa dikembalikan.`
                        : "Akun ini akan dihapus permanen dan tidak bisa dikembalikan."
                }
                confirmText="Ya, Hapus"
                cancelText="Batal"
                danger
                processing={deleting}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </div>
    );
}

Index.layout = (page) => <AuthenticatedLayout children={page} />;
