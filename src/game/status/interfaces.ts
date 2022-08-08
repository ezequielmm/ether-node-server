import { CardTargetedEnum } from '../components/card/card.enum';
import { EnemyId } from '../components/enemy/enemy.type';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { Context, ExpeditionEntity } from '../components/interfaces';
import { Effect, EffectDTO } from '../effects/effects.interface';
import { TargetId } from '../effects/effects.types';

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

export enum StatusTrigger {
    Effect = 'effect',
    Event = 'event',
}

export interface StatusBase {
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
     * The status starts at.
     * @type {StatusStartsAt}
     * @memberof Status
     * @property {StatusStartsAt} Instantly - The status starts immediately.
     * @property {StatusStartsAt} NextTurn - The status starts on the next turn.
     * @example 'instantly'
     * @example 'nextTurn'
     */
    startsAt: StatusStartsAt;

    /**
     * Trigger of the status.
     * @type {StatusTrigger}
     * @memberof Status
     * @property {StatusTrigger} Effect - The status is triggered by an effect.
     * @property {StatusTrigger} Event - The status is triggered by an event.
     * @example 'effect'
     * @example 'event'
     */
    trigger: StatusTrigger;
}

export interface StatusEffect extends StatusBase {
    trigger: StatusTrigger.Effect;

    /**
     * Effect direction
     * @type {StatusDirection}
     * @memberof Status
     * @property {StatusDirection} Incoming - Incoming effect
     * @property {StatusDirection} Outgoing - Outgoing effect
     */
    direction: StatusDirection;

    /**
     * The effect that triggers the status.
     * @type {Effect}
     * @memberof Status
     * @example 'damage'
     * @example 'heal'
     */
    effects: Effect[];
}

export enum StatusEventType {
    OnPlayerTurnStart = 'onPlayerTurnStart',
    OnEnemyTurnStart = 'onEnemyTurnStart',
    OnTurnEnd = 'onTurnEnd',
    OnBeginCardPlay = 'onBeginCardPlay',
    OnEndCardPlay = 'onEndCardPlay',
    OnAttachStatus = 'onAttachStatus',
}
export interface StatusEvent extends StatusBase {
    trigger: StatusTrigger.Event;

    /**
     * The event that triggers the status.
     * @type {StatusEventType}
     * @memberof Status
     * @property {StatusEventType} OnTurnStart - The status is triggered on the start of the turn.
     * @property {StatusEventType} OnTurnEnd - The status is triggered on the end of the turn.
     * @example 'onTurnStart'
     * @example 'onTurnEnd'
     */
    event: StatusEventType;
}

export type Status = StatusEffect | StatusEvent;

/**
 * Status metadata
 * It is used to declare the status information in the class metadata.
 */
export interface StatusMetadata<T extends Status = Status> {
    status: T;
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
    /**
     * The name of the status, used to identify it. It must be unique.
     * @type {string}
     * @memberof AttachedStatus
     * @example 'resolve'
     */
    readonly name: string;

    /**
     * The number of the round when the status was attached.
     * @type {number}
     * @memberof AttachedStatus
     * @example 1
     */
    readonly addedInRound: number;

    /**
     * The source who attached the status.
     * @type {SourceEntityReferenceDTO}
     * @memberof AttachedStatus
     * @example { id: '1', type: 'player' }
     * @example { id: '1', type: 'enemy' }
     */
    readonly sourceReference: SourceEntityReferenceDTO;

    args: {
        value: any;
    };
}

export interface StatusCollection {
    [StatusType.Buff]: AttachedStatus[];
    [StatusType.Debuff]: AttachedStatus[];
}

export interface StatusEffectDTO<
    T extends Record<string, any> = Record<string, any>,
> {
    readonly ctx: Context;
    readonly status: AttachedStatus;
    readonly effectDTO: EffectDTO<T>;
    update(args: AttachedStatus['args']): void;
    remove(): void;
}

export interface StatusEventDTO<Args = Record<string, any>> {
    readonly ctx: Context;
    readonly source: ExpeditionEntity;
    readonly target: ExpeditionEntity;
    readonly status: AttachedStatus;
    readonly args: Args;
    update(args: AttachedStatus['args']): void;
    remove(): void;
}

export interface OnBeginCardPlayEventArgs {
    card: IExpeditionPlayerStateDeckCard;
    cardSource: ExpeditionEntity;
    cardSourceReference: SourceEntityReferenceDTO;
    cardTargetId: TargetId;
}

/**
 * Status effect handler.
 * It is used to handle the dto of the effect.
 * It is called when the effect declared in the metadata
 * is applied to the target.
 */
export interface StatusEffectHandler {
    preview(args: StatusEffectDTO): Promise<EffectDTO>;
    handle(args: StatusEffectDTO): Promise<EffectDTO>;
}

/**
 * Status event handler.
 * It is used to handle an event.
 * It is called when the event declared in the metadata is triggered.
 */
export interface StatusEventHandler {
    // TODO: Define the args
    enemyHandler(args: StatusEventDTO): Promise<any>;
}

export interface OnAttachStatusEventArgs {
    status: JsonStatus;
    targetId: TargetId;
}

export type StatusHandler = StatusEffectHandler | StatusEventHandler;

export interface AttachDTO {
    ctx: Context;
    statuses: JsonStatus[];
    currentRound: number;
    sourceReference: SourceEntityReferenceDTO;
    targetId?: TargetId;
}

export interface AttachToPlayerDTO {
    readonly ctx: Context;
    readonly sourceReference: SourceEntityReferenceDTO;
    readonly status: JsonStatus;
    readonly currentRound: number;
}

export interface AttachToEnemyDTO {
    readonly ctx: Context;
    readonly sourceReference: SourceEntityReferenceDTO;
    readonly status: JsonStatus;
    readonly enemyId: EnemyId;
    readonly currentRound: number;
}

export interface PlayerReferenceDTO {
    type: CardTargetedEnum.Player;
}

export interface EnemyReferenceDTO {
    type: CardTargetedEnum.Enemy;
    id: EnemyId;
}

export type SourceEntityReferenceDTO = PlayerReferenceDTO | EnemyReferenceDTO;

export type StatusesGlobalCollection = {
    target: ExpeditionEntity;
    statuses: StatusCollection;
}[];

export interface MutateEffectArgsDTO {
    ctx: Context;
    collectionOwner: ExpeditionEntity;
    collection: StatusCollection;
    effect: Effect['name'];
    effectDTO: EffectDTO;
    preview: boolean;
}
