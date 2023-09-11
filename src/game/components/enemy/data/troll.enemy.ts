import { feebleStatus } from "src/game/status/feeble/constants";
import { resolveStatus } from "src/game/status/resolve/constants";
import { EnemyBuilderService } from "../enemy-builder.service";
import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum } from "../enemy.enum";
import { EnemyAction, EnemyIntention } from "../enemy.interface";
import { Enemy } from "../enemy.schema";
import { fatigue } from "src/game/status/fatigue/constants";

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicAttack:     EnemyIntention = EnemyBuilderService.createBasicAttackIntent(15);
const SecondAttack:    EnemyIntention = EnemyBuilderService.createBasicAttackIntent(12);
const BasicDefense:    EnemyIntention = EnemyBuilderService.createDefenseIntent(10);
const Debuff1Feeble:   EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(1, feebleStatus.name);
const Debuff2Feeble:   EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(2, feebleStatus.name);
const Debuff2Fatigue:  EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(2, fatigue.name);
const Buff3Resolve:    EnemyIntention = EnemyBuilderService.createBasicBuffIntent(3, resolveStatus.name);
const Buff2Resolve:    EnemyIntention = EnemyBuilderService.createBasicBuffIntent(2, resolveStatus.name);
const Buff1Resolve:    EnemyIntention = EnemyBuilderService.createBasicBuffIntent(1, resolveStatus.name);
const Counter:         EnemyIntention = null;
const SignatureAttack: EnemyIntention = null;

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options: [
        { id: 1, probability: 0.2, cooldown: 0, intents:[BasicAttack] },
        { id: 2, probability: 0.2, cooldown: 0, intents:[SecondAttack, Debuff1Feeble] },
        { id: 3, probability: 0.2, cooldown: 0, intents:[BasicDefense] },
        { id: 4, probability: 0.2, cooldown: 0, intents:[Buff3Resolve] },
        { id: 5, probability: 0.2, cooldown: 0, intents:[Debuff2Feeble] },
        //{ id: 6, probability: 0.2, cooldown: 0, intents:[Counter] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 7, probability: 0.4, cooldown: 0, intents: [BasicAttack, Buff3Resolve] },
        { id: 8, probability: 0.3, cooldown: 0, intents: [BasicDefense, Buff2Resolve] },
        //{ id: 9, probability: 0.2, cooldown: 0, intents: [Counter, Buff1Resolve] },
        { id: 10, probability: 0.3, cooldown: 0, intents:[BasicDefense, Debuff2Fatigue] },
        //{ id: 11, probability: 0.2, cooldown: 0, intents:[SignatureAttack] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------

export const trollData: Enemy = {
    enemyId: 50,
    isActive: true,
    name: 'Troll',
    type: EnemyTypeEnum.Beast,
    category: EnemyCategoryEnum.Elite,
    size: EnemySizeEnum.Large,
    description: 'todo:..',
    healthRange: [120, 130],
    aggressiveness: 0.3,
    attackLevels: [BasicIntents, AdvancedIntents]
}