import { forwardRef, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ActionModule } from 'src/game/action/action.module';
import { StatusModule } from 'src/game/status/status.module';
import { ExpeditionModule } from '../expedition/expedition.module';
import { PlayerModule } from '../player/player.module';
import { Card } from './card.schema';
import { CardService } from './card.service';

@Module({
    imports: [
        TypegooseModule.forFeature([Card]),
        forwardRef(() => ActionModule),
        forwardRef(() => ExpeditionModule),
        forwardRef(() => StatusModule),
        forwardRef(() => PlayerModule),
    ],
    providers: [CardService],
    exports: [CardService],
})
export class CardModule {}
