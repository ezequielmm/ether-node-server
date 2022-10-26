import { TrinketRarityEnum } from '../trinket.enum';
import { Trinket } from '../trinket.schema';

export const TomeOfWisdomTrinket: Trinket = {
    name: 'Tome of Wisdom',
    rarity: TrinketRarityEnum.Common,
    description: 'At the start of combat, draw 2 cards',
    effects: [],
};
