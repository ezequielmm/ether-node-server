import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { feebleStatus } from 'src/game/status/feeble/constants';
import { fatigue } from 'src/game/status/fatigue/constants';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService as EB } from '../enemy-builder.service';
import { burn } from 'src/game/status/burn/constants';
import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { CardTargetedEnum } from '../../card/card.enum';
import { onFireStatus } from 'src/game/status/onFire/constants';

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------

const getSignatureMove = (onFireCounter:number, animationId:string):EnemyIntention => {
    return {
        name: "Self-Immolation",
        type: EnemyIntentionType.Signature,
        target: CardTargetedEnum.Self,
        value: 2,
        negateDamage: 8,
        effects: [
            {
                effect: attachStatusEffect.name,
                target: CardTargetedEnum.Self,
                args: {
                    statusName: burn.name,
                    statusArgs: {
                        counter: 2,
                    },
                },
                action: {
                    name: animationId,
                    hint: animationId,
                },
            },
            {
                effect: attachStatusEffect.name,
                target: CardTargetedEnum.Self,
                args: {
                    statusName: onFireStatus.name,
                    statusArgs: {
                        counter: onFireCounter,
                    },
                },
                action: {
                    name: animationId,
                    hint: animationId,
                },
            },
        ],
    }
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options:[
        { id: 1, probability: 0.2, cooldown: 0, intents: [EB.createBasicAttackIntent(8, EB.ATTACK)] },
        { id: 2, probability: 0.2, cooldown: 0, intents: [
            EB.createBasicAttackIntent(8, EB.ATTACK_BURN), 
            EB.createBasicDebuffIntent(1, burn.name, EB.ATTACK_BURN)
        ]},
        { id: 3, probability: 0.2, cooldown: 0, intents: [EB.createDefenseIntent(11, EB.DEFEND)] },
        { id: 4, probability: 0.1, cooldown: 0, intents: [EB.createBasicBuffIntent(2, resolveStatus.name, EB.BUFF)] },
        { id: 5, probability: 0.1, cooldown: 0, intents: [EB.createBasicDebuffIntent(2, feebleStatus.name, EB.DEBUFF)] },
        { id: 6, probability: 0.2, cooldown: 0, intents: [getSignatureMove(3, EB.SIGNATURE_MOVE)] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 7,  probability: 0.3, cooldown: 0, intents: [
            EB.createBreachAttack(8, EB.BREACH_BURN), 
            EB.createBasicDebuffIntent(1, burn.name, EB.ATTACK_BURN)
        ]},
        { id: 8,  probability: 0.2, cooldown: 0, intents: [
            EB.createBasicAttackIntent(11, EB.ATTACK_BUFF), 
            EB.createBasicBuffIntent(2, resolveStatus.name, EB.ATTACK_BUFF)
        ]},
        { id: 9,  probability: 0.2, cooldown: 0, intents: [
            EB.createDefenseIntent(14, EB.DEFEND_BUFF), 
            EB.createBasicBuffIntent(2, resolveStatus.name, EB.DEFEND_BUFF)
        ]},
        { id: 10, probability: 0.2, cooldown: 0, intents: [
            EB.createDefenseIntent(14, EB.DEFEND_DEBUFF), 
            EB.createBasicDebuffIntent(2, fatigue.name, EB.DEFEND_DEBUFF)
        ]},
        { id: 11, probability: 0.1, cooldown: 0, intents: [
            getSignatureMove(5, EB.SIGNATURE_MOVE_ATTACK),
            EB.createBasicAttackIntent(8, EB.SIGNATURE_MOVE_ATTACK),
            EB.createBasicDebuffIntent(3, burn.name, EB.SIGNATURE_MOVE_ATTACK)
        ]},
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const fireBeetleData: Enemy = {
    enemyId: 29,
    stage: 2,
    selectable: true,
    isActive: true,
    name: 'Fire Beetle',
    type: EnemyTypeEnum.Insectoid,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Small,
    description: 'A large insect with a magical burning core. Its exoskeleton is hardened and retains heat even after death, making them sought after by blacksmiths who use them to temper blades. Though not completely fireproof, they sometimes end up immolating themselves to death in the heat of battle.',
    healthRange: [30, 40],
    aggressiveness: 0.4,
    attackLevels: [BasicIntents, AdvancedIntents]
}

