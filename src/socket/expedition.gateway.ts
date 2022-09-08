import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { NodeSelectedProcess } from 'src/game/process/nodeSelected.process';
import { FullSyncAction } from 'src/game/action/fullSync.action';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { ExpeditionMapNodeTypeEnum } from 'src/game/components/expedition/expedition.enum';
import { restoreMap } from 'src/game/map/app';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from 'src/game/standardResponse/standardResponse';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ExpeditionGateway {
    private readonly logger: Logger = new Logger(ExpeditionGateway.name);

    constructor(
        private readonly nodeSelectedProcess: NodeSelectedProcess,
        private readonly fullSyncAction: FullSyncAction,
        private readonly expeditionService: ExpeditionService,
    ) {}

    @SubscribeMessage('SyncExpedition')
    async handleSyncExpedition(client: Socket): Promise<void> {
        this.logger.debug(
            `Client ${client.id} trigger message "SyncExpedition"`,
        );

        await this.fullSyncAction.handle(client);
    }

    @SubscribeMessage('NodeSelected')
    async handleNodeSelected(client: Socket, node_id: number): Promise<string> {
        this.logger.debug(
            `Client ${client.id} trigger message "NodeSelected": ${node_id}`,
        );

        try {
            return await this.nodeSelectedProcess.handle(client, node_id);
        } catch (e) {
            this.logger.error(e.message);
            client.emit('ErrorMessage', {
                message: `An Error has ocurred selecting the node`,
            });
        }
    }

    @SubscribeMessage('ContinueExpedition')
    async handleContinueExpedition(client: Socket): Promise<string> {
        this.logger.debug(`Client ${client.id} will advance to the next node`);

        // Here we get the updated expedition
        const expedition = await this.expeditionService.findOne({
            clientId: client.id,
        });

        const node = expedition.map.find((node) => {
            return node.id === expedition.currentNode.nodeId;
        });

        // If the node is combat we process to move on without the rewards
        const nodeTypes = Object.values(ExpeditionMapNodeTypeEnum);
        const combatNodes = nodeTypes.filter(
            (node) => node.search('combat') !== -1,
        );

        if (combatNodes.includes(node.type)) {
            const {
                map: oldMap,
                currentNode: {
                    nodeId,
                    data: {
                        player: { hpCurrent, hpMax },
                    },
                },
            } = expedition;

            const newMap = restoreMap(oldMap, client.id);

            newMap.activeNode = newMap.fullCurrentMap.get(nodeId);
            newMap.activeNode.complete(newMap);

            const mapToSave = newMap.getMap;

            this.logger.debug(
                `Player ${client.id} completed the node ${nodeId}`,
            );

            await this.expeditionService.updateById(expedition._id, {
                $set: {
                    map: mapToSave,
                    'currentNode.completed': true,
                    'currentNode.showRewards': false,
                    'playerState.hpCurrent': hpCurrent,
                    'playerState.hpMax': hpMax,
                },
            });

            return JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.EndCombat,
                    action: SWARAction.ShowMap,
                    data: mapToSave,
                }),
            );
        } else {
            // This will be for now combat nodes (merchant, camp, etc)
            const { map: oldMap } = expedition;

            const newMap = restoreMap(oldMap);
            newMap.activeNode = newMap.fullCurrentMap.get(node.id);
            newMap.activeNode.complete(newMap);

            const mapToSave = newMap.getMap;

            await this.expeditionService.updateById(expedition._id, {
                $set: {
                    map: mapToSave,
                    'currentNode.completed': true,
                },
            });

            return JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.EndNode,
                    action: SWARAction.ShowMap,
                    data: mapToSave,
                }),
            );
        }
    }
}
