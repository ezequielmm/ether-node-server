import { forwardRef, Module } from '@nestjs/common';
import { KindagooseModule } from 'kindagoose';
import { EncounterService } from './encounter.service';
import { ExpeditionModule } from '../expedition/expedition.module';
import { Encounter } from './encounter.schema';

@Module({
    imports: [
        KindagooseModule.forFeature([Encounter]),
        forwardRef(() => ExpeditionModule),
    ],
    providers: [EncounterService],
    exports: [EncounterService],
})
export class EncounterModule { }
