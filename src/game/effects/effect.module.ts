import { GameManagerModule } from './../gameManger/gameManager.module';
import { forwardRef, Module } from '@nestjs/common';
import { ExpeditionModule } from '../expedition/expedition.module';
import { DiscardAllCards } from './discardAllCards.effect';
import { DiscardCardEffect } from './discardCard.effect';
import { DrawCardEffect } from './drawCard.effect';

@Module({
    imports: [forwardRef(() => ExpeditionModule), GameManagerModule],
    providers: [DiscardCardEffect, DrawCardEffect, DiscardAllCards],
    exports: [DiscardCardEffect, DrawCardEffect, DiscardAllCards],
})
export class EffectModule {}
