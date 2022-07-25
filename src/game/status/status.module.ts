import { forwardRef, Module } from '@nestjs/common';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { EffectModule } from '../effects/effects.module';
import { ProviderModule } from '../provider/provider.module';
import { BurnStatus } from './burn/burn.status';
import { ConfusionStatus } from './confusion/confusion.status';
import { DodgeStatus } from './dodge/dodge.status';
import { DoubleDownStatus } from './doubleDown/doubleDown.status';
import { FortitudeStatus } from './fortitude/fortitude.status';
import { HeraldDelayedStatus } from './heraldDelayed/heraldDelayed.status';
import { RegenerateStatus } from './regenerate/regenerate.status';
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
        forwardRef(() => ExpeditionModule),
        forwardRef(() => EffectModule),
        ProviderModule,
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
    ],
    exports: [StatusService],
})
export class StatusModule {}
