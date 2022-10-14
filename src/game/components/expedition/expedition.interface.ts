import { AttachedStatus, StatusType } from 'src/game/status/interfaces';
import { CardRarityEnum, CardTypeEnum } from '../card/card.enum';
import { Card } from '../card/card.schema';
import {
    EnemyTypeEnum,
    EnemyCategoryEnum,
    EnemySizeEnum,
} from '../enemy/enemy.enum';
import { EnemyScript } from '../enemy/enemy.interface';
import { Potion } from '../potion/potion.schema';
import {
    ExpeditionMapNodeTypeEnum,
    ExpeditionMapNodeStatusEnum,
    IExpeditionNodeReward,
} from './expedition.enum';
import { Expedition } from './expedition.schema';

export interface PotionInstance {
    id: string;
    potion: Potion;
}

export interface IExpeditionPlayerState {
    playerId: string;
    playerName: string;
    characterClass: string;
    hpMax: number;
    hpCurrent: number;
    gold: number;
    potions: PotionInstance[];
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
    readonly private_data: {
        enemies?: {
            enemies: number[];
            probability: number;
        }[];
    };
    readonly state?: {
        enemies?: {
            enemies: number[];
            probability: number;
        }[];
    };
}

export class IExpeditionPlayerStateDeckCard extends Card {
    id: string;
    isTemporary: boolean;
}

export interface IExpeditionCurrentNodeDataEnemy {
    id: string;
    enemyId: number;
    defense: number;
    name: string;
    type: EnemyTypeEnum;
    category: EnemyCategoryEnum;
    size: EnemySizeEnum;
    hpCurrent: number;
    hpMax: number;
    statuses: {
        [StatusType.Buff]: AttachedStatus[];
        [StatusType.Debuff]: AttachedStatus[];
    };
    currentScript?: EnemyScript;
}

export interface BaseReward {
    id: string;
    type: IExpeditionNodeReward;
    taken: boolean;
}

export interface GoldReward extends BaseReward {
    type: IExpeditionNodeReward.Gold;
    amount: number;
}

export interface PotionReward extends BaseReward {
    type: IExpeditionNodeReward.Potion;
    potion: {
        potionId: number;
        name: string;
        description: string;
    };
}

export interface CardPreview {
    cardId: number;
    name: string;
    description: string;
    energy: number;
    rarity: CardRarityEnum;
    type: CardTypeEnum;
    pool: string;
}

export interface CardReward extends BaseReward {
    type: IExpeditionNodeReward.Card;
    card: CardPreview;
}

export type Reward = GoldReward | PotionReward | CardReward;

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
