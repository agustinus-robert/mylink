<?php

namespace Modules\Hotel\Controllers\RoomAministies;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Modules\Hotel\Models\Amnities;
use Modules\Hotel\Requests\AmnitiesRequest;
use Modules\Hotel\Services\AmnitiesService;
use Modules\Hotel\Enums\AmenitiesEnum;

class AmnistiesController extends Controller
{
    public function __construct(
        protected AmnitiesService $amnitiesService
    ) {}


    public function index(Request $request)
    {
        $amnities = $this->amnitiesService->paginate(
            $request->only([
                'name',
                'dateFrom',
                'dateTo',
                'archived',
            ])
        );

        return Inertia('hotel/master/room-amnities/amenities/index', [
            'amenities' => $amnities
        ]);
    }

    public function create()
    {
        $status = array_map(function ($item) {
            return [
                'id' => $item->value,
                'name' => $item->label()
            ];
        }, AmenitiesEnum::cases());

        return Inertia(
            'hotel/master/room-amnities/amenities/form',
            [
                'statuses' => $status
            ]
        );
    }

    public function show() {}

    public function edit(Amnities $amenity)
    {
        $status = array_map(function ($item) {
            return [
                'id' => $item->value,
                'name' => $item->label()
            ];
        }, AmenitiesEnum::cases());

        return Inertia('hotel/master/room-amnities/amenities/form', [
            'amenities' => $amenity,
            'statuses' => $status
        ]);
    }

    public function store(AmnitiesRequest $request)
    {
        $data = $request->validated();

        try {
            $this->amnitiesService->form(null, $data);
        } catch (\Throwable $e) {
            dd($e->getMessage());
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function update(Amnities $amenity, AmnitiesRequest $request)
    {
        $data = $request->validated();

        try {
            $this->amnitiesService->form($amenity->id, $data);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function destroy(Amnities $amnities)
    {
        try {
            $this->amnitiesService->deletion($amnities->id);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }
}
