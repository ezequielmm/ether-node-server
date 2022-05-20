import { GameManagerModule } from './../gameManger/gameManager.module';
import { forwardRef, Module } from '@nestjs/common';
import { ExpeditionModule } from '../expedition/expedition.module';
import { AddCardEffect } from './addCard.effect';
import { DiscardAllCards } from './discardAllCards.effect';
import { DiscardCardEffect } from './discardCard.effect';
import { DrawCardEffect } from './drawCard.effect';
import { UpdatePlayerEnergyEffect } from './updatePlayerEnergy.effect';

@Module({
    imports: [forwardRef(() => ExpeditionModule), GameManagerModule],
    providers: [
        DiscardCardEffect,
        DrawCardEffect,
        DiscardAllCards,
        UpdatePlayerEnergyEffect,
        AddCardEffect,
    ],
    exports: [
        DiscardCardEffect,
        DrawCardEffect,
        DiscardAllCards,
        UpdatePlayerEnergyEffect,
        AddCardEffect,
    ],
})
export class EffectModule {}
