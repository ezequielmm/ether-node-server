import { IExpeditionMap, IExpeditionPlayerState } from '../interfaces';

export class CreateExpeditionDTO {
    readonly player_id: string;
    readonly map: IExpeditionMap[];
    readonly player_state: IExpeditionPlayerState;
}
