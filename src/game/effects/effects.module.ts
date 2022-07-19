import { forwardRef, Module } from '@nestjs/common';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { StatusModule } from '../status/status.module';
import { DamageEffect } from './damage/damage.effect';
import { DefenseEffect } from './defense/defense.effect';
import { DrawCardEffect } from './drawCard/drawCard.effect';
import { EffectService } from './effects.service';
import { HealEffect } from './heal/heal.effect';
import { EnergyEffect } from './energy/energy.effect';
import { RemoveDefenseEffect } from './removeDefense/removeDefense.effect';
import { ActionModule } from '../action/action.module';
import { ProviderModule } from '../provider/provider.module';
import { DoubleBurnEffect } from './doubleBurn/doubleBurn.effect';
import { EndTurnEffect } from './endTurn/endTurn.effect';
import { ProcessModule } from '../process/process.module';

@Module({
    imports: [
        forwardRef(() => ExpeditionModule),
        forwardRef(() => ActionModule),
        forwardRef(() => ProcessModule),
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
        EndTurnEffect,
    ],
    exports: [EffectService],
})
export class EffectModule {}
