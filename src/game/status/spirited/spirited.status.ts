import { Injectable } from '@nestjs/common';
import { JsonEffect } from 'src/game/effects/effects.interface';
import { EffectService } from 'src/game/effects/effects.service';
import { energyEffect } from 'src/game/effects/energy/constants';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { spirited } from './contants';

@StatusDecorator({
    status: spirited,
})
@Injectable()
export class SpiritedStatus implements StatusEventHandler {
    constructor(private readonly effectService: EffectService) {}

    async handle(dto: StatusEventDTO): Promise<void> {
        const effect: JsonEffect = {
            effect: energyEffect.name,
            args: {
                value: dto.status.args.counter,
            },
        };

        await this.effectService.apply({
            ctx: dto.ctx,
            source: dto.source,
            target: dto.target,
            effect,
        });
    }
}
