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


    onCompleted(ctx: GameContext): void {
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

        const mapId = ctx.expedition.map._id; // Reemplaza esto con el ID del mapa que deseas obtener

        const mapDocument = this.mapModel.findById(mapId);

        if (!mapDocument) {
            throw new Error("Map not found");
        }

        const mapsArray = mapDocument.map;

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
}
