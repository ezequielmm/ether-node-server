import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Expedition, ExpeditionSchema } from './expedition.schema';
import { ExpeditionService } from './expedition.service';
import { ExpeditionGateway } from './expedition.gateway';
import { CardModule } from '../components/card/card.module';
import { FullSyncAction } from './action/fullSync.action';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Expedition.name,
                schema: ExpeditionSchema,
            },
        ]),
        CardModule,
    ],
    providers: [ExpeditionService, ExpeditionGateway, FullSyncAction],
    exports: [ExpeditionService],
})
export class ExpeditionModule {}
