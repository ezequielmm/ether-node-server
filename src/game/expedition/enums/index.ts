export enum ExpeditionStatusEnum {
    InProgress = 'in_progress',
    Victory = 'victory',
    Defeated = 'defeated',
    Canceled = 'canceled',
}

export enum ExpeditionMapNodeTypeEnum {
    Combat = 'combat',
    Portal = 'portal',
}

export enum ExpeditionCurrentNodeDataPlayerStatusEnum {
    Idle = 'idle',
    Injured = 'injured',
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
