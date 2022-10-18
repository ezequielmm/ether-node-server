import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ExpeditionController } from './expedition.controller';
import { AuthGatewayModule } from 'src/authGateway/authGateway.module';
import { ExpeditionModule } from 'src/game/components/expedition/expedition.module';
import { ProcessModule } from 'src/game/process/process.module';
import { MerchantModule } from 'src/game/merchant/merchant.module';

@Module({
    imports: [
        AuthGatewayModule,
        ExpeditionModule,
        ProcessModule,
        MerchantModule,
    ],
    controllers: [ProfileController, ExpeditionController],
})
export class ApiModule {}
