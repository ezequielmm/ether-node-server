import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { PlayerWinModule } from '../playerWin/playerWin.module';
import { ContestMapModule } from '../game/contestMap/contestMap.module';
import { ContestModule } from '../game/contest/contest.module';
import { CharacterModule } from 'src/game/components/character/character.module';
import { NFTService } from 'src/nft-library/services/nft_service';
import { AlchemyService } from 'src/nft-library/services/alchemy_service';

@Module({
    controllers: [WalletController],
    imports: [
        PlayerWinModule,
        ContestMapModule,
        ContestModule,
        CharacterModule,
    ],
    providers: [WalletService, NFTService, AlchemyService],
})
export class WalletModule {}
