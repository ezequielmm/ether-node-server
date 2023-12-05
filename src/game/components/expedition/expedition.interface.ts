import { AttachedStatus, StatusType } from 'src/game/status/interfaces';
import { CardRarityEnum, CardTypeEnum } from '../card/card.enum';
import { Card } from '../card/card.schema';
import {
    EnemyTypeEnum,
    EnemyCategoryEnum,
    EnemySizeEnum,
    EnemyUnique,
} from '../enemy/enemy.enum';
import { EnemyScript } from '../enemy/enemy.interface';
import { Potion } from '../potion/potion.schema';
import { IExpeditionNodeReward } from './expedition.enum';
import { Expedition } from './expedition.schema';

export interface PotionInstance extends Potion {
    id: string;
}

export class IExpeditionPlayerStateDeckCard extends Card {
    id: string;
    isTemporary: boolean;
    oldEnergy?: number;
    originalDescription?: string;
}

export interface IExpeditionCurrentNodeDataEnemy {
    id: string;
    enemyId: number;
    defense: number;
    name: string;
    type: EnemyTypeEnum;
    category: EnemyCategoryEnum;
    size: EnemySizeEnum;
    unique?: EnemyUnique;
    hpCurrent: number;
    hpMax: number;
    line: LinePosition,
    statuses: {
        [StatusType.Buff]: AttachedStatus[];
        [StatusType.Debuff]: AttachedStatus[];
    };
    currentScript?: EnemyScript;
    
    aggressiveness?: number;
    intentCooldowns?: IntentCooldown[];
    backTolifeTimes?: number;
    mossyOriginalShape?: number;
}

export interface IntentCooldown {
    idIntent: number;
    cooldown: number;
}

export enum LinePosition {
    Back  = 0,
    Front = 1
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

export type IExpeditionCurrentNode = Expedition['currentNode'];
export type IExpeditionPlayerGlobalState = Expedition['playerState'];
export type IExpeditionPlayerCombatState =
    IExpeditionCurrentNode['data']['player'];
