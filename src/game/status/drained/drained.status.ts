import { Injectable } from '@nestjs/common';
import { JsonEffect } from 'src/game/effects/effects.interface';
import { EffectService } from 'src/game/effects/effects.service';
import { energyEffect } from 'src/game/effects/energy/constants';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { drained } from './constants';

@StatusDecorator({
    status: drained,
})
@Injectable()
export class DrainedStatus implements StatusEventHandler {
    constructor(private readonly effectService: EffectService) {}

    async enemyHandler(dto: StatusEventDTO): Promise<void> {
        const {
            status: {
                args: {
                    value: { amountOfEnergyToReduce },
                },
            },
            ctx,
            source,
            target,
        } = dto;

        const effect: JsonEffect = {
            effect: energyEffect.name,
            args: { value: -amountOfEnergyToReduce },
        };

        await this.effectService.apply({
            ctx,
            source,
            target,
            effect,
        });
    }
}
