import { Injectable } from '@nestjs/common';
import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { enemyIdField } from 'src/game/components/enemy/enemy.type';
import { EffectService } from 'src/game/effects/effects.service';
import {
    OnAttachStatusEventArgs,
    StatusEventDTO,
    StatusEventHandler,
    StatusType,
} from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { StatusService } from '../status.service';
import { resist } from './constants';

@StatusDecorator({
    status: resist,
})
@Injectable()
export class ResistStatus implements StatusEventHandler {
    constructor(private readonly statusService: StatusService) {}

    async handle(dto: StatusEventDTO<OnAttachStatusEventArgs>): Promise<void> {
        const { status, targetId } = dto.args;
        const { metadata } = this.statusService.findHandlerContainer({
            name: status.name,
        });

        if (metadata.status.type == StatusType.Debuff) {
            if (
                (EffectService.isPlayer(dto.target) &&
                    status.args.attachTo == CardTargetedEnum.Player) ||
                (EffectService.isEnemy(dto.target) &&
                    status.args.attachTo == CardTargetedEnum.Enemy &&
                    dto.target.value[enemyIdField(targetId)] == targetId)
            ) {
                status.args.attachTo = CardTargetedEnum.None;
                dto.status.args.value--;
                if (dto.status.args.value == 0) {
                    dto.remove();
                } else {
                    dto.update(dto.status.args);
                }
            }
        }
    }
}
