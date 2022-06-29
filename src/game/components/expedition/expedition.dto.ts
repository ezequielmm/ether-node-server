import { PartialType } from '@nestjs/mapped-types';
import { Expedition } from './expedition.schema';

interface BaseDTO {
    readonly clientId?: string;
    readonly playerId?: number;
}

export type FindOneExpeditionDTO = BaseDTO;
export type playerHasAnExpeditionDTO = BaseDTO;
export class CreateExpeditionDTO extends Expedition implements BaseDTO {}
export class UpdateExpeditionDTO extends PartialType(CreateExpeditionDTO) {}
export type UpdateClientIdDTO = BaseDTO;
export type GetExpeditionMapDTO = BaseDTO;
export type GetDeckCardsDTO = BaseDTO;

export interface GetExpeditionMapNodeDTO extends BaseDTO {
    nodeId: number;
}

export interface SetCombatTurnDTO extends BaseDTO {
    newRound: number;
}
