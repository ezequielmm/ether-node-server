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
export class CleanService {
    private readonly logger: Logger = new Logger(CleanService.name);

    constructor(

        @InjectModel(Expedition)
        private readonly expedition: ReturnModelType<typeof Expedition>,  
        @InjectModel(OldExpedition)
        private readonly oldexpedition: ReturnModelType<typeof OldExpedition>,    
        ) { }

    @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT, {
        name: 'Clean expeditions',
        timeZone: 'UTC',
    })
    async handleMapReset(): Promise<void> {
        await this.moveExpeditions();
    }

    // Función para mover expediciones en progreso a oldexpeditions
    public async moveExpeditions() {
        try {
            // Encuentra todas las expediciones con estados de victoria, derrota o canceladas
            const expeditionsToMove = await this.expedition.find({ status: { $in: ['victory', 'defeated', 'canceled'] } });
    
            // Mueve los registros a la colección de expediciones antiguas
            await this.oldexpedition.create(expeditionsToMove);
    
            // Elimina los registros de la colección de expediciones con estados de victoria, derrota o canceladas
            await this.expedition.deleteMany({ status: { $in: ['victory', 'defeated', 'canceled'] } });
    
            console.log('Registros de expediciones de victoria, derrota o canceladas movidos a oldexpeditions.');
        } catch (error) {
            console.error('Error al mover expediciones:', error);
        }
    }
}
