import { EnemyBuilderService as EB } from "../enemy-builder.service";
import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from "../enemy.enum";
import { EnemyAction, EnemyIntention } from "../enemy.interface";
import { Enemy } from "../enemy.schema";
import { resolveStatus } from "src/game/status/resolve/constants";
import { attachStatusEffect } from "src/game/effects/attachStatus/constants";
import { CardTargetedEnum } from "../../card/card.enum";
import { chargingBeam } from "src/game/status/chargingBeam/constants";

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const getSignatureMove = (animationId:string):EnemyIntention => {
    return {
        name: "Charged Beam",
        type: EnemyIntentionType.Signature,
        target: CardTargetedEnum.Player,
        value: 45,
        effects: [
            {
                effect: attachStatusEffect.name,
                target: CardTargetedEnum.Self,
                args: {
                    statusName: chargingBeam.name,
                    statusArgs: {
                        counter: 2,
                    },
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
    options: [
        { id: 1, probability: 0.2, cooldown: 0, intents: [getSignatureMove(EB.SIGNATURE_MOVE)] },
        { id: 2, probability: 0.5, cooldown: 0, intents: [EB.createBasicAttackIntent(15, EB.ATTACK)] },
        { id: 3, probability: 0.3, cooldown: 0, intents: [EB.createBasicBuffIntent(3, resolveStatus.name, EB.BUFF)] },
        { id: 4, probability: 0.3, cooldown: 0, intents: [EB.createDwellerMonsterBeam(45)] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const deepDwellerMonsterData: Enemy = {
    enemyId: 66,
    stage: 2,
    selectable: true,
    isActive: true,
    name: 'Deep Deweller Monster',
    type: EnemyTypeEnum.Beast,
    category: EnemyCategoryEnum.Boss,
    size: EnemySizeEnum.Large,
    description: 'todo:..',
    healthRange: [160, 180],
    aggressiveness: 0,
    attackLevels: [BasicIntents]
}