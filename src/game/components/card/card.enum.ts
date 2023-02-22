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
    Exhaust = 'exhaust', //	Can be played once, then removed until the end of combat
    Innate = 'innate', // Always drawn in the first hand per combat
    Fade = 'fade', // Automatically exhausted if in hand at end of turn
    Retain = 'retain', // Not discarded if in hand at end of turn
    Unplayable = 'unplayable', // Cannot be played
    None = 'none', // The card will be moved to the Discard Pile (default value)
    EndTurn = 'endTurn', // Ends the turn when played
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
