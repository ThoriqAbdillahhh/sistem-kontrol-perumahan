import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import {
    UserPlus,
    Pencil,
    Trash2,
    KeyRound,
    ShieldCheck,
    Eye,
} from "lucide-react";
import UserFormModal from "@/Components/UserFormModal";

function initials(name) {
    return name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

function RoleBadge({ role }) {
    const map = {
        "Super Admin": {
            cls: "bg-amber-50 text-amber-700 ring-amber-200",
            icon: <KeyRound size={12} />,
        },
        Admin: {
            cls: "bg-sky-50 text-sky-700 ring-sky-200",
            icon: <ShieldCheck size={12} />,
        },
        Owner: {
            cls: "bg-violet-50 text-violet-700 ring-violet-200",
            icon: <Eye size={12} />,
        },
    };
    const r = map[role] ?? {
        cls: "bg-slate-100 text-slate-600 ring-slate-200",
        icon: null,
    };

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${r.cls}`}
        >
            {r.icon}
            {role}
        </span>
    );
}

function StatusToggle({ user }) {
    const [enabled, setEnabled] = useState(user.isActive);

    // Sync ketika data user di-refresh oleh Inertia (misalnya setelah edit)
    useEffect(() => {
        setEnabled(user.isActive);
    }, [user.isActive]);

    const handleToggle = () => {
        router.patch(
            route("users.toggle", user.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setEnabled(!enabled);
                },
            },
        );
    };

    return (
        <button
            type="button"
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                enabled ? "bg-emerald-500" : "bg-slate-300"
            }`}
        >
            <span
                className={`inline-block h-5.5 w-5.5 transform rounded-full bg-white transition ${
                    enabled ? "translate-x-5" : "translate-x-0.5"
                }`}
            />
        </button>
    );
}

export default function Index({ users, roles }) {
    const { auth } = usePage().props;
    const currentUserId = auth.user.id;
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [selectedUser, setSelectedUser] = useState(null);

    const openCreate = () => {
        setModalMode("create");
        setSelectedUser(null);
        setModalOpen(true);
    };

    const openEdit = (user) => {
        setModalMode("edit");
        setSelectedUser(user);
        setModalOpen(true);
    };

    const handleDelete = (user) => {
        if (confirm(`Hapus pengguna "${user.nama}"?`)) {
            router.delete(route("users.destroy", user.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="User & Role Management" />

            <div className="space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold">
                            User & Role Management
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola akun pengguna dan hak akses sistem (Super
                            Admin only).
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        <UserPlus size={16} />
                        Tambah User
                    </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border px-5 py-4">
                        <h2 className="font-bold">
                            Daftar Pengguna ({users.length})
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-sm">
                            <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
                                <tr>
                                    {[
                                        "Nama",
                                        "Username",
                                        "Email",
                                        "Role",
                                        "Status",
                                        "Login Terakhir",
                                        "Aksi",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-3 text-left font-semibold"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr
                                        key={u.id}
                                        className="border-t border-border hover:bg-secondary/50"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                                                    {initials(u.nama)}
                                                </div>
                                                <span className="font-bold">
                                                    {u.nama}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                            {u.username}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">
                                            {u.email}
                                        </td>
                                        <td className="px-4 py-3">
                                            <RoleBadge role={u.role} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusToggle user={u} />
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                            {u.lastLogin}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {u.id !== currentUserId ? (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEdit(u)
                                                        }
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-secondary"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                ) : (
                                                    <span
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 text-muted-foreground/40"
                                                        title="Tidak bisa mengedit akun sendiri"
                                                    >
                                                        <Pencil size={14} />
                                                    </span>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(u)
                                                    }
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-red-500 hover:bg-red-50"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-8 text-center text-sm text-muted-foreground"
                                        >
                                            Belum ada pengguna.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <UserFormModal
                open={modalOpen}
                mode={modalMode}
                user={selectedUser}
                roles={roles}
                onClose={() => setModalOpen(false)}
            />
        </AuthenticatedLayout>
    );
}
