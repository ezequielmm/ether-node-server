import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService } from '../enemy-builder.service'
import { CardDestinationEnum, CardTargetedEnum } from '../../card/card.enum';
import { feebleStatus } from 'src/game/status/feeble/constants';
import { fatigue } from 'src/game/status/fatigue/constants';
import { moldPolypData } from './moldPolyp.enemy';
import { PoisonedCard } from '../../card/data/poisoned.card';
import { MoldCard } from '../../card/data/mold.card';
import { damageEffect } from 'src/game/effects/damage/constants';
import { sporeDanceEffect } from 'src/game/effects/sporeDance/constants';
import { addCardEffect } from 'src/game/effects/addCard/contants';
import { AddCardPosition } from 'src/game/effects/effects.enum';


//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicAttack:       EnemyIntention = EnemyBuilderService.createBasicAttackIntent(12);
const SecondAttack:      EnemyIntention = EnemyBuilderService.createMultiplierAttackIntent(12, 2); 
const BasicDefense:      EnemyIntention = EnemyBuilderService.createDefenseIntent(10);
const Buff2Resolve:      EnemyIntention = EnemyBuilderService.createBasicBuffIntent(2, resolveStatus.name);
const Buff1Resolve:      EnemyIntention = EnemyBuilderService.createBasicBuffIntent(1, resolveStatus.name);
const Debuff2Feeble:     EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(2, feebleStatus.name);
const Debuff2Fatigue:    EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(2, fatigue.name);
const Absorb:            EnemyIntention = EnemyBuilderService.createAbsorbAttack();
const Reinforcements:    EnemyIntention = EnemyBuilderService.callForReinforcements([moldPolypData.enemyId]);
const Mistify:           EnemyIntention = EnemyBuilderService.createMistifyAction(1);
const Breach:            EnemyIntention = EnemyBuilderService.createBreachAttack(11);
const Debuff3PoisonCard: EnemyIntention = EnemyBuilderService.createAddCardIntent(3, PoisonedCard, CardDestinationEnum.Draw);
const Debuff1MoldCard:   EnemyIntention = EnemyBuilderService.createAddCardIntent(1, MoldCard, CardDestinationEnum.Draw);
const Debuff2PoisonCard: EnemyIntention = EnemyBuilderService.createAddCardIntent(2, PoisonedCard, CardDestinationEnum.Draw);
const Mistify2:          EnemyIntention = EnemyBuilderService.createMistifyAction(2);
const SignatureMove:     EnemyIntention = {
    type: EnemyIntentionType.Signature,
    target: CardTargetedEnum.Player,
    value: 12,
    negateDamage: 10,
    effects: [
        {
            effect: damageEffect.name,
            target: CardTargetedEnum.Player,
            args: {
                value: 12,
                multiplier: 2,
            },
            action: {
                name: 'signature_move',
                hint: 'signature_move',
            },
        },
        {
            effect: sporeDanceEffect.name,
            target: CardTargetedEnum.Player,
            action: {
                name: 'signature_move',
                hint: 'signature_move',
            },
        },
        {
            effect: addCardEffect.name,
            target: CardTargetedEnum.Player,
            args: {
                value: 3,
                cardId: MoldCard.cardId,     
                destination: CardDestinationEnum.Draw,
                position: AddCardPosition.Random,
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
        { id: 1, probability: 0.1, cooldown: 0, intents: [BasicAttack] },
        { id: 2, probability: 0.1, cooldown: 0, intents: [SecondAttack] },
        { id: 3, probability: 0.1, cooldown: 0, intents: [BasicDefense] },
        { id: 4, probability: 0.1, cooldown: 0, intents: [Buff2Resolve] },
        { id: 5, probability: 0.1, cooldown: 0, intents: [Debuff2Feeble] },
        { id: 6, probability: 0.1, cooldown: 0, intents: [Debuff2Fatigue] },
        { id: 7, probability: 0.1, cooldown: 0, intents: [Absorb] },
        { id: 8, probability: 0.2, cooldown: 0, intents: [Reinforcements] },
        { id: 9, probability: 0.1, cooldown: 0, intents: [Mistify] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 10, probability: 0.1, cooldown: 0, intents: [BasicAttack, Buff1Resolve] }, 
        { id: 11, probability: 0.1, cooldown: 0, intents: [Breach] },
        { id: 12, probability: 0.1, cooldown: 0, intents: [BasicDefense, Buff1Resolve] },
        { id: 13, probability: 0.1, cooldown: 0, intents: [BasicAttack, Debuff3PoisonCard] },
        { id: 14, probability: 0.1, cooldown: 0, intents: [BasicAttack, Debuff1MoldCard] },
        { id: 15, probability: 0.1, cooldown: 0, intents: [SecondAttack, Debuff2PoisonCard] },
        { id: 16, probability: 0.1, cooldown: 0, intents: [Absorb, Reinforcements] },
        { id: 17, probability: 0.1, cooldown: 0, intents: [Reinforcements] },
        { id: 18, probability: 0.1, cooldown: 0, intents: [Mistify2] },
        { id: 19, probability: 0.1, cooldown: 0, intents: [SignatureMove] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const deepSorcererGreenData: Enemy = {
    enemyId: 56,
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

