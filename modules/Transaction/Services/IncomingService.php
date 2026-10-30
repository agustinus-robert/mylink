<?php

namespace Modules\Transaction\Services;

use Illuminate\Support\Facades\DB;
use Modules\Transaction\Repositories\IncomingRepository;
use Modules\Transaction\Repositories\IncomingLocationRepository;
use Modules\Transaction\Repositories\IncomingPriceRepository;

class IncomingService
{
    public function __construct(
        protected IncomingRepository $incomingRepository,
        protected IncomingLocationRepository $incomingLocationRepository,
        protected IncomingPriceRepository $incomingPriceRepository,
    ) {}

    public function paginate(array $filters)
    {
        return $this->incomingRepository->paginate($filters);
    }

    public function getFromId($id)
    {
        return $this->incomingRepository->getFromId($id);
    }

    public function form($id = null, array $data = [])
    {
        return DB::transaction(function () use ($id, $data) {
            if($id == null){
                $product = $this->incomingRepository->stored($data['summary']);
                $location = $this->incomingLocationRepository->stored($data['location']);
                $this->incomingPriceRepository->stored([
                    ...$data['prices'],
                    'product_id' => $product->id,
                    'location_id' => $location->id 
                ]);
            } else {
                $detail = $this->incomingRepository->updated($id, $data['summary']);
                $this->incomingLocationRepository->updated($detail->detail->location_id, $data['location']);
                $this->incomingPriceRepository->updated($detail->detail->product_id, $data['prices']);
            }
        });
    }

    public function deletion($id)
    {
        return DB::transaction(function () use ($id) {
            //$this->incomingLocationRepository->deleteByIncomingId($id);

            return $this->incomingRepository->deleted($id);
        });
    }
}
