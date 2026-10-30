<?php

namespace Modules\Account\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Modules\Account\Models\Role;
use Modules\Account\Services\RoleService;
use Modules\Account\Requests\RoleRequests;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function __construct(protected RoleService $roleService) {}

    public function index(Request $request)
    {
        $roles = $this->roleService->paginate(
            $request->only([
                'name',
                'dateFrom',
                'dateTo',
                'archived',
            ])
        );

        return Inertia::render('account/role/index', [
            'role' => $roles
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('account/role/form');
    }

    public function store(RoleRequests $request)
    {
        $data = $request->validated();

        try {
            $this->roleService->form(null, $data);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function edit(Role $role)
    {
        return Inertia::render('account/role/form', [
            'role' => $role
        ]);
    }

    public function update(Role $role, RoleRequests $request)
    {
        $data = $request->validated();

        try {
            $this->roleService->form($role->id, $data);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function destroy(Role $role)
    {
        try {
            $this->roleService->deletion($role->id);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }
}
