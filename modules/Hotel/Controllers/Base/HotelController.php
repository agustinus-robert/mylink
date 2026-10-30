<?php

namespace Modules\Hotel\Controllers\Base;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Modules\Master\Traits\LocationTrait;
use Modules\Hotel\Models\Hotel;
use Modules\Hotel\Requests\HotelBaseRequests;
use Modules\Hotel\Services\HotelBaseService;

class HotelController extends Controller
{
    use LocationTrait;

    public function __construct(
        protected HotelBaseService $hotelBaseService
    ) {}


    public function index(Request $request)
    {
        $hotel = $this->hotelBaseService->paginate(
            $request->only([
                'name',
                'dateFrom',
                'dateTo',
                'archived',
            ])
        );

        return Inertia('hotel/master/hotels/base/index', [
            'hotel' => $hotel
        ]);
    }

    public function create()
    {
        return Inertia('hotel/master/hotels/base/form', $this->getLocation());
    }

    public function show() {}

    public function edit(Hotel $base_hotel)
    {
        return Inertia('hotel/master/hotels/base/form', [
            ...$this->getLocation(),
            'hotel' => $base_hotel
        ]);
    }

    public function store(HotelBaseRequests $request)
    {
        $data = $request->validated();

        try {
            $this->hotelBaseService->form(null, $data);
        } catch (\Throwable $e) {
            dd($e->getMessage());
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function update(Hotel $base_hotel, HotelBaseRequests $request)
    {
        $data = $request->validated();

        try {
            $this->hotelBaseService->form($base_hotel->id, $data);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function destroy(Hotel $base_hotel)
    {
        try {
            $this->hotelBaseService->deletion($base_hotel->id);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }
}
