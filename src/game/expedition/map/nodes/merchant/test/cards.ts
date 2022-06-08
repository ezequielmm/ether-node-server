import { CardRarityEnum } from 'src/game/components/card/enums';

export const cardCostRangeByRarity: { [key: string]: [number, number] } = {
    [CardRarityEnum.Common]: [45, 55],
    [CardRarityEnum.Uncommon]: [68, 82],
    [CardRarityEnum.Rare]: [135, 165],
};

export const mockCards = [
    {
        id: 'card_1',
        rarity: CardRarityEnum.Common,
    },
    {
        id: 'card_2',
        rarity: CardRarityEnum.Uncommon,
    },
    {
        id: 'card_3',
        rarity: CardRarityEnum.Rare,
    },
    {
        id: 'card_4',
        rarity: CardRarityEnum.Common,
    },
    {
        id: 'card_5',
        rarity: CardRarityEnum.Uncommon,
    },
    {
        id: 'card_6',
        rarity: CardRarityEnum.Rare,
    },
    {
        id: 'card_7',
        rarity: CardRarityEnum.Common,
    },
    {
        id: 'card_8',
        rarity: CardRarityEnum.Uncommon,
    },
    {
        id: 'card_9',
        rarity: CardRarityEnum.Rare,
    },
    {
        id: 'card_10',
        rarity: CardRarityEnum.Common,
    },
    {
        id: 'card_11',
        rarity: CardRarityEnum.Uncommon,
    },
    {
        id: 'card_12',
        rarity: CardRarityEnum.Rare,
    },
    {
        id: 'card_13',
        rarity: CardRarityEnum.Common,
    },
    {
        id: 'card_14',
        rarity: CardRarityEnum.Uncommon,
    },
    {
        id: 'card_15',
        rarity: CardRarityEnum.Rare,
    },
];

export const findMockCardById = (id: string): any =>
    mockCards.find((card) => card.id === id);
