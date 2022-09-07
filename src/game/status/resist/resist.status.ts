import { Injectable } from '@nestjs/common';
import { isEqual } from 'lodash';
import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { StatusEventDTO, StatusEventHandler, StatusType } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { StatusService } from '../status.service';
import { resist } from './constants';

@StatusDecorator({
    status: resist,
})
@Injectable()
export class ResistStatus implements StatusEventHandler {
    constructor(private readonly statusService: StatusService) {}

    async onEnemiesTurnStart(dto: StatusEventDTO): Promise<void> {
        const { status, target } = dto.args;
        const { metadata } = this.statusService.findHandlerContainer({
            name: status.name,
        });

        if (metadata.status.type == StatusType.Debuff) {
            if (isEqual(target, dto.target)) {
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
