import { ExpeditionStatusEnum } from 'src/enums/expeditionStatus.enum';
import { PlayerStateInterface } from 'src/interfaces/playerState.interface';

export class CreateExpeditionDto {
    readonly player_id: string;
    readonly deck?: object;
    readonly nodes?: object;
    readonly player_state?: PlayerStateInterface;
    readonly current_state?: object;
    readonly status?: ExpeditionStatusEnum;
    readonly trinkets?: [];
}
