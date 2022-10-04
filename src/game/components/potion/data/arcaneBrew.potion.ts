import { doubleDown } from 'src/game/status/doubleDown/contants';
import { PotionRarityEnum, PotionTargetEnum } from '../potion.enum';
import { Potion } from '../potion.schema';

export const arcaneBrewPotion: Potion = {
    // TODO: Declare potionId
    potionId: Number.NaN,
    name: 'Arcane Brew',
    rarity: PotionRarityEnum.Uncommon,
    description: 'Your next attack deals double damage',
    statuses: [
        {
            name: doubleDown.name,
            attachTo: PotionTargetEnum.Player,
            args: {
                counter: 2,
            },
        },
    ],
    effects: [],
    usableOutsideCombat: false,
    showPointer: false,
};
