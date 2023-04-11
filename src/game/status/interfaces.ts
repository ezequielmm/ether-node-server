import { CardTargetedEnum } from '../components/card/card.enum';
import { EnemyId } from '../components/enemy/enemy.type';
import { GameContext, ExpeditionEntity } from '../components/interfaces';
import { Effect, EffectDTO, IActionHint } from '../effects/effects.interface';
import { TargetId } from '../effects/effects.types';

export enum StatusType {
    Buff = 'buff',
    Debuff = 'debuff',
}

export enum StatusDirection {
    Incoming = 'incoming',
    Outgoing = 'outgoing',
}

export enum StatusCounterType {
    Duration = 'duration',
    Counter = 'counter',
    Intensity = 'intensity',
    None = 'none',
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
     * Counter type of the status.
     *
     * @type {StatusCounter}
     *
     * @memberof Status
     *
     * @property {StatusCounter} Duration - The status has a duration counter.
     * @property {StatusCounter} Counter - The status has a counter.
     * @property {StatusCounter} Intensity - The status has an intensity counter.
     * @property {StatusCounter} None - The status does not have a counter.
     *
     * @example 'duration'
     * @example 'counter'
     * @example 'intensity'
     * @example 'none'
     *
     */
    counterType: StatusCounterType;

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

export interface StatusEvent extends StatusBase {
    trigger: StatusTrigger.Event;

    /**
     * The event that triggers the status.
     * @type {string}
     * @memberof Status
     * @see /src/game/constants.ts for available events.
     */
    event: string | string[];
}

export type Status = StatusEffect | StatusEvent;

/**
 * Status metadata
 * It is used to declare the status information in the class metadata.
 */
export interface StatusMetadata<T extends Status = Status> {
    status: T;
}

export type StatusName = string;

export interface StatusArgs extends Record<string, any> {
    counter: number;
    counterDynamic?: string;
    description?: string;
}

/** It is used to declare the status information in the card. */
export interface JsonStatus {
    name: StatusName;
    attachTo: CardTargetedEnum;
    args: StatusArgs;
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
     * @type {EntityReferenceDTO}
     * @memberof AttachedStatus
     * @example { id: '1', type: 'player' }
     * @example { id: '1', type: 'enemy' }
     */
    readonly sourceReference: EntityReferenceDTO;

    args: {
        counter?: number;
        // This is for armored up status
        cardsToAdd?: number[];
        counterDynamic?: string;
    } & Record<string, any>;
}

export interface StatusCollection {
    [StatusType.Buff]: AttachedStatus[];
    [StatusType.Debuff]: AttachedStatus[];
}

export interface StatusEffectDTO<
    T extends Record<string, any> = Record<string, any>,
> {
    readonly ctx: GameContext;
    readonly status: AttachedStatus;
    readonly effectDTO: EffectDTO<T>;
    update(args: AttachedStatus['args']): void;
    remove(): void;
}

export interface StatusEventDTO<Args = Record<string, any>> {
    /**
     * Context
     * @type {GameContext}
     * @memberof StatusEventDTO
     */
    readonly ctx: GameContext;

    /**
     * Event name
     * @type {string}
     * @memberof StatusEventDTO
     * @example 'beforePlayerTurnStart'
     */
    readonly event: string;

    /**
     * Who attached the status.
     * @type {ExpeditionEntity}
     * @memberof StatusEventDTO
     * @example { id: '1', type: 'player' }
     * @example { id: '1', type: 'enemy' }
     */
    readonly source: ExpeditionEntity;

    /**
     * To whom the status was attached.
     * @type {ExpeditionEntity}
     * @memberof StatusEventDTO
     * @example { id: '1', type: 'player' }
     * @example { id: '1', type: 'enemy' }
     */
    readonly target: ExpeditionEntity;

    /**
     * Status information
     * @type {AttachedStatus}
     * @memberof StatusEventDTO
     * @example { name: 'resolve', addedInRound: 1, sourceReference: { id: '1', type: 'player' }, args: { value: 1 } }
     */
    readonly status: AttachedStatus;

    /**
     * Event arguments
     * @type {Args}
     * @memberof StatusEventDTO
     * @example { value: 1 }
     */
    readonly eventArgs: Args;

    update(args: AttachedStatus['args']): void;
    remove(): void;
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
    handle(args: StatusEventDTO): Promise<void>;
}

export type StatusHandler = StatusEffectHandler | StatusEventHandler;

/**
 * DTO for attach set of status.
 */
export interface AttachAllDTO {
    /**
     * Context
     * @type {GameContext}
     * @memberof AttachDTO
     */
    ctx: GameContext;

    /**
     * Set of status to attach.
     * @type {JsonStatus[]}
     * @memberof AttachDTO
     * @example [{ name: 'resolve', args: { value: 1, attachTo: 'player' } }]
     */
    statuses: JsonStatus[];

    /**
     * Source of the action. (Who is attaching the status)
     * @type {ExpeditionEntity}
     * @memberof AttachDTO
     */
    source: ExpeditionEntity;

    /**
     * Preselected target of the action
     * @type {TargetId}
     * @memberof AttachDTO
     * @example '1'
     */
    targetId?: TargetId;
}

export interface AttachDTO {
    ctx: GameContext;
    source: ExpeditionEntity;
    target: ExpeditionEntity;
    statusName: StatusName;
    statusArgs: StatusArgs;
    action?: IActionHint;
}

export interface AttachToPlayerDTO {
    readonly ctx: GameContext;
    readonly sourceReference: EntityReferenceDTO;
    readonly status: JsonStatus;
    readonly currentRound: number;
}

export interface AttachToEnemyDTO {
    readonly ctx: GameContext;
    readonly sourceReference: EntityReferenceDTO;
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

export type EntityReferenceDTO = PlayerReferenceDTO | EnemyReferenceDTO;

export type StatusesGlobalCollection = {
    target: ExpeditionEntity;
    statuses: StatusCollection;
}[];

export interface MutateEffectArgsDTO {
    ctx: GameContext;
    collectionOwner: ExpeditionEntity;
    collection: StatusCollection;
    effect: Effect['name'];
    effectDTO: EffectDTO;
    preview: boolean;
}

export interface BeforeStatusAttachEvent {
    ctx: GameContext;
    source: ExpeditionEntity;
    target: ExpeditionEntity;
    status: {
        name: string;
        args: any;
    };
    targetId: TargetId;
}
