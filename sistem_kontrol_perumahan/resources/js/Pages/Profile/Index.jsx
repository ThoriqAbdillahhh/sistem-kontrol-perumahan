import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import {
    Pencil,
    KeyRound,
    LayoutDashboard,
    Building2,
    Boxes,
    ClipboardList,
    TrendingUp,
    Database,
    Users,
    Check,
} from "lucide-react";

export default function Index() {
    const { user } = usePage().props;

    const initials = user.name
        ?.split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const permissions = user.permissions ?? [];

    const menuIcons = {
        dashboard: <LayoutDashboard />,
        unit: <Building2 />,
        gudang: <Boxes />,
        progress: <TrendingUp />,
        standar: <ClipboardList />,
        material: <Database />,
        user: <Users />,
    };

    return (
        <AuthenticatedLayout>
            <Head title="Profil Saya" />

            <div className="space-y-6">
                {/* ================= HEADER ================= */}

                <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
                    <div className="h-36 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400" />

                    <div className="relative px-8 pb-8">
                        <div className="absolute -top-12 flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-primary text-4xl font-bold text-white shadow-lg">
                            {initials}
                        </div>

                        <div className="ml-32 flex flex-wrap items-start justify-between pt-4">
                            <div>
                                <h1 className="text-4xl font-extrabold">
                                    {user.name}
                                </h1>

                                <p className="text-lg text-slate-500">
                                    @{user.username}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <span className="rounded-full border border-orange-300 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
                                    🔑 {user.role}
                                </span>

                                <span className="rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600">
                                    {user.is_active === false
                                        ? "Non Active"
                                        : "Active"}
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-3 overflow-hidden rounded-2xl border">
                            <Stat title="Role" value={user.role} />

                            <Stat
                                title="Hak Akses"
                                value={`${permissions.length} Permission`}
                                border
                            />

                            <Stat
                                title="Login Terakhir"
                                value={user.last_login ?? "-"}
                            />
                        </div>
                    </div>
                </div>

                {/* ================= CARD ================= */}

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-3xl border bg-white p-7 shadow-sm">
                        <div className="mb-8 flex items-center justify-between">
                            <h2 className="text-3xl font-bold">
                                Informasi Akun
                            </h2>

                            <button className="flex items-center gap-2 rounded-full border px-5 py-2 font-semibold hover:bg-slate-50">
                                <Pencil size={18} />
                                Edit
                            </button>
                        </div>

                        <div className="space-y-5">
                            <Field label="Nama Lengkap" value={user.name} />

                            <Field label="Email" value={user.email} />

                            <Field label="Username" value={user.username} />

                            <div>
                                <label className="text-sm uppercase tracking-wider text-slate-500">
                                    Role
                                </label>

                                <div className="mt-2 inline-flex rounded-full border border-orange-300 bg-orange-50 px-4 py-2 font-semibold text-orange-600">
                                    🔑 {user.role}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border bg-white p-7 shadow-sm">
                        <div className="mb-8 flex items-center justify-between">
                            <h2 className="text-3xl font-bold">Keamanan</h2>

                            <button className="flex items-center gap-2 rounded-full border px-5 py-2 font-semibold hover:bg-slate-50">
                                <KeyRound size={18} />
                                Ganti Password
                            </button>
                        </div>

                        <div className="rounded-2xl border p-6">
                            <div className="flex items-center gap-5">
                                <div className="rounded-2xl bg-emerald-50 p-4">
                                    <KeyRound className="text-emerald-600" />
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold">
                                        Password
                                    </h3>

                                    <p className="text-slate-500">
                                        Password terenkripsi
                                    </p>
                                </div>

                                <div className="ml-auto text-3xl tracking-[6px]">
                                    ••••••••
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= PERMISSION ================= */}

                <div className="rounded-3xl border bg-white p-7 shadow-sm">
                    <h2 className="mb-6 text-3xl font-bold">Hak Akses</h2>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {permissions.length === 0 && (
                            <p className="text-slate-500">
                                Tidak ada permission.
                            </p>
                        )}

                        {permissions.map((permission) => (
                            <Permission
                                key={permission}
                                icon={menuIcons[permission] ?? <Check />}
                                text={permission}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Stat({ title, value, border = false }) {
    return (
        <div className={`${border ? "border-x" : ""} py-4 text-center`}>
            <p className="text-slate-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
}

function Field({ label, value }) {
    return (
        <div>
            <label className="text-sm uppercase tracking-wider text-slate-500">
                {label}
            </label>

            <div className="mt-2 rounded-2xl bg-slate-100 px-5 py-4 text-lg">
                {value}
            </div>
        </div>
    );
}

function Permission({ icon, text }) {
    return (
        <div className="flex items-center rounded-2xl border p-5">
            <div className="rounded-xl bg-sky-100 p-3 text-sky-700">{icon}</div>

            <span className="ml-4 text-lg font-medium">{text}</span>

            <Check size={20} className="ml-auto text-emerald-500" />
        </div>
    );
}
