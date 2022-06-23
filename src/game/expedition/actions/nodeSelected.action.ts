import { ExpeditionService } from '../../components/expedition/expedition.service';
import { Socket } from 'socket.io';
import { ExpeditionMapNodeTypeEnum, ExpeditionStatusEnum } from '../enums';
import { Injectable, Logger } from '@nestjs/common';
import { restoreMap } from '../map/app';
import { CurrentNodeGenerator } from './currentNode.generator';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';

@Injectable()
export class NodeSelectedAction {
    private readonly logger: Logger = new Logger(NodeSelectedAction.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly currentNodeGenerator: CurrentNodeGenerator,
    ) {}

    async handle(client: Socket, node_id: number): Promise<string> {
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

            const { map: newMap, current_node } =
                await this.expeditionService.update(
                    {
                        client_id: client.id,
                        status: ExpeditionStatusEnum.InProgress,
                    },
                    {
                        current_node: currentNode,
                    },
                );

            let response = {};

            switch (node.type) {
                case ExpeditionMapNodeTypeEnum.Portal:
                    response = StandardResponse.createResponse({
                        message_type: SWARMessageType.MapUpdate,
                        action: SWARAction.ExtendMap,
                        data: newMap,
                    });
                    break;
                case ExpeditionMapNodeTypeEnum.RoyalHouse:
                case ExpeditionMapNodeTypeEnum.RoyalHouseA:
                case ExpeditionMapNodeTypeEnum.RoyalHouseB:
                case ExpeditionMapNodeTypeEnum.RoyalHouseC:
                case ExpeditionMapNodeTypeEnum.RoyalHouseD:
                    response = StandardResponse.createResponse({
                        message_type: SWARMessageType.MapUpdate,
                        action: SWARAction.ActivatePortal,
                        data: newMap,
                    });
                    break;
                case ExpeditionMapNodeTypeEnum.Combat:
                case ExpeditionMapNodeTypeEnum.CombatBoss:
                case ExpeditionMapNodeTypeEnum.CombatElite:
                case ExpeditionMapNodeTypeEnum.CombatStandard:
                    response = StandardResponse.createResponse({
                        message_type: SWARMessageType.MapUpdate,
                        action: SWARAction.MapUpdate,
                        data: newMap,
                    });

                    this.logger.log(
                        `Sent message InitCombat to client ${client.id}`,
                    );

                    client.emit(
                        'InitCombat',
                        JSON.stringify(
                            StandardResponse.createResponse({
                                message_type: SWARMessageType.CombatUpdate,
                                action: SWARAction.BeginCombat,
                                data: current_node,
                            }),
                        ),
                    );
                    break;
                default:
                    response = StandardResponse.createResponse({
                        message_type: SWARMessageType.MapUpdate,
                        action: SWARAction.ShowMap,
                        data: newMap,
                    });
                    break;
            }

            return JSON.stringify(response);
        } else {
            const nodeTypes = Object.values(ExpeditionMapNodeTypeEnum);
            const combatNodes = nodeTypes.filter(
                (node) => node.search('combat') !== -1,
            );

            if (combatNodes.includes(node.type)) {
                const current_node =
                    await this.expeditionService.getCurrentNodeByClientId(
                        client.id,
                    );

                client.emit(
                    'InitCombat',
                    JSON.stringify(
                        StandardResponse.createResponse({
                            message_type: SWARMessageType.CombatUpdate,
                            action: SWARAction.BeginCombat,
                            data: current_node,
                        }),
                    ),
                );
            } else {
                this.logger.error('Selected node is not available');
            }
        }
    }
}
