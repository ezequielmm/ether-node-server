export enum DataWSRequestTypesEnum {
    Energy = 'Energy',
    Health = 'Health',
    Players = 'Players',
    CardsPiles = 'CardsPiles',
    Enemies = 'Enemies',
    Potions = 'Potions',
    Trinkets = 'Trinkets',
    Statuses = 'Statuses',
    EnemyIntents = 'EnemyIntents',
    PlayerDeck = 'PlayerDeck',
    CurrentNode = 'CurrentNode',
    UpgradableCards = 'UpgradableCards',
}

export const corsSocketSettings = {
    cors: {
        origin: '*',
    },
};
