export interface SquiresRewardsResponse {
    success: boolean;
    message: string | null;
    rewards: SquiresRewardResponse[] | null;
}

export interface SquiresRewardResponse {
    name: string;
    image: string;
}