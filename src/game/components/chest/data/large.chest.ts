import { ChestSizeEnum } from '../chest.enum';
import { Chest } from '../chest.schema';

export const LargeChest: Chest = {
    name: 'Large Chest',
    chance: 17,
    size: ChestSizeEnum.Large,
    coinChance: 50,
    minCoins: 45,
    maxCoins: 55,
    potionChance: 15,
};
