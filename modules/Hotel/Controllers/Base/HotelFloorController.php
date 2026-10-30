<?php

namespace Modules\Hotel\Controllers\Base;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Modules\Hotel\Traits\HotelNeedingTraits;

use Modules\Hotel\Models\Floor;
use Modules\Hotel\Requests\HotelFloorRequests;
use Modules\Hotel\Services\HotelFloorService;

class HotelFloorController extends Controller
{
    use HotelNeedingTraits;

    public function __construct(
        protected HotelFloorService $hotelFloorService
    ) {}


    public function index(Request $request)
    {
        $floor = $this->hotelFloorService->paginate(
            $request->only([
                'name',
                'dateFrom',
                'dateTo',
                'archived',
            ])
        );

        return Inertia('hotel/master/hotels/floors/index', [
            'floor' => $floor
        ]);
    }

    public function create()
    {
        return Inertia(
            'hotel/master/hotels/floors/form',
            [
                ...$this->getHotelNeeder(false)
            ]
        );
    }

    public function show() {}

    public function edit(Floor $floor)
    {
        return Inertia('hotel/master/hotels/floors/form', [
            ...$this->getHotelNeeder(false),
            'floor' => $floor,
        ]);
    }

    public function store(HotelFloorRequests $request)
    {
        $data = $request->validated();

        try {
            $this->hotelFloorService->form(null, $data);
        } catch (\Throwable $e) {
            dd($e->getMessage());
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function update(Floor $floor, HotelFloorRequests $request)
    {
        $data = $request->validated();

        try {
            $this->hotelFloorService->form($floor->id, $data);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function destroy(Floor $floor)
    {
        try {
            $this->hotelFloorService->deletion($floor->id);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }
}
