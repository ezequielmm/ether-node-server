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
    } & Record<string, any>;
}

export interface EffectHandler {
    handle(dto: EffectDTO): Promise<void>;
}

export interface ApplyEffectCollectionDTO {
    client: Socket;
    source: EntityDTO;
    targets: {
        player: PlayerDTO;
        randomEnemy?: RandomEnemyDTO;
        selectedEnemy?: EnemyDTO;
        allEnemies?: AllEnemiesDTO;
    };
    effects: JsonEffect[];
    currentRound: number;
}

export interface ExpeditionTargets {
    player: PlayerDTO;
    randomEnemy: RandomEnemyDTO;
    allEnemies: AllEnemiesDTO;
    selectedEnemy?: EnemyDTO;
}
