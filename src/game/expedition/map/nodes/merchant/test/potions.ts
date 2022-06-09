import { PotionRarityEnum } from 'src/game/components/potion/enums';

export const potionCostRangeByRarity: { [key: string]: [number, number] } = {
    [PotionRarityEnum.Common]: [48, 52],
    [PotionRarityEnum.Uncommon]: [72, 78],
    [PotionRarityEnum.Rare]: [95, 105],
};

export const mockPotions = [
    {
        id: 'potion_1',
        rarity: PotionRarityEnum.Common,
    },
    {
        id: 'potion_2',
        rarity: PotionRarityEnum.Uncommon,
    },
    {
        id: 'potion_3',
        rarity: PotionRarityEnum.Rare,
    },
];

export const findMockPotionById = (id: string): any => {
    return mockPotions.find((potion) => potion.id === id);
};
