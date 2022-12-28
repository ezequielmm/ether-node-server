import { ancientOneData } from 'src/game/components/enemy/data/ancientOne.enemy';
import { queenOrchidData } from 'src/game/components/enemy/data/queenOrchid.enemy';
import { thornWolfData } from 'src/game/components/enemy/data/thornWolf.enemy';
import { EnemyNodeDataFiller } from '../../enemy-node-data-filler';

export class EliteEnemiesFiller extends EnemyNodeDataFiller {
    getEnemies() {
        return [
            {
                enemies: [thornWolfData.enemyId],
                frequency: 33.3,
            },
            {
                enemies: [queenOrchidData.enemyId],
                frequency: 33.3,
            },
            {
                enemies: [ancientOneData.enemyId],
                frequency: 33.3,
            },
        ];
    }
}
