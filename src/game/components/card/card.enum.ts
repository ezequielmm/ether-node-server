export enum CardRarityEnum {
    Starter = 'starter',
    Common = 'common',
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
    RandomEnemy = 'random_enemy',
    AllEnemies = 'all_enemies',
    Player = 'player',
    Self = 'self',
    None = 'none',
}

export enum CardKeywordEnum {
    Exhaust = 'exhaust',
    Innate = 'innate',
    Fade = 'fade',
    Retain = 'retain',
    Unplayable = 'unplayable',
    None = 'none',
    EndTurn = 'endTurn',
}

export enum CardEnergyEnum {
    All = -1,
    None = 0,
}

export enum CardPlayErrorMessages {
    NoEnergyLeft = 'Not enough energy left',
    UnplayableCard = 'This card is unplayable',
    InvalidCard = 'This card is invalid',
}

export enum CardDestinationEnum {
    Hand = 'hand',
    Discard = 'discard',
    DrawRandom = 'drawRandom',
    DrawTop = 'drawTop',
}
