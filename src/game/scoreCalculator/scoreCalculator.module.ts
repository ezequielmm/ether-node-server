import { Module } from '@nestjs/common';
import { ScoreCalculatorService } from './scoreCalculator.service';
import { Expedition } from '../components/expedition/expedition.schema';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { MapService } from '../map/map.service';
import { ModuleRef } from '@nestjs/core';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Module({
    imports: [],
    providers: [ScoreCalculatorService, Expedition, ExpeditionService],
    exports: [ScoreCalculatorService, Expedition, ExpeditionService],
})
export class ScoreCalculatorModule {}
