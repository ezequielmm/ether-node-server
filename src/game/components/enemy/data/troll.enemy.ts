import { feebleStatus } from "src/game/status/feeble/constants";
import { resolveStatus } from "src/game/status/resolve/constants";
import { EnemyBuilderService as EB } from "../enemy-builder.service";
import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from "../enemy.enum";
import { EnemyAction, EnemyIntention } from "../enemy.interface";
import { Enemy } from "../enemy.schema";
import { fatigue } from "src/game/status/fatigue/constants";
import { CardTargetedEnum } from "../../card/card.enum";
import { breachEffect } from "src/game/effects/breach/constants";
import { damageEffect } from "src/game/effects/damage/constants";

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const getSignatureMove = (animationId:string):EnemyIntention => {
    return {
        name: "Clobber",
        type: EnemyIntentionType.Signature,
        target: CardTargetedEnum.Player,
        value: 12,
        negateDamage: 12,
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 12,
                    multiplier: 3,
                },
                action: {
                    name: animationId,
                    hint: animationId,
                },
            },
            {
                effect: breachEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 15,
                },
                action: {
                    name: animationId,
                    hint: animationId,
                },
            },
        ]
    }
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options: [
        { id: 1, probability: 0.1, cooldown: 0, intents:[EB.createBasicAttackIntent(15, EB.ATTACK)] },
        { id: 2, probability: 0.1, cooldown: 0, intents:[
            EB.createBasicAttackIntent(12, EB.ATTACK_DEBUFF), 
            EB.createBasicDebuffIntent(1, feebleStatus.name, EB.ATTACK_DEBUFF)
        ] },
        { id: 3, probability: 0.2, cooldown: 0, intents:[EB.createDefenseIntent(10, EB.DEFEND)] },
        { id: 4, probability: 0.2, cooldown: 0, intents:[EB.createBasicBuffIntent(3, resolveStatus.name, EB.BUFF)] },
        { id: 5, probability: 0.2, cooldown: 0, intents:[EB.createBasicDebuffIntent(2, feebleStatus.name, EB.DEBUFF)] },
        { id: 6, probability: 0.2, cooldown: 0, intents:[EB.createCounterAttack(EB.COUNTER)] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 7, probability: 0.2, cooldown:  0, intents: [
            EB.createBasicAttackIntent(15, EB.ATTACK_BUFF), 
            EB.createBasicBuffIntent(3, resolveStatus.name, EB.ATTACK_BUFF)
        ] },
        { id: 8, probability: 0.2, cooldown:  0, intents: [
            EB.createDefenseIntent(10, EB.DEFEND_BUFF), 
            EB.createBasicBuffIntent(2, resolveStatus.name, EB.DEFEND_BUFF)
        ] },
        { id: 9, probability: 0.2, cooldown:  0, intents: [
            EB.createCounterAttack(EB.COUNTER_BUFF), 
            EB.createBasicBuffIntent(1, resolveStatus.name, EB.COUNTER_BUFF)
        ] },
        { id: 10, probability: 0.2, cooldown: 0, intents: [
            EB.createDefenseIntent(10, EB.DEFEND_DEBUFF), 
            EB.createBasicDebuffIntent(2, fatigue.name, EB.DEFEND_DEBUFF)
        ] },
        { id: 11, probability: 0.2, cooldown: 0, intents: [getSignatureMove(EB.SIGNATURE_MOVE)] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------

export const trollData: Enemy = {
    enemyId: 50,
    stage: 2,
    selectable: true,
    isActive: true,
    name: 'Troll',
    type: EnemyTypeEnum.Beast,
    category: EnemyCategoryEnum.Elite,
    size: EnemySizeEnum.Large,
    description: 'todo:..',
    healthRange: [120, 130],
    aggressiveness: 0.3,
    attackLevels: [BasicIntents, AdvancedIntents]
}