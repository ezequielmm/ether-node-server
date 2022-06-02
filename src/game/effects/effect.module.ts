import { GameManagerModule } from './../gameManager/gameManager.module';
import { forwardRef, Module } from '@nestjs/common';
import { ExpeditionModule } from '../expedition/expedition.module';
import { AddCardEffect } from './addCard.effect';
import { DiscardAllCardsEffect } from './discardAllCards.effect';
import { DiscardCardEffect } from './discardCard.effect';
import { DrawCardEffect } from './drawCard.effect';
import { UpdatePlayerEnergyEffect } from './updatePlayerEnergy.effect';
import { ModifyHPMaxEffect } from './modifyHPMax.effect';
import { TurnChangeEffect } from './turnChange.effect';
import { ExhaustCardEffect } from './exhaustCard.effect';
import { DamageEffect } from './damage.effect';
import { DefenseEffect } from './defense.effect';
import { EffectService } from './effect.service';

@Module({
    imports: [forwardRef(() => ExpeditionModule), GameManagerModule],
    providers: [
        DiscardCardEffect,
        DrawCardEffect,
        DiscardAllCardsEffect,
        UpdatePlayerEnergyEffect,
        AddCardEffect,
        ModifyHPMaxEffect,
        TurnChangeEffect,
        ExhaustCardEffect,
        DamageEffect,
        DefenseEffect,
        EffectService,
    ],
    exports: [
        DiscardCardEffect,
        DrawCardEffect,
        DiscardAllCardsEffect,
        UpdatePlayerEnergyEffect,
        AddCardEffect,
        ModifyHPMaxEffect,
        TurnChangeEffect,
        ExhaustCardEffect,
        DamageEffect,
        DefenseEffect,
        EffectService,
    ],
})
export class EffectModule {}
