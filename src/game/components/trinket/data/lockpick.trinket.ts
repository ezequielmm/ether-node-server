import { TrinketRarityEnum } from '../trinket.enum';
import { Trinket } from '../trinket.schema';

export const LockpitTrinket: Trinket = {
    trinketId: 21,
    name: 'Lockpit',
    rarity: TrinketRarityEnum.Uncommon,
    description:
        'If an attack does not penetrate enemy Defense, deal 3 extra damage',
    effects: [],
};
