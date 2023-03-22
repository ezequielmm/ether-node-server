import { Module } from '@nestjs/common';
import { KindagooseModule } from 'kindagoose';
import { CharacterModule } from 'src/game/components/character/character.module';
import { PlayerWin } from './playerWin.schema';
import { PlayerWinService } from './playerWin.service';

@Module({
    imports: [KindagooseModule.forFeature([PlayerWin]), CharacterModule],
    providers: [PlayerWinService],
    exports: [PlayerWinService],
})
export class PlayerWinModule {}
