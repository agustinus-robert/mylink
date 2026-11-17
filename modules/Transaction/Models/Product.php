<?php

namespace Modules\Transaction\Models;

use App\Models\User;
use App\Models\WhoIs;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;
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
        'related',
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
        return $this->hasOne(ProductPrice::class, 'product_id')
            ->latestOfMany('id')
            ->select([
                'trx_product_prices.id',
                'trx_product_prices.product_id',
                'trx_product_prices.prices',
            ]);
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

    public function scopeKeyword($query, $keyword = null, $searchType = null){
        $condition = $searchType === 'keyword' && filled($keyword);

        return $query->when($condition, function($query) use ($keyword){
            $query->where('name', 'like', "%{$keyword}");
        });
    }

    public function scopeCategory($query, $categoryIds = [], $searchType = null){
        $condition = $searchType === 'category' && !empty($categoryIds);

        return $query->when($condition, function($query) use ($categoryIds){
            $query->whereIn('category_id', $categoryIds);
        });
    }

    public function scopeSubCategory($query, $subCategoryId = null){
        $condition = filled($subCategoryId);

        return $query->when($condition, function($query) use ($subCategoryId){
            $query->where('sub_category_id', $subCategoryId);
        });
    }

    public function scopeProvince($query, $province = null){
        $condition = filled($province);

        return $query->when($condition, function($query) use ($province){
            $query->whereHas('detail.location.district', function($district) use ($province){
                $district->where('province_id', $province);
            });
        });
    }

    public function scopeRegency($query, $regency = null){
        $condition = filled($regency);

        return $query->when($condition, function($query) use ($regency){
            $query->whereHas('detail.location', function($location) use ($regency){
                $location->where('district_id', $regency);
            });
        });
    }

    public function scopeTopics($query, $topics){
        $condition = !empty($topics);

        return $query->when($condition, function($query) use ($topics){
            $query->whereHas('topics', function($query) use ($topics){
                $query->where(function($query) use ($topics){
                    foreach($topics as $topic){
                        $query->orWhereRaw(
                            "FIND_IN_SET(?, REPLACE(name, ', ', ','))",
                            [$topic]
                        );
                    }
                });
            });
        });
    }

    public function scopeDateFrom($query, $date){
        $condition = filled($date);

        return $query->when($condition, function($query) use ($date){
            $query->where('created_at', '>=', $date);
        });
    }

    public function scopeDateTo($query, $date){
        $condition = filled($date);

        return $query->when($condition, function ($query) use ($date){
            $query->where('created_at', '<=', $date);
        });
    }

    public function scopeArchived($query, ?bool $archived)
    {
        return $query->when($archived === true, function ($query) {
            return $query->onlyTrashed();
        });
    }
}
