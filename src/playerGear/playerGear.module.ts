import { forwardRef, Module } from '@nestjs/common';
import { PlayerGearController } from './playerGear.controller';
import { KindagooseModule } from 'kindagoose';
import { PlayerGear } from './playerGear.schema';
import { PlayerGearService } from './playerGear.service';
import { HttpModule } from '@nestjs/axios';
import { ExpeditionModule } from '../game/components/expedition/expedition.module';
import { AuthGatewayModule } from '../authGateway/authGateway.module';
import { GearChainBridgeController } from './gearChainBridge.controller';

@Module({
    controllers: [PlayerGearController, GearChainBridgeController],
    imports: [
        KindagooseModule.forFeature([PlayerGear]),
        HttpModule,
        forwardRef(() => ExpeditionModule),
        AuthGatewayModule,
    ],
    providers: [PlayerGearService],
    exports: [PlayerGearService],
})
export class PlayerGearModule {}
