<?php

namespace Modules\Transaction\Models;

use Illuminate\Support\Facades\Auth;
use App\Models\WhoIs;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class IncomingItem extends Model
{
    use HasFactory, SoftDeletes, WhoIs;

    public $table = "transaction_incoming_items";

    protected $fillable = [
        'incoming_id',
        'name',
        'harga',
        'qty',
        'uom',
        'total',
        'expired',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected static function booted(): void
    {
        static::creating(function (IncomingItem $item) {
            $item->created_by = Auth::id();
        });

        static::updating(function (IncomingItem $item) {
            $item->updated_by = Auth::id();
        });

        static::deleting(function (IncomingItem $item) {
            $item->deleted_by = Auth::id();
            $item->saveQuietly();
        });
    }

    public function incoming()
    {
        return $this->belongsTo(Incoming::class, 'incoming_id');
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
