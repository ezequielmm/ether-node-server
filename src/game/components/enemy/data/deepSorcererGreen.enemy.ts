import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService as EB } from '../enemy-builder.service'
import { CardDestinationEnum, CardTargetedEnum } from '../../card/card.enum';
import { feebleStatus } from 'src/game/status/feeble/constants';
import { fatigue } from 'src/game/status/fatigue/constants';
import { PoisonedCard } from '../../card/data/poisoned.card';
import { MoldCard } from '../../card/data/mold.card';
import { damageEffect } from 'src/game/effects/damage/constants';
import { sporeDanceEffect } from 'src/game/effects/sporeDance/constants';
import { addCardEffect } from 'src/game/effects/addCard/contants';
import { AddCardPosition } from 'src/game/effects/effects.enum';
import { moldPolypMinionData } from './moldPolyp-minion.enemy';


//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------

const getSignatureMove = (animationId:string):EnemyIntention => {
    return {
        name: "Root of Evil",
        type: EnemyIntentionType.Signature,
        target: CardTargetedEnum.Player,
        value: 12,
        negateDamage: 10,
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 12,
                    multiplier: 2,
                },
                action: {
                    name: animationId,
                    hint: animationId,
                },
            },
            {
                effect: sporeDanceEffect.name,
                target: CardTargetedEnum.Player,
                action: {
                    name: animationId,
                    hint: animationId,
                },
            },
            {
                effect: addCardEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 3,
                    cardId: MoldCard.cardId,     
                    destination: CardDestinationEnum.Draw,
                    position: AddCardPosition.Random,
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
        { id: 1, probability: 0.1, cooldown: 0, intents: [EB.createBasicAttackIntent(12, EB.ATTACK)] },
        { id: 2, probability: 0.1, cooldown: 0, intents: [EB.createMultiplierAttackIntent(12, 2, EB.ATTACK2)] },
        { id: 3, probability: 0.1, cooldown: 0, intents: [EB.createDefenseIntent(10, EB.DEFEND)] },
        { id: 4, probability: 0.1, cooldown: 0, intents: [EB.createBasicBuffIntent(2, resolveStatus.name, EB.BUFF)] },
        { id: 5, probability: 0.1, cooldown: 0, intents: [EB.createBasicDebuffIntent(2, feebleStatus.name, EB.DEBUFF)] },
        { id: 6, probability: 0.1, cooldown: 0, intents: [EB.createBasicDebuffIntent(2, fatigue.name, EB.DEBUFF2)] },
        { id: 7, probability: 0.1, cooldown: 0, intents: [EB.createAbsorbAttack(EB.ABSORB)] },
        { id: 8, probability: 0.2, cooldown: 0, intents: [EB.callForReinforcements([moldPolypMinionData.enemyId], EB.CALL_FOR_REINFORCEMENTS)] },
        { id: 9, probability: 0.1, cooldown: 0, intents: [EB.createMistifyAction(1, EB.MISTIFY)] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 10, probability: 0.1, cooldown: 0, intents: [
            EB.createBasicAttackIntent(12, EB.ATTACK_BUFF), 
            EB.createBasicBuffIntent(1, resolveStatus.name, EB.ATTACK_BUFF)
        ] }, 
        { id: 11, probability: 0.1, cooldown: 0, intents: [EB.createBreachAttack(11, EB.BRECH)] },
        { id: 12, probability: 0.1, cooldown: 0, intents: [
            EB.createDefenseIntent(10, EB.DEFEND_BUFF), 
            EB.createBasicBuffIntent(1, resolveStatus.name, EB.DEFEND_BUFF)
        ] },
        { id: 13, probability: 0.1, cooldown: 0, intents: [
            EB.createBasicAttackIntent(12, EB.ATTACK_DEBUFF), 
            EB.createAddCardIntent(3, PoisonedCard, CardDestinationEnum.Draw, EB.ATTACK_DEBUFF)
        ] },
        { id: 14, probability: 0.1, cooldown: 0, intents: [
            EB.createBasicAttackIntent(12, EB.ATTACK_DEBUFF2), 
            EB.createAddCardIntent(1, MoldCard, CardDestinationEnum.Draw, EB.ATTACK_DEBUFF2)
        ] },
        { id: 15, probability: 0.1, cooldown: 0, intents: [
            EB.createMultiplierAttackIntent(12, 2, EB.ATTACK_DEBUFF3), 
            EB.createAddCardIntent(2, PoisonedCard, CardDestinationEnum.Draw, EB.ATTACK_DEBUFF3)
        ] },
        { id: 16, probability: 0.1, cooldown: 0, intents: [
            EB.createAbsorbAttack(EB.ABSORB_CALL_FOR_REINFORCEMENTS), 
            EB.callForReinforcements([moldPolypMinionData.enemyId], EB.ABSORB_CALL_FOR_REINFORCEMENTS)
        ] },
        { id: 17, probability: 0.1, cooldown: 0, intents: [EB.callForReinforcements([moldPolypMinionData.enemyId], EB.CALL_FOR_REINFORCEMENTS2)] },
        { id: 18, probability: 0.1, cooldown: 0, intents: [EB.createMistifyAction(2, EB.MISTIFY2)] },
        { id: 19, probability: 0.1, cooldown: 0, intents: [getSignatureMove(EB.SIGNATURE_MOVE)] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const deepSorcererGreenData: Enemy = {
    enemyId: 56,
    stage: 2,
    selectable: true,
    isActive: true,
    name: 'Deep Sorcerer Green',
    type: EnemyTypeEnum.Human,
    category: EnemyCategoryEnum.Elite,
    size: EnemySizeEnum.Large,
    description: 'TODO: Description',
    healthRange: [75, 90],
    aggressiveness: 0.4,
    attackLevels: [BasicIntents, AdvancedIntents]
}

