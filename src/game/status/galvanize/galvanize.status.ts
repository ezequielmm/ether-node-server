import { Injectable } from '@nestjs/common';
import { damageEffect } from 'src/game/effects/damage/constants';
import { EffectService } from '../../effects/effects.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { galvanize } from './constants';
import { ExpeditionEntity } from '../../components/interfaces';
import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { defenseEffect } from 'src/game/effects/defense/constants';

@StatusDecorator({
    status: galvanize,
})
@Injectable()
export class GalvanizeStatus implements StatusEventHandler {
    constructor(private readonly effectService: EffectService) {}

    async handle(dto: StatusEventDTO): Promise<void> {

        console.log(dto);
        
            await this.effectService.apply({
                ctx: dto.ctx,
                source: dto.source,
                target: dto.source,
                effect: {
                    effect: defenseEffect.name,
                    args: {
                        value: dto.status.args.value,
                    },
                },
            });
        
        dto.status.args.counter++;
        dto.update(dto.status.args);
    }
}
