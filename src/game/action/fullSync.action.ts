import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CustomException, ErrorBehavior } from 'src/socket/custom.exception';
import { ExpeditionService } from '../components/expedition/expedition.service';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from '../standardResponse/standardResponse';

@Injectable()
export class FullSyncAction {
    private readonly logger: Logger = new Logger(FullSyncAction.name);

    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(client: Socket): Promise<void> {
        const expedition = await this.expeditionService.findOne({
            clientId: client.id,
        });

        if (!expedition)
            throw new CustomException(
                `Expedition not found by client id ${client.id}. Another connection may have been initialized invalidating the current id.`,
                ErrorBehavior.ReturnToMainMenu,
            );

        const { map, playerState } = expedition;

        this.logger.debug(`Sent message ExpeditionMap to client ${client.id}`);

        client.emit(
            'ExpeditionMap',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.MapUpdate,
                    action: SWARAction.ShowMap,
                    data: map,
                }),
            ),
        );

        this.logger.debug(`Sent message PlayerState to client ${client.id}`);

        client.emit(
            'PlayerState',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.PlayerStateUpdate,
                    action: SWARAction.UpdatePlayerState,
                    data: { playerState },
                }),
            ),
        );
    }
}
