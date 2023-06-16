import { CharacterClassEnum } from '../character.enum';
import { Character } from '../character.schema';
import { AttackCard } from '../../card/data/attack.card';
import { DefenseCard } from '../../card/data/defend.card';
import { BraceCard } from '../../card/data/brace.card';
import { CounterCard } from '../../card/data/counter.card';
import { FindWeaknessCard } from '../../card/data/findWeakness.card';

export const VillagerCharacter: Character = {
    name: 'Villager',
    contractId: '0x913dB69145f33Af291F46E980e4c0CaBBfcC27AA',
    contractIdTest: '0x913dB69145f33Af291F46E980e4c0CaBBfcC27AA',
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
        common: 80,
        uncommon: 20,
        rare: 0,
        epic: 0,
        legendary: 0,
    },
    lootboxSize: 2,
};
