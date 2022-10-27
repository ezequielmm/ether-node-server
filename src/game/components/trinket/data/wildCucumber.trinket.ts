import { TrinketRarityEnum } from '../trinket.enum';
import { Trinket } from '../trinket.schema';

export const WildCucumberTrinket: Trinket = {
    trinketId: 1,
    name: 'Wild Cucumber',
    rarity: TrinketRarityEnum.Common,
    description: 'On pickup, upgrade 1 Attack card',
    effects: [],
};
