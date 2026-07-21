# Copilot instructions

Project ini adalah aplikasi Laravel 13 + Inertia + React + Tailwind untuk sistem kontrol perumahan.

## Konteks domain
Fokus aplikasi ini adalah pengelolaan:
- unit
- material
- stok gudang
- progress pembangunan
- data keuangan

## Pedoman saat bekerja
- Ikuti pola aplikasi yang sudah ada: controller, request, model, route, dan page Inertia.
- Gunakan file yang sudah ada sebagai acuan sebelum membuat struktur baru.
- Jaga kompatibilitas dengan auth dan role-based access.
- Saat menambahkan fitur, periksa route di routes/web.php dan controller terkait.
- Untuk perubahan database, cek migration dan model sebelum mengubah schema.

## Validasi yang disarankan
- php artisan test
- npm run build

## Prioritas
- perubahan minimal
- aman dan reversible
- konsisten dengan kode yang sudah ada
