import { feebleStatus } from "src/game/status/feeble/constants";
import { EnemyBuilderService as EB } from "../enemy-builder.service";
import { EnemyCategoryEnum, EnemySizeEnum, EnemyTypeEnum } from "../enemy.enum";
import { EnemyAction } from "../enemy.interface";
import { Enemy } from "../enemy.schema";
import { fatigue } from "src/game/status/fatigue/constants";

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
// const getSpecialAttack = (animationId:string):EnemyIntention => {
//     return {
//         type: EnemyIntentionType.Special,
//         target: CardTargetedEnum.Player,
//         value: 0,
//         effects: [
//             {
//                 effect: mitosisEffect.name,
//                 target: CardTargetedEnum.Player,
//                 args: {
//                     value: 0,
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
    options:[
        { id: 1, probability: 0.3, cooldown: 0, intents: [EB.createDefenseIntent(12, EB.DEFEND)] },
        { id: 2, probability: 0.2, cooldown: 0, intents: [EB.createBasicDebuffIntent(1, feebleStatus.name, EB.DEBUFF)] },
        { id: 3, probability: 0.3, cooldown: 0, intents: [EB.createBasicDebuffIntent(1, fatigue.name, EB.DEBUFF2)] },
        //{ id: 4, probability: 0.2, cooldown: 0, intents: [EB.createAbsorbAttack(EB.ABSORB)] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 5,  probability: 0.1, cooldown: 0, intents: [EB.createMistifyAction(2, EB.MISTIFY)] },
        { id: 6,  probability: 0.2, cooldown: 0, intents: [EB.createBasicDebuffIntent(2, feebleStatus.name, EB.DEBUFF3)] },
        { id: 7,  probability: 0.2, cooldown: 0, intents: [EB.createBasicDebuffIntent(2, fatigue.name, EB.DEBUFF4)] },
        //{ id: 8,  probability: 0.1, cooldown: 0, intents: [EB.createBasicBuffIntent(3, resolveStatus.name, EB.BUFF2)] },
        { id: 9,  probability: 0.5, cooldown: 0, intents: [EB.createAbsorbAttack(EB.ABSORB)] },
        // { id: 10, probability: 0.2, cooldown: 0, intents: [getSpecialAttack(EB.SPECIAL)] },
    ]
}


//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const nightWispData: Enemy = {
    enemyId: 80,
    stage: 2,
    selectable: false,
    isActive: false,
    name: 'Night Wisp',
    type: EnemyTypeEnum.Spirit,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Medium,
    description: 'Many a wanderer has been attracted by the beauty of the Night Wisp’s ethereal image and soft chant, only to find swift, horrible death.',
    healthRange: [15, 20],
    aggressiveness: 0.4,
    attackLevels: [BasicIntents, AdvancedIntents]
}