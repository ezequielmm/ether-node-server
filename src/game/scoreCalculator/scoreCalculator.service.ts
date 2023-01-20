import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { GameContext } from '../components/interfaces';

@Injectable()
export class ScoreCalculatorService {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async calculate(ctx: GameContext): Promise<void> {
        // All the points will be calculatred based on
        // this documentation:
        // https://robotseamonster.atlassian.net/wiki/spaces/KOTE/pages/272334852/Requirements+for+GameEnd+Score+from+Adam
        // First we calculate the enemies defeated
        const {
            expedition: {
                scores: {
                    basicEnemiesDefeated,
                    eliteEnemiesDefeated,
                    bossEnemiesDefeated,
                },
            },
        } = ctx;

        const totalBasicEnemies =
            this.calculateBasicEnemiesPoints(basicEnemiesDefeated);
    }

    private calculateBasicEnemiesPoints(enemiesToCalculate: number): number {
        // This method will calculate how many basic enemies
        // we defeated during the whole expedition
        // 1 basic enemy = 2 points
        return enemiesToCalculate * 2;
    }
}
