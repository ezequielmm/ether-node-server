import { healEffect } from 'src/game/effects/heal/constants';
import { PotionRarityEnum, PotionTargetEnum } from '../potion.enum';
import { Potion } from '../potion.schema';

export const healingPotion: Potion = {
    potionId: 1,
    name: 'Healing Potion',
    rarity: PotionRarityEnum.Common,
    description: 'Heal for 20% of Max hitpoints',
    effects: [
        {
            effect: healEffect.name,
            target: PotionTargetEnum.Player,
            args: {
                value: 0,
                percentage: 0.2,
            },
        },
    ],
    usableOutsideCombat: true,
    showPointer: false,
};
