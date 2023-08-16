import { philterOfRedemptionEffect } from 'src/game/effects/philterOfRedemption/constants';
import { healEffect } from 'src/game/effects/heal/constants';

import { PotionRarityEnum, PotionTargetEnum } from '../potion.enum';
import { Potion } from '../potion.schema';

export const philterOfRedemptionPotion: Potion = {
    potionId: 16,
    name: 'Philter of Redemption',
    rarity: PotionRarityEnum.Rare,
    description: 'Heal however much health you lost last turn',
    effects: [
        {
            effect: healEffect.name,
            target: PotionTargetEnum.Player,
            args: {
                value: 12,
            },
        },
    ],
    usableOutsideCombat: false,
    showPointer: false,
    isActive: true,
};
