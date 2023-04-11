import { IStatusesList } from 'src/game/status/statusGenerator';
import { GameContext, ExpeditionEntity } from '../interfaces';
import { CombatQueueTargetEffectTypeEnum } from './combatQueue.enum';
import { CombatQueue } from './combatQueue.schema';
import { IActionHint } from 'src/game/effects/effects.interface';

export interface ICombatQueueArgs {
    effectType: CombatQueueTargetEffectTypeEnum;
    healthDelta?: number;
    finalHealth?: number;
    defenseDelta?: number;
    finalDefense?: number;
    statuses: IStatusesList[];
}

export interface ICombatQueueTarget extends ICombatQueueArgs {
    targetType: ExpeditionEntity['type'];
    targetId: string;
}

export interface PushActionDTO {
    ctx: GameContext;
    source: ExpeditionEntity;
    target: ExpeditionEntity;
    args: ICombatQueueArgs;
    action?: IActionHint;
}

export type CreateCombatQueueDTO = CombatQueue;
