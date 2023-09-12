import { spawnEnemyEffect } from "src/game/effects/spawnEnemy/contants";
import { EnemyBuilderService } from "../enemy-builder.service";
import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum } from "../enemy.enum";
import { EnemyAction, EnemyIntention } from "../enemy.interface";
import { Enemy } from "../enemy.schema";
import { swarmCocoon1Data } from "./swarmCocoon1.enemy";
import { swarmCocoon2Data } from "./swarmCocoon2.enemy";
import { CardTargetedEnum } from "../../card/card.enum";
import { mutantSpider1Data } from "./mutantSpider1.enemy";
import { mutantSpider2Data } from "./mutantSpider2.enemy";
import { burn } from "src/game/status/burn/constants";

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const Summon1Cocoon:   EnemyIntention = EnemyBuilderService.invokeMinionsIntent([swarmCocoon1Data.enemyId]);
const Summon1Spider:   EnemyIntention = EnemyBuilderService.invokeMinionsIntent([mutantSpider1Data.enemyId]);
const Summon2Cocoon:   EnemyIntention = EnemyBuilderService.invokeMinionsIntent([swarmCocoon1Data.enemyId, swarmCocoon2Data.enemyId]);
const Summon2Spider:   EnemyIntention = EnemyBuilderService.invokeMinionsIntent([mutantSpider1Data.enemyId, mutantSpider2Data.enemyId]);
const BasicDefense:    EnemyIntention = EnemyBuilderService.createDefenseIntent(15);
const BasicAttack:     EnemyIntention = EnemyBuilderService.createBasicAttackIntent(8);
const SecondAttack:    EnemyIntention = EnemyBuilderService.createBasicAttackIntent(10);
const DebuffBurn:      EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(2, burn.name);
//const DebuffPoison:    EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(2, ....);
const SignatureAttack: EnemyIntention = null;


//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options:[
        //{ id: 1, probability: 0.2, cooldown: 0, intents: [Summon1Cocoon] },
        { id: 2, probability: 0.2, cooldown: 0, intents: [Summon1Spider] },
        //{ id: 3, probability: 0.1, cooldown: 0, intents: [Summon2Cocoon] },
        { id: 4, probability: 0.2, cooldown: 0, intents: [Summon2Spider] },
        { id: 5, probability: 0.2, cooldown: 0, intents: [BasicDefense] },
        { id: 6, probability: 0.2, cooldown: 0, intents: [BasicAttack] },
        { id: 7, probability: 0.1, cooldown: 0, intents: [SecondAttack, DebuffBurn] },
        { id: 8, probability: 0.1, cooldown: 0, intents: [SecondAttack] },
        //{ id: 9, probability: 0.1, cooldown: 0, intents: [SignatureAttack] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const swarmMasterData: Enemy = {
    enemyId: 60,
    isActive: true,
    name: 'Swarm Master',
    type: EnemyTypeEnum.Beast,
    category: EnemyCategoryEnum.Boss,
    size: EnemySizeEnum.Giant,
    description: 'todo:..',
    healthRange: [300, 300],
    aggressiveness: 0,
    attackLevels: [BasicIntents]
}