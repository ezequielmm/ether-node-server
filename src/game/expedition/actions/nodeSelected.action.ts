import { ExpeditionService } from '../expedition.service';
import { Socket } from 'socket.io';
import { ExpeditionStatusEnum } from '../enums';
import { Injectable } from '@nestjs/common';
import { restoreMap } from '../map/app';
import { GameManagerService } from 'src/game/gameManager/gameManager.service';
import { Activity } from 'src/game/elements/prototypes/activity';
import { CustomException, ErrorBehavior } from 'src/socket/custom.exception';
import { CurrentNodeGenerator } from './currentNode.generator';

@Injectable()
export class NodeSelectedAction {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly gameManagerService: GameManagerService,
        private readonly currentNodeGenerator: CurrentNodeGenerator,
    ) {}

    async handle(client: Socket, node_id: number): Promise<string> {
        const action = await this.gameManagerService.startAction(
            client.id,
            'nodeSelected',
        );

        const node = await this.expeditionService.getExpeditionMapNode(
            client.id,
            node_id,
        );

        if (node.isAvailable) {
            const map = await this.expeditionService.getExpeditionMap(
                client.id,
            );

            const expeditionMap = restoreMap(map);
            const selectedNode = expeditionMap.fullCurrentMap.get(node_id);
            selectedNode.select(expeditionMap);

            await this.expeditionService.update(
                {
                    status: ExpeditionStatusEnum.InProgress,
                    client_id: client.id,
                },
                { map: expeditionMap.getMap },
            );

            const currentNode =
                await this.currentNodeGenerator.getCurrentNodeData(
                    node,
                    client.id,
                );

            const { current_node } = await this.expeditionService.update(
                {
                    client_id: client.id,
                    status: ExpeditionStatusEnum.InProgress,
                },
                {
                    current_node: currentNode,
                },
            );

            await action.log(
                new Activity('current_node', node_id, 'node-selected', {}, [
                    {
                        mod: 'set',
                        key: 'current_node',
                        val: current_node,
                        val_type: 'node',
                    },
                ]),
            );

            const updateMapAction = await this.gameManagerService.startAction(
                client.id,
                'map-updated',
            );
            await updateMapAction.log(
                new Activity('map', undefined, 'map-updated', {}, [
                    {
                        mod: 'set',
                        key: 'map',
                        val: expeditionMap.getMap,
                        val_type: 'map',
                    },
                ]),
            );
            client.emit(
                'ExpeditionMap',
                JSON.stringify(await updateMapAction.end()),
            );

            if (node.type === ExpeditionMapNodeTypeEnum.Portal) {
                const extendMapAction =
                    await this.gameManagerService.startAction(
                        client.id,
                        'map-extended',
                    );
                await extendMapAction.log(
                    new Activity('map', undefined, 'map-extended', {}, [
                        {
                            mod: 'set',
                            key: 'map',
                            val: expeditionMap.getMap,
                            val_type: 'map',
                        },
                    ]),
                );
                client.emit(
                    'ExpeditionMap',
                    JSON.stringify(await extendMapAction.end()),
                );
            }

            const response = await action.end();

            return JSON.stringify(response);
        } else {
            throw new CustomException(
                'Selected node is not available',
                ErrorBehavior.None,
            );
        }
    }
}
