import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { HttpModule } from '@nestjs/axios';
@Module({
    controllers: [WalletController],
    imports: [HttpModule],
    providers: [WalletService],
})
export class WalletModule {}
