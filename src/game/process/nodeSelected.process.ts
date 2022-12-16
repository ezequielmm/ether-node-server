import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import {
    ExpeditionMapNodeStatusEnum,
    ExpeditionMapNodeTypeEnum,
} from '../components/expedition/expedition.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { GameContext } from '../components/interfaces';
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
import { InitEncounterProcess } from './initEncounter.process';
import { IExpeditionNode } from '../components/expedition/expedition.interface';

@Injectable()
export class NodeSelectedProcess {
    private readonly logger: Logger = new Logger(NodeSelectedProcess.name);
    private node: IExpeditionNode;
    private ctx: GameContext;

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly initCombatProcess: InitCombatProcess,
        private readonly initNodeProcess: InitNodeProcess,
        private readonly initMerchantProcess: InitMerchantProcess,
        private readonly initTreasureProcess: InitTreasureProcess,
        private readonly initEncounterProcess: InitEncounterProcess,
    ) { }

    async handle(ctx: GameContext, node_id: number): Promise<string> {
        this.ctx = ctx;
        this.node = await this.expeditionService.getExpeditionMapNode({
            clientId: ctx.client.id,
            nodeId: node_id,
        });

        switch (this.node.status) {
            case ExpeditionMapNodeStatusEnum.Available:
                return await this.nodeIsAvailable();
            case ExpeditionMapNodeStatusEnum.Active:
                return await this.nodeIsActive();
            default:
                this.logger.error('Selected node is not available');
                ctx.client.emit('ErrorMessage', {
                    message: `An Error has ocurred selecting the node`,
                });
                break;
        }
    }

    private async nodeIsAvailable(): Promise<string> {
        const map = await this.expeditionService.getExpeditionMap({
            clientId: this.ctx.client.id,
        });

        const expeditionMap = restoreMap(map);
        const selectedNode = expeditionMap.fullCurrentMap.get(this.node.id);
        selectedNode.select(expeditionMap);

        const { map: newMap, mapSeedId } =
            (await this.expeditionService.update(this.ctx.client.id, {
                map: expeditionMap.getMap,
            })) || {};

        switch (this.node.type) {
            case ExpeditionMapNodeTypeEnum.Portal:
                this.logger.debug(`Map extended for client ${this.ctx.client.id}`);

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
                    `Activated portal for client ${this.ctx.client.id}`,
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
                    `Sent message InitCombat to client ${this.ctx.client.id}`,
                );

                await this.initCombatProcess.process(this.ctx, this.node);

                return StandardResponse.respond({
                    message_type: SWARMessageType.MapUpdate,
                    seed: mapSeedId,
                    action: SWARAction.MapUpdate,
                    data: newMap,
                });
            case ExpeditionMapNodeTypeEnum.Camp:
            case ExpeditionMapNodeTypeEnum.CampHouse:
            case ExpeditionMapNodeTypeEnum.CampRegular:
                await this.initNodeProcess.process(this.ctx, this.node);

                return StandardResponse.respond({
                    message_type: SWARMessageType.CampUpdate,
                    action: SWARAction.BeginCamp,
                    data: null,
                });
            case ExpeditionMapNodeTypeEnum.Encounter:
                return await this.initEncounterProcess.process(
                    this.ctx,
                    this.node,
                );
            case ExpeditionMapNodeTypeEnum.Treasure:
                return await this.initTreasureProcess.process(
                    this.ctx,
                    this.node,
                );
            case ExpeditionMapNodeTypeEnum.Merchant:
                return this.initMerchantProcess.process(this.ctx, this.node);
        }
    }

    private async nodeIsActive(): Promise<string> {
        switch (this.node.type) {
            case ExpeditionMapNodeTypeEnum.Combat:
                this.logger.debug(
                    `Sent message InitCombat to client ${this.ctx.client.id}`,
                );

                await this.initCombatProcess.process(this.ctx, this.node);
                break;
            case ExpeditionMapNodeTypeEnum.Camp:
            case ExpeditionMapNodeTypeEnum.CampHouse:
            case ExpeditionMapNodeTypeEnum.CampRegular:
                await this.initNodeProcess.process(this.ctx, this.node);

                return StandardResponse.respond({
                    message_type: SWARMessageType.CampUpdate,
                    action: SWARAction.BeginCamp,
                    data: null,
                });
            case ExpeditionMapNodeTypeEnum.Encounter:
                await this.initNodeProcess.process(this.ctx, this.node);

                return StandardResponse.respond({
                    message_type: SWARMessageType.EncounterUpdate,
                    action: SWARAction.BeginEncounter,
                    data: null,
                });
            case ExpeditionMapNodeTypeEnum.Treasure:
                return await this.initTreasureProcess.process(
                    this.ctx,
                    this.node,
                );
            case ExpeditionMapNodeTypeEnum.Merchant:
                await this.initMerchantProcess.process(this.ctx, this.node);

                return StandardResponse.respond({
                    message_type: SWARMessageType.MerchantUpdate,
                    action: SWARAction.BeginMerchant,
                    data: null,
                });
        }
    }
}
