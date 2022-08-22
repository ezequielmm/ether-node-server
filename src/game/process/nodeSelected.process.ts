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
import { InitCombatProcess } from './initCombat.process';

@Injectable()
export class NodeSelectedProcess {
    private readonly logger: Logger = new Logger(NodeSelectedProcess.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly initCombatProcess: InitCombatProcess,
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

            const { map: newMap } = await this.expeditionService.update(
                client.id,
                {
                    map: expeditionMap.getMap,
                },
            );

            switch (node.type) {
                case ExpeditionMapNodeTypeEnum.Portal:
                    this.logger.debug(`Map extended for client ${client.id}`);

                    return JSON.stringify(
                        StandardResponse.respond({
                            message_type: SWARMessageType.MapUpdate,
                            action: SWARAction.ExtendMap,
                            data: newMap,
                        }),
                    );
                case ExpeditionMapNodeTypeEnum.RoyalHouse:
                case ExpeditionMapNodeTypeEnum.RoyalHouseA:
                case ExpeditionMapNodeTypeEnum.RoyalHouseB:
                case ExpeditionMapNodeTypeEnum.RoyalHouseC:
                case ExpeditionMapNodeTypeEnum.RoyalHouseD:
                    this.logger.debug(`Map extended for client ${client.id}`);

                    return JSON.stringify(
                        StandardResponse.respond({
                            message_type: SWARMessageType.MapUpdate,
                            action: SWARAction.ActivatePortal,
                            data: newMap,
                        }),
                    );
                case ExpeditionMapNodeTypeEnum.Combat:
                case ExpeditionMapNodeTypeEnum.CombatBoss:
                case ExpeditionMapNodeTypeEnum.CombatElite:
                case ExpeditionMapNodeTypeEnum.CombatStandard:
                    this.logger.debug(
                        `Sent message InitCombat to client ${client.id}`,
                    );

                    await this.initCombatProcess.process(client, node);

                    client.emit(
                        'InitCombat',
                        JSON.stringify(
                            StandardResponse.respond({
                                message_type: SWARMessageType.CombatUpdate,
                                action: SWARAction.BeginCombat,
                                data: null,
                            }),
                        ),
                    );

                    return JSON.stringify(
                        StandardResponse.respond({
                            message_type: SWARMessageType.MapUpdate,
                            action: SWARAction.MapUpdate,
                            data: newMap,
                        }),
                    );
                default:
                    return JSON.stringify(
                        StandardResponse.respond({
                            message_type: SWARMessageType.MapUpdate,
                            action: SWARAction.MapUpdate,
                            data: newMap,
                        }),
                    );
            }
        } else {
            const nodeTypes = Object.values(ExpeditionMapNodeTypeEnum);
            const combatNodes = nodeTypes.filter(
                (node) => node.search('combat') !== -1,
            );

            if (combatNodes.includes(node.type)) {
                this.logger.debug(
                    `Sent message InitCombat to client ${client.id}`,
                );

                await this.initCombatProcess.process(client, node);

                client.emit(
                    'InitCombat',
                    JSON.stringify(
                        StandardResponse.respond({
                            message_type: SWARMessageType.CombatUpdate,
                            action: SWARAction.BeginCombat,
                            data: null,
                        }),
                    ),
                );
            } else {
                this.logger.error('Selected node is not available');
                client.emit('ErrorMessage', {
                    message: `An Error has ocurred selecting the node`,
                });
            }
        }
    }
}
