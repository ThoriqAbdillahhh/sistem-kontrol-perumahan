import { Link, usePage, router } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import RoleBadge from "@/Components/RoleBadge";
import { Bell, AlertTriangle, AlertCircle, CheckCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function timeAgo(dateString) {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return "Baru saja";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} menit lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} hari lalu`;
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function NotificationIcon({ action }) {
    if (action === "boros") {
        return <AlertTriangle size={16} className="text-red-500" />;
    }
    if (action === "warning") {
        return <AlertCircle size={16} className="text-amber-500" />;
    }
    return <Bell size={16} className="text-slate-400" />;
}

function NotificationDropdown() {
    const { notifications } = usePage().props;
    const items = notifications?.items ?? [];
    const unreadCount = notifications?.unreadCount ?? 0;

    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function markRead(log) {
        if (log.read_at) return;
        router.post(route("notifications.read", log.id), {}, { preserveScroll: true });
    }

    function markAllRead() {
        router.post(route("notifications.readAll"), {}, { preserveScroll: true });
    }

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setOpen((v) => !v)}
                className="relative text-muted-foreground hover:text-foreground"
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-red-500" />
                )}
            </button>

            {open && (
                <div className="absolute right-0 z-20 mt-3 w-80 overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                        <h3 className="text-sm font-bold">Notifikasi</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                            >
                                <CheckCheck size={13} />
                                Tandai semua dibaca
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {items.length === 0 && (
                            <p className="px-4 py-8 text-center text-xs text-muted-foreground">
                                Belum ada notifikasi.
                            </p>
                        )}

                        {items.map((log) => (
                            <button
                                key={log.id}
                                onClick={() => markRead(log)}
                                className={`flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-secondary/50 ${
                                    !log.read_at ? "bg-sky-50/60" : ""
                                }`}
                            >
                                <span className="mt-0.5 shrink-0">
                                    <NotificationIcon action={log.action} />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block text-xs text-slate-700">
                                        {log.description}
                                    </span>
                                    <span className="mt-0.5 block text-[11px] text-muted-foreground">
                                        {log.user?.name ?? "Sistem"} · {timeAgo(log.created_at)}
                                    </span>
                                </span>
                                {!log.read_at && (
                                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sky-500" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;

    const role = auth.user.roles?.[0] ?? "";

    const initials = auth.user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const subtitle =
        role === "Owner"
            ? "Monitoring Eksekutif"
            : role === "Super Admin"
              ? "Administrasi Sistem Penuh"
              : "Operasional Gudang & Unit";

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="grid min-h-screen lg:grid-cols-[288px_1fr]">
                <div className="hidden lg:block">
                    <Sidebar />
                </div>

                <div className="flex min-w-0 flex-col">
                    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-border bg-white/90 px-6 backdrop-blur">
                        <div>
                            <h1 className="text-base font-extrabold leading-tight">
                                Estate Eficiency System
                            </h1>
                            <p className="text-[11px] text-muted-foreground">
                                {subtitle}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <NotificationDropdown />

                            <Link
                                href={route("profile")}
                                className="hidden items-center gap-2 rounded-xl px-2 py-1 transition hover:bg-muted sm:flex"
                            >
                                <div className="text-right">
                                    <p className="text-xs font-semibold leading-tight">
                                        {auth.user.name}
                                    </p>

                                    <RoleBadge role={role} />
                                </div>

                                <div className="grid size-9 place-items-center rounded-full bg-primary text-xs font-bold text-white">
                                    {initials}
                                </div>
                            </Link>
                        </div>
                    </header>

                    <main className="flex-1 overflow-auto p-4 md:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}