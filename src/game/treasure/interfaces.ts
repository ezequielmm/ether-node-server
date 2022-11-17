import { CardRarityEnum, CardTypeEnum } from '../components/card/card.enum';
import {
    LargeChest,
    MediumChest,
    RewardType,
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

export interface BaseReward {
    id: string;
    type: RewardType;
    taken: boolean;
}

export interface GoldReward extends BaseReward {
    type: RewardType.Gold;
    amount: number;
}

export interface CombatReward extends BaseReward {
    type: RewardType.Combat;
    description: LargeChest.trappedText;
}

export interface DamageReward extends BaseReward {
    type: RewardType.Damage;
    description: SmallChest.trappedText;
    damage: SmallChest.trappedValue;
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

export interface CardReward extends BaseReward {
    type: RewardType.Card;
    description: MediumChest.trappedText;
    card: {
        cardId: number;
        name: string;
        description: string;
        energy: number;
        rarity: CardRarityEnum;
        cardType: CardTypeEnum;
        pool: string;
    };
}

export type TreasureReward =
    | GoldReward
    | PotionReward
    | CardReward
    | TrinketReward
    | CombatReward
    | DamageReward;

export interface TreasureRewardData {
    isOpen: boolean;
    rewards: TreasureReward[];
}
