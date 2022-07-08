import { Injectable } from '@nestjs/common';
import { EffectName } from '../effects/effects.enum';
import { HeraldDelayedStatus } from './heraldDelayed.status';
import {
    Status,
    StatusDirection,
    StatusStartsAt,
    StatusType,
} from './interfaces';
import { StatusDecorator } from './status.decorator';

export const tasteOfBloodDebuff: Status = {
    name: 'tasteOfBlood:debuff',
    type: StatusType.Debuff,
    direction: StatusDirection.Incoming,
    startsAt: StatusStartsAt.NextTurn,
};

/**
 * Taste of Blood buff.
 *
 * @description
 * This status is a debuff that increases the damage received of the next
 * damage effect handled by the enemy.
 * Note that it extends from HeraldDelayedStatus, it has the same behavior.
 */
@StatusDecorator({
    status: tasteOfBloodDebuff,
    effects: [EffectName.Damage],
})
@Injectable()
export class TasteOfBloodDebuffStatus extends HeraldDelayedStatus {}
