export enum CardRarityEnum {
    Starter = 'starter',
    Commom = 'common',
    Uncommon = 'uncommon',
    Rare = 'rare',
    Legendary = 'legendary',
    Special = 'special',
}

export enum CardTypeEnum {
    Attack = 'attack',
    Defend = 'defend',
    Skill = 'skill',
    Power = 'power',
    Status = 'status',
    Curse = 'curse',
}

export enum CardClassEnum {
    Knight = 'knight',
}

export enum CardTargetedEnum {
    Enemy = 'enemy',
    Player = 'player',
    None = 'none',
}

export enum CardKeywordEnum {
    Exhaust = 'exhaust',
    Innate = 'innate',
    Fade = 'fade',
    Retain = 'retain',
    Unplayable = 'unplayable',
    None = 'none',
}

export enum CardEnergyEnum {
    All = -1,
    None = 0,
}

export enum CardPlayErrorMessages {
    NoEnergyLeft = 'Not enough energy left',
}
