<?php

namespace Modules\Account\Models;

use Illuminate\Support\Facades\Auth;
use App\Models\WhoIs;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\SoftDeletes;

class Permission extends Model
{
    use HasFactory, SoftDeletes, WhoIs;

    public $table = "permissions";
    protected $fillable = ['name', 'slug', 'group', 'description', 'created_by', 'updated_by', 'deleted_by'];

    protected static function booted(): void
    {
        static::creating(function (Permission $permission) {
            $permission->created_by = Auth::id();
            $permission->slug = Str::slug($permission->name);
        });

        static::updating(function (Permission $permission) {
            $permission->updated_by = Auth::id();
            $permission->slug = Str::slug($permission->name);
        });

        static::deleting(function (Permission $permission) {
            $permission->deleted_by = Auth::id();
            $permission->saveQuietly();
        });

        // static::restoring(function (Permission $permission) {
        //     $permission->deleted_by = null;
        // });
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
