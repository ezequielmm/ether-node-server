import { Socket } from 'socket.io';
import { CardTargetedEnum } from '../components/card/card.enum';
import {
    IExpeditionCurrentNodeDataEnemy,
    IExpeditionPlayerCombatState,
    IExpeditionPlayerGlobalState,
} from '../components/expedition/expedition.interface';

export interface Effect {
    name: string;
}

export interface EffectMetadata {
    effect: Effect;
}

export interface EffectDTOPlayer {
    type: CardTargetedEnum.Player;
    value: {
        globalState: IExpeditionPlayerGlobalState;
        combatState: IExpeditionPlayerCombatState;
    };
}

export interface EffectDTOEnemy {
    type: CardTargetedEnum.Enemy;
    value: IExpeditionCurrentNodeDataEnemy;
}

export interface EffectDTOAllEnemies {
    type: CardTargetedEnum.AllEnemies;
    value: IExpeditionCurrentNodeDataEnemy[];
}

export interface EffectDTORandomEnemy {
    type: CardTargetedEnum.RandomEnemy;
    value: IExpeditionCurrentNodeDataEnemy;
}

export type Entity =
    | EffectDTOPlayer
    | EffectDTOEnemy
    | EffectDTORandomEnemy
    | EffectDTOAllEnemies;

export interface EffectDTO<
    Args extends Record<string, any> = Record<string, any>,
> {
    readonly client: Socket;
    readonly source: Entity;
    readonly target: Entity;
    args: {
        readonly initialValue: number;
        currentValue: number;
    } & Args;
}

export interface JsonEffect {
    effect: Effect['name'];
    target: CardTargetedEnum;
    times?: number;
    args: {
        value: number;
        // currentValue: number;
        // targeted: CardTargetedEnum;
        // times: number;
        // useDefense?: boolean;
        // useEnemies?: boolean;
        // multiplier?: number;
    } & Record<string, any>;
}

export interface IBaseEffect {
    handle(dto: EffectDTO): Promise<void>;
}

export interface EffectAvailableTargets {
    player: EffectDTOPlayer;
    randomEnemy: EffectDTORandomEnemy;
    selectedEnemy?: EffectDTOEnemy;
    allEnemies: EffectDTOAllEnemies;
}
