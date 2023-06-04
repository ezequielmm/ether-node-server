import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CustomException, ErrorBehavior } from 'src/socket/custom.exception';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { MapService } from '../map/map.service';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from '../standardResponse/standardResponse';
import { ExpeditionStatusEnum } from '../components/expedition/expedition.enum';

@Injectable()
export class FullSyncAction {
    private readonly logger: Logger = new Logger(FullSyncAction.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly mapService: MapService,
    ) {}

    async handle(client: Socket, sendShowMap = true): Promise<void> {
        const expedition = await this.expeditionService.findOneTimeDesc({
            userAddress: client.request.headers.useraddress
        });

        if (!expedition)
            throw new CustomException(
                `Expedition not found by client id ${client.id}. Another connection may have been initialized invalidating the current id.`,
                ErrorBehavior.ReturnToMainMenu,
            );

        const {
            map,
            playerState,
            mapSeedId,
            userAddress,
            id: expeditionId,
        } = expedition || {};

        this.logger.log(`Sent message ExpeditionMap to client ${client.id}`);

        if (sendShowMap) {
            client.emit(
                'ExpeditionMap',
                StandardResponse.respond({
                    message_type: SWARMessageType.MapUpdate,
                    seed: mapSeedId,
                    action: SWARAction.ShowMap,
                    data: this.mapService.makeClientSafe(map),
                }),
            );
        }

        this.logger.log(`Sent message PlayerState to client ${client.id}`);

        client.emit(
            'PlayerState',
            StandardResponse.respond({
                message_type: SWARMessageType.PlayerStateUpdate,
                action: SWARAction.UpdatePlayerState,
                data: {
                    expeditionId: expeditionId,
                    expeditionCreatedAt: expedition.createdAt,
                    playerState: {
                        id: playerState.userAddress,
                        userAddress,
                        playerName: playerState.playerName,
                        characterClass: playerState.characterClass,
                        hpMax: playerState.hpMax,
                        hpCurrent: playerState.hpCurrent,
                        gold: playerState.gold,
                        cards: playerState.cards,
                        potions: playerState.potions,
                        trinkets: playerState.trinkets,
                    },
                },
            }),
        );
    }
}
