<?php

namespace Modules\Front\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class TopicController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('front/topic/index');
    }
}
