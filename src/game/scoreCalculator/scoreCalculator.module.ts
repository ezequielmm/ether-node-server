import { Module } from '@nestjs/common';
import { ScoreCalculatorService } from './scoreCalculator.service';

@Module({
    providers: [ScoreCalculatorService],
    exports: [ScoreCalculatorService],
})
export class ScoreCalculatorModule {}
