<?php

namespace Modules\Hotel\Promotions\Rules;

use Modules\Builder\Enums\PromotionRuleEnum;
use Modules\Builder\Models\PromotionRule;

class MinimumStayRule
{
    public function type(): PromotionRuleEnum
    {
        return PromotionRuleEnum::MINIMUM_STAY;
    }

    public function passes(
        PromotionRule $rule,
        array $context
    ): bool {
        $nights = (int) ($context['nights'] ?? 0);
        $required = (int) ($rule->value['nights'] ?? 0);

        if ($required <= 0) {
            return true;
        }

        return $nights >= $required;
    }
}
