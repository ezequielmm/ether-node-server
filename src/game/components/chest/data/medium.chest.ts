import { TreasureTypeEnum } from 'src/game/treasure/treasure.enum';
import { ChestSizeEnum } from '../chest.enum';
import { Chest } from '../chest.schema';

export const MediumChest: Chest = {
    name: 'Medium Chest',
    chance: 33,
    size: ChestSizeEnum.Medium,
    coinChance: 33,
    minCoins: 68,
    maxCoins: 82,
    potionChance: 10,
    trappedChance: 10,
    trappedType: TreasureTypeEnum.CurseCard,
};
