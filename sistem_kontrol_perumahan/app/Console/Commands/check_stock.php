<?php
$basePath = dirname(__DIR__, 3);
require $basePath . '/vendor/autoload.php';
$app = require $basePath . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$materials = App\Models\Material::all();
foreach ($materials as $m) {
    $masuk = (float) $m->logMasuk()->sum('qty');
    $keluar = (float) $m->logKeluar()->sum('qty');
    echo $m->getAttribute('nama_material') . ': masuk=' . $masuk . ', keluar=' . $keluar . ', saldo=' . ($masuk - $keluar) . PHP_EOL;
}
