import { EnemyBuilderService as EB } from "../enemy-builder.service";
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

const getSignatureMove = (animationId:string):EnemyIntention => {
    return {
        name: "For our Master",
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
                    name: animationId,
                    hint: animationId,
                },
            },
        ]
    };
}



//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options:[
        { id: 1, probability: 0.05, cooldown: 0, intents: [EB.invokeMinionsIntent([swarmCocoon1Data.enemyId], EB.SUMMON)] },
        { id: 2, probability: 0.05, cooldown: 0, intents: [EB.invokeMinionsIntent([mutantSpider1Data.enemyId], EB.SUMMON2)] },
        { id: 3,  probability: 0.1, cooldown: 0, intents: [EB.invokeMinionsIntent([swarmCocoon1Data.enemyId, swarmCocoon2Data.enemyId], EB.SUMMON3)] },
        { id: 4,  probability: 0.1, cooldown: 0, intents: [EB.invokeMinionsIntent([mutantSpider1Data.enemyId, mutantSpider2Data.enemyId], EB.SUMMON4)] },
        { id: 5,  probability: 0.1, cooldown: 0, intents: [EB.createDefenseIntent(15, EB.DEFEND)] },
        { id: 6,  probability: 0.1, cooldown: 0, intents: [EB.createBasicAttackIntent(8, EB.ATTACK)] },
        { id: 7,  probability: 0.1, cooldown: 0, intents: [
            EB.createBasicAttackIntent(10, EB.ATTACK_THUNDER_RED_DEBUF), 
            EB.createBasicDebuffIntent(2, burn.name, EB.ATTACK_THUNDER_RED_DEBUF)
        ] },
        { id: 8,  probability: 0.1, cooldown: 0, intents: [
            EB.createBasicAttackIntent(10, EB.ATTACK_THUNDER_GREEN_DEBUFF2), 
            EB.createAddCardIntent(2, PoisonedCard, CardDestinationEnum.Draw, EB.ATTACK_THUNDER_GREEN_DEBUFF2)
        ] },
        { id: 9,  probability: 0.1, cooldown: 0, intents: [getSignatureMove(EB.SIGNATURE_MOVE)] },
        { id: 10, probability: 0.1, cooldown: 0, intents: [EB.invokeMinionsIntent([swarmCocoon2Data.enemyId], EB.SUMMON)] },
        { id: 11, probability: 0.1, cooldown: 0, intents: [EB.invokeMinionsIntent([mutantSpider2Data.enemyId], EB.SUMMON2)] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const swarmMasterData: Enemy = {
    enemyId: 60,
    stage: 2,
    selectable: true,
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
