import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService as EB } from '../enemy-builder.service'
import { feebleStatus } from 'src/game/status/feeble/constants';
import { CardDestinationEnum, CardTargetedEnum } from '../../card/card.enum';
import { moldPolypData } from './moldPolyp.enemy';
import { MoldCard } from '../../card/data/mold.card';
import { sporeDanceEffect } from 'src/game/effects/sporeDance/constants';

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------

const getSignatureMove = (animationId:string):EnemyIntention => {
    return {
        name: "Spore Dance",
        type: EnemyIntentionType.Signature,
        target: CardTargetedEnum.Player,
        value: 8,
        negateDamage: 15,
        effects: [
            {
                effect: sporeDanceEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 0,
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
        { id: 1, probability: 0.3, cooldown: 0, intents: [EB.createBasicAttackIntent(17, EB.ATTACK)] }, 
        { id: 4, probability: 0.1, cooldown: 0, intents: [EB.createDefenseIntent(15, EB.DEFEND)] },
        { id: 3, probability: 0.1, cooldown: 0, intents: [EB.createBasicBuffIntent(2, resolveStatus.name, EB.BUFF)] }, 
        { id: 5, probability: 0.1, cooldown: 0, intents: [EB.createAbsorbAttack(EB.ABSORB)] },
        { id: 3, probability: 0.1, cooldown: 0, intents: [EB.createBasicDebuffIntent(2, feebleStatus.name, EB.DEBUFF)] },
        { id: 6, probability: 0.3, cooldown: 0, intents: [EB.callForReinforcements([moldPolypData.enemyId], EB.CALL_FOR_REINFORCEMENTS)] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 8,  probability: 0.1,  cooldown: 0, intents: [EB.createBreachAttack(12, EB.BRECH)] },
        { id: 9,  probability: 0.1,  cooldown: 0, intents: [
            EB.createBasicAttackIntent(17, EB.ATTACK_DEBUFF), 
            EB.createAddCardIntent(1, MoldCard, CardDestinationEnum.Draw, EB.ATTACK_DEBUFF)
        ] },
        { id: 10, probability: 0.1,  cooldown: 0, intents: [EB.callForReinforcements([moldPolypData.enemyId], EB.CALL_FOR_REINFORCEMENTS)] },
        { id: 11, probability: 0.1,  cooldown: 0, intents: [
            EB.createBasicAttackIntent(17, EB.ATTACK_DEBUFF2), 
            EB.createBasicDebuffIntent(2, feebleStatus.name, EB.ATTACK_DEBUFF2)
        ] },
        { id: 12, probability: 0.1,  cooldown: 0, intents: [
            EB.createAbsorbAttack(EB.ABSORB_DEFEND), 
            EB.createDefenseIntent(15, EB.ABSORB_DEFEND)
        ] },
        { id: 13, probability: 0.1,  cooldown: 0, intents: [EB.createBasicBuffIntent(3, resolveStatus.name, EB.BUFF2)] },
        { id: 14, probability: 0.1,  cooldown: 0, intents: [EB.createMistifyAction(1, EB.MISTIFY)] },
        { id: 15, probability: 0.1,  cooldown: 0, intents: [EB.createInfectIntent(11, 2, EB.INFECT)] },
        { id: 16, probability: 0.1,  cooldown: 0, intents: [
            EB.createCounterAttack(EB.COUNTER_BUFF), 
            EB.createBasicBuffIntent(2, resolveStatus.name, EB.COUNTER_BUFF)
        ] },
        { id: 17, probability: 0.05, cooldown: 0, intents: [EB.createAddCardIntent(2, MoldCard, CardDestinationEnum.Draw, EB.DEBUFF3)] },
        { id: 18, probability: 0.05, cooldown: 0, intents: [getSignatureMove(EB.SIGNATURE_MOVE)] }
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const caveHomunculiData: Enemy = {
    enemyId: 41,
    stage: 2,
    selectable: true,
    isActive: true,
    name: 'Cave Homunculi',
    type: EnemyTypeEnum.Plant,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Large,
    description: 'A large fungoid creature. It is capable of spreading spores that produce acute hallucinations. It reproduces by infesting the innards of its prey with corrosive fungi, usually while they are still alive.',
    healthRange: [40, 50],
    aggressiveness: 0.4,
    attackLevels: [BasicIntents, AdvancedIntents]
}

