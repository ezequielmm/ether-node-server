import { Injectable } from '@nestjs/common';
import { PlayerService } from 'src/game/components/player/player.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { trapped } from './constants';

@StatusDecorator({
    status: trapped,
})
@Injectable()
export class TrappedStatus implements StatusEventHandler {
    constructor(private readonly playerService: PlayerService) {}

    async handle(dto: StatusEventDTO): Promise<void> {
        const { ctx, status, remove } = dto;

        await this.playerService.damage(ctx, 12 * status.args.counter);

        dto.ctx.client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.PlayerAffected,
                action: SWARAction.UpdatePlayer,
                data: {
                    description: 'The enemy is hiding and waiting to strike.',
                },
            }),
        );

        remove();
    }
}
