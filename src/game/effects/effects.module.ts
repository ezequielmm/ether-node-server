import { forwardRef, Module } from '@nestjs/common';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { StatusModule } from '../status/status.module';
import { DamageEffect } from './damage.effect';
import { DefenseEffect } from './defense.effect';
import { DrawCardEffect } from './drawCard.effect';
import { EffectService } from './effects.service';
import { HealEffect } from './heal.effect';
import { EnergyEffect } from './energy.effect';
import { RemoveDefenseEffect } from './removeDefense.effect';
import { ActionModule } from '../action/action.module';
import { ProviderModule } from '../provider/provider.module';
import { DoubleBurnEffect } from './doubleBurn/doubleBurn.effect';

@Module({
    imports: [
        forwardRef(() => ExpeditionModule),
        forwardRef(() => ActionModule),
        StatusModule,
        ProviderModule,
    ],
    providers: [
        EffectService,
        DamageEffect,
        DefenseEffect,
        DrawCardEffect,
        HealEffect,
        EnergyEffect,
        RemoveDefenseEffect,
        DoubleBurnEffect,
    ],
    exports: [EffectService],
})
export class EffectModule {}
