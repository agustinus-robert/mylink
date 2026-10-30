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

class Incoming extends Model
{
    use HasFactory, SoftDeletes, WhoIs;

    public $table = 'transaction_incomings';

    protected $fillable = [
        'code',
        'name',
        'slug',
        'category_id',
        'sub_category_id',
        'file',
        'grand_total',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected static function booted(): void
    {
        static::creating(function (Incoming $incoming) {
            $incoming->created_by = Auth::id();
        });

        static::updating(function (Incoming $incoming) {
            $incoming->updated_by = Auth::id();
        });

        static::deleting(function (Incoming $incoming) {
            $incoming->deleted_by = Auth::id();
            $incoming->saveQuietly();
        });
    }

    public function items(): HasMany
    {
        return $this->hasMany(IncomingItem::class, 'incoming_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function subCategory(): BelongsTo
    {
        return $this->belongsTo(SubCategory::class, 'sub_category_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function operator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'operator_id');
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
