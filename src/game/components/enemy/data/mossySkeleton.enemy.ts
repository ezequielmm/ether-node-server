import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { fatigue } from 'src/game/status/fatigue/constants';
import { feebleStatus } from 'src/game/status/feeble/constants';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService as EB } from '../enemy-builder.service';
import { CardDestinationEnum, CardTargetedEnum } from '../../card/card.enum';
import { breachEffect } from 'src/game/effects/breach/constants';
import { addCardEffect } from 'src/game/effects/addCard/contants';
import { AddCardPosition } from 'src/game/effects/effects.enum';
import { DecayCard } from '../../card/data/decay.card';
import { PoisonedCard } from '../../card/data/poisoned.card';

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------

const getSignatureMove = (animationId:string):EnemyIntention => {
    return {
        name: "Ill Blade",
        type: EnemyIntentionType.Signature,
        target: CardTargetedEnum.Player,
        value: 12,
        negateDamage: 10,
        effects: [
            {
                effect: breachEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 12,
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
                    value: 2,
                    cardId: DecayCard.cardId,     
                    destination: CardDestinationEnum.Draw,
                    position: AddCardPosition.Random,
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
                    value: 2,
                    cardId: PoisonedCard.cardId,     
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
        { id: 1, probability: 0.2, cooldown: 0, intents: [EB.createBasicAttackIntent(14, EB.ATTACK_SWORD)] },
        { id: 2, probability: 0.2, cooldown: 0, intents: [
            EB.createBasicAttackIntent(9, EB.ATTACK_ARROW_DEBUFF), 
            EB.createBasicDebuffIntent(1, feebleStatus.name, EB.ATTACK_ARROW_DEBUFF)
        ] },
        { id: 3, probability: 0.1, cooldown: 0, intents: [EB.createDefenseIntent(14, EB.DEFEND)] },
        { id: 4, probability: 0.2, cooldown: 0, intents: [EB.createBasicBuffIntent(2, resolveStatus.name, EB.BUFF)] },
        { id: 5, probability: 0.1, cooldown: 0, intents: [EB.createBasicDebuffIntent(1, fatigue.name, EB.DEBUFF)] },
        { id: 6, probability: 0.2, cooldown: 0, intents: [EB.createInfectIntent(11, 1, EB.INFECT)] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 7,  probability: 0.1, cooldown: 0, intents: [
            EB.createBasicAttackIntent(14, EB.ATTACK_SWORD_BUFF), 
            EB.createBasicBuffIntent(2, resolveStatus.name, EB.ATTACK_SWORD_BUFF)
        ] },
        { id: 8,  probability: 0.1, cooldown: 0, intents: [
            EB.createBasicAttackIntent(9, EB.ATTACK_ARROW_DEBUFF2), 
            EB.createBasicDebuffIntent(2, feebleStatus.name, EB.ATTACK_ARROW_DEBUFF2)
        ] },
        { id: 9,  probability: 0.1, cooldown: 0, intents: [
            EB.createDefenseIntent(14, EB.DEFEND_BUFF), 
            EB.createBasicBuffIntent(2, resolveStatus.name, EB.DEFEND_BUFF)
        ] },
        { id: 10,  probability: 0.1, cooldown: 0, intents: [EB.createBreachAttack(16, EB.BRECH)] },
        { id: 11, probability: 0.2, cooldown: 0, intents: [
            EB.createDefenseIntent(14, EB.DEFEND_DEBUFF), 
            EB.createBasicDebuffIntent(1, feebleStatus.name, EB.DEFEND_DEBUFF)
        ] },
        { id: 12, probability: 0.2, cooldown: 0, intents: [EB.createGrowIntent(20, 10, 3, EB.GROW)] },
        { id: 13, probability: 0.1, cooldown: 0, intents: [
            EB.createInfectIntent(11, 1, EB.INFECT_ATTACK_SWORD), 
            EB.createBasicAttackIntent(14, EB.INFECT_ATTACK_SWORD)
        ] },
        { id: 14, probability: 0.1, cooldown: 0, intents: [getSignatureMove(EB.SIGNATURE_MOVE)] }
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const mossySkeletonData: Enemy = {
    enemyId: 30,
    stage: 2,
    selectable: true,
    isActive: true,
    name: 'Mossy Skeleton',
    type: EnemyTypeEnum.Undead,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Medium,
    description: 'As the mold takes over the remnants of fallen warriors, they stumble back into battle. Vacated of almost all traces of humanity, only their skills for combat and the occasional howl of anguish remain.',
    healthRange: [50, 60],
    aggressiveness: 0.4,
    attackLevels: [BasicIntents, AdvancedIntents]
}

