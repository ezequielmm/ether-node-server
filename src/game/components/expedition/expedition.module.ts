import { forwardRef, Module } from '@nestjs/common';
import { Expedition } from './expedition.schema';
import { ExpeditionService } from './expedition.service';
import { KindagooseModule } from 'kindagoose';
import { MapModule } from 'src/game/map/map.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        KindagooseModule.forFeature([Expedition]),
        MapModule,
        forwardRef(() => ConfigModule),
    ],
    providers: [ExpeditionService],
    exports: [ExpeditionService, KindagooseModule],
})
export class ExpeditionModule {}
