<?php

namespace Modules\Hotel\Controllers\Company;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use App\Models\User;
use Modules\Hotel\Models\Staff;
use Modules\Hotel\Traits\HotelNeedingTraits;

use Modules\Hotel\Requests\CompanyStaffRequests;
use Modules\Hotel\Services\CompanyStaffService;

class StaffController extends Controller
{
    use HotelNeedingTraits;

    public function __construct(
        protected CompanyStaffService $companyStaffService
    ) {}


    public function index(Request $request)
    {
        $staff = $this->companyStaffService->paginate(
            $request->only([
                'name',
                'dateFrom',
                'dateTo',
                'archived',
            ])
        );

        return Inertia('hotel/master/company/staff/index', [
            'staff' => $staff
        ]);
    }

    public function create()
    {
        $user = User::get();
        return Inertia(
            'hotel/master/company/staff/form',
            [
                ...$this->getHotelNeeder(false),
                'user' => $user
            ]
        );
    }

    public function show() {}

    public function edit(Staff $staff)
    {
        $user = User::get();
        return Inertia('hotel/master/company/staff/form', [
            ...$this->getHotelNeeder(false),
            'staff' => $staff,
            'user' => $user
        ]);
    }

    public function store(CompanyStaffRequests $request)
    {
        $data = $request->validated();

        try {
            $this->companyStaffService->form(null, $data);
        } catch (\Throwable $e) {
            dd($e->getMessage());
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function update(Staff $staff, CompanyStaffRequests $request)
    {
        $data = $request->validated();

        try {
            $this->companyStaffService->form($staff->id, $data);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function destroy(Staff $staff)
    {
        try {
            $this->companyStaffService->deletion($staff->id);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }
}
