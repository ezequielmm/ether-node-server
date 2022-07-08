import { EnemyTypeEnum, EnemyCategoryEnum, EnemySizeEnum } from './enemy.enum';
import { Enemy } from './enemy.schema';

export const data: Enemy[] = [
    {
        enemyId: 1,
        name: 'Sporemonger',
        type: EnemyTypeEnum.Plant,
        category: EnemyCategoryEnum.Basic,
        size: EnemySizeEnum.Small,
        description:
            'Floating enemy. Camouflaged, but will flare its foliage "hair" to appear more intimidating. Mouth can spit a toxic slime at enemies.',
        healthRange: [42, 46],
    },
];
