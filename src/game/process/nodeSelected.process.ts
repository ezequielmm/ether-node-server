import { Injectable, Logger } from '@nestjs/common';
import { NodeStatus } from '../components/expedition/node-status';
import { NodeType } from '../components/expedition/node-type';
import { GameContext } from '../components/interfaces';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { InitCombatProcess } from './initCombat.process';
import { InitMerchantProcess } from './initMerchant.process';

import { Node } from '../components/expedition/node';
import { MapService } from '../map/map.service';
import { InitEncounterProcess } from './initEncounter.process';
import { InitNodeProcess } from './initNode.process';
import { InitTreasureProcess } from './initTreasure.process';

@Injectable()
export class NodeSelectedProcess {
    private readonly logger: Logger = new Logger(NodeSelectedProcess.name);

    constructor(
        private readonly initCombatProcess: InitCombatProcess,
        private readonly initNodeProcess: InitNodeProcess,
        private readonly initMerchantProcess: InitMerchantProcess,
        private readonly initTreasureProcess: InitTreasureProcess,
        private readonly initEncounterProcess: InitEncounterProcess,
        private readonly mapService: MapService,
    ) {}

    async handle(ctx: GameContext, node_id: number): Promise<string> {
        const node = this.mapService.findNodeById(ctx, node_id);

        if (!this.mapService.nodeIsSelectable(ctx, node.id)) {
            this.logger.error('Selected node is not available');
            ctx.client.emit('ErrorMessage', {
                message: `An Error has ocurred selecting the node`,
            });
        }

        switch (node.status) {
            case NodeStatus.Available:
                return await this.nodeIsAvailable(ctx, node);
            case NodeStatus.Active:
                return await this.nodeIsActive(ctx, node);
        }
    }

    private async nodeIsAvailable(
        ctx: GameContext,
        node: Node,
    ): Promise<string> {
        const { mapSeedId, map } = ctx.expedition;

        this.mapService.selectNode(ctx, node.id);
        await ctx.expedition.save();

        switch (node.type) {
            case NodeType.Portal:
                this.logger.debug(`Map extended for client ${ctx.client.id}`);

                return StandardResponse.respond({
                    message_type: SWARMessageType.MapUpdate,
                    seed: mapSeedId,
                    action: SWARAction.ExtendMap,
                    data: map,
                });
            case NodeType.RoyalHouse:
            case NodeType.RoyalHouseA:
            case NodeType.RoyalHouseB:
            case NodeType.RoyalHouseC:
            case NodeType.RoyalHouseD:
                this.logger.debug(
                    `Activated portal for client ${ctx.client.id}`,
                );

                return StandardResponse.respond({
                    message_type: SWARMessageType.MapUpdate,
                    seed: mapSeedId,
                    action: SWARAction.ActivatePortal,
                    data: map,
                });
            case NodeType.Combat:
            case NodeType.CombatBoss:
            case NodeType.CombatElite:
            case NodeType.CombatStandard:
                this.logger.debug(
                    `Sent message InitCombat to client ${ctx.client.id}`,
                );

                await this.initCombatProcess.process(ctx, node, false);

                return StandardResponse.respond({
                    message_type: SWARMessageType.MapUpdate,
                    seed: mapSeedId,
                    action: SWARAction.MapUpdate,
                    data: map,
                });
            case NodeType.Camp:
            case NodeType.CampHouse:
            case NodeType.CampRegular:
                this.logger.debug(`Started Camp for client ${ctx.client.id}`);

                await this.initNodeProcess.process(ctx, node);

                return StandardResponse.respond({
                    message_type: SWARMessageType.CampUpdate,
                    action: SWARAction.BeginCamp,
                    data: null,
                });
            case NodeType.Encounter:
                this.logger.debug(
                    `Started Encounter for client ${ctx.client.id}`,
                );

                return await this.initEncounterProcess.process(ctx, node);
            case NodeType.Treasure:
                this.logger.debug(
                    `Started Treasure for client ${ctx.client.id}`,
                );

                return await this.initTreasureProcess.process(ctx, node, false);
            case NodeType.Merchant:
                this.logger.debug(
                    `Started Merchant for client ${ctx.client.id}`,
                );

                return await this.initMerchantProcess.process(ctx, node);
        }
    }

    private async nodeIsActive(ctx: GameContext, node: Node): Promise<string> {
        switch (node.type) {
            case NodeType.Combat:
            case NodeType.Combat:
            case NodeType.CombatBoss:
            case NodeType.CombatElite:
            case NodeType.CombatStandard:
                this.logger.debug(
                    `Sent message InitCombat to client ${ctx.client.id}`,
                );

                await this.initCombatProcess.process(ctx, node, true);
                break;
            case NodeType.Camp:
            case NodeType.CampHouse:
            case NodeType.CampRegular:
                await this.initNodeProcess.process(ctx, node);

                return StandardResponse.respond({
                    message_type: SWARMessageType.CampUpdate,
                    action: SWARAction.BeginCamp,
                    data: null,
                });
            case NodeType.Encounter:
                await this.initNodeProcess.process(ctx, node);

                return StandardResponse.respond({
                    message_type: SWARMessageType.EncounterUpdate,
                    action: SWARAction.BeginEncounter,
                    data: null,
                });
            case NodeType.Treasure:
                return await this.initTreasureProcess.process(ctx, node, true);
            case NodeType.Merchant:
                await this.initMerchantProcess.process(ctx, node);

                return StandardResponse.respond({
                    message_type: SWARMessageType.MerchantUpdate,
                    action: SWARAction.BeginMerchant,
                    data: null,
                });
        }
    }
}
