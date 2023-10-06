import { Injectable } from '@nestjs/common';
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
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ReturnModelType } from '@typegoose/typegoose';
import { MapType } from '../components/expedition/expedition.schema';
import { InjectModel } from 'kindagoose';
import { ExpeditionService } from '../components/expedition/expedition.service';

@Injectable()
export class NodeSelectedProcess {
    constructor(
        @InjectPinoLogger()
        private readonly logger: PinoLogger,
        private readonly initCombatProcess: InitCombatProcess,
        private readonly initNodeProcess: InitNodeProcess,
        private readonly initMerchantProcess: InitMerchantProcess,
        private readonly initTreasureProcess: InitTreasureProcess,
        private readonly initEncounterProcess: InitEncounterProcess,
        private readonly mapService: MapService,

        @InjectModel(MapType)
        private readonly mapModel: ReturnModelType<typeof MapType>,

        private readonly expeditionService: ExpeditionService,

    ) {}



    async handle(ctx: GameContext, node_id: number): Promise<string> {
        const logger = this.logger.logger.child(ctx.info);

        const node = await this.mapService.findNodeById(ctx, node_id);

        if (!node) {
            logger.error('Selected node is not available');
            ctx.client.emit('ErrorMessage', {
                message: `An Error has ocurred selecting the node`,
            });
            return;
        }

        if (!this.mapService.nodeIsSelectable(ctx, node.id)) {
            logger.error('Selected node is not available');
            ctx.client.emit('ErrorMessage', {
                message: `An Error has ocurred selecting the node`,
            });
            return;
        }

        console.warn("Node is selectable: " + node.id + " con status: " + node.status);

        switch (node.status) {
            case NodeStatus.Available:
                return await this.nodeIsAvailable(ctx, node);
            case NodeStatus.Active:
                return await this.nodeIsActive(ctx, node);
            case NodeStatus.Disabled:
                return await this.nodeIsAvailable(ctx, node);
        }
    }

    private async nodeIsAvailable(
        ctx: GameContext,
        node: Node,
    ): Promise<string> {
        const logger = this.logger.logger.child(ctx.info);

        this.mapService.selectNode(ctx, node.id);
        await ctx.expedition.save();

        // moved to after selecting node, so that it would be active on return to client.
        // TODO: test if this breaks things.
        const { mapSeedId } = ctx.expedition;



        const mapsArray = await this.getMapByExpedition(ctx.expedition.id);

        const safeMap = this.mapService.makeClientSafe(mapsArray);

        switch (node.type) {
            case NodeType.Portal:
                logger.info(`Map extended for client ${ctx.client.id}`);

                return StandardResponse.respond({
                    message_type: SWARMessageType.MapUpdate,
                    seed: mapSeedId,
                    action: SWARAction.ExtendMap,
                    data: safeMap,
                });
            case NodeType.RoyalHouse:
            case NodeType.RoyalHouseA:
            case NodeType.RoyalHouseB:
            case NodeType.RoyalHouseC:
            case NodeType.RoyalHouseD:
                logger.info(`Activated portal for client ${ctx.client.id}`);

                return StandardResponse.respond({
                    message_type: SWARMessageType.MapUpdate,
                    seed: mapSeedId,
                    action: SWARAction.ActivatePortal,
                    data: safeMap,
                });
            case NodeType.Combat:
            case NodeType.CombatBoss:
            case NodeType.CombatElite:
            case NodeType.CombatStandard:
                logger.info(
                    `Sent message InitCombat to client ${ctx.client.id}`,
                );

                await this.initCombatProcess.process(ctx, node, false);

                return StandardResponse.respond({
                    message_type: SWARMessageType.MapUpdate,
                    seed: mapSeedId,
                    action: SWARAction.MapUpdate,
                    data: safeMap,
                });
            case NodeType.Camp:
            case NodeType.CampHouse:
            case NodeType.CampRegular:
                logger.info(`Started Camp for client ${ctx.client.id}`);

                await this.initNodeProcess.process(ctx, node);

                return StandardResponse.respond({
                    message_type: SWARMessageType.CampUpdate,
                    action: SWARAction.BeginCamp,
                    data: null,
                });
            case NodeType.Encounter:
                logger.info(`Started Encounter for client ${ctx.client.id}`);

                return await this.initEncounterProcess.process(ctx, node);
            case NodeType.Treasure:
                logger.info(`Started Treasure for client ${ctx.client.id}`);

                return await this.initTreasureProcess.process(ctx, node, false);
            case NodeType.Merchant:
                logger.info(`Started Merchant for client ${ctx.client.id}`);

                return await this.initMerchantProcess.process(ctx, node);
        }
    }

    public async getMapByExpedition(expeditionId: string): Promise<Node[]> {
        try {
            // Utiliza `findOne` para encontrar la expedición por su _id
            const expedition = await this.expeditionService.findOne({
                _id: expeditionId,
            });
    
            // Si no se encuentra la expedición, retorna un array vacío
            if (!expedition) {
                return [];
            }
    
            // Obtiene el ObjectID del campo map en la expedición
            const mapId = expedition.map;
    
            // Utiliza el ObjectID para buscar el documento en la colección "maps" que coincide con el valor del campo map en la expedición
            const map = await this.mapModel.findById(mapId);
    
            // Si no se encuentra el mapa, retorna un array vacío
            if (!map) {
                return [];
            }
    
            // Retorna el array de nodos almacenados en el campo map del mapa encontrado
            return map.map;
        } catch (error) {
            // Manejar errores de consulta aquí
            throw new Error('Error retrieving maps: ' + error.message);
        }
    }
    

    private async nodeIsActive(ctx: GameContext, node: Node): Promise<string> {
        const logger = this.logger.logger.child(ctx.info);

        node.timesSelected = node.timesSelected ? node.timesSelected + 1 : 1;

        switch (node.type) {
            case NodeType.Combat:
            case NodeType.Combat:
            case NodeType.CombatBoss:
            case NodeType.CombatElite:
            case NodeType.CombatStandard:
                logger.info(
                    `Sent message InitCombat to client ${ctx.client.id}`,
                );

                await this.initCombatProcess.process(ctx, node, true);
                break;
            case NodeType.Camp:
            case NodeType.CampHouse:
            case NodeType.CampRegular:
                logger.info(
                    `Sent message BeginCamp to client ${ctx.client.id}`,
                );

                await this.initNodeProcess.process(ctx, node);

                return StandardResponse.respond({
                    message_type: SWARMessageType.CampUpdate,
                    action: SWARAction.BeginCamp,
                    data: null,
                });
            case NodeType.Encounter:
                logger.info(
                    `Sent message BeginEncounter to client ${ctx.client.id}`,
                );

                await this.initNodeProcess.process(ctx, node);

                return StandardResponse.respond({
                    message_type: SWARMessageType.EncounterUpdate,
                    action: SWARAction.BeginEncounter,
                    data: null,
                });
            case NodeType.Treasure:
                logger.info(
                    `Sent message BeginEncounter to client ${ctx.client.id}`,
                );

                return await this.initTreasureProcess.process(ctx, node, true);
            case NodeType.Merchant:
                logger.info(
                    `Sent message BeginMerchant to client ${ctx.client.id}`,
                );

                await this.initMerchantProcess.process(ctx, node);

                return StandardResponse.respond({
                    message_type: SWARMessageType.MerchantUpdate,
                    action: SWARAction.BeginMerchant,
                    data: null,
                });
        }
    }
}
