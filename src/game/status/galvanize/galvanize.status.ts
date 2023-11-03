import { Injectable } from '@nestjs/common';
import { EffectService } from '../../effects/effects.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { galvanize } from './constants';
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
        
        if(dto.eventArgs.card.cardType == 'attack' && dto.source.type == 'player'){

            console.log("entre al if cuando jugue ATTACK-------------------------");
            
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
        }
    }

}
