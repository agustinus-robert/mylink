<?php

namespace Modules\Account\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Modules\Account\Models\Role;
use Modules\Account\Models\Permission;
use Modules\Account\Models\RolePermission;
use Illuminate\Support\Facades\DB;
use Modules\Account\Services\RolePermissionService;
use Inertia\Inertia;

class RolePermissionController extends Controller
{

    public function __construct(protected RolePermissionService $rolePermissionService) {}

    public function show(Role $role)
    {
        $permission = Permission::get();
        $rolePermission = RolePermission::where('role_id', $role->id)->get();

        return Inertia::render('account/role-permission/form', [
            'role' => $role,
            'permission' => $permission,
            'role_permission' => $rolePermission
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        try {
            DB::transaction(function () use ($data) {
                $this->rolePermissionService->deletion(
                    $data['role_id']
                );

                $this->rolePermissionService->form($data);
            });

            return back()->with('success', 'Permission berhasil disimpan.');
        } catch (\Throwable $e) {
            dd($e->getMessage());
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }
}
