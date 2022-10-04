import { fatigue } from 'src/game/status/fatigue/constants';
import { PotionRarityEnum, PotionTargetEnum } from '../potion.enum';
import { Potion } from '../potion.schema';

export const weaknessGasPotion: Potion = {
    // TODO: Define the weakness gas potion id
    potionId: Number.NaN,
    name: 'Weakness Gas',
    rarity: PotionRarityEnum.Common,
    description: 'Apply 3 Fatigue to an enemy',
    effects: [],
    statuses: [
        {
            name: fatigue.name,
            attachTo: PotionTargetEnum.Enemy,
            args: {
                counter: 3,
            },
        },
    ],
    usableOutsideCombat: false,
    showPointer: true,
};
