import { forwardRef, Module } from '@nestjs/common';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { ScoreCalculatorService } from './scoreCalculator.service';

@Module({
    imports: [forwardRef(() => ExpeditionModule)],
    providers: [ScoreCalculatorService],
    exports: [ScoreCalculatorService],
})
export class ScoreCalculatorModule {}
