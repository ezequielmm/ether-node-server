import { GameManagerModule } from './../gameManager/gameManager.module';
import { forwardRef, Module } from '@nestjs/common';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { AddCardEffect } from './addCard.effect';
import { ModifyHPMaxEffect } from './modifyHPMax.effect';
import { DamageEffect } from './damage.effect';
import { DefenseEffect } from './defense.effect';
import { EffectService } from './effect.service';
import { DrawCardEffect } from './drawCard.effect';

@Module({
    imports: [forwardRef(() => ExpeditionModule), GameManagerModule],
    providers: [
        AddCardEffect,
        ModifyHPMaxEffect,
        DamageEffect,
        DefenseEffect,
        EffectService,
        DrawCardEffect,
    ],
    exports: [
        AddCardEffect,
        ModifyHPMaxEffect,
        DamageEffect,
        DefenseEffect,
        EffectService,
        DrawCardEffect,
    ],
})
export class EffectModule {}
