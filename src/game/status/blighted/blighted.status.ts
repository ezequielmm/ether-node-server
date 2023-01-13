import { Injectable } from '@nestjs/common';
import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { damageEffect } from 'src/game/effects/damage/constants';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { blightedStatus } from './constants';

@StatusDecorator({
    status: blightedStatus,
})
@Injectable()
export class BlightedStatus implements StatusEventHandler {
    async handle(dto: StatusEventDTO): Promise<void> {
        const {
            status: { args },
            eventArgs: { card },
        } = dto;

        if (args.counter < 1) {
            dto.remove();
            return;
        }
        args.counter--;
        dto.update(args);

        card.properties.effects.push({
            effect: damageEffect.name,
            target: CardTargetedEnum.Self,
            args: {
                value: 4,
            },
        });
    }
}
