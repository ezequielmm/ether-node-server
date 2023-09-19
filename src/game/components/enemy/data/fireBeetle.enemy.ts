import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { feebleStatus } from 'src/game/status/feeble/constants';
import { fatigue } from 'src/game/status/fatigue/constants';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService } from '../enemy-builder.service';

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------

const BasicAttack:     EnemyIntention = EnemyBuilderService.createBasicAttackIntent(8);
const BasicDefense:    EnemyIntention = EnemyBuilderService.createDefenseIntent(11);
const BuffResolve:     EnemyIntention = EnemyBuilderService.createBasicBuffIntent(2, resolveStatus.name);
const DebufFeeble:    EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(2, feebleStatus.name);
const DebuffFatigue:    EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(2, fatigue.name);
/*
TODO: 
- Burn intent with 'Deal 1 Burn'
- signature move intent whit '3 self-Immolation' action  
*/

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options:[
        { id: 1, probability: 0.3, cooldown: 0, intents: [BasicAttack] },
        //{ id: 2, probability: 0.3, cooldown: 0, intents: [BasicAttack, Burn] },
        { id: 3, probability: 0.1, cooldown: 0, intents: [BasicDefense] },
        { id: 4, probability: 0.1, cooldown: 0, intents: [BuffResolve] },
        { id: 5, probability: 0.1, cooldown: 0, intents: [DebufFeeble] },
        //{ id: 6, probability: 0.1, cooldown: 0, intents: [SignatureMove] },

    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        //{ id: 7,  probability: 0.3, cooldown: 0, intents: [Breach, Burn] },
        { id: 8,  probability: 0.2, cooldown: 0, intents: [BasicAttack, BuffResolve] },
        { id: 9,  probability: 0.2, cooldown: 0, intents: [BasicDefense, BuffResolve] },
        { id: 9, probability: 0.2, cooldown: 0, intents: [BasicDefense, DebuffFatigue] },
        //{ id: 9, probability: 0.1, cooldown: 0, intents: [signatureMove, BasicAttack, Burn] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const fireBeetle: Enemy = {
    enemyId: 29,
    isActive: true,
    name: 'Fire Beetle',
    type: EnemyTypeEnum.Insectoid,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Small,
    description: 'A large insect with a magical burning core. Its exoskeleton is hardened and retains heat even after death, making them sought after by blacksmiths who use them to temper blades. Though not completely fireproof, they sometimes end up immolating themselves to death in the heat of battle.',
    healthRange: [30, 40],
    aggressiveness: 0.4,
    attackLevels: [BasicIntents, AdvancedIntents]
}

