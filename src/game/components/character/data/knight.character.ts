import { CharacterClassEnum } from '../character.enum';
import { Character } from '../character.schema';

export const KnightCharacter: Character = {
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
                cardId: 83, // Flurry
                amount: 2,
            },
        ],
    },
};

/*
Initial data
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
    cardId: 27, // Keg Chug
    amount: 2,
},
*/
