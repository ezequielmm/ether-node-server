import { CharacterClassEnum } from '@prisma/client';

export interface PlayerInterface {
    readonly id: string;
    readonly royal_house: string;
    readonly class: CharacterClassEnum;
    readonly current_act: number;
    readonly current_node: number;
    readonly experience: number;
    readonly fief: number;
    readonly coins: number;
    readonly status: string;
}
