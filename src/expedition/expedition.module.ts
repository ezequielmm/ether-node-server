import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpeditionController } from './expedition.controller';
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
    controllers: [ExpeditionController],
    providers: [ExpeditionService, ExpeditionGateway],
})
export class ExpeditionModule {}
