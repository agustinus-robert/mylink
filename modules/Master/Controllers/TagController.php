<?php

namespace Modules\Master\Controllers;

use Illuminate\Http\Request;
use Modules\Master\Models\CoreTag;
use Modules\Master\Models\Tag;
use Illuminate\Routing\Controller;
use Modules\Master\Requests\TagRequests;
use Modules\Master\Services\TagService;
use Inertia\Inertia;

class TagController extends Controller
{
    public function __construct(
        protected TagService $tagService
    ) {}

    public function index(Request $request)
    {
        $tags = $this->tagService->paginate(
            $request->only([
                'name',
                'dateFrom',
                'dateTo',
                'archived',
            ])
        );

        return Inertia::render('master/tag/index', [
            'tags' => $tags
        ]);
    }

    public function create()
    {
        $ctag = CoreTag::get();
        return Inertia::render('master/tag/form', [
            'ctag' => $ctag
        ]);
    }

    public function edit(Tag $tag)
    {
        $ctag = CoreTag::get();
        return Inertia::render('master/tag/form', [
            'ctag' => $ctag,
            'tag' => $tag
        ]);
    }

    public function store(TagRequests $request)
    {
        $data = $request->validated();

        try {
            $this->tagService->form(null, $data);
        } catch (\Throwable $e) {
            dd($e->getMessage());
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function update(Tag $tag, TagRequests $request)
    {
        $data = $request->validated();

        try {
            $this->tagService->form($tag->id, $data);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function destroy(Tag $tag)
    {
        try {
            $this->tagService->deletion($tag->id);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }
}
