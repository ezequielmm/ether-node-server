import { CharacterClassEnum } from './character.enum';

export interface GetCharacterDTO {
    id?: string;
    name?: string;
    characterClass?: CharacterClassEnum;
}
