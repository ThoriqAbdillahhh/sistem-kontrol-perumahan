import Sidebar from "@/Components/Sidebar";

export default function AuthenticatedLayout({ auth, children }) {
    return (
        <div className="min-h-screen bg-slate-100">

            <Sidebar auth={auth} />

            <main className="ml-72">

                <div className="border-b bg-white px-8 py-5 shadow-sm">

                    <h1 className="text-2xl font-bold text-slate-700">
                        EstateControl ERP
                    </h1>

                </div>

                <div className="p-8">

                    {children}

                </div>

            </main>

        </div>
    );
}