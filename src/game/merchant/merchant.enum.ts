export enum ItemsTypeEnum {
    Card = 'card',
    Trinket = 'trinket',
    Potion = 'potion',
    Destroy = 'remove',
    Upgrade = 'upgrade',
}

export enum CardCommon {
    name = 'common',
    minPrice = 45,
    maxPrice = 55,
}

export enum CardUncommon {
    name = 'uncommon',
    minPrice = 68,
    maxPrice = 82,
}

export enum CardRare {
    name = 'rare',
    minPrice = 135,
    maxPrice = 165,
}

export enum PotionCommon {
    name = 'common',
    minPrice = 48,
    maxPrice = 52,
}

export enum PotionUncommon {
    name = 'uncommon',
    minPrice = 72,
    maxPrice = 78,
}

export enum PotionRare {
    name = 'rare',
    minPrice = 95,
    maxPrice = 105,
}

export enum TrinketCommon {
    name = 'common',
    minPrice = 143,
    maxPrice = 157,
}

export enum TrinketUncommon {
    name = 'uncommon',
    minPrice = 238,
    maxPrice = 262,
}

export enum TrinketRare {
    name = 'rare',
    minPrice = 285,
    maxPrice = 315,
}

export enum PurchaseFailureEnum {
    NoEnoughGold = 'Not enough gold',
    InvalidId = 'Invalid id',
    MaxPotionReached = 'You cannot carry any more potions. Discard or use one to buy a potion.',
    CardAlreadyUpgraded = 'This card is already upgraded',
    CardCantBeUpgraded = 'This card cannot be upgraded',
}
