import { Enemy } from './enemy.schema';
import { sporeMongerData } from './data/sporeMonger.enemy';
import { groundMothData } from './data/groundmoth.enemy';
import { swampGoblin1Data } from './data/swampGoblin1.enemy';
import { swampGoblin2Data } from './data/swampGoblin2.enemy';

export const data: Enemy[] = [
    sporeMongerData,
    groundMothData,
    swampGoblin1Data,
    swampGoblin2Data,
];
