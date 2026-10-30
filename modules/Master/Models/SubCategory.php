<?php

namespace Modules\Master\Models;

use App\Models\WhoIs;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class SubCategory extends Model
{
    use HasFactory, SoftDeletes, WhoIs;

    protected $table = 'mst_sub_categories';

    protected $fillable = [
        'category_id',
        'name',
        'price',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected static function booted(): void
    {
        static::creating(function (SubCategory $subCategory) {
            $subCategory->created_by = Auth::id();
        });

        static::updating(function (SubCategory $subCategory) {
            $subCategory->updated_by = Auth::id();
        });

        static::deleting(function (SubCategory $subCategory) {
            $subCategory->deleted_by = Auth::id();
            $subCategory->saveQuietly();
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function scopeName($query, ?string $name)
    {
        return $query->when($name, function ($q, $name) {
            $q->where('name', 'like', "%{$name}%");
        });
    }

    public function scopeRange($query, ?string $dateFrom, ?string $dateTo)
    {
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