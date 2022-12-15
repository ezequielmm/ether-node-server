import { forwardRef, Module } from '@nestjs/common';
import { KindagooseModule } from 'kindagoose';
import { EncounterService } from './encounter.service';
import { ExpeditionModule } from '../expedition/expedition.module';
import { Encounter } from './encounter.schema';
import { CardModule } from '../card/card.module';

@Module({
    imports: [
        KindagooseModule.forFeature([Encounter]),
        forwardRef(() => ExpeditionModule),
        forwardRef(() => CardModule),
    ],
    providers: [EncounterService],
    exports: [EncounterService],
})
export class EncounterModule {}
