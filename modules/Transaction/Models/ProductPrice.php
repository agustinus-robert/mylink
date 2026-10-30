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
use Illuminate\Database\Eloquent\Relations\HasOne;
use Modules\Transaction\Models\ProductLocation;
use Modules\Master\Models\Category;
use Modules\Master\Models\SubCategory;

class ProductPrice extends Model
{
    use HasFactory, SoftDeletes, WhoIs;

    public $table = 'trx_product_prices';

    protected $fillable = [
        'product_id',
        'location_id',
        'prices',
        'recorded_at',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected static function booted(): void
    {
        static::creating(function (ProductPrice $price) {
            $price->created_by = Auth::id();
        });

        static::updating(function (ProductPrice $price) {
            $price->updated_by = Auth::id();
        });

        static::deleting(function (ProductPrice $price) {
            $price->deleted_by = Auth::id();
            $price->saveQuietly();
        });
    }

    public function detail(): HasOne
    {
        return $this->hasOne(ProductPrice::class, 'product_id')
            ->latestOfMany();
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(ProductLocation::class, 'location_id', 'id');
    }
    
    public function scopeName($query, ?string $name)
    {
        return $query->when($name, function ($q, $name) {
            $q->where('incoming_from', 'like', "%{$name}%");
        });
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
