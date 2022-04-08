import { ExpeditionStatusEnum } from 'src/enums/expeditionStatus.enum';
import { ExpeditionCurrentNodeInterface } from 'src/interfaces/expeditionCurrentNode.interface';
import { ExpeditionPlayerStateInterface } from 'src/interfaces/ExpeditionPlayerState.interface';

export class UpdateExpeditionDto {
    readonly deck?: object;
    readonly map?: object;
    readonly player_state?: ExpeditionPlayerStateInterface;
    readonly current_node?: ExpeditionCurrentNodeInterface;
    readonly trinkets?: [];
    readonly status?: ExpeditionStatusEnum;
}
