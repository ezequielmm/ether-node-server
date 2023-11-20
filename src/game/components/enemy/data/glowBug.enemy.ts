import { addCardEffect } from "src/game/effects/addCard/contants";
import { CardDestinationEnum, CardTargetedEnum } from "../../card/card.enum";
import { EnemyCategoryEnum, EnemyIntentionType, EnemySizeEnum, EnemyTypeEnum } from "../enemy.enum";
import { EnemyAction, EnemyIntention } from "../enemy.interface";
import { Enemy } from "../enemy.schema";
import { attachStatusEffect } from "src/game/effects/attachStatus/constants";
import { MirageCard } from "../../card/data/mirage.card";
import { AddCardPosition } from "src/game/effects/effects.enum";
import { feebleStatus } from "src/game/status/feeble/constants";
import { fatigue } from "src/game/status/fatigue/constants";
import { EnemyBuilderService as EB } from "../enemy-builder.service";
import { resolveStatus } from "src/game/status/resolve/constants";

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------

const getSignatureMove = (animationId:string):EnemyIntention => {
    return {
        name: "Flash",
        type: EnemyIntentionType.Signature,
        target: CardTargetedEnum.Player,
        value: 0,
        negateDamage: 8,
        effects: [
            {
                effect: addCardEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    value: 2,
                    cardId: MirageCard.cardId,     
                    destination: CardDestinationEnum.Draw,
                    position: AddCardPosition.Random,
                },
                action: {
                    name: animationId,
                    hint: animationId,
                },
            },
            {
                effect: attachStatusEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    statusName: feebleStatus.name,
                    statusArgs: {
                        counter: 3,
                    },
                },
                action: {
                    name: animationId,
                    hint: animationId,
                },
            },
            {
                effect: attachStatusEffect.name,
                target: CardTargetedEnum.Player,
                args: {
                    statusName: fatigue.name,
                    statusArgs: {
                        counter: 3,
                    },
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
        { id: 1, probability: 0.2, cooldown: 0, intents: [EB.createBasicAttackIntent(14, EB.ATTACK)] },
        { id: 2, probability: 0.1, cooldown: 0, intents: [EB.createDefenseIntent(13, EB.DEFEND)] },
        { id: 3, probability: 0.2, cooldown: 0, intents: [EB.createBasicBuffIntent(1, resolveStatus.name, EB.BUFF)] },
        { id: 4, probability: 0.1, cooldown: 0, intents: [EB.createAbsorbAttack(EB.ABSORB)] },
        { id: 5, probability: 0.1, cooldown: 0, intents: [EB.createCounterAttack(EB.COUNTER)] },
        { id: 6, probability: 0.1, cooldown: 0, intents: [EB.createBasicDebuffIntent(1, feebleStatus.name, EB.DEBUFF)] },
        { id: 7, probability: 0.2, cooldown: 0, intents: [EB.createBasicDebuffIntent(1, fatigue.name, EB.DEBUFF2)] }
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 8,  probability: 0.1, cooldown: 0, intents: [EB.createMultiplierAttackIntent(14, 2, EB.ATTACK2)] },
        { id: 9,  probability: 0.1, cooldown: 0, intents: [
            EB.createBasicAttackIntent(13, EB.ATTACK_DEBUFF), 
            EB.createBasicDebuffIntent(1, feebleStatus.name, EB.ATTACK_DEBUFF)
        ] },
        { id: 10,  probability: 0.1, cooldown: 0, intents: [
            EB.createAbsorbAttack(EB.ABSORB_DEFEND), 
            EB.createDefenseIntent(15, EB.ABSORB_DEFEND)
        ] },
        { id: 11, probability: 0.1, cooldown: 0, intents: [
            EB.createBasicBuffIntent(3, resolveStatus.name, EB.BUFF2)
        ] },
        { id: 12, probability: 0.2, cooldown: 0, intents: [EB.createMistifyAction(1, EB.MISTIFY)] },
        { id: 13, probability: 0.1, cooldown: 0, intents: [EB.createGrowIntent(15, 10, 2, EB.GROW)] },
        { id: 14, probability: 0.1, cooldown: 0, intents: [
            EB.createCounterAttack(EB.COUNTER_DEBUFF),
            EB.createBasicDebuffIntent(1, feebleStatus.name, EB.COUNTER_DEBUFF)
        ] },
        { id: 15, probability: 0.1, cooldown: 0, intents: [EB.createBasicDebuffIntent(1, feebleStatus.name, EB.DEBUFF)] },
        { id: 16, probability: 0.1, cooldown: 0, intents: [getSignatureMove(EB.SIGNATURE_MOVE)] }
    ]
}


//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const glowBugData: Enemy = {
    enemyId: 70,
    stage: 2,
    selectable: false,
    isActive: false,
    name: 'Glow Bug',
    type: EnemyTypeEnum.Insectoid,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Medium,
    description: 'As its name implies, the Glow Bug possesses an incandescent gland that produces intense flashes of light. The uncanny nature of its glow is known to cause blindness, seizures, and even death.',
    healthRange: [20, 25],
    aggressiveness: 0.4,
    attackLevels: [BasicIntents, AdvancedIntents]
}