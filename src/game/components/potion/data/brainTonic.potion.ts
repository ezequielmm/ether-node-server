import { drawCardEffect } from 'src/game/effects/drawCard/constants';
import { PotionRarityEnum, PotionTargetEnum } from '../potion.enum';
import { Potion } from '../potion.schema';

export const brainTonic: Potion = {
    potionId: 6,
    name: 'Brain Tonic',
    rarity: PotionRarityEnum.Common,
    description: 'Draw 3 cards',
    effects: [
        {
            effect: drawCardEffect.name,
            target: PotionTargetEnum.Player,
            args: {
                value: 3,
            },
        },
    ],
    usableOutsideCombat: false,
    showPointer: false,
    isActive: true,
};
