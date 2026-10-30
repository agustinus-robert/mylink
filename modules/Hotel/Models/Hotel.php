<?php

namespace Modules\Hotel\Models;

use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Models\WhoIs;
use Illuminate\Database\Eloquent\SoftDeletes;

class Hotel extends Model
{
    use SoftDeletes, WhoIs;

    public $table = 'hotels';
    protected $fillable = [
        'name',
        'slug',
        'code',
        'phone',
        'email',
        'address',
        'city_id',
        'regency_id',
        'country_id',
        'latitude',
        'longitude'
    ];

    protected static function booted(): void
    {
        static::creating(function (Hotel $hotel) {
            $hotel->created_by = Auth::id();
            $hotel->slug = Str::slug($hotel->name);
        });

        static::updating(function (Hotel $hotel) {
            $hotel->updated_by = Auth::id();
            $hotel->slug = Str::slug($hotel->name);
        });

        static::deleting(function (Hotel $hotel) {
            $hotel->deleted_by = Auth::id();
            $hotel->saveQuietly();
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
