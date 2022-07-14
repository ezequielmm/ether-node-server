import { CharacterClassEnum } from './character.enum';
import { Character } from './character.schema';

export const CharacterData: Character[] = [
    {
        name: 'Knight',
        description: 'Initial Player',
        initialHealth: 80,
        initialGold: 0,
        characterClass: CharacterClassEnum.Knight,
        deckSettings: {
            cards: [
                {
                    cardId: 1,
                    amount: 4,
                },
                {
                    cardId: 3,
                    amount: 2,
                },
                {
                    cardId: 75,
                    amount: 1,
                },
                {
                    cardId: 9,
                    amount: 1,
                },
                {
                    cardId: 13,
                    amount: 1,
                },
                {
                    cardId: 41,
                    amount: 1,
                },
            ],
        },
    },
];
