import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { fatigue } from 'src/game/status/fatigue/constants';
import { PotionRarityEnum, PotionTargetEnum } from '../potion.enum';
import { Potion } from '../potion.schema';

export const weaknessGasPotion: Potion = {
    potionId: 25,
    name: 'Weakness Gas',
    rarity: PotionRarityEnum.Common,
    description: 'Apply 3 Fatigue to an enemy',
    effects: [
        {
            effect: attachStatusEffect.name,
            target: PotionTargetEnum.Enemy,
            args: {
                statusName: fatigue.name,
                statusArgs: {
                    counter: 3,
                },
            },
        },
    ],
    usableOutsideCombat: false,
    showPointer: true,
    isActive: true,
};
