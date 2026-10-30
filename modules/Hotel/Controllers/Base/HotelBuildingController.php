<?php

namespace Modules\Hotel\Controllers\Base;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Modules\Master\Traits\LocationTrait;
use Modules\Hotel\Models\Building;
use Modules\Hotel\Models\Hotel;
use Modules\Hotel\Requests\HotelBuildingRequests;
use Modules\Hotel\Services\HotelBuildingService;

class HotelBuildingController extends Controller
{
    use LocationTrait;

    public function __construct(
        protected HotelBuildingService $hotelBuildingService
    ) {}


    public function index(Request $request)
    {
        $building = $this->hotelBuildingService->paginate(
            $request->only([
                'name',
                'dateFrom',
                'dateTo',
                'archived',
            ])
        );

        return Inertia('hotel/master/hotels/buildings/index', [
            'building' => $building
        ]);
    }

    public function create()
    {
        $hotel = Hotel::get();
        return Inertia(
            'hotel/master/hotels/buildings/form',
            [
                ...$this->getLocation(),
                'hotel' => $hotel
            ]
        );
    }

    public function show() {}

    public function edit(Building $building)
    {
        $hotel = Hotel::get();
        return Inertia('hotel/master/hotels/buildings/form', [
            ...$this->getLocation(),
            'building' => $building,
            'hotel' => $hotel
        ]);
    }

    public function store(HotelBuildingRequests $request)
    {
        $data = $request->validated();

        try {
            $this->hotelBuildingService->form(null, $data);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function update(Building $building, HotelBuildingRequests $request)
    {
        $data = $request->validated();

        try {
            $this->hotelBuildingService->form($building->id, $data);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function destroy(Building $building)
    {
        try {
            $this->hotelBuildingService->deletion($building->id);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }
}
