<?php

namespace Modules\Master\Models;

use Illuminate\Support\Facades\Auth;
use App\Models\WhoIs;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Regency extends Model
{
    use HasFactory, SoftDeletes, WhoIs;

    public $table = "ref_regencies";
    protected $fillable = ['province_id', 'name', 'slug', 'created_by', 'updated_by', 'deleted_by'];

    protected static function booted(): void
    {
        static::creating(function (Regency $regencies) {
            $regencies->created_by = Auth::id();
            $regencies->slug = Str::slug($regencies->name);
        });

        static::updating(function (Regency $regencies) {
            $regencies->updated_by = Auth::id();
            $regencies->slug = Str::slug($regencies->name);
        });

        static::deleting(function (Regency $regencies) {
            $regencies->deleted_by = Auth::id();
            $regencies->saveQuietly();
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
