<?php

namespace Modules\Hotel\Repositories;

use Modules\Hotel\Models\Staff;

class HotelStaffRepository
{
    public function paginate(array $filters)
    {
        return Staff::query()
            ->with('creator:id,name')
            ->name($filters['name'] ?? null)
            ->range(
                $filters['dateFrom'] ?? null,
                $filters['dateTo'] ?? null
            )
            ->archived($filters['archived'] ?? null)
            ->paginate(10);
    }

    public function stored($array)
    {
        $staff = new Staff();

        $staff->fill($array);
        $staff->save();

        return $staff;
    }

    public function getFromId($id)
    {
        return Staff::where('id', $id)->get();
    }

    public function updated($id, $array)
    {
        $staff = Staff::findOrFail($id);

        $staff->fill($array);
        $staff->save();

        return $staff;
    }

    public function deleted($id)
    {
        $staff = Staff::findOrFail($id);

        return $staff->delete();
    }
}
