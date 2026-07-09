import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard({ auth }) {

    return (

        <AuthenticatedLayout auth={auth}>

            <Head title="Dashboard" />

            <div className="rounded-2xl bg-white p-8 shadow">

                <h1 className="text-3xl font-bold">

                    Selamat Datang

                </h1>

                <p className="mt-3 text-slate-500">

                    Halo, {auth.user.name}

                </p>

            </div>

        </AuthenticatedLayout>

    );

}