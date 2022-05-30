import { EnemyCategoryEnum, EnemySizeEnum, EnemyTypeEnum } from '../enums';

export interface IEnemyData {
    name: string;
    act: number;
    type: EnemyTypeEnum;
    class: EnemyCategoryEnum;
    size: EnemySizeEnum;
    description: string;
    hpMin: number;
    hpMax: number;
    attackMin: number;
    attackMax: number;
}
