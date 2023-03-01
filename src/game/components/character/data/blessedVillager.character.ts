import { CharacterClassEnum } from '../character.enum';
import { Character } from '../character.schema';

export const BlessedVillagerCharacter: Character = {
    name: 'Blessed Villager',
    description: 'Blessed Villager Character',
    initialHealth: 50,
    initialGold: 0,
    characterClass: CharacterClassEnum.BlessedVillager,
    isActive: true,
    cards: [],
};
