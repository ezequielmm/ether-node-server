import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { feebleStatus } from 'src/game/status/feeble/constants';
import { fatigue } from 'src/game/status/fatigue/constants';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService } from '../enemy-builder.service';
import { caveGoblinData } from './caveGoblin.enemy';
import { CardTargetedEnum } from '../../card/card.enum';
import { spawnEnemyEffect } from 'src/game/effects/spawnEnemy/contants';
import { cannibalizeEffect } from 'src/game/effects/cannibalize/constants';

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicAttack:       EnemyIntention = EnemyBuilderService.createBasicAttackIntent(11);
const SecondAttack:      EnemyIntention = EnemyBuilderService.createMultiplierAttackIntent(11, 2);
const BasicDefense:      EnemyIntention = EnemyBuilderService.createDefenseIntent(10);
const BuffResolve:       EnemyIntention = EnemyBuilderService.createBasicBuffIntent(2, resolveStatus.name);
const DebufFeeble:       EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(2, feebleStatus.name);
const DebuffFatigue:     EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(2, fatigue.name);
const Summon1CaveGoblin: EnemyIntention = EnemyBuilderService.invokeMinionsIntent([caveGoblinData.enemyId]);

const SignatureMove:     EnemyIntention = {
    type: EnemyIntentionType.Signature,
    target: CardTargetedEnum.Player,
    value: 0,
    effects: [
        {
            effect: spawnEnemyEffect.name,
            target: CardTargetedEnum.Self,
            args: {
                enemiesToSpawn: caveGoblinData.enemyId,
            },
            action: {
                name: 'signature_move',
                hint: 'signature_move',
            },
        },
        {
            effect: cannibalizeEffect.name,
            target: CardTargetedEnum.Self,
            args: {
                enemiesToCannibalize: caveGoblinData.enemyId,
            },
            action: {
                name: 'signature_move',
                hint: 'signature_move',
            },
        },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options:[
        { id: 1, probability: 0.1, cooldown: 0, intents: [BasicAttack] },
        { id: 2, probability: 0.1, cooldown: 0, intents: [SecondAttack] },
        { id: 3, probability: 0.2, cooldown: 0, intents: [BasicDefense] },
        { id: 4, probability: 0.2, cooldown: 0, intents: [BuffResolve] },
        { id: 5, probability: 0.2, cooldown: 0, intents: [DebufFeeble] },
        { id: 6, probability: 0.2, cooldown: 0, intents: [DebuffFatigue] },

    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 7,  probability: 0.2, cooldown: 0, intents: [BasicAttack, BuffResolve] },
        { id: 8,  probability: 0.2, cooldown: 0, intents: [BasicDefense, BuffResolve] },
        { id: 9,  probability: 0.2, cooldown: 0, intents: [BasicDefense, DebufFeeble] },
        { id: 10, probability: 0.2, cooldown: 0, intents: [Summon1CaveGoblin] },
        { id: 11, probability: 0.2, cooldown: 0, intents: [SignatureMove] }
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const deepGoblinData: Enemy = {
    enemyId: 28,
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

