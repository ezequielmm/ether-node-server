import { feebleStatus } from "src/game/status/feeble/constants";
import { EnemyBuilderService } from "../enemy-builder.service";
import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from "../enemy.enum";
import { EnemyAction, EnemyIntention } from "../enemy.interface";
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
const Debuff2Feeble:   EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(2, feebleStatus.name);
const Debuff2Fatigue:  EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(2, fatigue.name);
const BasicDefense:    EnemyIntention = EnemyBuilderService.createDefenseIntent(12);
const Debuff4Feeble:   EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(4, feebleStatus.name);
const Debuff4Fatigue:  EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(4, fatigue.name);
//const Debuff1Sleep:    EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(1, sleep.name);
const Buff2Dodge:      EnemyIntention = EnemyBuilderService.createBasicBuffIntent(2, dodge.name);

// const SignatureAttack: EnemyIntention = {
//     type: EnemyIntentionType.Signature,
//     target: CardTargetedEnum.Player,
//     value: 1,
//     negateDamage: 20,
//     effects: [
//         {
//             effect: sleep.name,
//             target: CardTargetedEnum.Player,
//             args: {
//                 value: 2,
//             },
//             action: {
//                 name: 'signature_move',
//                 hint: 'signature_move',
//             },
//         },
//         {
//             effect: addCardEffect.name,
//             target: CardTargetedEnum.Player,
//             args: {
//                 value: 2,
//                 cardId: mistifyCard.cardId,     
//                 destination: CardDestinationEnum.Draw,
//                 position: AddCardPosition.Random,
//             },
//             action: {
//                 name: 'signature_move',
//                 hint: 'signature_move',
//             },
//         },
//         {
//             effect: attachStatusEffect.name,
//             target: CardTargetedEnum.Player,
//             args: {
//                 statusName: feebleStatus.name,
//                 statusArgs: {
//                     counter: 1,
//                 },
//             },
//             action: {
//                 name: 'signature_move',
//                 hint: 'signature_move',
//             },
//         },
//         {
//             effect: attachStatusEffect.name,
//             target: CardTargetedEnum.Player,
//             args: {
//                 statusName: fatigue.name,
//                 statusArgs: {
//                     counter: 1,
//                 },
//             },
//             action: {
//                 name: 'signature_move',
//                 hint: 'signature_move',
//             },
//         },
//     ]
// }


//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options: [
        { id: 1, probability: 0.4, cooldown: 0, intents:[Debuff2Feeble] },
        { id: 2, probability: 0.3, cooldown: 0, intents:[Debuff2Fatigue] },
        { id: 3, probability: 0.3, cooldown: 0, intents:[BasicDefense] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 4,  probability: 0.2, cooldown: 0, intents: [BasicDefense, Debuff2Feeble] },
        { id: 5,  probability: 0.2, cooldown: 0, intents: [BasicDefense, Debuff2Fatigue] },
        { id: 6,  probability: 0.2, cooldown: 0, intents: [Debuff4Feeble] },
        { id: 7,  probability: 0.2, cooldown: 0, intents: [Debuff4Fatigue] },
        //{ id: 8,  probability: 0.2, cooldown: 0, intents: [Debuff1Sleep] },
        { id: 9,  probability: 0.2, cooldown: 0, intents: [Buff2Dodge] },
        //{ id: 10, probability: 0.1, cooldown: 0, intents: [SignatureAttack] },
    ]
}


//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const deepDwellerLureData: Enemy = {
    enemyId: 65,
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