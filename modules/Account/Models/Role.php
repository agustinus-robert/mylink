<?php

namespace Modules\Account\Models;

use Illuminate\Support\Facades\Auth;
use App\Models\WhoIs;
use App\Models\User;
use Modules\Account\Models\Permission;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\SoftDeletes;

class Role extends Model
{
    use HasFactory, SoftDeletes, WhoIs;

    public $table = "roles";
    protected $fillable = ['name', 'slug', 'description', 'created_by', 'updated_by', 'deleted_by'];

    protected static function booted(): void
    {
        static::creating(function (Role $role) {
            $role->created_by = Auth::id();
            $role->slug = Str::slug($role->name);
        });

        static::updating(function (Role $role) {
            $role->updated_by = Auth::id();
            $role->slug = Str::slug($role->name);
        });

        static::deleting(function (Role $role) {
            $role->deleted_by = Auth::id();
            $role->saveQuietly();
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

    public function users()
    {
        return $this->belongsToMany(
            User::class,
            'role_users',
            'role_id',
            'user_id'
        )->withTimestamps();
    }

    public function permissions()
    {
        return $this->belongsToMany(
            Permission::class,
            'role_permissions',
            'role_id',
            'permission_id'
        )->withPivot([
            'can_create',
            'can_read',
            'can_update',
            'can_delete',
        ]);
    }
}
