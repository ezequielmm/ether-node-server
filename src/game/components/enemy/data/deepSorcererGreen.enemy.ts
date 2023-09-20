import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService } from '../enemy-builder.service'
import { CardDestinationEnum } from '../../card/card.enum';
import { feebleStatus } from 'src/game/status/feeble/constants';
import { fatigue } from 'src/game/status/fatigue/constants';


//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicAttack:     EnemyIntention = EnemyBuilderService.createBasicAttackIntent(12);
const SecondAttack:    EnemyIntention = EnemyBuilderService.createMultiplierAttackIntent(12, 2); 
const BasicDefense:    EnemyIntention = EnemyBuilderService.createDefenseIntent(10);
const Buff2Resolve:     EnemyIntention = EnemyBuilderService.createBasicBuffIntent(2, resolveStatus.name);
const Buff1Resolve:     EnemyIntention = EnemyBuilderService.createBasicBuffIntent(1, resolveStatus.name);
const Debuff2Feeble:     EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(2, feebleStatus.name);
const Debuff2Fatigue:    EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(2, fatigue.name);
const Absorb:    EnemyIntention = EnemyBuilderService.createAbsorbAttack();
//const CallForReinforcements :
//const CallForReinforcements2 :
//const Mistify: EnemyIntention = EnemyBuilderService.createAddCardIntent(1, Mirage, CardDestinationEnum.Draw);
//const 2Mistify: EnemyIntention = EnemyBuilderService.createAddCardIntent(2, Mirage, CardDestinationEnum.Draw);
const Breach:    EnemyIntention = EnemyBuilderService.createBreachAttack(11);
//const Debuff3PoisonCard:    EnemyIntention = EnemyBuilderService.createAddCardIntent(3, Poison, CardDestinationEnum.Draw);
//const Debuff2PoisonCard:    EnemyIntention = EnemyBuilderService.createAddCardIntent(2, Poison, CardDestinationEnum.Draw);
//const Debuff1MoldCard: EnemyIntention = EnemyBuilderService.createAddCardIntent(1, Mold, CardDestinationEnum.Draw);


/*
TODO
-put correct Id
-Call for reinforcements Action(Summon 1 Mold Polyp)
-Call for reinforcements Action(Summon 2 Mold Polyp)
-signatureMove Action(Root of Evil)
- Mirage, poison, mold cards
*/

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options:[
        { id: 1, probability: 0.1, cooldown: 0, intents: [BasicDefense] },
        { id: 2, probability: 0.1, cooldown: 0, intents: [Buff2Resolve] },
        { id: 3, probability: 0.1, cooldown: 0, intents: [Debuff2Feeble] },
        { id: 4, probability: 0.1, cooldown: 0, intents: [Debuff2Fatigue] },
        { id: 5, probability: 0.1, cooldown: 0, intents: [Absorb] },
        //{ id: 6, probability: 0.2, cooldown: 0, intents: [CallForReinforcements] },
        //{ id: 7, probability: 0.3, cooldown: 0, intents: [Mistify] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 8,  probability: 0.1, cooldown: 0, intents: [BasicAttack, Buff1Resolve] }, 
        { id: 9,  probability: 0.1, cooldown: 0, intents: [Breach] },
        { id: 10, probability: 0.1, cooldown: 0, intents: [BasicDefense, Buff1Resolve] },
        //{ id: 11, probability: 0.1, cooldown: 0, intents: [BasicAttack, Debuff3PoisonCard] },
        //{ id: 12, probability: 0.1, cooldown: 0, intents: [BasicAttack, Debuff1MoldCard] },
        //{ id: 13, probability: 0.1, cooldown: 0, intents: [SecondAttack, Debuff2PoisonCard] },
        //{ id: 14, probability: 0.1, cooldown: 0, intents: [Absorb, CallForReinforcements1] },
        //{ id: 15, probability: 0.1, cooldown: 0, intents: [CallForReinforcements2] },
        //{ id: 16, probability: 0.1, cooldown: 0, intents: [2Mistify] },
        //{ id: 17, probability: 0.1, cooldown: 0, intents: [SignatureMove] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const deepSorcererGreenData: Enemy = {
    enemyId: 1111,
    isActive: true,
    name: 'Deep Sorcerer Green',
    type: EnemyTypeEnum.Human,
    category: EnemyCategoryEnum.Elite,
    size: EnemySizeEnum.Large,
    description: 'TODO: Description',
    healthRange: [75, 90],
    aggressiveness: 0.4,
    attackLevels: [BasicIntents, AdvancedIntents]
}

