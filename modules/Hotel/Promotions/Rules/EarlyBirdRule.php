<?php

namespace Modules\Hotel\Promotions\Rules;

use Carbon\Carbon;
use Modules\Builder\Enums\PromotionRuleEnum;
use Modules\Builder\Models\PromotionRule;

class EarlyBirdRule
{
    public function type(): PromotionRuleEnum
    {
        return PromotionRuleEnum::EARLY_BIRD;
    }

    public function passes(
        PromotionRule $rule,
        array $context
    ): bool {
        $bookedAt = $context['booked_at'] ?? null;
        $checkIn = $context['check_in'] ?? null;

        $requiredDays = (int) ($rule->value['days'] ?? 0);

        if ($requiredDays <= 0) {
            return true;
        }

        if (!$bookedAt || !$checkIn) {
            return false;
        }

        $bookedAt = Carbon::parse($bookedAt)->startOfDay();
        $checkIn = Carbon::parse($checkIn)->startOfDay();

        $daysBeforeCheckIn = $bookedAt->diffInDays(
            $checkIn,
            false
        );

        return $daysBeforeCheckIn >= $requiredDays;
    }
}
