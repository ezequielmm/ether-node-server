import { CardRarityEnum, CardTypeEnum } from '../components/card/card.enum';
import { Reward } from '../components/expedition/expedition.interface';
import { LargeChest, MediumChest, SmallChest } from './treasure.enum';

export interface TreasureInterface {
    name: LargeChest.name | MediumChest.name | SmallChest.name;
    type: LargeChest.type | MediumChest.type | SmallChest.type;
    trappedType:
        | null
        | LargeChest.trappedType
        | MediumChest.trappedType
        | SmallChest.trappedType;
}

export interface Trapped {
    trappedType:
        | null
        | MediumChest.trappedType
        | SmallChest.trappedType
        | LargeChest.trappedType;

    damage: number;
    trappedText:
        | null
        | MediumChest.trappedText
        | SmallChest.trappedText
        | LargeChest.trappedText;
    curse_card: null | {
        cardId: number;
        name: string;
        description: string;
        energy: number;
        rarity: CardRarityEnum;
        cardType: CardTypeEnum;
        pool: string;
    };
    monster_type: null;
}

export interface TreasureRewardData {
    rewards: Reward[];
    trapped: Trapped;
}
