import { forwardRef, Module } from '@nestjs/common';
import { ExpeditionModule } from '../components/expedition/expedition.module';

@Module({
    imports: [forwardRef(() => ExpeditionModule)],
})
export class EffectModule {}
