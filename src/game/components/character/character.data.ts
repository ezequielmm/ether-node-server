import { Character } from './character.schema';
import { BlessedVillagerCharacter } from './data/blessedVillager.character';
import { KnightCharacter } from './data/knight.character';
import { NonTokenVillagerCharacter } from './data/nonTokenVillager.character';
import { VillagerCharacter } from './data/villager.character';

export const CharacterData: Character[] = [
    KnightCharacter,
    VillagerCharacter,
    BlessedVillagerCharacter,
    NonTokenVillagerCharacter
];
