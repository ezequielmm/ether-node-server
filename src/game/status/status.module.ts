import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    Expedition,
    ExpeditionSchema,
} from '../components/expedition/expedition.schema';
import { FortitudeStatus } from './fortitude.status';
import { HeraldDelayedStatus } from './heraldDelayed.status';
import { ResolveStatus } from './resolve.status';
import { StatusService } from './status.service';
import { TasteOfBloodBuffStatus } from './tasteOfBlood.buff.status';
import { TasteOfBloodDebuffStatus } from './tasteOfBlood.debuff.status';
import { TurtlingStatus } from './turtling.status';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Expedition.name,
                schema: ExpeditionSchema,
            },
        ]),
    ],
    providers: [
        StatusService,
        TurtlingStatus,
        ResolveStatus,
        FortitudeStatus,
        HeraldDelayedStatus,
        TasteOfBloodBuffStatus,
        TasteOfBloodDebuffStatus,
    ],
    exports: [StatusService],
})
export class StatusModule {}
