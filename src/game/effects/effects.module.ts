import { forwardRef, Module } from '@nestjs/common';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { DamageEffect } from './damage.effect';
import { EffectService } from './effects.service';

@Module({
    imports: [forwardRef(() => ExpeditionModule)],
    providers: [EffectService, DamageEffect],
    exports: [EffectService],
})
export class EffectModule {}
