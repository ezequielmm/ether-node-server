import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService as EB } from '../enemy-builder.service'
import { CardDestinationEnum, CardTargetedEnum } from '../../card/card.enum';
import { PoisonedCard } from '../../card/data/poisoned.card';
import { MoldCard } from '../../card/data/mold.card';
import { damageEffect } from 'src/game/effects/damage/constants';
import { addCardEffect } from 'src/game/effects/addCard/contants';
import { AddCardPosition } from 'src/game/effects/effects.enum';
import { immolateEffect } from 'src/game/effects/immolate/constants';
import { mitosisEffect } from 'src/game/effects/mitosis/constants';


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
                effect: mitosisEffect.name,
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

const getSignatureMove = (animationId:string):EnemyIntention => {
    return {
        name: "Toxic Sacrifice",
        type: EnemyIntentionType.Signature,
        target: CardTargetedEnum.Player,
        value: 5,
        negateDamage: 8,
        effects: [
            {
                effect: damageEffect.name,
                target: CardTargetedEnum.Player,
                args:{
                    value: 5,
                    multiplier: 5,
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
                    value: 3,
                    cardId: PoisonedCard.cardId,     
                    destination: CardDestinationEnum.Draw,
                    position: AddCardPosition.Random,
                },
                action: {
                    name: animationId,
                    hint: animationId,
                },
            },
            {
                effect: immolateEffect.name,
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

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options:[
        { id: 1, probability: 0.2, cooldown: 0, intents: [
            EB.createBasicAttackIntent(7, EB.ATTACK_POISON), 
            EB.createAddCardIntent(1, PoisonedCard, CardDestinationEnum.Draw, EB.ATTACK_POISON)
        ] },  
        { id: 2, probability: 0.1, cooldown: 0, intents: [EB.createBasicBuffIntent(2, resolveStatus.name, EB.BUFF)] },  
        { id: 3, probability: 0.1, cooldown: 0, intents: [EB.createAddCardIntent(1, MoldCard, CardDestinationEnum.Draw, EB.DEBUFF)] },
        { id: 4, probability: 0.2, cooldown: 0, intents: [EB.createAddCardIntent(2, PoisonedCard, CardDestinationEnum.Draw, EB.POISON)] },
        { id: 5, probability: 0.2, cooldown: 0, intents: [EB.createMultiplierAttackIntent(8, 2, EB.ATTACK2)] },
        { id: 6, probability: 0.2, cooldown: 0, intents: [EB.createDefenseIntent(16, EB.DEFEND)] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 8,  probability: 0.1, cooldown: 0, intents: [
            EB.createMultiplierAttackIntent(8, 2, EB.ATTACK_DEBUFF), 
            EB.createAddCardIntent(2, PoisonedCard, CardDestinationEnum.Draw, EB.ATTACK_DEBUFF)
        ] }, 
        { id: 9,  probability: 0.1, cooldown: 0, intents: [
            EB.createMultiplierAttackIntent(8, 2, EB.ATTACK_DEBUFF2), 
            EB.createAddCardIntent(1, MoldCard, CardDestinationEnum.Draw, EB.ATTACK_DEBUFF2)
        ] },
        { id: 10, probability: 0.2, cooldown: 0, intents: [
            EB.createDefenseIntent(16, EB.DEFEND_BUFF), 
            EB.createBasicBuffIntent(2, resolveStatus.name, EB.DEFEND_BUFF)
        ] },
        { id: 11, probability: 0.1, cooldown: 0, intents: [
            EB.createDefenseIntent(16, EB.DEFEND_DEBUFF), 
            EB.createAddCardIntent(1, MoldCard, CardDestinationEnum.Draw, EB.DEFEND_DEBUFF)
        ] },
        { id: 12, probability: 0.1, cooldown: 0, intents: [EB.createAddCardIntent(3, PoisonedCard, CardDestinationEnum.Draw, EB.DEBUFF2)] },
        { id: 13, probability: 0.2, cooldown: 0, intents: [getSpecialAttack(EB.SPECIAL)] },
        { id: 14, probability: 0.2, cooldown: 0, intents: [getSignatureMove(EB.SIGNATURE_MOVE)] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const moldPolypData: Enemy = {
    enemyId: 40,
    stage: 2,
    selectable: true,
    isActive: true,
    name: 'Mold Polyp',
    type: EnemyTypeEnum.Mold,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Medium,
    description: 'A large invertebrate filled with poisonous gas. Its stench alone is enough to take out smaller creatures.',
    healthRange: [25, 35],
    aggressiveness: 0.4,
    attackLevels: [BasicIntents, AdvancedIntents]
}

