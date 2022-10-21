import { pavaRootEffect } from 'src/game/effects/pavaRoot/constants';
import { PotionRarityEnum, PotionTargetEnum } from '../potion.enum';
import { Potion } from '../potion.schema';

export const pavaRootPotion: Potion = {
    potionId: 14,
    name: 'Pava Root Potion',
    rarity: PotionRarityEnum.Common,
    description: 'Add 1 random attack card to your hand. It costs 0 this turn',
    effects: [
        {
            effect: pavaRootEffect.name,
            target: PotionTargetEnum.Player,
        },
    ],
    usableOutsideCombat: false,
    showPointer: true,
};
