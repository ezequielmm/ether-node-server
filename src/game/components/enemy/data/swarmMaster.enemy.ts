import { EnemyBuilderService } from "../enemy-builder.service";
import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from "../enemy.enum";
import { EnemyAction, EnemyIntention } from "../enemy.interface";
import { Enemy } from "../enemy.schema";
import { swarmCocoon1Data } from "./swarmCocoon1.enemy";
import { swarmCocoon2Data } from "./swarmCocoon2.enemy";
import { mutantSpider1Data } from "./mutantSpider1.enemy";
import { mutantSpider2Data } from "./mutantSpider2.enemy";
import { burn } from "src/game/status/burn/constants";
import { CardDestinationEnum, CardTargetedEnum } from "../../card/card.enum";
import { spawnEnemyEffect } from "src/game/effects/spawnEnemy/contants";
import { PoisonedCard } from "../../card/data/poisoned.card";

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const Summon1Cocoon:   EnemyIntention = EnemyBuilderService.invokeMinionsIntent([swarmCocoon1Data.enemyId]);
const Summon1Spider:   EnemyIntention = EnemyBuilderService.invokeMinionsIntent([mutantSpider1Data.enemyId]);
const SummonSecondCocoon:   EnemyIntention = EnemyBuilderService.invokeMinionsIntent([swarmCocoon2Data.enemyId]);
const SummonSecondSpider:   EnemyIntention = EnemyBuilderService.invokeMinionsIntent([mutantSpider2Data.enemyId]);
const Summon2Cocoon:   EnemyIntention = EnemyBuilderService.invokeMinionsIntent([swarmCocoon1Data.enemyId, swarmCocoon2Data.enemyId]);
const Summon2Spider:   EnemyIntention = EnemyBuilderService.invokeMinionsIntent([mutantSpider1Data.enemyId, mutantSpider2Data.enemyId]);
const BasicDefense:    EnemyIntention = EnemyBuilderService.createDefenseIntent(15);
const BasicAttack:     EnemyIntention = EnemyBuilderService.createBasicAttackIntent(8);
const SecondAttack:    EnemyIntention = EnemyBuilderService.createBasicAttackIntent(10);
const DebuffBurn:      EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(2, burn.name);
const DebuffPoison:    EnemyIntention = EnemyBuilderService.createAddCardIntent(2, PoisonedCard, CardDestinationEnum.Draw);

const SignatureAttack: EnemyIntention = {
    type: EnemyIntentionType.Signature,
    target: CardTargetedEnum.Player,
    value: 1,
    negateDamage: 18,
    effects: [
        {
            effect: spawnEnemyEffect.name,
            target: CardTargetedEnum.Self,
            args: {
                enemiesToSpawn: [swarmCocoon1Data.enemyId, swarmCocoon2Data.enemyId, mutantSpider1Data.enemyId, mutantSpider2Data.enemyId],
            },
            action: {
                name: 'signature_move',
                hint: 'signature_move',
            },
        },
    ]
};


//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options:[
        { id: 1, probability: 0.05, cooldown: 0, intents: [Summon1Cocoon] },
        { id: 2, probability: 0.05, cooldown: 0, intents: [Summon1Spider] },
        { id: 3, probability: 0.1, cooldown: 0, intents: [Summon2Cocoon] },
        { id: 4, probability: 0.1, cooldown: 0, intents: [Summon2Spider] },
        { id: 5, probability: 0.1, cooldown: 0, intents: [BasicDefense] },
        { id: 6, probability: 0.1, cooldown: 0, intents: [BasicAttack] },
        { id: 7, probability: 0.1, cooldown: 0, intents: [SecondAttack, DebuffBurn] },
        { id: 8, probability: 0.1, cooldown: 0, intents: [SecondAttack, DebuffPoison] },
        { id: 9, probability: 0.1, cooldown: 0, intents: [SignatureAttack] },
        { id: 10, probability: 0.1, cooldown: 0, intents: [SummonSecondCocoon] },
        { id: 11, probability: 0.1, cooldown: 0, intents: [SummonSecondSpider] },
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
    size: EnemySizeEnum.Large,
    description: 'todo:..',
    healthRange: [300, 300],
    aggressiveness: 0,
    attackLevels: [BasicIntents]
}
