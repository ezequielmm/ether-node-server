import { AttackQueueTargetTypeEnum } from './attackQueue.enum';
import { AttackQueue } from './attackQueue.schema';

export interface IAttackQueueTarget {
    targetType: AttackQueueTargetTypeEnum;
    targetId: string;
    healthDelta: number;
    finalHealth: number;
    defenseDelta: number;
    finalDefense: number;
}

export type CreateAttackQueueDTO = AttackQueue;

export interface FilterAttackQueueDTO {
    readonly id?: string;
    readonly expeditionId?: string;
}

export type UpdateAttackQueueDTO = Partial<CreateAttackQueueDTO>;
