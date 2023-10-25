import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { fatigue } from 'src/game/status/fatigue/constants';
import { feebleStatus } from 'src/game/status/feeble/constants';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService as EB } from '../enemy-builder.service';
import { PoisonedCard } from '../../card/data/poisoned.card';
import { CardDestinationEnum, CardTargetedEnum } from '../../card/card.enum';
import { transformEffect } from 'src/game/effects/transform/constants';

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------

const getSignatureMove = (animationId:string):EnemyIntention => {
    return {
        name: "Develop",
        type: EnemyIntentionType.Signature,
        target: CardTargetedEnum.Player,
        value: 0,
        negateDamage: 12,
        effects: [
            {
                effect: transformEffect.name,
                target: CardTargetedEnum.Self,
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
    options:[
        { id: 1, probability: 0.3, cooldown: 0, intents: [EB.createBasicAttackIntent(10, EB.ATTACK)] },
        { id: 3, probability: 0.1, cooldown: 0, intents: [EB.createDefenseIntent(12, EB.DEFEND)] },
        { id: 4, probability: 0.2, cooldown: 0, intents: [EB.createBasicBuffIntent(1, resolveStatus.name, EB.BUFF)] },
        { id: 5, probability: 0.1, cooldown: 0, intents: [EB.createBasicDebuffIntent(1, fatigue.name, EB.DEBUFF)] },
        { id: 6, probability: 0.3, cooldown: 0, intents: [EB.createBasicDebuffIntent(2, feebleStatus.name, EB.DEBUFF2)] }
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 7,  probability: 0.1, cooldown: 0, intents: [
            EB.createBasicAttackIntent(10, EB.ATTACK_BUFF), 
            EB.createBasicBuffIntent(1, resolveStatus.name, EB.ATTACK_BUFF)
        ] },
        { id: 8,  probability: 0.1, cooldown: 0, intents: [
            EB.createBasicAttackIntent(10, EB.ATTACK_DEBUFF), 
            EB.createBasicDebuffIntent(2, feebleStatus.name, EB.ATTACK_DEBUFF)
        ] },
        { id: 9,  probability: 0.1, cooldown: 0, intents: [
            EB.createDefenseIntent(12, EB.DEFEND_BUFF), 
            EB.createBasicBuffIntent(1, resolveStatus.name, EB.DEFEND_BUFF)
        ] },
        { id: 10, probability: 0.2, cooldown: 0, intents: [
            EB.createDefenseIntent(12, EB.DEFEND_DEBUFF), 
            EB.createAddCardIntent(2, PoisonedCard, CardDestinationEnum.Draw, EB.DEFEND_DEBUFF)
        ] },
        { id: 11, probability: 0.2, cooldown: 0, intents: [EB.createInfectIntent(9, 1, EB.INFECT)] },
        { id: 12, probability: 0.3, cooldown: 0, intents: [getSignatureMove(EB.SIGNATURE_MOVE)] }
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const mossyBonesData: Enemy = {
    enemyId: 31,
    stage: 2,
    selectable: true,
    isActive: true,
    name: 'Mossy Bones',
    type: EnemyTypeEnum.Undead,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Medium,
    description: 'A Mold that uses the remnants of a fallen warrior to defend itself in battle.',
    healthRange: [20, 35],
    aggressiveness: 0.4,
    attackLevels: [BasicIntents, AdvancedIntents]
}

