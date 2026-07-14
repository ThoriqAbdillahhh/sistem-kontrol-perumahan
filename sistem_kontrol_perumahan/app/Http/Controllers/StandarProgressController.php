<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class StandarProgressController extends Controller
{
    public function index()
    {
        return Inertia::render('StandarProgress/Index');
    }

    public function store(Request $request) {}

    public function update(Request $request, $matrix) {}

    public function destroy($matrix) {}

    public function storeDetail(Request $request, $matrix) {}

    public function updateDetail(Request $request, $detail) {}

    public function destroyDetail($detail) {}
}