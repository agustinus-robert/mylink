<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Modules\Builder\Models\Menu;
use Modules\Cms\Models\TransactionPost;
use Modules\Master\Models\Category;
use Modules\Master\Models\Tag;
use Modules\Master\Models\CoreCategory;
use Modules\Master\Models\CoreTag;
use Modules\Master\Models\Language;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),

            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
            ],

            'isAdmin' => $user
                ? $user->roles()->where('slug', 'admin')->exists()
                : false,

            'can' => $user?->permissionMap() ?? [],

            'sidebarOpen' => ! $request->hasCookie('sidebar_state')
                || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
