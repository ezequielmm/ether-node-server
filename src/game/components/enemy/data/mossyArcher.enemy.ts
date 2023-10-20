import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { fatigue } from 'src/game/status/fatigue/constants';
import { feebleStatus } from 'src/game/status/feeble/constants';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService as EB } from '../enemy-builder.service';
import { CardTargetedEnum } from '../../card/card.enum';
import { damageEffect } from 'src/game/effects/damage/constants';

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const getSignatureMove = (animationId:string):EnemyIntention => {
    return {
        name: "Ill Barrage",
        type: EnemyIntentionType.Signature,
        target: CardTargetedEnum.Player,
        value: 8,
        negateDamage: 8,
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 8,
                    multiplier: 4,
                },
                action: {
                    name: animationId,
                    hint: animationId,
                },
            }
        ]
    }
}


//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options:[
        { id: 1, probability: 0.3, cooldown: 0, intents: [EB.createBasicAttackIntent(9, EB.ATTACK)] },
        { id: 3, probability: 0.1, cooldown: 0, intents: [
            EB.createBasicAttackIntent(9, EB.ATTACK_DEBUFF), 
            EB.createBasicDebuffIntent(1, feebleStatus.name, EB.ATTACK_DEBUFF)
        ] },
        { id: 4, probability: 0.1, cooldown: 0, intents: [EB.createDefenseIntent(14, EB.DEFEND)] },
        { id: 5, probability: 0.1, cooldown: 0, intents: [EB.createBasicBuffIntent(2, resolveStatus.name, EB.BUFF)] },
        { id: 6, probability: 0.1, cooldown: 0, intents: [EB.createBasicDebuffIntent(1, fatigue.name, EB.DEBUFF)] },
        { id: 7, probability: 0.1, cooldown: 0, intents: [EB.createCounterAttack(EB.COUNTER)] },
        { id: 8, probability: 0.2, cooldown: 0, intents: [EB.createInfectIntent(9, 1, EB.INFECT)] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 9,  probability: 0.1, cooldown: 0, intents: [EB.createMultiplierAttackIntent(9, 2, EB.ATTACK)] },
        { id: 10, probability: 0.1, cooldown: 0, intents: [
            EB.createMultiplierAttackIntent(9, 2, EB.ATTACK_DEBUFF), 
            EB.createBasicDebuffIntent(1, feebleStatus.name, EB.ATTACK_DEBUFF)
        ] },
        { id: 11, probability: 0.1, cooldown: 0, intents: [
            EB.createMultiplierAttackIntent(9, 2, EB.ATTACK_BUFF), 
            EB.createBasicBuffIntent(2, resolveStatus.name, EB.ATTACK_BUFF)
        ] },
        { id: 12, probability: 0.1, cooldown: 0, intents: [
            EB.createDefenseIntent(14, EB.DEFEND_BUFF), 
            EB.createBasicBuffIntent(2, resolveStatus.name, EB.DEFEND_BUFF)
        ] },
        { id: 13, probability: 0.2, cooldown: 0, intents: [EB.createGrowIntent(20, 10, 3, EB.GROW)] },
        { id: 14, probability: 0.1, cooldown: 0, intents: [
            EB.createCounterAttack(EB.COUNTER_DEFEND), 
            EB.createDefenseIntent(14, EB.COUNTER_DEFEND)
        ] },
        { id: 15, probability: 0.1, cooldown: 0, intents: [
            EB.createInfectIntent(9, 1, EB.INFECT_ATTACK), 
            EB.createMultiplierAttackIntent(9, 2, EB.INFECT_ATTACK)
        ] },
        { id: 16, probability: 0.2, cooldown: 0, intents: [getSignatureMove(EB.SIGNATURE_MOVE)] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const mossyArcherData: Enemy = {
    enemyId: 32,
    stage: 2,
    selectable: true,
    isActive: true,
    name: 'Mossy Archer',
    type: EnemyTypeEnum.Undead,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Medium,
    description: 'The corpse of a fallen Archer overtaken by the Mold. It can shoot arrows as efficiently as it did when it was alive, but now it can take them without flinching too.',
    healthRange: [40, 50],
    aggressiveness: 0.4,
    attackLevels: [BasicIntents, AdvancedIntents]
}

