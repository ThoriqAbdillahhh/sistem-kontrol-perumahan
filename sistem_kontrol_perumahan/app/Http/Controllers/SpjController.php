<?php

namespace App\Http\Controllers;

use App\Services\SpjService;
use Inertia\Inertia;

class SpjController extends Controller
{
    public function __construct(protected SpjService $service) {}

    public function index()
    {
        $dokumen = $this->service->getDokumen();
        $summary = $this->service->getSummary($dokumen);

        // urutan terbaru di atas, biar enak dilihat (opsional, tinggal hapus reverse() kalau mau ascending)
        return Inertia::render('Finance/SpjOtomatis', [
            'dokumen' => $dokumen->reverse()->values(),
            'summary' => $summary,
        ]);
    }
}