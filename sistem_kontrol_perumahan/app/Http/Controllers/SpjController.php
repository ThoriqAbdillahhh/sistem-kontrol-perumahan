<?php
namespace App\Http\Controllers;
use App\Services\SpjService;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
class SpjController extends Controller
{
    public function __construct(protected SpjService $service) {}

    public function index()
    {
        $dokumen = $this->service->getDokumen();
        $summary = $this->service->getSummary($dokumen);

       return Inertia::render('Finance/SpjOtomatis', [
            'dokumen' => $dokumen->reverse()->values(),
            'summary' => $summary,
        ]);
    }

    public function export(Request $request)
    {
        $request->validate([
            'bulan' => 'required|integer|min:1|max:12',
            'tahun' => 'required|integer|min:2020|max:2100',
        ]);

        $awal = Carbon::create($request->tahun, $request->bulan, 1)->startOfMonth();
        $akhir = $awal->copy()->endOfMonth();

        $dokumen = $this->service->getDokumen($awal->toDateString(), $akhir->toDateString());
        $summary = $this->service->getSummary($dokumen);
        $saldoAwal = $this->service->getSaldoSebelum($awal->toDateString());

       $pdf = Pdf::loadView('pdf.spj-otomatis', [
            'dokumen' => $dokumen,
            'summary' => $summary,
            'periode' => $awal->translatedFormat('F Y'),
            'saldoAwal' => $saldoAwal,
        ])->setPaper('a4', 'landscape');

        return $pdf->stream('SPJ-' . $awal->format('Y-m') . '.pdf');
    }
}