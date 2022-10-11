import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum } from '../enemy.enum';
import { Enemy } from '../enemy.schema';

export const fungalBruteData: Enemy = {
    enemyId: 7,
    name: 'FungalBrute',
    type: EnemyTypeEnum.Plant,
    category: EnemyCategoryEnum.Boss,
    size: EnemySizeEnum.Giant,
    description:
        'Massive, stomping fungal organism that stomps the ground, causing an area of damage where the ground shakes around him. Additionally, he can send large toxic spores flying around him and the knights have to dodge them or prepare to be paralyzed and stomped on.',
    healthRange: [140, 140],
    scripts: [],
};
