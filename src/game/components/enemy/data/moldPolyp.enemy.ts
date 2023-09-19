import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService } from '../enemy-builder.service'

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicAttack:     EnemyIntention = EnemyBuilderService.createBasicAttackIntent(7);
//put destination
//const Poison:    EnemyIntention = EnemyBuilderService.createAddCardIntent(7,PoisonedCard, DESTINATION);
const BasicDefense:    EnemyIntention = EnemyBuilderService.createDefenseIntent(16);
const BuffResolve:     EnemyIntention = EnemyBuilderService.createBasicBuffIntent(2, resolveStatus.name);
//Mold card does not exist; put destination
//const DebuffMoldCard:  EnemyIntention = EnemyBuilderService.createAddCardIntent(1,Mold, DESTINATION);
const SecondAttack:    EnemyIntention = EnemyBuilderService.createMultiplierAttackIntent(8, 2); 

/*
TODO
-special intent action (Mitosis)
-signature move action (toxic Sacrifice)
-action MOL????????

const Special:
const signatureMove:
*/

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options:[
        //{ id: 1, probability: 0.3, cooldown: 0, intents: [BasicAttack, Poison] },  this should have MOL action
        //{ id: 3, probability: 0.1, cooldown: 0, intents: [SecondAttack, Poison] }, this intents says attack(2) but the action is = 2 x (5 - 10) damage + Add 2 poisoned cards to target deck
        { id: 4, probability: 0.1, cooldown: 0, intents: [BasicDefense] },
        { id: 5, probability: 0.1, cooldown: 0, intents: [BuffResolve] },
        //{ id: 6, probability: 0.1, cooldown: 0, intents: [Poison] }, poison gives 2 cards but this action must give (2-3) cards
        //{ id: 7, probability: 0.3, cooldown: 0, intents: [DebuffMoldCard] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        //{ id: 8,  probability: 0.1, cooldown: 0, intents: [BasicAttack, Poison] }, this intent says attack+ debuff but the action says 2 x (5 - 10) damage + Add 2 poisoned card to the target’s deck
        //{ id: 9,  probability: 0.1, cooldown: 0, intents: [SecondAttack, DebuffMoldCard] }, the intent says attack(2) + Debuff but the action says 2 x (5 - 10) damage + Add 1 Mold card to the target’s deck
        { id: 10, probability: 0.1, cooldown: 0, intents: [BasicDefense, BuffResolve] },
        //{ id: 11, probability: 0.1, cooldown: 0, intents: [BasicDefense, DebuffMoldCard] },
        //{ id: 12, probability: 0.1, cooldown: 0, intents: [Poison] },
        //{ id: 13, probability: 0.1, cooldown: 0, intents: [special] },
        //{ id: 14, probability: 0.2, cooldown: 0, intents: [Toxic Sacrifice] },
        //{ id: 15, probability: 0.2, cooldown: 0, intents: [SignatureMove] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const moldPolypData: Enemy = {
    enemyId: 33,
    isActive: true,
    name: 'Mold Polyp',
    type: EnemyTypeEnum.Mold,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Medium,
    description: 'A large invertebrate filled with poisonous gas. Its stench alone is enough to take out smaller creatures.',
    healthRange: [25, 35],
    aggressiveness: 0.4,
    attackLevels: [BasicIntents, AdvancedIntents]
}

