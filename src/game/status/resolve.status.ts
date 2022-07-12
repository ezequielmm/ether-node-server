import { Injectable } from '@nestjs/common';
import { DamageArgs, damageEffect } from '../effects/damage.effect';
import { EffectDTO } from '../effects/effects.interface';
import {
    IBaseStatus,
    Status,
    StatusDirection,
    StatusDTO,
    StatusStartsAt,
    StatusType,
} from './interfaces';
import { StatusDecorator } from './status.decorator';

export const resolve: Status = {
    name: 'resolve',
    type: StatusType.Buff,
    direction: StatusDirection.Outgoing,
    startsAt: StatusStartsAt.NextTurn,
};

@StatusDecorator({
    status: resolve,
    effects: [damageEffect],
})
@Injectable()
export class ResolveStatus implements IBaseStatus {
    async handle(dto: StatusDTO<DamageArgs>): Promise<EffectDTO<DamageArgs>> {
        const effectDTO = dto.effectDTO;
        effectDTO.args.currentValue = Math.max(
            effectDTO.args.currentValue + dto.args.value,
            0,
        );
        return effectDTO;
    }
}
