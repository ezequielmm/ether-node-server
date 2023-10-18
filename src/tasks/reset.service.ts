import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ContestService } from 'src/game/contest/contest.service';
import { ContestMapService } from 'src/game/contestMap/contestMap.service';
import {
    addDaysToDate,
    addHoursToDate,
    findStepWithMostNodes,
    setHoursMinutesSecondsToUTCDate,
} from 'src/utils';
import { MapBuilderService } from 'src/game/map/builder/mapBuilder.service';
import { createStage1NewMap } from 'src/game/map/builder/actOne.config';
import { SettingsService } from 'src/game/components/settings/settings.service';
import { IActConfiguration } from 'src/game/map/builder/mapBuilder.interface';
import { createStage2NewMap } from 'src/game/map/builder/actTwo.config';
import { Expedition } from 'src/game/components/expedition/expedition.schema';
import { InjectModel } from 'kindagoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { OldExpedition } from 'src/game/components/expedition/oldexpedition.schema';
import { MapType } from 'src/game/components/expedition/map.schema';
import { OldMapType } from 'src/game/components/expedition/oldmap.schema';


@Injectable()
export class ResetService {
    private readonly logger: Logger = new Logger(ResetService.name);

    constructor(
        @InjectModel(MapType)
        private readonly mapModel: ReturnModelType<typeof MapType>,  
        @InjectModel(OldMapType)
        private readonly oldMapModel: ReturnModelType<typeof OldMapType>,

        @InjectModel(Expedition)
        private readonly expedition: ReturnModelType<typeof Expedition>,  
        @InjectModel(OldExpedition)
        private readonly oldExpedition: ReturnModelType<typeof OldExpedition>,    
        ) { }

    @Cron(CronExpression.EVERY_WEEKEND, {
        name: 'Reset in progress expeditions',
        timeZone: 'UTC',
    })
    async handleMapReset(): Promise<void> {
        await this.moveExpeditions();
    }

    // Función para mover expediciones en progreso a oldexpeditions
    private async moveExpeditions() {
        try {
            // Encuentra todas las expediciones en progreso
            const expeditionsInProgress = await this.expedition.find({ status: 'in_progress' });
    
            // Obtiene los IDs de los mapas asociados a las expediciones a mover
            const mapIdsToMove = expeditionsInProgress.map(expedition => expedition.map);
    
            // Mueve los mapas asociados a las expediciones a la colección de mapas antiguos
            const mapsToMove = await this.mapModel.find({ _id: { $in: mapIdsToMove } });
            await this.oldMapModel.create(mapsToMove);
    
            // Mueve los registros de expediciones a la colección de expediciones antiguas
            await this.oldExpedition.create(expeditionsInProgress);
    
            // Elimina los registros de expediciones y mapas de la colección original
            await this.expedition.deleteMany({ status: 'in_progress' });
            await this.mapModel.deleteMany({ _id: { $in: mapIdsToMove } });
    
            console.log('Registros de expediciones en progreso y mapas asociados movidos a oldexpeditions y oldmaps.');
        } catch (error) {
            console.error('Error al mover expediciones y mapas:', error);
        }
    }
}
