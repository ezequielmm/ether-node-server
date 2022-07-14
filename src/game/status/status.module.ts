import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import {
    Expedition,
    ExpeditionSchema,
} from '../components/expedition/expedition.schema';
import { EffectModule } from '../effects/effects.module';
import { BurnStatus } from './burn/burn.status';
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
        ExpeditionModule,
        forwardRef(() => EffectModule),
    ],
    providers: [
        StatusService,
        TurtlingStatus,
        ResolveStatus,
        FortitudeStatus,
        HeraldDelayedStatus,
        TasteOfBloodBuffStatus,
        TasteOfBloodDebuffStatus,
        BurnStatus,
    ],
    exports: [StatusService],
})
export class StatusModule {}
