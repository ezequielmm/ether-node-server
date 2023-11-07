import { Character } from './character.schema';
import { BlessedVillagerInitiatedCharacter } from './data/blessedVillager-initiated.character';
import { BlessedVillagerCharacter } from './data/blessedVillager.character';
import { KnightInitiatedCharacter } from './data/knight-initiated.character';
import { KnightCharacter } from './data/knight.character';
import { NonTokenVillagerCharacter } from './data/nonTokenVillager.character';
import { VillagerCharacter } from './data/villager.character';

export const CharacterData: Character[] = [
    KnightCharacter,
    KnightInitiatedCharacter,
    VillagerCharacter,
    BlessedVillagerCharacter,
    BlessedVillagerInitiatedCharacter,
    NonTokenVillagerCharacter
];
