import { DeepPartial } from 'src/utils';
import { CardId } from '../card/card.type';
import { GameContext } from '../interfaces';
import { CombatTurnEnum } from './expedition.enum';
import {
    IExpeditionCurrentNodeDataEnemy,
    IExpeditionPlayerStateDeckCard,
} from './expedition.interface';
import { Expedition } from './expedition.schema';

interface BaseDTO {
    clientId?: string;
}

export type FindOneExpeditionDTO = BaseDTO;
export type playerHasAnExpeditionDTO = BaseDTO;
export class CreateExpeditionDTO extends Expedition implements BaseDTO {}
export type UpdateExpeditionDTO = DeepPartial<CreateExpeditionDTO>;
export class UpdateClientIdDTO {
    readonly clientId: string;
    readonly userAddress: string;
}
export type GetExpeditionMapDTO = BaseDTO;
export type GetDeckCardsDTO = BaseDTO;
export type GetPlayerState = BaseDTO;
export type GetCurrentNodeDTO = BaseDTO;
export type GetPlayerStateDTO = BaseDTO;

export interface GetExpeditionMapNodeDTO {
    ctx: GameContext;
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

export interface OverrideAvailableNodeDTO {
    ctx: GameContext;
    nodeId: number;
}
