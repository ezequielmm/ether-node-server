import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    Expedition,
    ExpeditionSchema,
} from '../components/expedition/expedition.schema';
import { StatusService } from './status.service';
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
    providers: [StatusService, TurtlingStatus],
    exports: [StatusService],
})
export class StatusModule {}
