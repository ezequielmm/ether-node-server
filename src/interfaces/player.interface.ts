import { CharacterClassEnum } from '@prisma/client';

export interface PlayerInterface {
    id: string;
    royal_house: string;
    class: CharacterClassEnum;
    current_act: number;
    current_node: number;
    experience: number;
    fief: number;
    coins: number;
    status: string;
}
