import { Socket } from 'socket.io';
import { ExpeditionService } from '../../components/expedition/expedition.service';
import { ExpeditionMapNodeTypeEnum, ExpeditionStatusEnum } from '../enums';
import { Injectable, Logger } from '@nestjs/common';
import { CustomException, ErrorBehavior } from 'src/socket/custom.exception';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { SendEnemyIntentProcess } from 'src/game/node_combat/process/sendEnemyIntent.process';
import { isEven } from 'src/utils';

@Injectable()
export class FullSyncAction {
    private readonly logger: Logger = new Logger(FullSyncAction.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly sendEnemyIntentProcess: SendEnemyIntentProcess,
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

        const { map, player_state, current_node } = expedition;

        this.logger.log(`Sent message ExpeditionMap to client ${client.id}`);

        client.emit(
            'ExpeditionMap',
            JSON.stringify(
                StandardResponse.createResponse({
                    message_type: SWARMessageType.MapUpdate,
                    action: SWARAction.ShowMap,
                    data: map,
                }),
            ),
        );

        this.logger.log(`Sent message PlayerState to client ${client.id}`);

        client.emit(
            'PlayerState',
            JSON.stringify(
                StandardResponse.createResponse({
                    message_type: SWARMessageType.PlayerStateUpdate,
                    action: SWARAction.UpdatePlayerState,
                    data: { player_state },
                }),
            ),
        );

        if (current_node !== undefined) {
            const { node_type, data } = current_node;

            if (data !== undefined) {
                const nodeTypes = Object.values(ExpeditionMapNodeTypeEnum);
                const combatNodes = nodeTypes.filter(
                    (node) => node.search('combat') !== -1,
                );

                if (combatNodes.includes(node_type) && !isEven(data.round))
                    this.sendEnemyIntentProcess.process(client);
            }
        }
    }
}
