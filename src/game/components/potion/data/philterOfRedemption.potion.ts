import { philterOfRedemptionEffect } from 'src/game/effects/philterOfRedemption/constants';
import { PotionRarityEnum, PotionTargetEnum } from '../potion.enum';
import { Potion } from '../potion.schema';

export const philterOfRedemptionPotion: Potion = {
    potionId: 16,
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
