import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum, EnemyIntentionType } from '../enemy.enum';
import { Enemy } from '../enemy.schema';
import { spikesStatus } from 'src/game/status/spikes/constants';
import { fatigue } from 'src/game/status/fatigue/constants';
import { EnemyAction, EnemyIntention } from '../enemy.interface';
import { EnemyBuilderService as EB } from '../enemy-builder.service';
import { CardTargetedEnum } from '../../card/card.enum';
import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { revealStatus } from 'src/game/status/reveal/constants';

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Intents:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
// todo: Special: 

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Attack Table:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const BasicIntents: EnemyAction = {
    options:[
        { id: 1, probability: 0.4, cooldown: 0, intents: [EB.createDefenseIntent(11, EB.DEFEND)] },
        { id: 2, probability: 0.3, cooldown: 0, intents: [EB.createBasicBuffIntent(1, spikesStatus.name, EB.BUFF)] },
        { id: 3, probability: 0.3, cooldown: 0, intents: [EB.createBasicDebuffIntent(1, fatigue.name, EB.DEBUFF)] },
        // { id: 4, probability: 0.2, cooldown: 0, intents: [Special] },
    ]
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//- Enemy:
//-------------------------------------------------------------------------------------------------------------------------------------------------------
export const boobyTrapData: Enemy = {
    enemyId: 25,
    stage: 2,
    selectable: true,
    isActive: true,
    name: 'Booby Trap',
    type: EnemyTypeEnum.Fae,
    category: EnemyCategoryEnum.Basic,
    size: EnemySizeEnum.Medium,
    description: 'This shapeshifting fiend possesses the ability to probe into the heart of men. Sensing the avarice of those who venture beyond the portal, it takes the shape of a treasure chest and feeds off adventurers avarice… and limbs.',
    healthRange: [30, 40],
    aggressiveness: 0,
    attackLevels: [BasicIntents]
}

