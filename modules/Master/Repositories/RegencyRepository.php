<?php

namespace Modules\Master\Repositories;

use Modules\Master\Models\Regency;

class RegencyRepository
{
    public function list()
    {
        return Regency::get();
    }

    public function stored($array)
    {
        $tag = new Regency();

        $tag->fill($array);
        $tag->save();

        return $tag;
    }

    public function getFromId($id)
    {
        return Regency::where('id', $id)->get();
    }

    public function updated($id, $array)
    {
        $tag = Regency::findOrFail($id);

        $tag->fill($array);
        $tag->save();

        return $tag;
    }

    public function deleted($id)
    {
        $tag = Regency::findOrFail($id);

        return $tag->delete();
    }
}
