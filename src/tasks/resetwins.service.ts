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
import { PlayerWin } from 'src/playerWin/playerWin.schema';


@Injectable()
export class ResetWinsService {
    private readonly logger: Logger = new Logger(ResetWinsService.name);

    constructor(
        @InjectModel(PlayerWin)
        private readonly playerWinModel: ReturnModelType<typeof PlayerWin>,

    ) { }

    @Cron(CronExpression.EVERY_DAY_AT_4PM, {
        name: 'Reset Knights',
        timeZone: 'UTC',
    })
    public async deleteAllPlayerWins(): Promise<void> {
        try {
            await this.playerWinModel.deleteMany({});
            console.log('Todos los registros de playerWins han sido eliminados.');
        } catch (error) {
            console.error('Error al eliminar los registros de playerWins:', error);
            throw error;
        }
    }

}
