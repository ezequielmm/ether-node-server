import { Injectable } from '@nestjs/common';
import { damageEffect } from 'src/game/effects/damage/constants';
import { JsonEffect } from '../../effects/effects.interface';
import { EffectService } from '../../effects/effects.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { burn } from './constants';

@StatusDecorator({
    status: burn,
})
@Injectable()
export class BurnStatus implements StatusEventHandler {
    constructor(private readonly effectService: EffectService) {}

    async handle(dto: StatusEventDTO): Promise<void> {
        const effect: JsonEffect = {
            effect: damageEffect.name,
            args: {
                value: dto.status.args.value,
            },
        };

        await this.effectService.apply({
            client: dto.client,
            expedition: dto.expedition,
            source: dto.source,
            target: dto.target,
            effect,
        });

        dto.status.args.value++;
        dto.update(dto.status.args);
    }
}
