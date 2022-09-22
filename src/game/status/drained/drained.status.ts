import { Injectable } from '@nestjs/common';
import { PlayerService } from 'src/game/components/player/player.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { drained } from './constants';

@StatusDecorator({
    status: drained,
})
@Injectable()
export class DrainedStatus implements StatusEventHandler {
    constructor(private readonly playerService: PlayerService) {}

    async handle(dto: StatusEventDTO<Record<string, any>>): Promise<any> {
        const { ctx, target, status, remove } = dto;

        if (PlayerService.isPlayer(target)) {
            await this.playerService.setEnergy(
                ctx,
                target.value.combatState.energy - status.args.counter,
            );

            dto.ctx.client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.PlayerAffected,
                    action: SWARAction.UpdateEnergy,
                    data: [
                        target.value.combatState.energy,
                        target.value.combatState.energyMax,
                    ],
                }),
            );
        }

        remove();
    }
}
