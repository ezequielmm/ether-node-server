import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { damageEffect } from 'src/game/effects/damage/constants';
import { EffectService } from '../../effects/effects.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { burn } from './constants';

@StatusDecorator({
    status: burn,
})
@Injectable()
export class BurnStatus implements StatusEventHandler {
    constructor(
        @Inject(forwardRef(() => EffectService))
        private readonly effectService: EffectService,
    ) {}

    async handle(dto: StatusEventDTO): Promise<void> {
        await this.effectService.apply({
            ctx: dto.ctx,
            source: dto.source,
            target: dto.target,
            effect: {
                effect: damageEffect.name,
                args: {
                    value: dto.status.args.counter,
                },
            },
        });

        dto.status.args.counter++;
        dto.update(dto.status.args);
    }
}
