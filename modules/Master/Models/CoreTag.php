<?php

namespace Modules\Master\Models;

use Illuminate\Support\Facades\Auth;
use App\Models\WhoIs;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class CoreTag extends Model
{
    use HasFactory, SoftDeletes, WhoIs;

    public $table = "mst_core_tags";
    protected $fillable = ['name', 'slug', 'description', 'created_by', 'updated_by', 'deleted_by'];

    protected static function booted(): void
    {
        static::creating(function (CoreTag $coreTag) {
            $coreTag->created_by = Auth::id();
            $coreTag->slug = Str::slug($coreTag->name);
        });

        static::updating(function (CoreTag $coreTag) {
            $coreTag->updated_by = Auth::id();
            $coreTag->slug = Str::slug($coreTag->name);
        });

        static::deleting(function (CoreTag $coreTag) {
            $coreTag->deleted_by = Auth::id();
            $coreTag->saveQuietly();
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
