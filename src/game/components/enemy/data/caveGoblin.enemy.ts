import { damageEffect } from 'src/game/effects/damage/constants';
import { CardTargetedEnum } from '../../card/card.enum';
import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { feebleStatus } from 'src/game/status/feeble/constants';
import { hiddenStatus } from 'src/game/status/hidden/constants';
import { EnemyIntention } from '../enemy.interface';

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicAttack: EnemyIntention =
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
            action: {
                name: 'attack1',
                hint: 'attack1',
            },
        },
    ],
}

const SecondAttack: EnemyIntention =
{
    type: EnemyIntentionType.Attack,
    target: CardTargetedEnum.Player,
    value: 12,
    effects: [
        {
            effect: damageEffect.name,
            target: CardTargetedEnum.Player,
            args: {
                value: 4,
                multiplier: 3,
            },
            action: {
                name: 'attack2',
                hint: 'attack2',
            },
        },
    ],
}

const BasicDefense: EnemyIntention =
{
    type: EnemyIntentionType.Defend,
    target: CardTargetedEnum.Self,
    value: 6,
    effects: [
        {
            effect: defenseEffect.name,
            target: CardTargetedEnum.Self,
            args: {
                value: 6,
            },
            action: {
                name: 'cast1',
                hint: 'cast1',
            },
        },
    ],
}

const BuffResolve: EnemyIntention =
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
                    counter: 2,
                },
            },
            action: {
                name: 'cast1',
                hint: 'cast1',
            },
        },
    ],
}

const DebuffFeeble: EnemyIntention =
{
    type: EnemyIntentionType.Debuff,
    target: CardTargetedEnum.Player,
    value: 1,
    effects: [
        {
            effect: attachStatusEffect.name,
            target: CardTargetedEnum.Self,
            args: {
                statusName: feebleStatus.name,
                statusArgs: {
                    counter: 1,
                },
            },
            action: {
                name: 'cast1',
                hint: 'cast1',
            },
        },
    ],
}

const SpecialAttack: EnemyIntention =
{
    type: EnemyIntentionType.Special,
    target: CardTargetedEnum.Self,
    value: 2,
    effects: [
        {
            effect: attachStatusEffect.name,
            target: CardTargetedEnum.Self,
            args: {
                statusName: hiddenStatus.name,
                statusArgs: {
                    counter: 2,
                },
            },
            action: {
                name: 'hidden_start',
                hint: 'hidden_start',
            },
        },
    ],
}

const SignatureAttack: EnemyIntention =
{
    type: EnemyIntentionType.Signature,
    target: CardTargetedEnum.Player,
    value: 6,
    negateDamage: 5,
    effects: [
        {
            effect: damageEffect.name,
            target: CardTargetedEnum.Player,
            args: {
                value: 6,
                multiplier: 3,
            },
            action: {
                name: 'attack1',
                hint: 'attack1',
            },
        },
        {
            effect: attachStatusEffect.name,
            target: CardTargetedEnum.Self,
            args: {
                statusName: hiddenStatus.name,
                statusArgs: {
                    counter: 2,
                },
            },
            action: {
                name: 'hidden_start',
                hint: 'hidden_start',
            },
        },
    ],
}



export const caveGoblinData: Enemy = {
    enemyId: 23,
    isActive: true,
    name: 'Cave Goblin',
    type: EnemyTypeEnum.Beast,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Medium,
    description: 'todo: Cave Goblin Description',
    healthRange: [20, 30],
    aggressiveness: 0.4,
    attackLevels: [
        //- Low aggressiveness options:
        {
            options: [
                {
                    id: 1,
                    probability: 0.2,
                    intents: [BasicAttack],
                    cooldown: 0
                },
                {
                    id: 2,
                    probability: 0.1,
                    intents: [SecondAttack],
                    cooldown: 0
                },
                {
                    id: 3,
                    probability: 0.1,
                    intents: [BasicDefense],
                    cooldown: 0
                },
                {
                    id: 4,
                    probability: 0.15,
                    intents: [BuffResolve],
                    cooldown: 0
                },
                {
                    id: 5,
                    probability: 0.15,
                    intents: [DebuffFeeble],
                    cooldown: 0
                },
                {
                    id: 6,
                    probability: 0.1,
                    intents: [SpecialAttack],
                    cooldown: 0
                },
                {
                    id: 7,
                    probability: 0.2,
                    intents: [SignatureAttack],
                    cooldown: 0
                },
            ]
        },
        
        //- High aggressiveness options:
        {
            options: [
                {
                    id: 8,
                    probability: 0.2,
                    intents: [
                        BasicAttack,
                        BuffResolve
                    ],
                    cooldown: 0
                },
                {
                    id: 9,
                    probability: 0.2,
                    intents: [
                        BasicDefense,
                        BuffResolve
                    ],
                    cooldown: 0
                },
                {
                    id: 10,
                    probability: 0.2,
                    intents: [
                        BasicDefense,
                        DebuffFeeble
                    ],
                    cooldown: 0
                },
                {
                    id: 11,
                    probability: 0.2,
                    intents: [
                        SpecialAttack,
                        BasicAttack
                    ],
                    cooldown: 0
                },
                {
                    id: 12,
                    probability: 0.2,
                    intents: [SignatureAttack],
                    cooldown: 2
                },
            ]
        }
    ]
}

