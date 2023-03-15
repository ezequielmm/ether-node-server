import { Module } from '@nestjs/common';
import { PlayerGearController } from './playerGear.controller';
import { KindagooseModule } from 'kindagoose';
import { PlayerGear } from './playerGear.schema';
import { PlayerGearService } from './playerGear.service';
import { HttpModule } from '@nestjs/axios';
import { ExpeditionModule } from '../game/components/expedition/expedition.module';

@Module({
    controllers: [PlayerGearController],
    imports: [
        KindagooseModule.forFeature([PlayerGear]),
        HttpModule,
        ExpeditionModule,
    ],
    providers: [PlayerGearService],
})
export class PlayerGearModule {}
