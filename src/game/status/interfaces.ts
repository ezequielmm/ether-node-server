import { CardTargetedEnum } from '../components/card/card.enum';
import { EnemyId } from '../components/enemy/enemy.type';
import { EffectName } from '../effects/effects.enum';
import { BaseEffectDTO } from '../effects/effects.interface';

export enum StatusType {
    Buff = 'buff',
    Debuff = 'debuff',
}

export interface StatusMetadata {
    status: {
        name: string;
        type: StatusType;
    };
    effects: EffectName[];
}

export interface JsonStatus {
    name: string;
    args: {
        value: any;
        targeted: CardTargetedEnum;
    };
}

export interface AttachedStatus {
    name: string;
    args: {
        value: any;
    };
}

export interface EntityStatuses {
    [StatusType.Buff]: AttachedStatus[];
    [StatusType.Debuff]: AttachedStatus[];
}

export interface StatusDTO<T extends BaseEffectDTO = BaseEffectDTO> {
    args: {
        value: any;
    };
    baseEffectDTO: T;
}

export interface IBaseStatus {
    handle(args: StatusDTO): Promise<BaseEffectDTO>;
}

export class AttachStatusToPlayerDTO {
    readonly clientId: string;
    readonly status: JsonStatus;
}

export class AttachStatusToEnemyDTO {
    readonly clientId: string;
    readonly status: JsonStatus;
    readonly enemyId: EnemyId;
}
