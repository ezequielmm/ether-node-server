import { forwardRef, Module } from '@nestjs/common';
import { Expedition, MapType } from './expedition.schema';
import { ExpeditionService } from './expedition.service';
import { KindagooseModule } from 'kindagoose';
import { MapModule } from 'src/game/map/map.module';
import { ConfigModule } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { MapService } from 'src/game/map/map.service';
import { ConfigService } from 'aws-sdk';

@Module({
    imports: [
        KindagooseModule.forFeature([Expedition]),
        KindagooseModule.forFeature([MapType]),
        KindagooseModule.forFeature([ExpeditionService]),


        MapModule,
        forwardRef(() => ConfigModule),

    ],
    providers: [ExpeditionService],
    exports: [ExpeditionService, KindagooseModule ],
})
export class ExpeditionModule {}
