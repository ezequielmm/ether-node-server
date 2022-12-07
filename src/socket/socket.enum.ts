import { GatewayMetadata } from '@nestjs/websockets';

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
    MerchantData = 'MerchantData',
    TreasureData = 'TreasureData',
    Rewards = 'Rewards',
    EncounterData = 'EncounterData',
}

export const corsSocketSettings: GatewayMetadata = {
    cors: {
        origin: '*',
    },
};
