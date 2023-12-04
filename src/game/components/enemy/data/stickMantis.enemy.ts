import { burn } from 'src/game/status/burn/constants';
import {
    EnemyTypeEnum,
    EnemyCategoryEnum,
    EnemySizeEnum,
    EnemyIntentionType,
    EnemyUnique,
} from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { CardTargetedEnum } from '../../card/card.enum';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService as EB } from '../enemy-builder.service';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { feebleStatus } from 'src/game/status/feeble/constants';
import { spikesStatus } from 'src/game/status/spikes/constants';

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const getSignatureMove = (animationId:string):EnemyIntention => {
    return {
        name: "Scorch",
        type: EnemyIntentionType.Signature,
        target: CardTargetedEnum.Player,
        negateDamage: 10,
        value: 10,
        effects: [
            {
                effect: attachStatusEffect.name,
                target: CardTargetedEnum.Self,
                args: {
                    statusName: burn.name,
                    statusArgs: {
                        counter: 5,
                    },
                },
                action: {
                    name: animationId,
                    hint: animationId,
                },
            },
            {
                effect: attachStatusEffect.name,
                target: CardTargetedEnum.AllEnemies,
                args: {
                    statusName: burn.name,
                    statusArgs: {
                        counter: 5,
                    },
                },
                action: {
                    name: animationId,
                    hint: animationId,
                },
            },
            {
                effect: attachStatusEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    statusName: burn.name,
                    statusArgs: {
                        counter: 5,
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
        { id: 1, probability: 0.2, cooldown: 0, intents: [EB.createBasicAttackIntent(19, EB.ATTACK)] },
        { id: 2, probability: 0.2, cooldown: 0, intents: [EB.createDefenseIntent(13, EB.DEFEND)] },
        { id: 3, probability: 0.2, cooldown: 0, intents: [EB.createBasicBuffIntent(1, resolveStatus.name, EB.BUFF)] },
        { id: 4, probability: 0.2, cooldown: 0, intents: [EB.createCounterAttack(EB.COUNTER)] },
        { id: 5, probability: 0.2, cooldown: 0, intents: [EB.createBasicDebuffIntent(2, feebleStatus.name, EB.DEBUFF)] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options:[
        { id: 6, probability:  0.2, cooldown: 0, intents: [EB.createBreachAttack(14, EB.BREACH)] },
        { id: 7, probability:  0.1, cooldown: 0, intents: [
            EB.createBasicAttackIntent(15, EB.ATTACK2),
            EB.createBasicDebuffIntent(3, burn.name, EB.ATTACK2)
        ]},
        { id: 8, probability:  0.1, cooldown: 0, intents: [
            EB.createBreachAttack(19, EB.ATTACK_DEBUFF),
            EB.createBasicDebuffIntent(1, feebleStatus.name, EB.ATTACK_DEBUFF)
        ]},
        { id: 9, probability:  0.1, cooldown: 0, intents: [EB.createBasicBuffIntent(2, spikesStatus.name, EB.BUFF2)] },
        { id: 10, probability: 0.2, cooldown: 0, intents: [
            EB.createCounterAttack(EB.COUNTER_BUFF),
            EB.createBasicBuffIntent(2, spikesStatus.name, EB.COUNTER_BUFF)
        ]},
        { id: 11, probability: 0.1, cooldown: 0, intents: [EB.createBasicDebuffIntent(3, feebleStatus.name, EB.DEBUFF2)] },
        { id: 12, probability: 0.2, cooldown: 0, intents: [getSignatureMove(EB.SIGNATURE_MOVE)] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const stickMantisData: Enemy = {
    enemyId: 20,
    stage: 2,
    selectable: false,
    isActive: false,
    name: 'Stick Mantis',
    type: EnemyTypeEnum.Beast,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Large,
    description: 'This creature usually dwells underground, and is said to nest in rivers of molten lava. It bursts out of the ground to wrap around its prey, which it usually scorches before eating.',
    healthRange: [35, 30],
    aggressiveness: 0.4,
    attackLevels: [BasicIntents, AdvancedIntents],
    unique: EnemyUnique.Firemonger
};
