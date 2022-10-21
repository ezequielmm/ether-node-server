import { LargeChest, MediumChest, SmallChest } from './treasure.enum';

export interface TreasureInterface {
    name: LargeChest.name | MediumChest.name | SmallChest.name;
    type: LargeChest.type | MediumChest.type | SmallChest.type;
    isOpen: boolean;
}
