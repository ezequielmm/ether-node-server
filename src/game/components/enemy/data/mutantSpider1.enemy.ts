import { resolveStatus } from "src/game/status/resolve/constants";
import { EnemyBuilderService } from "../enemy-builder.service";
import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum } from "../enemy.enum";
import { EnemyAction, EnemyIntention } from "../enemy.interface";
import { Enemy } from "../enemy.schema";
import { PoisonedCard } from "../../card/data/poisoned.card";
import { CardDestinationEnum } from "../../card/card.enum";

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicAttack:      EnemyIntention = EnemyBuilderService.createBasicAttackIntent(10);
const SecondAttack:     EnemyIntention = EnemyBuilderService.createBasicAttackIntent(8);
const BasicDefense:     EnemyIntention = EnemyBuilderService.createDefenseIntent(6);
const DebuffPoisonCard: EnemyIntention = EnemyBuilderService.createAddCardIntent(1, PoisonedCard, CardDestinationEnum.Draw);
const Buff2Resolve:     EnemyIntention = EnemyBuilderService.createBasicBuffIntent(2, resolveStatus.name);
const Breach:           EnemyIntention = EnemyBuilderService.createBreachAttack(7);

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options: [
        { id: 1, probability: 0.2, cooldown: 0, intents:[BasicAttack] },
        { id: 2, probability: 0.2, cooldown: 0, intents:[SecondAttack, DebuffPoisonCard] },
        { id: 3, probability: 0.2, cooldown: 0, intents:[BasicDefense] },
        { id: 4, probability: 0.2, cooldown: 0, intents:[Buff2Resolve] },
        { id: 5, probability: 0.2, cooldown: 0, intents:[Breach] },
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