import { Socket } from 'socket.io';
import { ExpeditionService } from '../expedition.service';
import { ExpeditionStatusEnum } from '../enums';
import { Injectable } from '@nestjs/common';
import { CustomException, ErrorBehavior } from 'src/socket/custom.exception';
import {
    StandardResponseService,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse.service';

@Injectable()
export class FullSyncAction {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly standardResponseService: StandardResponseService,
    ) {}

    async handle(client: Socket): Promise<void> {
        const expedition = await this.expeditionService.findOne({
            client_id: client.id,
            status: ExpeditionStatusEnum.InProgress,
        });

        if (!expedition) {
            throw new CustomException(
                `Expedition not found by client id ${client.id}. Another connection may have been initialized invalidating the current id.`,
                ErrorBehavior.ReturnToMainMenu,
            );
        }

        const { map, player_state } = expedition;

        client.emit(
            'ExpeditionMap',
            this.standardResponseService.createResponse({
                message_type: SWARMessageType.MapUpdate,
                action: SWARAction.ShowMap,
                data: map,
            }),
        );

        client.emit(
            'PlayerState',
            this.standardResponseService.createResponse({
                message_type: SWARMessageType.PlayerStateUpdate,
                action: SWARAction.UpdatePlayerState,
                data: player_state,
            }),
        );
    }
}
