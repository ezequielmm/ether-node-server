import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService } from '../enemy-builder.service'
import { CardDestinationEnum, CardTargetedEnum } from '../../card/card.enum';
import { PoisonedCard } from '../../card/data/poisoned.card';
import { MoldCard } from '../../card/data/mold.card';
import { damageEffect } from 'src/game/effects/damage/constants';
import { addCardEffect } from 'src/game/effects/addCard/contants';
import { AddCardPosition } from 'src/game/effects/effects.enum';
import { immolateEffect } from 'src/game/effects/immolate/constants';
import { mitosisEffect } from 'src/game/effects/mitosis/constants';


//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicAttack:    EnemyIntention = EnemyBuilderService.createBasicAttackIntent(7);
const Poison:         EnemyIntention = EnemyBuilderService.createAddCardIntent(1, PoisonedCard, CardDestinationEnum.Draw);
const Poison2:        EnemyIntention = EnemyBuilderService.createAddCardIntent(2, PoisonedCard, CardDestinationEnum.Draw);
const Poison3:        EnemyIntention = EnemyBuilderService.createAddCardIntent(3, PoisonedCard, CardDestinationEnum.Draw);
const BuffResolve:    EnemyIntention = EnemyBuilderService.createBasicBuffIntent(2, resolveStatus.name);
const DebuffMoldCard: EnemyIntention = EnemyBuilderService.createAddCardIntent(1, MoldCard, CardDestinationEnum.Draw);
const BasicDefense:   EnemyIntention = EnemyBuilderService.createDefenseIntent(16);
const SecondAttack:   EnemyIntention = EnemyBuilderService.createMultiplierAttackIntent(8, 2); 
const Special:        EnemyIntention = {
    type: EnemyIntentionType.Special,
    target: CardTargetedEnum.Player,
    value: 0,
    effects: [
        {
            effect: mitosisEffect.name,
            target: CardTargetedEnum.Player,
            action: {
                name: 'special',
                hint: 'special',
            },
        },
    ]
}


const SignatureMove:  EnemyIntention = {
    type: EnemyIntentionType.Signature,
    target: CardTargetedEnum.Player,
    value: 5,
    negateDamage: 8,
    effects: [
        {
            effect: damageEffect.name,
            target: CardTargetedEnum.Player,
            args:{
                value: 5,
                multiplier: 5,
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
                value: 3,
                cardId: PoisonedCard.cardId,     
                destination: CardDestinationEnum.Draw,
                position: AddCardPosition.Random,
            },
            action: {
                name: 'signature_move',
                hint: 'signature_move',
            },
        },
        {
            effect: immolateEffect.name,
            target: CardTargetedEnum.Player,
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
        { id: 1, probability: 0.2, cooldown: 0, intents: [BasicAttack, Poison] },  
        { id: 2, probability: 0.1, cooldown: 0, intents: [BuffResolve] },  
        { id: 3, probability: 0.1, cooldown: 0, intents: [DebuffMoldCard] },
        { id: 4, probability: 0.2, cooldown: 0, intents: [Poison2] },
        { id: 5, probability: 0.2, cooldown: 0, intents: [SecondAttack] },
        { id: 6, probability: 0.2, cooldown: 0, intents: [BasicDefense] },
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 8,  probability: 0.1, cooldown: 0, intents: [SecondAttack, Poison2] }, 
        { id: 9,  probability: 0.1, cooldown: 0, intents: [SecondAttack, DebuffMoldCard] },
        { id: 10, probability: 0.2, cooldown: 0, intents: [BasicDefense, BuffResolve] },
        { id: 11, probability: 0.1, cooldown: 0, intents: [BasicDefense, DebuffMoldCard] },
        { id: 12, probability: 0.1, cooldown: 0, intents: [Poison3] },
        { id: 13, probability: 0.2, cooldown: 0, intents: [Special] },
        { id: 14, probability: 0.2, cooldown: 0, intents: [SignatureMove] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const moldPolypData: Enemy = {
    enemyId: 40,
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

