import { ExpeditionStatusEnum } from 'src/enums/expeditionStatus.enum';
import { ExpeditionCurrentNodeInterface } from 'src/interfaces/expeditionCurrentNode.interface';
import { ExpeditionMapInterface } from 'src/interfaces/expeditionMap.interface';
import { ExpeditionPlayerStateInterface } from 'src/interfaces/expeditionPlayerState.interface';

export class UpdateExpeditionDTO {
    readonly client_id?: string;
    readonly map?: ExpeditionMapInterface[];
    readonly player_state?: ExpeditionPlayerStateInterface;
    readonly current_node?: ExpeditionCurrentNodeInterface;
    readonly status?: ExpeditionStatusEnum;
}
