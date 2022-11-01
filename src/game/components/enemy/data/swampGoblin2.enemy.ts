import { damageEffect } from 'src/game/effects/damage/constants';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { CardTargetedEnum } from '../../card/card.enum';
import {
    EnemyTypeEnum,
    EnemyCategoryEnum,
    EnemySizeEnum,
    EnemyIntentionType,
} from '../enemy.enum';
import { Enemy } from '../enemy.schema';

export const swampGoblin2Data: Enemy = {
    enemyId: 4,
    name: 'SwampGoblin2',
    type: EnemyTypeEnum.Fae,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Medium,
    description:
        'Elderly and hunch-backed, she tries to appear harmless but she is aggressive and has Magic powers. Her MAGIC SPORE STAFF is like a huge wand - it can be used to cover enemies in magic toxic spores and choke them',
    healthRange: [38, 44],
    scripts: [
        {
            intentions: [
                {
                    type: EnemyIntentionType.Buff,
                    target: CardTargetedEnum.Self,
                    value: 2,
                    status: [
                        {
                            name: resolveStatus.name,
                            attachTo: CardTargetedEnum.Self,
                            args: {
                                counter: 3,
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 1,
                    scriptIndex: 1,
                },
            ],
        },
        {
            intentions: [
                {
                    type: EnemyIntentionType.Attack,
                    target: CardTargetedEnum.Player,
                    value: 8,
                    effects: [
                        {
                            effect: damageEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 8,
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.7,
                    scriptIndex: 0,
                },
                {
                    probability: 0.3,
                    scriptIndex: 1,
                },
            ],
        },
    ],
};
