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
            effect: dodge.name,
            target: PotionTargetEnum.Player,
            args: {
                value: 1,
            },
        },
    ],
    usableOutsideCombat: false,
    showPointer: false,
};
