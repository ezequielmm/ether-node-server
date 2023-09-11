import {
    EnemyTypeEnum,
    EnemyCategoryEnum,
    EnemySizeEnum,
} from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService } from '../enemy-builder.service';
import { spikesStatus } from 'src/game/status/spikes/constants';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { feebleStatus } from 'src/game/status/feeble/constants';


//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicAttack:     EnemyIntention = EnemyBuilderService.createBasicAttackIntent(8);
const SecondAttack:    EnemyIntention = EnemyBuilderService.createMultiplierAttackIntent(8, 2);
const BasicDefense:    EnemyIntention = EnemyBuilderService.createDefenseIntent(8);
const BuffSpikes:      EnemyIntention = EnemyBuilderService.createBasicBuffIntent(1, spikesStatus.name);
const BuffResolve:     EnemyIntention = EnemyBuilderService.createBasicBuffIntent(1, resolveStatus.name);
const DebuffFeeble:    EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(1, feebleStatus.name);
const SignatureAttack: EnemyIntention = null;

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options:[
        { id: 1, probability: 0.2, cooldown: 0, intents: [BasicAttack] },
        { id: 2, probability: 0.2, cooldown: 0, intents: [SecondAttack] },
        { id: 3, probability: 0.1, cooldown: 0, intents: [BasicDefense] },
        { id: 4, probability: 0.2, cooldown: 0, intents: [BuffSpikes] },
        { id: 5, probability: 0.1, cooldown: 0, intents: [BuffResolve] },
        { id: 6, probability: 0.2, cooldown: 0, intents: [DebuffFeeble] },
        //{ id: 7, probability: 0.1, cooldown: 0, intents: [SignatureAttack] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 8,  probability: 0.4, cooldown: 0, intents: [BasicAttack, BuffResolve] },
        { id: 9,  probability: 0.3, cooldown: 0, intents: [BasicDefense, BuffSpikes] },
        { id: 10, probability: 0.3, cooldown: 0, intents: [BasicDefense, DebuffFeeble] },
        //{ id: 11, probability: 0.2, cooldown: 0, intents: [SignatureAttack, DebuffFeeble] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const centipionData: Enemy = {
    enemyId: 19,
    isActive: true,
    name: 'Centipion',
    type: EnemyTypeEnum.Insectoid,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Medium,
    description: 'A human-sized centipede that has been completely overtaken by the Mold. It´s long dead, but its carcass serves the Mold as an instrument for locomotion, expansion, and more crucially, nourishment.',
    healthRange: [15, 25],
    aggressiveness: 0.4,
    attackLevels: [BasicIntents, AdvancedIntents]
};
