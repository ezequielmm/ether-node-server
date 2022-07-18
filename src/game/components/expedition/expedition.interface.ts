import { Socket } from 'socket.io';
import { JsonEffect } from 'src/game/effects/effects.interface';
import {
    AttachedStatus,
    JsonStatus,
    StatusType,
} from 'src/game/status/interfaces';
import {
    CardRarityEnum,
    CardTypeEnum,
    CardKeywordEnum,
    CardTargetedEnum,
} from '../card/card.enum';
import { EnemyScript } from '../enemy/enemy.interface';
import { EnemyId } from '../enemy/enemy.type';
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

export interface IExpeditionPlayerStateDeckCard {
    id: string;
    isTemporary: boolean;
    name: string;
    rarity: CardRarityEnum;
    cardType: CardTypeEnum;
    pool: string;
    energy: number;
    description: string;
    properties: {
        effects: JsonEffect[];
        statuses: JsonStatus[];
    };
    keywords: CardKeywordEnum[];
    showPointer: boolean;
    isUpgraded: boolean;
}

export interface IExpeditionCurrentNodeDataEnemy {
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


