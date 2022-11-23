import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { spirited } from 'src/game/status/spirited/contants';
import { PotionRarityEnum, PotionTargetEnum } from '../potion.enum';
import { Potion } from '../potion.schema';

export const spiritElixir: Potion = {
    potionId: 24,
    name: 'Spirit Elixir',
    rarity: PotionRarityEnum.Rare,
    description: 'Gain 3 Energy each round',
    effects: [
        {
            effect: attachStatusEffect.name,
            target: PotionTargetEnum.Player,
            args: {
                statusName: spirited.name,
                statusArgs: {
                    counter: 3,
                },
            },
        },
    ],
    usableOutsideCombat: false,
    showPointer: false,
};
