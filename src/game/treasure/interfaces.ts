import {
    LargeChest,
    MediumChest,
    SmallChest,
    TrappedType,
} from './treasure.enum';

export interface TreasureInterface {
    name: LargeChest.name | MediumChest.name | SmallChest.name;
    type: LargeChest.type | MediumChest.type | SmallChest.type;
    isOpen: boolean;
    trappedType:
        | null
        | TrappedType.CurseCard
        | TrappedType.Damage
        | TrappedType.Node;
}
