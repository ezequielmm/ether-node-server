export enum ExpeditionStatusEnum {
    InProgress = 'in_progress',
    Victory = 'victory',
    Defeated = 'defeated',
    Canceled = 'canceled',
}

export enum ExpeditionMapNodeStatusEnum {
    Active = 'active',
    Disabled = 'disabled',
    Completed = 'completed',
    Available = 'available',
}

export enum ExpeditionMapNodeTypeEnum {
    Combat = 'combat',
    CombatBoss = 'combat_boss',
    CombatElite = 'combat_elite',
    CombatStandard = 'combat_standard',
    Camp = 'camp',
    CampHouse = 'camp_house',
    CampRegular = 'camp_regular',
    Portal = 'portal',
    Encounter = 'encounter',
    Merchant = 'merchant',
    RoyalHouse = 'royal_house',
    RoyalHouseA = 'royal_house_a',
    RoyalHouseB = 'royal_house_b',
    RoyalHouseC = 'royal_house_c',
    RoyalHouseD = 'royal_house_d',
    Empty = 'empty',
    Event = 'event',
    Treasure = 'treasure',
}

export enum NodeTypeEnum {
    Combat = 'combat',
    CombatBoss = 'combat_boss',
    CombatElite = 'combat_elite',
    CombatStandard = 'combat_standard',
    Camp = 'camp',
    CampHouse = 'camp_house',
    CampRegular = 'camp_regular',
    Encounter = 'encounter',
    Merchant = 'merchant',
}

export enum CardDestinationEnum {
    Hand = 'hand',
    Discard = 'discard',
    DrawRandom = 'drawRandom',
    DrawTop = 'drawTop',
}

export enum EnemyGroupTypeEnum {
    standard = 'Standard',
    elite = 'Elite',
    Boss = 'Boss',
}

export enum CombatTurnEnum {
    Player = 'player',
    Enemy = 'enemy',
}

export enum IExpeditionNodeReward {
    Gold = 'gold',
    Card = 'card',
    Potion = 'potion',
    Trinket = 'trinket',
}
export enum RoyalHouseTitles {
    Cynthienne = 'House Cynthienne',
    Medici = 'House Medici',
    Brightflame = 'House Brightflame',
    Rhunn = 'House Rhunn',
}