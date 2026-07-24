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
    ChevronLeft,
    PanelLeft,
    ChevronDown,
    Briefcase,
    Landmark,
    Circle,
} from "lucide-react";
import RoleBadge from "@/Components/RoleBadge";
import ConfirmDialog from "@/Components/ConfirmDialog";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import logo from "@/assets/tabarok.jpg";

function MenuItem({ menu, collapsed, openSubMenus = {}, toggleSubMenu = () => {} }) {
    const Icon = menu.icon;
    const routeExists = route().has(menu.route);
    const href = routeExists ? route(menu.route) : "#";
    const isActive = routeExists && route().current(menu.route);
    const hasChildren = menu.children && menu.children.length > 0;
    const isSubMenuOpen = openSubMenus[menu.key];

    const isChildActive = hasChildren && menu.children.some(child => route().has(child.route) && route().current(child.route));
    const isCurrentlyActive = isActive || isChildActive;

    if (hasChildren) {
        return (
            <div className="space-y-0.5">
                <button
                    onClick={(e) => toggleSubMenu(menu.key, e)}
                    title={collapsed ? menu.title : undefined}
                    className={`flex h-11 w-full items-center justify-between rounded-2xl px-4 transition-all
                        ${isCurrentlyActive
                            ? "bg-primary text-white shadow-md"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white"
                        }`}
                >
                    <div className="flex items-center gap-3 truncate">
                        <Icon size={16} className="shrink-0" />
                        {!collapsed && <span className="truncate">{menu.title}</span>}
                    </div>
                    {!collapsed && (
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isSubMenuOpen ? "rotate-180" : ""}`} />
                    )}
                </button>
                
                {!collapsed && isSubMenuOpen && (
                    <div className="mt-1 space-y-1 pl-9 pr-2">
                        {menu.children.map(child => {
                            const childRouteExists = route().has(child.route);
                            const childHref = childRouteExists ? route(child.route) : "#";
                            const isChildCurrent = childRouteExists && route().current(child.route);
                            
                            return (
                                <Link
                                    key={child.key}
                                    href={childHref}
                                    className={`flex h-9 w-full items-center gap-3 rounded-xl px-3 transition-all text-sm
                                        ${isChildCurrent
                                            ? "bg-primary/20 text-white font-medium"
                                            : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-white"
                                        }
                                        ${!childRouteExists ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    <Circle size={8} className={isChildCurrent ? "fill-white" : ""} />
                                    <span className="truncate">{child.title}</span>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link
            href={href}
            title={collapsed ? menu.title : undefined}
            className={`flex h-11 w-full items-center gap-3 rounded-2xl px-4 transition-all
                ${isActive
                    ? "bg-primary text-white shadow-md"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white"
                }
                ${!routeExists ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            <Icon size={16} className="shrink-0" />
            {!collapsed && <span className="truncate">{menu.title}</span>}
        </Link>
    );
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onCloseMobile }) {
    const { auth } = usePage().props;
    const role = auth.user.roles?.[0] ?? "";
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const accountMenuRef = useRef(null);

    const [openGroups, setOpenGroups] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("sidebar-groups")) || { operasional: true, keuangan: true };
        } catch {
            return { operasional: true, keuangan: true };
        }
    });

    const [openSubMenus, setOpenSubMenus] = useState(() => {
         try {
             return JSON.parse(localStorage.getItem("sidebar-submenus")) || {};
         } catch {
             return {};
         }
    });

    const toggleGroup = (key) => {
        setOpenGroups((prev) => {
            const next = { ...prev, [key]: !prev[key] };
            localStorage.setItem("sidebar-groups", JSON.stringify(next));
            return next;
        });
    };

    const toggleSubMenu = (key, e) => {
        e.preventDefault();
        setOpenSubMenus((prev) => {
            const next = { ...prev, [key]: !prev[key] };
            localStorage.setItem("sidebar-submenus", JSON.stringify(next));
            return next;
        });
    };

    useEffect(() => {
        function handleClickOutside(e) {
            if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
                setShowAccountMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Buat map dari menuOverrides: { menu_key: boolean }
    const overridesMap = Object.fromEntries(
        (auth.user.menuOverrides ?? []).map(({ menu_key, visible }) => [menu_key, visible])
    );

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

    const standaloneMenus = [
        {
            key: "dashboard",
            title: "Dashboard",
            route: "dashboard",
            icon: Home,
            roles: ["Super Admin", "Admin", "Owner", "Admin Keuangan"],
        }
    ];

    const menuGroups = [
        {
            key: "operasional",
            label: "Operasional",
            icon: Briefcase,
            items: [
                {
                    key: "unit.index",
                    title: "Mengelola Unit",
                    route: "unit.index",
                    icon: Building2,
                    roles: ["Super Admin", "Admin"],
                },
                {
                    key: "gudang.index",
                    title: "Log Gudang",
                    route: "gudang.index",
                    icon: Boxes,
                    roles: ["Super Admin", "Admin", "Admin Keuangan"],
                },
                {
                    key: "progress.index",
                    title: "Update Progress",
                    route: "progress.index",
                    icon: TrendingUp,
                    roles: ["Super Admin", "Admin"],
                },
                {
                    key: "standar.index",
                    title: "Standar Progress",
                    route: "standar.index",
                    icon: ClipboardList,
                    roles: ["Super Admin", "Admin"],
                },
                {
                    key: "material.index",
                    title: "Master Material",
                    route: "material.index",
                    icon: Database,
                    roles: ["Super Admin", "Admin"],
                },
                {
                    key: "finance.kartu-material-unit",
                    title: "Kartu Material Unit",
                    route: "finance.kartu-material-unit",
                    icon: ClipboardList,
                    roles: ["Super Admin", "Admin"],
                },
            ]
        },
        {
            key: "keuangan",
            label: "Keuangan",
            icon: Landmark,
            items: [
                {
                    key: "finance.hpp-per-unit",
                    title: "HPP per Unit",
                    route: "finance.hpp-per-unit",
                    icon: Database,
                    roles: ["Super Admin", "Admin Keuangan"],
                },
                {
                    key: "finance.akun-referensi",
                    title: "Akun Referensi",
                    route: "finance.akun-referensi",
                    icon: Users,
                    roles: ["Super Admin", "Admin Keuangan"],
                },
                {
                    key: "finance.kas-masuk",
                    title: "Kas Masuk",
                    route: "finance.kas-masuk",
                    icon: Home,
                    roles: ["Super Admin", "Admin Keuangan"],
                },
                {
                    key: "finance.kas-keluar",
                    title: "Kas Keluar",
                    route: "finance.kas-keluar",
                    icon: Home,
                    roles: ["Super Admin", "Admin Keuangan"],
                },
                {
                    key: "finance.spj-otomatis",
                    title: "SPJ Otomatis",
                    route: "finance.spj-otomatis",
                    icon: TrendingUp,
                    roles: ["Super Admin", "Admin Keuangan"],
                    children: [
                        { key: "finance.neraca", title: "Neraca", route: "finance.neraca" },
                        { key: "finance.laba-rugi", title: "Laba Rugi", route: "finance.laba-rugi" },
                        { key: "finance.kas-flow", title: "Kas Flow", route: "finance.kas-flow" },
                    ]
                },
            ]
        }
    ];

    const bottomMenus = [
        {
            key: "users.index",
            title: "User & Role",
            route: "users.index",
            icon: Users,
            roles: ["Super Admin"],
        }
    ];

    const isMenuVisible = (menu) => {
        const override = overridesMap[menu.key];
        if (override === true) return true;
        if (override === false) return false;
        return menu.roles.includes(role);
    };

    const visibleStandalone = standaloneMenus.filter(isMenuVisible);
    const visibleGroups = menuGroups.map(group => {
        const visibleItems = group.items.filter(isMenuVisible);
        return { ...group, items: visibleItems };
    }).filter(group => group.items.length > 0);
    const visibleBottom = bottomMenus.filter(isMenuVisible);

    const initials = auth.user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <aside className={`group fixed inset-y-0 left-0 z-40 flex h-screen w-72 flex-col bg-sidebar text-sidebar-foreground transition-[width,transform] duration-200 ${collapsed ? "lg:w-20" : "lg:w-72"} ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
            <div className="relative flex h-16 shrink-0 items-center justify-between gap-3 border-b border-sidebar-border px-4">
                <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl">
                    <img
                        src={logo}
                        alt="Microdata"
                        className="h-full w-full object-contain"
                    />
                </div>

               <button
                    type="button"
                    onClick={onToggle}
                    title={collapsed ? "Buka sidebar" : "Tutup sidebar"}
                    className={`hidden lg:flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-sidebar-border bg-sidebar-accent text-sidebar-foreground shadow-md transition-all duration-150 hover:bg-accent hover:text-accent-foreground hover:border-accent ${collapsed
                            ? "absolute -right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
                            : ""
                        }`}
                >
                    <PanelLeft size={13} />
                </button>
            </div>

            <nav className="flex-1 space-y-0.5 overflow-y-auto scrollbar-hide p-3 text-sm">


                <div className="space-y-1">
                    {visibleStandalone.map((menu) => (
                        <MenuItem key={menu.key} menu={menu} collapsed={collapsed} />
                    ))}
                </div>

                {visibleGroups.map((group) => (
                    <div key={group.key} className="mt-4 space-y-1">
                        {!collapsed && (
                            <button
                                type="button"
                                onClick={() => toggleGroup(group.key)}
                                className="flex w-full items-center justify-between px-4 py-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 transition-colors hover:text-sidebar-foreground"
                            >
                                <div className="flex items-center gap-2">
                                    <group.icon size={14} />
                                    <span>{group.label}</span>
                                </div>
                                <ChevronDown
                                    size={14}
                                    className={`transition-transform duration-200 ${
                                        openGroups[group.key] ? "rotate-180" : ""
                                    }`}
                                />
                            </button>
                        )}
                        
                        {(openGroups[group.key] || collapsed) && (
                            <div className="space-y-0.5">
                                {group.items.map((menu) => (
                                    <MenuItem 
                                        key={menu.key} 
                                        menu={menu} 
                                        collapsed={collapsed}
                                        openSubMenus={openSubMenus}
                                        toggleSubMenu={toggleSubMenu}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                
                {visibleBottom.length > 0 && (
                    <div className="mt-4 space-y-1 pt-4 border-t border-sidebar-border/50">
                        {visibleBottom.map((menu) => (
                            <MenuItem key={menu.key} menu={menu} collapsed={collapsed} />
                        ))}
                    </div>
                )}
            </nav>

           <div className="relative mt-auto border-t border-sidebar-border p-4" ref={accountMenuRef}>
                <div className="flex items-center justify-between rounded-xl bg-sidebar-accent/60 px-3 py-2.5">
                    <button
                        type="button"
                        onClick={() => collapsed && setShowAccountMenu((v) => !v)}
                        className={`flex items-center gap-2.5 ${collapsed ? "cursor-pointer" : ""}`}
                    >
                        <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-white">
                            {initials}
                        </div>
                        {!collapsed && (
                            <div>
                                <p className="text-xs font-semibold leading-tight text-white">
                                    {auth.user.name}
                                </p>
                            </div>
                        )}
                    </button>

                    {!collapsed && (
                        <button
                            type="button"
                            onClick={() => setShowLogoutConfirm(true)}
                            className="cursor-pointer rounded-lg p-1.5 text-sidebar-foreground/50 hover:bg-red-500/20 hover:text-red-300"
                            title="Keluar"
                        >
                            <LogOut size={15} />
                        </button>
                    )}
                </div>

                {collapsed && showAccountMenu && (
                    <div className="absolute bottom-full left-4 z-50 mb-2 w-44 overflow-hidden rounded-xl border border-sidebar-border bg-sidebar shadow-xl">
                        <div className="border-b border-sidebar-border px-3 py-2">
                            <p className="truncate text-xs font-semibold text-white">
                                {auth.user.name}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setShowAccountMenu(false);
                                setShowLogoutConfirm(true);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs text-sidebar-foreground/80 hover:bg-red-500/20 hover:text-red-300"
                        >
                            <LogOut size={14} />
                            Keluar
                        </button>
                    </div>
                )}
            </div>
            {createPortal(
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
                />,
                document.body
            )}
        </aside>
    );
}