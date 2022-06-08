import { cardCostRangeByRarity, findMockCardById, mockCards } from './cards';
import {
    findMockTrinketById,
    mockTrinkets,
    trinketCostRangeByRarity,
} from './trinkets';
import {
    findMockPotionById,
    mockPotions,
    potionCostRangeByRarity,
} from './potions';

jest.mock('src/main', () => {
    return {
        getApp: jest.fn().mockReturnValue({
            get: jest
                .fn()
                .mockReturnValueOnce({
                    findByType: jest
                        .fn()
                        .mockResolvedValueOnce(mockCards.slice(0, 5))
                        .mockResolvedValueOnce(mockCards.slice(5, 9))
                        .mockResolvedValueOnce(mockCards.slice(9, 13))
                        .mockResolvedValueOnce(mockCards.slice(13, 15)),
                })
                .mockReturnValueOnce({
                    findAll: jest.fn().mockResolvedValue(mockTrinkets),
                })
                .mockReturnValueOnce({
                    findAll: jest.fn().mockResolvedValue(mockPotions),
                }),
        }),
    };
});

import { ExpeditionMapNodeTypeEnum } from 'src/game/expedition/enums';
import Merchant from '../merchant';

describe('Merchant', () => {
    let merchant: Merchant;

    beforeEach(() => {
        merchant = new Merchant(
            1,
            1,
            1,
            ExpeditionMapNodeTypeEnum.Merchant,
            ExpeditionMapNodeTypeEnum.Merchant,
            {},
        );
    });

    describe('getRandomCards', () => {
        it('should return cards, trinkets and potions', async () => {
            await merchant.stateInitialize();
            const { cards, trinkets, potions } = merchant.state;
            expect(cards).toBeInstanceOf(Array);
            expect(cards).toHaveLength(5);

            expect(trinkets).toBeInstanceOf(Array);
            expect(trinkets).toHaveLength(3);

            expect(potions).toBeInstanceOf(Array);
            expect(potions).toHaveLength(3);

            // Check that all cards are unique using Set
            const cardIds = new Set(cards.map((card) => card.card_id));
            expect(cardIds.size).toEqual(cards.length);

            // Check costs are correct
            cards.forEach((card) => {
                const [min, max] =
                    cardCostRangeByRarity[
                        findMockCardById(card.card_id).rarity
                    ];
                expect(card.cost).toBeGreaterThanOrEqual(min);
                expect(card.cost).toBeLessThanOrEqual(max);
            });

            // Check that all trinkets are unique using Set
            const trinketIds = new Set(
                trinkets.map((trinket) => trinket.trinket_id),
            );
            expect(trinketIds.size).toEqual(trinkets.length);

            // Check costs are correct
            trinkets.forEach((trinket) => {
                const [min, max] =
                    trinketCostRangeByRarity[
                        findMockTrinketById(trinket.trinket_id).rarity
                    ];
                expect(trinket.cost).toBeGreaterThanOrEqual(min);
                expect(trinket.cost).toBeLessThanOrEqual(max);
            });

            // Check that all potions are unique using Set
            const potionIds = new Set(
                potions.map((potion) => potion.potion_id),
            );
            expect(potionIds.size).toEqual(potions.length);

            // Check costs are correct
            potions.forEach((potion) => {
                const [min, max] =
                    potionCostRangeByRarity[
                        findMockPotionById(potion.potion_id).rarity
                    ];
                expect(potion.cost).toBeGreaterThanOrEqual(min);
                expect(potion.cost).toBeLessThanOrEqual(max);
            });
        });
    });
});
