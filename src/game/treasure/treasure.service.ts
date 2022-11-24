import { Injectable } from '@nestjs/common';
import { getRandomBetween } from 'src/utils';
import { TreasureInterface } from './interfaces';
import { LargeChest, MediumChest, SmallChest } from './treasure.enum';

@Injectable()
export class TreasureService {
    generateTreasure(): TreasureInterface {
        const chance: number = getRandomBetween(1, 100);

        if (chance <= LargeChest.chance) {
            return {
                name: LargeChest.name,
                size: LargeChest.size,
                isOpen: false,
            };
        } else if (
            chance > LargeChest.chance &&
            chance <= MediumChest.chance + LargeChest.chance
        ) {
            return {
                name: MediumChest.name,
                size: MediumChest.size,
                isOpen: false,
            };
        } else {
            return {
                name: SmallChest.name,
                size: SmallChest.size,
                isOpen: false,
            };
        }
    }
}
