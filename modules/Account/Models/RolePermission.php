<?php

namespace Modules\Account\Models;

use Illuminate\Support\Facades\Auth;
use App\Models\WhoIs;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\SoftDeletes;

class RolePermission extends Model
{
    use HasFactory, SoftDeletes, WhoIs;

    public $table = "role_permissions";
    protected $fillable = ['role_id', 'permission_id', 'can_create', 'can_read', 'can_update', 'can_delete', 'created_by', 'updated_by', 'deleted_by'];

    protected static function booted(): void
    {
        static::creating(function (RolePermission $rolePermission) {
            $rolePermission->created_by = Auth::id();
        });

        static::updating(function (RolePermission $rolePermission) {
            $rolePermission->updated_by = Auth::id();
        });

        static::deleting(function (RolePermission $rolePermission) {
            $rolePermission->deleted_by = Auth::id();
            $rolePermission->saveQuietly();
        });

        // static::restoring(function (Permission $permission) {
        //     $permission->deleted_by = null;
        // });
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
