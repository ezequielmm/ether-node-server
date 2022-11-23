export enum SmallChest {
    name = 'Small Chest',
    chance = 50,
    type = 'small',
    coinChance = 50,
    maxCoin = 27,
    minCoin = 23,
    trinketChanceUncommon = 25,
    trinketChanceRare = 0,
    trinketChanceCommon = 75,
    potionChance = 5,
    trappedChance = 10,
    trappedType = 'damage',
    trappedValue = 5,
    trappedText = 'A bladed trap slices your hand for 5 Damage',
}

export enum MediumChest {
    name = 'Medium Chest',
    chance = 33,
    type = 'medium',
    coinChance = 50,
    maxCoin = 82,
    minCoin = 68,
    trinketChanceUncommon = 75,
    trinketChanceRare = 25,
    trinketChanceCommon = 0,
    potionChance = 15,
    trappedChance = 10,
    trappedType = 'card',
    trappedValue = 1,
    trappedText = 'An ancient curse falls upon you',
}

export enum LargeChest {
    name = 'Large Chest',
    chance = 17,
    type = 'large',
    coinChance = 33,
    maxCoin = 55,
    minCoin = 45,
    trinketChanceUncommon = 50,
    trinketChanceRare = 15,
    trinketChanceCommon = 35,
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
