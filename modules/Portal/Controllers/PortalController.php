<?php

namespace Modules\Portal\Controllers;

use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class PortalController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('portal/dashboard/index');
    }
}
