import { resolveStatus } from "src/game/status/resolve/constants";
import { EnemyBuilderService as EB } from "../enemy-builder.service";
import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum } from "../enemy.enum";
import { EnemyAction } from "../enemy.interface";
import { Enemy } from "../enemy.schema";
import { PoisonedCard } from "../../card/data/poisoned.card";
import { CardDestinationEnum } from "../../card/card.enum";

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options: [
        { id: 1, probability: 0.2, cooldown: 0, intents:[EB.createBasicAttackIntent(10, EB.ATTACK)] },
        { id: 2, probability: 0.2, cooldown: 0, intents:[
            EB.createBasicAttackIntent(8, EB.ATTACK_DEBUFF), 
            EB.createAddCardIntent(1, PoisonedCard, CardDestinationEnum.Draw, EB.ATTACK_DEBUFF)
        ] },
        { id: 3, probability: 0.2, cooldown: 0, intents:[EB.createDefenseIntent(6, EB.DEFEND)] },
        { id: 4, probability: 0.2, cooldown: 0, intents:[EB.createBasicBuffIntent(2, resolveStatus.name, EB.BUFF)] },
        { id: 5, probability: 0.2, cooldown: 0, intents:[EB.createBreachAttack(7, EB.BRECH)] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const mutantSpider1Data: Enemy = {
    enemyId: 61,
    stage: 2,
    selectable: true,
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