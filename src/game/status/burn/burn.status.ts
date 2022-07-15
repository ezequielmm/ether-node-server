import { Injectable } from '@nestjs/common';
import { damageEffect } from '../../effects/constants';
import { JsonEffect } from '../../effects/effects.interface';
import { EffectService } from '../../effects/effects.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { StatusService } from '../status.service';
import { burn } from './constants';

@StatusDecorator({
    status: burn,
})
@Injectable()
export class BurnStatus implements StatusEventHandler {
    constructor(
        private readonly effectService: EffectService,
        private readonly statusService: StatusService,
    ) {}

    async handle(dto: StatusEventDTO): Promise<void> {
        const source = await this.statusService.getSourceFromReference(
            dto.client,
            dto.source,
        );
        const effect: JsonEffect = {
            effect: damageEffect.name,
            args: {
                value: dto.args.value,
            },
        };

        await this.effectService.apply(
            dto.client,
            dto.expedition,
            source,
            dto.target,
            effect,
        );
    }
}
