import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService } from '../enemy-builder.service'
import { CardDestinationEnum } from '../../card/card.enum';
import { feebleStatus } from 'src/game/status/feeble/constants';
import { fatigue } from 'src/game/status/fatigue/constants';
import { burn } from 'src/game/status/burn/constants';


//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicAttack:     EnemyIntention = EnemyBuilderService.createBasicAttackIntent(12);
const BasicAttack2:     EnemyIntention = EnemyBuilderService.createBasicAttackIntent(13);
const SecondAttack:    EnemyIntention = EnemyBuilderService.createMultiplierAttackIntent(9, 2);
const SecondAttack2:    EnemyIntention = EnemyBuilderService.createMultiplierAttackIntent(13, 2); 
const BasicDefense:    EnemyIntention = EnemyBuilderService.createDefenseIntent(8);
const Buff2Resolve:     EnemyIntention = EnemyBuilderService.createBasicBuffIntent(2, resolveStatus.name);
const DebuffFeeble:     EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(1, feebleStatus.name);
const DebuffFatigue:    EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(1, fatigue.name);
const Counter:     EnemyIntention = EnemyBuilderService.createCounterAttack();
//const CallForReinforcements :
//const Mistify: EnemyIntention = EnemyBuilderService.createAddCardIntent(1, Mirage, CardDestinationEnum.Draw);
const Breach:    EnemyIntention = EnemyBuilderService.createBreachAttack(12);
const DebuffBurn:  EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(1, burn.name);
const Buff1Resolve:     EnemyIntention = EnemyBuilderService.createBasicBuffIntent(1, resolveStatus.name);
const Absorb:    EnemyIntention = EnemyBuilderService.createAbsorbAttack();
//const 2Mistify: EnemyIntention = EnemyBuilderService.createAddCardIntent(2, Mirage, CardDestinationEnum.Draw);
//const SignatureMove: 



//const CallForReinforcements2 :
//const Debuff3PoisonCard:    EnemyIntention = EnemyBuilderService.createAddCardIntent(3, Poison, CardDestinationEnum.Draw);
//const Debuff2PoisonCard:    EnemyIntention = EnemyBuilderService.createAddCardIntent(2, Poison, CardDestinationEnum.Draw);
//const Debuff1MoldCard: EnemyIntention = EnemyBuilderService.createAddCardIntent(1, Mold, CardDestinationEnum.Draw);


/*
TODO
-put correct Id
-Call for reinforcements Action(Summon 1 Fire Beetle)
-signatureMove Action(From the Depths)
- Mirage card
*/

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options:[
        { id: 1, probability: 0.1, cooldown: 0, intents: [BasicAttack] },
        { id: 2, probability: 0.1, cooldown: 0, intents: [SecondAttack] },
        { id: 3, probability: 0.1, cooldown: 0, intents: [BasicDefense] },
        { id: 4, probability: 0.1, cooldown: 0, intents: [Buff2Resolve] },
        { id: 5, probability: 0.1, cooldown: 0, intents: [DebuffFeeble] },
        { id: 6, probability: 0.1, cooldown: 0, intents: [DebuffFatigue] },
        { id: 7, probability: 0.1, cooldown: 0, intents: [Counter] },
        //{ id: 8, probability: 0.2, cooldown: 0, intents: [CallForReinforcements] },
        //{ id: 9, probability: 0.3, cooldown: 0, intents: [Mistify] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 10,  probability: 0.1, cooldown: 0, intents: [BasicAttack, Buff2Resolve] }, 
        { id: 11,  probability: 0.1, cooldown: 0, intents: [Breach] },
        { id: 12, probability: 0.1, cooldown: 0, intents: [BasicDefense, Buff2Resolve] },
        { id: 13, probability: 0.1, cooldown: 0, intents: [BasicAttack2, DebuffBurn] },
        { id: 14, probability: 0.1, cooldown: 0, intents: [SecondAttack2, DebuffBurn] },
        //{ id: 15, probability: 0.1, cooldown: 0, intents: [CallForReinforcements, Debuff2PoisonCard] }, intention is Counter + Call for Reinforcements but the action says Absorb + Summon 1 Fire Beetle
        //{ id: 16, probability: 0.2, cooldown: 0, intents: [2Mistify] },
        //{ id: 17, probability: 0.2, cooldown: 0, intents: [SignatureMove] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const deepSorcererRedData: Enemy = {
    enemyId: 2222,
    isActive: true,
    name: 'Deep Sorcerer Red',
    type: EnemyTypeEnum.Human,
    category: EnemyCategoryEnum.Elite,
    size: EnemySizeEnum.Large,
    description: 'TODO: Description',
    healthRange: [75, 90],
    aggressiveness: 0.4,
    attackLevels: [BasicIntents, AdvancedIntents]
}

