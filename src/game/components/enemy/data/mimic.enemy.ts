import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { spikesStatus } from 'src/game/status/spikes/constants';
import { fatigue } from 'src/game/status/fatigue/constants';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService as EB } from '../enemy-builder.service';
import { CardTargetedEnum } from '../../card/card.enum';
import { absorbEffect } from 'src/game/effects/absorb/constants';
import { counterEffect } from 'src/game/effects/counter/constants';

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------

const getSpecialAttack = (animationId:string):EnemyIntention => {
    return {
        type: EnemyIntentionType.Special,
        target: CardTargetedEnum.Player,
        value: 0,
        effects: [
            {
                effect: absorbEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 0,
                },
                action: {
                    name: animationId,
                    hint: animationId,
                },
            },
            {
                effect: counterEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 0,
                },
                action: {
                    name: animationId,
                    hint: animationId,
                },
            },
        ]
    }
}

/*
TODO: 
- signature move intent whit mimic action (Copies the last hand used by the opponent, in the same order. All buffs/defense bonuses get applied to self, all debuffs and damage is inflicted to the opponent.)
*/

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options:[
        { id: 1, probability: 0.3, cooldown: 0, intents: [EB.createBasicAttackIntent(13, EB.ATTACK)] },
        { id: 2, probability: 0.2, cooldown: 0, intents: [EB.createMultiplierAttackIntent(13, 2, EB.ATTACK2)] },
        { id: 3, probability: 0.1, cooldown: 0, intents: [EB.createDefenseIntent(11, EB.DEFEND)] },
        { id: 4, probability: 0.1, cooldown: 0, intents: [EB.createBasicBuffIntent(1, spikesStatus.name, EB.BUFF)] },
        { id: 5, probability: 0.1, cooldown: 0, intents: [EB.createBasicDebuffIntent(2, fatigue.name, EB.DEBUFF)] },
        { id: 6, probability: 0.2, cooldown: 0, intents: [EB.createCounterAttack(EB.COUNTER)] },
        //{ id: 7, probability: 0.1, cooldown: 0, intents: [SignatureMove] }
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 8,  probability: 0.3, cooldown: 0, intents: [
            EB.createBasicAttackIntent(13, EB.ATTACK_BUFF), 
            EB.createBasicBuffIntent(1, spikesStatus.name, EB.ATTACK_BUFF)
        ] },
        { id: 9,  probability: 0.2, cooldown: 0, intents: [
            EB.createDefenseIntent(11, EB.DEFEND_BUFF), 
            EB.createBasicBuffIntent(1, spikesStatus.name, EB.DEFEND_BUFF)
        ] },
        { id: 10, probability: 0.2, cooldown: 0, intents: [
            EB.createDefenseIntent(11, EB.DEFEND_DEBUFF), 
            EB.createBasicDebuffIntent(2, fatigue.name, EB.DEFEND_DEBUFF)
        ] },
        { id: 11, probability: 0.2, cooldown: 0, intents: [
            EB.createCounterAttack(EB.COUNTER_BUFF), 
            EB.createBasicBuffIntent(1, spikesStatus.name, EB.COUNTER_BUFF)
        ] },
        { id: 12, probability: 0.2, cooldown: 0, intents: [getSpecialAttack(EB.SPECIAL)] },
        //{ id: 13, probability: 0.1, cooldown: 0, intents: [SignatureMove] }
        
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const mimicData: Enemy = {
    enemyId: 27,
    stage: 2,
    selectable: false,
    isActive: true,
    name: 'Mimic',
    type: EnemyTypeEnum.Fae,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Medium,
    description: 'This shapeshifting fiend possesses the ability to probe into the heart of men. Sensing the avarice of those who venture beyond the portal, it takes the shape of a treasure chest and feeds off adventurers avarice… and limbs.',
    healthRange: [60, 75],
    aggressiveness: 0.5,
    attackLevels: [BasicIntents, AdvancedIntents]
}

