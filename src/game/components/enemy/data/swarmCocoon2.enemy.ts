import { hatchingStatus } from "src/game/status/hatching/constants";
import { EnemyBuilderService } from "../enemy-builder.service";
import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum } from "../enemy.enum";
import { EnemyAction, EnemyIntention } from "../enemy.interface";
import { Enemy } from "../enemy.schema";
//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BuffHatching: EnemyIntention = EnemyBuilderService.createBasicBuffIntent(2, hatchingStatus.name);
const DoNothing:    EnemyIntention = EnemyBuilderService.createDoNothingIntent();

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options: [
        { id: 1, probability: 1, cooldown: 0, intents:[BuffHatching] },
        { id: 2, probability: 0, cooldown: 0, intents:[DoNothing] }
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const swarmCocoon2Data: Enemy = {
    enemyId: 64,
    isActive: true,
    name: 'Swarm Cocoon',
    type: EnemyTypeEnum.Beast,
    category: EnemyCategoryEnum.Minion,
    size: EnemySizeEnum.Medium,
    description: 'Minion creature to Swarm Master',
    healthRange: [10, 15],
    aggressiveness: 0,
    attackLevels: [BasicIntents]
}