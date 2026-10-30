<?php

namespace Modules\Hotel\Models;

use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Models\WhoIs;
use Illuminate\Database\Eloquent\SoftDeletes;

class Amnities extends Model
{
    use SoftDeletes, WhoIs;

    public $table = 'amenities';
    protected $fillable = [
        'name',
        'icon',
        'status'
    ];

    protected static function booted(): void
    {
        static::creating(function (Amnities $amnities) {
            $amnities->created_by = Auth::id();
            $amnities->slug = Str::slug($amnities->name);
        });

        static::updating(function (Amnities $amnities) {
            $amnities->updated_by = Auth::id();
            $amnities->slug = Str::slug($amnities->name);
        });

        static::deleting(function (Amnities $amnities) {
            $amnities->deleted_by = Auth::id();
            $amnities->saveQuietly();
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
