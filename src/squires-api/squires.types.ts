import { GearCategoryEnum, GearRarityEnum, GearTraitEnum } from "src/game/components/gear/gear.enum";

export interface SquiresRewardsResponse {
    success: boolean;
    message: string | null;
    rewards: SquiresRewardResponse[] | null;
}

export interface SquiresRewardResponse {
    name: string;
    image: string;
    type: RewardType;
}

export enum RewardType {
    Potion = 'potion',
    Trinket = 'trinket',
    Fragment = 'fragment',
    Partner = 'partner'
}

export enum MixedRewardType {
    Lootbox = 'Lootbox',
    Reward = 'Reward',
}


export interface VictoryItem {
    rewardType: MixedRewardType; 
    
    name: string;
    image?: string;

    gearId?: number;
    trait?: GearTraitEnum;
    category?: GearCategoryEnum;
    rarity?: GearRarityEnum;
    isActive?: boolean;
    onlyOneAllowed?: boolean;
}

