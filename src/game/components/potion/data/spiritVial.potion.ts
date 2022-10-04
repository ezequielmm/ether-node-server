import { spirited } from 'src/game/status/spirited/contants';
import { PotionRarityEnum, PotionTargetEnum } from '../potion.enum';
import { Potion } from '../potion.schema';

export const spiritVialPotion: Potion = {
    // TODO: Declare potionId
    potionId: Number.NaN,
    name: 'Spirit Vial',
    rarity: PotionRarityEnum.Uncommon,
    description: 'Gain 1 Energy each turn',
    statuses: [
        {
            name: spirited.name,
            attachTo: PotionTargetEnum.Player,
            args: {
                counter: 1,
            },
        },
    ],
    effects: [],
    usableOutsideCombat: false,
    showPointer: false,
};
