import { Injectable } from '@nestjs/common';
import { filter } from 'lodash';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { Node } from '../components/expedition/node';
import { NodeStatus } from '../components/expedition/node-status';
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
                map,
                playerState: { hpCurrent, hpMax },
            },
        } = ctx;

        const totalBasicEnemies =
            this.calculateBasicEnemiesPoints(basicEnemiesDefeated);
        const totalEliteEnemies =
            this.calculateEliteEnemiesPoints(eliteEnemiesDefeated);
        const totalBossEnemies =
            this.calculateBossEnemyPotions(bossEnemiesDefeated);

        // Now we query how many nodes we completed in the expedition
        const nodesCompleted = this.calculateNodesCompleted(map);

        // How we query how much HP the player got
        const healthReamining = this.calculateHP(hpCurrent, hpMax);

        // How we sum all the points to get the total
        const total =
            totalBasicEnemies +
            totalEliteEnemies +
            totalEliteEnemies +
            nodesCompleted +
            healthReamining;
    }

    private calculateBasicEnemiesPoints(enemiesToCalculate: number): number {
        // This method will calculate how many basic enemies
        // we defeated during the whole expedition
        // 1 basic enemy = 2 points
        return enemiesToCalculate * 2;
    }

    private calculateEliteEnemiesPoints(enemiesToCalculate: number): number {
        // This method will calculate how many elite enemies
        // we defeated during the whole expedition
        // 1 elite enemy = 10 points
        return enemiesToCalculate * 10;
    }

    private calculateBossEnemyPotions(enemiesToCalculate: number): number {
        // This method will calculate how many elite enemies
        // we defeated during the whole expedition
        // 1 boss enemy = 100 points
        return enemiesToCalculate * 100;
    }

    private calculateNodesCompleted(map: Node[]): number {
        // here we calculate how many completed nodes we got
        // in this expedition
        // 1 node completed = 5 points
        const nodesCompleted = filter(map, {
            status: NodeStatus.Completed,
        }).length;

        return nodesCompleted * 5;
    }

    private calculateHP(hpCurrent: number, hpMax: number): number {
        // Here we calculate how many points the player will
        // get based on how much HP remanining it got when the calculation is
        // made
        // 25 HP = 1 Point
        // 26 HP = 2 Points
        // 27 HP = 3 Points
        // if the player has full HP it will sum 15 points
        if (hpCurrent === hpMax) return 15;
        if (hpCurrent === 25) return 1;
        if (hpCurrent === 26) return 2;
        if (hpCurrent === 27) return 3;
    }
}
