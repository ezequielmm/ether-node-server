import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { maxBy } from 'lodash';
import { GameContext } from 'src/game/components/interfaces';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { MapService } from '../map.service';
import { AutoCompleteNodeStrategy } from './auto-complete-node-strategy';
import { NodeStrategy } from './node-strategy';
import { ReturnModelType } from '@typegoose/typegoose';
import { MapType } from 'src/game/components/expedition/expedition.schema';
import { InjectModel } from 'kindagoose';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';

@Injectable()
export class PortalNodeStrategy
    extends AutoCompleteNodeStrategy
    implements NodeStrategy
{
    private readonly logger: Logger = new Logger(PortalNodeStrategy.name);

    @Inject(forwardRef(() => MapService))
    protected readonly mapService: MapService;

    @InjectModel(MapType)
    private readonly mapModel: ReturnModelType<typeof MapType>

    private readonly expeditionService: ExpeditionService

    async onCompleted(ctx: GameContext): Promise<void> {
        this.logger.log(ctx.info, `Map extended for client ${ctx.client.id}`);

        // // Get current act
        // const act = maxBy(ctx.expedition.map, 'act');

        // switch (act.act) {
        //     case 0:
        //         this.mapService.setupActOne(ctx);
        //         break;
        //     case 1:
        //         this.mapService.setupActTwo(ctx);
        //         break;
        // }



        const mapsArray = await this.getMapByExpedition(ctx.expedition.id);

        const safeMap = this.mapService.makeClientSafe(mapsArray);

        // TODO: This also appears to emit in the nodeSelected process. Is that a dupe, or is this?
        ctx.client.emit(
            StandardResponse.respond({
                message_type: SWARMessageType.MapUpdate,
                seed: ctx.expedition.mapSeedId,
                action: SWARAction.ExtendMap,
                data: safeMap,
            }),
        );
    }

    public async getMapByExpedition(expeditionId: string): Promise<any | null> {
        try {
            // Utiliza `findOne` para encontrar la expedición por su _id
            const expedition = await this.expeditionService.findOne({
                _id: expeditionId,
            });

            // Si no se encuentra la expedición, retorna null
            if (!expedition) {
                return null;
            }

            // Utiliza `populate()` para rellenar el campo `map` con el objeto correspondiente de la colección "maps"
            await expedition.populate('map');

            // El campo `map` ahora contendrá el objeto de la colección "maps"
            const map = expedition.map;

            // Retorna el objeto del mapa encontrado o `null` si no se encuentra
            return map;
        } catch (error) {
            // Manejar errores de consulta aquí
            throw new Error('Error retrieving map: ' + error.message);
        }
    }
}
