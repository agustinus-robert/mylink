<?php

namespace Modules\Hotel\Repositories;

use Modules\Hotel\Models\Department;

class HotelDepartmentRepository
{
    public function paginate(array $filters)
    {
        return Department::query()
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
        $department = new Department();

        $department->fill($array);
        $department->save();

        return $department;
    }

    public function getFromId($id)
    {
        return Department::where('id', $id)->get();
    }

    public function updated($id, $array)
    {
        $department = Department::findOrFail($id);

        $department->fill($array);
        $department->save();

        return $department;
    }

    public function deleted($id)
    {
        $department = Department::findOrFail($id);

        return $department->delete();
    }
}
