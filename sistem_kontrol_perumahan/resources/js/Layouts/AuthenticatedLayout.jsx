import { Link, usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import RoleBadge from "@/Components/RoleBadge";
import { Bell } from "lucide-react";

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
                            <button className="relative text-muted-foreground">
                                <Bell size={18} />
                                <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-red-500" />
                            </button>

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
