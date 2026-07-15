import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import { X } from "lucide-react";

export default function UpdateProfileModal({ show, onClose, user }) {
    const { data, setData, patch, processing, errors, reset, clearErrors } =
        useForm({
            name: user.name ?? "",
            username: user.username ?? "",
            email: user.email ?? "",
        });

    // Sync form values whenever modal dibuka ulang
    useEffect(() => {
        if (show) {
            setData({
                name: user.name ?? "",
                username: user.username ?? "",
                email: user.email ?? "",
            });
        }
    }, [show]);

    const submit = (e) => {
        e.preventDefault();

        patch(route("profile.update"), {
            preserveScroll: true,

            onSuccess: () => {
                clearErrors();
                onClose();
            },
        });
    };

    const closeModal = () => {
        reset();
        clearErrors();
        onClose();
    };

    return (
        <Modal show={show} onClose={closeModal}>
            <form onSubmit={submit} className="p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Edit Informasi Akun
                    </h2>

                    <button
                        type="button"
                        onClick={closeModal}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X size={18} />
                    </button>
                </div>

                <p className="mt-1 text-sm text-gray-600">
                    Perbarui nama, username, dan email akun Anda.
                </p>

                {/* Nama */}
                <div className="mt-6">
                    <InputLabel htmlFor="name" value="Nama Lengkap" />

                    <TextInput
                        id="name"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        autoComplete="name"
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                {/* Username */}
                <div className="mt-4">
                    <InputLabel htmlFor="username" value="Username" />

                    <TextInput
                        id="username"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.username}
                        onChange={(e) => setData("username", e.target.value)}
                        autoComplete="username"
                    />

                    <InputError message={errors.username} className="mt-2" />
                </div>

                {/* Email */}
                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        autoComplete="email"
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="rounded-md bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
                    >
                        Batal
                    </button>

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50 hover:bg-blue-700"
                    >
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </Modal>
    );
}
