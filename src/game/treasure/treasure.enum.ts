export enum SmallChest {
    name = 'Small Chest',
    chance = 50,
    size = 'small',
    coinChance = 50,
    maxCoin = 27,
    minCoin = 23,
    potionChance = 5,
    trappedChance = 10,
    trappedType = 'damage',
    trappedValue = 5,
    trappedText = 'A bladed trap slices your hand for 5 Damage',
}

export enum MediumChest {
    name = 'Medium Chest',
    chance = 33,
    size = 'medium',
    coinChance = 50,
    maxCoin = 82,
    minCoin = 68,
    potionChance = 15,
    trappedChance = 10,
    trappedType = 'curse_card',
    trappedValue = 1,
    trappedText = 'An ancient curse falls upon you',
}

export enum LargeChest {
    name = 'Large Chest',
    chance = 17,
    size = 'large',
    coinChance = 33,
    maxCoin = 55,
    minCoin = 45,
    potionChance = 10,
    trappedChance = 10,
    trappedType = 'combat_encounter',
    trappedValue = 1,
    trappedText = 'The chest suddenly sprouts limbs and teeth, and scrambles towards you',
}

export enum RewardType {
    Gold = 'gold',
    Potion = 'potion',
    Trinket = 'trinket',
}
