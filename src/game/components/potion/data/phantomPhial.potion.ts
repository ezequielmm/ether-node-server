import { phantomPhialEffect } from 'src/game/effects/phantomPhial/constants';
import { PotionRarityEnum, PotionTargetEnum } from '../potion.enum';
import { Potion } from '../potion.schema';

export const phantomPhialPotion: Potion = {
    potionId: 19,
    name: 'Phantom Phial',
    rarity: PotionRarityEnum.Rare,
    description:
        'Return the last 2 cards played to your hand. They cost 0 this round',
    effects: [
        {
            effect: phantomPhialEffect.name,
            target: PotionTargetEnum.Player,
        },
    ],
    usableOutsideCombat: false,
    showPointer: false,
    isActive: true,
};
