import { damageEffect } from 'src/game/effects/damage/constants';
import { CardTargetedEnum } from '../../card/card.enum';
import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { feebleStatus } from 'src/game/status/feeble/constants';
import { hiddenStatus } from 'src/game/status/hidden/constants';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService as EB } from '../enemy-builder.service';

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const getSpecialAttack = (animationId:string):EnemyIntention => {
    return {
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
                    name: animationId,
                    hint: animationId,
                },
            },
        ],
    }
}

const getSignatureMove = (animationId:string):EnemyIntention => {
    return {
        name: "Hit & Run",
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
                    name: animationId,
                    hint: animationId,
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
        { id: 2, probability: 0.1, cooldown: 0, intents: [EB.createMultiplierAttackIntent(4, 3, EB.ATTACK_HIDDEN)] },
        { id: 3, probability: 0.1, cooldown: 0, intents: [EB.createDefenseIntent(6, EB.DEFEND)] },
        { id: 4, probability: 0.2, cooldown: 0, intents: [EB.createBasicBuffIntent(2, resolveStatus.name, EB.BUFF)] },
        { id: 5, probability: 0.1, cooldown: 0, intents: [EB.createBasicDebuffIntent(1, feebleStatus.name, EB.DEBUFF)] },
        { id: 6, probability: 0.2, cooldown: 0, intents: [getSpecialAttack(EB.SPECIAL)] },
        { id: 7, probability: 0.1, cooldown: 0, intents: [getSignatureMove(EB.SIGNATURE_MOVE)] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 8,  probability: 0.3, cooldown: 0, intents: [
            EB.createBasicAttackIntent(8, EB.ATTACK_BUFF), 
            EB.createBasicBuffIntent(2, resolveStatus.name, EB.ATTACK_BUFF)
        ] },
        { id: 9,  probability: 0.2, cooldown: 0, intents: [
            EB.createDefenseIntent(6, EB.DEFEND_BUFF), 
            EB.createBasicBuffIntent(2, resolveStatus.name, EB.DEFEND_BUFF)
        ] },
        { id: 10, probability: 0.2, cooldown: 0, intents: [
            EB.createDefenseIntent(6, EB.DEFEND_DEBUFF), 
            EB.createBasicDebuffIntent(1, feebleStatus.name, EB.DEFEND_DEBUFF)
        ] },
        { id: 11, probability: 0.2, cooldown: 0, intents: [
            getSpecialAttack(EB.SPECIAL_ATTACK), 
            EB.createBasicAttackIntent(8, EB.SPECIAL_ATTACK)
        ] },
        { id: 12, probability: 0.1, cooldown: 0, intents: [getSignatureMove(EB.SIGNATURE_MOVE)] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const caveGoblinData: Enemy = {
    enemyId: 23,
    stage: 2,
    selectable: true,
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

