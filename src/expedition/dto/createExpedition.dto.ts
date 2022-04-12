import { ExpeditionCurrentNodeInterface } from 'src/interfaces/expeditionCurrentNode.interface';
import { ExpeditionMapInterface } from 'src/interfaces/expeditionMap.interface';
import { ExpeditionPlayerStateInterface } from 'src/interfaces/expeditionPlayerState.interface';

export class CreateExpeditionDto {
    readonly player_id: string;
    readonly map?: ExpeditionMapInterface[];
    readonly player_state: ExpeditionPlayerStateInterface;
    readonly current_state?: ExpeditionCurrentNodeInterface;
    readonly analytics?: object;
    readonly events?: object;
}
