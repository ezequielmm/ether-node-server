import { barkChargerData } from 'src/game/components/enemy/data/barkCharger.enemy';
import { mimicFrog1Data } from 'src/game/components/enemy/data/mimicFrog1.enemy';
import { sporeMongerData } from 'src/game/components/enemy/data/sporeMonger.enemy';
import { stingFaeData } from 'src/game/components/enemy/data/stingFae.enemy';
import {
    EnemyNodeDataFiller,
    EnemyNodeDataFillerConfig,
} from '../../enemy-node-data-filler';

export class InitialEnemiesFiller extends EnemyNodeDataFiller {
    protected getEnemies(): EnemyNodeDataFillerConfig[] {
        return [
            {
                enemies: [stingFaeData.enemyId, stingFaeData.enemyId],
                frequency: 25,
            },
            {
                enemies: [barkChargerData.enemyId, barkChargerData.enemyId],
                frequency: 25,
            },
            {
                enemies: [sporeMongerData.enemyId],
                frequency: 25,
            },
            {
                enemies: [mimicFrog1Data.enemyId],
                frequency: 25,
            },
        ];
    }
}
