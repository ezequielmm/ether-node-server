import { forwardRef, Module } from '@nestjs/common';
import { ActionModule } from '../action/action.module';
import { CardSelectionScreenModule } from '../components/cardSelectionScreen/cardSelectionScreen.module';
import { CombatQueueModule } from '../components/combatQueue/combatQueue.module';
import { EnemyModule } from '../components/enemy/enemy.module';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { PlayerModule } from '../components/player/player.module';
import { HistoryModule } from '../history/history.module';
import { ProviderModule } from '../provider/provider.module';
import { StatusModule } from '../status/status.module';
import { AnticipatingEffect } from './anticipating/anticipating.effect';
import { AttachStatusEffect } from './attachStatus/attachStatus.effect';
import { ChooseCardEffect } from './chooseCard/chooseCard.effect';
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
import { KnockDownEffect } from './knockDown/knockDown.effect';
import { LastReminderEffect } from './lastReminder/lastReminder.effect';
import { RemoveDebuffEffect } from './removeDebuff/removeDebuff.effect';
import { RemoveDefenseEffect } from './removeDefense/removeDefense.effect';
import { RepositionEffect } from './reposition/reposition.effect';
import { TwistTheBladeEffect } from './twistTheBlade/twistTheBlade.effect';

@Module({
    imports: [
        forwardRef(() => ExpeditionModule),
        forwardRef(() => StatusModule),
        forwardRef(() => EnemyModule),
        forwardRef(() => ActionModule),
        ProviderModule,
        PlayerModule,
        CombatQueueModule,
        HistoryModule,
        CardSelectionScreenModule,
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
        AnticipatingEffect,
        TwistTheBladeEffect,
        KnockDownEffect,
        ChooseCardEffect,
        AttachStatusEffect,
        LastReminderEffect,
    ],
    exports: [EffectService],
})
export class EffectModule {}
