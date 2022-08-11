import { forwardRef, Module } from '@nestjs/common';
import { EnemyModule } from '../components/enemy/enemy.module';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { PlayerModule } from '../components/player/player.module';
import { EffectModule } from '../effects/effects.module';
import { ProviderModule } from '../provider/provider.module';
import { BurnStatus } from './burn/burn.status';
import { ConfusionStatus } from './confusion/confusion.status';
import { DistraughtEvent } from './distraught/distraught.event';
import { DistraughtStatus } from './distraught/distraught.status';
import { DodgeStatus } from './dodge/dodge.status';
import { DoubleDownStatus } from './doubleDown/doubleDown.status';
import { DrainedStatus } from './drained/drained.status';
import { ForceFieldEvent } from './forceField/forcefield.event';
import { ForceFieldStatus } from './forceField/forceField.status';
import { FortitudeStatus } from './fortitude/fortitude.status';
import { HeraldDelayedStatus } from './heraldDelayed/heraldDelayed.status';
import { ImbuedStatus } from './imbued/imbued.status';
import { InterceptEvent } from './intercept/intercept.event';
import { InterceptStatus } from './intercept/intercept.status';
import { RegenerateStatus } from './regenerate/regenerate.status';
import { ResistStatus } from './resist/resist.status';
import { ResolveStatus } from './resolve/resolve.status';
import { SiphoningStatus } from './siphoning/siphoning.status';
import { SpikesStatus } from './spikes/spikes.status';
import { SpiritedStatus } from './spirited/spirited.status';
import { StatusService } from './status.service';
import { TasteOfBloodBuffStatus } from './tasteOfBlood/tasteOfBlood.buff.status';
import { TasteOfBloodDebuffStatus } from './tasteOfBlood/tasteOfBlood.debuff.status';
import { TurtlingStatus } from './turtling/turtling.status';

@Module({
    imports: [
        ProviderModule,
        ExpeditionModule,
        forwardRef(() => EffectModule),
        PlayerModule,
        EnemyModule,
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
    ],
    exports: [StatusService],
})
export class StatusModule {}
