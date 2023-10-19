import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { fatigue } from 'src/game/status/fatigue/constants';
import { feebleStatus } from 'src/game/status/feeble/constants';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService } from '../enemy-builder.service';
import { CardTargetedEnum } from '../../card/card.enum';
import { damageEffect } from 'src/game/effects/damage/constants';

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicAttack:   EnemyIntention = EnemyBuilderService.createBasicAttackIntent(9);
const SecondAttack:  EnemyIntention = EnemyBuilderService.createMultiplierAttackIntent(9, 2); 
const DebuffFeeble:  EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(1, feebleStatus.name);
const BasicDefense:  EnemyIntention = EnemyBuilderService.createDefenseIntent(14);
const BuffResolve:   EnemyIntention = EnemyBuilderService.createBasicBuffIntent(2, resolveStatus.name);
const DebuffFatigue: EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(1, fatigue.name);
const Counter:       EnemyIntention = EnemyBuilderService.createCounterAttack();
const Infect:        EnemyIntention = EnemyBuilderService.createInfectIntent(9, 1);
const Grow:          EnemyIntention = EnemyBuilderService.createGrowIntent(20, 10, 3);
const SignatureMove: EnemyIntention = {
    name: "Ill Barrage",
    type: EnemyIntentionType.Signature,
    target: CardTargetedEnum.Player,
    value: 8,
    negateDamage: 8,
    effects: [
        {
            effect: damageEffect.name,
            target: CardTargetedEnum.Player,
            args: {
                value: 8,
                multiplier: 4,
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
        { id: 3, probability: 0.1, cooldown: 0, intents: [BasicAttack, DebuffFeeble] },
        { id: 4, probability: 0.1, cooldown: 0, intents: [BasicDefense] },
        { id: 5, probability: 0.1, cooldown: 0, intents: [BuffResolve] },
        { id: 6, probability: 0.1, cooldown: 0, intents: [DebuffFatigue] },
        { id: 7, probability: 0.1, cooldown: 0, intents: [Counter] },
        { id: 8, probability: 0.2, cooldown: 0, intents: [Infect] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 9,  probability: 0.1, cooldown: 0, intents: [SecondAttack] },
        { id: 10, probability: 0.1, cooldown: 0, intents: [SecondAttack, DebuffFeeble] },
        { id: 11, probability: 0.1, cooldown: 0, intents: [SecondAttack, BuffResolve] },
        { id: 12, probability: 0.1, cooldown: 0, intents: [BasicDefense, BuffResolve] },
        { id: 13, probability: 0.2, cooldown: 0, intents: [Grow] },
        { id: 14, probability: 0.1, cooldown: 0, intents: [Counter, BasicDefense] },
        { id: 15, probability: 0.1, cooldown: 0, intents: [Infect, SecondAttack] },
        { id: 16, probability: 0.2, cooldown: 0, intents: [SignatureMove] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const mossyArcherData: Enemy = {
    enemyId: 32,
    stage: 2,
    selectable: true,
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

