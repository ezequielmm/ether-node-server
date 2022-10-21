import { spirited } from 'src/game/status/spirited/contants';
import { PotionRarityEnum, PotionTargetEnum } from '../potion.enum';
import { Potion } from '../potion.schema';

export const spiritElixir: Potion = {
    potionId: 24,
    name: 'Spirit Elixir',
    rarity: PotionRarityEnum.Rare,
    description: 'Gain 2 Energy each round',
    effects: [
        {
            effect: spirited.name,
            target: PotionTargetEnum.Player,
            args: {
                value: 2,
            },
        },
    ],
    usableOutsideCombat: false,
    showPointer: false,
};
