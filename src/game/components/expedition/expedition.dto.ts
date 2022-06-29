import { PartialType } from '@nestjs/mapped-types';
import { CardId } from '../card/card.type';
import {
    IExpeditionCurrentNodeDataEnemy,
    IExpeditionPlayerStateDeckCard,
} from './expedition.interface';
import { Expedition } from './expedition.schema';
import { ClientId } from './expedition.type';

interface BaseDTO {
    readonly clientId?: ClientId;
}

export type FindOneExpeditionDTO = BaseDTO;
export type playerHasAnExpeditionDTO = BaseDTO;
export class CreateExpeditionDTO extends Expedition implements BaseDTO {}
export class UpdateExpeditionDTO extends PartialType(CreateExpeditionDTO) {}
export class UpdateClientIdDTO {
    readonly clientId: string;
    readonly playerId: number;
}
export type GetExpeditionMapDTO = BaseDTO;
export type GetDeckCardsDTO = BaseDTO;
export type GetCurrentNodeDTO = BaseDTO;

export interface GetExpeditionMapNodeDTO extends BaseDTO {
    nodeId: number;
}

export interface SetCombatTurnDTO extends BaseDTO {
    newRound: number;
}

export interface CardExistsOnPlayerHandDTO extends BaseDTO {
    cardId: CardId;
}

export interface UpdatePlayerEnergyDTO extends BaseDTO {
    newEnergy: number;
}

export interface UpdateEnemiesArrayDTO extends BaseDTO {
    enemies: IExpeditionCurrentNodeDataEnemy[];
}

export interface UpdateHandPilesDTO extends BaseDTO {
    hand?: IExpeditionPlayerStateDeckCard[];
    discard?: IExpeditionPlayerStateDeckCard[];
    exhausted?: IExpeditionPlayerStateDeckCard[];
    draw?: IExpeditionPlayerStateDeckCard[];
}
