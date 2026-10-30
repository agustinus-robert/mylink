<?php

namespace Modules\Builder\Enums;

enum PromotionRuleEnum: int
{
    case MINIMUM_STAY = 1;
    case EARLY_BIRD = 2;
    case LAST_MINUTE = 3;
    case DATE_RANGE = 4;
    case ROOM = 5;
    case RATE_PLAN = 6;
    case OCCUPANCY = 7;
    case CUSTOMER = 8;
    case CHANNEL = 9;
    case QUOTA = 10;

    public function label(): string
    {
        return match ($this) {
            self::MINIMUM_STAY => 'Minimal menginap (n) malam',
            self::EARLY_BIRD => 'Booking minimal (n) hari sebelumnya',
            self::LAST_MINUTE => 'Booking maksimal (n) hari sebelum check-in',
            self::DATE_RANGE => 'Berlaku dari tanggal (n) sampai tanggal (n)',
            self::ROOM => 'Berlaku untuk tipe kamar tertentu',
            self::RATE_PLAN => 'Berlaku untuk rate plan tertentu',
            self::OCCUPANCY => 'Minimal (n) dewasa',
            self::CUSTOMER => 'Berlaku untuk customer/member tertentu',
            self::CHANNEL => 'Berlaku pada channel tertentu',
            self::QUOTA => 'Maksimal (n) booking',
        };
    }
}
