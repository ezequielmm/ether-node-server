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
import { InitMerchantProcess } from './initMerchant.process';

import { InitNodeProcess } from './initNode.process';
import { InitTreasureProcess } from './initTreasure.process';

@Injectable()
export class NodeSelectedProcess {
    private readonly logger: Logger = new Logger(NodeSelectedProcess.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly initCombatProcess: InitCombatProcess,
        private readonly initNodeProcess: InitNodeProcess,
        private readonly initMerchantProcess: InitMerchantProcess,
        private readonly initTreasureProcess: InitTreasureProcess,
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

            const { map: newMap, mapSeedId } =
                (await this.expeditionService.update(client.id, {
                    map: expeditionMap.getMap,
                })) || {};

            switch (node.type) {
                case ExpeditionMapNodeTypeEnum.Portal:
                    this.logger.debug(`Map extended for client ${client.id}`);

                    return StandardResponse.respond({
                        message_type: SWARMessageType.MapUpdate,
                        seed: mapSeedId,
                        action: SWARAction.ExtendMap,
                        data: newMap,
                    });
                case ExpeditionMapNodeTypeEnum.RoyalHouse:
                case ExpeditionMapNodeTypeEnum.RoyalHouseA:
                case ExpeditionMapNodeTypeEnum.RoyalHouseB:
                case ExpeditionMapNodeTypeEnum.RoyalHouseC:
                case ExpeditionMapNodeTypeEnum.RoyalHouseD:
                    this.logger.debug(
                        `Activated portal for client ${client.id}`,
                    );

                    return StandardResponse.respond({
                        message_type: SWARMessageType.MapUpdate,
                        seed: mapSeedId,
                        action: SWARAction.ActivatePortal,
                        data: newMap,
                    });
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
                        StandardResponse.respond({
                            message_type: SWARMessageType.CombatUpdate,
                            action: SWARAction.BeginCombat,
                            data: null,
                        }),
                    );

                    return StandardResponse.respond({
                        message_type: SWARMessageType.MapUpdate,
                        seed: mapSeedId,
                        action: SWARAction.MapUpdate,
                        data: newMap,
                    });
                case ExpeditionMapNodeTypeEnum.Camp:
                case ExpeditionMapNodeTypeEnum.CampHouse:
                case ExpeditionMapNodeTypeEnum.CampRegular:
                    await this.initNodeProcess.process(client, node);

                    return StandardResponse.respond({
                        message_type: SWARMessageType.CampUpdate,
                        action: SWARAction.BeginCamp,
                        data: null,
                    });
                case ExpeditionMapNodeTypeEnum.Encounter:
                    await this.initNodeProcess.process(client, node);

                    return StandardResponse.respond({
                        message_type: SWARMessageType.EncounterUpdate,
                        action: SWARAction.BeginEncounter,
                        data: null,
                    });
                case ExpeditionMapNodeTypeEnum.Treasure:
                    return await this.initTreasureProcess.process(client, node);
                case ExpeditionMapNodeTypeEnum.Merchant:
                    await this.initMerchantProcess.process(client, node);

                    return StandardResponse.respond({
                        message_type: SWARMessageType.MerchantUpdate,
                        action: SWARAction.BeginMerchant,
                        data: null,
                    });
            }
        } else if (node.isActive) {
            if (node.type === ExpeditionMapNodeTypeEnum.Combat) {
                this.logger.debug(
                    `Sent message InitCombat to client ${client.id}`,
                );

                await this.initCombatProcess.process(client, node);

                client.emit(
                    'InitCombat',
                    StandardResponse.respond({
                        message_type: SWARMessageType.CombatUpdate,
                        action: SWARAction.BeginCombat,
                        data: null,
                    }),
                );
            } else {
                switch (node.type) {
                    case ExpeditionMapNodeTypeEnum.Camp:
                    case ExpeditionMapNodeTypeEnum.CampHouse:
                    case ExpeditionMapNodeTypeEnum.CampRegular:
                        await this.initNodeProcess.process(client, node);

                        return StandardResponse.respond({
                            message_type: SWARMessageType.CampUpdate,
                            action: SWARAction.BeginCamp,
                            data: null,
                        });
                    case ExpeditionMapNodeTypeEnum.Encounter:
                        await this.initNodeProcess.process(client, node);

                        return StandardResponse.respond({
                            message_type: SWARMessageType.EncounterUpdate,
                            action: SWARAction.BeginEncounter,
                            data: null,
                        });
                    case ExpeditionMapNodeTypeEnum.Treasure:
                        return await this.initTreasureProcess.process(
                            client,
                            node,
                        );
                    case ExpeditionMapNodeTypeEnum.Merchant:
                        await this.initMerchantProcess.process(client, node);

                        return StandardResponse.respond({
                            message_type: SWARMessageType.MerchantUpdate,
                            action: SWARAction.BeginMerchant,
                            data: null,
                        });
                }
            }
        } else {
            this.logger.error('Selected node is not available');
            client.emit('ErrorMessage', {
                message: `An Error has ocurred selecting the node`,
            });
        }
    }
}
