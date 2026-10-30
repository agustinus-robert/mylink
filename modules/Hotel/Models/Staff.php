<?php

namespace Modules\Hotel\Models;

use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Models\WhoIs;
use Illuminate\Database\Eloquent\SoftDeletes;

class Staff extends Model
{
    use SoftDeletes, WhoIs;

    public $table = 'staffs';
    protected $fillable = [
        'hotel_id',
        'user_id',
        'start_at',
        'end_at'
    ];

    protected static function booted(): void
    {
        static::creating(function (Staff $staff) {
            $staff->created_by = Auth::id();
        });

        static::updating(function (Staff $staff) {
            $staff->updated_by = Auth::id();
        });

        static::deleting(function (Staff $staff) {
            $staff->deleted_by = Auth::id();
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
