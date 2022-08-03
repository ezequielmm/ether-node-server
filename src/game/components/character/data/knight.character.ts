import { CharacterClassEnum } from '../character.enum';
import { Character } from '../character.schema';

export const KnightCharacter: Character = {
    name: 'Knight',
    description: 'Initial Player',
    initialHealth: 80,
    initialGold: 0,
    characterClass: CharacterClassEnum.Knight,
    cards: [
        {
            cardId: 1, // Attack
            amount: 2,
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
            cardId: 27, // Keg Chug
            amount: 1,
        },
        {
            cardId: 13, // Lunge
            amount: 1,
        },
        {
            cardId: 24, // Pray
            amount: 1,
        },
        {
            cardId: 79, // Invoke Blessing
            amount: 1,
        },
    ],
};
