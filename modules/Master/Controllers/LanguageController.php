<?php

namespace Modules\Master\Controllers;

use Illuminate\Http\Request;
use Modules\Master\Models\Language;
use Illuminate\Routing\Controller;
use Modules\Master\Requests\LanguageRequests;
use Modules\Master\Services\LanguageService;
use Inertia\Inertia;

class LanguageController extends Controller
{
    public function __construct(
        protected LanguageService $languageService
    ) {}

    public function index(Request $request)
    {
        $language = $this->languageService->paginate(
            $request->only([
                'name',
                'dateFrom',
                'dateTo',
                'archived',
            ])
        );

        return Inertia::render('master/language/index', [
            'language' => $language
        ]);
    }

    public function create()
    {
        return Inertia::render('master/language/form');
    }

    public function edit(Language $core_category)
    {
        return Inertia::render('master/language/form', [
            'ccategory' => $core_category
        ]);
    }

    public function store(LanguageRequests $request)
    {
        $data = $request->validated();

        try {
            $this->languageService->form(null, $data);
        } catch (\Throwable $e) {
            dd($e->getMessage());
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function update(Language $language, languageRequests $request)
    {
        $data = $request->validated();

        try {
            $this->languageService->form($language->id, $data);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function destroy(Language $language)
    {
        try {
            $this->languageService->deletion($language->id);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }
}
