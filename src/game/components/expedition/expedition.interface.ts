import { AttachedStatus, StatusType } from 'src/game/status/interfaces';
import { Card } from '../card/card.schema';
import { Enemy } from '../enemy/enemy.schema';
import {
    ExpeditionMapNodeTypeEnum,
    ExpeditionMapNodeStatusEnum,
} from './expedition.enum';
import { Expedition } from './expedition.schema';

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

export interface IExpeditionPlayerStateDeckCard extends Card {
    id: string;
    isTemporary: boolean;
}

export interface IExpeditionCurrentNodeDataEnemy extends Enemy {
    id: string;
    defense: number;
    statuses: {
        [StatusType.Buff]: AttachedStatus[];
        [StatusType.Debuff]: AttachedStatus[];
    };
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
