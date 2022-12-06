import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EncounterService } from './encounter.service';
import { ExpeditionModule } from '../expedition/expedition.module';
import { Encounter, EncounterSchema } from './encounter.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Encounter.name,
                schema: EncounterSchema,
            },
        ]),
        forwardRef(() => ExpeditionModule),
    ],
    providers: [EncounterService],
    exports: [EncounterService],
})
export class EncounterModule {}
