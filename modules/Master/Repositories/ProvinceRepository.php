<?php

namespace Modules\Master\Repositories;

use Modules\Master\Models\Province;

class ProvinceRepository
{
    public function list()
    {
        return Province::get();
    }

    public function stored($array)
    {
        $tag = new Province();

        $tag->fill($array);
        $tag->save();

        return $tag;
    }

    public function getFromId($id)
    {
        return Province::where('id', $id)->get();
    }

    public function updated($id, $array)
    {
        $tag = Province::findOrFail($id);

        $tag->fill($array);
        $tag->save();

        return $tag;
    }

    public function deleted($id)
    {
        $tag = Province::findOrFail($id);

        return $tag->delete();
    }
}
