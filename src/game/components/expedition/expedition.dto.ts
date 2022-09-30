import { PartialType } from '@nestjs/mapped-types';
import { CardId } from '../card/card.type';
import { CombatTurnEnum } from './expedition.enum';
import {
    IExpeditionCurrentNodeDataEnemy,
    IExpeditionPlayerStateDeckCard,
} from './expedition.interface';
import { Expedition } from './expedition.schema';
import { ClientId } from './expedition.type';

interface BaseDTO {
    clientId?: ClientId;
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
export type GetPlayerState = BaseDTO;
export type GetCurrentNodeDTO = BaseDTO;
export type GetPlayerStateDTO = BaseDTO;

export interface GetExpeditionMapNodeDTO extends BaseDTO {
    nodeId: number;
}

export interface SetCombatTurnDTO extends BaseDTO {
    newRound?: number;
    playing: CombatTurnEnum;
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

export interface UpdatePlayerDeckDTO extends BaseDTO {
    deck: IExpeditionPlayerStateDeckCard[];
}
