import { TrinketRarityEnum } from 'src/game/components/trinket/trinket.enum';

export const trinketCostRangeByRarity: {
    [key: string]: [number, number];
} = {
    [TrinketRarityEnum.Common]: [143, 157],
    [TrinketRarityEnum.Uncommon]: [238, 262],
    [TrinketRarityEnum.Rare]: [285, 315],
};

export const mockTrinkets = [
    {
        id: 'trinket_1',
        rarity: TrinketRarityEnum.Common,
    },
    {
        id: 'trinket_2',
        rarity: TrinketRarityEnum.Uncommon,
    },
    {
        id: 'trinket_3',
        rarity: TrinketRarityEnum.Rare,
    },
];

export const findMockTrinketById = (id: string): any => {
    return mockTrinkets.find((trinket) => trinket.id === id);
};
