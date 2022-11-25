import { damageEffect } from 'src/game/effects/damage/constants';
import { PotionRarityEnum, PotionTargetEnum } from '../potion.enum';
import { Potion } from '../potion.schema';

export const damagePotion: Potion = {
    potionId: 3,
    name: 'Damage Potion',
    rarity: PotionRarityEnum.Common,
    description: 'Apply 10 damage to an enemy',
    effects: [
        {
            effect: damageEffect.name,
            target: PotionTargetEnum.Enemy,
            args: {
                value: 10,
            },
        },
    ],
    usableOutsideCombat: false,
    showPointer: true,
    isActive: true,
};
