import { defenseEffect } from 'src/game/effects/defense/constants';
import { PotionRarityEnum, PotionTargetEnum } from '../potion.enum';
import { Potion } from '../potion.schema';

export const defensePotion: Potion = {
    potionId: 2,
    name: 'Defense Potion',
    rarity: PotionRarityEnum.Common,
    description: 'Gain 12 Defense',
    effects: [
        {
            effect: defenseEffect.name,
            target: PotionTargetEnum.Player,
            args: {
                value: 12,
            },
        },
    ],
    statuses: [],
    usableOutsideCombat: false,
    showPointer: false,
};
