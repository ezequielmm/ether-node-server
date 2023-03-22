import { CardTargetedEnum } from '../components/card/card.enum';
import { EnemyId } from '../components/enemy/enemy.type';
import { Expedition } from '../components/expedition/expedition.schema';
import { GameContext, ExpeditionEntity } from '../components/interfaces';

export interface Effect {
    name: string;
    ghost?: boolean;
}

export interface EffectMetadata {
    effect: Effect;
}

export interface IActionHint {
    name?: string;
    hint?: string;
}

export interface EffectDTO<
    Args extends Record<string, any> = Record<string, any>,
> {
    readonly ctx: GameContext;
    readonly source: ExpeditionEntity;
    readonly target?: ExpeditionEntity;
    args: {
        readonly initialValue: number;
        currentValue: number;
    } & Args;
    action?: IActionHint;
}

export interface JsonEffect {
    effect: Effect['name'];
    target?: CardTargetedEnum;
    times?: number;
    args?: {
        value?: number;
        description?: string;
    } & Record<string, any>;
    action?: IActionHint;
}

export interface EffectHandler {
    handle(dto: EffectDTO): Promise<void>;
}

export interface ApplyAllDTO {
    ctx: GameContext;
    source: ExpeditionEntity;
    effects: JsonEffect[];
    selectedEnemy?: EnemyId;
}

export interface ApplyDTO {
    ctx: GameContext;
    source: ExpeditionEntity;
    target: ExpeditionEntity;
    effect: JsonEffect;
}

export interface FindTargetsDTO {
    ctx: GameContext;
    source: ExpeditionEntity;
    effect: JsonEffect;
    selectedEnemy?: EnemyId;
}

export interface ExtractTargetsDTO {
    expedition: Expedition;
    enemyId?: EnemyId;
}

export interface MutateDTO {
    ctx: GameContext;
    dto: EffectDTO;
    effect: Effect['name'];
}
