import { JsonEffect } from 'src/game/effects/effects.interface';
import { JsonStatus } from 'src/game/status/interfaces';
import { CardTargetedEnum } from '../card/card.enum';
import { EnemyIntentionType } from './enemy.enum';

export interface EnemyIntention {
    type: EnemyIntentionType;
    target: CardTargetedEnum;
    value: any;
    effects?: JsonEffect[];
    status?: JsonStatus[];
}

export interface EnemyNextScript {
    probability: number;
    scriptIndex: number;
}

export interface EnemyScript {
    intentions: EnemyIntention[];
    next: EnemyNextScript[];
}
