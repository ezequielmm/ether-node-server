export enum ExpeditionStatusEnum {
    InProgress = 'in_progress',
    Victory = 'victory',
    Defeated = 'defeated',
    Canceled = 'canceled',
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
