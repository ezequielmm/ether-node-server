import { Prop } from '@typegoose/typegoose';
import { Item } from 'src/game/merchant/merchant.interface';
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
import { Trinket } from '../trinket/trinket.schema';
import {
    ExpeditionMapNodeTypeEnum,
    ExpeditionMapNodeStatusEnum,
    IExpeditionNodeReward,
} from './expedition.enum';
import { Expedition } from './expedition.schema';
import * as Trinkets from '../trinket/collection';

export interface PotionInstance extends Potion {
    id: string;
}

export class Player {
    @Prop()
    playerId: string;

    @Prop()
    playerName: string;

    @Prop()
    characterClass: string;

    @Prop()
    hpMax: number;

    @Prop()
    hpCurrent: number;

    @Prop()
    gold: number;

    @Prop()
    potions: PotionInstance[];

    @Prop({
        type: Trinket,
        discriminators: () => Object.values(Trinkets),
    })
    trinkets: Trinket[];

    @Prop()
    createdAt: Date;

    @Prop()
    cards: IExpeditionPlayerStateDeckCard[];

    @Prop()
    stoppedAt?: Date;

    @Prop()
    cardUpgradeCount: number;

    @Prop()
    cardDestroyCount: number;
}

export interface IExpeditionNode {
    readonly id: number;
    readonly act: number;
    readonly step: number;
    readonly isActive: boolean;
    readonly isDisable: boolean;
    readonly isAvailable: boolean;
    readonly isComplete: boolean;
    type: ExpeditionMapNodeTypeEnum;
    readonly subType: ExpeditionMapNodeTypeEnum;
    readonly status: ExpeditionMapNodeStatusEnum;
    readonly exits: number[];
    readonly enter: number[];
    readonly title?: string;
    readonly private_data: {
        cards?: Item[];
        neutralCards?: Item[];
        trinkets?: Item[];
        potions?: Item[];
        enemies?: {
            enemies: number[];
            probability: number;
        }[];
    };
    readonly state?: {
        treasure?: any;
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

export interface TrinketReward extends BaseReward {
    type: IExpeditionNodeReward.Trinket;
    trinket: {
        trinketId: number;
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

export type Reward = GoldReward | PotionReward | CardReward | TrinketReward;

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