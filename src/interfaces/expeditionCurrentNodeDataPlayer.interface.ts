import { ExpeditionCurrentNodeDataPlayerStatusEnum } from 'src/enums/expeditionCurrentNodeDataPlayerStatus.enum';
import { ExpeditionPlayerStateDeckCardInterface } from './expeditionPlayerStateDeckCard.interface';

export interface ExpeditionCurrentNodeDataPlayerInterface {
    energy?: number;
    energy_max?: number;
    hand_size?: number;
    cards?: {
        hand?: ExpeditionPlayerStateDeckCardInterface[];
        draw?: ExpeditionPlayerStateDeckCardInterface[];
        discard?: ExpeditionPlayerStateDeckCardInterface[];
        exhausted?: ExpeditionPlayerStateDeckCardInterface[];
    };
    status?: ExpeditionCurrentNodeDataPlayerStatusEnum;
}
