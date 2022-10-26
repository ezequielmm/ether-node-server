import { TrinketRarityEnum } from '../trinket.enum';
import { Trinket } from '../trinket.schema';

export const StrongCoffeeTrinket: Trinket = {
    name: 'Strong Coffee',
    rarity: TrinketRarityEnum.Common,
    description: 'Every 3 turns, gain 1 Energy',
    effects: [],
};
