import { IStatusesList } from 'src/game/status/statusGenerator';
import {
    CombatQueueTargetEffectTypeEnum,
    CombatQueueTargetTypeEnum,
} from './combatQueue.enum';
import { CombatQueue } from './combatQueue.schema';

export interface ICombatQueueTarget {
    effectType: CombatQueueTargetEffectTypeEnum;
    targetType: CombatQueueTargetTypeEnum;
    targetId: string;
    healthDelta: number;
    finalHealth: number;
    defenseDelta: number;
    finalDefense: number;
    statuses: IStatusesList[];
}

export type CreateCombatQueueDTO = CombatQueue;
