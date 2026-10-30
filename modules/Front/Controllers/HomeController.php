<?php

namespace Modules\Front\Controllers;

use Illuminate\Http\Request;
use Modules\Builder\Models\Menu;
use Modules\Builder\Requests\MenuRequests;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('front/home/index');
    }
}
