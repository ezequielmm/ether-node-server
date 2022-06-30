import { forwardRef, Module } from '@nestjs/common';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { DamageEffect } from './damage.effect';
import { DefenseEffect } from './defense.effect';
import { EffectService } from './effects.service';

@Module({
    imports: [forwardRef(() => ExpeditionModule)],
    providers: [EffectService, DamageEffect, DefenseEffect],
    exports: [EffectService],
})
export class EffectModule {}
