import { CombatQueueTargetTypeEnum } from './combatQueue.enum';
import { CombatQueue } from './combatQueue.schema';

export interface ICombatQueueTarget {
    targetType: CombatQueueTargetTypeEnum;
    targetId: string;
    healthDelta: number;
    finalHealth: number;
    defenseDelta: number;
    finalDefense: number;
    statuses: ICombatQueueTargetStatus[];
}

export interface ICombatQueueTargetStatus {
    name: string;
    description: string;
    counter: number;
}

export type CreateCombatQueueDTO = CombatQueue;
