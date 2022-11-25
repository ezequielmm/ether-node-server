import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { dodge } from 'src/game/status/dodge/constants';
import { PotionRarityEnum, PotionTargetEnum } from '../potion.enum';
import { Potion } from '../potion.schema';

export const potionOfLevitation: Potion = {
    potionId: 21,
    name: 'Potion of Levitation',
    rarity: PotionRarityEnum.Rare,
    description: 'Gain 1 Dodge',
    effects: [
        {
            effect: attachStatusEffect.name,
            target: PotionTargetEnum.Player,
            args: {
                statusName: dodge.name,
                statusArgs: {
                    counter: 1,
                },
            },
        },
    ],
    usableOutsideCombat: false,
    showPointer: false,
    isActive: true,
};
