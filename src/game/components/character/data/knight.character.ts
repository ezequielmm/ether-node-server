import { AttackCard } from '../../card/data/attack.card';
import { BraceCard } from '../../card/data/brace.card';
import { CounterCard } from '../../card/data/counter.card';
import { DefenseCard } from '../../card/data/defend.card';
import { FindWeaknessCard } from '../../card/data/findWeakness.card';
import { CharacterClassEnum } from '../character.enum';
import { Character } from '../character.schema';

export const KnightCharacter: Character = {
    name: 'Knight',
    description: 'Initial Player',
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
        common: 20,
        uncommon: 20,
        rare: 20,
        epic: 20,
        legendary: 20,
    },
};
