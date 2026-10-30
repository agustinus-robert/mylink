<?php

namespace Modules\Master\Models;

use Illuminate\Support\Facades\Auth;
use App\Models\WhoIs;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Language extends Model
{
    use HasFactory, SoftDeletes, WhoIs;

    public $table = "mst_languages";
    protected $fillable = ['name', 'slug', 'created_by', 'updated_by', 'deleted_by'];

    protected static function booted(): void
    {
        static::creating(function (Language $language) {
            $language->created_by = Auth::id();
            $language->slug = Str::slug($language->name);
        });

        static::updating(function (Language $language) {
            $language->updated_by = Auth::id();
            $language->slug = Str::slug($language->name);
        });

        static::deleting(function (Language $language) {
            $language->deleted_by = Auth::id();
            $language->saveQuietly();
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
