import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ExpeditionMapNodeTypeEnum } from '../components/expedition/expedition.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { restoreMap } from '../map/app';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from '../standardResponse/standardResponse';
import { CurrentNodeGeneratorProcess } from './currentNodeGenerator.process';

@Injectable()
export class NodeSelectedProcess {
    private readonly logger: Logger = new Logger(NodeSelectedProcess.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly currentNodeGeneratorProcess: CurrentNodeGeneratorProcess,
    ) {}

    async handle(client: Socket, node_id: number): Promise<string> {
        const node = await this.expeditionService.getExpeditionMapNode({
            clientId: client.id,
            nodeId: node_id,
        });

        if (node.isAvailable) {
            const map = await this.expeditionService.getExpeditionMap({
                clientId: client.id,
            });

            const expeditionMap = restoreMap(map);
            const selectedNode = expeditionMap.fullCurrentMap.get(node_id);
            selectedNode.select(expeditionMap);

            const currentNode =
                await this.currentNodeGeneratorProcess.getCurrentNodeData(
                    node,
                    client.id,
                );

            const { map: newMap } = await this.expeditionService.update({
                map: expeditionMap.getMap,
                clientId: client.id,
                currentNode,
            });

            let response = {};

            switch (node.type) {
                case ExpeditionMapNodeTypeEnum.Portal:
                    response = StandardResponse.respond({
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
                    response = StandardResponse.respond({
                        message_type: SWARMessageType.MapUpdate,
                        action: SWARAction.ActivatePortal,
                        data: newMap,
                    });
                    break;
                case ExpeditionMapNodeTypeEnum.Combat:
                case ExpeditionMapNodeTypeEnum.CombatBoss:
                case ExpeditionMapNodeTypeEnum.CombatElite:
                case ExpeditionMapNodeTypeEnum.CombatStandard:
                    response = StandardResponse.respond({
                        message_type: SWARMessageType.MapUpdate,
                        action: SWARAction.MapUpdate,
                        data: newMap,
                    });

                    this.logger.log(
                        `Sent message InitCombat to client ${client.id}`,
                    );

                    //await this.initCombatProcess.process(client);

                    break;
                default:
                    response = StandardResponse.respond({
                        message_type: SWARMessageType.MapUpdate,
                        action: SWARAction.ShowMap,
                        data: newMap,
                    });
                    break;
            }

            return JSON.stringify(response);
        }
    }
}
