import { TreasureTypeEnum } from 'src/game/treasure/treasure.enum';
import { ChestSizeEnum } from '../chest.enum';
import { Chest } from '../chest.schema';

export const SmallChest: Chest = {
    name: 'Small Chest',
    chance: 50,
    size: ChestSizeEnum.Small,
    coinChance: 50,
    minCoins: 23,
    maxCoins: 27,
    potionChance: 5,
    trappedChance: 10,
    trappedType: TreasureTypeEnum.Damage,
};
