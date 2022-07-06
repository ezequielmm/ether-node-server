import { CardTargetedEnum } from '../components/card/card.enum';
import { EnemyId } from '../components/enemy/enemy.type';
import { EffectName } from '../effects/effects.enum';
import { BaseEffectDTO } from '../effects/effects.interface';

export enum StatusType {
    Buff = 'buff',
    Debuff = 'debuff',
}

export enum StatusDirection {
    Incoming = 'incoming',
    Outgoing = 'outgoing',
}

export interface Status {
    /**
     * The name of the status, used to identify it. It must be unique.
     * @type {string}
     * @memberof Status
     * @example 'resolve'
     * @example 'fortitude'
     * @example 'turtling'
     */
    name: string;
    /**
     * The type of the status.
     * @type {StatusType}
     * @memberof Status
     * @property {StatusType} Buff - The status is a buff.
     * @property {StatusType} Debuff - The status is a debuff.
     */
    type: StatusType;
    /**
     * Effect direction
     * @type {StatusDirection}
     * @memberof Status
     * @property {StatusDirection} Incoming - Incoming effect
     * @property {StatusDirection} Outgoing - Outgoing effect
     */
    direction: StatusDirection;
    // TODO: Add properties related to the behavior. For example if the status starts at the end of the turn, it will be removed at the start of the next turn.
}

/**
 * Status metadata
 * It is used to declare the status information in the class metadata.
 */
export interface StatusMetadata {
    status: Status;
    effects: EffectName[];
}

/** It is used to declare the status information in the card. */
export interface JsonStatus {
    name: string;
    args: {
        value: any;
        attachTo: CardTargetedEnum;
    };
}

/** It is used to declare the status information in the attached target. */
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
