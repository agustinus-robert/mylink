<?php

namespace Modules\Hotel\Models;

use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Models\WhoIs;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use SoftDeletes, WhoIs;

    public $table = 'departments';
    protected $fillable = [
        'hotel_id',
        'name',
        'slug',
        'description'
    ];

    protected static function booted(): void
    {
        static::creating(function (Department $department) {
            $department->created_by = Auth::id();
            $department->slug = Str::slug($department->name);
        });

        static::updating(function (Department $department) {
            $department->updated_by = Auth::id();
            $department->slug = Str::slug($department->name);
        });

        static::deleting(function (Department $department) {
            $department->deleted_by = Auth::id();
            $department->saveQuietly();
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
