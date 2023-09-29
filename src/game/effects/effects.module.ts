import { forwardRef, Module } from '@nestjs/common';
import { ActionModule } from '../action/action.module';
import { CombatModule } from '../combat/combat.module';
import { CardModule } from '../components/card/card.module';
import { CardSelectionScreenModule } from '../components/cardSelectionScreen/cardSelectionScreen.module';
import { CombatQueueModule } from '../components/combatQueue/combatQueue.module';
import { EnemyModule } from '../components/enemy/enemy.module';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { PlayerModule } from '../components/player/player.module';
import { TrinketModule } from '../components/trinket/trinket.module';
import { HistoryModule } from '../history/history.module';
import { ProcessModule } from '../process/process.module';
import { ProviderModule } from '../provider/provider.module';
import { StatusModule } from '../status/status.module';
import { AddCardEffect } from './addCard/addCard.effect';
import { AnticipatingEffect } from './anticipating/anticipating.effect';
import { AttachStatusEffect } from './attachStatus/attachStatus.effect';
import { AutonomousWeaponEffect } from './autonomousWeapon/autonomousWeapon.effect';
import { ChooseCardEffect } from './chooseCard/chooseCard.effect';
import { DamageEffect } from './damage/damage.effect';
import { DefenseEffect } from './defense/defense.effect';
import { DoubleBurnEffect } from './doubleBurn/doubleBurn.effect';
import { DoubleResolveEffect } from './doubleResolve/doubleResolve.effect';
import { DrawCardEffect } from './drawCard/drawCard.effect';
import { EffectService } from './effects.service';
import { EnergyEffect } from './energy/energy.effect';
import { ExecutionersBlowEffect } from './executionersBlow/executionersBlow.effect';
import { FleeEffect } from './flee/flee.effect';
import { FlurryPlusEffect } from './flurry/flurry-plus.effect';
import { FlurryEffect } from './flurry/flurry.effect';
import { HeadButtEffect } from './headButt/headButt.effect';
import { HealPercentageEffect } from './heal/heal-percentage.effect';
import { HealEffect } from './heal/heal.effect';
import { KnockDownEffect } from './knockDown/knockDown.effect';
import { LastReminderEffect } from './lastReminder/lastReminder.effect';
import { PavaRootEffect } from './pavaRoot/pavaRoot.effect';
import { PhilterOfRedemptionEffect } from './philterOfRedemption/philterOfRedemption.effect';
import { RemoveConfusionEffect } from './removeConfusion/removeConfusion.effect';
import { RemoveDebuffEffect } from './removeDebuff/removeDebuff.effect';
import { RemoveDefenseEffect } from './removeDefense/removeDefense.effect';
import { RepositionEffect } from './reposition/reposition.effect';
import {
    ShieldBashEffect,
    ShieldBashEffectUpgraded,
} from './shieldBash/shieldBash.effect';
import { SpawnEnemyEffect } from './spawnEnemy/spawnEnemy.effect';
import { TwistTheBladeEffect } from './twistTheBlade/twistTheBlade.effect';
import { NoEffectEffect } from './noEffects/noEffect.effect';
import { BreachEffect } from './breach/breach.effect';
import { CounterEffect } from './counter/counter.efect';
import { AbsorbEffect } from './absorb/absorb.effect';
import { CannibalizeEffect } from './cannibalize/cannibalize.effect';
import { TransformEffect } from './transform/transform.effect';

@Module({
    imports: [
        forwardRef(() => ExpeditionModule),
        forwardRef(() => StatusModule),
        forwardRef(() => EnemyModule),
        forwardRef(() => ActionModule),
        forwardRef(() => CardModule),
        forwardRef(() => CombatModule),
        forwardRef(() => PlayerModule),
        ProviderModule,
        TrinketModule,
        PlayerModule,
        CombatQueueModule,
        HistoryModule,
        CardSelectionScreenModule,
        forwardRef(() => ProcessModule),
    ],
    providers: [
        EffectService,
        DamageEffect,
        DefenseEffect,
        DrawCardEffect,
        HealEffect,
        HealPercentageEffect,
        EnergyEffect,
        RemoveDefenseEffect,
        DoubleBurnEffect,
        HeadButtEffect,
        RepositionEffect,
        FlurryEffect,
        FlurryPlusEffect,
        RemoveDebuffEffect,
        DoubleResolveEffect,
        AnticipatingEffect,
        TwistTheBladeEffect,
        KnockDownEffect,
        ChooseCardEffect,
        AttachStatusEffect,
        LastReminderEffect,
        AutonomousWeaponEffect,
        PhilterOfRedemptionEffect,
        AddCardEffect,
        PavaRootEffect,
        RemoveConfusionEffect,
        ExecutionersBlowEffect,
        SpawnEnemyEffect,
        FleeEffect,
        ShieldBashEffect,
        ShieldBashEffectUpgraded,
        NoEffectEffect,
        BreachEffect,
        CounterEffect,
        AbsorbEffect,
        CannibalizeEffect,
        TransformEffect

    ],
    exports: [EffectService],
})
export class EffectModule {}
