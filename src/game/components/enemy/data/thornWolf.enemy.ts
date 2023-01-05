import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { damageEffect } from 'src/game/effects/damage/constants';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { spawnEnemyEffect } from 'src/game/effects/spawnEnemy/contants';
import { spikesStatus } from 'src/game/status/spikes/constants';
import { CardTargetedEnum } from '../../card/card.enum';
import {
    EnemyTypeEnum,
    EnemyCategoryEnum,
    EnemySizeEnum,
    EnemyIntentionType,
} from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { thornWolfPupData } from './thornWolfPup.enemy';

export const thornWolfData: Enemy = {
    enemyId: 11,
    name: 'ThornWolf',
    type: EnemyTypeEnum.Plant,
    category: EnemyCategoryEnum.Elite,
    size: EnemySizeEnum.Large,
    description:
        'Imposing wolf-cat creature with multiple eyes and sharp thorns. Mutated by the bacteria in the swamp, he is half animal, half plant and an itchy fungal slime grows on him, making him extremely irritable. He claws at knights with his massive toxic THORN CLAWS',
    healthRange: [85, 90],
    scripts: [
        // {
        //     id: 0,
        //     intentions: [],
        //     next: [
        //         { probability: 0.5, scriptId: 1 },
        //         { probability: 0.5, scriptId: 2 },
        //     ],
        // },
        // {
        //     id: 1,
        //     intentions: [
        //         {
        //             type: EnemyIntentionType.Attack,
        //             target: CardTargetedEnum.Player,
        //             value: 15,
        //             //  This effect 'Summon ' was not developed so I have added 'damageEffect' one
        //             //  TODO: Add Summon effect
        //             effects: [
        //                 {
        //                     effect: damageEffect.name,
        //                     target: CardTargetedEnum.Player,
        //                     args: {
        //                         value: 15,
        //                     },
        //                 },
        //             ],
        //         },
        //     ],
        //     next: [
        //         {
        //             probability: 0.5,
        //             scriptId: 3,
        //         },
        //         {
        //             probability: 0.5,
        //             scriptId: 4,
        //         },
        //     ],
        // },
        // {
        //     id: 2,
        //     intentions: [
        //         {
        //             type: EnemyIntentionType.Attack,
        //             target: CardTargetedEnum.Player,
        //             value: 6,
        //             effects: [
        //                 {
        //                     effect: damageEffect.name,
        //                     target: CardTargetedEnum.Player,
        //                     args: {
        //                         value: 6,
        //                     },
        //                 },
        //             ],
        //         },
        //         {
        //             type: EnemyIntentionType.Attack,
        //             target: CardTargetedEnum.Player,
        //             value: 6,
        //             effects: [
        //                 {
        //                     effect: damageEffect.name,
        //                     target: CardTargetedEnum.Player,
        //                     args: {
        //                         value: 6,
        //                     },
        //                 },
        //             ],
        //         },
        //     ],
        //     next: [
        //         {
        //             probability: 0.5,
        //             scriptId: 3,
        //         },
        //         {
        //             probability: 0.5,
        //             scriptId: 4,
        //         },
        //     ],
        // },
        // {
        //     id: 3,
        //     intentions: [
        //         {
        //             type: EnemyIntentionType.Defend,
        //             target: CardTargetedEnum.Self,
        //             value: 5,
        //             effects: [
        //                 {
        //                     effect: defenseEffect.name,
        //                     target: CardTargetedEnum.Self,
        //                     args: {
        //                         value: 5,
        //                     },
        //                 },
        //             ],
        //         },
        //         {
        //             type: EnemyIntentionType.Buff,
        //             target: CardTargetedEnum.Self,
        //             value: 2,
        //             effects: [
        //                 {
        //                     effect: attachStatusEffect.name,
        //                     target: CardTargetedEnum.Self,
        //                     args: {
        //                         statusName: spikesStatus.name,
        //                         statusArgs: {
        //                             counter: 2,
        //                         },
        //                     },
        //                 },
        //             ],
        //         },
        //     ],
        //     next: [
        //         {
        //             probability: 0.5,
        //             scriptId: 1,
        //         },
        //         {
        //             probability: 0.5,
        //             scriptId: 2,
        //         },
        //     ],
        // },
        {
            id: 4,
            intentions: [
                {
                    type: EnemyIntentionType.Special,
                    target: CardTargetedEnum.Self,
                    value: 1,
                    effects: [
                        {
                            effect: spawnEnemyEffect.name,
                            target: CardTargetedEnum.Self,
                            args: {
                                enemiesToSpawn: [thornWolfPupData.enemyId],
                            },
                        },
                    ],
                },
            ],
            next: [
                // {
                //     probability: 0.5,
                //     scriptId: 1,
                // },
                // {
                //     probability: 0.5,
                //     scriptId: 2,
                // },
                {
                    probability: 1,
                    scriptId: 4,
                },
            ],
        },
    ],
};
