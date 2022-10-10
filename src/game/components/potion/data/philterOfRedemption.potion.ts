import { damageEffect } from 'src/game/effects/damage/constants';
import { philterOfRedemptionEffect } from 'src/game/effects/philterOfRedemption/constants';
import { PotionRarityEnum, PotionTargetEnum } from '../potion.enum';
import { Potion } from '../potion.schema';

export const philterOfRedemptionPotion: Potion = {
    potionId: 3,
    name: 'Philter of Redemption',
    rarity: PotionRarityEnum.Rare,
    description: 'Heal however much health you lost last turn',
    effects: [
        {
            effect: philterOfRedemptionEffect.name,
            target: PotionTargetEnum.Player,
        },
    ],
    usableOutsideCombat: false,
    showPointer: false,
};
