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
import { Types } from 'mongoose';


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

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
        name: 'Reset in progress expeditions',
        timeZone: 'UTC',
    })
    public async moveExpeditions() {
        try {
            // Encuentra todas las expediciones en progreso
            const expeditionsInProgress = await this.expedition.find({ status: 'in_progress' });

            // Obtiene la hora actual
            const currentTime = new Date();

            // Filtra las expediciones que han superado el límite de tiempo
            const expeditionsToMove = expeditionsInProgress.filter(expedition =>
                this.hasExceededTimeLimit(expedition, currentTime)
            );

            if (expeditionsToMove.length === 0) {
                return;
            }
            
            // Obtiene los IDs de los mapas asociados a las expediciones a mover
            const mapIdsToMove = expeditionsToMove.map(expedition => expedition.map);

            // Genera nuevos ObjectIDs para oldmaps
            const oldMapsObjectIDs = Array.from({ length: mapIdsToMove.length }, () => new Types.ObjectId());

            // Mueve los mapas asociados a las expediciones a la colección de mapas antiguos
            const mapsToMove = await this.mapModel.find({ _id: { $in: mapIdsToMove } });
            const mapsDataToMove = mapsToMove.map((map, index) => {
                const newMap = {
                    ...map.toObject(),
                    _id: oldMapsObjectIDs[index]
                };
                return newMap;
            });
            await this.oldMapModel.create(mapsDataToMove);

            // Mueve los registros de expediciones a la colección de expediciones antiguas
            const expeditionsDataToMove = expeditionsToMove.map((expedition, index) => {
                const newExpedition = {
                    ...expedition.toObject(),
                    _id: new Types.ObjectId(), // Genera un nuevo ObjectID para oldexpeditions
                    map: oldMapsObjectIDs[index] // Asigna el mismo ObjectID que en oldmaps
                };
                return newExpedition;
            });
            await this.oldExpedition.create(expeditionsDataToMove);

            // Elimina los registros de expediciones y mapas de la colección original
            await this.expedition.deleteMany({ status: 'in_progress' });
            await this.mapModel.deleteMany({ _id: { $in: mapIdsToMove } });

            console.log('Registros de expediciones en progreso y mapas asociados movidos a oldexpeditions y oldmaps.');
        } catch (error) {
            console.error('Error al mover expediciones y mapas:', error);
        }
    }

    // Función para verificar si ha pasado el tiempo límite desde la creación de la expedición
    private hasExceededTimeLimit(expedition, currentTime) {
        const timeLimitInMilliseconds = 168 * 60 * 60 * 1000; // 48 horas en milisegundos
        return currentTime - expedition.createdAt >= timeLimitInMilliseconds;
    }

}
