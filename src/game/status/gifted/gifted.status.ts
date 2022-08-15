import { Injectable } from '@nestjs/common';
import { EffectDTO } from 'src/game/effects/effects.interface';
import { StatusEffectDTO, StatusEffectHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { gifted } from './constants';

@StatusDecorator({
    status: gifted,
})
@Injectable()
export class GiftedStatus implements StatusEffectHandler {
    async preview(payload: StatusEffectDTO): Promise<EffectDTO> {
        return this.handle(payload);
    }

    async handle(payload: StatusEffectDTO): Promise<EffectDTO> {
        const {
            status: {
                args: { value },
            },
            effectDTO,
        } = payload;

        effectDTO.args.currentValue = value;

        return effectDTO;
    }
}
