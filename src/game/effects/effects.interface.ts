import { Socket } from 'socket.io';
import { CardTargetedEnum } from '../components/card/card.enum';
import {
    EntityDTO,
    AllEnemiesDTO,
    EnemyDTO,
    PlayerDTO,
    RandomEnemyDTO,
    SourceEntityDTO,
    TargetEntityDTO,
} from '../components/expedition/expedition.interface';

export interface Effect {
    name: string;
}

export interface EffectMetadata {
    effect: Effect;
}

export interface EffectDTO<
    Args extends Record<string, any> = Record<string, any>,
> {
    readonly client: Socket;
    readonly source: SourceEntityDTO;
    readonly target: TargetEntityDTO;
    args: {
        readonly initialValue: number;
        currentValue: number;
    } & Args;
}

export interface JsonEffect {
    effect: Effect['name'];
    target?: CardTargetedEnum;
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

export interface ProccessEffectCollectionDTO {
    client: Socket;
    source: EntityDTO;
    availableTargets: {
        player: PlayerDTO;
        randomEnemy?: RandomEnemyDTO;
        selectedEnemy?: EnemyDTO;
        allEnemies?: AllEnemiesDTO;
    };
    effects: JsonEffect[];
    currentRound: number;
}
