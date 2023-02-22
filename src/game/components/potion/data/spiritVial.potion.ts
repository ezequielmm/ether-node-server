import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { spirited } from 'src/game/status/spirited/contants';
import { PotionRarityEnum, PotionTargetEnum } from '../potion.enum';
import { Potion } from '../potion.schema';

export const spiritVialPotion: Potion = {
    potionId: 8,
    name: 'Spirit Vial',
    rarity: PotionRarityEnum.Uncommon,
    description: 'Gain 1 Energy each turn',
    effects: [
        {
            effect: attachStatusEffect.name,
            target: PotionTargetEnum.Player,
            args: {
                statusName: spirited.name,
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
