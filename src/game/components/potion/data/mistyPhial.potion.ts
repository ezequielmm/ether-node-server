import { removeConfusionEffect } from 'src/game/effects/removeConfusion/constants';
import { clearHeadedStatus } from 'src/game/status/clearHeaded/constants';
import { PotionRarityEnum, PotionTargetEnum } from '../potion.enum';
import { Potion } from '../potion.schema';

export const mistyPhialPotion: Potion = {
    potionId: 22,
    name: 'Misty Phial',
    rarity: PotionRarityEnum.Uncommon,
    description:
        'Remove Confusion and gain immunity for the rest of this combat',
    effects: [
        {
            effect: removeConfusionEffect.name,
            target: PotionTargetEnum.Player,
        },
        {
            effect: clearHeadedStatus.name,
            target: PotionTargetEnum.Player,
        },
    ],
    usableOutsideCombat: false,
    showPointer: false,
};
