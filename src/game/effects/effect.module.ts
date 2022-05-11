import { forwardRef, Module } from '@nestjs/common';
import { ExpeditionModule } from '../expedition/expedition.module';
import { DiscardCardEffect } from './discardCard.effect';
import { DrawCardEffect } from './drawCard.effect';

@Module({
    imports: [forwardRef(() => ExpeditionModule)],
    providers: [DiscardCardEffect, DrawCardEffect],
    exports: [DiscardCardEffect, DrawCardEffect],
})
export class EffectModule {}
