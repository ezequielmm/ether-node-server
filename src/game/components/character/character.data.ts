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
                    cardId: 1, // Attack
                    amount: 4,
                },
                {
                    cardId: 3, // Defend
                    amount: 2,
                },
                {
                    cardId: 75, // Heaven’s Grace
                    amount: 1,
                },
                {
                    cardId: 9, // First Move
                    amount: 1,
                },
                {
                    cardId: 113, // First Move
                    amount: 2,
                },
            ],
        },
    },
];
