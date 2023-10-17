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


@Injectable()
export class ResetService {
    private readonly logger: Logger = new Logger(ResetService.name);

    constructor(

        @InjectModel(Expedition)
        private readonly expedition: ReturnModelType<typeof Expedition>,  
        @InjectModel(OldExpedition)
        private readonly oldexpedition: ReturnModelType<typeof OldExpedition>,    
        ) { }

    @Cron(CronExpression.EVERY_DAY_AT_11PM, {
        name: 'Reset in progress expeditions',
        timeZone: 'UTC',
    })
    async handleMapReset(): Promise<void> {
        await this.moveExpeditions();
    }

    // Función para mover expediciones en progreso a oldexpeditions
    public async moveExpeditions() {
        try {
            // Encuentra todas las expediciones en progreso
            const expeditionsInProgress = await this.expedition.find({ status: 'in_progress' });

            // Mueve los registros a la colección de expediciones antiguas
            await this.oldexpedition.create(expeditionsInProgress);

            // Elimina los registros de la colección de expediciones
            await this.expedition.deleteMany({ status: 'in_progress' });

            console.log('Registros de expediciones en progreso movidos a oldexpeditions.');
        } catch (error) {
            console.error('Error al mover expediciones:', error);
        }
    }
}
