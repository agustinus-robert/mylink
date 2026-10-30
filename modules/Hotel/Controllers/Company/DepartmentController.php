<?php

namespace Modules\Hotel\Controllers\Company;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Modules\Hotel\Models\Department;
use Modules\Hotel\Traits\HotelNeedingTraits;

use Modules\Hotel\Requests\HotelDepartmentRequests;
use Modules\Hotel\Services\HotelDepartmentService;

class DepartmentController extends Controller
{
    use HotelNeedingTraits;

    public function __construct(
        protected HotelDepartmentService $hotelDepartmentService
    ) {}


    public function index(Request $request)
    {
        $department = $this->hotelDepartmentService->paginate(
            $request->only([
                'name',
                'dateFrom',
                'dateTo',
                'archived',
            ])
        );

        return Inertia('hotel/master/company/department/index', [
            'department' => $department
        ]);
    }

    public function create()
    {
        return Inertia(
            'hotel/master/company/department/form',
            [
                ...$this->getHotelNeeder(false)
            ]
        );
    }

    public function show() {}

    public function edit(Department $department)
    {
        return Inertia('hotel/master/company/department/form', [
            ...$this->getHotelNeeder(false),
            'department' => $department,
        ]);
    }

    public function store(HotelDepartmentRequests $request)
    {
        $data = $request->validated();

        try {
            $this->hotelDepartmentService->form(null, $data);
        } catch (\Throwable $e) {
            dd($e->getMessage());
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function update(Department $department, HotelDepartmentRequests $request)
    {
        $data = $request->validated();

        try {
            $this->hotelDepartmentService->form($department->id, $data);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function destroy(Department $department)
    {
        try {
            $this->hotelDepartmentService->deletion($department->id);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }
}
