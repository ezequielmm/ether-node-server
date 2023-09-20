import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService } from '../enemy-builder.service'
import { feebleStatus } from 'src/game/status/feeble/constants';
import { CardDestinationEnum } from '../../card/card.enum';

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicAttack:     EnemyIntention = EnemyBuilderService.createBasicAttackIntent(17);
const BasicDefense:    EnemyIntention = EnemyBuilderService.createDefenseIntent(15);
const Buff2Resolve:     EnemyIntention = EnemyBuilderService.createBasicBuffIntent(2, resolveStatus.name);
const Buff3Resolve:     EnemyIntention = EnemyBuilderService.createBasicBuffIntent(3, resolveStatus.name);
const Absorb:  EnemyIntention = EnemyBuilderService.createAbsorbAttack();
const DebuffFeeble:    EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(2, feebleStatus.name); 
const Breach:    EnemyIntention = EnemyBuilderService.createBreachAttack(12);
const Counter:  EnemyIntention = EnemyBuilderService.createCounterAttack();
//const DebuffMoldCard:  EnemyIntention = EnemyBuilderService.createAddCardIntent(2, Mold, DESTINATION);


/*
TODO
mold card doesn not exist

-Call for Reinforcements action(Summon 2 Mold Polyp)
-Mistify action(Mistify 1)
-Infect action((10 - 12) Infect damage + Infect 2)
-SignatureMove action(Spore Dance)
-
const Special:
const signatureMove:
*/

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options:[
        { id: 1, probability: 0.3, cooldown: 0, intents: [BasicAttack] }, 
        { id: 4, probability: 0.1, cooldown: 0, intents: [BasicDefense] },
        { id: 3, probability: 0.1, cooldown: 0, intents: [Buff2Resolve] }, 
        { id: 5, probability: 0.1, cooldown: 0, intents: [Absorb] },
        { id: 3, probability: 0.1, cooldown: 0, intents: [DebuffFeeble] },
        //{ id: 6, probability: 0.1, cooldown: 0, intents: [CallForReinforcements] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 8,  probability: 0.1, cooldown: 0, intents: [Breach] },
        { id: 9,  probability: 0.1, cooldown: 0, intents: [BasicAttack] }, //this intent is attack but the action says (12 - 18) damage + Inflict 3 burn
        //{ id: 6, probability: 0.1, cooldown: 0, intents: [CallForReinforcements] },
        { id: 10, probability: 0.1, cooldown: 0, intents: [BasicAttack, DebuffFeeble] },
        { id: 11, probability: 0.1, cooldown: 0, intents: [Absorb, BasicDefense] },
        { id: 12, probability: 0.1, cooldown: 0, intents: [Buff3Resolve] },//  gives 3 resolve
        //{ id: 13, probability: 0.1, cooldown: 0, intents: [Mistify] },
        //{ id: 14, probability: 0.1, cooldown: 0, intents: [Infect] },
        { id: 15, probability: 0.1, cooldown: 0, intents: [Counter, Buff2Resolve] },
        //{ id: 15, probability: 0.05, cooldown: 0, intents: [DebuffMoldCard] },
        //{ id: 15, probability: 0.05, cooldown: 0, intents: [SignatureMove] }
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const caveHomunculiData: Enemy = {
    enemyId: 33,
    isActive: true,
    name: 'Cave Homunculi',
    type: EnemyTypeEnum.Plant,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Large,
    description: 'A large fungoid creature. It is capable of spreading spores that produce acute hallucinations. It reproduces by infesting the innards of its prey with corrosive fungi, usually while they are still alive.',
    healthRange: [40, 50],
    aggressiveness: 0.4,
    attackLevels: [BasicIntents, AdvancedIntents]
}

