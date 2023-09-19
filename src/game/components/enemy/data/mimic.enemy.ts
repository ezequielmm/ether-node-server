import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { spikesStatus } from 'src/game/status/spikes/constants';
import { fatigue } from 'src/game/status/fatigue/constants';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService } from '../enemy-builder.service';
import { CardTargetedEnum } from '../../card/card.enum';
import { absorbEffect } from 'src/game/effects/absorb/constants';
import { counterEffect } from 'src/game/effects/counter/constants';

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------

const BasicAttack:   EnemyIntention = EnemyBuilderService.createBasicAttackIntent(13);
const SecondAttack:  EnemyIntention = EnemyBuilderService.createMultiplierAttackIntent(13, 2);
const BasicDefense:  EnemyIntention = EnemyBuilderService.createDefenseIntent(11);
const BuffSpikes:    EnemyIntention = EnemyBuilderService.createBasicBuffIntent(1, spikesStatus.name);
const DebuffFatigue: EnemyIntention = EnemyBuilderService.createBasicDebuffIntent(2, fatigue.name);
const Counter:       EnemyIntention = EnemyBuilderService.createCounterAttack();
const Special:       EnemyIntention = {
    type: EnemyIntentionType.Special,
    target: CardTargetedEnum.Player,
    value: 0,
    effects: [
        {
            effect: absorbEffect.name,
            target: CardTargetedEnum.Player,
            args: {
                value: 0,
            },
            action: {
                name: 'special',
                hint: 'special',
            },
        },
        {
            effect: counterEffect.name,
            target: CardTargetedEnum.Player,
            args: {
                value: 0,
            },
            action: {
                name: 'special',
                hint: 'special',
            },
        },
    ]
};

/*
TODO: 
- signature move intent whit mimic action (Copies the last hand used by the opponent, in the same order. All buffs/defense bonuses get applied to self, all debuffs and damage is inflicted to the opponent.)
*/

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Tables:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options:[
        { id: 1, probability: 0.3, cooldown: 0, intents: [BasicAttack] },
        { id: 2, probability: 0.2, cooldown: 0, intents: [SecondAttack] },
        { id: 3, probability: 0.1, cooldown: 0, intents: [BasicDefense] },
        { id: 4, probability: 0.1, cooldown: 0, intents: [BuffSpikes] },
        { id: 5, probability: 0.1, cooldown: 0, intents: [DebuffFatigue] },
        { id: 6, probability: 0.2, cooldown: 0, intents: [Counter] },
        //{ id: 7, probability: 0.1, cooldown: 0, intents: [SignatureMove] }
    ]
}

const AdvancedIntents: EnemyAction = {
    options: [
        { id: 8,  probability: 0.3, cooldown: 0, intents: [BasicAttack, BuffSpikes] },
        { id: 9,  probability: 0.2, cooldown: 0, intents: [BasicDefense, BuffSpikes] },
        { id: 10, probability: 0.2, cooldown: 0, intents: [BasicDefense, DebuffFatigue] },
        { id: 11, probability: 0.2, cooldown: 0, intents: [Counter, BuffSpikes] },
        { id: 12, probability: 0.2, cooldown: 0, intents: [Special] },
        //{ id: 13, probability: 0.1, cooldown: 0, intents: [SignatureMove] }
        
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const mimicData: Enemy = {
    enemyId: 27,
    isActive: true,
    name: 'Mimic',
    type: EnemyTypeEnum.Fae,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Medium,
    description: 'This shapeshifting fiend possesses the ability to probe into the heart of men. Sensing the avarice of those who venture beyond the portal, it takes the shape of a treasure chest and feeds off adventurers avarice… and limbs.',
    healthRange: [60, 75],
    aggressiveness: 0.5,
    attackLevels: [BasicIntents, AdvancedIntents]
}

