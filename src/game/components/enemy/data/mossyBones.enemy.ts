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
const BasicAttack:     EnemyIntention = EnemyBuilderService.createBasicAttackIntent(10);
const BasicDefense:    EnemyIntention = EnemyBuilderService.createDefenseIntent(12);
const BuffResolve:     EnemyIntention = EnemyBuilderService.createBasicBuffIntent(1, resolveStatus.name);
const DebuffFatigue:    EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(1, fatigue.name);
const DebuffFeeble:   EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(2, feebleStatus.name);


/*
TODO: Intents  
- Infect1 Actions( (8 - 10 Infect Damage) + Infect 1  )
- SignatureMove Action( develop )
- DebuffPoisonedCards Action(add 2 posioned cards to target’s deck)

const Infect: 
const SignatureMove:
const DebuffPoisonedCards:
*/


//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options:[
        { id: 1, probability: 0.3, cooldown: 0, intents: [BasicAttack] },
        { id: 3, probability: 0.1, cooldown: 0, intents: [BasicDefense] },
        { id: 4, probability: 0.2, cooldown: 0, intents: [BuffResolve] },
        { id: 5, probability: 0.1, cooldown: 0, intents: [DebuffFatigue] },
        { id: 6, probability: 0.3, cooldown: 0, intents: [DebuffFeeble] }
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 7,  probability: 0.1, cooldown: 0, intents: [BasicAttack, BuffResolve] },
        { id: 8,  probability: 0.1, cooldown: 0, intents: [BasicAttack, DebuffFeeble] },
        { id: 9, probability: 0.1, cooldown: 0, intents: [BasicDefense, BuffResolve] },
        //{ id: 10, probability: 0.2, cooldown: 0, intents: [BasicDefense, DebuffPoisoned] },
        //{ id: 11, probability: 0.2, cooldown: 0, intents: [Infect1] },
        //{ id: 12, probability: 0.3, cooldown: 0, intents: [SignatureMove] }
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const mossyBonesData: Enemy = {
    enemyId: 31,
    isActive: true,
    name: 'Mossy Bones',
    type: EnemyTypeEnum.Undead,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Medium,
    description: 'A Mold that uses the remnants of a fallen warrior to defend itself in battle.',
    healthRange: [20, 35],
    aggressiveness: 0.4,
    attackLevels: [BasicIntents, AdvancedIntents]
}

