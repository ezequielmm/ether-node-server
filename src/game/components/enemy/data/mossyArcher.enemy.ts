import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { fatigue } from 'src/game/status/fatigue/constants';
import { feebleStatus } from 'src/game/status/feeble/constants';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService } from '../enemy-builder.service';

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicAttack:     EnemyIntention = EnemyBuilderService.createBasicAttackIntent(9);
const SecondAttack:    EnemyIntention = EnemyBuilderService.createMultiplierAttackIntent(9, 2); 
const DebuffFeeble:    EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(1, feebleStatus.name);
const BasicDefense:    EnemyIntention = EnemyBuilderService.createDefenseIntent(14);
const BuffResolve:     EnemyIntention = EnemyBuilderService.createBasicBuffIntent(2, resolveStatus.name);
const DebuffFatigue:    EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(1, fatigue.name);
const Counter:    EnemyIntention = EnemyBuilderService.createCounterAttack();


/*
TODO: Intents  
- Infect Actions( (8 - 10) Infect Damage + Infect 1  )
- Grow(10) Action( Gain 20 max hp + 3 grow damage bonus to attacks)
- SignatureMove Action( Ill Barrage  )

const Infect: 
const Grow:
const SignatureMove:
*/


//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options:[
        { id: 1, probability: 0.3, cooldown: 0, intents: [BasicAttack] },
        { id: 3, probability: 0.1, cooldown: 0, intents: [BasicAttack, DebuffFeeble] },
        { id: 4, probability: 0.1, cooldown: 0, intents: [BasicDefense] },
        { id: 5, probability: 0.1, cooldown: 0, intents: [BuffResolve] },
        { id: 6, probability: 0.1, cooldown: 0, intents: [DebuffFatigue] },
        { id: 7, probability: 0.1, cooldown: 0, intents: [Counter] },
        //{ id: 8, probability: 0.2, cooldown: 0, intents: [Infect] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 9,  probability: 0.1, cooldown: 0, intents: [SecondAttack] },
        { id: 10,  probability: 0.1, cooldown: 0, intents: [SecondAttack, DebuffFeeble] },
        { id: 11, probability: 0.1, cooldown: 0, intents: [SecondAttack, BuffResolve] },
        { id: 12, probability: 0.2, cooldown: 0, intents: [BasicDefense, BuffResolve] },
        //{ id: 13, probability: 0.2, cooldown: 0, intents: [Grow] },
        { id: 12, probability: 0.2, cooldown: 0, intents: [Counter, BasicDefense] },
        //{ id: 12, probability: 0.2, cooldown: 0, intents: [Infect, SecondAttack] },
        //{ id: 12, probability: 0.2, cooldown: 0, intents: [SignatureMove] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const mossyArcherData: Enemy = {
    enemyId: 32,
    isActive: true,
    name: 'Mossy Archer',
    type: EnemyTypeEnum.Undead,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Medium,
    description: 'The corpse of a fallen Archer overtaken by the Mold. It can shoot arrows as efficiently as it did when it was alive, but now it can take them without flinching too.',
    healthRange: [40, 50],
    aggressiveness: 0.4,
    attackLevels: [BasicIntents, AdvancedIntents]
}

