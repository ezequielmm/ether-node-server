import { CharacterClassEnum } from '../character.enum';
import { Character } from '../character.schema';
import { AttackCard } from '../../card/data/attack.card';
import { DefenseCard } from '../../card/data/defend.card';
import { BraceCard } from '../../card/data/brace.card';
import { CounterCard } from '../../card/data/counter.card';
import { FindWeaknessCard } from '../../card/data/findWeakness.card';

export const NonTokenVillagerCharacter: Character = {
    name: 'Lowly Villager',
    contractId: '',
    contractIdTest: '',
    description: 'Non-Token Villager Character',
    canCompete: false,
    initialHealth: 70,
    initialGold: 0,
    characterClass: CharacterClassEnum.NonTokenVillager,
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
        common: 100,
        uncommon: 0,
        rare: 0,
        epic: 0,
        legendary: 0,
    },
};
