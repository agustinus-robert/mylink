<?php

namespace Modules\Hotel\Controllers;

use Illuminate\Routing\Controller;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia('dashboard');
    }
}
