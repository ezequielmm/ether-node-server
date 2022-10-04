import { spirited } from 'src/game/status/spirited/contants';
import { PotionRarityEnum, PotionTargetEnum } from '../potion.enum';
import { Potion } from '../potion.schema';

export const spiritVialPotion: Potion = {
    potionId: 8,
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
