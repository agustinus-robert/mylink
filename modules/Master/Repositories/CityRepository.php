<?php

namespace Modules\Master\Repositories;

use Modules\Master\Models\City;

class CityRepository
{
    public function list()
    {
        return City::get();
    }

    public function stored($array)
    {
        $tag = new City();

        $tag->fill($array);
        $tag->save();

        return $tag;
    }

    public function getFromId($id)
    {
        return City::where('id', $id)->get();
    }

    public function updated($id, $array)
    {
        $tag = City::findOrFail($id);

        $tag->fill($array);
        $tag->save();

        return $tag;
    }

    public function deleted($id)
    {
        $tag = City::findOrFail($id);

        return $tag->delete();
    }
}
