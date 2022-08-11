import { Injectable } from '@nestjs/common';
import { JsonEffect } from 'src/game/effects/effects.interface';
import { EffectService } from 'src/game/effects/effects.service';
import { healEffect } from 'src/game/effects/heal/constants';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { regenerate } from './contants';

@StatusDecorator({
    status: regenerate,
})
@Injectable()
export class RegenerateStatus implements StatusEventHandler {
    constructor(private readonly effectService: EffectService) {}

    async enemyHandler(dto: StatusEventDTO): Promise<void> {
        const effect: JsonEffect = {
            effect: healEffect.name,
            args: {
                value: dto.status.args.value,
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
