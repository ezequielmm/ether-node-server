import {
    StatusDirection,
    StatusEffect,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

import * as glob from 'glob';
import { Effect } from 'src/game/effects/effects.interface';

export const confusion: StatusEffect = {
    name: 'confusion',
    type: StatusType.Debuff,
    startsAt: StatusStartsAt.Instantly,
    trigger: StatusTrigger.Effect,
    direction: StatusDirection.Outgoing,
    // Require all effects in the effects folder
    effects: glob
        .sync(__dirname + '/../../effects/**/constants.js')
        .flatMap((file) =>
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            Object.values(require(file)),
        ) as unknown[] as Effect[],
};
