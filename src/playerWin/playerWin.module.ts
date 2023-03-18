import { Module } from '@nestjs/common';
import { KindagooseModule } from 'kindagoose';
import { PlayerWin } from './playerWin.schema';
import { PlayerWinService } from './playerWin.service';

@Module({
    imports: [KindagooseModule.forFeature([PlayerWin])],
    providers: [PlayerWinService],
    exports: [PlayerWinService],
})
export class PlayerWinModule {}
