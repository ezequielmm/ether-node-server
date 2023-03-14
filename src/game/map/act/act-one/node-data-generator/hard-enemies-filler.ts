import { barkChargerData } from 'src/game/components/enemy/data/barkCharger.enemy';
import { groundMothData } from 'src/game/components/enemy/data/groundmoth.enemy';
import { mimicFrog1Data } from 'src/game/components/enemy/data/mimicFrog1.enemy';
import { sporeMongerData } from 'src/game/components/enemy/data/sporeMonger.enemy';
import { stingFaeData } from 'src/game/components/enemy/data/stingFae.enemy';
import { swampGoblin1Data } from 'src/game/components/enemy/data/swampGoblin1.enemy';
import { swampGoblin2Data } from 'src/game/components/enemy/data/swampGoblin2.enemy';
import { trapelicanData } from 'src/game/components/enemy/data/trapelican.enemy';
import { EnemyNodeDataFiller } from '../../enemy-node-data-filler';

export class HardEnemiesFiller extends EnemyNodeDataFiller {
    getEnemies() {
        return [
            {
                enemies: [
                    mimicFrog1Data.enemyId,
                    mimicFrog1Data.enemyId,
                    sporeMongerData.enemyId,
                ],
                frequency: 12,
            },
            {
                enemies: [groundMothData.enemyId, sporeMongerData.enemyId],
                frequency: 11,
            },
            {
                enemies: [
                    barkChargerData.enemyId,
                    barkChargerData.enemyId,
                    stingFaeData.enemyId,
                    stingFaeData.enemyId,
                ],
                frequency: 11,
            },
            {
                enemies: [
                    stingFaeData.enemyId,
                    stingFaeData.enemyId,
                    swampGoblin1Data.enemyId,
                    swampGoblin2Data.enemyId,
                ],
                frequency: 10,
            },
            {
                enemies: [
                    swampGoblin1Data.enemyId,
                    swampGoblin2Data.enemyId,
                    swampGoblin1Data.enemyId,
                    swampGoblin2Data.enemyId,
                ],
                frequency: 10,
            },
            {
                enemies: [
                    sporeMongerData.enemyId,
                    sporeMongerData.enemyId,
                    trapelicanData.enemyId,
                ],
                frequency: 10,
            },
            {
                enemies: [
                    trapelicanData.enemyId,
                    trapelicanData.enemyId,
                    mimicFrog1Data.enemyId,
                ],
                frequency: 10,
            },
            {
                enemies: [
                    barkChargerData.enemyId,
                    barkChargerData.enemyId,
                    swampGoblin2Data.enemyId,
                ],
                frequency: 9,
            },
            {
                enemies: [
                    stingFaeData.enemyId,
                    stingFaeData.enemyId,
                    stingFaeData.enemyId,
                    stingFaeData.enemyId,
                    stingFaeData.enemyId,
                ],
                frequency: 9,
            },
            {
                enemies: [groundMothData.enemyId, groundMothData.enemyId],
                frequency: 8,
            },
        ];
    }
}
