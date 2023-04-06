import { CharacterClassEnum } from '../character.enum';
import { Character } from '../character.schema';
import { AttackCard } from '../../card/data/attack.card';
import { DefenseCard } from '../../card/data/defend.card';
import { BraceCard } from '../../card/data/brace.card';
import { CounterCard } from '../../card/data/counter.card';
import { FindWeaknessCard } from '../../card/data/findWeakness.card';

export const VillagerCharacter: Character = {
    name: 'Villager',
    contractId: '',
    contractIdTest: '0xF0aA34f832c34b32478B8D9696DC8Ad1c8065D2d',
    description: 'Villager Character',
    canCompete: true,
    initialHealth: 70,
    initialGold: 0,
    characterClass: CharacterClassEnum.Villager,
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
        common: 60,
        uncommon: 40,
        rare: 0,
        epic: 0,
        legendary: 0,
    },
};
