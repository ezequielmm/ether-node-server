import {
    IExpeditionNode,
    IExpeditionCurrentNode,
    IExpeditionPlayerState,
} from '../interfaces';
import { ExpeditionStatusEnum } from '../enums';
import { CardDestinationEnum } from 'src/game/effects/enums';

export class CreateExpeditionDTO {
    readonly player_id: number;
    readonly map: IExpeditionNode[];
    readonly player_state: IExpeditionPlayerState;
}

export class UpdateSocketClientDTO {
    readonly player_id: number;
    readonly client_id: string;
}

export class GetExpeditionDTO {
    readonly _id?: string;
    readonly player_id?: number;
    readonly client_id?: string;
    readonly status?: ExpeditionStatusEnum;
}

export class UpdateExpeditionFilterDTO {
    readonly player_id?: number;
    readonly client_id?: string;
    readonly status: ExpeditionStatusEnum;
}

export class UpdateExpeditionDTO {
    readonly map?: IExpeditionNode[];
    readonly player_state?: IExpeditionPlayerState;
    readonly current_node?: IExpeditionCurrentNode;
    readonly status?: ExpeditionStatusEnum;
}

export class CardExistsDTO {
    readonly client_id: string;
    readonly card_id: string | number;
}

export class enemyExistsDTO {
    readonly client_id: string;
}

export class GetPlayerHandDTO {
    readonly client_id: string;
    readonly card_id: string | number;
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
    readonly is_temporary: boolean;
}

export class ModifyHPMaxDTO {
    readonly client_id: string;
    readonly hp_value: number;
}

export class TurnChangeDTO {
    readonly client_id: string;
}

export class SetPlayerDefense {
    readonly client_id: string;
    readonly value: number;
}

export class GetPlayerState {
    readonly client_id: string;
}

export class UpdatePlayerHpDTO {
    readonly client_id: string;
    readonly hp: number;
}

export class GetCombatEnemiesDTO {
    readonly client_id: string;
}

export class CheckIfEnemyExistsDTO {
    readonly client_id: string;
    readonly enemy_id: string | number;
}
