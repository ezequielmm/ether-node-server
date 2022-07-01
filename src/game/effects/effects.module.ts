import { forwardRef, Module } from '@nestjs/common';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { DamageEffect } from './damage.effect';
import { DefenseEffect } from './defense.effect';
import { DrawCardEffect } from './drawCard.effect';
import { EffectService } from './effects.service';
import { EnergyEffect } from './energy.effect';

@Module({
    imports: [forwardRef(() => ExpeditionModule)],
    providers: [
        EffectService,
        DamageEffect,
        DefenseEffect,
        DrawCardEffect,
        EnergyEffect,
    ],
    exports: [EffectService],
})
export class EffectModule {}
