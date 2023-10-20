import { hatchingStatus } from "src/game/status/hatching/constants";
import { EnemyBuilderService as EB } from "../enemy-builder.service";
import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum } from "../enemy.enum";
import { EnemyAction } from "../enemy.interface";
import { Enemy } from "../enemy.schema";

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options: [
        { id: -1, probability: 1, cooldown: 0, intents:[EB.createDoNothingIntent()] },
        { id: 1,  probability: 1, cooldown: 0, intents:[EB.createBasicBuffIntent(2, hatchingStatus.name, EB.BUFF)] },
        { id: 2,  probability: 0, cooldown: 0, intents:[EB.createDoNothingIntent()] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const swarmCocoon2Data: Enemy = {
    enemyId: 64,
    stage: 2,
    selectable: false,
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