import {
    CardRarityEnum,
    CardTargetedEnum,
    CardTypeEnum,
} from 'src/game/components/card/card.enum';
import { IExpeditionPlayerStateDeckCard } from 'src/game/components/expedition/expedition.interface';
import {
    isEven,
    isNotUndefined,
    isValidAuthToken,
    removeCardsFromPile,
} from '.';

describe('Utility Functions', () => {
    it('should verify if string is a valid token', () => {
        const token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

        const result = isValidAuthToken(token);

        expect(result).toBe(true);
    });

    it('should return false if token is not valid', () => {
        const token = 'a token';

        const result = isValidAuthToken(token);

        expect(result).toBe(false);
    });

    it('should test is if is even', () => {
        const result = isEven(2);

        expect(result).toBe(true);
    });

    it('should test if is is odd', () => {
        const result = isEven(3);

        expect(result).toBe(false);
    });

    it('should remove given cards from pile', () => {
        const originalPile: IExpeditionPlayerStateDeckCard[] = [
            {
                cardId: 1,
                id: 'bcc92fe2-0571-48cd-bdf9-e6811b100ce4',
                name: 'Attack',
                description: 'Deal {damage} Damage',
                rarity: CardRarityEnum.Starter,
                energy: 1,
                cardType: CardTypeEnum.Attack,
                pool: 'knight',
                properties: {
                    effects: [
                        {
                            effect: 'damage',
                            target: CardTargetedEnum.Enemy,
                            args: {
                                value: 5,
                            },
                        },
                    ],
                    statuses: [],
                },
                keywords: [],
                isTemporary: false,
                showPointer: true,
                isUpgraded: false,
                isActive: true,
            },
            {
                cardId: 2,
                id: '48872d01-406e-4095-8692-8eaf32ecf411',
                name: 'Heaven’s Grace',
                description: 'Heal {heal} hp',
                rarity: CardRarityEnum.Rare,
                energy: 1,
                cardType: CardTypeEnum.Skill,
                pool: 'knight',
                properties: {
                    effects: [
                        {
                            effect: 'heal',
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 2,
                            },
                        },
                    ],
                    statuses: [],
                },
                keywords: [],
                isTemporary: false,
                showPointer: false,
                isUpgraded: false,
                isActive: true,
            },
            {
                cardId: 3,
                id: '9acb234b-6d2f-4b10-a5c3-2b7638bb6bc5',
                name: 'Last Resort+',
                description:
                    'Deal X damage to yourself and X times {damage} damage to an enemy',
                rarity: CardRarityEnum.Rare,
                energy: -1,
                cardType: CardTypeEnum.Attack,
                pool: 'knight',
                properties: {
                    effects: [
                        {
                            effect: 'damage',
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 0,
                                useEnergyAsValue: true,
                            },
                        },
                        {
                            effect: 'damage',
                            target: CardTargetedEnum.AllEnemies,
                            args: {
                                value: 9,
                                useEnergyAsMultiplier: true,
                            },
                        },
                    ],
                    statuses: [],
                },
                keywords: [],
                isTemporary: false,
                showPointer: true,
                isUpgraded: true,
                isActive: true,
            },
            {
                cardId: 4,
                id: 'be115c6e-5001-459b-963c-7d687a3619e3',
                name: 'Last Resort+',
                description:
                    'Deal X damage to yourself and X times {damage} damage to an enemy',
                rarity: CardRarityEnum.Rare,
                energy: -1,
                cardType: CardTypeEnum.Attack,
                pool: 'knight',
                properties: {
                    effects: [
                        {
                            effect: 'damage',
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 0,
                                useEnergyAsValue: true,
                            },
                        },
                        {
                            effect: 'damage',
                            target: CardTargetedEnum.AllEnemies,
                            args: {
                                value: 9,
                                useEnergyAsMultiplier: true,
                            },
                        },
                    ],
                    statuses: [],
                },
                keywords: [],
                isTemporary: false,
                showPointer: true,
                isUpgraded: true,
                isActive: true,
            },
            {
                cardId: 5,
                id: 'b60ee368-0c17-4f67-90ff-3cd8607fa124',
                name: 'Attack',
                description: 'Deal {damage} Damage',
                rarity: CardRarityEnum.Starter,
                energy: 1,
                cardType: CardTypeEnum.Attack,
                pool: 'knight',
                properties: {
                    effects: [
                        {
                            effect: 'damage',
                            target: CardTargetedEnum.Enemy,
                            args: {
                                value: 5,
                            },
                        },
                    ],
                    statuses: [],
                },
                keywords: [],
                isTemporary: false,
                showPointer: true,
                isUpgraded: false,
                isActive: true,
            },
        ];

        const cardsToRemove: IExpeditionPlayerStateDeckCard[] = [
            {
                cardId: 1,
                id: 'bcc92fe2-0571-48cd-bdf9-e6811b100ce4',
                name: 'Attack',
                description: 'Deal {damage} Damage',
                rarity: CardRarityEnum.Starter,
                energy: 1,
                cardType: CardTypeEnum.Attack,
                pool: 'knight',
                properties: {
                    effects: [
                        {
                            effect: 'damage',
                            target: CardTargetedEnum.Enemy,
                            args: {
                                value: 5,
                            },
                        },
                    ],
                    statuses: [],
                },
                keywords: [],
                isTemporary: false,
                showPointer: true,
                isUpgraded: false,
                isActive: true,
            },
        ];

        const cardIdToRemove = 'bcc92fe2-0571-48cd-bdf9-e6811b100ce4';

        const result = removeCardsFromPile({
            originalPile,
            cardsToRemove,
        });

        expect(result).toEqual(
            expect.arrayContaining([
                expect.not.objectContaining({
                    id: cardIdToRemove,
                }),
            ]),
        );
    });

    it('should return true is key is defined and has a true value', () => {
        const testValue = true;

        const result = isNotUndefined(testValue);

        expect(result).toBeTruthy();
    });

    it('should return false is key is defined and has a null value', () => {
        const testValue = null;

        const result = isNotUndefined(testValue);

        expect(result).toBeFalsy();
    });

    it('should return false is key is defined and has an undefined value', () => {
        const testValue = undefined;

        const result = isNotUndefined(testValue);

        expect(result).toBeFalsy();
    });

    it('should return false is key is defined and has a false value', () => {
        const testValue = false;

        const result = isNotUndefined(testValue);

        expect(result).toBeFalsy();
    });
});
