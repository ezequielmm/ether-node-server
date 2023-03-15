import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { PlayerWinModule } from '../playerWin/playerWin.module';
@Module({
    controllers: [WalletController],
    imports: [PlayerWinModule],
    providers: [WalletService],
})
export class WalletModule {}
