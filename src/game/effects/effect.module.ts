import { GameManagerModule } from './../gameManager/gameManager.module';
import { forwardRef, Module } from '@nestjs/common';
import { ExpeditionModule } from '../expedition/expedition.module';
import { AddCardEffect } from './addCard.effect';
import { DiscardAllCards } from './discardAllCards.effect';
import { DiscardCardEffect } from './discardCard.effect';
import { DrawCardEffect } from './drawCard.effect';
import { UpdatePlayerEnergyEffect } from './updatePlayerEnergy.effect';
import { ModifyHPMaxEffect } from './modifyHPMax.effect';

@Module({
    imports: [forwardRef(() => ExpeditionModule), GameManagerModule],
    providers: [
        DiscardCardEffect,
        DrawCardEffect,
        DiscardAllCards,
        UpdatePlayerEnergyEffect,
        AddCardEffect,
        ModifyHPMaxEffect,
    ],
    exports: [
        DiscardCardEffect,
        DrawCardEffect,
        DiscardAllCards,
        UpdatePlayerEnergyEffect,
        AddCardEffect,
        ModifyHPMaxEffect,
    ],
})
export class EffectModule {}
