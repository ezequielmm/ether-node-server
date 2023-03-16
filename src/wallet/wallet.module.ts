import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { PlayerWinModule } from '../playerWin/playerWin.module';
import { ContestMapModule } from '../game/contestMap/contestMap.module';
@Module({
    controllers: [WalletController],
    imports: [PlayerWinModule, ContestMapModule],
    providers: [WalletService],
})
export class WalletModule {}
