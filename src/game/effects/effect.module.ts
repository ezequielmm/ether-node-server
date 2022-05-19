import { forwardRef, Module } from '@nestjs/common';
import { ExpeditionModule } from '../expedition/expedition.module';
import { DiscardAllCards } from './discardAllCards.effect';
import { DiscardCardEffect } from './discardCard.effect';
import { DrawCardEffect } from './drawCard.effect';
import { UpdatePlayerEnergyEffect } from './updatePlayerEnergy.effect';

@Module({
    imports: [forwardRef(() => ExpeditionModule)],
    providers: [
        DiscardCardEffect,
        DrawCardEffect,
        DiscardAllCards,
        UpdatePlayerEnergyEffect,
    ],
    exports: [
        DiscardCardEffect,
        DrawCardEffect,
        DiscardAllCards,
        UpdatePlayerEnergyEffect,
    ],
})
export class EffectModule {}
