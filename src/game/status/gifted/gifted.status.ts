import { Injectable } from '@nestjs/common';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { EffectService } from 'src/game/effects/effects.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { gifted } from './constants';

@StatusDecorator({
    status: gifted,
})
@Injectable()
export class GiftedStatus implements StatusEventHandler {
    constructor(private readonly effectService: EffectService) {}

    async handle(dto: StatusEventDTO): Promise<void> {
        const { ctx, source, target, status } = dto;

        await this.effectService.apply({
            ctx,
            source,
            target,
            effect: {
                effect: defenseEffect.name,
                args: {
                    value: status.args.counter,
                },
            },
        });
    }
}
