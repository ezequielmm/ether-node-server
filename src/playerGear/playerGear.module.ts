import { forwardRef, Module } from '@nestjs/common';
import { PlayerGearController } from './playerGear.controller';
import { KindagooseModule } from 'kindagoose';
import { PlayerGear } from './playerGear.schema';
import { PlayerGearService } from './playerGear.service';
import { HttpModule } from '@nestjs/axios';
import { ExpeditionModule } from '../game/components/expedition/expedition.module';
import { GearChainBridgeController } from './gearChainBridge.controller';
import { GearModule } from 'src/game/components/gear/gear.module';
import { BridgeModule } from 'src/bridge-api/bridge.module';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
    controllers: [PlayerGearController, GearChainBridgeController],
    imports: [
        KindagooseModule.forFeature([PlayerGear]),
        HttpModule,
        forwardRef(() => ExpeditionModule),
        GearModule,
        BridgeModule,
        WalletModule
    ],
    providers: [PlayerGearService],
    exports: [PlayerGearService],
})
export class PlayerGearModule {}
