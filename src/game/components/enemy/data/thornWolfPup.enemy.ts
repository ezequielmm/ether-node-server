import { EnemyCategoryEnum, EnemySizeEnum, EnemyTypeEnum } from '../enemy.enum';
import { Enemy } from '../enemy.schema';

export const thornWolfPupData: Enemy = {
    enemyId: 17,
    name: 'ThornWolfPup',
    type: EnemyTypeEnum.Plant,
    category: EnemyCategoryEnum.Minion,
    size: EnemySizeEnum.Medium,
    description: 'Minion creature to ThornWolf',
    healthRange: [30, 35],
    scripts: [
        {
            // we need a summoned status
            id: 0,
            intentions: [],
            next: [],
        },
    ],
};
