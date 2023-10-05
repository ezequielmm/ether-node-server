import { Injectable } from '@nestjs/common';
import { NodeType } from '../components/expedition/node-type';
import { GameContext } from '../components/interfaces';
import { MapService } from '../map/map.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { ReturnModelType } from '@typegoose/typegoose';
import { MapType } from '../components/expedition/expedition.schema';
import { InjectModel } from 'kindagoose';
import { ExpeditionService } from '../components/expedition/expedition.service';

@Injectable()
export class ContinueExpeditionProcess {
    constructor(
        private readonly mapService: MapService,

        @InjectModel(MapType)
        private readonly mapModel: ReturnModelType<typeof MapType>,

        private readonly expeditionService: ExpeditionService
        ) {}



    async handle(ctx: GameContext): Promise<string> {
        const map = ctx.expedition.map;

        // Now we get the node information that is active at the moment
        const node = this.mapService.findNodeById(
            ctx,
            ctx.expedition.currentNode.nodeId,
        );

        // Here we complete the node and set the next as available
        // and return the new map
        this.mapService.completeNode(ctx, node.id);
        ctx.expedition.currentNode.completed = true;

        // Now we update the expedition based on the node type
        if (node.type === NodeType.Combat) this.setupDataFromCombat(ctx);

        await ctx.expedition.save();

        
        const mapsArray = await this.getMapByExpedition(ctx.expedition.id);

        console.warn("Este es el otro mapsArray en continue expedition: " + mapsArray);


        const safeMap = this.mapService.makeClientSafe(mapsArray);

        // Send the final message with the map updated
        return StandardResponse.respond({
            message_type:
                node.type === NodeType.Combat
                    ? SWARMessageType.EndCombat
                    : SWARMessageType.EndNode,
            seed: ctx.expedition.mapSeedId,
            action: SWARAction.ShowMap,
            data: safeMap,
        });
    }

    public async getMapByExpedition(expeditionId: string): Promise<any[] > {
        try {
            // Utiliza `findOne` para encontrar la expedición por su _id
            const expedition = await this.expeditionService.findOne({
                _id: expeditionId,
            });

            // Si no se encuentra la expedición, retorna null
            if (!expedition) {
                return null;
            }

            // Obtiene el ObjectID del campo map en la expedición
            const mapId = expedition.map;

            // Utiliza el ObjectID para buscar todos los documentos en la colección "maps" que coinciden con el valor del campo map en la expedición
            const maps = await this.mapModel.find({ _id: mapId });

            // Retorna el array de mapas encontrados o un array vacío si no se encuentran
            return maps;
        } catch (error) {
            // Manejar errores de consulta aquí
            throw new Error('Error retrieving maps: ' + error.message);
        }
    }

    private setupDataFromCombat(ctx: GameContext): void {
        const { hpCurrent, hpMax } = ctx.expedition.currentNode.data.player;

        ctx.expedition.currentNode.completed = true;
        ctx.expedition.currentNode.showRewards = false;
        ctx.expedition.playerState.hpCurrent = hpCurrent;
        ctx.expedition.playerState.hpMax = hpMax;
    }
}
