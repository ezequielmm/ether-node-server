import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Expedition, ExpeditionSchema } from './expedition.schema';
import { ExpeditionService } from './expedition.service';
import { ExpeditionGateway } from './expedition.gateway';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Expedition.name,
                schema: ExpeditionSchema,
            },
        ]),
    ],
    providers: [ExpeditionService, ExpeditionGateway],
    exports: [ExpeditionService],
})
export class ExpeditionModule {}
