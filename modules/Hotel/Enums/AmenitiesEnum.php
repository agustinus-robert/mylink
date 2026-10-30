<?php

namespace Modules\Hotel\Enums;

enum AmenitiesEnum: int
{
    case ACTIVE = 1;
    case INACTIVE = 2;
    case MAINTENANCE = 3;

    public function label(): string
    {
        return match ($this) {
            self::ACTIVE => 'Aktif',
            self::INACTIVE => 'Tidak Aktif',
            self::MAINTENANCE => 'Diperbaiki'
        };
    }
}
