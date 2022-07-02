import { forwardRef, Module } from '@nestjs/common';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { StatusModule } from '../status/status.module';
import { DamageEffect } from './damage.effect';
import { DefenseEffect } from './defense.effect';
import { DrawCardEffect } from './drawCard.effect';
import { EffectService } from './effects.service';

@Module({
    imports: [forwardRef(() => ExpeditionModule), StatusModule],
    providers: [EffectService, DamageEffect, DefenseEffect, DrawCardEffect],
    exports: [EffectService],
})
export class EffectModule {}
