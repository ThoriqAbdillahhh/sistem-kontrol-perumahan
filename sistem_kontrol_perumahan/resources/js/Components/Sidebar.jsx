import { Link, usePage } from "@inertiajs/react";
import {
    Home,
    Building2,
    Boxes,
    TrendingUp,
    ClipboardList,
    Database,
    Users,
    LogOut,
} from "lucide-react";
import RoleBadge from "@/Components/RoleBadge";

export default function Sidebar() {
    const { auth } = usePage().props;
    const currentUrl = usePage().url;

    const role =
        auth.user.roles?.length > 0
            ? auth.user.roles[0].name
            : "";

    const menus = [
        {
            title: "Dashboard",
            href: route("dashboard"),
            icon: Home,
            roles: ["Super Admin", "Admin", "Owner"],
        },
        {
            title: "Mengelola Unit",
            href: "#",
            icon: Building2,
            roles: ["Super Admin", "Admin"],
        },
        {
            title: "Log Gudang",
            href: "#",
            icon: Boxes,
            roles: ["Super Admin", "Admin"],
        },
        {
            title: "Update Progress",
            href: "#",
            icon: TrendingUp,
            roles: ["Super Admin", "Admin"],
        },
        {
            title: "Standar Progres",
            href: "#",
            icon: ClipboardList,
            roles: ["Super Admin", "Admin"],
        },
        {
            title: "Master Material",
            href: "#",
            icon: Database,
            roles: ["Super Admin", "Admin"],
        },
        {
            title: "User & Role",
            href: "#",
            icon: Users,
            roles: ["Super Admin"],
        },
    ];

    const initials = auth.user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <aside className="fixed inset-y-0 left-0 z-40 flex h-screen w-72 flex-col bg-sidebar text-sidebar-foreground">
            <div className="flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-5">
                <div className="grid size-10 place-items-center rounded-xl bg-primary text-white shadow-md">
                    <Building2 size={20} />
                </div>
                <div>
                    <p className="text-sm font-bold text-white">EstateControl</p>
                    <p className="text-[11px] text-sidebar-foreground/50">Monitoring Perumahan</p>
                </div>
            </div>

            <nav className="flex-1 space-y-0.5 overflow-y-auto p-3 text-sm">
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/40">
                    Menu
                </p>

                {menus
                    .filter((menu) => menu.roles.includes(role))
                    .map((menu) => {
                        const Icon = menu.icon;
                        const isActive = currentUrl === menu.href;

                        return (
                            <Link
                                key={menu.title}
                                href={menu.href}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${isActive
                                        ? "bg-primary text-white shadow-sm"
                                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white"
                                    }`}
                            >
                                <Icon size={16} />
                                {menu.title}
                            </Link>
                        );
                    })}
            </nav>

            <div className="border-t border-sidebar-border p-4">
                <div className="flex items-center justify-between rounded-xl bg-sidebar-accent/60 px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                        <div className="grid size-8 place-items-center rounded-full bg-primary text-xs font-bold text-white">
                            {initials}
                        </div>
                        <div>
                            <p className="text-xs font-semibold leading-tight text-white">
                                {auth.user.name}
                            </p>
                            <RoleBadge role={role} />
                        </div>
                    </div>

                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="rounded-lg p-1.5 text-sidebar-foreground/50 hover:bg-red-500/20 hover:text-red-300"
                        title="Keluar"
                    >
                        <LogOut size={15} />
                    </Link>
                </div>
            </div>
        </aside>
    );
}