import { IStatusesList } from 'src/game/status/statusGenerator';
import { Context, ExpeditionEntity } from '../interfaces';
import { CombatQueueTargetEffectTypeEnum } from './combatQueue.enum';
import { CombatQueue } from './combatQueue.schema';

export interface ICombatQueueArgs {
    effectType: CombatQueueTargetEffectTypeEnum;
    healthDelta: number;
    finalHealth: number;
    defenseDelta: number;
    finalDefense: number;
    statuses: IStatusesList[];
}

export interface ICombatQueueTarget extends ICombatQueueArgs {
    targetType: ExpeditionEntity['type'];
    targetId: string;
}

export interface PushActionDTO {
    ctx: Context;
    source: ExpeditionEntity;
    target: ExpeditionEntity;
    args: ICombatQueueArgs;
}

export type CreateCombatQueueDTO = CombatQueue;
