import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { feebleStatus } from 'src/game/status/feeble/constants';
import { fatigue } from 'src/game/status/fatigue/constants';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService as EB } from '../enemy-builder.service';
import { CardTargetedEnum } from '../../card/card.enum';
import { spawnEnemyEffect } from 'src/game/effects/spawnEnemy/contants';
import { cannibalizeEffect } from 'src/game/effects/cannibalize/constants';
import { caveGoblinMinionData } from './caveGoblin-minion.enemy';

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------

const getSignatureMove = (animationId:string):EnemyIntention => {
    return {
        name: "Gross Out Lunch",
        type: EnemyIntentionType.Signature,
        target: CardTargetedEnum.Player,
        value: 0,
        effects: [
            {
                effect: spawnEnemyEffect.name,
                target: CardTargetedEnum.Self,
                args: {
                    enemiesToSpawn: caveGoblinMinionData.enemyId,
                },
                action: {
                    name: animationId,
                    hint: animationId,
                },
            },
            {
                effect: cannibalizeEffect.name,
                target: CardTargetedEnum.Self,
                args: {
                    enemiesToCannibalize: caveGoblinMinionData.enemyId,
                },
                action: {
                    name: animationId,
                    hint: animationId,
                },
            },
        ]
    }
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options:[
        { id: 1, probability: 0.1, cooldown: 0, intents: [EB.createBasicAttackIntent(11, EB.ATTACK)] },
        { id: 2, probability: 0.1, cooldown: 0, intents: [EB.createMultiplierAttackIntent(11, 2, EB.ATTACK2)] },
        { id: 3, probability: 0.2, cooldown: 0, intents: [EB.createDefenseIntent(10, EB.DEFEND)] },
        { id: 4, probability: 0.2, cooldown: 0, intents: [EB.createBasicBuffIntent(2, resolveStatus.name, EB.BUFF)] },
        { id: 5, probability: 0.2, cooldown: 0, intents: [EB.createBasicDebuffIntent(2, feebleStatus.name, EB.DEBUFF)] },
        { id: 6, probability: 0.2, cooldown: 0, intents: [EB.createBasicDebuffIntent(2, fatigue.name, EB.DEBUFF2)] },

    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 7,  probability: 0.2, cooldown: 0, intents: [
            EB.createBasicAttackIntent(11, EB.ATTACK_BUFF), 
            EB.createBasicBuffIntent(2, resolveStatus.name, EB.ATTACK_BUFF)
        ] },
        { id: 8,  probability: 0.2, cooldown: 0, intents: [
            EB.createDefenseIntent(10, EB.DEFEND_BUFF), 
            EB.createBasicBuffIntent(2, resolveStatus.name, EB.DEFEND_BUFF)
        ] },
        { id: 9,  probability: 0.2, cooldown: 0, intents: [
            EB.createDefenseIntent(10, EB.DEFEND_DEBUFF), 
            EB.createBasicDebuffIntent(2, feebleStatus.name, EB.DEFEND_DEBUFF)
        ] },
        { id: 10, probability: 0.2, cooldown: 0, intents: [EB.callForReinforcements([caveGoblinMinionData.enemyId], EB.CALL_FOR_REINFORCEMENTS)] },
        { id: 11, probability: 0.2, cooldown: 0, intents: [getSignatureMove(EB.SIGNATURE_MOVE)] }
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const deepGoblinData: Enemy = {
    enemyId: 28,
    stage: 2,
    selectable: true,
    isActive: true,
    name: 'Deep Goblin',
    type: EnemyTypeEnum.Goblin,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Medium,
    description: 'A goblin imbued with the power of the Mold, gaining magical prowess at the expense of whatever little sanity it used to possess. Its aggressiveness is only matched by its appetite, which it will not hesitate to satiate even with those of its own kin.',
    healthRange: [40, 50],
    aggressiveness: 0.4,
    attackLevels: [BasicIntents, AdvancedIntents]
}

