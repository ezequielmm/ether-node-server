import { IExpeditionMap, IExpeditionPlayerState } from '../interfaces';

export class CreateExpeditionDTO {
    readonly player_id: string;
    readonly map: IExpeditionMap[];
    readonly player_state: IExpeditionPlayerState;
}

export class UpdateSocketClientDTO {
    readonly player_id: string;
    readonly client_id: string;
}
