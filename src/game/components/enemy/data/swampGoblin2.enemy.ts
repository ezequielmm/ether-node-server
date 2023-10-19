import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
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
    stage: 1,
    selectable: true,
    isActive: true,
    name: 'SwampGoblin2',
    type: EnemyTypeEnum.Fae,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Medium,
    description:
        'Elderly and hunch-backed, she tries to appear harmless but she is aggressive and has Magic powers. Her MAGIC SPORE STAFF is like a huge wand - it can be used to cover enemies in magic toxic spores and choke them',
    healthRange: [24, 30],
    scripts: [
        {
            id: 0,
            intentions: [],
            next: [
                { probability: 0.7, scriptId: 1 },
                { probability: 0.3, scriptId: 2 },
            ],
        },
        {
            id: 1,
            intentions: [
                {
                    type: EnemyIntentionType.Buff,
                    target: CardTargetedEnum.Self,
                    value: 2,
                    effects: [
                        {
                            effect: attachStatusEffect.name,
                            target: CardTargetedEnum.Self,
                            args: {
                                statusName: resolveStatus.name,
                                statusArgs: {
                                    counter: 3,
                                },
                            },
                            action: {
                                name: 'Enrage',
                                hint: 'cast1',
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 1,
                    scriptId: 2,
                },
            ],
        },
        {
            id: 2,
            intentions: [
                {
                    type: EnemyIntentionType.Attack,
                    target: CardTargetedEnum.Player,
                    value: 6,
                    effects: [
                        {
                            effect: damageEffect.name,
                            target: CardTargetedEnum.Player,
                            args: {
                                value: 6,
                            },
                            action: {
                                name: 'Strike',
                                hint: 'attack1',
                            },
                        },
                    ],
                },
            ],
            next: [
                {
                    probability: 0.7,
                    scriptId: 1,
                },
                {
                    probability: 0.3,
                    scriptId: 2,
                },
            ],
        },
    ],
};
