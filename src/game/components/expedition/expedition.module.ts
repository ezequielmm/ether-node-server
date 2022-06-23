import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Expedition, ExpeditionSchema } from './expedition.schema';
import { ExpeditionService } from './expedition.service';
import { ExpeditionGateway } from '../../../socket/expedition.gateway';
import { CardModule } from '../card/card.module';
import { ExpeditionActionModule } from '../../expedition/actions/expedition.action.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Expedition.name,
                schema: ExpeditionSchema,
            },
        ]),
        CardModule,
        forwardRef(() => ExpeditionActionModule),
    ],
    providers: [ExpeditionService, ExpeditionGateway],
    exports: [ExpeditionService],
})
export class ExpeditionModule {}
