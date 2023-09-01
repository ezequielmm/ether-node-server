import { JsonEffect } from 'src/game/effects/effects.interface';
import { CardTargetedEnum } from '../card/card.enum';
import { IExpeditionCurrentNodeDataEnemy } from '../expedition/expedition.interface';
import { EnemyIntentionType } from './enemy.enum';

export interface EnemyIntention {
    type: EnemyIntentionType;
    target: CardTargetedEnum;
    value: any;
    effects?: JsonEffect[];
    negateDamage?: number;
}

export interface EnemyNextScript {
    probability: number;
    scriptId: number;
}

export interface EnemyScript {
    id: number;
    intentions: EnemyIntention[];
    next?: EnemyNextScript[];
}

export interface ExpeditionEnemy {
    type: CardTargetedEnum.Enemy;
    value: IExpeditionCurrentNodeDataEnemy;
}

export interface EnemyAction {
    options: IntentOption[];
}

export interface IntentOption {
    id: number;
    probability: number;
    intents: EnemyIntention[];
    cooldown: number;
}
