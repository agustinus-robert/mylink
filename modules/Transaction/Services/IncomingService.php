<?php

namespace Modules\Transaction\Services;

use Illuminate\Support\Facades\DB;
use Modules\Transaction\Repositories\IncomingRepository;
use Modules\Transaction\Repositories\IncomingLocationRepository;
use Modules\Transaction\Repositories\IncomingPriceRepository;
use Modules\Transaction\Repositories\IncomingTopicRepository;
class IncomingService
{
    public function __construct(
        protected IncomingRepository $incomingRepository,
        protected IncomingLocationRepository $incomingLocationRepository,
        protected IncomingPriceRepository $incomingPriceRepository,
        protected IncomingTopicRepository $incomingTopicRepository,
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
                $topic = $this->incomingTopicRepository->stored([
                    'product_id' => $product->id,
                    'name' =>  $data['topic']['topic']
                ]);

                $this->incomingPriceRepository->stored([
                    ...$data['prices'],
                    'product_id' => $product->id,
                    'location_id' => $location->id 
                ]);
            } else {
                $detail = $this->incomingRepository->updated($id, $data['summary']);
                $this->incomingLocationRepository->updated($detail->detail->location_id, $data['location']);
                $this->incomingPriceRepository->updated($detail->detail->product_id, $data['prices']);
                $this->incomingTopicRepository->updated($detail->detail->product_id, [
                    'name' => $data['topic']['topic']
                ]);
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
