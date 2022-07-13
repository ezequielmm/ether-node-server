import { CardTargetedEnum } from '../components/card/card.enum';
import { EnemyId } from '../components/enemy/enemy.type';
import { Effect, EffectDTO } from '../effects/effects.interface';

export enum StatusType {
    Buff = 'buff',
    Debuff = 'debuff',
}

export enum StatusDirection {
    Incoming = 'incoming',
    Outgoing = 'outgoing',
}

export enum StatusStartsAt {
    Instantly = 'instantly',
    NextTurn = 'nextTurn',
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

    /**
     * The status starts at.
     * @type {StatusStartsAt}
     * @memberof Status
     * @property {StatusStartsAt} Instantly - The status starts immediately.
     * @property {StatusStartsAt} NextTurn - The status starts on the next turn.
     * @example 'instantly'
     * @example 'nextTurn'
     */
    startsAt: StatusStartsAt;
}

/**
 * Status metadata
 * It is used to declare the status information in the class metadata.
 */
export interface StatusMetadata {
    status: Status;
    effects: Effect[];
}

/** It is used to declare the status information in the card. */
export interface CardStatus {
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
        addedInRound: number;
    };
}

export interface StatusCollection {
    [StatusType.Buff]: AttachedStatus[];
    [StatusType.Debuff]: AttachedStatus[];
}

export interface StatusDTO<
    T extends Record<string, any> = Record<string, any>,
> {
    args: {
        value: any;
    };
    effectDTO: EffectDTO<T>;
}

export interface IBaseStatus {
    handle(args: StatusDTO): Promise<EffectDTO>;
}

export class AttachStatusToPlayerDTO {
    readonly clientId: string;
    readonly status: CardStatus;
    readonly currentRound: number;
}

export class AttachStatusToEnemyDTO {
    readonly clientId: string;
    readonly status: CardStatus;
    readonly enemyId: EnemyId;
    readonly currentRound: number;
}
