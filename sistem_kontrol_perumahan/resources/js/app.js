//
import React from "react";
import ReactDOM from "react-dom/client";

function App() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-10 rounded-xl shadow-lg">
                <h1 className="text-4xl font-bold text-blue-600">
                    Sistem Kontrol Perumahan
                </h1>

                <p className="mt-4 text-gray-500">
                    Laravel 13 + React 19 + Tailwind CSS
                </p>
            </div>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);