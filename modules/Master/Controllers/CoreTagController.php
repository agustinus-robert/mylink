<?php

namespace Modules\Master\Controllers;

use Illuminate\Http\Request;
use Modules\Master\Models\CoreTag;
use Illuminate\Routing\Controller;
use Modules\Master\Requests\CoreTagRequests;
use Modules\Master\Services\CoreTagService;
use Inertia\Inertia;

class CoreTagController extends Controller
{
    public function __construct(
        protected CoreTagService $coreTagService
    ) {}

    public function index(Request $request)
    {
        $coreTag = $this->coreTagService->paginate(
            $request->only([
                'name',
                'dateFrom',
                'dateTo',
                'archived',
            ])
        );

        return Inertia::render('master/ctag/index', [
            'ctag' => $coreTag
        ]);
    }

    public function create()
    {
        return Inertia::render('master/ctag/form');
    }

    public function edit(CoreTag $core_tag)
    {
        return Inertia::render('master/ctag/form', [
            'ctag' => $core_tag
        ]);
    }

    public function store(CoreTagRequests $request)
    {
        $data = $request->validated();

        try {
            $this->coreTagService->form(null, $data);
        } catch (\Throwable $e) {
            dd($e->getMessage());
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function update(CoreTag $coreTag, CoreTagRequests $request)
    {
        $data = $request->validated();

        try {
            $this->coreTagService->form($coreTag->id, $data);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function destroy(CoreTag $coreTag)
    {
        try {
            $this->coreTagService->deletion($coreTag->id);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }
}
