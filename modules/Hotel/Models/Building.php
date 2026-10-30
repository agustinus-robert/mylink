<?php

namespace Modules\Hotel\Models;

use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Models\WhoIs;
use Illuminate\Database\Eloquent\SoftDeletes;

class Building extends Model
{
    use SoftDeletes, WhoIs;

    public $table = 'hotel_buildings';
    protected $fillable = [
        'code',
        'hotel_id',
        'name',
        'slug',
        'description'
    ];

    protected static function booted(): void
    {
        static::creating(function (Building $building) {
            $building->created_by = Auth::id();
            $building->slug = Str::slug($building->name);
        });

        static::updating(function (Building $building) {
            $building->updated_by = Auth::id();
            $building->slug = Str::slug($building->name);
        });

        static::deleting(function (Building $building) {
            $building->deleted_by = Auth::id();
            $building->saveQuietly();
        });
    }

    public function scopeName($query, ?string $name)
    {
        return $query->when($name, function ($q, $name) {
            $q->where('name', 'like', "%{$name}%");
        });
    }

    public function scopeRange($query, ?string $dateFrom, ?string $dateTo)
    {
        return $query->when($dateFrom, function ($q, $dateFrom) {
            $q->whereDate('created_at', '>=', $dateFrom);
        })->when($dateTo, function ($q, $dateTo) {
            $q->whereDate('created_at', '<=', $dateTo);
        });
    }

    public function scopeArchived($query, ?bool $archived)
    {
        return $query->when($archived === true, function ($query) {
            return $query->onlyTrashed();
        });
    }
}
