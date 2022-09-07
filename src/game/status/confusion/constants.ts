import { damageEffect } from 'src/game/effects/damage/constants';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { doubleBurn } from 'src/game/effects/doubleBurn/constants';
import { drawCardEffect } from 'src/game/effects/drawCard/constants';
import { energyEffect } from 'src/game/effects/energy/constants';
import { healEffect } from 'src/game/effects/heal/constants';
import { removeDefenseEffect } from 'src/game/effects/removeDefense/constants';
import {
    StatusDirection,
    StatusEffect,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const confusion: StatusEffect = {
    name: 'confusion',
    type: StatusType.Debuff,
    startsAt: StatusStartsAt.NextPlayerTurn,
    trigger: StatusTrigger.Effect,
    direction: StatusDirection.Outgoing,
    // TODO: Create a way to specify all effects insteand of define one by one
    effects: [
        damageEffect,
        defenseEffect,
        doubleBurn,
        drawCardEffect,
        energyEffect,
        healEffect,
        removeDefenseEffect,
    ],
};
