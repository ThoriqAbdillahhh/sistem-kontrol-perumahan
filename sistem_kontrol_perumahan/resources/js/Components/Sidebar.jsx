import { Link } from "@inertiajs/react";
import {
    HomeIcon,
    BuildingOffice2Icon,
    CubeIcon,
    ClipboardDocumentListIcon,
    ChartBarIcon,
    UsersIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar({ auth }) {
    return (
        <aside className="fixed left-0 top-0 h-screen w-72 bg-[#0F172A] text-white">

            <div className="border-b border-slate-700 p-6">

                <h1 className="text-2xl font-bold">
                    EstateControl
                </h1>

                <p className="text-cyan-400">
                    ERP
                </p>

            </div>

            <nav className="space-y-2 p-5">

                <Link
                    href="/dashboard"
                    className="flex items-center gap-3 rounded-xl p-3 hover:bg-cyan-700"
                >
                    <HomeIcon className="h-6 w-6" />
                    Dashboard
                </Link>

                <Link
                    href="/units"
                    className="flex items-center gap-3 rounded-xl p-3 hover:bg-cyan-700"
                >
                    <BuildingOffice2Icon className="h-6 w-6" />
                    Unit
                </Link>

                <Link
                    href="/materials"
                    className="flex items-center gap-3 rounded-xl p-3 hover:bg-cyan-700"
                >
                    <CubeIcon className="h-6 w-6" />
                    Material
                </Link>

                <Link
                    href="/progress"
                    className="flex items-center gap-3 rounded-xl p-3 hover:bg-cyan-700"
                >
                    <ClipboardDocumentListIcon className="h-6 w-6" />
                    Progress
                </Link>

                <Link
                    href="/monitoring"
                    className="flex items-center gap-3 rounded-xl p-3 hover:bg-cyan-700"
                >
                    <ChartBarIcon className="h-6 w-6" />
                    Monitoring
                </Link>

                <Link
                    href="/roles"
                    className="flex items-center gap-3 rounded-xl p-3 hover:bg-cyan-700"
                >
                    <UsersIcon className="h-6 w-6" />
                    Role
                </Link>

            </nav>

            <div className="absolute bottom-0 w-full border-t border-slate-700 p-5">

                <div className="font-semibold">
                    {auth.user.name}
                </div>

                <div className="text-sm text-slate-400">
                    {auth.user.email}
                </div>

            </div>

        </aside>
    );
}