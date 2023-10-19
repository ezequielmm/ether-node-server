import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService } from '../enemy-builder.service'
import { feebleStatus } from 'src/game/status/feeble/constants';
import { CardDestinationEnum, CardTargetedEnum } from '../../card/card.enum';
import { moldPolypData } from './moldPolyp.enemy';
import { MoldCard } from '../../card/data/mold.card';
import { sporeDanceEffect } from 'src/game/effects/sporeDance/constants';

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicAttack:     EnemyIntention = EnemyBuilderService.createBasicAttackIntent(17);
const BasicDefense:    EnemyIntention = EnemyBuilderService.createDefenseIntent(15);
const Buff2Resolve:    EnemyIntention = EnemyBuilderService.createBasicBuffIntent(2, resolveStatus.name);
const Buff3Resolve:    EnemyIntention = EnemyBuilderService.createBasicBuffIntent(3, resolveStatus.name);
const Absorb:          EnemyIntention = EnemyBuilderService.createAbsorbAttack();
const DebuffFeeble:    EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(2, feebleStatus.name); 
const Breach:          EnemyIntention = EnemyBuilderService.createBreachAttack(12);
const Counter:         EnemyIntention = EnemyBuilderService.createCounterAttack();
const Reinforcements:  EnemyIntention = EnemyBuilderService.callForReinforcements([moldPolypData.enemyId]);
const Infect:          EnemyIntention = EnemyBuilderService.createInfectIntent(11, 2);
const DebuffMoldCard:  EnemyIntention = EnemyBuilderService.createAddCardIntent(1, MoldCard, CardDestinationEnum.Draw);
const Debuff2MoldCard: EnemyIntention = EnemyBuilderService.createAddCardIntent(2, MoldCard, CardDestinationEnum.Draw);
const Mistify:         EnemyIntention = EnemyBuilderService.createMistifyAction(1);
const SignatureMove:   EnemyIntention = {
    name: "Spore Dance",
    type: EnemyIntentionType.Signature,
    target: CardTargetedEnum.Player,
    value: 8,
    negateDamage: 15,
    effects: [
        {
            effect: sporeDanceEffect.name,
            target: CardTargetedEnum.Player,
            args: {
                value: 0,
            },
            action: {
                name: 'signature_move',
                hint: 'signature_move',
            },
        }
    ]
}


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
        { id: 6, probability: 0.3, cooldown: 0, intents: [Reinforcements] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 8,  probability: 0.1,  cooldown: 0, intents: [Breach] },
        { id: 9,  probability: 0.1,  cooldown: 0, intents: [BasicAttack, DebuffMoldCard] },
        { id: 10, probability: 0.1,  cooldown: 0, intents: [Reinforcements] },
        { id: 11, probability: 0.1,  cooldown: 0, intents: [BasicAttack, DebuffFeeble] },
        { id: 12, probability: 0.1,  cooldown: 0, intents: [Absorb, BasicDefense] },
        { id: 13, probability: 0.1,  cooldown: 0, intents: [Buff3Resolve] },
        { id: 14, probability: 0.1,  cooldown: 0, intents: [Mistify] },
        { id: 15, probability: 0.1,  cooldown: 0, intents: [Infect] },
        { id: 16, probability: 0.1,  cooldown: 0, intents: [Counter, Buff2Resolve] },
        { id: 17, probability: 0.05, cooldown: 0, intents: [Debuff2MoldCard] },
        { id: 18, probability: 0.05, cooldown: 0, intents: [SignatureMove] }
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const caveHomunculiData: Enemy = {
    enemyId: 41,
    stage: 2,
    selectable: true,
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

