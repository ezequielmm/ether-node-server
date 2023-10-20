import {
    EnemyTypeEnum,
    EnemyCategoryEnum,
    EnemySizeEnum,
    EnemyIntentionType,
} from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService as EB } from '../enemy-builder.service';
import { spikesStatus } from 'src/game/status/spikes/constants';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { feebleStatus } from 'src/game/status/feeble/constants';
import { CardTargetedEnum } from '../../card/card.enum';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { damageEffect } from 'src/game/effects/damage/constants';
import { addCardEffect } from 'src/game/effects/addCard/contants';
import { AddCardPosition } from 'src/game/effects/effects.enum';
import { MoldCard } from '../../card/data/mold.card';


//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------

const getSignatureMove = (animationId:string):EnemyIntention => {
    return {
        name: "Mold Shower",
        type: EnemyIntentionType.Signature,
        target: CardTargetedEnum.Player,
        value: 7,
        negateDamage: 5,
        effects: [
            {
                effect: defenseEffect.name,
                target: CardTargetedEnum.Self,
                args: {
                    value: 12,
                },
                action: {
                    name: animationId,
                    hint: animationId,
                },
            },
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 7,
                    multiplier: 2,
                },
                action: {
                    name: animationId,
                    hint: animationId,
                },
            },
            {
                effect: addCardEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 1,
                    cardId: MoldCard.cardId,     
                    destination: 'draw',
                    position: AddCardPosition.Random,
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
    options:[
        { id: 1, probability: 0.2, cooldown: 0, intents: [EB.createBasicAttackIntent(8, EB.ATTACK)] },
        { id: 2, probability: 0.2, cooldown: 0, intents: [EB.createMultiplierAttackIntent(8, 2, EB.ATTACK2)] },
        { id: 3, probability: 0.1, cooldown: 0, intents: [EB.createDefenseIntent(8, EB.DEFEND)] },
        { id: 4, probability: 0.2, cooldown: 0, intents: [EB.createBasicBuffIntent(1, spikesStatus.name, EB.BUFF)] },
        { id: 5, probability: 0.1, cooldown: 0, intents: [EB.createBasicBuffIntent(1, resolveStatus.name, EB.BUFF2)] },
        { id: 6, probability: 0.1, cooldown: 0, intents: [EB.createBasicDebuffIntent(1, feebleStatus.name, EB.DEBUFF)] },
        { id: 7, probability: 0.1, cooldown: 0, intents: [getSignatureMove(EB.SIGNATURE_MOVE)] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 8,  probability: 0.2, cooldown: 0, intents: [
            EB.createBasicAttackIntent(8, EB.ATTACK_BUFF), 
            EB.createBasicBuffIntent(1, resolveStatus.name, EB.ATTACK_BUFF)
        ] },
        { id: 9,  probability: 0.3, cooldown: 0, intents: [
            EB.createDefenseIntent(8, EB.DEFEND_BUFF), 
            EB.createBasicBuffIntent(1, spikesStatus.name, EB.DEFEND_BUFF)
        ] },
        { id: 10, probability: 0.3, cooldown: 0, intents: [
            EB.createDefenseIntent(8, EB.DEFEND_DEBUFF), 
            EB.createBasicDebuffIntent(1, feebleStatus.name, EB.DEFEND_DEBUFF)
        ] },
        { id: 11, probability: 0.2, cooldown: 0, intents: [
            getSignatureMove(EB.SIGNATURE_DEBUFF), 
            EB.createBasicDebuffIntent(1, feebleStatus.name, EB.SIGNATURE_DEBUFF)
        ] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const centipionData: Enemy = {
    enemyId: 19,
    stage: 2,
    selectable: true,
    isActive: true,
    name: 'Centipion',
    type: EnemyTypeEnum.Insectoid,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Medium,
    description: 'A human-sized centipede that has been completely overtaken by the Mold. It´s long dead, but its carcass serves the Mold as an instrument for locomotion, expansion, and more crucially, nourishment.',
    healthRange: [15, 25],
    aggressiveness: 0.4,
    attackLevels: [BasicIntents, AdvancedIntents]
};
