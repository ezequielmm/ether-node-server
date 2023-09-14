import {
    EnemyTypeEnum,
    EnemyCategoryEnum,
    EnemySizeEnum,
    EnemyIntentionType,
} from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService } from '../enemy-builder.service';
import { spikesStatus } from 'src/game/status/spikes/constants';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { feebleStatus } from 'src/game/status/feeble/constants';
import { CardTargetedEnum } from '../../card/card.enum';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { damageEffect } from 'src/game/effects/damage/constants';
import { addCardEffect } from 'src/game/effects/addCard/contants';
import { AddCardPosition } from 'src/game/effects/effects.enum';
import { StunnedCard } from '../../card/data/stunned.card';


//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicAttack:     EnemyIntention = EnemyBuilderService.createBasicAttackIntent(8);
const SecondAttack:    EnemyIntention = EnemyBuilderService.createMultiplierAttackIntent(8, 2);
const BasicDefense:    EnemyIntention = EnemyBuilderService.createDefenseIntent(8);
const BuffSpikes:      EnemyIntention = EnemyBuilderService.createBasicBuffIntent(1, spikesStatus.name);
const BuffResolve:     EnemyIntention = EnemyBuilderService.createBasicBuffIntent(1, resolveStatus.name);
const DebuffFeeble:    EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(1, feebleStatus.name);

const SignatureAttack: EnemyIntention = {
    type: EnemyIntentionType.Signature,
    target: CardTargetedEnum.Player,
    value: 7,
    negateDamage: 5,
    effects: [
        {
            effect: defenseEffect.name,
            target: CardTargetedEnum.Self,
            args: {
                value: 12,
            },
            action: {
                name: 'signature_move',
                hint: 'signature_move',
            },
        },
        {
            effect: damageEffect.name,
            target: CardTargetedEnum.Player,
            args: {
                value: 7,
                multiplier: 2,
            },
            action: {
                name: 'signature_move',
                hint: 'signature_move',
            },
        },
        {
            effect: addCardEffect.name,
            target: CardTargetedEnum.Player,
            args: {
                value: 1,
                cardId: StunnedCard.cardId,     //todo: change to Mold card when it exists
                destination: 'draw',
                position: AddCardPosition.Random,
            },
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
        { id: 1, probability: 0.2, cooldown: 0, intents: [BasicAttack] },
        { id: 2, probability: 0.2, cooldown: 0, intents: [SecondAttack] },
        { id: 3, probability: 0.1, cooldown: 0, intents: [BasicDefense] },
        { id: 4, probability: 0.2, cooldown: 0, intents: [BuffSpikes] },
        { id: 5, probability: 0.1, cooldown: 0, intents: [BuffResolve] },
        { id: 6, probability: 0.1, cooldown: 0, intents: [DebuffFeeble] },
        { id: 7, probability: 0.1, cooldown: 0, intents: [SignatureAttack] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 8,  probability: 0.2, cooldown: 0, intents: [BasicAttack, BuffResolve] },
        { id: 9,  probability: 0.3, cooldown: 0, intents: [BasicDefense, BuffSpikes] },
        { id: 10, probability: 0.3, cooldown: 0, intents: [BasicDefense, DebuffFeeble] },
        { id: 11, probability: 0.2, cooldown: 0, intents: [SignatureAttack, DebuffFeeble] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const centipionData: Enemy = {
    enemyId: 19,
    isActive: true,
    name: 'Centipion',
    type: EnemyTypeEnum.Insectoid,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Medium,
    description: 'A human-sized centipede that has been completely overtaken by the Mold. It´s long dead, but its carcass serves the Mold as an instrument for locomotion, expansion, and more crucially, nourishment.',
    healthRange: [15, 25],
    aggressiveness: 0.4,
    attackLevels: [BasicIntents, AdvancedIntents]
};
