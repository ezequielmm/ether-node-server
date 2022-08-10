import { Injectable } from '@nestjs/common';
import { EffectDTO } from 'src/game/effects/effects.interface';
import { StatusEffectDTO, StatusEffectHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { drained } from './constants';

@StatusDecorator({
    status: drained,
})
@Injectable()
export class DrainedStatus implements StatusEffectHandler {
    async preview(payload: StatusEffectDTO): Promise<EffectDTO> {
        return this.handle(payload);
    }

    async handle(payload: StatusEffectDTO): Promise<EffectDTO> {
        const {
            status: {
                args: {
                    value: { amountOfEnergyToReduce },
                },
            },
            effectDTO,
        } = payload;

        effectDTO.args.currentValue -= amountOfEnergyToReduce;

        return effectDTO;
    }
}
