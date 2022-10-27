import { TrinketRarityEnum } from '../trinket.enum';
import { Trinket } from '../trinket.schema';

export const PineReinTrinket: Trinket = {
    trinketId: 2,
    name: 'Pine Resin',
    rarity: TrinketRarityEnum.Common,
    description: 'When taking unblocked damage, reduce damage by 1',
    effects: [],
};
