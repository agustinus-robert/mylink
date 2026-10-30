<?php

namespace Modules\Transaction\Models;

use App\Models\User;
use App\Models\WhoIs;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Modules\Master\Models\Category;
use Modules\Master\Models\SubCategory;
use Modules\Master\Models\Province;
use Modules\Master\Models\Regency;

class ProductLocation extends Model
{
    use HasFactory, SoftDeletes, WhoIs;

    public $table = 'mst_locations';

    protected $fillable = [
        'name',
        'address',
        'province',
        'district',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected static function booted(): void
    {
        static::creating(function (ProductLocation $location) {
            $location->created_by = Auth::id();
        });

        static::updating(function (ProductLocation $location) {
            $location->updated_by = Auth::id();
        });

        static::deleting(function (ProductLocation $location) {
            $location->deleted_by = Auth::id();
            $location->saveQuietly();
        });
    }

    public function scopeName($query, ?string $name)
    {
        return $query->when($name, function ($q, $name) {
            $q->where('incoming_from', 'like', "%{$name}%");
        });
    }

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class, 'province', 'id');
    }

    public function district(): BelongsTo
    {
        return $this->belongsTo(Regency::class, 'district', 'id');
    }

    public function scopeRange(
        $query,
        ?string $dateFrom,
        ?string $dateTo
    ) {
        return $query
            ->when($dateFrom, function ($q, $dateFrom) {
                $q->whereDate('created_at', '>=', $dateFrom);
            })
            ->when($dateTo, function ($q, $dateTo) {
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
