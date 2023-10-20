import { feebleStatus } from "src/game/status/feeble/constants";
import { EnemyBuilderService as EB } from "../enemy-builder.service";
import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from "../enemy.enum";
import { EnemyAction } from "../enemy.interface";
import { Enemy } from "../enemy.schema";
import { fatigue } from "src/game/status/fatigue/constants";
import { dodge } from "src/game/status/dodge/constants";
import { CardDestinationEnum, CardTargetedEnum } from "../../card/card.enum";
import { attachStatusEffect } from "src/game/effects/attachStatus/constants";
import { addCardEffect } from "src/game/effects/addCard/contants";
import { AddCardPosition } from "src/game/effects/effects.enum";

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------

// const getSignatureMove = (animationId:string):EnemyIntention => {
//     return {
//         name: "Lullaby", 
//         type: EnemyIntentionType.Signature,
//         target: CardTargetedEnum.Player,
//         value: 1,
//         negateDamage: 20,
//         effects: [
//             {
//                 effect: sleep.name,
//                 target: CardTargetedEnum.Player,
//                 args: {
//                     value: 2,
//                 },
//                 action: {
//                     name: animationId,
//                     hint: animationId,
//                 },
//             },
//             {
//                 effect: addCardEffect.name,
//                 target: CardTargetedEnum.Player,
//                 args: {
//                     value: 2,
//                     cardId: mistifyCard.cardId,     
//                     destination: CardDestinationEnum.Draw,
//                     position: AddCardPosition.Random,
//                 },
//                 action: {
//                     name: animationId,
//                     hint: animationId,
//                 },
//             },
//             {
//                 effect: attachStatusEffect.name,
//                 target: CardTargetedEnum.Player,
//                 args: {
//                     statusName: feebleStatus.name,
//                     statusArgs: {
//                         counter: 1,
//                     },
//                 },
//                 action: {
//                     name: animationId,
//                     hint: animationId,
//                 },
//             },
//             {
//                 effect: attachStatusEffect.name,
//                 target: CardTargetedEnum.Player,
//                 args: {
//                     statusName: fatigue.name,
//                     statusArgs: {
//                         counter: 1,
//                     },
//                 },
//                 action: {
//                     name: animationId,
//                     hint: animationId,
//                 },
//             },
//         ]
//     }
// }



//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options: [
        { id: 1, probability: 0.4, cooldown: 0, intents:[EB.createBasicDebuffIntent(2, feebleStatus.name, EB.DEBUFF)] },
        { id: 2, probability: 0.3, cooldown: 0, intents:[EB.createBasicDebuffIntent(2, fatigue.name, EB.DEBUFF2)] },
        { id: 3, probability: 0.3, cooldown: 0, intents:[EB.createDefenseIntent(12, EB.DEFEND)] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 4,  probability: 0.2, cooldown: 0, intents: [
            EB.createDefenseIntent(12, EB.DEFEND_DEBUFF), 
            EB.createBasicDebuffIntent(2, feebleStatus.name, EB.DEFEND_DEBUFF)
        ] },
        { id: 5,  probability: 0.2, cooldown: 0, intents: [
            EB.createDefenseIntent(12, EB.DEFEND_DEBUFF), 
            EB.createBasicDebuffIntent(2, fatigue.name, EB.DEFEND_DEBUFF)
        ] },
        { id: 6,  probability: 0.2, cooldown: 0, intents: [EB.createBasicDebuffIntent(4, feebleStatus.name, EB.DEBUFF)] },
        { id: 7,  probability: 0.2, cooldown: 0, intents: [EB.createBasicDebuffIntent(4, fatigue.name, EB.DEBUFF2)] },
        //{ id: 8,  probability: 0.2, cooldown: 0, intents: [EB.createBasicDebuffIntent(1, sleep.name, EB.DEBUFF3)] },
        { id: 9,  probability: 0.2, cooldown: 0, intents: [EB.createBasicBuffIntent(2, dodge.name, EB.DODGE)] },
        //{ id: 10, probability: 0.1, cooldown: 0, intents: [getSignatureMove(EB.SIGNATURE_MOVE)] },
    ]
}


//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const deepDwellerLureData: Enemy = {
    enemyId: 65,
    stage: 2,
    selectable: true,
    isActive: true,
    name: 'Deep Deweller Lure',
    type: EnemyTypeEnum.Fae,
    category: EnemyCategoryEnum.Boss,
    size: EnemySizeEnum.Large,
    description: 'todo:..',
    healthRange: [100, 120],
    aggressiveness: 0.6,
    attackLevels: [BasicIntents, AdvancedIntents]
}