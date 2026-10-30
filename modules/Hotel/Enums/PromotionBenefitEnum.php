<?php

namespace Modules\Builder\Enums;

enum PromotionBenefitEnum: int
{
    case DISCOUNT_PERCENT = 1;
    case DISCOUNT_FIXED = 2;
    case FREE_NIGHT = 3;
    case PACKAGE = 4;
    case ROOM_UPGRADE = 5;

    public function label(): string
    {
        return match ($this) {
            self::DISCOUNT_PERCENT => 'Potongan persentase',
            self::DISCOUNT_FIXED => 'Potongan nominal tetap',
            self::FREE_NIGHT => 'Gratis (n) malam',
            self::PACKAGE => 'Paket termasuk fasilitas tambahan',
            self::ROOM_UPGRADE => 'Upgrade tipe kamar',
        };
    }
}
