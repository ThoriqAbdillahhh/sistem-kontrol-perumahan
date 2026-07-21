<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class FinanceController extends Controller
{
    public function index(string $page)
    {
        return Inertia::render('Finance/Index', [
            'page' => $page,
        ]);
    }
}
