import { CardRarityEnum, CardTypeEnum } from '../components/card/card.enum';
import {
    LargeChest,
    MediumChest,
    RewardType,
    SmallChest,
} from './treasure.enum';

export interface TreasureInterface {
    name: LargeChest.name | MediumChest.name | SmallChest.name;
    type: LargeChest.type | MediumChest.type | SmallChest.type;
    isOpen: boolean;
    trappedType:
        | null
        | LargeChest.trappedType
        | MediumChest.trappedType
        | SmallChest.trappedType;
}

export interface BaseReward {
    id: string;
    type: RewardType;
    taken: boolean;
}

export interface GoldReward extends BaseReward {
    type: RewardType.Gold;
    amount: number;
}

export interface PotionReward extends BaseReward {
    type: RewardType.Potion;
    potion: {
        potionId: number;
        name: string;
        description: string;
    };
}
export interface TrinketReward extends BaseReward {
    type: RewardType.Trinket;
    trinket: {
        trinketId: number;
        name: string;
        description: string;
    };
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

export type TreasureReward = GoldReward | PotionReward | TrinketReward;

export interface TreasureRewardData {
    isOpen: boolean;
    rewards: TreasureReward[];
    trapped: Trapped;
}
