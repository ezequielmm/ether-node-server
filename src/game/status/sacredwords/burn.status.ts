import { Injectable } from '@nestjs/common';
import { damageEffect } from 'src/game/effects/damage/constants';
import { EffectService } from '../../effects/effects.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { sacretwords } from './constants';

@StatusDecorator({
    status: sacretwords,
})
@Injectable()
export class SacredWordStatus implements StatusEventHandler {
    constructor(private readonly effectService: EffectService) {}

    //- It is only executed when the attack of the enemies ends, to add one of burn to those who are burned
    async handle(dto: StatusEventDTO): Promise<void> {
        await this.effectService.apply({
            ctx: dto.ctx,
            source: dto.source,
            target: dto.target,
            effect: {
                effect: damageEffect.name,
                args: {
                    value: dto.status.args.counter,
                    type: 'sacred words',
                },
            },
        });

        dto.status.args.counter++;
        dto.update(dto.status.args);
    }
}
