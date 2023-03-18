import { barkChargerData } from 'src/game/components/enemy/data/barkCharger.enemy';
import { groundMothData } from 'src/game/components/enemy/data/groundmoth.enemy';
import { mimicFrog1Data } from 'src/game/components/enemy/data/mimicFrog1.enemy';
import { sporeMongerData } from 'src/game/components/enemy/data/sporeMonger.enemy';
import { stingFaeData } from 'src/game/components/enemy/data/stingFae.enemy';
import { swampGoblin1Data } from 'src/game/components/enemy/data/swampGoblin1.enemy';
import { swampGoblin2Data } from 'src/game/components/enemy/data/swampGoblin2.enemy';
import { EnemyNodeDataFiller } from '../../enemy-node-data-filler';

export class EasyEnemiesFiller extends EnemyNodeDataFiller {
    getEnemies() {
        return [
            {
                enemies: [mimicFrog1Data.enemyId, mimicFrog1Data.enemyId], // TODO: Mimic Frog 2
                frequency: 12,
            },
            {
                enemies: [groundMothData.enemyId],
                frequency: 11,
            },
            {
                enemies: [
                    stingFaeData.enemyId,
                    stingFaeData.enemyId,
                    swampGoblin1Data.enemyId,
                ],
                frequency: 11,
            },
            {
                enemies: [
                    barkChargerData.enemyId,
                    barkChargerData.enemyId,
                    barkChargerData.enemyId,
                ],
                frequency: 10,
            },
            {
                enemies: [
                    swampGoblin2Data.enemyId,
                    swampGoblin2Data.enemyId,
                    swampGoblin1Data.enemyId,
                ],
                frequency: 10,
            },
            {
                enemies: [sporeMongerData.enemyId],
                frequency: 10,
            },
            {
                enemies: [mimicFrog1Data.enemyId],
                frequency: 10,
            },
            {
                enemies: [barkChargerData.enemyId, swampGoblin2Data.enemyId],
                frequency: 9,
            },
            {
                enemies: [
                    stingFaeData.enemyId,
                    stingFaeData.enemyId,
                    stingFaeData.enemyId,
                    stingFaeData.enemyId,
                ],
                frequency: 9,
            },
            {
                enemies: [
                    stingFaeData.enemyId,
                    groundMothData.enemyId,
                    stingFaeData.enemyId,
                ],
                frequency: 8,
            },
        ];
    }
}
