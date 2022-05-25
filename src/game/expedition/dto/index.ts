import {
    IExpeditionNode,
    IExpeditionCurrentNode,
    // IExpeditionMap,
    IExpeditionPlayerState,
} from '../interfaces';
import { ExpeditionStatusEnum } from '../enums';
import { CardDestinationEnum } from 'src/game/effects/enums';

export class CreateExpeditionDTO {
    readonly player_id: string;
    readonly map: IExpeditionNode[];
    // readonly map: IExpeditionMap[];
    readonly player_state: IExpeditionPlayerState;
}

export class UpdateSocketClientDTO {
    readonly player_id: string;
    readonly client_id: string;
}

export class GetExpeditionDTO {
    readonly _id?: string;
    readonly player_id?: string;
    readonly client_id?: string;
    readonly status?: ExpeditionStatusEnum;
}

export class UpdateExpeditionFilterDTO {
    readonly player_id?: string;
    readonly client_id?: string;
    readonly status: ExpeditionStatusEnum;
}

export class UpdateExpeditionDTO {
    readonly map?: IExpeditionNode[];
    // readonly map?: IExpeditionMap[];
    readonly player_state?: IExpeditionPlayerState;
    readonly current_node?: IExpeditionCurrentNode;
    readonly status?: ExpeditionStatusEnum;
}

export class CardExistsDTO {
    readonly client_id: string;
    readonly card_id: string;
}

export class UpdatePlayerEnergyDTO {
    readonly client_id: string;
    readonly energy: number;
}

export class TakeCardFromDrawPileDTO {
    readonly client_id: string;
    readonly cards_to_take?: number;
}

export class AddCardToPileDTO {
    readonly client_id: string;
    readonly card_id: string;
    readonly destination: CardDestinationEnum;
}
