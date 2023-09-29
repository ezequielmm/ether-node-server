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
const BasicAttack_sword: EnemyIntention = EnemyBuilderService.createBasicAttackIntent(14);
const BasicAttack_arrow: EnemyIntention = EnemyBuilderService.createBasicAttackIntent(9);
const DebuffFeeble:      EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(1, feebleStatus.name);
const BasicDefense:      EnemyIntention = EnemyBuilderService.createDefenseIntent(14);
const BuffResolve:       EnemyIntention = EnemyBuilderService.createBasicBuffIntent(2, resolveStatus.name);
const DebuffFatigue:     EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(1, fatigue.name);
const Breach:            EnemyIntention = EnemyBuilderService.createBreachAttack(16);
const Infect:            EnemyIntention = EnemyBuilderService.createInfectIntent(11, 1);

/*
TODO: Intents  
- Infect Actions( (10 - 12) Infect damage + Infect 1 )
- Grow Actions( Gain 20 max hp + 3 grow damage bonus to attacks ) 
- SignatureMove Action( Ill Blade )

const Grow:
const Infect: 
const SignatureMove:
*/


//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options:[
        { id: 1, probability: 0.2, cooldown: 0, intents: [BasicAttack_sword] },
        { id: 2, probability: 0.2, cooldown: 0, intents: [BasicAttack_arrow, DebuffFeeble] },
        { id: 3, probability: 0.1, cooldown: 0, intents: [BasicDefense] },
        { id: 4, probability: 0.2, cooldown: 0, intents: [BuffResolve] },
        { id: 5, probability: 0.1, cooldown: 0, intents: [DebuffFatigue] },
        { id: 6, probability: 0.2, cooldown: 0, intents: [Infect] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 6,  probability: 0.1, cooldown: 0, intents: [BasicAttack_sword, BuffResolve] },
        { id: 7,  probability: 0.1, cooldown: 0, intents: [BasicAttack_arrow, DebuffFeeble] },
        { id: 8, probability: 0.1, cooldown: 0, intents: [BasicDefense, BuffResolve] },
        { id: 9, probability: 0.1, cooldown: 0, intents: [Breach] },
        { id: 10, probability: 0.2, cooldown: 0, intents: [BasicDefense, DebuffFeeble] },
        //{ id: 11, probability: 0.2, cooldown: 0, intents: [Grow] },
        //{ id: 12, probability: 0.1, cooldown: 0, intents: [Infect, BasicAttack_sword] },
        //{ id: 13, probability: 0.1, cooldown: 0, intents: [SignatureMove] }
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const mossySkeletonData: Enemy = {
    enemyId: 30,
    isActive: true,
    name: 'Mossy Skeleton',
    type: EnemyTypeEnum.Undead,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Medium,
    description: 'As the mold takes over the remnants of fallen warriors, they stumble back into battle. Vacated of almost all traces of humanity, only their skills for combat and the occasional howl of anguish remain.',
    healthRange: [50, 60],
    aggressiveness: 0.4,
    attackLevels: [BasicIntents, AdvancedIntents]
}

