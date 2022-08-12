import { AttachedStatus, StatusType } from 'src/game/status/interfaces';
import { Card } from '../card/card.schema';
import { EnemyScript } from '../enemy/enemy.interface';
import { Enemy } from '../enemy/enemy.schema';
import {
    ExpeditionMapNodeTypeEnum,
    ExpeditionMapNodeStatusEnum,
    IExpeditionNodeReward,
} from './expedition.enum';
import { Expedition } from './expedition.schema';

export interface IExpeditionPlayerState {
    playerId: string;
    playerName: string;
    characterClass: string;
    hpMax: number;
    hpCurrent: number;
    gold: number;
    potions?: [];
    trinkets?: [];
    createdAt: Date;
    cards: IExpeditionPlayerStateDeckCard[];
    stoppedAt?: Date;
}

export interface IExpeditionNode {
    readonly id: number;
    readonly act: number;
    readonly step: number;
    readonly isActive: boolean;
    readonly isDisable: boolean;
    readonly isAvailable: boolean;
    readonly isComplete: boolean;
    readonly type: ExpeditionMapNodeTypeEnum;
    readonly subType: ExpeditionMapNodeTypeEnum;
    readonly status: ExpeditionMapNodeStatusEnum;
    readonly exits: number[];
    readonly enter: number[];
    readonly private_data: any;
    state?: any;
}

export class IExpeditionPlayerStateDeckCard extends Card {
    id: string;
    isTemporary: boolean;
}

export interface IExpeditionCurrentNodeDataEnemy extends Enemy {
    id: string;
    enemyId: number;
    defense: number;
    hpMax: number;
    hpCurrent: number;
    statuses: {
        [StatusType.Buff]: AttachedStatus[];
        [StatusType.Debuff]: AttachedStatus[];
    };
    currentScript?: EnemyScript;
}

export interface IExpeditionReward {
    id: string;
    type: IExpeditionNodeReward;
    amount: number;
    taken: boolean;
}

export interface IExpeditionStatusResponse {
    readonly hasExpedition: boolean;
}

export interface IExpeditionCreatedResponse {
    readonly expeditionCreated: boolean;
}

export interface IExpeditionCancelledResponse {
    readonly canceledExpedition: boolean;
}

export type IExpeditionCurrentNode = Expedition['currentNode'];
export type IExpeditionPlayerGlobalState = Expedition['playerState'];
export type IExpeditionPlayerCombatState =
    IExpeditionCurrentNode['data']['player'];
