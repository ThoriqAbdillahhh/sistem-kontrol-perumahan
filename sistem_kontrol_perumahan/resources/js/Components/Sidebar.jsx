    import { Link, router, usePage } from "@inertiajs/react";
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
    import ConfirmDialog from "@/Components/ConfirmDialog";
    import { useState } from "react";
    import logo from "@/assets/tabarok.jpg";    

export default function Sidebar() {
    const { auth } = usePage().props;
    const role = auth.user.roles?.[0] ?? "";
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = () => {
        setLoggingOut(true);
        router.post(
            route("logout"),
            {},
            {
                onFinish: () => setLoggingOut(false),
            },
        );
    };

    const menus = [
        {
            title: "Dashboard",
            route: "dashboard",
            icon: Home,
            roles: ["Super Admin", "Admin", "Owner", "Admin Keuangan"],
        },
        {
            title: "Mengelola Unit",
            route: "unit.index",
            icon: Building2,
            roles: ["Super Admin", "Admin"],
        },
        {
            title: "Log Gudang",
            route: "gudang.index",
            icon: Boxes,
            roles: ["Super Admin", "Admin"],
        },
        {
            title: "Update Progress",
            route: "progress.index",
            icon: TrendingUp,
            roles: ["Super Admin", "Admin"],
        },
        {
            title: "Standar Progress",
            route: "standar.index",
            icon: ClipboardList,
            roles: ["Super Admin", "Admin"],
        },
        {
            title: "Master Material",
            route: "material.index",
            href: route("material.index"),
            icon: Database,
            roles: ["Super Admin", "Admin"],
        },
        {
            title: "User & Role",
            route: "users.index",
            icon: Users,
            roles: ["Super Admin"],
        },
    ];

    const financeMenus = [  
        {
            title: "Kartu Material Unit",
            route: "finance.kartu-material-unit",
            icon: ClipboardList,
            roles: ["Super Admin", "Admin"],
        },
        {
            title: "HPP per Unit",
            route: "finance.hpp-per-unit",
            icon: Database,
            roles: ["Super Admin", "Admin Keuangan"],
        },
       {
            title: "Log Masuk & Keluar",
            route: "gudang.index",
            icon: Boxes,
            roles: ["Admin Keuangan"],
        },
        {
            title: "Akun Referensi",
            route: "finance.akun-referensi",
            icon: Users,
            roles: ["Super Admin", "Admin Keuangan"],
        },
        {
            title: "Kas Masuk",
            route: "finance.kas-masuk",
            icon: Home,
            roles: ["Super Admin", "Admin Keuangan"],
        },
        {
            title: "Kas Keluar",
            route: "finance.kas-keluar",
            icon: Home,
            roles: ["Super Admin", "Admin Keuangan"],
        },
        {
            title: "SPJ Otomatis",
            route: "finance.spj-otomatis",
            icon: TrendingUp,
            roles: ["Super Admin", "Admin Keuangan"],
        },
    ];

    const mainMenuItems = menus.filter((menu) => menu.roles.includes(role));
    const financeMenuItems = financeMenus.filter((menu) => menu.roles.includes(role));

    const initials = auth.user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <aside className="fixed inset-y-0 left-0 z-40 fixed inset-y-0 left-0 z-40 flex h-screen w-72 flex-col bg-sidebar text-sidebar-foreground">
            <div className="flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-5">
                <div className="grid size-10 place-items-center overflow-hidden rounded-xl">
                    <img
                        src={logo}
                        alt="Microdata"
                        className="h-full w-full object-contain"
                    />
                </div>
                
            </div>

            <nav className="flex-1 space-y-0.5 overflow-y-auto scrollbar-hide p-3 text-sm">
                <p className="mb-4 px-3 text-[11px] font-bold uppercase tracking-[0.25em] text-sidebar-foreground/40">
                    MENU
                </p>

                {mainMenuItems.map((menu) => {
                    const Icon = menu.icon;
                    const routeExists = route().has(menu.route);
                    const href = routeExists ? route(menu.route) : "#";
                    const isActive =
                        routeExists && route().current(menu.route);

                    return (
                        <Link
                            key={menu.title}
                            href={href}
                            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 transition-all
                                ${
                                    isActive
                                        ? "bg-primary text-white shadow-md"
                                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white"
                                }
                                ${!routeExists ? "opacity-40 cursor-not-allowed" : ""}`}
                        >
                            <Icon size={16} />
                            {menu.title}
                        </Link>
                    );
                })}

                {financeMenuItems.length > 0 && (
                    <>
                        
                        {financeMenuItems.map((menu) => {
                            const Icon = menu.icon;
                            const routeExists = route().has(menu.route);
                            const href = routeExists ? route(menu.route) : "#";
                            const isActive =
                                routeExists && route().current(menu.route);

                            return (
                                <Link
                                    key={menu.title}
                                    href={href}
                                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 transition-all
                                        ${
                                            isActive
                                                ? "bg-primary text-white shadow-md"
                                                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white"
                                        }
                                        ${!routeExists ? "opacity-40 cursor-not-allowed" : ""}`}
                                >
                                    <Icon size={16} />
                                    {menu.title}
                                </Link>
                            );
                        })}
                    </>
                )}
            </nav>

            <div className="mt-auto border-t border-sidebar-border p-4">
                <div className="flex items-center justify-between rounded-xl bg-sidebar-accent/60 px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                        <div className="grid size-8 place-items-center rounded-full bg-primary text-xs font-bold text-white">
                            {initials}
                        </div>
                        <div>
                            <p className="text-xs font-semibold leading-tight text-white">
                                {auth.user.name}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowLogoutConfirm(true)}
                        className="cursor-pointer rounded-lg p-1.5 text-sidebar-foreground/50 hover:bg-red-500/20 hover:text-red-300"
                        title="Keluar"
                    >
                        <LogOut size={15} />
                    </button>
                </div>
            </div>
            <ConfirmDialog
                open={showLogoutConfirm}
                title="Keluar dari akun?"
                message="Anda perlu login kembali untuk mengakses sistem."
                confirmText="Ya, Keluar"
                cancelText="Batal"
                danger
                processing={loggingOut}
                onConfirm={handleLogout}
                onCancel={() => setShowLogoutConfirm(false)}
            />
        </aside>
    );
}