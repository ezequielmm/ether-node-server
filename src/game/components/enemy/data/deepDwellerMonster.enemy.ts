import { EnemyBuilderService } from "../enemy-builder.service";
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
const SignatureMove: EnemyIntention = {
    type: EnemyIntentionType.Signature,
    target: CardTargetedEnum.Player,
    damageToIncrementCounter: 30,
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
                name: 'signature_move',
                hint: 'signature_move',
            },
        }
    ]
}
const BasicAttack:   EnemyIntention = EnemyBuilderService.createBasicAttackIntent(15);
const Buff3Resolve:  EnemyIntention = EnemyBuilderService.createBasicBuffIntent(3, resolveStatus.name);

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options: [
        { id: 1, probability: 0.2, cooldown: 0, intents: [SignatureMove] },
        { id: 2, probability: 0.5, cooldown: 0, intents: [BasicAttack] },
        { id: 3, probability: 0.3, cooldown: 0, intents: [Buff3Resolve] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const deepDwellerMonsterData: Enemy = {
    enemyId: 66,
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