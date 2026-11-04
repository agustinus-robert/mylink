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
use Modules\Master\Models\Category;
use Modules\Master\Models\SubCategory;

class Product extends Model
{
    use HasFactory, SoftDeletes, WhoIs;

    public $table = 'mst_products';

    protected $fillable = [
        'code',
        'name',
        'slug',
        'link',
        'affiliate_link',
        'category_id',
        'sub_category_id',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected static function booted(): void
    {
        static::creating(function (Product $product) {
            $product->created_by = Auth::id();
        });

        static::updating(function (Product $product) {
            $product->updated_by = Auth::id();
        });

        static::deleting(function (Product $product) {
            $product->deleted_by = Auth::id();
            $product->saveQuietly();
        });
    }

    public function detail(): HasOne
    {
        return $this->hasOne(ProductPrice::class, 'product_id')->latestOfMany();
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }

    public function topics(): HasOne
    {
        return $this->hasOne(Topics::class, 'product_id', 'id');
    }

    public function subCategory(): BelongsTo
    {
        return $this->belongsTo(SubCategory::class, 'sub_category_id', 'id');
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
