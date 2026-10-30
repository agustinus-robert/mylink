<?php

namespace Modules\Hotel\Models;

use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Models\WhoIs;
use Illuminate\Database\Eloquent\SoftDeletes;

class Floor extends Model
{
    use SoftDeletes, WhoIs;

    public $table = 'hotel_floors';
    protected $fillable = [
        'hotel_id',
        'building_id',
        'floor_number',
        'name',
        'slug',
        'description'
    ];

    protected static function booted(): void
    {
        static::creating(function (Floor $floor) {
            $floor->created_by = Auth::id();
            $floor->slug = Str::slug($floor->name);
        });

        static::updating(function (Floor $floor) {
            $floor->updated_by = Auth::id();
            $floor->slug = Str::slug($floor->name);
        });

        static::deleting(function (Floor $floor) {
            $floor->deleted_by = Auth::id();
            $floor->saveQuietly();
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
