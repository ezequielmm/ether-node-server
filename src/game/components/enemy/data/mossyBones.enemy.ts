import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { fatigue } from 'src/game/status/fatigue/constants';
import { feebleStatus } from 'src/game/status/feeble/constants';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService } from '../enemy-builder.service';
import { PoisonedCard } from '../../card/data/poisoned.card';
import { CardDestinationEnum, CardTargetedEnum } from '../../card/card.enum';
import { transformEffect } from 'src/game/effects/transform/constants';

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicAttack:    EnemyIntention = EnemyBuilderService.createBasicAttackIntent(10);
const BasicDefense:   EnemyIntention = EnemyBuilderService.createDefenseIntent(12);
const BuffResolve:    EnemyIntention = EnemyBuilderService.createBasicBuffIntent(1, resolveStatus.name);
const DebuffFatigue:  EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(1, fatigue.name);
const DebuffFeeble:   EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(2, feebleStatus.name);
const DebuffPoisoned: EnemyIntention = EnemyBuilderService.createAddCardIntent(2, PoisonedCard, CardDestinationEnum.Draw);
const Infect:         EnemyIntention = EnemyBuilderService.createInfectIntent(9, 1);
const SignatureMove:  EnemyIntention = {
    name: "Develop",
    type: EnemyIntentionType.Signature,
    target: CardTargetedEnum.Player,
    value: 0,
    negateDamage: 12,
    effects: [
        {
            effect: transformEffect.name,
            target: CardTargetedEnum.Self,
            action: {
                name: 'signature_move',
                hint: 'signature_move',
            },
        },
    ]
}

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
        { id: 9,  probability: 0.1, cooldown: 0, intents: [BasicDefense, BuffResolve] },
        { id: 10, probability: 0.2, cooldown: 0, intents: [BasicDefense, DebuffPoisoned] },
        { id: 11, probability: 0.2, cooldown: 0, intents: [Infect] },
        { id: 12, probability: 0.3, cooldown: 0, intents: [SignatureMove] }
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const mossyBonesData: Enemy = {
    enemyId: 31,
    stage: 2,
    selectable: true,
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

