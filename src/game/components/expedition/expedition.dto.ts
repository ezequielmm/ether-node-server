import { Expedition } from './expedition.schema';

interface BaseDTO {
    readonly clientId?: string;
    readonly playerId?: number;
}

export type FindOneExpeditionDTO = BaseDTO;
export type playerHasAnExpeditionDTO = BaseDTO;

export type CreateExpeditionDTO = Expedition;
