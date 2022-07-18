import { Socket } from 'socket.io';
import { CardTargetedEnum } from '../components/card/card.enum';
import { EnemyId } from '../components/enemy/enemy.type';
import { Expedition } from '../components/expedition/expedition.schema';
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
    source: SourceEntityDTO;
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

export interface ApplyAllDTO {
    client: Socket;
    expedition: Expedition;
    source: SourceEntityDTO;
    effects: JsonEffect[];
    selectedEnemy?: EnemyId;
}

export interface ApplyDTO {
    client: Socket;
    expedition: Expedition;
    source: SourceEntityDTO;
    target: TargetEntityDTO;
    effect: JsonEffect;
}

export interface PlayerDTO {
    type: CardTargetedEnum.Player;
    value: {
        globalState: IExpeditionPlayerGlobalState;
        combatState: IExpeditionPlayerCombatState;
    };
}

export interface EnemyDTO {
    type: CardTargetedEnum.Enemy;
    value: IExpeditionCurrentNodeDataEnemy;
}

export interface AllEnemiesDTO {
    type: CardTargetedEnum.AllEnemies;
    value: IExpeditionCurrentNodeDataEnemy[];
}

export interface RandomEnemyDTO {
    type: CardTargetedEnum.RandomEnemy;
    value: IExpeditionCurrentNodeDataEnemy;
}

export type SourceEntityDTO = PlayerDTO | EnemyDTO;
export type TargetEntityDTO = PlayerDTO | EnemyDTO;

export interface FindTargetsDTO {
    expedition: Expedition;
    source: SourceEntityDTO;
    effect: JsonEffect;
    selectedEnemy?: EnemyId;
}

export interface ExtractTargetsDTO {
    expedition: Expedition;
    enemyId?: EnemyId;
}

export interface MutateDTO {
    client: Socket;
    expedition: Expedition;
    source: SourceEntityDTO;
    target: TargetEntityDTO;
    dto: EffectDTO;
    effect: Effect['name'];
}
