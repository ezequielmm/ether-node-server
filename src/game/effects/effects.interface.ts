import { CardTargetedEnum } from '../components/card/card.enum';
import { EnemyId } from '../components/enemy/enemy.type';
import { Expedition } from '../components/expedition/expedition.schema';
import { Context, ExpeditionEntity } from '../components/interfaces';

export interface Effect {
    name: string;
}

export interface EffectMetadata {
    effect: Effect;
}

export interface EffectDTO<
    Args extends Record<string, any> = Record<string, any>,
> {
    readonly ctx: Context;
    readonly source: ExpeditionEntity;
    readonly target?: ExpeditionEntity;
    args: {
        readonly initialValue: number;
        currentValue: number;
    } & Args;
}

export interface JsonEffect {
    effect: Effect['name'];
    target?: CardTargetedEnum;
    times?: number;
    args: {
        value: number;
    } & Record<string, any>;
}

export interface EffectHandler {
    handle(dto: EffectDTO): Promise<void>;
}

export interface ApplyAllDTO {
    ctx: Context;
    source: ExpeditionEntity;
    effects: JsonEffect[];
    selectedEnemy?: EnemyId;
}

export interface ApplyDTO {
    ctx: Context;
    source: ExpeditionEntity;
    target: ExpeditionEntity;
    effect: JsonEffect;
}

export interface FindTargetsDTO {
    ctx: Context;
    source: ExpeditionEntity;
    effect: JsonEffect;
    selectedEnemy?: EnemyId;
}

export interface ExtractTargetsDTO {
    expedition: Expedition;
    enemyId?: EnemyId;
}

export interface MutateDTO {
    ctx: Context;
    dto: EffectDTO;
    effect: Effect['name'];
}
