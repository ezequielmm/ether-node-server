import { forwardRef, Module } from '@nestjs/common';
import { ActionModule } from '../action/action.module';
import { CardModule } from '../components/card/card.module';
import { CombatQueueModule } from '../components/combatQueue/combatQueue.module';
import { EnemyModule } from '../components/enemy/enemy.module';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { PlayerModule } from '../components/player/player.module';
import { EffectModule } from '../effects/effects.module';
import { HistoryModule } from '../history/history.module';
import { ProviderModule } from '../provider/provider.module';
import { AnticipatingStatus } from './anticipating/anticipating.status';
import { ArmoredUpStatus } from './armoredUp/armoredUp.status';
import { BolsteredStatus } from './bolstered/bolstered.status';
import { BurnStatus } from './burn/burn.status';
import { ClearHeadedStatus } from './clearHeaded/clearHeaded.status';
import { ConfusionStatus } from './confusion/confusion.status';
import { BirdcageStatus } from './birdcage/birdcage.status';
import { DewDropStatus } from './dewDrop/dewDrop.status';
import { DistraughtEvent } from './distraught/distraught.event';
import { DistraughtStatus } from './distraught/distraught.status';
import { DodgeStatus } from './dodge/dodge.status';
import { DoubleDownStatus } from './doubleDown/doubleDown.status';
import { DrainedStatus } from './drained/drained.status';
import { EnflamedStatus } from './enflamed/enflamed.status';
import { FatigueStatus } from './fatigue/fatigue.status';
import { FeebleStatus } from './feeble/feeble.status';
import { ForceFieldEvent } from './forceField/forcefield.event';
import { ForceFieldStatus } from './forceField/forceField.status';
import { FortitudeStatus } from './fortitude/fortitude.status';
import { GiftedStatus } from './gifted/gifted.status';
import { HeralDelayedStatus } from './heraldDelayed/heralDelayed.status';
import { HeraldingStatus } from './heralding/heralding.status';
import { ImbuedStatus } from './imbued/imbued.status';
import { InterceptEvent } from './intercept/intercept.event';
import { InterceptStatus } from './intercept/intercept.status';
import { NextPlayerTurnStatus } from './nextPlayerTurn/nextPlayerTurn.status';
import { PrayingStatus } from './praying/praying.status';
import { RegenerationStatus } from './regeneration/regeneration.status';
import { ResistStatus } from './resist/resist.status';
import { ResolveStatus } from './resolve/resolve.status';
import { ResolveExpiresStatus } from './resolveExpires/resolveExpires.status';
import { SharpenBladeStatus } from './sharpenBlade/sharpenBlade.status';
import { SiphoningStatus } from './siphoning/siphoning.status';
import { SpikesStatus } from './spikes/spikes.status';
import { SpiritedStatus } from './spirited/spirited.status';
import { StatusService } from './status.service';
import { StunnedStatus } from './stunned/stunned.status';
import { TasteOfBloodBuffStatus } from './tasteOfBlood/tasteOfBlood.buff.status';
import { TasteOfBloodDebuffStatus } from './tasteOfBlood/tasteOfBlood.debuff.status';
import { TrappedStatus } from './trapped/trapped.status';
import { TurtlingStatus } from './turtling/turtling.status';
import { SummonedStatus } from './summoned/summoned.status';
import { ProcessModule } from '../process/process.module';
import { PeacockFeatherStatus } from './peacockFeather/peacockFeather.status';
import { BlightedStatus } from './blighted/blighted.status';
import { CombatModule } from '../combat/combat.module';
import { HiddenStatus } from './hidden/hidden.status';
import { HatchingStatus } from './hatching/hatching.status';
import { ChargingBeamStatus } from './chargingBeam/chargingBeam.status';
import { RevealStatus } from './reveal/reveal.status';
import { GrownStatus } from './grown/grown.status';
import { CounterStatus } from './countering/countering.status';
import { ElementalStatus } from './elemental/elemental.status';
import { AbsorbingStatus } from './absorbing/absorbing.status';
import { GalvanizeStatus } from './galvanize/galvanize.status';
import { MistifiedStatus } from './mistified/mistified.status';
import { ComebackStatus } from './comeback/comeback.status';
import { SpiritAssaultStatus } from './elementalattack/elemental.status';
import { OnFireStatus } from './onFire/onFire.status';

@Module({
    imports: [
        forwardRef(() => ExpeditionModule),
        forwardRef(() => EffectModule),
        forwardRef(() => EnemyModule),
        forwardRef(() => PlayerModule),
        forwardRef(() => CardModule),
        forwardRef(() => ActionModule),
        forwardRef(() => ProcessModule),
        forwardRef(() => CombatModule),
        CombatQueueModule,
        ProviderModule,
        HistoryModule,
    ],
    providers: [
        StatusService,
        TurtlingStatus,
        ResolveStatus,
        FortitudeStatus,
        HeralDelayedStatus,
        HeraldingStatus,
        TasteOfBloodBuffStatus,
        TasteOfBloodDebuffStatus,
        BurnStatus,
        DodgeStatus,
        SiphoningStatus,
        RegenerationStatus,
        SpiritedStatus,
        SpikesStatus,
        ConfusionStatus,
        DoubleDownStatus,
        ImbuedStatus,
        ResistStatus,
        DrainedStatus,
        ForceFieldStatus,
        ForceFieldEvent,
        InterceptStatus,
        InterceptEvent,
        DistraughtEvent,
        DistraughtStatus,
        DistraughtEvent,
        DrainedStatus,
        BolsteredStatus,
        EnflamedStatus,
        GiftedStatus,
        FatigueStatus,
        SharpenBladeStatus,
        AnticipatingStatus,
        StunnedStatus,
        PrayingStatus,
        NextPlayerTurnStatus,
        ArmoredUpStatus,
        ResolveExpiresStatus,
        ClearHeadedStatus,
        DewDropStatus,
        FeebleStatus,
        TrappedStatus,
        BirdcageStatus,
        SummonedStatus,
        PeacockFeatherStatus,
        BlightedStatus,
        HiddenStatus,
        HatchingStatus,
        ChargingBeamStatus,
        RevealStatus,
        GrownStatus,
        CounterStatus,
        ElementalStatus,
        AbsorbingStatus,
        GalvanizeStatus,
        MistifiedStatus,
        ComebackStatus,
        SpiritAssaultStatus,
        OnFireStatus
    ],
    exports: [StatusService],
})
export class StatusModule {}
