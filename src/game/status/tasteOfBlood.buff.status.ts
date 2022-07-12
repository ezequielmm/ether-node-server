import { Injectable } from '@nestjs/common';
import { damageEffect } from '../effects/constants';
import { HeraldDelayedStatus } from './heraldDelayed.status';
import {
    Status,
    StatusDirection,
    StatusStartsAt,
    StatusType,
} from './interfaces';
import { StatusDecorator } from './status.decorator';

export const tasteOfBloodBuff: Status = {
    name: 'tasteOfBlood:buff',
    type: StatusType.Buff,
    direction: StatusDirection.Outgoing,
    startsAt: StatusStartsAt.NextTurn,
};

/**
 * Taste of Blood buff.
 *
 * @description
 * This status is a buff that increases the damage of the next damage effect.
 * Note that it extends from HeraldDelayedStatus, it has the same behavior.
 */
@StatusDecorator({
    status: tasteOfBloodBuff,
    effects: [damageEffect],
})
@Injectable()
export class TasteOfBloodBuffStatus extends HeraldDelayedStatus {}
