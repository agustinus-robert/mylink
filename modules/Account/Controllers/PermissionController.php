<?php

namespace Modules\Account\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Modules\Account\Models\Permission;
use Modules\Account\Services\PermissionService;
use Modules\Account\Requests\PermissionRequests;
use Inertia\Inertia;

class PermissionController extends Controller
{

    public function __construct(protected PermissionService $permissionService) {}

    public function index(Request $request)
    {
        $permission = $this->permissionService->paginate(
            $request->only([
                'name',
                'dateFrom',
                'dateTo',
                'archived',
            ])
        );

        return Inertia::render('account/permission/index', [
            'permission' => $permission
        ]);
    }

    public function create()
    {
        return Inertia::render('account/permission/form');
    }

    public function store(PermissionRequests $request)
    {
        $data = $request->validated();

        try {
            $this->permissionService->form(null, $data);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function edit(Permission $permission)
    {
        return Inertia::render('account/permission/form', [
            'permission' => $permission
        ]);
    }

    public function update(Permission $permission, PermissionRequests $request)
    {
        $data = $request->validated();

        try {
            $this->permissionService->form($permission->id, $data);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function destroy(Permission $permission)
    {
        try {
            $this->permissionService->deletion($permission->id);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }
}
