import { distraught } from 'src/game/status/distraught/constants';
import { PotionRarityEnum, PotionTargetEnum } from '../potion.enum';
import { Potion } from '../potion.schema';

export const terrorGasPotion: Potion = {
    // TODO: Declare the potionId
    potionId: Number.NaN,
    name: 'Terror Gas',
    rarity: PotionRarityEnum.Common,
    description: 'Apply 3 Distraught to an enemy',
    statuses: [
        {
            name: distraught.name,
            attachTo: PotionTargetEnum.Enemy,
            args: {
                counter: 3,
            },
        },
    ],
    effects: [],
    usableOutsideCombat: false,
    showPointer: true,
};
