import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { distraught } from 'src/game/status/distraught/constants';
import { PotionRarityEnum, PotionTargetEnum } from '../potion.enum';
import { Potion } from '../potion.schema';

export const terrorGasPotion: Potion = {
    // TODO: Declare the potionId
    potionId: Number.NaN,
    name: 'Terror Gas',
    rarity: PotionRarityEnum.Common,
    description: 'Apply 3 Distraught to an enemy',
    effects: [
        {
            effect: attachStatusEffect.name,
            target: PotionTargetEnum.Enemy,
            args: {
                statusName: distraught.name,
                statusArgs: {
                    counter: 3,
                },
            },
        },
    ],
    usableOutsideCombat: false,
    showPointer: true,
};
