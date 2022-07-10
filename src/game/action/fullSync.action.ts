import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CustomException, ErrorBehavior } from 'src/socket/custom.exception';
import { isEven } from 'src/utils';
import { ExpeditionMapNodeTypeEnum } from '../components/expedition/expedition.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { SendEnemyIntentProcess } from '../process/sendEnemyIntents.process';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from '../standardResponse/standardResponse';

@Injectable()
export class FullSyncAction {
    private readonly logger: Logger = new Logger(FullSyncAction.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly sendEnemyIntentProcess: SendEnemyIntentProcess,
    ) {}

    async handle(client: Socket): Promise<void> {
        const expedition = await this.expeditionService.findOne({
            clientId: client.id,
        });

        if (!expedition)
            throw new CustomException(
                `Expedition not found by client id ${client.id}. Another connection may have been initialized invalidating the current id.`,
                ErrorBehavior.ReturnToMainMenu,
            );

        const { map, playerState, currentNode } = expedition;

        this.logger.log(`Sent message ExpeditionMap to client ${client.id}`);

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

        this.logger.log(`Sent message PlayerState to client ${client.id}`);

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

        if (currentNode !== undefined) {
            const { nodeType, data } = currentNode;

            if (data !== undefined) {
                const { round } = data;
                const nodeTypes = Object.values(ExpeditionMapNodeTypeEnum);
                const combatNodes = nodeTypes.filter(
                    (node) => node.search('combat') !== -1,
                );

                if (combatNodes.includes(nodeType) && !isEven(round))
                    await this.sendEnemyIntentProcess.process(client);
            }
        }
    }
}
