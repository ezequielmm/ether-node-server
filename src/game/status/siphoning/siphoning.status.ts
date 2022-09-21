import { Injectable } from '@nestjs/common';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { EffectService } from 'src/game/effects/effects.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { siphoning } from './constants';

@StatusDecorator({
    status: siphoning,
})
@Injectable()
export class SiphoningStatus implements StatusEventHandler {
    constructor(private readonly effectService: EffectService) {}

    async handle(dto: StatusEventDTO): Promise<void> {
        await this.effectService.apply({
            ctx: dto.ctx,
            source: dto.source,
            target: dto.target,
            effect: {
                effect: defenseEffect.name,
                args: {
                    value: dto.eventArgs.damageDealt,
                },
            },
        });

        dto.status.args.counter--;
        dto.update(dto.status.args);
    }
}
