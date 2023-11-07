import { AttackCard } from "../../card/data/attack.card";
import { BraceCard } from "../../card/data/brace.card";
import { CounterCard } from "../../card/data/counter.card";
import { DefenseCard } from "../../card/data/defend.card";
import { FindWeaknessCard } from "../../card/data/findWeakness.card";
import { CharacterClassEnum } from "../character.enum";
import { Character } from "../character.schema";

export const BlessedVillagerInitiatedCharacter: Character = {
    name: 'Blessed Villager Initiated',
    contractId: '',
    contractIdTest: '0x081A6aC81CC8C2e88963f4068bF3abeB9b2BdeC8',
    description: 'Blessed Villager Character',
    canCompete: true,
    initialHealth: 70,
    initialGold: 0,
    characterClass: CharacterClassEnum.BlessedVillagerInitiated,
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