import { healEffect } from 'src/game/effects/heal/constants';
import { PotionRarityEnum, PotionTargetEnum } from '../potion.enum';
import { Potion } from '../potion.schema';

export const springWaterFlask: Potion = {
    potionId: 5,
    name: 'Spring Water Flask',
    rarity: PotionRarityEnum.Common,
    description: 'Heal 7 Hit Points',
    effects: [
        {
            effect: healEffect.name,
            target: PotionTargetEnum.Player,
            args: {
                value: 7,
            },
        },
    ],
    statuses: [],
    usableOutsideCombat: true,
    showPointer: false,
};
