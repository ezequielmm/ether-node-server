export enum EffectName {
    Damage = 'damage',
    Defense = 'defense',
    Energy = 'energy',
    DrawCard = 'drawCard',
    AddCard = 'addCard',
    ModifyHPMax = 'modifyHPMax',
    Heal = 'heal',
    RemoveDefense = 'RemoveDefense',
    DoubleBurn = "doubleBurn",
    Burn = "burn"
}

export enum EffectOwner {
    Player = 'player',
    Enemy = 'enemy',
}

export enum AddCardPosition {
    Top = 'top',
    Bottom = 'bottom',
    Random = 'random',
}
