import { forwardRef, Module } from '@nestjs/common';
import { ActionModule } from '../action/action.module';
import { CombatQueueModule } from '../components/combatQueue/combatQueue.module';
import { EnemyModule } from '../components/enemy/enemy.module';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { PlayerModule } from '../components/player/player.module';
import { ProviderModule } from '../provider/provider.module';
import { StatusModule } from '../status/status.module';
import { DamageEffect } from './damage/damage.effect';
import { DefenseEffect } from './defense/defense.effect';
import { DoubleBurnEffect } from './doubleBurn/doubleBurn.effect';
import { DoubleResolveEffect } from './doubleResolve/doubleResolve.effect';
import { DrawCardEffect } from './drawCard/drawCard.effect';
import { EffectService } from './effects.service';
import { EnergyEffect } from './energy/energy.effect';
import { FlurryEffect } from './flurry/flurry.effect';
import { HeadButtEffect } from './headButt/headButt.effect';
import { HealEffect } from './heal/heal.effect';
import { RemoveDebuffEffect } from './removeDebuff/removeDebuff.effect';
import { RemoveDefenseEffect } from './removeDefense/removeDefense.effect';
import { RepositionEffect } from './reposition/reposition.effect';

@Module({
    imports: [
        forwardRef(() => ExpeditionModule),
        forwardRef(() => StatusModule),
        forwardRef(() => EnemyModule),
        ProviderModule,
        PlayerModule,
        CombatQueueModule,
        forwardRef(() => ActionModule),
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
        HeadButtEffect,
        RepositionEffect,
        FlurryEffect,
        RemoveDebuffEffect,
        DoubleResolveEffect,
    ],
    exports: [EffectService],
})
export class EffectModule {}
