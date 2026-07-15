import { useState } from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import { X } from "lucide-react";

export default function UpdatePasswordModal({ show, onClose }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, put, processing, errors, reset, clearErrors } =
        useForm({
            current_password: "",
            password: "",
            password_confirmation: "",
        });

    const submit = (e) => {
        e.preventDefault();

        put(route("password.update"), {
            preserveScroll: true,

            onSuccess: () => {
                reset();
                clearErrors();
                onClose();
            },

            onError: () => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                }
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
                        Ganti Password
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
                    Pastikan password baru menggunakan kombinasi yang aman.
                </p>

                <div className="mt-6">
                    <InputLabel
                        htmlFor="current_password"
                        value="Password Lama"
                    />

                    <TextInput
                        id="current_password"
                        type={showPassword ? "text" : "password"}
                        className="mt-1 block w-full"
                        value={data.current_password}
                        onChange={(e) =>
                            setData("current_password", e.target.value)
                        }
                    />

                    <InputError
                        message={errors.current_password}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password Baru" />

                    <TextInput
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="mt-1 block w-full"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi Password Baru"
                    />

                    <TextInput
                        id="password_confirmation"
                        type={showPassword ? "text" : "password"}
                        className="mt-1 block w-full"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={(e) => setShowPassword(e.target.checked)}
                        />

                        <span className="text-sm text-gray-600">
                            Tampilkan password
                        </span>
                    </label>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="rounded-md bg-gray-200 px-4 py-2 text-sm"
                    >
                        Batal
                    </button>

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
                    >
                        Simpan Password
                    </button>
                </div>
            </form>
        </Modal>
    );
}
