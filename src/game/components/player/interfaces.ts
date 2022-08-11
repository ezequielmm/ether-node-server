import { CardTargetedEnum } from '../card/card.enum';
import {
    IExpeditionPlayerCombatState,
    IExpeditionPlayerGlobalState,
} from '../expedition/expedition.interface';

export interface ExpeditionPlayer {
    readonly type: CardTargetedEnum.Player;
    value: {
        globalState: IExpeditionPlayerGlobalState;
        combatState: IExpeditionPlayerCombatState;
    };
}
