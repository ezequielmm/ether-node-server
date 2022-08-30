import { forwardRef, Module } from '@nestjs/common';
import { CardModule } from '../components/card/card.module';
import { EnemyModule } from '../components/enemy/enemy.module';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { PlayerModule } from '../components/player/player.module';
import { EffectModule } from '../effects/effects.module';
import { ProviderModule } from '../provider/provider.module';
import { AnticipatingStatus } from './anticipating/anticipating.status';
import { BolsteredStatus } from './bolstered/bolstered.status';
import { BurnStatus } from './burn/burn.status';
import { ConfusionStatus } from './confusion/confusion.status';
import { DistraughtEvent } from './distraught/distraught.event';
import { DistraughtStatus } from './distraught/distraught.status';
import { DodgeStatus } from './dodge/dodge.status';
import { DoubleDownStatus } from './doubleDown/doubleDown.status';
import { DrainedStatus } from './drained/drained.status';
import { FatigueStatus } from './fatigue/fatigue.status';
import { ForceFieldEvent } from './forceField/forcefield.event';
import { ForceFieldStatus } from './forceField/forceField.status';
import { FortitudeStatus } from './fortitude/fortitude.status';
import { GiftedStatus } from './gifted/gifted.status';
import { HeraldDelayedStatus } from './heraldDelayed/heraldDelayed.status';
import { ImbuedStatus } from './imbued/imbued.status';
import { InterceptEvent } from './intercept/intercept.event';
import { InterceptStatus } from './intercept/intercept.status';
import { RegenerateStatus } from './regenerate/regenerate.status';
import { ResistStatus } from './resist/resist.status';
import { ResolveStatus } from './resolve/resolve.status';
import { SharpenBladeStatus } from './sharpenBlade/sharpenBlade.status';
import { SiphoningStatus } from './siphoning/siphoning.status';
import { SpikesStatus } from './spikes/spikes.status';
import { SpiritedStatus } from './spirited/spirited.status';
import { StatusService } from './status.service';
import { StunnedStatus } from './stunned/stunned.status';
import { TasteOfBloodBuffStatus } from './tasteOfBlood/tasteOfBlood.buff.status';
import { TasteOfBloodDebuffStatus } from './tasteOfBlood/tasteOfBlood.debuff.status';
import { TurtlingStatus } from './turtling/turtling.status';

@Module({
    imports: [
        ProviderModule,
        forwardRef(() => ExpeditionModule),
        forwardRef(() => EffectModule),
        forwardRef(() => EnemyModule),
        forwardRef(() => PlayerModule),
        CardModule,
    ],
    providers: [
        StatusService,
        TurtlingStatus,
        ResolveStatus,
        FortitudeStatus,
        HeraldDelayedStatus,
        TasteOfBloodBuffStatus,
        TasteOfBloodDebuffStatus,
        BurnStatus,
        DodgeStatus,
        SiphoningStatus,
        RegenerateStatus,
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
        GiftedStatus,
        FatigueStatus,
        SharpenBladeStatus,
        AnticipatingStatus,
        StunnedStatus,
    ],
    exports: [StatusService],
})
export class StatusModule {}
