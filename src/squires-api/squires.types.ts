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
    Fragment = 'fragment'
}

export enum MixedRewardType {
    Lootbox = 'Lootbox',
    Reward = 'Reward',
}


export interface MixedRewards {
    rewardType: MixedRewardType; 
    
    name: string;
    image?: string;


}

