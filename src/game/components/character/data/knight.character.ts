import { AttackCard } from '../../card/data/attack.card';
import { BraceCard } from '../../card/data/brace.card';
import { CounterCard } from '../../card/data/counter.card';
import { DefenseCard } from '../../card/data/defend.card';
import { FindWeaknessCard } from '../../card/data/findWeakness.card';
import { CharacterClassEnum } from '../character.enum';
import { Character } from '../character.schema';

export const KnightCharacter: Character = {
    name: 'Knight',
    contractId: '0x32A322C7C77840c383961B8aB503c9f45440c81f',
    contractIdTest: '0x80e2109a826148b9b1a41b0958ca53a4cdc64b70',
    description: 'Initial Player',
    canCompete: true,
    initialHealth: 80,
    initialGold: 0,
    characterClass: CharacterClassEnum.Knight,
    isActive: true,
    cards: [
        {
            cardId: AttackCard.cardId,
            amount: 4,
        },
        {
            cardId: DefenseCard.cardId,
            amount: 4,
        },
        {
            cardId: BraceCard.cardId,
            amount: 1,
        },
        {
            cardId: CounterCard.cardId,
            amount: 1,
        },
        {
            cardId: FindWeaknessCard.cardId,
            amount: 1,
        },
    ],
    lootboxRarity: {
        common: 45,
        uncommon: 25,
        rare: 20,
        epic: 9.8,
        legendary: 0.2,
    },
};
