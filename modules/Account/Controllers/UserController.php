<?php

namespace Modules\Account\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Modules\Account\Models\Role;
use App\Models\User;
use Modules\Account\Services\UserService;
use Modules\Account\Requests\UserRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class UserController extends Controller
{
    use AuthorizesRequests;

    public function __construct(protected UserService $userService) {}

    public function index(Request $request)
    {
        $filters = $request->only([
            'name',
            'role_id',
            'dateFrom',
            'dateTo',
            'archived',
        ]);

        $users = $this->userService->paginate($filters);

        $roles = Role::query()
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('account/user/index', [
            'user' => $users,
            'roles' => $roles,
            'filters' => $filters,
        ]);
    }

    public function locked(User $user): RedirectResponse
    {
        abort_if(
            $user->roles()->where('name', 'admin')->exists(),
            403,
            'Akun admin tidak dapat dikunci.'
        );

        DB::transaction(function () use ($user) {
            $user->lock = ! $user->lock;
            $user->save();
        });

        return Redirect::back()->with(
            'success',
            $user->lock
                ? 'Pengguna berhasil dikunci.'
                : 'Pengguna berhasil dibuka.'
        );
    }

    public function create(Request $request)
    {
        // $this->authorize('permission', ['dashboard', 'create']);

        $roles = Role::get();

        return Inertia::render('account/user/form', [
            'roles' => $roles,
        ]);
    }

    public function store(UserRequests $request)
    {
        $data = $request->validated();

        try {
            $this->userService->form(null, $data);
        } catch (\Throwable $e) {
            dd($e->getMessage());
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function edit(User $user)
    {
        $roles = Role::get();

        $user->load('roles');

        return Inertia::render('account/user/form', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role_id' => $user->roles->first()?->id ?? 0,
            ],
            'roles' => $roles,
        ]);
    }

    public function update(User $user, UserRequests $request)
    {
        $data = $request->validated();

        if (empty($data['password'])) {
            unset($data['password']);
        }

        try {
            $this->userService->form($user->id, $data);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function destroy(User $user)
    {
        try {
            $this->userService->deletion($user->id);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }
}
