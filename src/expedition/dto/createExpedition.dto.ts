import { ExpeditionStatusEnum } from 'src/enums/expeditionStatus.enum';
import { ExpeditionPlayerStateInterface } from 'src/interfaces/expeditionPlayerState.interface';

export class CreateExpeditionDto {
    readonly player_id: string;
    readonly deck?: object;
    readonly nodes?: object;
    readonly player_state?: ExpeditionPlayerStateInterface;
    readonly current_state?: object;
    readonly status?: ExpeditionStatusEnum;
    readonly trinkets?: [];
}
