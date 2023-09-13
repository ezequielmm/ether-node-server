import { damageEffect } from 'src/game/effects/damage/constants';
import { CardTargetedEnum } from '../../card/card.enum';
import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { feebleStatus } from 'src/game/status/feeble/constants';
import { hiddenStatus } from 'src/game/status/hidden/constants';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService } from '../enemy-builder.service';

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicAttack:     EnemyIntention = EnemyBuilderService.createBasicAttackIntent(8);
const SecondAttack:    EnemyIntention = EnemyBuilderService.createMultiplierAttackIntent(4, 3);
const BasicDefense:    EnemyIntention = EnemyBuilderService.createDefenseIntent(6);
const BuffResolve:     EnemyIntention = EnemyBuilderService.createBasicBuffIntent(2, resolveStatus.name);
const DebuffFeeble:    EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(1, feebleStatus.name);

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
                name: 'special',
                hint: 'special',
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
                name: 'signature_move',
                hint: 'signature_move',
            },
        },
        {
            effect: attachStatusEffect.name,
            target: CardTargetedEnum.Self,
            args: {
                statusName: hiddenStatus.name,
                statusArgs: {
                    counter: 3,
                },
            },
            action: {
                name: 'signature_move',
                hint: 'signature_move',
            },
        },
    ],
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options:[
        { id: 1, probability: 0.2, cooldown: 0, intents: [BasicAttack] },
        { id: 2, probability: 0.1, cooldown: 0, intents: [SecondAttack] },
        { id: 3, probability: 0.1, cooldown: 0, intents: [BasicDefense] },
        { id: 4, probability: 0.2, cooldown: 0, intents: [BuffResolve] },
        { id: 5, probability: 0.1, cooldown: 0, intents: [DebuffFeeble] },
        { id: 6, probability: 0.2, cooldown: 0, intents: [SpecialAttack] },
        { id: 7, probability: 0.1, cooldown: 0, intents: [SignatureAttack] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 8,  probability: 0.3, cooldown: 0, intents: [BasicAttack, BuffResolve] },
        { id: 9,  probability: 0.2, cooldown: 0, intents: [BasicDefense, BuffResolve] },
        { id: 10, probability: 0.2, cooldown: 0, intents: [BasicDefense, DebuffFeeble] },
        { id: 11, probability: 0.2, cooldown: 0, intents: [SpecialAttack, BasicAttack] },
        { id: 12, probability: 0.1, cooldown: 0, intents: [SignatureAttack] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const caveGoblinData: Enemy = {
    enemyId: 23,
    isActive: true,
    name: 'Cave Goblin',
    type: EnemyTypeEnum.Goblin,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Medium,
    description: 'These savage and opportunistic creatures dwell in caves, lurking in the shadows and pouncing on unsuspecting prey.',
    healthRange: [20, 30],
    aggressiveness: 0.4,
    attackLevels: [BasicIntents, AdvancedIntents]
}

