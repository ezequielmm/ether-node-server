import { CharacterClassEnum } from '../character.enum';
import { Character } from '../character.schema';

export const VillagerCharacter: Character = {
    name: 'Villager',
    description: 'Villager Character',
    initialHealth: 50,
    initialGold: 0,
    characterClass: CharacterClassEnum.Villager,
    isActive: true,
    cards: [],
};
