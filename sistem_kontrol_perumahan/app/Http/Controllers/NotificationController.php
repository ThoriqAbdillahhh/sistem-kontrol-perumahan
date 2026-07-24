<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;

class NotificationController extends Controller
{
    public function read(ActivityLog $activityLog)
    {
        if (! $activityLog->read_at) {
            $activityLog->update(['read_at' => now()]);
        }

        return back();
    }

    public function readAll()
    {
        ActivityLog::whereNull('read_at')->update(['read_at' => now()]);

        return back();
    }
}