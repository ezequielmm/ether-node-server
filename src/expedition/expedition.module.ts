import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpeditionController } from './expedition.controller';
import { Expedition, ExpeditionSchema } from './expedition.schema';
import { ExpeditionService } from './expedition.service';

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
    providers: [ExpeditionService],
})
export class ExpeditionModule {}
