import { resolveStatus } from "src/game/status/resolve/constants";
import { EnemyBuilderService } from "../enemy-builder.service";
import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum } from "../enemy.enum";
import { EnemyAction, EnemyIntention } from "../enemy.interface";
import { Enemy } from "../enemy.schema";

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicAttack:      EnemyIntention = EnemyBuilderService.createBasicAttackIntent(10);
const SecondAttack:     EnemyIntention = EnemyBuilderService.createBasicAttackIntent(8);
const BasicDefense:     EnemyIntention = EnemyBuilderService.createDefenseIntent(6);
const DebuffPoisonCard: EnemyIntention = null;
const Buff2Resolve:     EnemyIntention = EnemyBuilderService.createBasicBuffIntent(2, resolveStatus.name);
const Breach:           EnemyIntention = null;

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options: [
        { id: 1, probability: 0.2, cooldown: 0, intents:[BasicAttack] },
        //{ id: 2, probability: 0.2, cooldown: 0, intents:[SecondAttack, DebuffPoisonCard] },
        { id: 3, probability: 0.5, cooldown: 0, intents:[BasicDefense] },
        { id: 4, probability: 0.3, cooldown: 0, intents:[Buff2Resolve] },
        //{ id: 5, probability: 0.2, cooldown: 0, intents:[Breach] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const mutantSpiderData: Enemy = {
    enemyId: 61,
    isActive: true,
    name: 'Mutant Spider',
    type: EnemyTypeEnum.Beast,
    category: EnemyCategoryEnum.Minion,
    size: EnemySizeEnum.Medium,
    description: 'Minion creature to Swarm Master',
    healthRange: [10, 15],
    aggressiveness: 0,
    attackLevels: [BasicIntents]
}