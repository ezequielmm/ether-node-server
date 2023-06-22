import { CharacterClassEnum } from '../character.enum';
import { Character } from '../character.schema';
import { AttackCard } from '../../card/data/attack.card';
import { DefenseCard } from '../../card/data/defend.card';
import { BraceCard } from '../../card/data/brace.card';
import { CounterCard } from '../../card/data/counter.card';
import { FindWeaknessCard } from '../../card/data/findWeakness.card';

export const BlessedVillagerCharacter: Character = {
    name: 'Blessed Villager',
    contractId: '0x73DdCE2656c343dc6655e76202768c703D1f540B',
    contractIdTest: '0xbFfd759b9F7d07ac76797cc13974031Eb23e5757',
    description: 'Blessed Villager Character',
    canCompete: true,
    initialHealth: 70,
    initialGold: 0,
    characterClass: CharacterClassEnum.BlessedVillager,
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
        common: 50,
        uncommon: 30,
        rare: 15,
        epic: 4.9,
        legendary: 0.1,
    },
    lootboxSize: 3,
};
