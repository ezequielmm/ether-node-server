import { ExpeditionCurrentNodeInterface } from 'src/interfaces/expeditionCurrentNode.interface';
import { ExpeditionMapInterface } from 'src/interfaces/expeditionMap.interface';
import { ExpeditionPlayerStateInterface } from 'src/interfaces/expeditionPlayerState.interface';

export class CreateExpeditionDTO {
    readonly client_id?: string;
    readonly player_id?: string;
    readonly map?: ExpeditionMapInterface[];
    readonly player_state?: ExpeditionPlayerStateInterface;
    readonly current_state?: ExpeditionCurrentNodeInterface;
}
