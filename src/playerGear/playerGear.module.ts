import { Module } from '@nestjs/common';
import { PlayerGearController } from './playerGear.controller';
import { KindagooseModule } from 'kindagoose';
import { PlayerGear } from './playerGear.schema';
import { PlayerGearService } from './playerGear.service';
import { HttpModule } from '@nestjs/axios';
import { ExpeditionModule } from '../game/components/expedition/expedition.module';
import { AuthGatewayModule } from '../authGateway/authGateway.module';

@Module({
    controllers: [PlayerGearController],
    imports: [
        KindagooseModule.forFeature([PlayerGear]),
        HttpModule,
        ExpeditionModule,
        AuthGatewayModule,
    ],
    providers: [PlayerGearService],
    exports:[PlayerGearService],
})
export class PlayerGearModule {}
